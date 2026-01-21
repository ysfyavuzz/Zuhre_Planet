/**
 * Analytics Dashboard Component
 *
 * Main dashboard for displaying analytics data with KPI cards,
 * charts, and real-time metrics.
 *
 * @module components/AnalyticsDashboard
 * @category Components - Analytics
 */

import { useState, useMemo, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAnalytics } from '@/hooks/useAnalytics';
import { TIME_PERIODS } from '@/types/analytics';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Download,
  Calendar,
  Users,
  Eye,
  MessageSquare,
  Star,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { KPICard } from './KPICard';
import { LineChart } from './LineChart';
import { DoughnutChart } from './DoughnutChart';
import { BarChart } from './BarChart';
import { RealtimeStats } from './RealtimeStats';

interface AnalyticsDashboardProps {
  escortId?: string;
  autoRefresh?: boolean;
  className?: string;
  userRole?: 'escort' | 'customer' | 'admin' | null;
}

export function AnalyticsDashboard({
  escortId,
  autoRefresh = false,
  className = '',
  userRole,
}: AnalyticsDashboardProps) {
  const {
    period,
    customRange,
    metrics,
    realtimeData,
    trafficSources,
    topContent,
    conversionFunnel,
    demographics,
    chartData,
    isLoading,
    error,
    lastRefresh,
    setPeriod,
    refresh,
    exportReport,
    trackEvent,
  } = useAnalytics({
    autoRefresh,
    initialPeriod: 'last7days',
    enableRealtime: true,
    escortId,
  });

  const [showExportMenu, setShowExportMenu] = useState(false);

  // Track page view
  useEffect(() => {
    trackEvent({
      name: 'dashboard_view',
      category: 'navigation',
      properties: { period, escortId },
    });
  }, [period, escortId, trackEvent]);

  // KPI cards configuration
  const kpiCards = useMemo(() => [
    {
      id: 'views',
      title: 'Sayfa Görüntüleme',
      metric: metrics.views,
      icon: Eye,
      color: 'blue',
      format: 'number' as const,
    },
    {
      id: 'visitors',
      title: 'Benzzersiz Ziyaretçi',
      metric: metrics.visitors,
      icon: Users,
      color: 'green',
      format: 'number' as const,
    },
    {
      id: 'bookings',
      title: 'Randevular',
      metric: metrics.bookings,
      icon: Calendar,
      color: 'purple',
      format: 'number' as const,
    },
    {
      id: 'revenue',
      title: 'Gelir',
      metric: metrics.revenue,
      icon: DollarSign,
      color: 'yellow',
      format: 'currency' as const,
    },
    {
      id: 'messages',
      title: 'Mesajlar',
      metric: metrics.messages,
      icon: MessageSquare,
      color: 'indigo',
      format: 'number' as const,
    },
    {
      id: 'rating',
      title: 'Ortalama Puan',
      metric: metrics.rating,
      icon: Star,
      color: 'orange',
      format: 'number' as const,
    },
    {
      id: 'responseTime',
      title: 'Yanıt Süresi',
      metric: metrics.responseTime,
      icon: Activity,
      color: 'pink',
      format: 'duration' as const,
    },
    {
      id: 'conversionRate',
      title: 'Dönüşüm Oranı',
      metric: metrics.conversionRate,
      icon: TrendingUp,
      color: 'cyan',
      format: 'percentage' as const,
    },
  ], [metrics]);

  const handleExport = async (format: 'pdf' | 'excel' | 'csv' | 'json') => {
    await exportReport(format);
    setShowExportMenu(false);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">ANALİTİK</h1>
          <p className="text-muted-foreground">
            Performans metrikleri ve raporlar
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Period Selector */}
          <Select value={period} onValueChange={(value) => setPeriod(value as any)}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIME_PERIODS.map(p => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={refresh}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>

          {/* Export Button */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              <Download className="w-4 h-4 mr-2" />
              Dışa Aktar
            </Button>

            {showExportMenu && (
              <div className="absolute right-0 top-full mt-2 z-10 bg-background border rounded-lg shadow-xl overflow-hidden min-w-[150px]">
                {(['pdf', 'excel', 'csv', 'json'] as const).map(format => (
                  <button
                    key={format}
                    onClick={() => handleExport(format)}
                    className="w-full px-4 py-2 text-left hover:bg-muted transition-colors text-sm"
                  >
                    {format.toUpperCase()} olarak indir
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-red-600 text-sm">{error}</p>
        </Card>
      )}

      {/* Real-time Stats */}
      {realtimeData && (
        <RealtimeStats data={realtimeData} />
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => (
          <motion.div
            key={kpi.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <KPICard
              title={kpi.title}
              value={kpi.metric}
              icon={kpi.icon}
              color={kpi.color}
              format={kpi.format}
            />
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Trend Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Trafik Trendi</h3>
            <Badge variant="secondary">
              {period === 'custom' && customRange
                ? `${customRange.from.toLocaleDateString('tr-TR')} - ${customRange.to.toLocaleDateString('tr-TR')}`
                : TIME_PERIODS.find(p => p.value === period)?.label
              }
            </Badge>
          </div>
          <LineChart data={chartData.trafficTrend} height={250} />
        </Card>

        {/* Traffic Sources Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Trafik Kaynakları</h3>
            <PieChart className="w-5 h-5 text-muted-foreground" />
          </div>
          <DoughnutChart data={chartData.trafficSources} height={250} />
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversion Funnel */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Dönüşüm Hunisi</h3>
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
          </div>
          <BarChart data={chartData.conversionFunnel} height={250} />
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Genel Dönüşüm Oranı
            </p>
            <p className="text-2xl font-bold text-primary">
              %{conversionFunnel.overallConversionRate}
            </p>
          </div>
        </Card>

        {/* Traffic Sources Table */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Trafik Kaynakları Detay</h3>
            <Badge variant="secondary">{trafficSources.length} kaynak</Badge>
          </div>
          <div className="space-y-3">
            {trafficSources.map((source) => (
              <div key={source.source} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{source.source}</span>
                    <span className="text-sm text-muted-foreground">
                      {source.visits.toLocaleString('tr-TR')} ziyaret
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="ml-4 flex items-center gap-2 min-w-[80px]">
                  <span className="text-sm font-bold">{source.percentage}%</span>
                  {source.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                  {source.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                  {source.trend === 'neutral' && <Minus className="w-4 h-4 text-gray-400" />}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Content */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">En Çok Görüntülenen İçerik</h3>
            <Badge variant="secondary">{topContent.length} içerik</Badge>
          </div>
          <div className="space-y-3">
            {topContent.map((content, index) => (
              <div
                key={content.id}
                className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{content.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {content.uniqueVisitors.toLocaleString('tr-TR')} benzersiz ziyaretçi
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{content.views.toLocaleString('tr-TR')}</p>
                  <p className="text-xs text-muted-foreground">görüntülenme</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Demographics */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Demografi</h3>
            <Users className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {/* Age Groups */}
            <div>
              <p className="text-sm font-medium mb-2">Yaş Grupları</p>
              <div className="space-y-2">
                {Object.entries(demographics.ageGroups).map(([age, percentage]) => (
                  <div key={age} className="flex items-center gap-2">
                    <span className="text-sm w-16">{age}</span>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-10">{percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Devices */}
            <div>
              <p className="text-sm font-medium mb-2">Cihazlar</p>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(demographics.devices).map(([device, percentage]) => (
                  <div key={device} className="text-center p-2 bg-muted/20 rounded-lg">
                    <p className="text-lg font-bold">{percentage}%</p>
                    <p className="text-xs text-muted-foreground">{device}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div>
              <p className="text-sm font-medium mb-2">Cinsiyet</p>
              <div className="flex gap-2">
                {Object.entries(demographics.gender).map(([gender, percentage]) => (
                  <div key={gender} className="flex-1 text-center p-2 bg-muted/20 rounded-lg">
                    <p className="text-lg font-bold">{percentage}%</p>
                    <p className="text-xs text-muted-foreground">{gender}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer - Last Refresh */}
      {lastRefresh && (
        <div className="text-center text-sm text-muted-foreground">
          Son güncelleme: {lastRefresh.toLocaleTimeString('tr-TR')}
        </div>
      )}
    </div>
  );
}

export { AnalyticsDashboard as default };
