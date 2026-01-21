/**
 * Admin Types
 *
 * Comprehensive TypeScript types for admin dashboard.
 * All admin-related data structures and interfaces.
 *
 * @module types/admin
 * @category Types - Admin
 */

// ─────────────────────────────────────────────────────────────────────────────
// BASE TYPES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * User status enum
 */
export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  BANNED = 'banned',
  PENDING = 'pending',
  DELETED = 'deleted',
}

/**
 * User role enum
 */
export enum UserRole {
  ESCORT = 'escort',
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

/**
 * Membership tier enum
 */
export enum MembershipTier {
  STANDARD = 'standard',
  VIP = 'vip',
  PREMIUM = 'premium',
  EXCLUSIVE = 'exclusive',
}

/**
 * Listing status enum
 */
export enum ListingStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
  EXPIRED = 'expired',
}

/**
 * Review status enum
 */
export enum ReviewStatus {
  VISIBLE = 'visible',
  HIDDEN = 'hidden',
  FLAGGED = 'flagged',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

/**
 * Report status enum
 */
export enum ReportStatus {
  PENDING = 'pending',
  REVIEWING = 'reviewing',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed',
}

/**
 * Report type enum
 */
export enum ReportType {
  USER = 'user',
  LISTING = 'listing',
  REVIEW = 'review',
  MESSAGE = 'message',
  PHOTO = 'photo',
}

/**
 * Log level enum
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

/**
 * Action type for audit logs
 */
export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  APPROVE = 'approve',
  REJECT = 'reject',
  BAN = 'ban',
  UNBAN = 'unban',
  SUSPEND = 'suspend',
  UNSUSPEND = 'unsuspend',
  LOGIN = 'login',
  LOGOUT = 'logout',
  VIEW = 'view',
  EXPORT = 'export',
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERFACE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Platform statistics
 */
export interface PlatformStats {
  totalUsers: number;
  totalEscorts: number;
  totalCustomers: number;
  totalListings: number;
  activeListings: number;
  pendingListings: number;
  rejectedListings: number;
  totalReviews: number;
  pendingReviews: number;
  flaggedReviews: number;
  totalRevenue: number;
  monthlyRevenue: number;
  weeklyRevenue: number;
  dailyRevenue: number;
  activeNow: number;
  reportsCount: number;
  pendingReports: number;
  resolvedReports: number;
  vipMembers: number;
  boostedListings: number;
}

/**
 * Revenue statistics
 */
export interface RevenueStats {
  total: number;
  monthly: number;
  weekly: number;
  daily: number;
  growthRate: number;
  byMembership: Record<MembershipTier, number>;
  byService: Record<string, number>;
}

/**
 * User statistics
 */
export interface UserStats {
  total: number;
  escorts: number;
  customers: number;
  admins: number;
  activeNow: number;
  newThisMonth: number;
  newThisWeek: number;
  newToday: number;
  byMembership: Record<MembershipTier, number>;
  byStatus: Record<UserStatus, number>;
}

/**
 * Admin user interface
 */
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  membership?: MembershipTier;
  isVerified: boolean;
  isBoosted: boolean;
  featuredPosition?: number; // 1-5 or undefined
  profileVisibility: boolean;
  phoneVisibility: 'visible' | 'masked' | 'hidden';
  messageAvailability: boolean;
  createdAt: string;
  updatedAt: string;
  lastActive: string;
  lastLogin?: string;
  location?: string;
  age?: number;
  avatar?: string;
  listings?: number;
  reviews?: number;
  revenue?: number;
  views?: number;
  responseRate?: number;
  rating?: number;
  restrictions?: string[];
  banReason?: string;
  suspendedUntil?: string;
  isOnline: boolean;
}

/**
 * Admin listing interface
 */
export interface AdminListing {
  id: string;
  title: string;
  slug: string;
  escortId: string;
  escortName: string;
  escortAvatar?: string;
  category: string;
  location: string;
  city: string;
  district?: string;
  price: number;
  priceUnit: 'hourly' | 'daily' | 'weekly' | 'monthly';
  status: ListingStatus;
  isVerified: boolean;
  isFeatured: boolean;
  featuredPosition?: number;
  isBoosted: boolean;
  boostUntil?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  views: number;
  favorites: number;
  contacts: number;
  photos: number;
  reports?: number;
  reviews: number;
  rating: number;
  tags: string[];
  services: string[];
}

/**
 * Admin review interface
 */
export interface AdminReview {
  id: string;
  listingId: string;
  listingTitle: string;
  escortId: string;
  escortName: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  isVerified: boolean;
  isFlagged: boolean;
  flagReason?: string;
  createdAt: string;
  updatedAt: string;
  helpfulVotes: number;
  reportCount?: number;
  adminResponse?: string;
  adminRespondedAt?: string;
}

/**
 * Admin report interface
 */
export interface AdminReport {
  id: string;
  type: ReportType;
  targetId: string;
  targetName: string;
  targetSnapshot?: {
    name?: string;
    title?: string;
    description?: string;
    photos?: string[];
  };
  reason: string;
  description?: string;
  reporterId: string;
  reporterName: string;
  reporterEmail?: string;
  status: ReportStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  resolvedAt?: string;
  resolution?: string;
  attachments?: string[];
  notes?: string;
}

/**
 * Audit log entry
 */
export interface AuditLog {
  id: string;
  action: AuditAction;
  entityType: 'user' | 'listing' | 'review' | 'report' | 'setting' | 'page' | 'navigation';
  entityId: string;
  entityName?: string;
  performedBy: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  changes?: {
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
  };
  ipAddress?: string;
  userAgent?: string;
  level: LogLevel;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

/**
 * Site settings
 */
export interface SiteSettings {
  general: {
    siteName: string;
    siteUrl: string;
    siteDescription: string;
    logoUrl?: string;
    faviconUrl?: string;
    contactEmail: string;
    contactPhone?: string;
    socialLinks: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      telegram?: string;
    };
  };
  theme: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      foreground: string;
      muted: string;
      border: string;
    };
    typography: {
      headingFont: string;
      bodyFont: string;
      headingSize: number;
      bodySize: number;
      lineHeight: number;
    };
    darkMode: 'light' | 'dark' | 'system';
  };
  media: {
    imageSizes: {
      profile: { width: number; height: number };
      gallery: { width: number; height: number };
      cover: { width: number; height: number };
      thumbnail: { width: number; height: number };
    };
    autoResize: boolean;
    compressionQuality: number;
    maxFileSize: number;
    allowedFormats: string[];
  };
  features: {
    registration: {
      enabled: boolean;
      requireVerification: boolean;
      requireApproval: boolean;
    };
    messaging: {
      enabled: boolean;
      maxMessages: number;
    };
    reviews: {
      enabled: boolean;
      requirePurchase: boolean;
      autoApprove: boolean;
    };
    favorites: {
      enabled: boolean;
      maxFavorites: number;
    };
  };
  limits: {
    maxPhotosPerListing: number;
    maxListingsPerEscort: number;
    maxActiveReports: number;
  };
  payments: {
    currency: string;
    commissionRate: number;
    vipPrice: {
      monthly: number;
      quarterly: number;
      yearly: number;
    };
    boostPrices: {
      hourly: number;
      daily: number;
      weekly: number;
    };
  };
}

/**
 * Navigation item
 */
export interface NavigationItem {
  id: string;
  label: string;
  url: string;
  icon?: string;
  visible: boolean;
  order: number;
  parentId?: string;
  openInNewTab?: boolean;
  requiresAuth: boolean;
  requiredRole?: UserRole;
  badge?: string;
  children?: NavigationItem[];
}

/**
 * Page
 */
export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'active' | 'draft' | 'hidden' | 'archived';
  template: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  showInNavigation: boolean;
  showInFooter: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

/**
 * Photo approval queue item
 */
export interface PhotoApproval {
  id: string;
  escortId: string;
  escortName: string;
  photoUrl: string;
  thumbnailUrl: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  uploadedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  reportCount: number;
  isPrimary: boolean;
  order: number;
}

/**
 * Featured escort configuration
 */
export interface FeaturedEscort {
  id: string;
  escortId: string;
  escortName: string;
  position: number; // 1-5
  badge?: string;
  enabled: boolean;
  expiresAt?: string;
  assignedAt: string;
  assignedBy: string;
}

/**
 * Hero banner configuration
 */
export interface HeroBanner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaLink?: string;
  enabled: boolean;
  order: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// FILTER & QUERY TYPES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * User filter options
 */
export interface UserFilters extends Record<string, unknown> {
  role?: UserRole | 'all';
  status?: UserStatus | 'all';
  membership?: MembershipTier | 'all';
  verified?: boolean | 'all';
  search?: string;
  sortBy?: 'name' | 'email' | 'createdAt' | 'lastActive' | 'revenue';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

/**
 * Listing filter options
 */
export interface ListingFilters extends Record<string, unknown> {
  status?: ListingStatus | 'all';
  category?: string | 'all';
  city?: string | 'all';
  verified?: boolean | 'all';
  featured?: boolean | 'all';
  search?: string;
  sortBy?: 'title' | 'createdAt' | 'views' | 'rating' | 'price';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

/**
 * Review filter options
 */
export interface ReviewFilters extends Record<string, unknown> {
  status?: ReviewStatus | 'all';
  rating?: number | 'all';
  flagged?: boolean | 'all';
  search?: string;
  sortBy?: 'createdAt' | 'rating' | 'helpfulVotes';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

/**
 * Report filter options
 */
export interface ReportFilters extends Record<string, unknown> {
  type?: ReportType | 'all';
  status?: ReportStatus | 'all';
  priority?: 'low' | 'medium' | 'high' | 'urgent' | 'all';
  assignedTo?: string | 'all' | 'unassigned';
  search?: string;
  sortBy?: 'createdAt' | 'priority' | 'status';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

/**
 * Audit log filter options
 */
export interface AuditLogFilters extends Record<string, unknown> {
  action?: AuditAction | 'all';
  entityType?: string | 'all';
  level?: LogLevel | 'all';
  performedBy?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTION RESULT TYPES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  metadata?: {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
  };
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  totalPages: number;
}

/**
 * Bulk action result
 */
export interface BulkActionResult {
  success: boolean;
  processed: number;
  succeeded: number;
  failed: number;
  errors?: Array<{
    id: string;
    error: string;
  }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN DASHBOARD SPECIFIC TYPES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Admin tab type
 */
export type AdminTab =
  | 'overview'
  | 'users'
  | 'listings'
  | 'reviews'
  | 'reports'
  | 'settings'
  | 'logs'
  | 'theme'
  | 'showcase'
  | 'media'
  | 'pages'
  | 'navigation'
  | 'members';

/**
 * Quick stat card
 */
export interface QuickStat {
  label: string;
  value: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ElementType;
  color: string;
  link?: string;
}

/**
 * Chart data point
 */
export interface ChartDataPoint {
  label: string;
  value: number;
  date?: string;
}

/**
 * Chart data series
 */
export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string;
}

/**
 * Activity item
 */
export interface ActivityItem {
  id: string;
  type: 'user' | 'listing' | 'review' | 'report' | 'system';
  title: string;
  description: string;
  timestamp: string;
  icon?: React.ElementType;
  action?: {
    label: string;
    url: string;
  };
}
