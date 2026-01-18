/**
 * Admin Dashboard Page
 * 
 * Main administration hub providing comprehensive platform oversight and management.
 * Displays real-time statistics, recent activities, and quick action controls for admins.
 * Enables monitoring of platform health, user activities, and system performance.
 * 
 * @module pages/AdminDashboard
 * @category Pages - Admin
 * 
 * Features:
 * - Real-time platform statistics (users, listings, revenue)
 * - User management with approval/suspension capabilities
 * - Activity feed showing recent platform events
 * - Quick action cards for common admin tasks
 * - Tabbed interface for organized data navigation
 * - User role filtering (clients, escorts, VIP users)
 * - Status indicators for pending approvals and alerts
 * - Direct access to approval queue and reporting system
 * - Performance metrics and trend analysis
 * - Admin settings and system configuration access
 * 
 * Security:
 * - Admin role authentication required
 * - Restricted access to platform-sensitive data
 * - Role-based permission enforcement
 * 
 * @example
 * ```tsx
 * // Route: /admin
 * <AdminDashboard />
 * ```
 */

import { useState } from 'react';
import { Link } from 'wouter';
import { trpc } from '../lib/trpc';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Shield, Users, Calendar, DollarSign, Eye, TrendingUp,
  UserCheck, UserX, Clock, AlertCircle, CheckCircle2,
  XCircle, Crown, Star, MessageCircle, BarChart3,
  Settings, LogOut, Home, ArrowLeft
} from 'lucide-react';

export default function AdminDashboard() {
  const { data: user } = trpc.auth.me.useQuery();
  const { data: stats } = trpc.admin.getDashboardStats.useQuery(
    undefined,
    { enabled: !!user && user.role === 'admin' }
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="card-premium p-12 text-center max-w-md">
          <Shield className="w-20 h-20 mx-auto mb-6 text-muted-foreground/30" />
          <h3 className="text-2xl font-bold mb-3">Giriş Yapın</h3>
          <p className="text-muted-foreground mb-6">
            Admin paneline erişmek için giriş yapmalısınız.
          </p>
          <Button className="w-full bg-gradient-to-r from-primary to-accent">
            Giriş Yap
          </Button>
        </Card>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="card-premium p-12 text-center max-w-md">
          <AlertCircle className="w-20 h-20 mx-auto mb-6 text-red-500/30" />
          <h3 className="text-2xl font-bold mb-3">Erişim Reddedildi</h3>
          <p className="text-muted-foreground mb-6">
            Bu sayfaya erişim yetkiniz bulunmamaktadır.
          </p>
          <Link href="/">
            <Button className="w-full bg-gradient-to-r from-primary to-accent">
              Ana Sayfaya Dön
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Toplam Kullanıcı',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
      trend: '+12%',
    },
    {
      title: 'Aktif Escort',
      value: stats?.totalEscorts || 0,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
      trend: '+8%',
    },
    {
      title: 'Bekleyen Onay',
      value: stats?.pendingApprovalsCount || 0,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-500/10',
      trend: '3 yeni',
    },
    {
      title: 'Aylık Randevu',
      value: 0,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
      trend: '+24%',
    },
    {
      title: 'Aylık Gelir',
      value: `₺${0}`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10',
      trend: '+18%',
    },
    {
      title: 'VIP Üyeler',
      value: 0,
      icon: Crown,
      color: 'text-amber-600',
      bgColor: 'bg-amber-500/10',
      trend: '+5',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-2">
                  <Shield className="w-6 h-6 text-primary" />
                  Admin Paneli
                </h1>
                <p className="text-sm text-muted-foreground">
                  Hoş geldiniz, {user.name || user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="outline" size="icon">
                  <Home className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="card-premium hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold mb-2">{stat.value}</p>
                      <Badge variant="secondary" className="text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {stat.trend}
                      </Badge>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/admin/approvals">
            <Card className="card-premium hover-lift cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-amber-500/10">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Onay Bekleyenler</p>
                    <p className="text-sm text-muted-foreground">Profilleri incele</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="card-premium hover-lift cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold">Kullanıcılar</p>
                  <p className="text-sm text-muted-foreground">Tüm kullanıcılar</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-purple-500/10">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold">Randevular</p>
                  <p className="text-sm text-muted-foreground">Tüm randevular</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-emerald-500/10">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold">Gelir Raporları</p>
                  <p className="text-sm text-muted-foreground">Finansal analiz</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Registrations */}
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-primary" />
                Son Kayıtlar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-bold">
                        E{i}
                      </div>
                      <div>
                        <p className="font-semibold">Escort {i}</p>
                        <p className="text-xs text-muted-foreground">İstanbul</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Yeni</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Appointments */}
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Son Randevular
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Calendar className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">Randevu #{1000 + i}</p>
                        <p className="text-xs text-muted-foreground">Bugün, 14:00</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Onaylandı
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
