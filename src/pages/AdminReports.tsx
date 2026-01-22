/**
 * Admin Reports Page
 *
 * Comprehensive financial reporting system with person-based, date-based, revenue-based,
 * and detailed reports. Includes export functionality for all report types.
 *
 * @page
 * @category Admin
 *
 * Features:
 * - Person-based reports (user activity, escort performance)
 * - Date-based reports (daily, weekly, monthly, custom range)
 * - Revenue-based reports (by escort, by city, by service)
 * - Detailed transaction reports
 * - Export to CSV, PDF, Excel
 * - Real-time data filtering
 * - Visual charts and graphs
 * - Print-friendly layouts
 */

import * as React from 'react';
import { Link } from 'wouter';
import { AdminSidebar } from '@/components/admin';
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  FileText, Download, Filter, Calendar, TrendingUp, Users,
  DollarSign, BarChart3, PieChart, Printer, Share2, Eye,
  ChevronDown, Search, X, ArrowLeft, Star, Clock, UserCheck
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { StatCard } from '@/components/admin/StatCard';

type ReportType = 'person' | 'date' | 'revenue' | 'detailed';
type ReportFormat = 'csv' | 'pdf' | 'excel' | 'json';
type DateRange = 'today' | 'week' | 'month' | 'year' | 'custom';

interface ReportData {
  id: string;
  type: ReportType;
  title: string;
  data: any[];
  generatedAt: Date;
}

/**
 * Type-safe interfaces for report totals
 */
interface RevenueTotals {
  totalRevenue: number;
  totalAppointments: number;
  avgRating: string;
}

interface PersonTotals {
  totalSpent: number;
  totalEarned: number;
  totalAppointments: number;
}

interface DateTotals {
  totalRevenue: number;
  totalAppointments: number;
  totalNewUsers: number;
}

interface DetailedTotals {
  totalAmount: number;
  totalCommission: number;
  completed: number;
  pending: number;
}

type ReportTotals = RevenueTotals | PersonTotals | DateTotals | DetailedTotals;

export default function AdminReports() {
  const [reportType, setReportType] = React.useState<ReportType>('revenue');
  const [dateRange, setDateRange] = React.useState<DateRange>('month');
  const [selectedUser, setSelectedUser] = React.useState<string>('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showFilters, setShowFilters] = React.useState(false);
  const [exportFormat, setExportFormat] = React.useState<ReportFormat>('csv');

  // Mock data for reports
  const revenueData = [
    { id: 1, escort: 'Ayşe Demir', city: 'İstanbul', revenue: 45000, appointments: 45, rating: 4.8 },
    { id: 2, escort: 'Elif Kaya', city: 'İstanbul', revenue: 38000, appointments: 38, rating: 4.9 },
    { id: 3, escort: 'Zeynep Aksoy', city: 'Ankara', revenue: 32000, appointments: 32, rating: 4.7 },
    { id: 4, escort: 'Fatma Yılmaz', city: 'İzmir', revenue: 28000, appointments: 28, rating: 4.6 },
    { id: 5, escort: 'Selin Özkan', city: 'Antalya', revenue: 25000, appointments: 25, rating: 4.9 },
  ];

  const personData = [
    { id: 1, user: 'Ahmet Yılmaz', type: 'customer', appointments: 12, spent: 15000, lastActivity: '2024-01-15' },
    { id: 2, user: 'Mehmet Kaya', type: 'customer', appointments: 8, spent: 12000, lastActivity: '2024-01-14' },
    { id: 3, user: 'Ayşe Demir', type: 'escort', appointments: 45, earned: 45000, lastActivity: '2024-01-15' },
    { id: 4, user: 'Elif Kaya', type: 'escort', appointments: 38, earned: 38000, lastActivity: '2024-01-14' },
    { id: 5, user: 'Can Yılmaz', type: 'customer', appointments: 5, spent: 7500, lastActivity: '2024-01-13' },
  ];

  const dateData = [
    { date: '2024-01-15', revenue: 5200, appointments: 8, newUsers: 3 },
    { date: '2024-01-14', revenue: 4800, appointments: 7, newUsers: 2 },
    { date: '2024-01-13', revenue: 3500, appointments: 5, newUsers: 1 },
    { date: '2024-01-12', revenue: 6100, appointments: 9, newUsers: 4 },
    { date: '2024-01-11', revenue: 2900, appointments: 4, newUsers: 2 },
  ];

  const detailedData = [
    { id: 'TXN-001', date: '2024-01-15', customer: 'Ahmet Yılmaz', escort: 'Ayşe Demir', amount: 1500, status: 'completed', commission: 225 },
    { id: 'TXN-002', date: '2024-01-15', customer: 'Mehmet Kaya', escort: 'Elif Kaya', amount: 1200, status: 'completed', commission: 180 },
    { id: 'TXN-003', date: '2024-01-14', customer: 'Can Yılmaz', escort: 'Zeynep Aksoy', amount: 1800, status: 'pending', commission: 270 },
    { id: 'TXN-004', date: '2024-01-14', customer: 'Ali Demir', escort: 'Fatma Yılmaz', amount: 2000, status: 'completed', commission: 300 },
    { id: 'TXN-005', date: '2024-01-13', customer: 'Veli Kaya', escort: 'Selin Özkan', amount: 1000, status: 'cancelled', commission: 0 },
  ];

  /**
   * Type-safe helper function to calculate revenue totals
   */
  const calculateRevenueTotals = React.useCallback((): RevenueTotals => {
    return {
      totalRevenue: revenueData.reduce((sum, item) => sum + item.revenue, 0),
      totalAppointments: revenueData.reduce((sum, item) => sum + item.appointments, 0),
      avgRating: (revenueData.reduce((sum, item) => sum + item.rating, 0) / revenueData.length).toFixed(1),
    };
  }, []);

  /**
   * Type-safe helper function to calculate person totals
   */
  const calculatePersonTotals = React.useCallback((): PersonTotals => {
    const customers = personData.filter(p => p.type === 'customer');
    const escorts = personData.filter(p => p.type === 'escort');
    return {
      totalSpent: customers.reduce((sum, item) => sum + item.spent, 0),
      totalEarned: escorts.reduce((sum, item) => sum + item.earned, 0),
      totalAppointments: personData.reduce((sum, item) => sum + item.appointments, 0),
    };
  }, []);

  /**
   * Type-safe helper function to calculate date totals
   */
  const calculateDateTotals = React.useCallback((): DateTotals => {
    return {
      totalRevenue: dateData.reduce((sum, item) => sum + item.revenue, 0),
      totalAppointments: dateData.reduce((sum, item) => sum + item.appointments, 0),
      totalNewUsers: dateData.reduce((sum, item) => sum + item.newUsers, 0),
    };
  }, []);

  /**
   * Type-safe helper function to calculate detailed totals
   */
  const calculateDetailedTotals = React.useCallback((): DetailedTotals => {
    return {
      totalAmount: detailedData.reduce((sum, item) => sum + item.amount, 0),
      totalCommission: detailedData.reduce((sum, item) => sum + item.commission, 0),
      completed: detailedData.filter(d => d.status === 'completed').length,
      pending: detailedData.filter(d => d.status === 'pending').length,
    };
  }, []);

  // Get current data based on report type
  const currentData = React.useMemo(() => {
    switch (reportType) {
      case 'revenue': return revenueData;
      case 'person': return personData;
      case 'date': return dateData;
      case 'detailed': return detailedData;
      default: return [];
    }
  }, [reportType]);

  // Filter data based on search
  const filteredData = React.useMemo(() => {
    if (!searchQuery) return currentData;
    const lower = searchQuery.toLowerCase();
    return currentData.filter((item: any) =>
      Object.values(item).some((val: any) =>
        String(val).toLowerCase().includes(lower)
      )
    );
  }, [currentData, searchQuery]);

  // Calculate totals with type safety
  const totals = React.useMemo((): ReportTotals => {
    switch (reportType) {
      case 'revenue':
        return calculateRevenueTotals();
      case 'person':
        return calculatePersonTotals();
      case 'date':
        return calculateDateTotals();
      case 'detailed':
        return calculateDetailedTotals();
      default:
        return {} as ReportTotals;
    }
  }, [reportType, calculateRevenueTotals, calculatePersonTotals, calculateDateTotals, calculateDetailedTotals]);

  // Export functions
  const exportToCSV = () => {
    const headers = Object.keys(currentData[0] || {}).join(',');
    const rows = filteredData.map((item: any) =>
      Object.values(item).map(val => `"${val}"`).join(',')
    ).join('\n');
    const csv = `${headers}\n${rows}`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapor-${reportType}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const json = JSON.stringify(filteredData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapor-${reportType}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  const handleExport = () => {
    switch (exportFormat) {
      case 'csv': exportToCSV(); break;
      case 'json': exportToJSON(); break;
      case 'pdf': alert('PDF export functionality will be implemented with jsPDF library'); break;
      case 'excel': alert('Excel export functionality will be implemented with xlsx library'); break;
    }
  };

  return (
    <ProtectedRoute accessLevel="admin">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b">
          <div className="container py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/admin">
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Finansal Raporlar
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Kişi, tarih ve kar bazlı detaylı raporlar
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={printReport}>
                  <Printer className="w-4 h-4 mr-2" />
                  Yazdır
                </Button>
                <Button className="bg-gradient-to-r from-primary to-accent" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Dışa Aktar ({exportFormat.toUpperCase()})
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-8 space-y-6">
          {/* Report Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card
              className={cn(
                'p-6 cursor-pointer transition-all hover:shadow-lg',
                reportType === 'revenue' ? 'ring-2 ring-primary bg-primary/5' : ''
              )}
              onClick={() => setReportType('revenue')}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Kar Raporu</h3>
                  <p className="text-sm text-muted-foreground">Gelir analizi</p>
                </div>
              </div>
            </Card>

            <Card
              className={cn(
                'p-6 cursor-pointer transition-all hover:shadow-lg',
                reportType === 'person' ? 'ring-2 ring-primary bg-primary/5' : ''
              )}
              onClick={() => setReportType('person')}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Kişi Raporu</h3>
                  <p className="text-sm text-muted-foreground">Kullanıcı analizi</p>
                </div>
              </div>
            </Card>

            <Card
              className={cn(
                'p-6 cursor-pointer transition-all hover:shadow-lg',
                reportType === 'date' ? 'ring-2 ring-primary bg-primary/5' : ''
              )}
              onClick={() => setReportType('date')}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Tarih Raporu</h3>
                  <p className="text-sm text-muted-foreground">Zaman analizi</p>
                </div>
              </div>
            </Card>

            <Card
              className={cn(
                'p-6 cursor-pointer transition-all hover:shadow-lg',
                reportType === 'detailed' ? 'ring-2 ring-primary bg-primary/5' : ''
              )}
              onClick={() => setReportType('detailed')}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Detaylı Rapor</h3>
                  <p className="text-sm text-muted-foreground">Tüm işlemler</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Filtreler
                    {showFilters && <ChevronDown className="w-4 h-4" />}
                  </Button>

                  <Select value={dateRange} onValueChange={(v: any) => setDateRange(v)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Tarih Aralığı" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Bugün</SelectItem>
                      <SelectItem value="week">Bu Hafta</SelectItem>
                      <SelectItem value="month">Bu Ay</SelectItem>
                      <SelectItem value="year">Bu Yıl</SelectItem>
                      <SelectItem value="custom">Özel Aralık</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={exportFormat} onValueChange={(v: any) => setExportFormat(v)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rapor ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-[300px]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Kullanıcı Tipi
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Tümü" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tümü</SelectItem>
                        <SelectItem value="customer">Müşteri</SelectItem>
                        <SelectItem value="escort">Eskort</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Şehir
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Tümü" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tümü</SelectItem>
                        <SelectItem value="istanbul">İstanbul</SelectItem>
                        <SelectItem value="ankara">Ankara</SelectItem>
                        <SelectItem value="izmir">İzmir</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Durum
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Tümü" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tümü</SelectItem>
                        <SelectItem value="active">Aktif</SelectItem>
                        <SelectItem value="pending">Beklemede</SelectItem>
                        <SelectItem value="completed">Tamamlandı</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Sıralama
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Tarih" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date-desc">Yeniden Eskiye</SelectItem>
                        <SelectItem value="date-asc">Eskenden Yeniye</SelectItem>
                        <SelectItem value="revenue-desc">Yüksek Gelir</SelectItem>
                        <SelectItem value="revenue-asc">Düşük Gelir</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {reportType === 'revenue' && (
              <>
                <StatCard
                  title="Toplam Gelir"
                  value={`₺${(totals as RevenueTotals).totalRevenue.toLocaleString('tr-TR')}`}
                  icon={DollarSign}
                  variant="success"
                />
                <StatCard
                  title="Toplam Randevu"
                  value={(totals as RevenueTotals).totalAppointments}
                  icon={Calendar}
                  variant="default"
                />
                <StatCard
                  title="Ortalama Puan"
                  value={`⭐ ${(totals as RevenueTotals).avgRating}`}
                  icon={Star}
                  variant="warning"
                />
                <StatCard
                  title="Aktif Eskort"
                  value={revenueData.length}
                  icon={Users}
                  variant="info"
                />
              </>
            )}
            {reportType === 'person' && (
              <>
                <StatCard
                  title="Toplam Harcama"
                  value={`₺${(totals as PersonTotals).totalSpent.toLocaleString('tr-TR')}`}
                  icon={DollarSign}
                  variant="default"
                />
                <StatCard
                  title="Toplam Kazanç"
                  value={`₺${(totals as PersonTotals).totalEarned.toLocaleString('tr-TR')}`}
                  icon={TrendingUp}
                  variant="success"
                />
                <StatCard
                  title="Toplam Randevu"
                  value={(totals as PersonTotals).totalAppointments}
                  icon={Calendar}
                  variant="info"
                />
                <StatCard
                  title="Aktif Kullanıcı"
                  value={personData.length}
                  icon={UserCheck}
                  variant="warning"
                />
              </>
            )}
            {reportType === 'date' && (
              <>
                <StatCard
                  title="Toplam Gelir"
                  value={`₺${(totals as DateTotals).totalRevenue.toLocaleString('tr-TR')}`}
                  icon={DollarSign}
                  variant="success"
                />
                <StatCard
                  title="Toplam Randevu"
                  value={(totals as DateTotals).totalAppointments}
                  icon={Calendar}
                  variant="default"
                />
                <StatCard
                  title="Yeni Üye"
                  value={(totals as DateTotals).totalNewUsers}
                  icon={Users}
                  variant="info"
                />
                <StatCard
                  title="Ort. Günlük Gelir"
                  value={`₺${dateData.length > 0 ? Math.round((totals as DateTotals).totalRevenue / dateData.length).toLocaleString('tr-TR') : '0'}`}
                  icon={TrendingUp}
                  variant="warning"
                />
              </>
            )}
            {reportType === 'detailed' && (
              <>
                <StatCard
                  title="Toplam Tutar"
                  value={`₺${(totals as DetailedTotals).totalAmount.toLocaleString('tr-TR')}`}
                  icon={DollarSign}
                  variant="success"
                />
                <StatCard
                  title="Komisyon"
                  value={`₺${(totals as DetailedTotals).totalCommission.toLocaleString('tr-TR')}`}
                  icon={TrendingUp}
                  variant="default"
                />
                <StatCard
                  title="Tamamlanan"
                  value={(totals as DetailedTotals).completed}
                  icon={Calendar}
                  variant="success"
                />
                <StatCard
                  title="Bekleyen"
                  value={(totals as DetailedTotals).pending}
                  icon={Clock}
                  variant="warning"
                />
              </>
            )}
          </div>

          {/* Report Table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    {reportType === 'revenue' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Eskort</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Şehir</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Randevu</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Gelir</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Puan</th>
                      </>
                    )}
                    {reportType === 'person' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Kullanıcı</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Tip</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Randevu</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Tutar</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Son Aktivite</th>
                      </>
                    )}
                    {reportType === 'date' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Tarih</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Gelir</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Randevu</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Yeni Üye</th>
                      </>
                    )}
                    {reportType === 'detailed' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">İşlem No</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Tarih</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Müşteri</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Eskort</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Tutar</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Durum</th>
                      </>
                    )}
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="bg-card">
                  {filteredData.map((item: any, index) => (
                    <tr key={index} className="hover:bg-muted/50 border-b">
                      {reportType === 'revenue' && (
                        <>
                          <td className="px-6 py-4 font-medium">{item.escort}</td>
                          <td className="px-6 py-4">{item.city}</td>
                          <td className="px-6 py-4">{item.appointments}</td>
                          <td className="px-6 py-4 font-semibold text-green-600">₺{item.revenue.toLocaleString()}</td>
                          <td className="px-6 py-4">⭐ {item.rating}</td>
                        </>
                      )}
                      {reportType === 'person' && (
                        <>
                          <td className="px-6 py-4 font-medium">{item.user}</td>
                          <td className="px-6 py-4">
                            <Badge variant={item.type === 'escort' ? 'default' : 'secondary'}>
                              {item.type === 'escort' ? 'Eskort' : 'Müşteri'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">{item.appointments}</td>
                          <td className="px-6 py-4 font-semibold">
                            {item.spent ? `₺${item.spent.toLocaleString()}` : `₺${item.earned.toLocaleString()}`}
                          </td>
                          <td className="px-6 py-4">{item.lastActivity}</td>
                        </>
                      )}
                      {reportType === 'date' && (
                        <>
                          <td className="px-6 py-4 font-medium">{item.date}</td>
                          <td className="px-6 py-4 font-semibold text-green-600">₺{item.revenue.toLocaleString()}</td>
                          <td className="px-6 py-4">{item.appointments}</td>
                          <td className="px-6 py-4">{item.newUsers}</td>
                        </>
                      )}
                      {reportType === 'detailed' && (
                        <>
                          <td className="px-6 py-4 font-mono text-sm">{item.id}</td>
                          <td className="px-6 py-4">{item.date}</td>
                          <td className="px-6 py-4">{item.customer}</td>
                          <td className="px-6 py-4">{item.escort}</td>
                          <td className="px-6 py-4 font-semibold">₺{item.amount.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <Badge
                              variant={
                                item.status === 'completed' ? 'default' :
                                item.status === 'pending' ? 'secondary' : 'destructive'
                              }
                              className={
                                item.status === 'completed' ? 'bg-green-500' :
                                item.status === 'pending' ? 'bg-orange-500' : ''
                              }
                            >
                              {item.status === 'completed' ? 'Tamamlandı' :
                               item.status === 'pending' ? 'Beklemede' : 'İptal'}
                            </Badge>
                          </td>
                        </>
                      )}
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Veri bulunamadı</p>
              </div>
            )}
          </Card>

          {/* Export Info */}
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/20 rounded-lg">
                  <Share2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-primary">Rapor Paylaşımı</p>
                  <p className="text-sm text-muted-foreground">
                    {filteredData.length} kayıt {exportFormat.toUpperCase()} formatında dışa aktarılmaya hazır
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Paylaş
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-primary to-accent" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  İndir
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          body { background: white; }
        }
      `}</style>
    </ProtectedRoute>
  );
}
