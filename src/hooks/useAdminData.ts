/**
 * Admin Data Hooks
 *
 * Custom React hooks for fetching and managing admin data.
 * Provides loading states, error handling, and caching.
 *
 * @module hooks/useAdminData
 * @category Hooks - Admin
 *
 * Features:
 * - Automatic loading states
 * - Error handling with toast notifications
 * - Data caching with cache invalidation
 * - Automatic refetching on interval
 * - Pagination support
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import type {
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
  UserFilters,
  ListingFilters,
  ReviewFilters,
  ReportFilters,
  AuditLogFilters,
  PaginatedResponse,
} from '@/types/admin';
import * as adminApi from '@/services/adminApi';

// ─────────────────────────────────────────────────────────────────────────────
// GENERIC DATA FETCHING HOOK
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use fetch data hook with loading, error, and refetch
 */
interface UseFetchDataResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Generic data fetching hook
 */
function useFetchData<T>(
  fetchFn: () => Promise<adminApi.ApiResponse<T>>,
  options: {
    refetchInterval?: number;
    refetchOnWindowFocus?: boolean;
    showToastOnError?: boolean;
    onSuccess?: (data: T) => void;
    deps?: unknown[];
  } = {}
): UseFetchDataResult<T> {
  const {
    refetchInterval,
    refetchOnWindowFocus = true,
    showToastOnError = true,
    onSuccess,
    deps = [],
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasMountedRef = useRef(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchFn();

      if (response.success && response.data) {
        setData(response.data);
        onSuccess?.(response.data);
      } else if (response.error) {
        setError(response.error.message);
        if (showToastOnError) {
          toast.error(response.error.message);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Bir hata oluştu';
      setError(message);
      if (showToastOnError) {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, showToastOnError, onSuccess]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      fetchData();
      hasMountedRef.current = true;
    }
  }, [fetchData, ...deps]);

  // Auto refetch on interval
  useEffect(() => {
    if (refetchInterval && hasMountedRef.current) {
      const interval = setInterval(fetchData, refetchInterval);
      return () => clearInterval(interval);
    }
  }, [refetchInterval, fetchData]);

  // Refetch on window focus
  useEffect(() => {
    if (refetchOnWindowFocus && hasMountedRef.current) {
      const handleFocus = () => fetchData();
      window.addEventListener('focus', handleFocus);
      return () => window.removeEventListener('focus', handleFocus);
    }
  }, [refetchOnWindowFocus, fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGINATED DATA HOOK
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use paginated data hook
 */
export interface UsePaginatedDataResult<T> {
  data: T[];
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  totalPages: number;
  refetch: () => Promise<void>;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  /** Aliased as data for backward compatibility */
  items: T[];
}

export function usePaginatedData<T>(
  fetchFn: (filters: Record<string, unknown>) => Promise<adminApi.ApiResponse<PaginatedResponse<T>>>,
  initialFilters: Record<string, unknown> = {},
  options: {
    refetchInterval?: number;
    showToastOnError?: boolean;
  } = {}
): UsePaginatedDataResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialFilters.page as number || 1);
  const [limit, setLimit] = useState(initialFilters.limit as number || 20);
  const [hasMore, setHasMore] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState(initialFilters);
  const hasMountedRef = useRef(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchFn({ ...filters, page, limit });

      if (response.success && response.data) {
        setData(response.data.items);
        setTotal(response.data.total);
        setHasMore(response.data.hasMore);
        setTotalPages(response.data.totalPages);
      } else if (response.error) {
        setError(response.error.message);
        if (options.showToastOnError) {
          toast.error(response.error.message);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Bir hata oluştu';
      setError(message);
      if (options.showToastOnError) {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, filters, page, limit, options.showToastOnError]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      fetchData();
      hasMountedRef.current = true;
    }
  }, [fetchData]);

  // Auto refetch
  useEffect(() => {
    if (options.refetchInterval && hasMountedRef.current) {
      const interval = setInterval(fetchData, options.refetchInterval);
      return () => clearInterval(interval);
    }
  }, [options.refetchInterval, fetchData]);

  const nextPage = useCallback(() => {
    if (hasMore) {
      setPage(p => p + 1);
    }
  }, [hasMore]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(p => p - 1);
    }
  }, [page]);

  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  return {
    data,
    items: data,
    isLoading,
    error,
    total,
    page,
    limit,
    hasMore,
    totalPages,
    refetch: fetchData,
    nextPage,
    prevPage,
    goToPage,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// STATS & OVERVIEW HOOKS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use platform stats hook
 */
export function usePlatformStats(refetchInterval?: number) {
  return useFetchData<PlatformStats>(
    () => adminApi.getPlatformStats(),
    { refetchInterval }
  );
}

/**
 * Use revenue stats hook
 */
export function useRevenueStats(period: 'day' | 'week' | 'month' | 'year' = 'month') {
  return useFetchData(
    () => adminApi.getRevenueStats(period),
    { deps: [period] }
  );
}

/**
 * Use user stats hook
 */
export function useUserStats() {
  return useFetchData(
    () => adminApi.getUserStats()
  );
}

/**
 * Use chart data hook
 */
export function useChartData(
  type: 'revenue' | 'users' | 'listings' | 'reviews',
  period: 'day' | 'week' | 'month' | 'year' = 'month'
) {
  return useFetchData(
    () => adminApi.getChartData(type, period),
    { deps: [type, period] }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// USERS HOOKS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use users list hook
 */
export function useUsers(filters: UserFilters = {}) {
  return usePaginatedData(
    (f) => adminApi.getUsers(f as UserFilters),
    filters,
    { showToastOnError: true }
  );
}

/**
 * Use single user hook
 */
export function useUser(id: string) {
  return useFetchData(
    () => adminApi.getUser(id),
    { deps: [id] }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LISTINGS HOOKS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use listings hook
 */
export function useListings(filters: ListingFilters = {}) {
  return usePaginatedData(
    (f) => adminApi.getListings(f as ListingFilters),
    filters,
    { showToastOnError: true }
  );
}

/**
 * Use single listing hook
 */
export function useListing(id: string) {
  return useFetchData(
    () => adminApi.getListing(id),
    { deps: [id] }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REVIEWS HOOKS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use reviews hook
 */
export function useReviews(filters: ReviewFilters = {}) {
  return usePaginatedData(
    (f) => adminApi.getReviews(f as ReviewFilters),
    filters,
    { showToastOnError: true }
  );
}

/**
 * Use single review hook
 */
export function useReview(id: string) {
  return useFetchData(
    () => adminApi.getReview(id),
    { deps: [id] }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REPORTS HOOKS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use reports hook
 */
export function useReports(filters: ReportFilters = {}) {
  return usePaginatedData(
    (f) => adminApi.getReports(f as ReportFilters),
    filters,
    { showToastOnError: true }
  );
}

/**
 * Use single report hook
 */
export function useReport(id: string) {
  return useFetchData(
    () => adminApi.getReport(id),
    { deps: [id] }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS HOOKS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use site settings hook
 */
export function useSiteSettings() {
  return useFetchData<SiteSettings>(
    () => adminApi.getSiteSettings()
  );
}

/**
 * Use theme settings hook
 */
export function useThemeSettings() {
  return useFetchData<SiteSettings['theme']>(
    () => adminApi.getThemeSettings()
  );
}

/**
 * Use media settings hook
 */
export function useMediaSettings() {
  return useFetchData<SiteSettings['media']>(
    () => adminApi.getMediaSettings()
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION HOOKS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use navigation items hook
 */
export function useNavigationItems() {
  return useFetchData<NavigationItem[]>(
    () => adminApi.getNavigationItems()
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGES HOOKS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use pages hook
 */
export function usePages() {
  return useFetchData<Page[]>(
    () => adminApi.getPages()
  );
}

/**
 * Use single page hook
 */
export function usePage(id: string) {
  return useFetchData(
    () => adminApi.getPage(id),
    { deps: [id] }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHOWCASE & FEATURED HOOKS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use featured escorts hook
 */
export function useFeaturedEscorts(refetchInterval?: number) {
  return useFetchData<FeaturedEscort[]>(
    () => adminApi.getFeaturedEscorts(),
    { refetchInterval }
  );
}

/**
 * Use hero banner hook
 */
export function useHeroBanner() {
  return useFetchData(
    () => adminApi.getHeroBanner()
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PHOTO APPROVAL HOOKS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use pending photos hook
 */
export function usePendingPhotos(refetchInterval?: number) {
  return useFetchData<PhotoApproval[]>(
    () => adminApi.getPendingPhotos(),
    { refetchInterval }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT LOGS HOOKS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Use audit logs hook
 */
export function useAuditLogs(filters: AuditLogFilters = {}) {
  return usePaginatedData(
    (f) => adminApi.getAuditLogs(f as AuditLogFilters),
    filters
  );
}
