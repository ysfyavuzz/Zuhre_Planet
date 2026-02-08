/**
 * Admin Dashboard Page
 *
 * Central administration panel for platform management.
 * Completely rewritten with proper architecture, type safety, error handling,
 * loading states, and real-time updates.
 *
 * @module pages/AdminDashboard
 * @category Pages - Admin
 *
 * Features:
 * - Platform-wide statistics and KPIs
 * - User management (escorts & customers)
 * - Listing moderation (approve/reject)
 * - Review moderation
 * - Site settings and configuration
 * - Activity logs and reports
 * - Real-time monitoring
 * - Theme and visual customization
 * - Showcase/featured management
 * - Media settings
 * - Page management (CMS)
 * - Navigation management
 * - Escort member management with VIP, boost, visibility controls
 * - Photo approval queue
 *
 * @example
 * ```tsx
 * // Route: /admin/dashboard
 * <AdminDashboard />
 * ```
 */

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DashboardAuthGuard } from '@/components/DashboardAuthGuard';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import type {
  AdminTab,
  PlatformStats,
  AdminUser,
  AdminListing,
  AdminReview,
  AdminReport,
  UserFilters,
  ListingFilters,
  ReviewFilters,
  ReportFilters,
  UserStatus,
  ListingStatus,
  ReviewStatus,
  ReportStatus,
  MembershipTier,
} from '@/types/admin';
import {
  usePlatformStats,
  useUsers,
  useListings,
  useReviews,
  useReports,
  usePendingPhotos,
  useFeaturedEscorts,
  useNavigationItems,
  usePages,
  useSiteSettings,
  type UsePaginatedDataResult,
} from '@/hooks/useAdminData';
import {
  useBanUser,
  useUnbanUser,
  useSuspendUser,
  useUnsuspendUser,
  useVerifyUser,
  useSetUserMembership,
  useSetUserFeaturedPosition,
  useBoostUser,
  useSetUserVisibility,
  useDeleteUser,
  useBulkSetMembership,
  useBulkBoostUsers,
  useBulkSetVisibility,
  useApproveListing,
  useRejectListing,
  useDeleteListing,
  useApproveReview,
  useRejectReview,
  useHideReview,
  useDeleteReview,
  useUpdateReportStatus,
  useApprovePhoto,
  useRejectPhoto,
  useUpdateSiteSettings,
} from '@/hooks/useAdminActions';
import {
  Shield,
  Users,
  FileText,
  Star,
  Settings,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  MessageSquare,
  Ban,
  ShieldAlert,
  Bell,
  BarChart3,
  DollarSign,
  Calendar,
  Search,
  Filter,
  Download,
  RefreshCw,
  Palette,
  LayoutDashboard,
  Sparkles,
  Image as ImageIcon,
  FileEdit,
  Menu,
  Plus,
  Trash2,
  GripVertical,
  Type,
  Monitor,
  Crop,
  RotateCw,
  Phone,
  Lock,
  Unlock,
  ShieldCheck,
  Zap,
  ChevronUp,
  Crown,
  UserCheck,
  UserX,
  Sliders,
  MessageSquareOff,
  ChevronRight,
  Home,
  MoreHorizontal,
  ArrowUpDown,
  X,
  ChevronDown,
  Loader2,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────

const fadeInVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

// ─────────────────────────────────────────────────────────────────────────────
// STATUS BADGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface StatusBadgeProps {
  status: UserStatus | ListingStatus | ReviewStatus | ReportStatus | string;
  size?: 'sm' | 'md';
}

function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const statusConfig: Record<string, { color: string; label: string; icon: React.ElementType }> = {
    active: { color: 'bg-green-500/10 text-green-600 border-green-500/30', label: 'Aktif', icon: CheckCircle2 },
    pending: { color: 'bg-sky-500/10 text-sky-600 border-sky-500/30', label: 'Bekliyor', icon: Clock },
    suspended: { color: 'bg-red-500/10 text-red-600 border-red-500/30', label: 'Askıya Alındı', icon: AlertTriangle },
    banned: { color: 'bg-red-900/10 text-red-700 border-red-900/30', label: 'Yasaklandı', icon: XCircle },
    rejected: { color: 'bg-red-500/10 text-red-600 border-red-500/30', label: 'Reddedildi', icon: XCircle },
    hidden: { color: 'bg-gray-500/10 text-gray-600 border-gray-500/30', label: 'Gizli', icon: Eye },
    flagged: { color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/30', label: 'İşaretlendi', icon: AlertTriangle },
    visible: { color: 'bg-green-500/10 text-green-600 border-green-500/30', label: 'Görünür', icon: CheckCircle2 },
    reviewing: { color: 'bg-blue-500/10 text-blue-600 border-blue-500/30', label: 'İnceleniyor', icon: Search },
    resolved: { color: 'bg-green-500/10 text-green-600 border-green-500/30', label: 'Çözüldü', icon: CheckCircle2 },
    dismissed: { color: 'bg-gray-500/10 text-gray-600 border-gray-500/30', label: 'Yok Sayıldı', icon: XCircle },
    approved: { color: 'bg-green-500/10 text-green-600 border-green-500/30', label: 'Onaylandı', icon: CheckCircle2 },
    expired: { color: 'bg-gray-500/10 text-gray-600 border-gray-500/30', label: 'Süresi Doldu', icon: Clock },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`${config.color} ${size === 'sm' ? 'text-xs' : ''}`}>
      <Icon className={`w-3 h-3 mr-1 ${size === 'sm' ? 'w-2.5 h-2.5' : ''}`} />
      {config.label}
    </Badge>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOADING SPINNER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`${sizeClasses[size]} text-primary`}
    >
      <Loader2 className="w-full h-full" />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EMPTY STATE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

function EmptyState({ icon: Icon = FileText, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4"
      >
        <Icon className="w-8 h-8 text-muted-foreground" />
      </motion.div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mb-4 max-w-md">{description}</p>}
      {action && (
        <Button onClick={action.onClick}>
          <Plus className="w-4 h-4 mr-2" />
          {action.label}
        </Button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ADMIN DASHBOARD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Admin Dashboard main component
 */
export function AdminDashboard() {
  // Navigation & Tab State
  // Wouter doesn't have useNavigate, so we'll use window.location for navigation
  const navigate = (path: string) => {
    window.location.href = path;
  };
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Filter States
  const [userFilters, setUserFilters] = useState<UserFilters>({
    role: 'all',
    status: 'all',
    membership: 'all',
    page: 1,
    limit: 20,
  });

  const [listingFilters, setListingFilters] = useState<ListingFilters>({
    status: 'all',
    page: 1,
    limit: 20,
  });

  const [reviewFilters, setReviewFilters] = useState<ReviewFilters>({
    status: 'all',
    page: 1,
    limit: 20,
  });

  const [reportFilters, setReportFilters] = useState<ReportFilters>({
    status: 'all',
    page: 1,
    limit: 20,
  });

  // Search States
  const [userSearch, setUserSearch] = useState('');
  const [listingSearch, setListingSearch] = useState('');
  const [reviewSearch, setReviewSearch] = useState('');
  const [reportSearch, setReportSearch] = useState('');

  // Dialog States
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [banReason, setBanReason] = useState('');

  // Data Fetching Hooks
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = usePlatformStats(30000); // Refetch every 30 seconds

  const usersData = useUsers({ ...userFilters, search: userSearch || undefined });
  const usersLoading = usersData.isLoading;
  const usersError = usersData.error;
  const refetchUsers = usersData.refetch;
  const nextPage = usersData.nextPage;
  const prevPage = usersData.prevPage;
  const goToPage = usersData.goToPage;

  const listingsData = useListings({ ...listingFilters, search: listingSearch || undefined });
  const listingsLoading = listingsData.isLoading;
  const refetchListings = listingsData.refetch;

  const reviewsData = useReviews({ ...reviewFilters, search: reviewSearch || undefined });
  const reviewsLoading = reviewsData.isLoading;
  const refetchReviews = reviewsData.refetch;

  const reportsData = useReports({ ...reportFilters, search: reportSearch || undefined });
  const reportsLoading = reportsData.isLoading;
  const refetchReports = reportsData.refetch;

  const {
    data: pendingPhotos,
    isLoading: photosLoading,
    refetch: refetchPhotos,
  } = usePendingPhotos(15000); // Refetch every 15 seconds

  const {
    data: featuredEscorts,
    isLoading: featuredLoading,
    refetch: refetchFeatured,
  } = useFeaturedEscorts();

  // Action Hooks
  const banUser = useBanUser();
  const unbanUser = useUnbanUser();
  const suspendUser = useSuspendUser();
  const verifyUser = useVerifyUser();
  const setMembership = useSetUserMembership();
  const setFeatured = useSetUserFeaturedPosition();
  const boostUser = useBoostUser();
  const setVisibility = useSetUserVisibility();
  const deleteUser = useDeleteUser();
  const bulkSetMembership = useBulkSetMembership();
  const bulkBoost = useBulkBoostUsers();
  const bulkSetVisibility = useBulkSetVisibility();

  const approveListing = useApproveListing();
  const rejectListing = useRejectListing();
  const deleteListing = useDeleteListing();

  const approveReview = useApproveReview();
  const rejectReview = useRejectReview();
  const hideReview = useHideReview();
  const deleteReview = useDeleteReview();

  const updateReport = useUpdateReportStatus();
  const approvePhoto = useApprovePhoto();
  const rejectPhoto = useRejectPhoto();

  // Handlers
  const handleBanUser = useCallback(async () => {
    if (!selectedUser) return;

    const result = await banUser.execute(
      selectedUser.id,
      banReason,
      false
    );

    if (result.success) {
      setBanDialogOpen(false);
      setBanReason('');
      setSelectedUser(null);
      refetchUsers();
    }
  }, [selectedUser, banReason, banUser, refetchUsers]);

  const handleQuickAction = useCallback(async (
    action: 'approve' | 'reject' | 'delete' | 'verify' | 'ban' | 'hide',
    type: 'user' | 'listing' | 'review' | 'photo',
    id: string,
    reason?: string
  ) => {
    let result;

    switch (type) {
      case 'user':
        if (action === 'verify') {
          result = await verifyUser.execute(id);
        } else if (action === 'ban' && reason) {
          result = await banUser.execute(id, reason);
        }
        break;
      case 'listing':
        if (action === 'approve') {
          result = await approveListing.execute(id);
        } else if (action === 'reject' && reason) {
          result = await rejectListing.execute(id, reason);
        } else if (action === 'delete') {
          result = await deleteListing.execute(id);
        }
        break;
      case 'review':
        if (action === 'approve') {
          result = await approveReview.execute(id);
        } else if (action === 'reject') {
          result = await rejectReview.execute(id, reason);
        } else if (action === 'delete') {
          result = await deleteReview.execute(id);
        } else if (action === 'hide') {
          result = await hideReview.execute(id);
        }
        break;
      case 'photo':
        if (action === 'approve') {
          result = await approvePhoto.execute(id);
        } else if (action === 'reject' && reason) {
          result = await rejectPhoto.execute(id, reason);
        }
        break;
    }

    if (result?.success) {
      // Refetch relevant data
      if (type === 'user') refetchUsers();
      if (type === 'listing') refetchListings();
      if (type === 'review') refetchReviews();
      if (type === 'photo') refetchPhotos();
    }

    return result;
  }, [verifyUser, banUser, approveListing, rejectListing, deleteListing, approveReview, rejectReview, deleteReview, hideReview, approvePhoto, rejectPhoto, refetchUsers, refetchListings, refetchReviews, refetchPhotos]);

  // Memoized values
  const quickStats = useMemo(() => {
    if (!stats) return [];

    return [
      {
        label: 'Toplam Kullanıcı',
        value: stats.totalUsers.toLocaleString(),
        change: stats.totalUsers,
        changeType: 'neutral' as const,
        icon: Users,
        color: 'bg-blue-500/20 text-blue-600',
      },
      {
        label: 'Aktif İlan',
        value: stats.activeListings.toLocaleString(),
        change: stats.activeListings,
        changeType: 'neutral' as const,
        icon: FileText,
        color: 'bg-green-500/20 text-green-600',
      },
      {
        label: 'Bekleyen İlan',
        value: stats.pendingListings.toLocaleString(),
        change: stats.pendingListings,
        changeType: 'neutral' as const,
        icon: Clock,
        color: 'bg-sky-500/20 text-sky-600',
      },
      {
        label: 'Aylık Gelir',
        value: `₺${stats.monthlyRevenue.toLocaleString()}`,
        change: stats.monthlyRevenue,
        changeType: 'increase' as const,
        icon: DollarSign,
        color: 'bg-blue-500/20 text-blue-600',
      },
      {
        label: 'Şu An Aktif',
        value: stats.activeNow.toLocaleString(),
        change: stats.activeNow,
        changeType: 'neutral' as const,
        icon: Activity,
        color: 'bg-cyan-500/20 text-cyan-600',
      },
      {
        label: 'Bekleyen Şikayet',
        value: stats.reportsCount.toLocaleString(),
        change: stats.reportsCount,
        changeType: 'neutral' as const,
        icon: AlertTriangle,
        color: 'bg-red-500/20 text-red-600',
      },
    ];
  }, [stats]);

  return (
    <DashboardAuthGuard requiredRole="admin">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-500/10 via-sky-500/10 to-cyan-500/10 border-b border-blue-500/20">
          <div className="container py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/">
                  <Button variant="ghost" size="icon">
                    <Home className="w-5 h-5" />
                  </Button>
                </Link>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">
                      YÖNETİCİ PANELİ
                    </h1>
                    <Badge className="bg-red-500 text-white">
                      <Shield className="w-3 h-3 mr-1" />
                      ADMIN
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Platform yönetimi, kullanıcı kontrolü ve sistem ayarları
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    refetchStats();
                    toast.success('Veriler yenilendi');
                  }}
                  disabled={statsLoading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${statsLoading ? 'animate-spin' : ''}`} />
                  Yenile
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Dışa Aktar
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container py-6">
          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AdminTab)}>
            <div className="overflow-x-auto pb-2">
              <TabsList className="inline-flex w-full justify-start rounded-lg bg-muted p-1">
                <TabsTrigger value="overview" className="rounded-md">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Genel Bakış
                </TabsTrigger>
                <TabsTrigger value="users" className="rounded-md">
                  <Users className="w-4 h-4 mr-2" />
                  Kullanıcılar
                </TabsTrigger>
                <TabsTrigger value="listings" className="rounded-md">
                  <FileText className="w-4 h-4 mr-2" />
                  İlanlar
                </TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-md">
                  <Star className="w-4 h-4 mr-2" />
                  Değerlendirmeler
                </TabsTrigger>
                <TabsTrigger value="reports" className="rounded-md">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Şikayetler
                </TabsTrigger>
                <TabsTrigger value="settings" className="rounded-md">
                  <Settings className="w-4 h-4 mr-2" />
                  Ayarlar
                </TabsTrigger>
                <TabsTrigger value="theme" className="rounded-md">
                  <Palette className="w-4 h-4 mr-2" />
                  Tema
                </TabsTrigger>
                <TabsTrigger value="showcase" className="rounded-md">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Vitrin
                </TabsTrigger>
                <TabsTrigger value="media" className="rounded-md">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Medya
                </TabsTrigger>
                <TabsTrigger value="pages" className="rounded-md">
                  <FileEdit className="w-4 h-4 mr-2" />
                  Sayfalar
                </TabsTrigger>
                <TabsTrigger value="navigation" className="rounded-md">
                  <Menu className="w-4 h-4 mr-2" />
                  Navigasyon
                </TabsTrigger>
                <TabsTrigger value="members" className="rounded-md">
                  <Crown className="w-4 h-4 mr-2" />
                  Üyeler
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Contents */}
            <div className="mt-6">
              {/* Overview Tab */}
              <TabsContent value="overview">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fadeInVariants}
                  transition={{ duration: 0.3 }}
                >
                  {statsLoading ? (
                    <div className="flex items-center justify-center py-20">
                      <LoadingSpinner size="lg" />
                    </div>
                  ) : statsError ? (
                    <Card className="border-red-200 bg-red-50/50">
                      <CardContent className="p-8 text-center">
                        <XCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                        <h3 className="text-lg font-semibold mb-2">Veri Yükleme Hatası</h3>
                        <p className="text-sm text-muted-foreground mb-4">{statsError}</p>
                        <Button onClick={() => refetchStats()}>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Tekrar Dene
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-6">
                      {/* Quick Stats Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                        {quickStats.map((stat, index) => {
                          const Icon = stat.icon;
                          return (
                            <motion.div
                              key={stat.label}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Card className="p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg ${stat.color}`}>
                                    <Icon className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                                  </div>
                                </div>
                              </Card>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Revenue and Activity Charts */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <TrendingUp className="w-5 h-5" />
                              Gelir İstatistikleri
                            </CardTitle>
                            <CardDescription>Aylık gelir grafiği</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="h-64 flex items-center justify-center text-muted-foreground">
                              <div className="text-center">
                                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Grafik yakında eklenecek</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Activity className="w-5 h-5" />
                              Aktivite Özeti
                            </CardTitle>
                            <CardDescription>Son aktiviteler</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {[
                                { action: 'Yeni ilan', user: 'Ayşe Yılmaz', time: '2 dakika önce' },
                                { action: 'Üyelik yükseltme', user: 'Mehmet Demir', time: '5 dakika önce' },
                                { action: 'Şikayet bildirimi', user: 'Sistem', time: '15 dakika önce' },
                                { action: 'Fotoğraf onayı', user: 'Admin', time: '1 saat önce' },
                              ].map((activity, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    <div>
                                      <p className="text-sm font-medium">{activity.action}</p>
                                      <p className="text-xs text-muted-foreground">{activity.user}</p>
                                    </div>
                                  </div>
                                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                                </motion.div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}
                </motion.div>
              </TabsContent>

              {/* Users Tab - Continue in next part due to size */}
              <TabsContent value="users">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fadeInVariants}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Kullanıcı Yönetimi
                          </CardTitle>
                          <CardDescription>
                            {usersData?.total || 0} toplam kullanıcı
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Filters */}
                      <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex-1 min-w-[200px]">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              placeholder="İsim, e-mail ara..."
                              value={userSearch}
                              onChange={(e) => setUserSearch(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <Select
                          value={userFilters.role}
                          onValueChange={(v) => setUserFilters({ ...userFilters, role: v as any })}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Rol" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tüm Roller</SelectItem>
                            <SelectItem value="escort">Escort</SelectItem>
                            <SelectItem value="customer">Müşteri</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={userFilters.status}
                          onValueChange={(v) => setUserFilters({ ...userFilters, status: v as any })}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Durum" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tüm Durumlar</SelectItem>
                            <SelectItem value="active">Aktif</SelectItem>
                            <SelectItem value="pending">Bekliyor</SelectItem>
                            <SelectItem value="suspended">Askıda</SelectItem>
                            <SelectItem value="banned">Yasaklı</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Users List */}
                      {usersLoading ? (
                        <div className="flex items-center justify-center py-20">
                          <LoadingSpinner size="lg" />
                        </div>
                      ) : !usersData || usersData.data.length === 0 ? (
                        <EmptyState
                          title="Kullanıcı bulunamadı"
                          description="Filtre kriterlerinize uygun kullanıcı yok."
                        />
                      ) : (
                        <div className="space-y-4">
                          {usersData.data.map((user, index) => (
                            <motion.div
                              key={user.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.03 }}
                              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-bold">
                                  {user.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-semibold">{user.name}</p>
                                    <Badge variant="outline" className="text-xs">
                                      {user.role}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <StatusBadge status={user.status} />
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigate(`/escort/${user.id}`)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  {user.status === 'active' && (
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                          <Ban className="w-4 h-4 text-red-500" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Kullanıcıyı Engelle</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Bu kullanıcıyı engellemek istediğinizden emin misiniz?
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>İptal</AlertDialogCancel>
                                          <AlertDialogAction
                                            className="bg-red-500 hover:bg-red-600"
                                            onClick={() => handleQuickAction('ban', 'user', user.id)}
                                          >
                                            Engelle
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}

                          {/* Pagination */}
                          {usersData && usersData.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-4 border-t">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => prevPage()}
                                disabled={usersData.page === 1}
                              >
                                <ChevronDown className="w-4 h-4 rotate-180" />
                              </Button>
                              <span className="text-sm text-muted-foreground">
                                Sayfa {usersData.page} / {usersData.totalPages}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => nextPage()}
                                disabled={!usersData.hasMore}
                              >
                                <ChevronDown className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Listings Tab */}
              <TabsContent value="listings">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fadeInVariants}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        İlan Yönetimi
                      </CardTitle>
                      <CardDescription>
                        {listingsData?.total || 0} toplam ilan
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Filters */}
                      <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex-1 min-w-[200px]">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              placeholder="İlan başlığı ara..."
                              value={listingSearch}
                              onChange={(e) => setListingSearch(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <Select
                          value={listingFilters.status}
                          onValueChange={(v) => setListingFilters({ ...listingFilters, status: v as any })}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Durum" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tümü</SelectItem>
                            <SelectItem value="active">Aktif</SelectItem>
                            <SelectItem value="pending">Bekliyor</SelectItem>
                            <SelectItem value="rejected">Reddedildi</SelectItem>
                            <SelectItem value="suspended">Askıda</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Listings List */}
                      {listingsLoading ? (
                        <div className="flex items-center justify-center py-20">
                          <LoadingSpinner size="lg" />
                        </div>
                      ) : !listingsData || listingsData.data.length === 0 ? (
                        <EmptyState
                          title="İlan bulunamadı"
                          description="Filtre kriterlerinize uygun ilan yok."
                        />
                      ) : (
                        <div className="space-y-4">
                          {listingsData.data.map((listing, index) => (
                            <motion.div
                              key={listing.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.03 }}
                              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-semibold">{listing.title}</p>
                                    <StatusBadge status={listing.status} size="sm" />
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {listing.escortName} • {listing.location}
                                  </p>
                                  <p className="text-sm font-medium mt-1">
                                    ₺{listing.price.toLocaleString()}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="text-right text-sm text-muted-foreground">
                                  <p>{listing.views} görüntülenme</p>
                                  <p>{listing.reviews} değerlendirme</p>
                                </div>
                                <div className="flex gap-2">
                                  {listing.status === 'pending' && (
                                    <>
                                      <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() => handleQuickAction('approve', 'listing', listing.id)}
                                      >
                                        <CheckCircle2 className="w-4 h-4 mr-1" />
                                        Onayla
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleQuickAction('reject', 'listing', listing.id, 'Uygun değil')}
                                      >
                                        <XCircle className="w-4 h-4 mr-1" />
                                        Reddet
                                      </Button>
                                    </>
                                  )}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigate(`/escort/${listing.escortId}`)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fadeInVariants}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="w-5 h-5" />
                        Değerlendirme Yönetimi
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {reviewsLoading ? (
                        <div className="flex items-center justify-center py-20">
                          <LoadingSpinner size="lg" />
                        </div>
                      ) : !reviewsData || reviewsData.data.length === 0 ? (
                        <EmptyState title="Değerlendirme bulunamadı" />
                      ) : (
                        <div className="space-y-4">
                          {reviewsData.data.map((review) => (
                            <div key={review.id} className="p-4 border rounded-lg">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-semibold">{review.customerName}</p>
                                    <div className="flex">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`w-4 h-4 ${
                                            i < review.rating
                                              ? 'fill-sky-400 text-sky-400'
                                              : 'text-gray-300'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {review.escortName} • {review.listingTitle}
                                  </p>
                                </div>
                                <StatusBadge status={review.status} size="sm" />
                              </div>
                              <p className="text-sm mb-3">{review.comment}</p>
                              <div className="flex gap-2">
                                {review.status === 'pending' && (
                                  <>
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700"
                                      onClick={() => handleQuickAction('approve', 'review', review.id)}
                                    >
                                      Onayla
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleQuickAction('reject', 'review', review.id)}
                                    >
                                      Reddet
                                    </Button>
                                  </>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleQuickAction('hide', 'review', review.id)}
                                >
                                  <EyeOff className="w-4 h-4 mr-1" />
                                  Gizle
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Reports Tab */}
              <TabsContent value="reports">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fadeInVariants}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Şikayet Yönetimi
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {reportsLoading ? (
                        <div className="flex items-center justify-center py-20">
                          <LoadingSpinner size="lg" />
                        </div>
                      ) : !reportsData || reportsData.data.length === 0 ? (
                        <EmptyState title="Şikayet bulunamadı" />
                      ) : (
                        <div className="space-y-4">
                          {reportsData.data.map((report) => (
                            <div key={report.id} className="p-4 border rounded-lg">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-semibold">{report.targetName}</p>
                                    <Badge variant="outline">{report.type}</Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {report.reporterName} tarafından bildirildi
                                  </p>
                                </div>
                                <StatusBadge status={report.status} size="sm" />
                              </div>
                              <p className="text-sm mb-2">
                                <span className="font-medium">Sebep:</span> {report.reason}
                              </p>
                              {report.description && (
                                <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                              )}
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => updateReport.execute(report.id, 'resolved')}
                                >
                                  Çözüldü
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateReport.execute(report.id, 'dismissed')}
                                >
                                  Yok Say
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fadeInVariants}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Site Ayarları
                      </CardTitle>
                      <CardDescription>Platform genel ayarları ve konfigürasyon</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {[
                          { label: 'Site Adı', value: 'Escort Platform', type: 'text' },
                          { label: 'Site URL', value: 'https://example.com', type: 'url' },
                          { label: 'İletişim E-posta', value: 'info@example.com', type: 'email' },
                          { label: 'Para Birimi', value: 'TRY', type: 'select', options: ['TRY', 'USD', 'EUR'] },
                          { label: 'Komisyon Oranı (%)', value: '15', type: 'number' },
                        ].map((setting) => (
                          <div key={setting.label} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <Label className="font-medium">{setting.label}</Label>
                              <p className="text-sm text-muted-foreground">{setting.value}</p>
                            </div>
                            <Button variant="outline" size="sm">
                              <FileEdit className="w-4 h-4 mr-1" />
                              Düzenle
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Theme Tab */}
              <TabsContent value="theme">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fadeInVariants}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Color Palette */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Palette className="w-5 h-5" />
                          Renk Paleti
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {[
                          { name: 'Ana Renk (Primary)', default: '#8B5CF6' },
                          { name: 'İkincil Renk (Secondary)', default: '#EC4899' },
                          { name: 'Vurgu Rengi (Accent)', default: '#F59E0B' },
                          { name: 'Arkaplan (Background)', default: '#FFFFFF' },
                          { name: 'Önplan (Foreground)', default: '#0F172A' },
                          { name: 'Kenarlık (Border)', default: '#E2E8F0' },
                        ].map((color) => (
                          <div key={color.name}>
                            <label className="block text-sm font-medium mb-2">{color.name}</label>
                            <div className="flex gap-2">
                              <input
                                type="color"
                                defaultValue={color.default}
                                className="w-12 h-10 rounded cursor-pointer border"
                              />
                              <input
                                type="text"
                                defaultValue={color.default}
                                className="flex-1 px-3 py-2 border rounded-lg"
                              />
                            </div>
                          </div>
                        ))}
                        <Button className="w-full">
                          <Palette className="w-4 h-4 mr-2" />
                          Temayı Kaydet
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Typography */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Type className="w-5 h-5" />
                          Tipografi
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Ana Başlık Fontu</label>
                          <select className="w-full px-3 py-2 border rounded-lg">
                            <option>Inter</option>
                            <option>Poppins</option>
                            <option>Roboto</option>
                            <option>Open Sans</option>
                            <option>Montserrat</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Gövde Fontu</label>
                          <select className="w-full px-3 py-2 border rounded-lg">
                            <option>Inter</option>
                            <option>Poppins</option>
                            <option>Roboto</option>
                            <option>Open Sans</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Ana Başlık Boyutu</label>
                          <input
                            type="range"
                            min="24"
                            max="72"
                            defaultValue="48"
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>24px</span>
                            <span>48px</span>
                            <span>72px</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Dark Mode */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Monitor className="w-5 h-5" />
                          Görünüm Modu
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Karanlık Mod</p>
                            <p className="text-sm text-muted-foreground">Varsayılan tema</p>
                          </div>
                          <select className="px-3 py-2 border rounded-lg">
                            <option>Açık</option>
                            <option>Kapalı</option>
                            <option>Sistem</option>
                          </select>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Showcase Tab */}
              <TabsContent value="showcase">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fadeInVariants}
                >
                  <div className="space-y-6">
                    {/* Featured Escorts */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            Öne Çıkan Escortlar
                          </CardTitle>
                          <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Ekle
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            { id: '1', name: 'Ayşe Yılmaz', location: 'İstanbul', badge: 'VIP' },
                            { id: '2', name: 'Zeynep Kaya', location: 'Ankara', badge: 'Yeni' },
                            { id: '3', name: 'Elif Şahin', location: 'İzmir', badge: 'Premium' },
                          ].map((escort) => (
                            <div key={escort.id} className="p-4 border rounded-lg">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-bold">
                                  {escort.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold">{escort.name}</p>
                                  <p className="text-sm text-muted-foreground">{escort.location}</p>
                                </div>
                                <Badge className="bg-sky-500">{escort.badge}</Badge>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1">
                                  <Eye className="w-3 h-3 mr-1" />
                                  Görüntüle
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-600">
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Kaldır
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Hero Banner */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <LayoutDashboard className="w-5 h-5" />
                          Hero Banner
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Banner Başlığı</label>
                          <Input
                            defaultValue="Türkiye'nin En Güvenilir Escort Platformu"
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Banner Görseli</label>
                          <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 cursor-pointer">
                            <ImageIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Banner görselini yüklemek için tıklayın</p>
                            <p className="text-xs text-muted-foreground mt-1">Önerilen: 1920x600px</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Media Tab */}
              <TabsContent value="media">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fadeInVariants}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Image Size Settings */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Crop className="w-5 h-5" />
                          Görsel Boyutlandırma
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {[
                          { name: 'Profil Fotoğrafı', w: 400, h: 400, note: 'Kare (1:1)' },
                          { name: 'Galeri', w: 800, h: 600, note: '4:3' },
                          { name: 'Kapak Görseli', w: 1200, h: 400, note: '3:1' },
                          { name: 'Küçük Resim', w: 300, h: 300, note: 'Kare (1:1)' },
                        ].map((size) => (
                          <div key={size.name}>
                            <label className="block text-sm font-medium mb-2">{size.name}</label>
                            <div className="flex gap-2">
                              <Input
                                type="number"
                                defaultValue={size.w}
                                placeholder="Genişlik"
                                className="flex-1"
                              />
                              <span className="self-center">×</span>
                              <Input
                                type="number"
                                defaultValue={size.h}
                                placeholder="Yükseklik"
                                className="flex-1"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Önerilen: {size.note}</p>
                          </div>
                        ))}

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Otomatik Resize</p>
                            <p className="text-sm text-muted-foreground">Yüklenen resimleri otomatik boyutlandır</p>
                          </div>
                          <input type="checkbox" defaultChecked className="w-5 h-5" />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Sıkıştırma Kalitesi</p>
                            <p className="text-sm text-muted-foreground">JPEG/WebP kalitesi</p>
                          </div>
                          <input
                            type="range"
                            min="60"
                            max="100"
                            defaultValue="85"
                            className="w-24"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Image Processing Queue */}
                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <RotateCw className="w-5 h-5" />
                          İşlem Kuyruğu
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {[
                            { id: '1', name: 'profile_123.jpg', status: 'processing', progress: 75 },
                            { id: '2', name: 'gallery_456.jpg', status: 'completed', progress: 100 },
                            { id: '3', name: 'cover_789.jpg', status: 'pending', progress: 0 },
                          ].map((item) => (
                            <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <div className="flex-1 bg-muted rounded-full h-2">
                                    <div
                                      className="bg-primary h-2 rounded-full transition-all"
                                      style={{ width: `${item.progress}%` }}
                                    />
                                  </div>
                                  <span className="text-sm text-muted-foreground">{item.progress}%</span>
                                </div>
                              </div>
                              <Badge
                                variant="outline"
                                className={
                                  item.status === 'completed'
                                    ? 'bg-green-500/10 text-green-600'
                                    : item.status === 'processing'
                                      ? 'bg-blue-500/10 text-blue-600'
                                      : 'bg-gray-500/10 text-gray-600'
                                }
                              >
                                {item.status === 'completed' ? 'Tamamlandı' : item.status === 'processing' ? 'İşleniyor' : 'Bekliyor'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Pages Tab */}
              <TabsContent value="pages">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fadeInVariants}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <FileEdit className="w-5 h-5" />
                          Sayfa Yönetimi
                        </CardTitle>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Yeni Sayfa
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {[
                          { id: '1', title: 'Ana Sayfa', slug: '/', status: 'active', lastModified: '2026-01-15' },
                          { id: '2', title: 'Katalog', slug: '/catalog', status: 'active', lastModified: '2026-01-14' },
                          { id: '3', title: 'Hakkımızda', slug: '/about', status: 'active', lastModified: '2026-01-10' },
                          { id: '4', title: 'İletişim', slug: '/contact', status: 'active', lastModified: '2026-01-08' },
                          { id: '5', title: 'SSS', slug: '/faq', status: 'draft', lastModified: '2026-01-05' },
                          { id: '6', title: 'Blog', slug: '/blog', status: 'hidden', lastModified: '2026-01-01' },
                        ].map((page) => (
                          <div
                            key={page.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="cursor-grab text-muted-foreground hover:text-foreground">
                                <GripVertical className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-semibold">{page.title}</p>
                                <p className="text-sm text-muted-foreground">{page.slug}</p>
                              </div>
                              <Badge
                                variant="outline"
                                className={
                                  page.status === 'active'
                                    ? 'bg-green-500/10 text-green-600'
                                    : page.status === 'draft'
                                      ? 'bg-sky-500/10 text-sky-600'
                                      : 'bg-gray-500/10 text-gray-600'
                                }
                              >
                                {page.status === 'active' ? 'Aktif' : page.status === 'draft' ? 'Taslak' : 'Gizli'}
                              </Badge>
                              <span className="text-sm text-muted-foreground">Son düzenle: {page.lastModified}</span>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <FileEdit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Navigation Tab */}
              <TabsContent value="navigation">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fadeInVariants}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Main Navigation */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <Menu className="w-5 h-5" />
                            Ana Menü
                          </CardTitle>
                          <Button size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Menü Ekle
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {[
                            { id: '1', label: 'Ana Sayfa', url: '/', visible: true },
                            { id: '2', label: 'Escortlar', url: '/escorts', visible: true },
                            { id: '3', label: 'Katalog', url: '/catalog', visible: true },
                            { id: '4', label: 'VIP Üyelik', url: '/vip', visible: true },
                            { id: '5', label: 'Blog', url: '/blog', visible: false },
                          ].map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="cursor-grab text-muted-foreground">
                                  <GripVertical className="w-5 h-5" />
                                </div>
                                <div className="p-2 bg-primary/10 rounded-lg">
                                  <Menu className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">{item.label}</p>
                                  <p className="text-xs text-muted-foreground">{item.url}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={item.visible ? 'default' : 'secondary'}>
                                  {item.visible ? 'Görünür' : 'Gizli'}
                                </Badge>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button variant="ghost" size="sm">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <FileEdit className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-red-600">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Footer Navigation */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <GripVertical className="w-5 h-5" />
                            Footer Menü
                          </CardTitle>
                          <Button size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Menü Ekle
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {[
                            { id: '1', label: 'Hakkımızda', url: '/about' },
                            { id: '2', label: 'İletişim', url: '/contact' },
                            { id: '3', label: 'KVKK', url: '/kvkk' },
                            { id: '4', label: 'Gizlilik Politikası', url: '/privacy' },
                          ].map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                            >
                              <div className="flex items-center gap-3">
                                <GripVertical className="w-5 h-5 cursor-grab" />
                                <p className="font-medium">{item.label}</p>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm">
                                  <FileEdit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Members Tab - Most Comprehensive */}
              <TabsContent value="members">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fadeInVariants}
                >
                  <div className="space-y-6">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Crown className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">45</p>
                            <p className="text-xs text-muted-foreground">VIP Üye</p>
                          </div>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Zap className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">8</p>
                            <p className="text-xs text-muted-foreground">Aktif Boost</p>
                          </div>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-sky-500/20 rounded-lg">
                            <Clock className="w-5 h-5 text-sky-600" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">3</p>
                            <p className="text-xs text-muted-foreground">Onay Bekleyen</p>
                          </div>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-500/20 rounded-lg">
                            <Ban className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">2</p>
                            <p className="text-xs text-muted-foreground">Askıda</p>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Members List */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              <Crown className="w-5 h-5" />
                              Escort Üye Yönetimi
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              VIP tanımla, profil yönetimi ve gizlilik ayarları
                            </p>
                          </div>
                          <Select defaultValue="all">
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Filtrele" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Tümü</SelectItem>
                              <SelectItem value="vip">VIP</SelectItem>
                              <SelectItem value="standard">Standart</SelectItem>
                              <SelectItem value="new">Yeni</SelectItem>
                              <SelectItem value="suspended">Askıya Alındı</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {[
                            {
                              id: '1',
                              name: 'Ayşe Yılmaz',
                              email: 'ayse@example.com',
                              phone: '+90 532 123 4567',
                              location: 'İstanbul',
                              age: 26,
                              membership: 'vip',
                              status: 'active',
                              isVerified: true,
                              photosCount: 12,
                              views: 8540,
                              reviews: 45,
                              rating: 4.8,
                              responseRate: 92,
                              featuredPosition: 1,
                              phoneVisible: true,
                              messagesEnabled: true,
                              isBoosted: true,
                              isBanned: false,
                            },
                            {
                              id: '2',
                              name: 'Zeynep Kaya',
                              email: 'zeynep@example.com',
                              phone: '+90 533 987 6543',
                              location: 'Ankara',
                              age: 24,
                              membership: 'standard',
                              status: 'active',
                              isVerified: true,
                              photosCount: 8,
                              views: 3200,
                              reviews: 28,
                              rating: 4.6,
                              responseRate: 88,
                              featuredPosition: null,
                              phoneVisible: true,
                              messagesEnabled: true,
                              isBoosted: false,
                              isBanned: false,
                            },
                            {
                              id: '3',
                              name: 'Elif Şahin',
                              email: 'elif@example.com',
                              phone: '+90 544 555 1234',
                              location: 'İzmir',
                              age: 28,
                              membership: 'premium',
                              status: 'active',
                              isVerified: true,
                              photosCount: 15,
                              views: 12100,
                              reviews: 67,
                              rating: 4.9,
                              responseRate: 95,
                              featuredPosition: 2,
                              phoneVisible: true,
                              messagesEnabled: true,
                              isBoosted: true,
                              isBanned: false,
                            },
                            {
                              id: '4',
                              name: 'Selin Demir',
                              email: 'selin@example.com',
                              phone: '+90 555 111 2233',
                              location: 'Antalya',
                              age: 23,
                              membership: 'standard',
                              status: 'pending',
                              isVerified: false,
                              photosCount: 5,
                              views: 450,
                              reviews: 0,
                              rating: 0,
                              responseRate: 0,
                              featuredPosition: null,
                              phoneVisible: true,
                              messagesEnabled: true,
                              isBoosted: false,
                              isBanned: false,
                            },
                          ].map((member) => (
                            <div key={member.id} className="border rounded-lg p-4 space-y-4 hover:bg-muted/50">
                              {/* Header - Basic Info */}
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-bold text-lg">
                                    {member.name.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="font-bold text-lg">{member.name}</p>
                                      {member.membership === 'vip' && (
                                        <Badge className="bg-gradient-to-r from-sky-400 to-sky-600 text-white">
                                          <Crown className="w-3 h-3 mr-1" />
                                          VIP
                                        </Badge>
                                      )}
                                      {member.isVerified && (
                                        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                                          <ShieldCheck className="w-3 h-3 mr-1" />
                                          Onaylı
                                        </Badge>
                                      )}
                                      {member.isBoosted && (
                                        <Badge className="bg-blue-500 text-white">
                                          <Zap className="w-3 h-3 mr-1" />
                                          Boosted
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                      <span>{member.location}</span>
                                      <span>•</span>
                                      <span>{member.age} yaş</span>
                                      <span>•</span>
                                      <span>{member.phone}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Actions Row - 6 Key Controls */}
                              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                                {/* VIP / Membership */}
                                <div className="space-y-2">
                                  <label className="block text-xs font-medium text-muted-foreground">Üyelik</label>
                                  <Select defaultValue={member.membership}>
                                    <SelectTrigger className="h-8">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="standard">Standart</SelectItem>
                                      <SelectItem value="vip">VIP</SelectItem>
                                      <SelectItem value="premium">Premium</SelectItem>
                                      <SelectItem value="exclusive">Exclusive</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button
                                    variant={member.isBoosted ? 'default' : 'outline'}
                                    size="sm"
                                    className="w-full h-8"
                                  >
                                    <Zap className="w-3 h-3 mr-1" />
                                    Boost
                                  </Button>
                                </div>

                                {/* Featured Position */}
                                <div className="space-y-2">
                                  <label className="block text-xs font-medium text-muted-foreground">Vitrin</label>
                                  <Select value={member.featuredPosition ? member.featuredPosition.toString() : 'none'}>
                                    <SelectTrigger className="h-8">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="none">Yok</SelectItem>
                                      <SelectItem value="1">1. Sıra</SelectItem>
                                      <SelectItem value="2">2. Sıra</SelectItem>
                                      <SelectItem value="3">3. Sıra</SelectItem>
                                      <SelectItem value="4">4. Sıra</SelectItem>
                                      <SelectItem value="5">5. Sıra</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                {/* Visibility Controls */}
                                <div className="space-y-2">
                                  <label className="block text-xs font-medium text-muted-foreground">Görünürlük</label>
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs">Profil</span>
                                      <input type="checkbox" defaultChecked={member.status === 'active'} className="w-4 h-4" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs">Telefon</span>
                                      <input type="checkbox" defaultChecked={member.phoneVisible} className="w-4 h-4" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs">Mesaj</span>
                                      <input type="checkbox" defaultChecked={member.messagesEnabled} className="w-4 h-4" />
                                    </div>
                                  </div>
                                </div>

                                {/* Phone Display Mode */}
                                <div className="space-y-2">
                                  <label className="block text-xs font-medium text-muted-foreground">Telefon</label>
                                  <Select defaultValue={member.phoneVisible ? 'visible' : 'hidden'}>
                                    <SelectTrigger className="h-8">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="visible">Görünür</SelectItem>
                                      <SelectItem value="masked">Maskeli</SelectItem>
                                      <SelectItem value="hidden">Gizli</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                {/* Restrictions */}
                                <div className="space-y-2">
                                  <label className="block text-xs font-medium text-muted-foreground">Kısıtlama</label>
                                  <Button variant="outline" size="sm" className="w-full h-8">
                                    <Sliders className="w-3 h-3 mr-1" />
                                    Ayarlar
                                  </Button>
                                </div>

                                {/* Ban/Unban */}
                                <div className="space-y-2">
                                  <label className="block text-xs font-medium text-muted-foreground">İşlem</label>
                                  <div className="flex gap-1">
                                    <Button
                                      variant={member.status === 'banned' ? 'outline' : 'outline'}
                                      size="sm"
                                      className={`flex-1 h-8 ${member.status === 'banned' ? 'text-green-600' : 'text-sky-600'}`}
                                    >
                                      {member.status === 'banned' ? <Unlock className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                                    </Button>
                                    <Button variant="outline" size="sm" className="h-8 text-red-600">
                                      <UserX className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>

                              {/* Profile Stats */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t">
                                <div className="text-center p-3 bg-muted/30 rounded-lg">
                                  <p className="text-2xl font-bold">{member.photosCount}</p>
                                  <p className="text-xs text-muted-foreground">Fotoğraf</p>
                                </div>
                                <div className="text-center p-3 bg-muted/30 rounded-lg">
                                  <p className="text-2xl font-bold">{member.responseRate}%</p>
                                  <p className="text-xs text-muted-foreground">Yanıt</p>
                                </div>
                                <div className="text-center p-3 bg-muted/30 rounded-lg">
                                  <p className="text-2xl font-bold">{member.views.toLocaleString()}</p>
                                  <p className="text-xs text-muted-foreground">Görünüm</p>
                                </div>
                                <div className="text-center p-3 bg-muted/30 rounded-lg">
                                  <p className="text-2xl font-bold">{member.reviews}</p>
                                  <p className="text-xs text-muted-foreground">Değer.</p>
                                </div>
                              </div>

                              {/* Quick Actions */}
                              <div className="flex gap-2 pt-3 border-t">
                                <Button variant="outline" size="sm" className="flex-1">
                                  <FileEdit className="w-4 h-4 mr-1" />
                                  Profili Düzenle
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1">
                                  <ImageIcon className="w-4 h-4 mr-1" />
                                  Resimler ({member.photosCount})
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1">
                                  <BarChart3 className="w-4 h-4 mr-1" />
                                  Analitik
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Bulk Actions */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Toplu İşlemler</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">VIP Üyelik Ata</label>
                            <Select className="w-full mb-2">
                              <SelectTrigger>
                                <SelectValue placeholder="Üyeler seç" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Tüm Standart Üyeler</SelectItem>
                                <SelectItem value="recent">Son 30 Gün Kayıt</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button className="w-full">
                              <Crown className="w-4 h-4 mr-2" />
                              VIP Yap
                            </Button>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Boost Ver</label>
                            <Select className="w-full mb-2">
                              <SelectTrigger>
                                <SelectValue placeholder="Süre belirt" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 Saat</SelectItem>
                                <SelectItem value="6">6 Saat</SelectItem>
                                <SelectItem value="24">24 Saat</SelectItem>
                                <SelectItem value="168">7 Gün</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button className="w-full">
                              <Zap className="w-4 h-4 mr-2" />
                              Boost Başlat
                            </Button>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Görünürlük Toggle</label>
                            <Select className="w-full mb-2">
                              <SelectTrigger>
                                <SelectValue placeholder="Seçim yapın" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="phone">Telefonları Gizle</SelectItem>
                                <SelectItem value="message">Mesajları Kapat</SelectItem>
                                <SelectItem value="profile">Profilleri Gizle</SelectItem>
                                <SelectItem value="all">Tümünü Gizle</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button className="w-full" variant="destructive">
                              <EyeOff className="w-4 h-4 mr-2" />
                              Uygula
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Photo Approval Queue */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <ImageIcon className="w-5 h-5" />
                            Resim Onay Kuyruğu
                          </CardTitle>
                          <Badge className="bg-yellow-500 text-white">12 Bekleyen</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            { id: '1', escort: 'Ayşe Yılmaz', status: 'pending', uploadedAt: '5 dk önce', reportCount: 0 },
                            { id: '2', escort: 'Zeynep Kaya', status: 'flagged', uploadedAt: '10 dk önce', reportCount: 2 },
                            { id: '3', escort: 'Elif Şahin', status: 'pending', uploadedAt: '15 dk önce', reportCount: 0 },
                            { id: '4', escort: 'Selin Demir', status: 'pending', uploadedAt: '20 dk önce', reportCount: 1 },
                          ].map((photo) => (
                            <div key={photo.id} className="border rounded-lg overflow-hidden">
                              <div className="aspect-square bg-muted relative">
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                  <ImageIcon className="w-12 h-12" />
                                </div>
                                {photo.status === 'flagged' && (
                                  <div className="absolute top-2 right-2">
                                    <Badge className="bg-red-500 text-white">
                                      <AlertTriangle className="w-3 h-3 mr-1" />
                                      Şikayet
                                    </Badge>
                                  </div>
                                )}
                              </div>
                              <div className="p-3 space-y-2">
                                <p className="text-sm font-medium truncate">{photo.escort}</p>
                                <p className="text-xs text-muted-foreground">{photo.uploadedAt}</p>
                                {photo.reportCount > 0 && (
                                  <Badge variant="destructive" className="text-xs">
                                    {photo.reportCount} şikayet
                                  </Badge>
                                )}
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    className="flex-1 bg-green-600 hover:bg-green-700 h-8"
                                    onClick={() => handleQuickAction('approve', 'photo', photo.id)}
                                  >
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Onayla
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="flex-1 h-8"
                                    onClick={() => handleQuickAction('reject', 'photo', photo.id, 'Uygun değil')}
                                  >
                                    <XCircle className="w-3 h-3 mr-1" />
                                    Reddet
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Ban User Dialog */}
        <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Kullanıcıyı Engelle</DialogTitle>
              <DialogDescription>
                Bu kullanıcıyı engellemek istediğinizden emin misiniz?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedUser && (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold">
                    {selectedUser.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{selectedUser.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  </div>
                </div>
              )}
              <div>
                <Label>Engelleme Sebebi</Label>
                <Textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="Sebebi girin..."
                  className="mt-2"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setBanDialogOpen(false)}>
                İptal
              </Button>
              <Button
                variant="destructive"
                onClick={handleBanUser}
                disabled={banUser.isLoading || !banReason}
              >
                {banUser.isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Engelle
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardAuthGuard>
  );
}

export { AdminDashboard as default };
