/**
 * StatCard Component
 *
 * A reusable statistic card component for admin dashboards.
 * Displays key metrics with icons, values, and optional trend indicators.
 *
 * @module components/admin/StatCard
 * @category Components - Admin
 *
 * Features:
 * - Flexible variant system for different color themes
 * - Icon support via Lucide React
 * - Optional trend indicators for showing growth/decline
 * - Optional description text
 * - Responsive design with hover effects
 * - Fully typed with TypeScript
 * - Accessible with ARIA attributes
 *
 * Variants:
 * - `default` (blue) - General purpose statistics
 * - `success` (green) - Positive metrics like revenue, growth
 * - `warning` (yellow/orange) - Neutral or attention metrics
 * - `danger` (red) - Negative or critical metrics
 * - `info` (purple) - Informational statistics
 *
 * @example
 * ```tsx
 * import { StatCard } from '@/components/admin/StatCard';
 * import { DollarSign } from 'lucide-react';
 *
 * function Dashboard() {
 *   return (
 *     <StatCard
 *       title="Toplam Gelir"
 *       value="₺125,000"
 *       icon={DollarSign}
 *       variant="success"
 *       trend="+12%"
 *       description="geçen aya göre"
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Without trend and description
 * <StatCard
 *   title="Aktif Kullanıcı"
 *   value="8,234"
 *   icon={Users}
 *   variant="info"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With negative trend
 * <StatCard
 *   title="Bekleyen İşlem"
 *   value="3"
 *   icon={Clock}
 *   variant="warning"
 *   trend="-5%"
 *   description="son hafta"
 * />
 * ```
 */

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

/**
 * Color variant type for StatCard component
 */
export type StatCardVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

/**
 * Props interface for StatCard component
 */
export interface StatCardProps {
  /**
   * The title/label of the statistic
   * @example "Toplam Gelir", "Aktif Kullanıcı"
   */
  title: string;

  /**
   * The main value to display
   * Can be a string or number
   * @example "₺125,000", 8234, "45.2K"
   */
  value: string | number;

  /**
   * Lucide React icon component
   * @example DollarSign, Users, TrendingUp
   */
  icon: LucideIcon;

  /**
   * Optional trend indicator
   * Typically shows percentage change
   * @example "+12%", "-5%", "+8% geçen aya göre"
   */
  trend?: string;

  /**
   * Optional description text
   * Additional context for the statistic
   * @example "geçen aya göre", "son 7 gün"
   */
  description?: string;

  /**
   * Color variant for the card
   * @default "default"
   */
  variant?: StatCardVariant;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Variant configuration mapping
 */
const variantConfig: Record<StatCardVariant, { bg: string; text: string; trend: string }> = {
  default: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    trend: 'text-blue-600',
  },
  success: {
    bg: 'bg-green-100',
    text: 'text-green-600',
    trend: 'text-green-600',
  },
  warning: {
    bg: 'bg-orange-100',
    text: 'text-orange-600',
    trend: 'text-orange-600',
  },
  danger: {
    bg: 'bg-red-100',
    text: 'text-red-600',
    trend: 'text-red-600',
  },
  info: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    trend: 'text-purple-600',
  },
};

/**
 * StatCard Component
 *
 * Displays a statistic card with icon, value, and optional trend information.
 * Used in admin dashboards for showing key metrics and KPIs.
 *
 * @param props - Component props
 * @returns Rendered StatCard component
 */
export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  variant = 'default',
  className,
}: StatCardProps) {
  const config = variantConfig[variant];

  return (
    <Card className={cn('hover:shadow-lg transition-shadow', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {typeof value === 'number' ? value.toLocaleString('tr-TR') : value}
            </p>
            {(trend || description) && (
              <p className="text-xs mt-1">
                {trend && (
                  <span className={cn('font-medium', config.trend)}>
                    {trend}
                  </span>
                )}
                {trend && description && ' '}
                {description && (
                  <span className="text-muted-foreground">
                    {description}
                  </span>
                )}
              </p>
            )}
          </div>
          <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', config.bg)}>
            <Icon className={cn('w-6 h-6', config.text)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
