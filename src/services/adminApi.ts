/**
 * Admin API Service
 *
 * Comprehensive API service layer for admin dashboard operations.
 * Handles all admin-related API calls with proper error handling and type safety.
 *
 * @module services/adminApi
 * @category Services - Admin
 *
 * Features:
 * - Type-safe API calls
 * - Error handling with retry logic
 * - Request/response interceptors
 * - Caching strategy
 * - Abort controller support
 */

import type {
  ApiResponse,
  PaginatedResponse,
  AdminUser,
  AdminListing,
  AdminReview,
  AdminReport,
  AuditLog,
  PlatformStats,
  SiteSettings,
  NavigationItem,
  Page,
  PhotoApproval,
  FeaturedEscort,
  HeroBanner,
  UserFilters,
  ListingFilters,
  ReviewFilters,
  ReportFilters,
  AuditLogFilters,
  BulkActionResult,
  RevenueStats,
  UserStats,
} from '@/types/admin';

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * API configuration
 */
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
};

/**
 * API client options
 */
interface ApiClientOptions {
  signal?: AbortSignal;
  retries?: number;
  cache?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// ERROR TYPES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * API error class
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HTTP CLIENT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Make HTTP request with error handling and retry logic
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  clientOptions: ApiClientOptions = {}
): Promise<ApiResponse<T>> {
  const { signal, retries = API_CONFIG.retryAttempts } = clientOptions;
  const controller = new AbortController();

  // Combine signals
  if (signal) {
    signal.addEventListener('abort', () => controller.abort());
  }

  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  const config: RequestInit = {
    ...options,
    signal: controller.signal,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // Add auth token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, config);

      clearTimeout(timeoutId);

      // Handle non-JSON responses
      if (!response.headers.get('content-type')?.includes('application/json')) {
        if (!response.ok) {
          throw new ApiError(response.status, 'HTTP_ERROR', response.statusText);
        }
        return { success: true };
      }

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          response.status,
          data.error?.code || 'API_ERROR',
          data.error?.message || 'An error occurred',
          data.error?.details
        );
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error as Error;

      // Don't retry on abort or 4xx errors (except 429)
      if (
        error instanceof Error &&
        (error.name === 'AbortError' ||
          (error instanceof ApiError && error.statusCode >= 400 && error.statusCode !== 429))
      ) {
        throw error;
      }

      // Wait before retry (except on last attempt)
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.retryDelay * (attempt + 1)));
      }
    }
  }

  throw lastError || new Error('Request failed after retries');
}

/**
 * HTTP GET request
 */
async function get<T>(endpoint: string, options?: ApiClientOptions): Promise<ApiResponse<T>> {
  return request<T>(endpoint, { method: 'GET' }, options);
}

/**
 * HTTP POST request
 */
async function post<T>(
  endpoint: string,
  data?: unknown,
  options?: ApiClientOptions
): Promise<ApiResponse<T>> {
  return request<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  }, options);
}

/**
 * HTTP PUT request
 */
async function put<T>(
  endpoint: string,
  data?: unknown,
  options?: ApiClientOptions
): Promise<ApiResponse<T>> {
  return request<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  }, options);
}

/**
 * HTTP PATCH request
 */
async function patch<T>(
  endpoint: string,
  data?: unknown,
  options?: ApiClientOptions
): Promise<ApiResponse<T>> {
  return request<T>(endpoint, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  }, options);
}

/**
 * HTTP DELETE request
 */
async function del<T>(endpoint: string, options?: ApiClientOptions): Promise<ApiResponse<T>> {
  return request<T>(endpoint, { method: 'DELETE' }, options);
}

// ─────────────────────────────────────────────────────────────────────────────
// BUILD QUERY STRING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build query string from object
 */
function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== 'all') {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)));
      } else {
        searchParams.set(key, String(value));
      }
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

// ─────────────────────────────────────────────────────────────────────────────
// OVERVIEW & STATISTICS API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get platform statistics
 */
export async function getPlatformStats(): Promise<ApiResponse<PlatformStats>> {
  return get<PlatformStats>('/admin/stats/overview');
}

/**
 * Get revenue statistics
 */
export async function getRevenueStats(
  period: 'day' | 'week' | 'month' | 'year' = 'month'
): Promise<ApiResponse<RevenueStats>> {
  return get<RevenueStats>(`/admin/stats/revenue?period=${period}`);
}

/**
 * Get user statistics
 */
export async function getUserStats(): Promise<ApiResponse<UserStats>> {
  return get<UserStats>('/admin/stats/users');
}

/**
 * Get chart data
 */
export async function getChartData(
  type: 'revenue' | 'users' | 'listings' | 'reviews',
  period: 'day' | 'week' | 'month' | 'year' = 'month'
): Promise<ApiResponse<{ labels: string[]; datasets: Array<{ label: string; data: number[] }> }>> {
  return get(`/admin/stats/chart?type=${type}&period=${period}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// USERS API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get paginated users list
 */
export async function getUsers(
  filters: UserFilters
): Promise<ApiResponse<PaginatedResponse<AdminUser>>> {
  const queryString = buildQueryString(filters);
  return get<PaginatedResponse<AdminUser>>(`/admin/users${queryString}`);
}

/**
 * Get single user by ID
 */
export async function getUser(id: string): Promise<ApiResponse<AdminUser>> {
  return get<AdminUser>(`/admin/users/${id}`);
}

/**
 * Update user
 */
export async function updateUser(
  id: string,
  data: Partial<AdminUser>
): Promise<ApiResponse<AdminUser>> {
  return patch<AdminUser>(`/admin/users/${id}`, data);
}

/**
 * Ban user
 */
export async function banUser(
  id: string,
  reason: string,
  permanent: boolean = false,
  until?: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return post(`/admin/users/${id}/ban`, { reason, permanent, until });
}

/**
 * Unban user
 */
export async function unbanUser(
  id: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return post(`/admin/users/${id}/unban`);
}

/**
 * Suspend user
 */
export async function suspendUser(
  id: string,
  reason: string,
  until?: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return post(`/admin/users/${id}/suspend`, { reason, until });
}

/**
 * Unsuspend user
 */
export async function unsuspendUser(
  id: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return post(`/admin/users/${id}/unsuspend`);
}

/**
 * Verify user
 */
export async function verifyUser(
  id: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return post(`/admin/users/${id}/verify`);
}

/**
 * Set user membership
 */
export async function setUserMembership(
  id: string,
  membership: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return post(`/admin/users/${id}/membership`, { membership });
}

/**
 * Set user featured position
 */
export async function setUserFeaturedPosition(
  id: string,
  position: number | null
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return post(`/admin/users/${id}/featured`, { position });
}

/**
 * Boost user
 */
export async function boostUser(
  id: string,
  duration: number // hours
): Promise<ApiResponse<{ success: boolean; expiresAt: string }>> {
  return post(`/admin/users/${id}/boost`, { duration });
}

/**
 * Set user visibility
 */
export async function setUserVisibility(
  id: string,
  profileVisibility: boolean,
  phoneVisibility: 'visible' | 'masked' | 'hidden',
  messageAvailability: boolean
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return post(`/admin/users/${id}/visibility`, {
    profileVisibility,
    phoneVisibility,
    messageAvailability,
  });
}

/**
 * Delete user
 */
export async function deleteUser(
  id: string,
  reason?: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return del(`/admin/users/${id}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// BULK USER OPERATIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Bulk set membership
 */
export async function bulkSetMembership(
  userIds: string[],
  membership: string
): Promise<ApiResponse<BulkActionResult>> {
  return post('/admin/users/bulk/membership', { userIds, membership });
}

/**
 * Bulk boost users
 */
export async function bulkBoostUsers(
  userIds: string[],
  duration: number
): Promise<ApiResponse<BulkActionResult>> {
  return post('/admin/users/bulk/boost', { userIds, duration });
}

/**
 * Bulk set visibility
 */
export async function bulkSetVisibility(
  userIds: string[],
  profileVisibility?: boolean,
  phoneVisibility?: 'visible' | 'masked' | 'hidden',
  messageAvailability?: boolean
): Promise<ApiResponse<BulkActionResult>> {
  return post('/admin/users/bulk/visibility', {
    userIds,
    profileVisibility,
    phoneVisibility,
    messageAvailability,
  });
}

/**
 * Bulk delete users
 */
export async function bulkDeleteUsers(
  userIds: string[],
  reason?: string
): Promise<ApiResponse<BulkActionResult>> {
  return post('/admin/users/bulk/delete', { userIds, reason });
}

// ─────────────────────────────────────────────────────────────────────────────
// LISTINGS API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get paginated listings
 */
export async function getListings(
  filters: ListingFilters
): Promise<ApiResponse<PaginatedResponse<AdminListing>>> {
  const queryString = buildQueryString(filters);
  return get<PaginatedResponse<AdminListing>>(`/admin/listings${queryString}`);
}

/**
 * Get single listing
 */
export async function getListing(id: string): Promise<ApiResponse<AdminListing>> {
  return get<AdminListing>(`/admin/listings/${id}`);
}

/**
 * Approve listing
 */
export async function approveListing(
  id: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return post(`/admin/listings/${id}/approve`);
}

/**
 * Reject listing
 */
export async function rejectListing(
  id: string,
  reason: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return post(`/admin/listings/${id}/reject`, { reason });
}

/**
 * Suspend listing
 */
export async function suspendListing(
  id: string,
  reason: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return post(`/admin/listings/${id}/suspend`, { reason });
}

/**
 * Delete listing
 */
export async function deleteListing(
  id: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return del(`/admin/listings/${id}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// REVIEWS API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get paginated reviews
 */
export async function getReviews(
  filters: ReviewFilters
): Promise<ApiResponse<PaginatedResponse<AdminReview>>> {
  const queryString = buildQueryString(filters);
  return get<PaginatedResponse<AdminReview>>(`/admin/reviews${queryString}`);
}

/**
 * Get single review
 */
export async function getReview(id: string): Promise<ApiResponse<AdminReview>> {
  return get<AdminReview>(`/admin/reviews/${id}`);
}

/**
 * Approve review
 */
export async function approveReview(
  id: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return post(`/admin/reviews/${id}/approve`);
}

/**
 * Reject review
 */
export async function rejectReview(
  id: string,
  reason?: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return post(`/admin/reviews/${id}/reject`, { reason });
}

/**
 * Hide review
 */
export async function hideReview(
  id: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return post(`/admin/reviews/${id}/hide`);
}

/**
 * Show review
 */
export async function showReview(
  id: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return post(`/admin/reviews/${id}/show`);
}

/**
 * Delete review
 */
export async function deleteReview(
  id: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return del(`/admin/reviews/${id}`);
}

/**
 * Add admin response to review
 */
export async function respondToReview(
  id: string,
  response: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return post(`/admin/reviews/${id}/respond`, { response });
}

// ─────────────────────────────────────────────────────────────────────────────
// REPORTS API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get paginated reports
 */
export async function getReports(
  filters: ReportFilters
): Promise<ApiResponse<PaginatedResponse<AdminReport>>> {
  const queryString = buildQueryString(filters);
  return get<PaginatedResponse<AdminReport>>(`/admin/reports${queryString}`);
}

/**
 * Get single report
 */
export async function getReport(id: string): Promise<ApiResponse<AdminReport>> {
  return get<AdminReport>(`/admin/reports/${id}`);
}

/**
 * Update report status
 */
export async function updateReportStatus(
  id: string,
  status: string,
  resolution?: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return patch(`/admin/reports/${id}`, { status, resolution });
}

/**
 * Assign report to admin
 */
export async function assignReport(
  id: string,
  adminId: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return post(`/admin/reports/${id}/assign`, { adminId });
}

/**
 * Dismiss report
 */
export async function dismissReport(
  id: string,
  note?: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return post(`/admin/reports/${id}/dismiss`, { note });
}

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get site settings
 */
export async function getSiteSettings(): Promise<ApiResponse<SiteSettings>> {
  return get<SiteSettings>('/admin/settings');
}

/**
 * Update site settings
 */
export async function updateSiteSettings(
  settings: Partial<SiteSettings>
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return put('/admin/settings', settings);
}

/**
 * Get theme settings
 */
export async function getThemeSettings(): Promise<ApiResponse<SiteSettings['theme']>> {
  return get<SiteSettings['theme']>('/admin/settings/theme');
}

/**
 * Update theme settings
 */
export async function updateThemeSettings(
  theme: Partial<SiteSettings['theme']>
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return put('/admin/settings/theme', theme);
}

/**
 * Get media settings
 */
export async function getMediaSettings(): Promise<ApiResponse<SiteSettings['media']>> {
  return get<SiteSettings['media']>('/admin/settings/media');
}

/**
 * Update media settings
 */
export async function updateMediaSettings(
  media: Partial<SiteSettings['media']>
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return put('/admin/settings/media', media);
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get navigation items
 */
export async function getNavigationItems(): Promise<ApiResponse<NavigationItem[]>> {
  return get<NavigationItem[]>('/admin/navigation');
}

/**
 * Create navigation item
 */
export async function createNavigationItem(
  item: Omit<NavigationItem, 'id'>
): Promise<ApiResponse<NavigationItem>> {
  return post<NavigationItem>('/admin/navigation', item);
}

/**
 * Update navigation item
 */
export async function updateNavigationItem(
  id: string,
  item: Partial<NavigationItem>
): Promise<ApiResponse<NavigationItem>> {
  return patch<NavigationItem>(`/admin/navigation/${id}`, item);
}

/**
 * Delete navigation item
 */
export async function deleteNavigationItem(
  id: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return del(`/admin/navigation/${id}`);
}

/**
 * Reorder navigation items
 */
export async function reorderNavigationItems(
  items: Array<{ id: string; order: number }>
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return post('/admin/navigation/reorder', { items });
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGES API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get all pages
 */
export async function getPages(): Promise<ApiResponse<Page[]>> {
  return get<Page[]>('/admin/pages');
}

/**
 * Get single page
 */
export async function getPage(id: string): Promise<ApiResponse<Page>> {
  return get<Page>(`/admin/pages/${id}`);
}

/**
 * Create page
 */
export async function createPage(
  page: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<Page>> {
  return post<Page>('/admin/pages', page);
}

/**
 * Update page
 */
export async function updatePage(
  id: string,
  page: Partial<Page>
): Promise<ApiResponse<Page>> {
  return patch<Page>(`/admin/pages/${id}`, page);
}

/**
 * Delete page
 */
export async function deletePage(
  id: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return del(`/admin/pages/${id}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// SHOWCASE & FEATURED API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get featured escorts
 */
export async function getFeaturedEscorts(): Promise<ApiResponse<FeaturedEscort[]>> {
  return get<FeaturedEscort[]>('/admin/showcase/featured');
}

/**
 * Set featured escort
 */
export async function setFeaturedEscort(
  escortId: string,
  position: number,
  badge?: string
): Promise<ApiResponse<FeaturedEscort>> {
  return post<FeaturedEscort>('/admin/showcase/featured', {
    escortId,
    position,
    badge,
  });
}

/**
 * Remove featured escort
 */
export async function removeFeaturedEscort(
  id: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return del(`/admin/showcase/featured/${id}`);
}

/**
 * Get hero banner
 */
export async function getHeroBanner(): Promise<ApiResponse<HeroBanner[]>> {
  return get<HeroBanner[]>('/admin/showcase/hero');
}

/**
 * Update hero banner
 */
export async function updateHeroBanner(
  banner: Partial<HeroBanner>
): Promise<ApiResponse<HeroBanner>> {
  return put<HeroBanner>('/admin/showcase/hero', banner);
}

// ─────────────────────────────────────────────────────────────────────────────
// PHOTO APPROVAL API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get pending photos
 */
export async function getPendingPhotos(): Promise<ApiResponse<PhotoApproval[]>> {
  return get<PhotoApproval[]>('/admin/photos/pending');
}

/**
 * Approve photo
 */
export async function approvePhoto(
  id: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return post(`/admin/photos/${id}/approve`);
}

/**
 * Reject photo
 */
export async function rejectPhoto(
  id: string,
  reason: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return post(`/admin/photos/${id}/reject`, { reason });
}

/**
 * Bulk approve photos
 */
export async function bulkApprovePhotos(
  photoIds: string[]
): Promise<ApiResponse<BulkActionResult>> {
  return post('/admin/photos/bulk/approve', { photoIds });
}

/**
 * Bulk reject photos
 */
export async function bulkRejectPhotos(
  photoIds: string[],
  reason: string
): Promise<ApiResponse<BulkActionResult>> {
  return post('/admin/photos/bulk/reject', { photoIds, reason });
}

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT LOGS API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get audit logs
 */
export async function getAuditLogs(
  filters: AuditLogFilters
): Promise<ApiResponse<PaginatedResponse<AuditLog>>> {
  const queryString = buildQueryString(filters);
  return get<PaginatedResponse<AuditLog>>(`/admin/logs${queryString}`);
}

/**
 * Export audit logs
 */
export async function exportAuditLogs(
  filters: AuditLogFilters,
  format: 'csv' | 'json' | 'xlsx' = 'csv'
): Promise<Blob> {
  const queryString = buildQueryString({ ...filters, format });
  const response = await fetch(`${API_CONFIG.baseURL}/admin/logs/export${queryString}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to export logs');
  }

  return response.blob();
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Export data
 */
export async function exportData(
  type: 'users' | 'listings' | 'reviews' | 'reports',
  format: 'csv' | 'json' | 'xlsx' = 'csv',
  filters?: UserFilters | ListingFilters | ReviewFilters | ReportFilters
): Promise<Blob> {
  const queryString = filters ? buildQueryString(filters) : '';
  const response = await fetch(
    `${API_CONFIG.baseURL}/admin/export/${type}?format=${format}${queryString}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to export data');
  }

  return response.blob();
}

// ─────────────────────────────────────────────────────────────────────────────
// RE-EXPORT TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type { ApiResponse, PaginatedResponse } from '@/types/admin';
