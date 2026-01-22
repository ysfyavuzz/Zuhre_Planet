/**
 * Authentication API Service
 * 
 * @module services/api/auth
 * @category API Services
 * 
 * Handles all authentication-related API calls:
 * - User login and registration
 * - Password reset and recovery
 * - Token refresh
 * - User profile management
 * 
 * @example
 * ```typescript
 * import { authService } from './auth';
 * 
 * const user = await authService.login('user@example.com', 'password');
 * ```
 */

import { apiClient, setAuthToken, setRefreshToken, removeAuthToken } from './client';

/**
 * User types
 */
export type UserRole = 'client' | 'escort' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  verified: boolean;
  createdAt: string;
}

/**
 * Authentication request/response types
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: UserRole;
  termsAccepted: boolean;
}

export interface RegisterResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * Authentication Service
 */
export const authService = {
  /**
   * Login user
   * 
   * @param email - User email
   * @param password - User password
   * @returns User data and tokens
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      email,
      password,
    });

    // Store tokens
    setAuthToken(response.data.accessToken);
    setRefreshToken(response.data.refreshToken);

    return response.data;
  },

  /**
   * Register new user
   * 
   * @param data - Registration data
   * @returns User data and tokens
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>('/auth/register', data);

    // Store tokens
    setAuthToken(response.data.accessToken);
    setRefreshToken(response.data.refreshToken);

    return response.data;
  },

  /**
   * Logout user
   * 
   * Removes tokens from storage and calls logout endpoint
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      removeAuthToken();
    }
  },

  /**
   * Get current user profile
   * 
   * @returns Current user data
   */
  async me(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  /**
   * Refresh access token
   * 
   * @param refreshToken - Refresh token
   * @returns New access and refresh tokens
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {
      refreshToken,
    });

    // Update tokens
    setAuthToken(response.data.accessToken);
    setRefreshToken(response.data.refreshToken);

    return response.data;
  },

  /**
   * Request password reset
   * 
   * @param email - User email
   */
  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/auth/forgot-password', { email });
  },

  /**
   * Reset password with token
   * 
   * @param token - Reset token
   * @param password - New password
   */
  async resetPassword(token: string, password: string): Promise<void> {
    await apiClient.post('/auth/reset-password', {
      token,
      password,
    });
  },

  /**
   * Verify email with token
   * 
   * @param token - Verification token
   */
  async verifyEmail(token: string): Promise<void> {
    await apiClient.post('/auth/verify-email', { token });
  },

  /**
   * Resend verification email
   */
  async resendVerification(): Promise<void> {
    await apiClient.post('/auth/resend-verification');
  },

  /**
   * Update user profile
   * 
   * @param data - Profile data to update
   * @returns Updated user data
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.patch<User>('/auth/profile', data);
    return response.data;
  },

  /**
   * Change password
   * 
   * @param currentPassword - Current password
   * @param newPassword - New password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },

  /**
   * Delete account
   * 
   * @param password - User password for confirmation
   */
  async deleteAccount(password: string): Promise<void> {
    await apiClient.post('/auth/delete-account', { password });
    removeAuthToken();
  },
};

export default authService;
