/**
 * Admin Statistics Card Component
 *
 * Reusable card component for displaying statistical information in admin pages.
 * Provides consistent styling and structure for metrics with icons, values, and optional trend indicators.
 *
 * @module components/admin/StatCard
 * @category Components - Admin
 *
 * Features:
 * - Icon display with customizable background colors
 * - Large value display with automatic number formatting
 * - Optional trend indicator (percentage change)
 * - Optional description text
 * - Variant-based color theming (blue, green, purple, orange, yellow, red)
 * - Fully typed TypeScript interfaces
 * - Accessible with proper semantic HTML
 *
 * Variants:
 * - `blue`: Blue theme for general metrics
 * - `green`: Green theme for revenue/positive metrics
 * - `purple`: Purple theme for user/activity metrics
 * - `orange`: Orange theme for pending/warning metrics
 * - `yellow`: Yellow theme for ratings/highlights
 * - `red`: Red theme for critical/negative metrics
 *
 * @example
 * ```tsx
 * import { StatCard } from '@/components/admin/StatCard';
 * import { DollarSign } from 'lucide-react';
 *
 * // Basic usage
 * <StatCard
 *   title="Total Revenue"
 *   value="₺45,000"
 *   icon={DollarSign}
 *   variant="green"
 * />
 *
 * // With trend and description
 * <StatCard
 *   title="Active Users"
 *   value="1,234"
 *   icon={Users}
 *   variant="blue"
 *   trend="+12% from last month"
 *   description="Monthly active users"
 * />
 *
 * // With custom formatting
 * <StatCard
 *   title="Average Rating"
 *   value="⭐ 4.8"
 *   icon={Star}
 *   variant="yellow"
 * />
 * ```
 */

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

/**
 * Props for the StatCard component
 */
export interface StatCardProps {
  /**
   * The title/label of the statistic
   * @example "Total Revenue", "Active Users"
   */
  title: string;

  /**
   * The value to display (can be string or number)
   * Numbers will be formatted with toLocaleString() if numeric
   * @example "₺45,000", 1234, "⭐ 4.8"
   */
  value: string | number;

  /**
   * Lucide icon component to display
   * @example DollarSign, Users, TrendingUp
   */
  icon: LucideIcon;

  /**
   * Optional trend indicator text
   * @example "+12% from last month", "-5% decrease"
   */
  trend?: string;

  /**
   * Type of trend indicator (affects color)
   * @default "positive"
   */
  trendType?: 'positive' | 'negative' | 'neutral';

  /**
   * Optional description text
   * @example "Monthly active users", "Last 30 days"
   */
  description?: string;

  /**
   * Color variant for the icon background
   * @default "blue"
   */
  variant?: 'blue' | 'green' | 'purple' | 'orange' | 'yellow' | 'red' | 'sky';

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Variant color configurations for icon backgrounds and text
 */
const variantStyles = {
  blue: {
    background: 'bg-blue-100',
    icon: 'text-blue-600',
    value: 'text-blue-600',
  },
  green: {
    background: 'bg-green-100',
    icon: 'text-green-600',
    value: 'text-green-600',
  },
  purple: {
    background: 'bg-purple-100',
    icon: 'text-purple-600',
    value: 'text-purple-600',
  },
  orange: {
    background: 'bg-orange-100',
    icon: 'text-orange-600',
    value: 'text-orange-600',
  },
  yellow: {
    background: 'bg-yellow-100',
    icon: 'text-yellow-600',
    value: 'text-yellow-600',
  },
  red: {
    background: 'bg-red-100',
    icon: 'text-red-600',
    value: 'text-red-600',
  },
  sky: {
    background: 'bg-sky-100',
    icon: 'text-sky-600',
    value: 'text-sky-600',
  },
} as const;

/**
 * StatCard Component
 *
 * Displays a statistical metric with icon, title, value, and optional trend/description.
 * Used across admin pages for consistent presentation of metrics.
 */
export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendType = 'positive',
  description,
  variant = 'blue',
  className,
}: StatCardProps) {
  const styles = variantStyles[variant];

  // Format numeric values
  const formattedValue = typeof value === 'number'
    ? value.toLocaleString()
    : value;

  // Determine trend color based on type
  const trendColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600',
  };
  const trendColorClass = trendColors[trendType];

  return (
    <Card className={cn('transition-shadow hover:shadow-lg', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className={cn('text-2xl font-bold mt-1', styles.value)}>
              {formattedValue}
            </p>
            {trend && (
              <p className={cn('text-xs mt-1', trendColorClass)}>{trend}</p>
            )}
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ml-4',
            styles.background
          )}>
            <Icon className={cn('w-6 h-6', styles.icon)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default StatCard;
