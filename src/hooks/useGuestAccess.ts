/**
 * useGuestAccess Hook
 *
 * Custom hook for managing guest user access and limitations.
 * Provides content visibility controls, upgrade prompts, and access state.
 *
 * @module hooks/useGuestAccess
 * @category Hooks
 *
 * Features:
 * - Guest access detection and state management
 * - Content visibility calculations (photos, videos, contact info)
 * - Upgrade prompt triggering based on content limits
 * - LocalStorage-based access caching
 * - Role-based access level determination
 * - Type-safe access control
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const {
 *     isGuest,
 *     canViewPhotos,
 *     visiblePhotoCount,
 *     totalPhotoCount,
 *     shouldShowUpgradePrompt
 *   } = useGuestAccess();
 *
 *   return (
 *     <div>
 *       {shouldShowUpgradePrompt && <UpgradePrompt />}
 *       <PhotoGallery count={visiblePhotoCount} total={totalPhotoCount} />
 *     </div>
 *   );
 * }
 * ```
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getStoredRole } from '@/components/RoleSelector';
import type {
  UserRole,
  ViewRole,
  ViewLimits,
  MembershipTier,
} from '@/types/role';
import { VIEW_LIMITS, getViewRoleFromMembership, getViewLimitsForUser } from '@/types/role';

/**
 * Cache duration for access calculations (5 minutes)
 */
const ACCESS_CACHE_DURATION = 5 * 60 * 1000;

/**
 * Storage key for access cache
 */
const ACCESS_CACHE_KEY = 'guest-access-cache';

/**
 * Cached access data structure
 */
interface AccessCache {
  viewRole: ViewRole;
  limits: ViewLimits;
  timestamp: number;
}

/**
 * Guest access state and controls
 */
export interface GuestAccessState {
  /**
   * Whether user is a guest (not logged in)
   */
  isGuest: boolean;

  /**
   * User's current view role (guest, user, premium, vip)
   */
  viewRole: ViewRole;

  /**
   * Current access limits for the user
   */
  limits: ViewLimits;

  /**
   * Whether user can view all photos in a gallery
   */
  canViewAllPhotos: boolean;

  /**
   * Whether user can view contact information
   */
  canViewContactInfo: boolean;

  /**
   * Whether user can view videos
   */
  canViewVideos: boolean;

  /**
   * Whether user can view full bio/descriptions
   */
  canViewFullBio: boolean;

  /**
   * Calculated visible photo count based on limits
   */
  getVisiblePhotoCount: (total: number) => number;

  /**
   * Calculated visible video count based on limits
   */
  getVisibleVideoCount: (total: number) => number;

  /**
   * Whether upgrade prompt should be shown
   */
  shouldShowUpgradePrompt: boolean;

  /**
   * Whether access is limited
   */
  isLimited: boolean;

  /**
   * Label for current access level
   */
  accessLabel: string;

  /**
   * Clear access cache
   */
  clearCache: () => void;
}

/**
 * Hook for managing guest access and limitations
 *
 * Provides comprehensive access control for guest users including
 * content visibility calculations and upgrade prompts.
 */
export function useGuestAccess(): GuestAccessState {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [cachedAccess, setCachedAccess] = useState<AccessCache | null>(null);

  // Calculate view role and limits
  const accessData = useMemo(() => {
    // Return cached data if valid
    if (cachedAccess) {
      const age = Date.now() - cachedAccess.timestamp;
      if (age < ACCESS_CACHE_DURATION) {
        return cachedAccess;
      }
    }

    // Calculate fresh data
    const isGuest = !isAuthenticated;
    let viewRole: ViewRole;
    let limits: ViewLimits;

    if (isGuest) {
      viewRole = 'guest';
      limits = VIEW_LIMITS.guest;
    } else {
      const membership = user?.membership as MembershipTier | undefined;
      viewRole = getViewRoleFromMembership(membership);
      limits = getViewLimitsForUser(membership, true);
    }

    const newData: AccessCache = {
      viewRole,
      limits,
      timestamp: Date.now(),
    };

    // Cache the data
    try {
      localStorage.setItem(ACCESS_CACHE_KEY, JSON.stringify(newData));
    } catch (error) {
      console.warn('Failed to cache access data:', error);
    }

    setCachedAccess(newData);
    return newData;
  }, [isAuthenticated, user, cachedAccess]);

  // Clear cache function
  const clearCache = useCallback(() => {
    try {
      localStorage.removeItem(ACCESS_CACHE_KEY);
      setCachedAccess(null);
    } catch (error) {
      console.warn('Failed to clear access cache:', error);
    }
  }, []);

  // Helper functions for calculating visible content
  const getVisiblePhotoCount = useCallback(
    (total: number): number => {
      if (!accessData.limits.maxPhotos) return 0;
      return Math.min(total, accessData.limits.maxPhotos);
    },
    [accessData.limits.maxPhotos]
  );

  const getVisibleVideoCount = useCallback(
    (total: number): number => {
      if (!accessData.limits.maxVideos) return 0;
      return Math.min(total, accessData.limits.maxVideos);
    },
    [accessData.limits.maxVideos]
  );

  // Determine if content is limited
  const isLimited = useMemo(() => {
    return (
      !accessData.limits.showContactInfo ||
      !accessData.limits.showFullBio ||
      accessData.limits.maxPhotos < 50 ||
      accessData.limits.maxVideos < 50
    );
  }, [accessData.limits]);

  // Determine if upgrade prompt should be shown
  const shouldShowUpgradePrompt = useMemo(() => {
    // Don't show to guests immediately (let them browse first)
    if (!isAuthenticated) {
      return false;
    }

    // Show to authenticated users with limited access
    return isLimited && accessData.viewRole !== 'vip';
  }, [isAuthenticated, isLimited, accessData.viewRole]);

  return {
    isGuest: !isAuthenticated,
    viewRole: accessData.viewRole,
    limits: accessData.limits,
    canViewAllPhotos: accessData.limits.maxPhotos >= 50,
    canViewContactInfo: accessData.limits.showContactInfo,
    canViewVideos: accessData.limits.maxVideos > 0,
    canViewFullBio: accessData.limits.showFullBio,
    getVisiblePhotoCount,
    getVisibleVideoCount,
    shouldShowUpgradePrompt,
    isLimited,
    accessLabel: accessData.limits.label,
    clearCache,
  };
}

/**
 * Hook for checking if specific content requires upgrade
 *
 * @param totalCount - Total number of items (photos/videos)
 * @param type - Type of content ('photo' | 'video')
 * @returns Whether upgrade is required to view all content
 */
export function useUpgradeRequired(totalCount: number, type: 'photo' | 'video') {
  const { limits, isGuest } = useGuestAccess();

  const limit = type === 'photo' ? limits.maxPhotos : limits.maxVideos;
  const requiresUpgrade = totalCount > limit;

  return {
    requiresUpgrade,
    visibleCount: Math.min(totalCount, limit),
    hiddenCount: Math.max(0, totalCount - limit),
    limit,
    isGuest,
  };
}

/**
 * Hook for role-based routing
 *
 * Determines if a user can access a specific route based on their role.
 */
export function useRoleBasedRoute() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const storedRole = getStoredRole();

  const canAccessRoute = useCallback(
    (requiredRole: UserRole | 'any' = 'any'): boolean => {
      if (requiredRole === 'any') return true;
      if (requiredRole === 'guest') return !isAuthenticated;
      if (requiredRole === 'customer') {
        return isAuthenticated && (storedRole === 'customer' || user?.role === 'user' || user?.role === 'client');
      }
      if (requiredRole === 'escort') {
        return isAuthenticated && (storedRole === 'escort' || user?.role === 'escort');
      }
      if (requiredRole === 'admin') {
        return isAuthenticated && user?.role === 'admin';
      }
      return true;
    },
    [isAuthenticated, user, storedRole]
  );

  const getRedirectRoute = useCallback(
    (requiredRole: UserRole | 'any' = 'any'): string | null => {
      if (canAccessRoute(requiredRole)) return null;

      // User doesn't have access, determine where to redirect
      if (!isAuthenticated) {
        return '/login';
      }

      // Authenticated but wrong role
      if (requiredRole === 'customer' && storedRole === 'escort') {
        return '/escort/dashboard';
      }
      if (requiredRole === 'escort' && storedRole === 'customer') {
        return '/';
      }

      // Default to home
      return '/';
    },
    [canAccessRoute, isAuthenticated, storedRole]
  );

  return {
    canAccessRoute,
    getRedirectRoute,
    isLoading,
    userRole: storedRole || (user?.role as UserRole) || 'guest',
  };
}

/**
 * Hook for managing role selection state
 */
export function useRoleSelection() {
  const [storedRole, setStoredRole] = useState<UserRole | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check localStorage for stored role
    const checkRole = () => {
      try {
        const role = localStorage.getItem('user-role-selection');
        const timestamp = localStorage.getItem('role-selection-date');

        if (role && timestamp) {
          const age = Date.now() - parseInt(timestamp);
          const sevenDays = 7 * 24 * 60 * 60 * 1000;

          if (age < sevenDays) {
            setStoredRole(role as UserRole);
          } else {
            // Expired, clear it
            localStorage.removeItem('user-role-selection');
            localStorage.removeItem('role-selection-date');
          }
        }
      } catch (error) {
        console.warn('Failed to check stored role:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkRole();
  }, []);

  const selectRole = useCallback((role: UserRole) => {
    try {
      localStorage.setItem('user-role-selection', role);
      localStorage.setItem('role-selection-date', Date.now().toString());
      setStoredRole(role);
    } catch (error) {
      console.error('Failed to store role:', error);
    }
  }, []);

  const clearRole = useCallback(() => {
    try {
      localStorage.removeItem('user-role-selection');
      localStorage.removeItem('role-selection-date');
      setStoredRole(null);
    } catch (error) {
      console.error('Failed to clear role:', error);
    }
  }, []);

  return {
    selectedRole: storedRole,
    isChecking,
    hasSelected: !!storedRole,
    selectRole,
    clearRole,
  };
}
