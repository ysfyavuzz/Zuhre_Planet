/**
 * Role Type Definitions
 *
 * Complete type definitions for user roles, permissions, and access control.
 * Provides type-safe role management throughout the application.
 *
 * @module types/role
 * @category Types
 *
 * Features:
 * - UserRole enum for all user types
 * - Permission definitions for each role
 * - Access level hierarchy
 * - Role-based UI states
 * - Type guards for role checking
 *
 * @example
 * ```typescript
 * import type { UserRole, RolePermissions } from '@/types/role';
 *
 * function hasPermission(role: UserRole, permission: keyof RolePermissions): boolean {
 *   return ROLE_PERMISSIONS[role]?.[permission] || false;
 * }
 * ```
 */

/**
 * All possible user roles in the system
 */
export type UserRole =
  | 'guest'      // Not logged in
  | 'customer'   // Customer/client user
  | 'escort'     // Escort/service provider
  | 'admin';     // Administrator

/**
 * User membership tiers for premium features
 */
export type MembershipTier =
  | 'standard'   // Basic access
  | 'premium'    // Premium features
  | 'vip';       // VIP access (all features)

/**
 * Access levels for route protection
 */
export type AccessLevel =
  | 'public'     // No authentication required
  | 'guest'      // Optional auth, limited content
  | 'customer'   // Customer role required
  | 'escort'     // Escort role required
  | 'admin'      // Admin role required
  | 'vip';       // VIP membership required

/**
 * View role for content access control
 * Determines what content a user can see based on their membership
 */
export type ViewRole =
  | 'guest'      // Not logged in - most limited
  | 'user'       // Regular logged-in user
  | 'premium'    // Premium member
  | 'vip';       // VIP member - full access

/**
 * Permission flags for each role
 */
export interface RolePermissions {
  /**
   * Can view escort profiles
   */
  viewProfiles: boolean;
  /**
   * Can view contact information (phone, WhatsApp)
   */
  viewContactInfo: boolean;
  /**
   * Can view all photos in a gallery
   */
  viewAllPhotos: boolean;
  /**
   * Can view videos
   */
  viewVideos: boolean;
  /**
   * Can add escorts to favorites
   */
  canFavorite: boolean;
  /**
   * Can send messages
   */
  canMessage: boolean;
  /**
   * Can book appointments
   */
  canBook: boolean;
  /**
   * Can create escort profile
   */
  canCreateProfile: boolean;
  /**
   * Can edit own profile
   */
  canEditProfile: boolean;
  /**
   * Can manage bookings
   */
  canManageBookings: boolean;
  /**
   * Can access admin dashboard
   */
  canAccessAdmin: boolean;
  /**
   * Can approve profiles
   */
  canApproveProfiles: boolean;
  /**
   * Can view analytics
   */
  canViewAnalytics: boolean;
}

/**
 * Complete permissions for each role
 */
export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  guest: {
    viewProfiles: true,
    viewContactInfo: false,
    viewAllPhotos: false,
    viewVideos: false,
    canFavorite: false,
    canMessage: false,
    canBook: false,
    canCreateProfile: false,
    canEditProfile: false,
    canManageBookings: false,
    canAccessAdmin: false,
    canApproveProfiles: false,
    canViewAnalytics: false,
  },
  customer: {
    viewProfiles: true,
    viewContactInfo: true,
    viewAllPhotos: false,  // Limited by membership
    viewVideos: false,     // Limited by membership
    canFavorite: true,
    canMessage: true,
    canBook: true,
    canCreateProfile: false,
    canEditProfile: false,
    canManageBookings: true,
    canAccessAdmin: false,
    canApproveProfiles: false,
    canViewAnalytics: false,
  },
  escort: {
    viewProfiles: false,
    viewContactInfo: false,
    viewAllPhotos: false,
    viewVideos: false,
    canFavorite: false,
    canMessage: true,
    canBook: false,
    canCreateProfile: true,
    canEditProfile: true,
    canManageBookings: true,
    canAccessAdmin: false,
    canApproveProfiles: false,
    canViewAnalytics: true,  // Own profile analytics
  },
  admin: {
    viewProfiles: true,
    viewContactInfo: true,
    viewAllPhotos: true,
    viewVideos: true,
    canFavorite: true,
    canMessage: true,
    canBook: false,
    canCreateProfile: false,
    canEditProfile: true,  // Can edit any profile
    canManageBookings: true,
    canAccessAdmin: true,
    canApproveProfiles: true,
    canViewAnalytics: true,
  },
};

/**
 * Content limits for each view role
 */
export interface ViewLimits {
  /**
   * Maximum number of photos visible
   */
  maxPhotos: number;
  /**
   * Maximum number of videos visible
   */
  maxVideos: number;
  /**
   * Whether contact info is visible
   */
  showContactInfo: boolean;
  /**
   * Whether full bio is visible
   */
  showFullBio: boolean;
  /**
   * Label for this access level
   */
  label: string;
}

/**
 * View limits for each membership tier
 */
export const VIEW_LIMITS: Record<ViewRole, ViewLimits> = {
  guest: {
    maxPhotos: 3,
    maxVideos: 0,
    showContactInfo: false,
    showFullBio: false,
    label: 'Misafir',
  },
  user: {
    maxPhotos: 6,
    maxVideos: 1,
    showContactInfo: true,
    showFullBio: true,
    label: 'Standart Üye',
  },
  premium: {
    maxPhotos: 12,
    maxVideos: 3,
    showContactInfo: true,
    showFullBio: true,
    label: 'Premium Üye',
  },
  vip: {
    maxPhotos: 999,  // Unlimited
    maxVideos: 999,  // Unlimited
    showContactInfo: true,
    showFullBio: true,
    label: 'VIP Üye',
  },
};

/**
 * User role selection options
 */
export interface RoleOption {
  /**
   * Role identifier
   */
  value: UserRole;
  /**
   * Display label (Turkish)
   */
  label: string;
  /**
   * Description of the role
   */
  description: string;
  /**
   * Icon name (lucide-react)
   */
  icon: string;
  /**
   * Primary color for UI
   */
  color: string;
  /**
   * Route to redirect after selection
   */
  redirectRoute: string;
  /**
   * Whether signup is required
   */
  requiresSignup: boolean;
}

/**
 * Available role options for user selection
 */
export const ROLE_OPTIONS: RoleOption[] = [
  {
    value: 'customer',
    label: 'Müşteri',
    description: 'İlanları görüntüle, favorilere ekle, randevu al',
    icon: 'User',
    color: 'from-cyan-500 to-cyan-600',
    redirectRoute: '/',
    requiresSignup: false,
  },
  {
    value: 'escort',
    label: 'Escort',
    description: 'Profil oluştur, ilan yönet, randevu al',
    icon: 'Sparkles',
    color: 'from-blue-500 to-blue-600',
    redirectRoute: '/register-escort',
    requiresSignup: true,
  },
];

/**
 * Type guard to check if a value is a valid UserRole
 */
export function isUserRole(value: string): value is UserRole {
  return ['guest', 'customer', 'escort', 'admin'].includes(value);
}

/**
 * Type guard to check if a value is a valid AccessLevel
 */
export function isAccessLevel(value: string): value is AccessLevel {
  return ['public', 'guest', 'customer', 'escort', 'admin', 'vip'].includes(value);
}

/**
 * Get view role from membership tier
 */
export function getViewRoleFromMembership(membership: MembershipTier | undefined): ViewRole {
  switch (membership) {
    case 'vip':
      return 'vip';
    case 'premium':
      return 'premium';
    case 'standard':
    default:
      return 'user';
  }
}

/**
 * Get view limits for a user
 */
export function getViewLimitsForUser(
  membership: MembershipTier | undefined,
  isAuthenticated: boolean
): ViewLimits {
  if (!isAuthenticated) {
    return VIEW_LIMITS.guest;
  }

  const viewRole = getViewRoleFromMembership(membership);
  return VIEW_LIMITS[viewRole];
}

/**
 * Check if a role has a specific permission
 */
export function roleHasPermission(
  role: UserRole,
  permission: keyof RolePermissions
): boolean {
  return ROLE_PERMISSIONS[role]?.[permission] || false;
}

/**
 * Get required access level for a route
 */
export function getAccessLevelForRoute(route: string): AccessLevel {
  // Public routes
  if (['/', '/catalog', '/escorts', '/pricing', '/contact', '/seo', '/terms', '/privacy', '/cookies', '/kvkk'].includes(route)) {
    return 'public';
  }

  // Guest routes (can view with limitations)
  if (route.startsWith('/escort/')) {
    return 'guest';
  }

  // Customer routes
  if (['/favorites', '/messages', '/appointments'].includes(route)) {
    return 'customer';
  }

  // Escort routes
  if (route.startsWith('/escort/dashboard') || route.startsWith('/escort/market')) {
    return 'escort';
  }

  // Admin routes
  if (route.startsWith('/admin/')) {
    return 'admin';
  }

  // Default to public
  return 'public';
}

/**
 * Role transition states for UI feedback
 */
export type RoleTransitionState =
  | 'idle'          // No transition in progress
  | 'selecting'     // User is selecting role
  | 'redirecting'   // Redirecting to appropriate page
  | 'upgrading'     // Upgrading to premium/vip
  | 'switching';    // Switching roles

/**
 * Role selection state
 */
export interface RoleSelectionState {
  /**
   * Current transition state
   */
  state: RoleTransitionState;
  /**
   * Selected role (if any)
   */
  selectedRole: UserRole | null;
  /**
   * Timestamp of selection
   */
  selectedAt?: number;
  /**
   * Whether selection is persisted
   */
  isPersisted: boolean;
}

/**
 * Initial role selection state
 */
export const INITIAL_ROLE_STATE: RoleSelectionState = {
  state: 'idle',
  selectedRole: null,
  isPersisted: false,
};
