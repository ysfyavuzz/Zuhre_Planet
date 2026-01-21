/**
 * Real-time Stats Component
 *
 * Displays real-time analytics data with live indicators.
 *
 * @module components/RealtimeStats
 * @category Components - Analytics
 */

import { RealtimeData } from '@/types/analytics';
import { Card } from '@/components/ui/card';
import { Activity, Users, Eye, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

interface RealtimeStatsProps {
  data: RealtimeData;
  className?: string;
}

export function RealtimeStats({ data, className = '' }: RealtimeStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r from-primary/10 to-accent/10 border rounded-xl p-4 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative">
          <Activity className="w-5 h-5 text-primary" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
          </span>
        </div>
        <h3 className="font-bold">Canlı İstatistikler</h3>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Current Visitors */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{data.currentVisitors}</p>
            <p className="text-xs text-muted-foreground">Aktif Ziyaretçi</p>
          </div>
        </div>

        {/* Active Users */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <Activity className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{data.activeUsers}</p>
            <p className="text-xs text-muted-foreground">Aktif Kullanıcı</p>
          </div>
        </div>

        {/* Page Views */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Eye className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{data.pageViewsLastHour}</p>
            <p className="text-xs text-muted-foreground">Son Saat</p>
          </div>
        </div>

        {/* Top Pages */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <Globe className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{data.topPages.length}</p>
            <p className="text-xs text-muted-foreground">Sayfa</p>
          </div>
        </div>
      </div>

      {/* Top Pages List */}
      {data.topPages.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm font-medium mb-2">En Popüler Sayfalar</p>
          <div className="flex flex-wrap gap-2">
            {data.topPages.map((page, index) => (
              <div
                key={`${page.page}-${index}`}
                className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-lg text-sm"
              >
                <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <span className="text-muted-foreground">{page.page}</span>
                <span className="font-bold">{page.views}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export { RealtimeStats as default };
