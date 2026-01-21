/**
 * KPI Card Component
 *
 * Displays a single Key Performance Indicator with trend information.
 *
 * @module components/KPICard
 * @category Components - Analytics
 */

import { MetricValue } from '@/types/analytics';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface KPICardProps {
  title: string;
  value: MetricValue;
  icon: LucideIcon;
  color: string;
  format?: 'number' | 'currency' | 'percentage' | 'duration';
  className?: string;
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-600',
    border: 'border-blue-200',
  },
  green: {
    bg: 'bg-green-500/10',
    text: 'text-green-600',
    border: 'border-green-200',
  },
  yellow: {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-600',
    border: 'border-yellow-200',
  },
  red: {
    bg: 'bg-red-500/10',
    text: 'text-red-600',
    border: 'border-red-200',
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-600',
    border: 'border-purple-200',
  },
  orange: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-600',
    border: 'border-orange-200',
  },
  pink: {
    bg: 'bg-pink-500/10',
    text: 'text-pink-600',
    border: 'border-pink-200',
  },
  indigo: {
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-600',
    border: 'border-indigo-200',
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-600',
    border: 'border-cyan-200',
  },
};

export function KPICard({
  title,
  value,
  icon: Icon,
  color,
  format = 'number',
  className = '',
}: KPICardProps) {
  const colors = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-card border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-3 rounded-lg ${colors.bg} ${colors.text}`}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Trend indicator */}
        {value.trend !== 'na' && value.trendPercent !== undefined && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              value.trend === 'up' ? 'text-green-600' : value.trend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}
          >
            {value.trend === 'up' && <TrendingUp className="w-4 h-4" />}
            {value.trend === 'down' && <TrendingDown className="w-4 h-4" />}
            {value.trend === 'neutral' && <Minus className="w-4 h-4" />}
            <span>{Math.abs(value.trendPercent).toFixed(1)}%</span>
          </div>
        )}
      </div>

      <div>
        <p className="text-2xl font-bold mb-1">{value.formattedValue}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>

      {value.previousValue && (
        <p className="text-xs text-muted-foreground mt-2">
          Önceki: {value.previousValue.toLocaleString('tr-TR')}
        </p>
      )}
    </motion.div>
  );
}

export { KPICard as default };
