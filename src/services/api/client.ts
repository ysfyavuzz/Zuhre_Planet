/**
 * API Client Configuration
 * 
 * @module services/api/client
 * @category API Services
 * 
 * Axios-based HTTP client with interceptors for:
 * - Authentication token injection
 * - Error handling and retry logic
 * - Request/response logging (dev only)
 * - Base URL configuration
 * 
 * @example
 * ```typescript
 * import { apiClient } from './client';
 * 
 * const response = await apiClient.get('/users');
 * ```
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * API configuration from environment variables
 */
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  enableRealAPI: import.meta.env.VITE_ENABLE_REAL_API === 'true',
  isDev: import.meta.env.DEV,
};

/**
 * Token storage key
 */
const TOKEN_STORAGE_KEY = 'auth_token';
const REFRESH_TOKEN_STORAGE_KEY = 'refresh_token';

/**
 * Get authentication token from storage
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

/**
 * Set authentication token to storage
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

/**
 * Remove authentication token from storage
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
};

/**
 * Get refresh token from storage
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
};

/**
 * Set refresh token to storage
 */
export const setRefreshToken = (token: string): void => {
  localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
};

/**
 * Create Axios instance
 */
const createApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  /**
   * Request interceptor
   * - Inject auth token
   * - Log requests in dev mode
   */
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Inject auth token
      const token = getAuthToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Log in dev mode
      if (API_CONFIG.isDev) {
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
          params: config.params,
          data: config.data,
        });
      }

      return config;
    },
    (error) => {
      if (API_CONFIG.isDev) {
        console.error('[API Request Error]', error);
      }
      return Promise.reject(error);
    }
  );

  /**
   * Response interceptor
   * - Handle errors
   * - Log responses in dev mode
   * - Retry on network errors
   */
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log in dev mode
      if (API_CONFIG.isDev) {
        console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
          status: response.status,
          data: response.data,
        });
      }

      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

      // Log error in dev mode
      if (API_CONFIG.isDev) {
        console.error('[API Response Error]', {
          url: error.config?.url,
          status: error.response?.status,
          message: error.message,
          data: error.response?.data,
        });
      }

      // Handle 401 Unauthorized - try to refresh token
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = getRefreshToken();
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          // Attempt to refresh token
          const response = await axios.post(`${API_CONFIG.baseURL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data;
          setAuthToken(accessToken);

          // Retry original request
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return instance(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          removeAuthToken();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      // Handle network errors with retry
      if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
        if (!originalRequest._retry) {
          originalRequest._retry = true;
          // Wait 1 second before retry
          await new Promise(resolve => setTimeout(resolve, 1000));
          return instance(originalRequest);
        }
      }

      // Transform error to user-friendly message
      const errorMessage = getErrorMessage(error);
      return Promise.reject(new Error(errorMessage));
    }
  );

  return instance;
};

/**
 * Extract user-friendly error message from API error
 */
const getErrorMessage = (error: AxiosError): string => {
  if (error.response) {
    // Server responded with error status
    const data = error.response.data as { message?: string; error?: string };
    return data.message || data.error || 'Bir hata oluştu';
  } else if (error.request) {
    // Request made but no response
    return 'Sunucuya ulaşılamıyor. Lütfen internet bağlantınızı kontrol edin.';
  } else {
    // Error in request setup
    return error.message || 'Beklenmeyen bir hata oluştu';
  }
};

/**
 * Main API client instance
 */
export const apiClient = createApiClient();

/**
 * Check if real API is enabled
 */
export const isRealApiEnabled = (): boolean => {
  return API_CONFIG.enableRealAPI;
};

/**
 * API error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Type guard for API errors
 */
export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
};
