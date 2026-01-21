/**
 * useAnalytics Hook
 *
 * Analytics data management hook with metric calculation,
 * trend analysis, and real-time updates.
 *
 * @module hooks/useAnalytics
 * @category Hooks
 *
 * Features:
 * - Metric calculation with trend analysis
 * - Time period filtering
 * - Real-time data updates
 * - Report generation
 * - Export functionality
 * - Dashboard widget management
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  TimePeriod,
  DateRange,
  MetricValue,
  MetricType,
  ChartData,
  KPICard,
  Report,
  RealtimeData,
  DashboardConfig,
  DashboardWidget,
  TrafficSource,
  TopContent,
  ConversionFunnel,
  Demographics,
  AnalyticsEvent,
  Session,
  calculateTrend,
  formatMetricValue,
  MOCK_ANALYTICS_DATA,
  DASHBOARD_TEMPLATES,
  TIME_PERIODS,
} from '@/types/analytics';

interface UseAnalyticsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // milliseconds
  initialPeriod?: TimePeriod;
  initialCustomRange?: DateRange;
  enableRealtime?: boolean;
  escortId?: string; // Filter by specific escort
}

interface UseAnalyticsReturn {
  // State
  period: TimePeriod;
  customRange: DateRange | undefined;
  metrics: Record<MetricType, MetricValue>;
  realtimeData: RealtimeData | null;
  dashboard: DashboardConfig;
  isLoading: boolean;
  error: string | null;
  lastRefresh: Date | null;

  // Derived data
  trafficSources: TrafficSource[];
  topContent: TopContent[];
  conversionFunnel: ConversionFunnel;
  demographics: Demographics;
  chartData: Record<string, ChartData>;

  // Methods
  setPeriod: (period: TimePeriod) => void;
  setCustomRange: (range: DateRange) => void;
  refresh: () => Promise<void>;
  exportReport: (format: 'pdf' | 'excel' | 'csv' | 'json') => Promise<void>;
  generateReport: (type: Report['type']) => Promise<Report>;
  trackEvent: (event: Omit<AnalyticsEvent, 'timestamp'>) => void;
  updateDashboard: (config: Partial<DashboardConfig>) => void;
  addWidget: (widget: DashboardWidget) => void;
  removeWidget: (widgetId: string) => void;
  reorderWidgets: (widgetIds: string[]) => void;
}

/**
 * Generate mock chart data based on time period
 */
function generateChartData(period: TimePeriod): Record<string, ChartData> {
  const now = new Date();
  const dataPoints = period === 'today' ? 24 : period === 'last7days' ? 7 : period === 'last30days' ? 30 : 12;

  // Traffic trend chart
  const trafficTrend: ChartData = {
    type: 'line',
    title: 'Trafik Trendi',
    data: Array.from({ length: dataPoints }, (_, i) => {
      const baseValue = 1000 + Math.random() * 500;
      const trend = Math.sin(i / dataPoints * Math.PI) * 300;
      return {
        label: period === 'today' ? `${i}:00` : `${i + 1}`,
        value: Math.round(baseValue + trend),
        date: new Date(now.getTime() - (dataPoints - i) * (period === 'today' ? 3600000 : 86400000)),
      };
    }),
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: true, tooltip: true },
    },
  };

  // Traffic sources chart
  const trafficSources: ChartData = {
    type: 'doughnut',
    title: 'Trafik Kaynakları',
    data: [
      { label: 'Google', value: 45 },
      { label: 'Direct', value: 25 },
      { label: 'Social', value: 15 },
      { label: 'Referral', value: 10 },
      { label: 'Other', value: 5 },
    ],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: true, tooltip: true, datalabels: true },
    },
  };

  // Conversion funnel chart
  const conversionFunnel: ChartData = {
    type: 'bar',
    title: 'Dönüşüm Hunisi',
    xAxis: 'Aşama',
    yAxis: 'Kullanıcı',
    data: [
      { label: 'Ziyaret', value: 10000 },
      { label: 'Profil Görüntüleme', value: 5000 },
      { label: 'Mesaj', value: 2000 },
      { label: 'Randevu', value: 500 },
      { label: 'Tamamlanan', value: 400 },
    ],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { beginAtZero: true } },
    },
  };

  // Revenue trend chart
  const revenueTrend: ChartData = {
    type: 'area',
    title: 'Gelir Trendi',
    data: Array.from({ length: dataPoints }, (_, i) => {
      const baseValue = 3000 + Math.random() * 2000;
      const trend = (i / dataPoints) * 2000;
      return {
        label: period === 'today' ? `${i}:00` : `${i + 1}`,
        value: Math.round(baseValue + trend),
        date: new Date(now.getTime() - (dataPoints - i) * (period === 'today' ? 3600000 : 86400000)),
      };
    }),
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: true, tooltip: true },
    },
  };

  return {
    trafficTrend,
    trafficSources,
    conversionFunnel,
    revenueTrend,
  };
}

/**
 * Generate mock traffic sources
 */
function generateTrafficSources(): TrafficSource[] {
  return [
    { source: 'Google', visits: 5430, percentage: 45, trend: 'up' },
    { source: 'Direct', visits: 3020, percentage: 25, trend: 'neutral' },
    { source: 'Social Media', visits: 1810, percentage: 15, trend: 'up' },
    { source: 'Referral', visits: 1210, percentage: 10, trend: 'down' },
    { source: 'Diğer', visits: 600, percentage: 5, trend: 'neutral' },
  ];
}

/**
 * Generate mock top content
 */
function generateTopContent(): TopContent[] {
  return [
    {
      id: 'profile-1',
      title: 'Ayşe Yılmaz - Profil',
      type: 'profile',
      views: 3420,
      uniqueVisitors: 2100,
      avgTimeOnPage: 180,
      bounceRate: 35,
    },
    {
      id: 'page-1',
      title: 'Ana Sayfa',
      type: 'page',
      views: 8560,
      uniqueVisitors: 5200,
      avgTimeOnPage: 120,
      bounceRate: 45,
    },
    {
      id: 'profile-2',
      title: 'Zeynep Demir - Profil',
      type: 'profile',
      views: 2890,
      uniqueVisitors: 1750,
      avgTimeOnPage: 195,
      bounceRate: 32,
    },
  ];
}

/**
 * Generate mock conversion funnel
 */
function generateConversionFunnel(): ConversionFunnel {
  const stages = [
    { name: 'Ziyaret', count: 10000, conversionRate: 100, dropOffRate: 0 },
    { name: 'Profil Görüntüleme', count: 5000, conversionRate: 50, dropOffRate: 50 },
    { name: 'Mesaj', count: 2000, conversionRate: 20, dropOffRate: 60 },
    { name: 'Randevu', count: 500, conversionRate: 5, dropOffRate: 75 },
    { name: 'Tamamlanan', count: 400, conversionRate: 4, dropOffRate: 20 },
  ];

  return {
    stages,
    overallConversionRate: 4,
  };
}

/**
 * Generate mock demographics
 */
function generateDemographics(): Demographics {
  return {
    ageGroups: {
      '18-24': 15,
      '25-34': 35,
      '35-44': 30,
      '45-54': 15,
      '55+': 5,
    },
    gender: {
      'Erkek': 75,
      'Kadın': 20,
      'Diğer': 5,
    },
    locations: {
      'İstanbul': 35,
      'Ankara': 20,
      'İzmir': 15,
      'Antalya': 10,
      'Diğer': 20,
    },
    devices: {
      'Mobil': 55,
      'Masaüstü': 40,
      'Tablet': 5,
    },
  };
}

/**
 * Generate mock realtime data
 */
function generateRealtimeData(): RealtimeData {
  return {
    currentVisitors: Math.floor(100 + Math.random() * 50),
    activeUsers: Math.floor(50 + Math.random() * 30),
    pageViewsLastHour: Math.floor(200 + Math.random() * 100),
    topPages: [
      { page: '/', views: 45 },
      { page: '/catalog', views: 32 },
      { page: '/escort/ayse-yilmaz', views: 28 },
      { page: '/messages', views: 15 },
    ],
  };
}

/**
 * Main useAnalytics hook
 */
export function useAnalytics(options: UseAnalyticsOptions = {}): UseAnalyticsReturn {
  const {
    autoRefresh = false,
    refreshInterval = 60000, // 1 minute
    initialPeriod = 'last7days',
    initialCustomRange,
    enableRealtime = false,
    escortId,
  } = options;

  // State
  const [period, setPeriodState] = useState<TimePeriod>(initialPeriod);
  const [customRange, setCustomRangeState] = useState<DateRange | undefined>(initialCustomRange);
  const [metrics, setMetrics] = useState<Record<MetricType, MetricValue>>(MOCK_ANALYTICS_DATA as any);
  const [realtimeData, setRealtimeData] = useState<RealtimeData | null>(null);
  const [dashboard, setDashboard] = useState<DashboardConfig>(DASHBOARD_TEMPLATES.overview);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // Derived data
  const trafficSources = useMemo(() => generateTrafficSources(), [period]);
  const topContent = useMemo(() => generateTopContent(), [period]);
  const conversionFunnel = useMemo(() => generateConversionFunnel(), [period]);
  const demographics = useMemo(() => generateDemographics(), [period]);
  const chartData = useMemo(() => generateChartData(period), [period]);

  /**
   * Fetch analytics data from API
   */
  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In production, this would be a real API call:
      // const response = await fetch(`/api/analytics?period=${period}&escortId=${escortId || ''}`);
      // const data = await response.json();

      // For now, update with random variations
      setMetrics(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          const metric = updated[key as MetricType];
          const variation = (Math.random() - 0.5) * 0.1;
          const newValue = Math.round(metric.value * (1 + variation));
          updated[key as MetricType] = {
            ...metric,
            value: newValue,
            previousValue: metric.value,
            trend: calculateTrend(newValue, metric.previousValue || metric.value),
            formattedValue: formatMetricValue(
              newValue,
              'number',
              key === 'revenue' ? '₺' : undefined
            ),
          };
        });
        return updated;
      });

      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Veri yüklenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  }, [period, escortId]);

  /**
   * Update time period
   */
  const setPeriod = useCallback((newPeriod: TimePeriod) => {
    setPeriodState(newPeriod);
    if (newPeriod !== 'custom') {
      setCustomRangeState(undefined);
    }
  }, []);

  /**
   * Update custom date range
   */
  const setCustomRange = useCallback((range: DateRange) => {
    setCustomRangeState(range);
    setPeriodState('custom');
  }, []);

  /**
   * Export report in specified format
   */
  const exportReport = useCallback(async (format: 'pdf' | 'excel' | 'csv' | 'json') => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call for report generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In production, this would generate and download the file:
      // const response = await fetch(`/api/analytics/export?format=${format}`, {
      //   method: 'POST',
      //   body: JSON.stringify({ period, customRange, metrics, chartData }),
      // });
      // const blob = await response.blob();
      // downloadBlob(blob, `analytics-report-${period}.${format}`);

      console.log(`Exporting report as ${format}`);
      alert(`Rapor ${format.toUpperCase()} formatında dışa aktarılıyor...`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rapor dışa aktarılırken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  }, [period, customRange, metrics, chartData]);

  /**
   * Generate a report
   */
  const generateReport = useCallback(async (type: Report['type']): Promise<Report> => {
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const report: Report = {
        id: `report-${Date.now()}`,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} Raporu`,
        description: `${period} dönemine ait ${type} raporu`,
        type,
        period,
        customRange,
        metrics: Object.entries(MOCK_ANALYTICS_DATA).map(([key, value]: [string, any]) => ({
          id: key,
          title: key.charAt(0).toUpperCase() + key.slice(1),
          metric: key as MetricType,
          value,
          icon: '📊',
          color: 'blue',
          trend: value.trend,
          format: 'number',
        })),
        charts: Object.values(chartData),
        generatedAt: new Date(),
      };

      return report;
    } finally {
      setIsLoading(false);
    }
  }, [period, customRange, chartData]);

  /**
   * Track an analytics event
   */
  const trackEvent = useCallback((event: Omit<AnalyticsEvent, 'timestamp'>) => {
    const fullEvent: AnalyticsEvent = {
      ...event,
      timestamp: new Date(),
    };

    // In production, send to analytics API:
    // fetch('/api/analytics/events', {
    //   method: 'POST',
    //   body: JSON.stringify(fullEvent),
    // });

    console.log('Event tracked:', fullEvent);
  }, []);

  /**
   * Update dashboard configuration
   */
  const updateDashboard = useCallback((config: Partial<DashboardConfig>) => {
    setDashboard(prev => ({ ...prev, ...config }));
  }, []);

  /**
   * Add a widget to dashboard
   */
  const addWidget = useCallback((widget: DashboardWidget) => {
    setDashboard(prev => ({
      ...prev,
      widgets: [...prev.widgets, widget],
    }));
  }, []);

  /**
   * Remove a widget from dashboard
   */
  const removeWidget = useCallback((widgetId: string) => {
    setDashboard(prev => ({
      ...prev,
      widgets: prev.widgets.filter(w => w.id !== widgetId),
    }));
  }, []);

  /**
   * Reorder widgets on dashboard
   */
  const reorderWidgets = useCallback((widgetIds: string[]) => {
    setDashboard(prev => {
      const widgetMap = new Map(prev.widgets.map(w => [w.id, w]));
      const reorderedWidgets = widgetIds
        .map(id => widgetMap.get(id))
        .filter((w): w is DashboardWidget => w !== undefined);

      return {
        ...prev,
        widgets: reorderedWidgets,
      };
    });
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refresh();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refresh]);

  // Real-time updates effect
  useEffect(() => {
    if (!enableRealtime) return;

    const interval = setInterval(() => {
      setRealtimeData(generateRealtimeData());
    }, 5000); // Update every 5 seconds

    // Initial load
    setRealtimeData(generateRealtimeData());

    return () => clearInterval(interval);
  }, [enableRealtime]);

  // Initial data load
  useEffect(() => {
    refresh();
  }, [period, customRange]);

  return {
    // State
    period,
    customRange,
    metrics,
    realtimeData,
    dashboard,
    isLoading,
    error,
    lastRefresh,

    // Derived data
    trafficSources,
    topContent,
    conversionFunnel,
    demographics,
    chartData,

    // Methods
    setPeriod,
    setCustomRange,
    refresh,
    exportReport,
    generateReport,
    trackEvent,
    updateDashboard,
    addWidget,
    removeWidget,
    reorderWidgets,
  };
}

export { useAnalytics as default };
