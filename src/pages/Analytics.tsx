/**
 * Analytics Page
 *
 * Main analytics and reporting page with dashboard and reports.
 *
 * @module pages/Analytics
 * @category Pages - Private
 *
 * Features:
 * - Real-time analytics dashboard
 * - KPI cards with trends
 * - Interactive charts (line, doughnut, bar)
 * - Traffic sources and demographics
 * - Report generation and export
 * - Custom time period filtering
 *
 * @example
 * ```tsx
 * // Route: /analytics
 * <Analytics />
 * ```
 */

import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { ReportsPanel } from '@/components/ReportsPanel';
import { useAuth } from '@/contexts/AuthContext';
import {
  ChevronLeft,
  BarChart3,
  FileText,
  TrendingUp,
  Settings,
  Shield,
  Star,
  Heart,
  Users,
  Calendar,
  Eye,
  DollarSign,
  Clock,
  MessageSquare,
} from 'lucide-react';

/**
 * Quick stat card component
 */
interface QuickStat {
  icon: React.ElementType;
  value: string;
  label: string;
  color: string;
}

export default function Analytics() {
  const { userRole, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reports'>('dashboard');
  const isEscort = userRole === 'escort';

  // Role-based quick stats
  const quickStats = useMemo<QuickStat[]>(() => {
    if (isEscort) {
      return [
        { icon: Eye, value: '45,230', label: 'Profil Görüntülenme', color: 'bg-blue-500/20 text-blue-600' },
        { icon: Users, value: '12,450', label: 'Benzersiz Ziyaretçi', color: 'bg-green-500/20 text-green-600' },
        { icon: Calendar, value: '234', label: 'Randevu Talebi', color: 'bg-purple-500/20 text-purple-600' },
        { icon: DollarSign, value: '₺125K', label: 'Toplam Gelir', color: 'bg-yellow-500/20 text-yellow-600' },
      ];
    } else {
      return [
        { icon: Heart, value: '24', label: 'Favori Escort', color: 'bg-red-500/20 text-red-600' },
        { icon: Calendar, value: '18', label: 'Randevu', color: 'bg-blue-500/20 text-blue-600' },
        { icon: MessageSquare, value: '156', label: 'Mesaj', color: 'bg-purple-500/20 text-purple-600' },
        { icon: Star, value: '4.8', label: 'Ortalama Puan', color: 'bg-yellow-500/20 text-yellow-600' },
      ];
    }
  }, [isEscort]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b">
        <div className="container py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">
                  ANALİTİK
                </h1>
                <Badge variant="outline" className={isEscort ? 'bg-purple-500/10 text-purple-600 border-purple-500/30' : 'bg-blue-500/10 text-blue-600 border-blue-500/30'}>
                  <Shield className="w-3 h-3 mr-1" />
                  {isEscort ? 'Escort Paneli' : 'Müşteri Paneli'}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {isEscort
                  ? 'Profil görüntülenme, randevu istatistikleri ve gelir analizi'
                  : 'Aktivite istatistikleri, harcama analizi ve randevu geçmişi'}
              </p>
            </div>
          </div>

          {/* Quick Stats - Role Based */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickStats.map((stat) => (
              <div key={stat.label} className="bg-card border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="reports">
              <FileText className="w-4 h-4 mr-2" />
              Raporlar
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab - Role Specific */}
          <TabsContent value="dashboard">
            <AnalyticsDashboard autoRefresh={true} userRole={userRole} />
          </TabsContent>

          {/* Reports Tab - Role Specific */}
          <TabsContent value="reports">
            <ReportsPanel userRole={userRole} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer Info */}
      <div className="border-t mt-8">
        <div className="container py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>Veriler her 5 saniyede bir otomatik güncellenir</p>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Analitik Ayarları
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Analytics };
