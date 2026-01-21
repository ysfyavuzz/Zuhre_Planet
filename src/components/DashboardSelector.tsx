/**
 * Dashboard Selector Component
 *
 * Role selection component for users who have both customer and escort accounts.
 * Provides easy switching between different dashboards.
 *
 * @module components/DashboardSelector
 * @category Components - Navigation
 *
 * Features:
 * - Visual role selector with icons
 * - Quick dashboard switching
 * - Role-based menu items
 * - Active role indicator
 * - Compact and expanded modes
 * - Optimized re-renders with React.memo
 * - Type-safe props and hooks
 *
 * @example
 * ```tsx
 * // Full selector
 * <DashboardSelector mode="full" />
 *
 * // Compact selector for navigation
 * <DashboardSelector mode="compact" />
 *
 * // Minimal selector
 * <DashboardSelector mode="minimal" />
 * ```
 */

import { useState, useCallback, useMemo, memo } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import {
  User,
  Crown,
  Briefcase,
  Heart,
  Calendar,
  MessageSquare,
  BarChart3,
  Star,
  Settings,
  ChevronDown,
  Shield,
  TrendingUp,
  Home,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Selector display modes
 */
export type SelectorMode = 'full' | 'compact' | 'minimal' | 'dropdown';

/**
 * User role types
 */
type UserRole = 'customer' | 'escort' | 'admin';

/**
 * Dashboard option
 */
interface DashboardOption {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  badge?: string | number;
  color: string;
  role: UserRole;
}

/**
 * Dashboard selector props
 */
interface DashboardSelectorProps {
  /** Display mode */
  mode?: SelectorMode;
  /** Current active role override */
  activeRole?: UserRole;
  /** Custom class name */
  className?: string;
  /** Show role badges */
  showBadges?: boolean;
  /** On role change callback */
  onRoleChange?: (role: UserRole) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Dashboard options based on role
 * Memoized to prevent unnecessary re-creations
 */
const DASHBOARD_OPTIONS: Record<UserRole, DashboardOption[]> = {
  customer: [
    {
      id: 'main',
      title: 'Ana Panel',
      description: 'Genel bakış ve hızlı erişim',
      icon: Home,
      href: '/dashboard',
      color: 'bg-blue-500/10 text-blue-600',
      role: 'customer',
    },
    {
      id: 'favorites',
      title: 'Favoriler',
      description: 'Kaydedilen escortlar',
      icon: Heart,
      href: '/favorites',
      badge: 24,
      color: 'bg-red-500/10 text-red-600',
      role: 'customer',
    },
    {
      id: 'appointments',
      title: 'Randevular',
      description: 'Yaklaşan ve geçmiş randevular',
      icon: Calendar,
      href: '/appointments',
      badge: 3,
      color: 'bg-green-500/10 text-green-600',
      role: 'customer',
    },
    {
      id: 'messages',
      title: 'Mesajlar',
      description: 'Escortlarla konuşun',
      icon: MessageSquare,
      href: '/messages',
      badge: 5,
      color: 'bg-purple-500/10 text-purple-600',
      role: 'customer',
    },
  ],
  escort: [
    {
      id: 'main',
      title: 'Escort Paneli',
      description: 'Profil ve randevu yönetimi',
      icon: Briefcase,
      href: '/escort/dashboard',
      color: 'bg-purple-500/10 text-purple-600',
      role: 'escort',
    },
    {
      id: 'profile',
      title: 'Profilim',
      description: 'Profil bilgilerini düzenle',
      icon: User,
      href: '/escort/dashboard?tab=profile',
      color: 'bg-blue-500/10 text-blue-600',
      role: 'escort',
    },
    {
      id: 'analytics',
      title: 'Analitik',
      description: 'Performans metrikleri',
      icon: BarChart3,
      href: '/analytics',
      color: 'bg-green-500/10 text-green-600',
      role: 'escort',
    },
    {
      id: 'reviews',
      title: 'Değerlendirmeler',
      description: 'Hakkındaki yorumlar',
      icon: Star,
      href: '/reviews',
      badge: 45,
      color: 'bg-yellow-500/10 text-yellow-600',
      role: 'escort',
    },
  ],
  admin: [
    {
      id: 'admin',
      title: 'Yönetici Paneli',
      description: 'Platform yönetimi',
      icon: Shield,
      href: '/admin/dashboard',
      color: 'bg-red-500/10 text-red-600',
      role: 'admin',
    },
    {
      id: 'settings',
      title: 'Ayarlar',
      description: 'Sistem konfigürasyonu',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-gray-500/10 text-gray-600',
      role: 'admin',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS (Memoized for performance)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Dashboard option card component
 * Memoized to prevent unnecessary re-renders
 */
const DashboardOptionCard = memo(
  ({ option, index }: { option: DashboardOption; index: number }) => {
    const Icon = option.icon;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Link href={option.href}>
          <Card className="p-5 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${option.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold">{option.title}</h3>
                  {option.badge && <Badge variant="secondary">{option.badge}</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
            </div>
          </Card>
        </Link>
      </motion.div>
    );
  }
);
DashboardOptionCard.displayName = 'DashboardOptionCard';

/**
 * Full dashboard selector component
 * Memoized to prevent unnecessary re-renders
 */
const FullSelector = memo(
  ({
    options,
    onRoleChange,
  }: {
    options: DashboardOption[];
    onRoleChange?: (role: UserRole) => void;
  }) => {
    const { user } = useAuth();
    const hasBothRoles = user?.hasCustomerAccount && user?.hasEscortAccount;

    return (
      <div className="space-y-6">
        {/* Role Switcher - Only show if user has both roles */}
        {hasBothRoles && (
          <div className="flex items-center gap-3 p-1 bg-muted rounded-lg">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => onRoleChange?.('customer')}
            >
              <User className="w-4 h-4 mr-2" />
              Müşteri Paneli
            </Button>
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => onRoleChange?.('escort')}
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Escort Paneli
            </Button>
          </div>
        )}

        {/* Dashboard Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((option, index) => (
            <DashboardOptionCard key={option.id} option={option} index={index} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <Link href="/analytics" className="flex-1">
            <Button variant="outline" className="w-full justify-start">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analitik
            </Button>
          </Link>
          <Link href="/reviews" className="flex-1">
            <Button variant="outline" className="w-full justify-start">
              <Star className="w-4 h-4 mr-2" />
              Değerlendirmeler
            </Button>
          </Link>
          <Link href="/settings" className="flex-1">
            <Button variant="outline" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Ayarlar
            </Button>
          </Link>
        </div>
      </div>
    );
  }
);
FullSelector.displayName = 'FullSelector';

/**
 * Compact dashboard selector component
 * Memoized to prevent unnecessary re-renders
 */
const CompactSelector = memo(
  ({
    options,
  }: {
    options: DashboardOption[];
  }) => {
    return (
      <div className="flex items-center gap-2">
        {options.slice(0, 3).map((option) => {
          const Icon = option.icon;
          return (
            <Link key={option.id} href={option.href}>
              <Button variant="ghost" size="sm" className="relative">
                <Icon className="w-4 h-4 mr-2" />
                {option.title}
                {option.badge && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
                    {option.badge}
                  </Badge>
                )}
              </Button>
            </Link>
          );
        })}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              Daha Fazla
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {options.slice(3).map((option) => {
              const Icon = option.icon;
              return (
                <DropdownMenuItem key={option.id} asChild>
                  <Link href={option.href} className="flex items-center gap-3 cursor-pointer">
                    <Icon className="w-4 h-4" />
                    <div className="flex-1">
                      <p className="font-medium">{option.title}</p>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </div>
                    {option.badge && <Badge variant="secondary">{option.badge}</Badge>}
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
);
CompactSelector.displayName = 'CompactSelector';

/**
 * Dropdown menu selector component
 * Memoized to prevent unnecessary re-renders
 */
const DropdownSelector = memo(
  ({
    onRoleChange,
  }: {
    onRoleChange?: (role: UserRole) => void;
  }) => {
    const { user, userRole } = useAuth();
    const isEscort = userRole === 'escort';

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Shield className="w-4 h-4" />
            <span>{isEscort ? 'Escort Paneli' : 'Müşteri Paneli'}</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Dashboard Seçimi</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Customer Dashboard */}
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="flex items-center gap-3 cursor-pointer">
              <User className="w-4 h-4 text-blue-500" />
              <div>
                <p className="font-medium">Müşteri Paneli</p>
                <p className="text-xs text-muted-foreground">Favoriler ve randevular</p>
              </div>
            </Link>
          </DropdownMenuItem>

          {/* Escort Dashboard */}
          <DropdownMenuItem asChild>
            <Link href="/escort/dashboard" className="flex items-center gap-3 cursor-pointer">
              <Briefcase className="w-4 h-4 text-purple-500" />
              <div>
                <p className="font-medium">Escort Paneli</p>
                <p className="text-xs text-muted-foreground">Profil ve analitik</p>
              </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Shared Pages */}
          <DropdownMenuItem asChild>
            <Link href="/analytics" className="flex items-center gap-3 cursor-pointer">
              <BarChart3 className="w-4 h-4" />
              Analitik
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/reviews" className="flex items-center gap-3 cursor-pointer">
              <Star className="w-4 h-4" />
              Değerlendirmeler
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/messages" className="flex items-center gap-3 cursor-pointer">
              <MessageSquare className="w-4 h-4" />
              Mesajlar
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);
DropdownSelector.displayName = 'DropdownSelector';

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * DashboardSelector component
 *
 * Main component that renders different selector modes
 * Optimized with useCallback and useMemo
 */
export function DashboardSelector({
  mode = 'dropdown',
  activeRole,
  className = '',
  showBadges = true,
  onRoleChange,
}: DashboardSelectorProps) {
  const { user, userRole } = useAuth();
  const [currentRole, setCurrentRole] = useState<UserRole>(
    activeRole || userRole || 'customer'
  );

  // Get dashboard options for current role - memoized
  const options = useMemo(() => {
    return DASHBOARD_OPTIONS[currentRole] || DASHBOARD_OPTIONS.customer;
  }, [currentRole]);

  // Handle role change - memoized with useCallback
  const handleRoleChange = useCallback(
    (role: UserRole) => {
      setCurrentRole(role);
      onRoleChange?.(role);
    },
    [onRoleChange]
  );

  // Render different modes - using simple conditionals for performance
  if (mode === 'full') {
    return (
      <div className={className}>
        <FullSelector options={options} onRoleChange={handleRoleChange} />
      </div>
    );
  }

  if (mode === 'compact') {
    return (
      <div className={className}>
        <CompactSelector options={options} />
      </div>
    );
  }

  // Default to dropdown mode
  return (
    <div className={className}>
      <DropdownSelector onRoleChange={handleRoleChange} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hook to use dashboard selector functionality
 * Returns memoized values to prevent unnecessary recalculations
 */
export function useDashboardSelector() {
  const { user, userRole } = useAuth();

  return useMemo(
    () => ({
      userRole,
      hasCustomerAccount: user?.hasCustomerAccount || userRole === 'customer',
      hasEscortAccount: user?.hasEscortAccount || userRole === 'escort',
      hasBothRoles: user?.hasCustomerAccount && user?.hasEscortAccount,
      currentDashboard: userRole === 'escort' ? '/escort/dashboard' : '/dashboard',
      analyticsDashboard: '/analytics',
      reviewsDashboard: '/reviews',
    }),
    [user, userRole]
  );
}

export { DashboardSelector as default };
