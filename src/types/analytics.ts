/**
 * Analytics Types
 *
 * Type definitions for the analytics system.
 * Supports metrics, charts, reports, and data aggregation.
 *
 * @module types/analytics
 * @category Types
 */

/**
 * Time period for analytics data
 */
export type TimePeriod = 'today' | 'yesterday' | 'last7days' | 'last30days' | 'last90days' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'lastYear' | 'allTime' | 'custom';

/**
 * Date range for custom period filtering
 */
export interface DateRange {
  from: Date;
  to: Date;
}

/**
 * Metric value with trend information
 */
export interface MetricValue {
  value: number;
  previousValue?: number;
  trend: 'up' | 'down' | 'neutral' | 'na';
  trendPercent?: number;
  formattedValue: string;
}

/**
 * Analytics metric types
 */
export enum MetricType {
  VIEWS = 'views',
  VISITORS = 'visitors',
  SESSIONS = 'sessions',
  PAGE_VIEWS = 'pageViews',
  UNIQUE_VISITORS = 'uniqueVisitors',
  BOOKINGS = 'bookings',
  REVENUE = 'revenue',
  MESSAGES = 'messages',
  REVIEWS = 'reviews',
  RATING = 'rating',
  CONVERSION_RATE = 'conversionRate',
  AVERAGE_ORDER_VALUE = 'averageOrderValue',
  RESPONSE_TIME = 'responseTime',
  ACTIVE_ESCORTS = 'activeEscorts',
  NEW_SIGNUPS = 'newSignups',
}

/**
 * Chart data types
 */
export type ChartType = 'line' | 'bar' | 'pie' | 'doughnut' | 'area' | 'stackedBar' | 'stackedArea';

/**
 * Data point for charts
 */
export interface DataPoint {
  label: string;
  value: number;
  date?: Date;
  metadata?: Record<string, any>;
}

/**
 * Chart data series
 */
export interface ChartData {
  type: ChartType;
  title: string;
  data: DataPoint[];
  series?: {
    name: string;
    data: number[];
    color: string;
  }[];
  xAxis?: string;
  yAxis?: string;
  options?: ChartOptions;
}

/**
 * Chart display options
 */
export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: {
    legend?: boolean;
    tooltip?: boolean;
    datalabels?: boolean;
  };
  scales?: {
    x?: {
      stacked?: boolean;
      beginAtZero?: boolean;
    };
    y?: {
      stacked?: boolean;
      beginAtZero?: boolean;
    };
  };
}

/**
 * KPI card configuration
 */
export interface KPICard {
  id: string;
  title: string;
  metric: MetricType;
  value: MetricValue;
  icon: string;
  color: string;
  trend: 'up' | 'down' | 'neutral' | 'na';
  format: 'number' | 'currency' | 'percentage' | 'duration';
  prefix?: string;
  suffix?: string;
}

/**
 * User demographics data
 */
export interface Demographics {
  ageGroups: Record<string, number>;
  gender: Record<string, number>;
  locations: Record<string, number>;
  devices: Record<string, number>;
}

/**
 * Traffic source breakdown
 */
export interface TrafficSource {
  source: string;
  visits: number;
  percentage: number;
  trend: 'up' | 'down' | 'neutral';
}

/**
 * Top performing content
 */
export interface TopContent {
  id: string;
  title: string;
  type: 'profile' | 'page';
  views: number;
  uniqueVisitors: number;
  avgTimeOnPage: number;
  bounceRate: number;
}

/**
 * Funnel stage for conversion tracking
 */
export interface FunnelStage {
  name: string;
  count: number;
  conversionRate: number;
  dropOffRate: number;
}

/**
 * Conversion funnel
 */
export interface ConversionFunnel {
  stages: FunnelStage[];
  overallConversionRate: number;
}

/**
 * Report configuration
 */
export interface Report {
  id: string;
  name: string;
  description: string;
  type: 'overview' | 'traffic' | 'revenue' | 'engagement' | 'performance' | 'custom';
  period: TimePeriod;
  customRange?: DateRange;
  metrics: KPICard[];
  charts: ChartData[];
  tables?: ReportTable[];
  generatedAt: Date;
}

/**
 * Report table for tabular data
 */
export interface ReportTable {
  title: string;
  headers: string[];
  rows: (string | number)[][];
  summary?: string;
}

/**
 * Analytics event for tracking
 */
export interface AnalyticsEvent {
  name: string;
  category: 'navigation' | 'engagement' | 'conversion' | 'custom';
  properties?: Record<string, any>;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

/**
 * Session data
 */
export interface Session {
  id: string;
  userId?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  pageViews: number;
  referrer?: string;
  source?: string;
  device?: string;
  location?: string;
  actions: AnalyticsEvent[];
}

/**
 * Page view data
 */
export interface PageView {
  id: string;
  sessionId: string;
  page: string;
  title: string;
  timestamp: Date;
  duration?: number;
}

/**
 * Real-time analytics data
 */
export interface RealtimeData {
  currentVisitors: number;
  activeUsers: number;
  pageViewsLastHour: number;
  topPages: Array<{
    page: string;
    views: number;
  }>;
}

/**
 * Export format for reports
 */
export type ExportFormat = 'pdf' | 'excel' | 'csv' | 'json';

/**
 * Scheduled report configuration
 */
export interface ScheduledReport {
  id: string;
  name: string;
  type: Report['type'];
  period: TimePeriod;
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  nextRun: Date;
  lastRun?: Date;
  format: ExportFormat;
}

/**
 * Dashboard widget configuration
 */
export interface DashboardWidget {
  id: string;
  type: 'kpi' | 'chart' | 'table' | 'list';
  title: string;
  size: 'small' | 'medium' | 'large' | 'full';
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  content: any;
  refreshInterval?: number;
}

/**
 * Dashboard configuration
 */
export interface DashboardConfig {
  id: string;
  name: string;
  widgets: DashboardWidget[];
  layout: {
    columns: number;
    rows: number;
  };
  autoRefresh?: boolean;
  refreshInterval?: number;
}

/**
 * Predefined dashboard templates
 */
export const DASHBOARD_TEMPLATES: Record<string, DashboardConfig> = {
  overview: {
    id: 'overview',
    name: 'Genel Bakış',
    widgets: [
      {
        id: 'kpi-views',
        type: 'kpi',
        title: 'Ziyaretler',
        size: 'medium',
        position: { x: 0, y: 0, w: 3, h: 2 },
        content: {
          metric: MetricType.VIEWS,
          icon: '👁️',
          color: 'blue',
          format: 'number',
        },
      },
      {
        id: 'kpi-visitors',
        type: 'kpi',
        title: 'Ziyaretçi',
        size: 'medium',
        position: { x: 3, y: 0, w: 3, h: 2 },
        content: {
          metric: MetricType.UNIQUE_VISITORS,
          icon: '👥',
          color: 'green',
          format: 'number',
        },
      },
      {
        id: 'kpi-bookings',
        type: 'kpi',
        title: 'Randevular',
        size: 'medium',
        position: { x: 6, y: 0, w: 3, h: 2 },
        content: {
          metric: MetricType.BOOKINGS,
          icon: '📅',
          color: 'blue',
          format: 'number',
        },
      },
      {
        id: 'kpi-revenue',
        type: 'kpi',
        title: 'Gelir',
        size: 'medium',
        position: { x: 9, y: 0, w: 3, h: 2 },
        content: {
          metric: MetricType.REVENUE,
          icon: '💰',
          color: 'yellow',
          format: 'currency',
          prefix: '₺',
        },
      },
      {
        id: 'chart-traffic-trend',
        type: 'chart',
        title: 'Trafik Trendi',
        size: 'large',
        position: { x: 0, y: 2, w: 6, h: 4 },
        content: {
          type: 'line',
          title: 'Ziyaretçi Trendi',
          data: [],
        },
      },
      {
        id: 'chart-traffic-sources',
        type: 'chart',
        title: 'Trafik Kaynakları',
        size: 'large',
        position: { x: 6, y: 2, w: 6, h: 4 },
        content: {
          type: 'doughnut',
          title: 'Trafik Dağılımı',
          data: [],
        },
      },
    ],
    layout: { columns: 12, rows: 6 },
  },

  performance: {
    id: 'performance',
    name: 'Performans',
    widgets: [
      {
        id: 'kpi-response-time',
        type: 'kpi',
        title: 'Yanıt Süresi',
        size: 'small',
        position: { x: 0, y: 0, w: 3, h: 2 },
        content: {
          metric: MetricType.RESPONSE_TIME,
          icon: '⚡',
          color: 'sky',
          format: 'duration',
        },
      },
      {
        id: 'kpi-conversion',
        type: 'kpi',
        title: 'Dönüşüm Oranı',
        size: 'small',
        position: { x: 3, y: 0, w: 3, h: 2 },
        content: {
          metric: MetricType.CONVERSION_RATE,
          icon: '📈',
          color: 'green',
          format: 'percentage',
          suffix: '%',
        },
      },
      {
        id: 'chart-conversion-funnel',
        type: 'chart',
        title: 'Dönüşüm Hunisi',
        size: 'large',
        position: { x: 0, y: 2, w: 6, h: 4 },
        content: {
          type: 'bar',
          title: 'Dönüşüm Hunisi',
          data: [],
        },
      },
      {
        id: 'chart-top-pages',
        type: 'table',
        title: 'En Çok Ziyaret Edilen Sayfalar',
        size: 'large',
        position: { x: 6, y: 2, w: 6, h: 4 },
        content: {
          headers: ['Sayfa', 'Görüntüleme', 'Ortalama Süre', 'Hemen Çıkış'],
          rows: [],
        },
      },
    ],
    layout: { columns: 12, rows: 6 },
  },
};

/**
 * Mock analytics data
 */
export const MOCK_ANALYTICS_DATA = {
  views: { value: 45230, previousValue: 38450, trend: 'up', trendPercent: 17.6, formattedValue: '45,230' },
  visitors: { value: 12450, previousValue: 11200, trend: 'up', trendPercent: 11.2, formattedValue: '12,450' },
  bookings: { value: 234, previousValue: 198, trend: 'up', trendPercent: 18.2, formattedValue: '234' },
  revenue: { value: 125000, previousValue: 98000, trend: 'up', trendPercent: 27.6, formattedValue: '₺125,000' },
  rating: { value: 4.7, previousValue: 4.5, trend: 'up', trendPercent: 4.4, formattedValue: '4.7' },
  responseTime: { value: 2.4, previousValue: 3.1, trend: 'up', trendPercent: -22.6, formattedValue: '2.4 dk' },
  conversionRate: { value: 12.5, previousValue: 10.2, trend: 'up', trendPercent: 22.5, formattedValue: '12.5%' },
  activeEscorts: { value: 45, previousValue: 42, trend: 'up', trendPercent: 7.1, formattedValue: '45' },
  newSignUps: { value: 18, previousValue: 15, trend: 'up', trendPercent: 20, formattedValue: '18' },
};

/**
 * Time period options
 */
export const TIME_PERIODS = [
  { value: 'today', label: 'Bugün' },
  { value: 'yesterday', label: 'Dün' },
  { value: 'last7days', label: 'Son 7 Gün' },
  { value: 'last30days', label: 'Son 30 Gün' },
  { value: 'last90days', label: 'Son 90 Gün' },
  { value: 'thisMonth', label: 'Bu Ay' },
  {   value: 'lastMonth', label: 'Geçen Ay' },
  { value: 'thisYear', label: 'Bu Yıl' },
  { value: 'lastYear', label: 'Geçen Yıl' },
  { value: 'allTime', label: 'Tüm Zamanlar' },
] as const;

/**
 * Helper to calculate trend
 */
export function calculateTrend(current: number, previous: number): 'up' | 'down' | 'neutral' {
  if (!previous || previous === 0) return 'neutral';
  const diff = ((current - previous) / previous) * 100;
  if (diff > 5) return 'up';
  if (diff < -5) return 'down';
  return 'neutral';
}

/**
 * Helper to format metric value
 */
export function formatMetricValue(value: number, format: KPICard['format'], prefix?: string, suffix?: string): string {
  switch (format) {
    case 'number':
      return value.toLocaleString('tr-TR');
    case 'currency':
      return `${prefix || ''}${value.toLocaleString('tr-TR')}₺`;
    case 'percentage':
      return `%${value.toFixed(1)}${suffix || ''}`;
    case 'duration':
      if (value < 60) return `${value}sn`;
      if (value < 3600) return `${Math.floor(value / 60)}dk ${value % 60}sn`;
      return `${Math.floor(value / 3600)}sa ${Math.floor((value % 3600) / 60)}dk`;
    default:
      return value.toString();
  }
}

/**
 * Helper to get trend color
 */
export function getTrendColor(trend: 'up' | 'down' | 'neutral' | 'na'): string {
  switch (trend) {
    case 'up': return 'text-green-600';
    case 'down': return 'text-red-600';
    case 'neutral': return 'text-gray-600';
    case 'na': return 'text-gray-400';
  }
}

/**
 * Helper to get trend icon class
 */
export function getTrendIconClass(trend: 'up' | 'down' | 'neutral' | 'na'): string {
  switch (trend) {
    case 'up': return 'text-green-600';
    case 'down': return 'text-red-600';
    default: return 'text-gray-600';
  }
}

/**
 * Helper to get trend icon path
 */
export function getTrendIconPath(trend: 'up' | 'down' | 'neutral' | 'na'): string {
  switch (trend) {
    case 'up': return 'M12 19V5M5 12l7-7 7 7';
    case 'down': return 'M12 5v14M19 12l-7 7-7-7';
    default: return 'M5 12h14M12 5l7 7-7-7';
  }
}
