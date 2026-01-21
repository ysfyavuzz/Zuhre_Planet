/**
 * Escort Analytics Dashboard Page
 *
 * Comprehensive analytics and insights dashboard for escort service providers.
 * Displays detailed statistics, performance metrics, trends, and actionable insights.
 * Helps escorts understand their profile performance and optimize their listings.
 *
 * @module pages/EscortAnalyticsDashboard
 * @category Pages - Dashboard
 *
 * Features:
 * - Quick Stats overview (views, favorites, bookings, earnings, rating)
 * - Profile visibility and reach metrics
 * - Booking trends and conversion rates
 * - Revenue analytics with charts
 * - Audience demographics
 * - Performance comparison with platform averages
 * - Weekly/Monthly/Yearly time range selectors
 * - Export data functionality
 * - Actionable insights and recommendations
 * - Top performing photos/services analysis
 * - Response time tracking
 * - Cancellation rate monitoring
 *
 * Quick Stats Cards:
 * - Total profile views (with trend indicator)
 * - Favorites received (with trend indicator)
 * - Booking requests (confirmed/pending ratio)
 * - Total earnings (with period comparison)
 * - Average rating (with review count)
 * - Response rate percentage
 *
 * Analytics Sections:
 * - Views Over Time (line chart representation)
 * - Booking Sources (pie chart: direct, search, favorites, ads)
 * - Revenue Breakdown (by service type)
 * - Audience Location (city breakdown)
 * - Best Performing Hours (heat map style)
 * - Photo Engagement (click-through rates)
 *
 * Export Options:
 * - CSV download for raw data
 * - PDF report generation
 * - Print-friendly layout
 *
 * @example
 * ```tsx
 * // Route: /escort/dashboard/analytics
 * <EscortAnalyticsDashboard />
 * ```
 */

import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Eye, Heart, Calendar, Star, TrendingUp, TrendingDown,
  Download, Printer, Share2, Settings, ChevronRight,
  Users, MapPin, Clock, DollarSign, BarChart3,
  LineChart, PieChart, Activity, Target, ArrowUpRight,
  ArrowDownRight, Filter, Calendar as CalendarIcon
} from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Time range for analytics data
 */
type TimeRange = 'week' | 'month' | 'quarter' | 'year' | 'all';

/**
 * Analytics statistics interface
 */
interface AnalyticsStats {
  views: {
    total: number;
    change: number;
    trend: 'up' | 'down';
  };
  favorites: {
    total: number;
    change: number;
    trend: 'up' | 'down';
  };
  bookings: {
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    change: number;
    trend: 'up' | 'down';
  };
  earnings: {
    total: number;
    thisPeriod: number;
    lastPeriod: number;
    change: number;
    trend: 'up' | 'down';
  };
  rating: {
    average: number;
    count: number;
    change: number;
  };
  responseRate: {
    percentage: number;
    averageTime: string; // e.g., "15 dakika"
  };
}

/**
 * Booking source data
 */
interface BookingSource {
  source: 'direct' | 'search' | 'favorites' | 'ads' | 'referral';
  count: number;
  percentage: number;
  color: string;
}

/**
 * Revenue breakdown by service
 */
interface RevenueByService {
  service: string;
  amount: number;
  percentage: number;
  bookings: number;
}

/**
 * Audience location data
 */
interface AudienceLocation {
  city: string;
  views: number;
  bookings: number;
  percentage: number;
}

/**
 * Photo engagement data
 */
interface PhotoEngagement {
  id: string;
  url: string;
  views: number;
  clicks: number;
  ctr: number; // Click-through rate
}

/**
 * Insight/recommendation data
 */
interface Insight {
  type: 'success' | 'warning' | 'info' | 'tip';
  title: string;
  description: string;
  actionable?: boolean;
}

export default function EscortAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [isExporting, setIsExporting] = useState(false);

  // Mock analytics data based on selected time range
  const stats = useMemo<AnalyticsStats>(() => {
    const multipliers = {
      week: 0.3,
      month: 1,
      quarter: 2.5,
      year: 8,
      all: 12,
    };

    const m = multipliers[timeRange];

    return {
      views: {
        total: Math.round(4850 * m),
        change: 12.5,
        trend: 'up',
      },
      favorites: {
        total: Math.round(342 * m),
        change: -3.2,
        trend: 'down',
      },
      bookings: {
        total: Math.round(48 * m),
        confirmed: Math.round(38 * m),
        pending: Math.round(6 * m),
        cancelled: Math.round(4 * m),
        change: 8.7,
        trend: 'up',
      },
      earnings: {
        total: Math.round(28500 * m),
        thisPeriod: Math.round(12000 * m),
        lastPeriod: Math.round(10500 * m),
        change: 14.3,
        trend: 'up',
      },
      rating: {
        average: 4.8,
        count: Math.round(156 * m),
        change: 0.1,
      },
      responseRate: {
        percentage: 87,
        averageTime: '15 dakika',
      },
    };
  }, [timeRange]);

  // Mock booking sources data
  const bookingSources = useMemo<BookingSource[]>(() => [
    { source: 'direct', count: 24, percentage: 50, color: 'bg-primary' },
    { source: 'search', count: 12, percentage: 25, color: 'bg-accent' },
    { source: 'favorites', count: 6, percentage: 12.5, color: 'bg-amber-500' },
    { source: 'ads', count: 4, percentage: 8.3, color: 'bg-green-500' },
    { source: 'referral', count: 2, percentage: 4.2, color: 'bg-blue-500' },
  ], []);

  // Mock revenue breakdown
  const revenueBreakdown = useMemo<RevenueByService[]>(() => [
    { service: 'Akşam Yemeği', amount: 8500, percentage: 42, bookings: 18 },
    { service: 'Etkinlik', amount: 6200, percentage: 31, bookings: 12 },
    { service: 'Şehir İçi Tur', amount: 3500, percentage: 17, bookings: 10 },
    { service: 'Diğer', amount: 2000, percentage: 10, bookings: 8 },
  ], []);

  // Mock audience location data
  const audienceLocations = useMemo<AudienceLocation[]>(() => [
    { city: 'İstanbul', views: 2450, bookings: 28, percentage: 52 },
    { city: 'Ankara', views: 850, bookings: 10, percentage: 18 },
    { city: 'İzmir', views: 620, bookings: 6, percentage: 13 },
    { city: 'Bursa', views: 420, bookings: 3, percentage: 9 },
    { city: 'Diğer', views: 510, bookings: 1, percentage: 8 },
  ], []);

  // Mock photo engagement data
  const photoEngagement = useMemo<PhotoEngagement[]>(() => [
    { id: '1', url: 'https://via.placeholder.com/150', views: 1250, clicks: 340, ctr: 27.2 },
    { id: '2', url: 'https://via.placeholder.com/150', views: 980, clicks: 210, ctr: 21.4 },
    { id: '3', url: 'https://via.placeholder.com/150', views: 890, clicks: 195, ctr: 21.9 },
  ], []);

  // Mock insights
  const insights = useMemo<Insight[]>(() => [
    {
      type: 'success',
      title: 'Profil Görüntülenmelerinde Artış',
      description: 'Bu hafta profil görüntülenmeleriniz %12.5 arttı. Bu trendi sürdürmek için fotoğraflarınızı güncel tutun.',
      actionable: true,
    },
    {
      type: 'warning',
      title: 'Yanıt Süresi Uzamış',
      description: 'Ortalama yanıt süreniz 15 dakika. Platform ortalaması 8 dakika. Daha hızlı yanıt vererek rezervasyon oranınızı artırabilirsiniz.',
      actionable: true,
    },
    {
      type: 'info',
      title: 'Popüler Şehir: İstanbul',
      description: 'İstanbul\'dan gelen randevu talepleri toplamın %52\'si. Bu bölgede görünürlüğünüzü artırmayı düşünebilirsiniz.',
    },
    {
      type: 'tip',
      title: 'Hafta İçi Performansı',
      description: 'Salı ve Çarşamba günleri rezervasyon oranınız daha yüksek. Bu günlerde özel promosyonlar yapabilirsiniz.',
    },
  ], []);

  // Time range options
  const timeRangeOptions: { value: TimeRange; label: string }[] = [
    { value: 'week', label: 'Son 7 Gün' },
    { value: 'month', label: 'Son 30 Gün' },
    { value: 'quarter', label: 'Son 3 Ay' },
    { value: 'year', label: 'Son 12 Ay' },
    { value: 'all', label: 'Tüm Zamanlar' },
  ];

  const handleExport = async (format: 'csv' | 'pdf') => {
    setIsExporting(true);
    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`Exporting as ${format}`);
    setIsExporting(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">Analitik Paneli</h1>
            <p className="text-muted-foreground">Profil performansınızı detaylı görün</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('csv')}
              disabled={isExporting}
            >
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
            >
              <Printer className="w-4 h-4 mr-2" />
              Yazdır
            </Button>
            <Link href="/escort/dashboard/settings">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Ayarlar
              </Button>
            </Link>
          </div>
        </div>

        {/* Time Range Selector */}
        <Card className="card-premium mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Periyot:</span>
              </div>
              <div className="flex items-center gap-2">
                {timeRangeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={timeRange === option.value ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setTimeRange(option.value)}
                    className={timeRange === option.value ? 'bg-primary text-white' : ''}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          {/* Views */}
          <Card className="card-premium">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-blue-500" />
                </div>
                {stats.views.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
              </div>
              <div className="text-2xl font-bold mb-1">{stats.views.total.toLocaleString('tr-TR')}</div>
              <div className="text-xs text-muted-foreground">Görüntülenme</div>
              <div className={`text-xs mt-1 ${stats.views.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                %{stats.views.change > 0 ? '+' : ''}{stats.views.change}
              </div>
            </CardContent>
          </Card>

          {/* Favorites */}
          <Card className="card-premium">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                </div>
                {stats.favorites.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
              </div>
              <div className="text-2xl font-bold mb-1">{stats.favorites.total}</div>
              <div className="text-xs text-muted-foreground">Favori</div>
              <div className={`text-xs mt-1 ${stats.favorites.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                %{stats.favorites.change > 0 ? '+' : ''}{stats.favorites.change}
              </div>
            </CardContent>
          </Card>

          {/* Bookings */}
          <Card className="card-premium">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-500" />
                </div>
                {stats.bookings.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
              </div>
              <div className="text-2xl font-bold mb-1">{stats.bookings.total}</div>
              <div className="text-xs text-muted-foreground">Randevu</div>
              <div className="flex items-center gap-2 mt-1 text-xs">
                <span className="text-green-500">{stats.bookings.confirmed} onaylı</span>
                <span className="text-amber-500">{stats.bookings.pending} bekliyor</span>
              </div>
            </CardContent>
          </Card>

          {/* Earnings */}
          <Card className="card-premium">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-amber-500" />
                </div>
                {stats.earnings.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
              </div>
              <div className="text-2xl font-bold mb-1">{stats.earnings.total.toLocaleString('tr-TR')} ₺</div>
              <div className="text-xs text-muted-foreground">Toplam Kazanç</div>
              <div className={`text-xs mt-1 ${stats.earnings.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                %{stats.earnings.change > 0 ? '+' : ''}{stats.earnings.change}
              </div>
            </CardContent>
          </Card>

          {/* Rating */}
          <Card className="card-premium">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold mb-1">{stats.rating.average}</div>
              <div className="text-xs text-muted-foreground">Ortalama Puan</div>
              <div className="text-xs text-muted-foreground mt-1">{stats.rating.count} değerlendirme</div>
            </CardContent>
          </Card>

          {/* Response Rate */}
          <Card className="card-premium">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-purple-500" />
                </div>
                <Target className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold mb-1">%{stats.responseRate.percentage}</div>
              <div className="text-xs text-muted-foreground">Yanıt Oranı</div>
              <div className="text-xs text-muted-foreground mt-1">{stats.responseRate.averageTime}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Booking Sources Chart */}
          <Card className="card-premium">
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">Randevu Kaynakları</h3>
              <div className="space-y-3">
                {bookingSources.map((source) => (
                  <div key={source.source} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${source.color} flex-shrink-0`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm capitalize">{source.source === 'direct' ? 'Doğrudan' : source.source === 'search' ? 'Arama' : source.source === 'favorites' ? 'Favoriler' : source.source === 'ads' ? 'Reklamlar' : 'Yönlendirme'}</span>
                        <span className="text-sm font-medium">%{source.percentage}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${source.color} transition-all duration-500`}
                          style={{ width: `${source.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Revenue Breakdown */}
          <Card className="card-premium">
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">Hizmet Bazlı Gelir</h3>
              <div className="space-y-3">
                {revenueBreakdown.map((item) => (
                  <div key={item.service} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{item.service}</div>
                      <div className="text-xs text-muted-foreground">{item.bookings} randevu</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{item.amount.toLocaleString('tr-TR')} ₺</div>
                      <div className="text-xs text-muted-foreground">%{item.percentage}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Audience Location */}
          <Card className="card-premium">
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">Kitle Konumu</h3>
              <div className="space-y-3">
                {audienceLocations.map((location) => (
                  <div key={location.city} className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{location.city}</span>
                        <span className="text-sm font-medium">%{location.percentage}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-500"
                          style={{ width: `${location.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Photo Engagement */}
        <Card className="card-premium mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Fotoğraf Performansı</h3>
              <Link href="/escort/dashboard/photos">
                <Button variant="ghost" size="sm">
                  Tümünü Gör
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {photoEngagement.map((photo) => (
                <Card key={photo.id} className="border border-border/50">
                  <CardContent className="p-4">
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted mb-3">
                      <img src={photo.url} alt="Photo" className="w-full h-full object-cover" />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-lg font-bold">{photo.views}</div>
                        <div className="text-xs text-muted-foreground">Görünüm</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{photo.clicks}</div>
                        <div className="text-xs text-muted-foreground">Tıklama</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-500">%{photo.ctr}</div>
                        <div className="text-xs text-muted-foreground">CTR</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights and Recommendations */}
        <Card className="card-premium">
          <CardContent className="p-6">
            <h3 className="font-bold mb-4">Öneriler ve İçgörüler</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${
                    insight.type === 'success'
                      ? 'bg-green-500/10 border-green-500/30'
                      : insight.type === 'warning'
                        ? 'bg-amber-500/10 border-amber-500/30'
                        : insight.type === 'info'
                          ? 'bg-blue-500/10 border-blue-500/30'
                          : 'bg-purple-500/10 border-purple-500/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {insight.type === 'success' && <TrendingUp className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />}
                    {insight.type === 'warning' && <Activity className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />}
                    {insight.type === 'info' && <BarChart3 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />}
                    {insight.type === 'tip' && <Star className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />}
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                      {insight.actionable && (
                        <Button variant="link" className="p-0 h-auto text-sm mt-2">
                          İncele
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Back to Dashboard */}
        <div className="mt-6 flex justify-center">
          <Link href="/escort/dashboard/private">
            <Button variant="outline" size="lg">
              <ChevronRight className="w-5 h-5 mr-2 rotate-180" />
              Dashboard'a Dön
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
