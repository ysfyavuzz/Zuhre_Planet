/**
 * Escort Dashboard Page
 *
 * Comprehensive dashboard for escorts to manage their profile, listings,
 * appointments, messages, and analytics.
 *
 * @module pages/EscortDashboard
 * @category Pages - Dashboard
 *
 * Features:
 * - Overview stats (views, calls, messages, revenue)
 * - Profile management
 * - Gallery management
 * - Appointment management with confirm/reject
 * - Message center
 * - Analytics integration
 * - Reviews management
 * - Availability calendar
 * - Earnings overview
 *
 * @example
 * ```tsx
 * // Route: /escort/dashboard
 * <EscortDashboard />
 * ```
 */

import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Home,
  User,
  Calendar,
  MessageSquare,
  Settings,
  Image,
  Star,
  TrendingUp,
  DollarSign,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
  MapPin,
  Heart,
  BarChart3,
  Bell,
  Award,
  Shield,
  Upload,
  Edit,
  Trash2,
  Filter,
  FileText,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { mockEscorts } from '@/mockData';

type DashboardTab = 'overview' | 'profile' | 'gallery' | 'appointments' | 'messages' | 'analytics' | 'reviews' | 'settings';

export default function EscortDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  // Mock stats
  const stats = useMemo(() => ({
    views: 1250,
    profileViews: 856,
    calls: 48,
    messages: 23,
    unreadMessages: 5,
    rating: 4.8,
    totalReviews: 45,
    appointments: 12,
    upcomingAppointments: 3,
    completedAppointments: 9,
    revenue: 4500,
    thisMonthRevenue: 12500,
    lastMonthRevenue: 9800,
    responseRate: 92,
    avgResponseTime: '12 dk',
  }), []);

  // Mock appointments
  const appointments = [
    {
      id: '1',
      customerName: 'Mehmet Y.',
      customerPhoto: 'https://i.pravatar.cc/150?img=1',
      date: '2026-01-25',
      time: '19:00',
      service: 'Akşam Yemeği',
      location: 'İstanbul, Beşiktaş',
      duration: '2 saat',
      status: 'pending' as 'pending' | 'confirmed' | 'completed' | 'cancelled',
      notes: 'Özel istek: Lüks restoran tercih edilir',
    },
    {
      id: '2',
      customerName: 'Can K.',
      customerPhoto: 'https://i.pravatar.cc/150?img=2',
      date: '2026-01-26',
      time: '20:00',
      service: 'Etkinlik Eşliği',
      location: 'İstanbul, Kadıköy',
      duration: '3 saat',
      status: 'confirmed',
      notes: '',
    },
    {
      id: '3',
      customerName: 'Emre A.',
      customerPhoto: 'https://i.pravatar.cc/150?/img=3',
      date: '2026-01-27',
      time: '18:00',
      service: 'Özel Davet',
      location: 'İstanbul, Şişli',
      duration: '4 saat',
      status: 'confirmed',
      notes: 'Formal dress code',
    },
  ];

  // Mock messages
  const conversations = [
    {
      id: '1',
      customerName: 'Ahmet K.',
      customerPhoto: 'https://i.pravatar.cc/150?img=4',
      lastMessage: 'Randevu detaylarını konuşalım mı?',
      time: '14:30',
      unread: 2,
    },
    {
      id: '2',
      customerName: 'Burak S.',
      customerPhoto: 'https://i.pravatar.cc/150?img=5',
      lastMessage: 'Fiyat bilgisi alabilir miyim?',
      time: '12:15',
      unread: 1,
    },
    {
      id: '3',
      customerName: 'Mert T.',
      customerPhoto: 'https://i.pravatar.cc/150?img=6',
      lastMessage: 'Teşekkür ederim!',
      time: 'Dün',
      unread: 0,
    },
  ];

  // Mock reviews
  const reviews = [
    {
      id: '1',
      customerName: 'Ahmet K.',
      rating: 5,
      comment: 'Mükemmel bir deneyimdi. Kesinlikle tavsiye ederim!',
      date: '2 gün önce',
      service: 'Akşam Yemeği',
    },
    {
      id: '2',
      customerName: 'Mehmet Y.',
      rating: 4,
      comment: 'Güler yüzlü ve ilgili. Tekrar görüşmek isteriz.',
      date: '1 hafta önce',
      service: 'Etkinlik Eşliği',
    },
    {
      id: '3',
      customerName: 'Can E.',
      rating: 5,
      comment: 'Profesyonel ve samimi. Harika vakit geçirdik.',
      date: '2 hafta önce',
      service: 'Özel Davet',
    },
  ];

  // Status badge component
  function StatusBadge({ status }: { status: 'pending' | 'confirmed' | 'completed' | 'cancelled' }) {
    const config = {
      pending: { label: 'Bekliyor', color: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20', icon: Clock },
      confirmed: { label: 'Onaylı', color: 'bg-green-500/10 text-green-700 border-green-500/20', icon: CheckCircle2 },
      completed: { label: 'Tamamlandı', color: 'bg-blue-500/10 text-blue-700 border-blue-500/20', icon: CheckCircle2 },
      cancelled: { label: 'İptal', color: 'bg-red-500/10 text-red-700 border-red-500/20', icon: XCircle },
    };

    const { label, color, icon: Icon } = config[status];

    return (
      <Badge className={color}>
        <Icon className="w-3 h-3 mr-1" />
        {label}
      </Badge>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 border-b border-border/50">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black mb-2 tracking-tighter">
                Escort Paneli
              </h1>
              <p className="text-muted-foreground">
                Profilinizi, randevularınızı ve istatistiklerinizi yönetin
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Profil Durumu</p>
                <Badge className="bg-green-500 text-white mt-1">
                  <Shield className="w-3 h-3 mr-1" />
                  Onaylı
                </Badge>
              </div>
              <Link href="/escort/market">
                <Button className="bg-gradient-to-r from-primary to-accent">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  İlanı Yükselt
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container py-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DashboardTab)}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">
              <Home className="w-4 h-4 mr-2" />
              Genel Bakış
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="gallery">
              <Image className="w-4 h-4 mr-2" />
              Galeri
            </TabsTrigger>
            <TabsTrigger value="appointments">
              <Calendar className="w-4 h-4 mr-2" />
              Randevular
              {stats.upcomingAppointments > 0 && (
                <Badge variant="secondary" className="ml-1">{stats.upcomingAppointments}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="messages">
              <MessageSquare className="w-4 h-4 mr-2" />
              Mesajlar
              {stats.unreadMessages > 0 && (
                <Badge variant="secondary" className="ml-1">{stats.unreadMessages}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analitik
            </TabsTrigger>
            <TabsTrigger value="reviews">
              <Star className="w-4 h-4 mr-2" />
              Değerlendirmeler
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Ayarlar
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-blue-500/10">
                          <Eye className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                          <div className="text-2xl font-black">{stats.views}</div>
                          <div className="text-sm text-muted-foreground">Profil Görüntülenme</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-green-500/10">
                          <DollarSign className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                          <div className="text-2xl font-black">₺{stats.revenue.toLocaleString('tr-TR')}</div>
                          <div className="text-sm text-muted-foreground">Bu Ay Gelir</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-purple-500/10">
                          <Calendar className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                          <div className="text-2xl font-black">{stats.appointments}</div>
                          <div className="text-sm text-muted-foreground">Randevu</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-yellow-500/10">
                          <Star className="w-6 h-6 text-yellow-500" />
                        </div>
                        <div>
                          <div className="text-2xl font-black">{stats.rating}</div>
                          <div className="text-sm text-muted-foreground">Puan ({stats.totalReviews})</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Quick Actions & Upcoming */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Appointments */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Yaklaşan Randevular
                      </CardTitle>
                      <Link href="/appointments">
                        <Button variant="link" className="text-primary p-0">
                          Tümünü Gör →
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {appointments.slice(0, 3).map((apt) => (
                        <div key={apt.id} className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex-shrink-0">
                            <img
                              src={apt.customerPhoto}
                              alt={apt.customerName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold truncate">{apt.customerName}</h4>
                              <StatusBadge status={apt.status as 'pending' | 'confirmed' | 'completed' | 'cancelled'} />
                            </div>
                            <p className="text-sm text-muted-foreground">{apt.service}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(apt.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {apt.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {apt.location}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Messages */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Mesajlar
                      </CardTitle>
                      <Link href="/messages">
                        <Button variant="link" className="text-primary p-0">
                          Tümünü Gör →
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {conversations.slice(0, 3).map((conv) => (
                        <Link key={conv.id} href={`/messages/${conv.id}`}>
                          <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                            <div className="relative">
                              <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                                <img
                                  src={conv.customerPhoto}
                                  alt={conv.customerName}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              {conv.unread > 0 && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                                  {conv.unread}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold truncate">{conv.customerName}</h4>
                                <span className="text-xs text-muted-foreground">{conv.time}</span>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Performans
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted/20 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">%{stats.responseRate}</p>
                      <p className="text-sm text-muted-foreground">Yanıt Oranı</p>
                    </div>
                    <div className="text-center p-4 bg-muted/20 rounded-lg">
                      <p className="text-2xl font-bold">{stats.avgResponseTime}</p>
                      <p className="text-sm text-muted-foreground">Ort. Yanıt Süresi</p>
                    </div>
                    <div className="text-center p-4 bg-muted/20 rounded-lg">
                      <p className="text-2xl font-bold">{stats.completedAppointments}</p>
                      <p className="text-sm text-muted-foreground">Tamamlanan Randevu</p>
                    </div>
                    <div className="text-center p-4 bg-muted/20 rounded-lg">
                      <p className="text-2xl font-bold">₺{stats.thisMonthRevenue.toLocaleString('tr-TR')}</p>
                      <p className="text-sm text-muted-foreground">Bu Ay Gelir</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="max-w-3xl">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Profil Bilgileri</CardTitle>
                    <Button>
                      <Edit className="w-4 h-4 mr-2" />
                      Düzenle
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Overview */}
                  <div className="flex items-start gap-6 p-6 bg-muted/20 rounded-lg">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-3xl font-bold">
                      {user?.name?.charAt(0) || 'E'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">{user?.name || 'Escort Adı'}</h3>
                      <p className="text-muted-foreground mb-3">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        İstanbul, Türkiye
                      </p>
                      <div className="flex items-center gap-4">
                        <Badge className="bg-green-500 text-white">
                          <Shield className="w-3 h-3 mr-1" />
                          Onaylı Profil
                        </Badge>
                        <Badge variant="secondary">
                          <Star className="w-3 h-3 mr-1 text-yellow-500" />
                          {stats.rating} ({stats.totalReviews} değerlendirme)
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Profile Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold">{stats.views}</p>
                      <p className="text-sm text-muted-foreground">Profil Görüntülenme</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold">{stats.calls}</p>
                      <p className="text-sm text-muted-foreground">Arama</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold">{stats.rating}</p>
                      <p className="text-sm text-muted-foreground">Puan</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Quick Actions */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Hızlı İşlemler</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="justify-start">
                        <Edit className="w-4 h-4 mr-2" />
                        Profili Düzenle
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Shield className="w-4 h-4 mr-2" />
                        Doğrulama Durumu
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Award className="w-4 h-4 mr-2" />
                        VIP Üyelik
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Bell className="w-4 h-4 mr-2" />
                        Bildirim Ayarları
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Fotoğraf Galerisi</CardTitle>
                    <Button>
                      <Upload className="w-4 h-4 mr-2" />
                      Yükle
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div key={i} className="relative group">
                        <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                          <img
                            src={`https://via.placeholder.com/300x400?text=Photo+${i}`}
                            alt={`Fotoğraf ${i}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="icon" variant="secondary" className="h-8 w-8">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="destructive" className="h-8 w-8">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <Badge className="absolute bottom-2 left-2 bg-black/50 text-white">
                          {i === 1 ? 'Profil' : `Galeri ${i}`}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <div className="space-y-6">
              {/* Appointment Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-3xl font-bold text-blue-600">{stats.upcomingAppointments}</p>
                    <p className="text-sm text-muted-foreground">Gelecek Randevu</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-3xl font-bold text-green-600">{stats.completedAppointments}</p>
                    <p className="text-sm text-muted-foreground">Tamamlanan</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-3xl font-bold text-purple-600">₺{stats.revenue.toLocaleString('tr-TR')}</p>
                    <p className="text-sm text-muted-foreground">Toplam Gelir</p>
                  </CardContent>
                </Card>
              </div>

              {/* Appointments List */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Randevu Talepleri</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filtrele
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {appointments.map((apt) => (
                      <div key={apt.id} className="p-4 border rounded-lg hover:border-primary/50 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex-shrink-0">
                            <img
                              src={apt.customerPhoto}
                              alt={apt.customerName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-lg">{apt.customerName}</h4>
                                <p className="text-sm text-muted-foreground">{apt.service}</p>
                              </div>
                              <StatusBadge status={apt.status as 'pending' | 'confirmed' | 'completed' | 'cancelled'} />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(apt.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>{apt.time}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>{apt.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>{apt.duration}</span>
                              </div>
                            </div>

                            {apt.notes && (
                              <div className="p-3 bg-muted/20 rounded-lg text-sm">
                                <p className="font-medium mb-1">Not:</p>
                                <p className="text-muted-foreground">{apt.notes}</p>
                              </div>
                            )}

                            <div className="flex gap-2 mt-3">
                              {apt.status === 'pending' && (
                                <>
                                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                    <CheckCircle2 className="w-4 h-4 mr-1" />
                                    Onayla
                                  </Button>
                                  <Button size="sm" variant="destructive">
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Reddet
                                  </Button>
                                </>
                              )}
                              {apt.status === 'confirmed' && (
                                <>
                                  <Button size="sm" variant="outline">
                                    <MessageSquare className="w-4 h-4 mr-1" />
                                    Mesaj
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Phone className="w-4 h-4 mr-1" />
                                    Ara
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <div className="max-w-3xl">
              <Card>
                <CardHeader>
                  <CardTitle>Mesajlar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {conversations.map((conv) => (
                      <Link key={conv.id} href={`/messages/${conv.id}`}>
                        <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/20 transition-colors cursor-pointer">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                              <img
                                src={conv.customerPhoto}
                                alt={conv.customerName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {conv.unread > 0 && (
                              <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {conv.unread}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold">{conv.customerName}</h4>
                              <span className="text-xs text-muted-foreground">{conv.time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Analitik Özeti</CardTitle>
                    <Link href="/analytics">
                      <Button>
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Detaylı Analitik
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-muted/20 rounded-lg text-center">
                      <p className="text-3xl font-bold">{stats.views}</p>
                      <p className="text-sm text-muted-foreground">Görüntülenme</p>
                    </div>
                    <div className="p-4 bg-muted/20 rounded-lg text-center">
                      <p className="text-3xl font-bold">{stats.calls}</p>
                      <p className="text-sm text-muted-foreground">Arama</p>
                    </div>
                    <div className="p-4 bg-muted/20 rounded-lg text-center">
                      <p className="text-3xl font-bold">%{stats.responseRate}</p>
                      <p className="text-sm text-muted-foreground">Yanıt Oranı</p>
                    </div>
                    <div className="p-4 bg-muted/20 rounded-lg text-center">
                      <p className="text-3xl font-bold">{stats.avgResponseTime}</p>
                      <p className="text-sm text-muted-foreground">Yanıt Süresi</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gelirgeçmiş</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-500/10 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Bu Ay</p>
                      <p className="text-2xl font-bold text-green-600">₺{stats.thisMonthRevenue.toLocaleString('tr-TR')}</p>
                    </div>
                    <div className="p-4 bg-blue-500/10 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Geçen Ay</p>
                      <p className="text-2xl font-bold text-blue-600">₺{stats.lastMonthRevenue.toLocaleString('tr-TR')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <div className="max-w-3xl">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Değerlendirmeler</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-3xl font-bold">{stats.rating}</p>
                        <p className="text-sm text-muted-foreground">{stats.totalReviews} değerlendirme</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-4 border rounded-lg">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-semibold">{review.customerName}</h4>
                                <p className="text-xs text-muted-foreground">{review.date}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                            <Badge variant="secondary">{review.service}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="max-w-3xl space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hesap Ayarları</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Profil Görünürlük</p>
                      <p className="text-sm text-muted-foreground">Profiliniz aramalarda gösterilsin</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Mesaj Bildirimleri</p>
                      <p className="text-sm text-muted-foreground">Yeni mesajlarda bildirim alın</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Randevu Bildirimleri</p>
                      <p className="text-sm text-muted-foreground">Yeni randevu taleplerinde bildirim alın</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Promosyonlar</p>
                      <p className="text-sm text-muted-foreground">Promosyon ve kampanya bilgileri alın</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ödeme ve Faturalandırma</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Ödeme Bilgileri
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      Fatura Geçmişi
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
