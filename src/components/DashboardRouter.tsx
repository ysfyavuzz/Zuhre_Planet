/**
 * Dashboard Router Component
 *
 * Role-based dashboard router that redirects users to their appropriate dashboard.
 * Shows unified dashboard pages with role-specific content.
 *
 * @module components/DashboardRouter
 * @category Components - Dashboard
 *
 * Features:
 * - Automatic role detection from auth context
 * - Role-based routing (escort vs customer vs admin)
 * - Unified pages with role-specific content
 * - Profile completeness prompts
 * - Quick navigation cards
 * - VIP upgrade CTA
 * - Responsive design
 * - Optimized with React hooks
 *
 * @example
 * ```tsx
 * // Route: /dashboard
 * <DashboardRouter />
 * ```
 */

import { useEffect, useCallback, useMemo, memo } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  User,
  Calendar,
  MessageSquare,
  Heart,
  Star,
  BarChart3,
  Settings,
  Crown,
  Shield,
  TrendingUp,
  ChevronRight,
  UserCheck,
  CheckCircle2,
  MapPin,
  Phone,
  Camera,
  FileEdit,
} from 'lucide-react';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type UserRole = 'customer' | 'escort' | 'admin';

/**
 * Dashboard action card
 */
interface DashboardAction {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  badge?: string | number;
  color: string;
  primary?: boolean;
}

/**
 * Dashboard router props
 */
interface DashboardRouterProps {
  customerDashboard?: React.ComponentType;
  escortDashboard?: React.ComponentType;
  adminDashboard?: React.ComponentType;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Role-based dashboard actions
 * Memoized to prevent unnecessary re-creations
 */
const CUSTOMER_ACTIONS: DashboardAction[] = [
  {
    title: 'İlanlara Göz At',
    description: 'Yeni escort profillerini keşfet',
    icon: User,
    href: '/escorts',
    color: 'bg-pink-500/10 text-pink-600',
  },
  {
    title: 'Favorilerim',
    description: 'Kaydedilen escort profillerini gör',
    icon: Heart,
    href: '/favorites',
    color: 'bg-red-500/10 text-red-600',
    badge: 12,
  },
  {
    title: 'Randevularım',
    description: 'Yaklaşan ve geçmiş randevular',
    icon: Calendar,
    href: '/appointments',
    color: 'bg-blue-500/10 text-blue-600',
    badge: 3,
  },
  {
    title: 'Mesajlar',
    description: 'Escortlar ile konuşun',
    icon: MessageSquare,
    href: '/messages',
    color: 'bg-purple-500/10 text-purple-600',
    badge: 5,
  },
  {
    title: 'Değerlendirmelerim',
    description: 'Yaptığınız değerlendirmeleri görün',
    icon: Star,
    href: '/reviews',
    color: 'bg-yellow-500/10 text-yellow-600',
  },
  {
    title: 'Analitik',
    description: 'Aktivite ve harcama istatistikleri',
    icon: BarChart3,
    href: '/analytics',
    color: 'bg-green-500/10 text-green-600',
  },
];

const ESCORT_ACTIONS: DashboardAction[] = [
  {
    title: 'Profilim',
    description: 'Profil bilgilerinizi yönetin',
    icon: User,
    href: '/escort/dashboard',
    color: 'bg-blue-500/10 text-blue-600',
    primary: true,
  },
  {
    title: 'Galeri',
    description: 'Fotoğraflarınızı yönetin',
    icon: Camera,
    href: '/escort/dashboard?tab=gallery',
    color: 'bg-purple-500/10 text-purple-600',
  },
  {
    title: 'Randevular',
    description: 'Randevu taleplerini yönetin',
    icon: Calendar,
    href: '/escort/dashboard?tab=appointments',
    color: 'bg-green-500/10 text-green-600',
    badge: 3,
  },
  {
    title: 'Mesajlar',
    description: 'Müşteriler ile konuşun',
    icon: MessageSquare,
    href: '/messages',
    color: 'bg-cyan-500/10 text-cyan-600',
    badge: 8,
  },
  {
    title: 'Değerlendirmeler',
    description: 'Hakkınızdaki yorumları okuyun',
    icon: Star,
    href: '/reviews',
    color: 'bg-yellow-500/10 text-yellow-600',
  },
  {
    title: 'Analitik',
    description: 'Performans metriklerinizi görün',
    icon: BarChart3,
    href: '/analytics',
    color: 'bg-indigo-500/10 text-indigo-600',
  },
  {
    title: 'İlanı Yükselt',
    description: 'Daha fazla görünür olun',
    icon: TrendingUp,
    href: '/escort/market',
    color: 'bg-orange-500/10 text-orange-600',
  },
];

const ADMIN_ACTIONS: DashboardAction[] = [
  {
    title: 'Yönetici Paneli',
    description: 'Platform yönetimi',
    icon: Shield,
    href: '/admin/dashboard',
    color: 'bg-red-500/10 text-red-600',
    primary: true,
  },
  {
    title: 'Kullanıcılar',
    description: 'Kullanıcı hesaplarını yönetin',
    icon: User,
    href: '/admin/dashboard?tab=users',
    color: 'bg-blue-500/10 text-blue-600',
  },
  {
    title: 'İlanlar',
    description: 'İlan onay ve kontrolü',
    icon: FileEdit,
    href: '/admin/dashboard?tab=listings',
    color: 'bg-purple-500/10 text-purple-600',
  },
  {
    title: 'Şikayetler',
    description: 'Bildirimleri inceleyin',
    icon: Shield,
    href: '/admin/dashboard?tab=reports',
    color: 'bg-orange-500/10 text-orange-600',
  },
  {
    title: 'Ayarlar',
    description: 'Sistem konfigürasyonu',
    icon: Settings,
    href: '/admin/dashboard?tab=settings',
    color: 'bg-gray-500/10 text-gray-600',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Quick stat card component
 * Memoized for performance
 */
const QuickStatCard = memo(
  ({
    label,
    value,
    icon: Icon,
    color,
  }: {
    label: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
  }) => (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </Card>
  )
);
QuickStatCard.displayName = 'QuickStatCard';

/**
 * Action card component
 * Memoized for performance
 */
const ActionCard = memo(
  ({
    action,
    index,
  }: {
    action: DashboardAction;
    index: number;
  }) => {
    const Icon = action.icon;

    return (
      <motion.div
        key={action.href}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Link href={action.href}>
          <Card
            className={`p-6 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${
              action.primary ? 'ring-2 ring-primary' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${action.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
                {action.badge && <Badge className="mt-2">{action.badge}</Badge>}
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            </div>
          </Card>
        </Link>
      </motion.div>
    );
  }
);
ActionCard.displayName = 'ActionCard';

/**
 * VIP upgrade CTA component
 * Memoized for performance
 */
const VIPUpgradeCTA = memo(
  ({ isEscort }: { isEscort: boolean }) => {
    return (
      <Card className="mt-8 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30">
        <CardContent className="p-8 text-center">
          <Crown className="w-16 h-16 mx-auto mb-4 text-amber-500" />
          <h3 className="text-2xl font-bold mb-2">VIP Üyeliğe Geçin</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {isEscort
              ? 'Profilinizi öne çıkarın, daha fazla randevu alın ve gelirinizi artırın'
              : 'Sınırsız mesajlaşma, VIP escortlara erişim ve özel ayrıcalıklar'}
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/pricing">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500">
                <Crown className="w-4 h-4 mr-2" />
                VIP'e Geç
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }
);
VIPUpgradeCTA.displayName = 'VIPUpgradeCTA';

/**
 * Profile completeness warning component
 * Memoized for performance
 */
const ProfileCompletenessWarning = memo(() => {
  return (
    <Card className="mt-8 border-blue-200 bg-blue-50/50 dark:bg-blue-900/20">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <UserCheck className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Profilinizi Tamamlayın</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Profiliniz %70 tamamlandı. Daha fazla randevu almak için galerinizi ve
              profil bilgilerinizi güncelleyin.
            </p>
            <div className="flex gap-2">
              <Link href="/escort/dashboard?tab=gallery">
                <Button size="sm" variant="outline">
                  <Camera className="w-4 h-4 mr-1" />
                  Galeri
                </Button>
              </Link>
              <Link href="/escort/dashboard?tab=profile">
                <Button size="sm">
                  <FileEdit className="w-4 h-4 mr-1" />
                  Profili Düzenle
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
ProfileCompletenessWarning.displayName = 'ProfileCompletenessWarning';

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * DashboardRouter component
 * Redirects to appropriate dashboard based on user role
 *
 * Optimized with:
 * - useEffect for side effects
 * - useCallback for event handlers
 * - useMemo for computed values
 * - Memoized sub-components
 */
export function DashboardRouter({
  customerDashboard: CustomerDashboardComponent,
  escortDashboard: EscortDashboardComponent,
  adminDashboard: AdminDashboardComponent,
}: DashboardRouterProps) {
  const { user, userRole, isAuthenticated } = useAuth();

  // Redirect to appropriate dashboard
  useEffect(() => {
    if (!isAuthenticated) {
      // Not logged in, redirect to login
      window.location.href = '/login-client';
      return;
    }

    // If user has a specific dashboard URL, don't redirect
    const currentPath = window.location.pathname;
    if (currentPath.includes('/dashboard')) {
      return;
    }

    // If we're on the root dashboard path, show unified dashboard (don't redirect)
    // The unified dashboard will handle role-specific content
  }, [isAuthenticated, userRole]);

  // Determine user role and actions - memoized
  const { isEscort, isAdmin, actions, stats } = useMemo(() => {
    const role = userRole || 'customer';
    const isEscortValue = role === 'escort';
    const isAdminValue = role === 'admin';

    const actionsList = isAdminValue
      ? ADMIN_ACTIONS
      : isEscortValue
        ? ESCORT_ACTIONS
        : CUSTOMER_ACTIONS;

    const statsValue = isEscortValue
      ? {
          views: 1250,
          revenue: '₺12,500',
          appointments: 12,
          rating: 4.8,
          unreadMessages: 8,
        }
      : isAdminValue
        ? {
            totalUsers: 15420,
            activeListings: 723,
            pendingReviews: 28,
            revenue: '₺185,000',
          }
        : {
            favorites: 12,
            upcomingAppointments: 2,
            unreadMessages: 5,
            totalBookings: 24,
            spent: '₺4,500',
          };

    return {
      isEscort: isEscortValue,
      isAdmin: isAdminValue,
      actions: actionsList,
      stats: statsValue,
    };
  }, [userRole]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 border-b border-border/50">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  {user?.name?.charAt(0) || <User className="w-6 h-6" />}
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tighter">
                    Hoş Geldin, {user?.name || 'Kullanıcı'} 👋
                  </h1>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        isAdmin
                          ? 'bg-red-500 text-white'
                          : isEscort
                            ? 'bg-purple-500 text-white'
                            : 'bg-blue-500 text-white'
                      }
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      {isAdmin ? 'Admin' : isEscort ? 'Escort' : 'Müşteri'}
                    </Badge>
                    {user?.membership === 'vip' && (
                      <Badge className="bg-amber-500 text-white">
                        <Crown className="w-3 h-3 mr-1" />
                        VIP
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">
                {isAdmin
                  ? 'Platform yönetimi ve sistem ayarları'
                  : isEscort
                    ? 'Profilinizi, randevularınızı ve istatistiklerinizi yönetin'
                    : 'Favorileriniz, randevularınız ve mesajlarınız burada'}
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/settings'}>
                <Settings className="w-4 h-4 mr-2" />
                Ayarlar
              </Button>
              {isEscort && (
                <Button
                  className="bg-gradient-to-r from-primary to-accent"
                  onClick={() => window.location.href = '/escort/market'}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  İlanı Yükselt
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-6 border-b border-border/50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {isEscort ? (
              <>
                <QuickStatCard
                  label="Profil Görüntülenme"
                  value={stats.views}
                  icon={User}
                  color="bg-blue-500/10 text-blue-600"
                />
                <QuickStatCard
                  label="Bu Ay Gelir"
                  value={stats.revenue}
                  icon={TrendingUp}
                  color="bg-green-500/10 text-green-600"
                />
                <QuickStatCard
                  label="Randevu"
                  value={stats.appointments}
                  icon={Calendar}
                  color="bg-purple-500/10 text-purple-600"
                />
                <QuickStatCard
                  label="Puan"
                  value={stats.rating}
                  icon={Star}
                  color="bg-yellow-500/10 text-yellow-600"
                />
              </>
            ) : (
              <>
                <QuickStatCard
                  label="Favori"
                  value={stats.favorites}
                  icon={Heart}
                  color="bg-red-500/10 text-red-600"
                />
                <QuickStatCard
                  label="Gelecek Randevu"
                  value={stats.upcomingAppointments}
                  icon={Calendar}
                  color="bg-blue-500/10 text-blue-600"
                />
                <QuickStatCard
                  label="Okunmamış Mesaj"
                  value={stats.unreadMessages}
                  icon={MessageSquare}
                  color="bg-purple-500/10 text-purple-600"
                />
                <QuickStatCard
                  label="Toplam Randevu"
                  value={stats.totalBookings}
                  icon={CheckCircle2}
                  color="bg-green-500/10 text-green-600"
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">
            {isAdmin
              ? 'Yönetici Paneli'
              : isEscort
                ? 'Escort Paneli'
                : 'Müşteri Paneli'}
          </h2>
          <p className="text-muted-foreground">
            {isAdmin
              ? 'Tüm yönetim araçlarınız tek bir yerde'
              : isEscort
                ? 'Tüm yönetim araçlarınız tek bir yerde'
                : 'Platformdaki tüm aktivitenizi buradan takip edin'}
          </p>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actions.map((action, index) => (
            <ActionCard key={action.href} action={action} index={index} />
          ))}
        </div>

        {/* Upgrade CTA for non-VIP users */}
        {user?.membership !== 'vip' && <VIPUpgradeCTA isEscort={isEscort} />}

        {/* Profile Completeness Warning for Escorts */}
        {isEscort && <ProfileCompletenessWarning />}
      </div>
    </div>
  );
}

export { DashboardRouter as default };
