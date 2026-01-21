/**
 * Customer Dashboard Page
 *
 * Main dashboard for customer users after login.
 * Shows favorites, appointments, messages, and activity history.
 *
 * @module pages/CustomerDashboard
 * @category Pages - Dashboard
 *
 * Features:
 * - Quick stats (favorites count, upcoming appointments, unread messages)
 * - Favorites management with quick actions
 * - Upcoming appointments with status tracking
 * - Recent activity feed
 * - Quick action buttons (book, message, search)
 * - Profile overview and membership status
 * - Notification center
 * - Search history
 * - Payment history overview
 *
 * @example
 * ```tsx
 * // Route: /dashboard
 * // Customer dashboard after login
 * <CustomerDashboard />
 * ```
 */

import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProtectedRoute from '@/components/ProtectedRoute';
import { mockEscorts } from '@/mockData';
import { useAuth } from '@/contexts/AuthContext';
import {
  Heart, Calendar, MessageCircle, Search, Settings, User,
  Star, Clock, CheckCircle2, XCircle, AlertCircle,
  TrendingUp, Award, Crown, Sparkles, Eye, ChevronRight,
  Bell, MapPin, Phone, Filter, BarChart3, ThumbsUp,
  FileText, DollarSign, Reply, Archive, Home, Shield, Flag
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SEO } from '@/pages/SEO';

/**
 * Appointment status
 */
type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled' | 'pending';

/**
 * Mock appointment data
 */
const mockAppointments = [
  {
    id: '1',
    escortId: '1',
    escortName: 'Ayşe Y.',
    escortPhoto: mockEscorts[0]?.profilePhoto,
    date: '2026-01-25',
    time: '19:00',
    status: 'upcoming' as AppointmentStatus,
    service: 'Akşam Yemeği',
    location: 'İstanbul, Beşiktaş',
    price: 1500,
  },
  {
    id: '2',
    escortId: '3',
    escortName: 'Zeynep K.',
    escortPhoto: mockEscorts[2]?.profilePhoto,
    date: '2026-01-20',
    time: '20:00',
    status: 'completed' as AppointmentStatus,
    service: 'Etkinlik Eşliği',
    location: 'İstanbul, Kadıköy',
    price: 2000,
  },
  {
    id: '3',
    escortId: '5',
    escortName: 'Elif S.',
    escortPhoto: mockEscorts[4]?.profilePhoto,
    date: '2026-01-22',
    time: '18:00',
    status: 'upcoming' as AppointmentStatus,
    service: 'Özel Davet',
    location: 'İstanbul, Şişli',
    price: 3000,
  },
];

/**
 * Mock message data
 */
const mockMessages = [
  {
    id: '1',
    escortId: '1',
    escortName: 'Ayşe Y.',
    escortPhoto: mockEscorts[0]?.profilePhoto,
    lastMessage: 'Randevu detaylarını konuşalım mı?',
    time: '14:30',
    unread: 2,
  },
  {
    id: '2',
    escortId: '5',
    escortName: 'Elif S.',
    escortPhoto: mockEscorts[4]?.profilePhoto,
    lastMessage: 'Teşekkür ederim!',
    time: 'Dün',
    unread: 0,
  },
];

/**
 * Mock review data (geçmiş değerlendirmeler)
 */
const mockReviews = [
  {
    id: '1',
    escortId: '3',
    escortName: 'Zeynep K.',
    escortPhoto: mockEscorts[2]?.profilePhoto,
    rating: 5,
    comment: 'Harika bir deneyimdi, çok profesyonel ve nazikti.',
    date: '2026-01-20',
    bookingDate: '2026-01-15',
  },
  {
    id: '2',
    escortId: '2',
    escortName: 'Mehmet A.',
    escortPhoto: mockEscorts[1]?.profilePhoto,
    rating: 4,
    comment: 'Güzel bir akşam geçirdik, teşekkürler.',
    date: '2026-01-10',
    bookingDate: '2026-01-08',
  },
];

/**
 * Mock report data (yapılan şikayetler)
 */
const mockReports = [
  {
    id: '1',
    escortId: '8',
    escortName: 'Sahte Profil X',
    reason: 'fake_profile' as const,
    reasonLabel: 'Sahte Profil',
    description: 'Profil fotoğrafları gerçeği yansıtmıyor, tamamen farklı bir kişi geldi.',
    status: 'reviewing' as const,
    statusLabel: 'İnceleniyor',
    createdAt: '2026-01-18',
  },
  {
    id: '2',
    escortId: '9',
    escortName: 'Test Kullanıcı Y',
    reason: 'scam' as const,
    reasonLabel: 'Dolandırıcılık',
    description: 'Ödeme aldıktan sonra randevuya gelmedi.',
    status: 'resolved' as const,
    statusLabel: 'Çözüldü',
    createdAt: '2026-01-05',
    resolvedAt: '2026-01-07',
  },
];

/**
 * Activity item
 */
interface ActivityItem {
  id: string;
  type: 'favorite' | 'booking' | 'message' | 'review' | 'payment';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ElementType;
}

/**
 * Status badge component
 */
function StatusBadge({ status }: { status: AppointmentStatus }) {
  const config = {
    upcoming: { label: 'Gelecek', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20' },
    completed: { label: 'Tamamlandı', color: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20' },
    cancelled: { label: 'İptal', color: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20' },
    pending: { label: 'Bekliyor', color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20' },
  };

  const { label, color } = config[status];

  return (
    <Badge className={color}>
      {label}
    </Badge>
  );
}

/**
 * Customer dashboard component
 */
export default function CustomerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'favorites' | 'messages' | 'reviews' | 'reports' | 'analytics' | 'settings'>('overview');

  // Mock favorite escorts
  const favorites = useMemo(() => mockEscorts.slice(0, 6), []);
  const favoritesCount = 12;

  // Dashboard stats
  const stats = useMemo(() => ({
    favorites: favoritesCount,
    upcomingAppointments: mockAppointments.filter(a => a.status === 'upcoming').length,
    unreadMessages: mockMessages.reduce((sum, m) => sum + m.unread, 0),
    totalBookings: 24,
    totalSpent: 4500,
    thisMonthSpent: 12500,
  }), []);

  // Activity feed
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'favorite',
      title: 'Yeni favori',
      description: 'Ayşe Y. favorilerine eklendi',
      timestamp: '2 saat önce',
      icon: Heart,
    },
    {
      id: '2',
      type: 'booking',
      title: 'Randevu oluşturuldu',
      description: 'Ayşe Y. ile 25 Ocak için randevu',
      timestamp: '5 saat önce',
      icon: Calendar,
    },
    {
      id: '3',
      type: 'message',
      title: 'Yeni mesaj',
      description: 'Zeynep K.\'den mesaj',
      timestamp: '1 gün önce',
      icon: MessageCircle,
    },
    {
      id: '4',
      type: 'review',
      title: 'Değerlendirme yapıldı',
      description: 'Zeynep K. için 5 yıldız',
      timestamp: '3 gün önce',
      icon: Star,
    },
  ];

  return (
    <ProtectedRoute accessLevel="customer">
      <div className="min-h-screen bg-background">
        <SEO
          title="Müşteri Paneli | Escort Platform"
          description="Favorileriniz, randevularınız ve mesajlarınızı yönetin."
        />

        {/* Header */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 border-b border-border/50">
          <div className="container py-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    {user?.name?.charAt(0) || <User className="w-6 h-6 text-white" />}
                  </div>
                  <div>
                    <h1 className="text-3xl font-black mb-2 tracking-tighter">
                      Hoş Geldin, {user?.name || 'Müşteri'} 👋
                    </h1>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-500 text-white">
                        <User className="w-3 h-3 mr-1" />
                        Müşteri
                      </Badge>
                      {user?.membership === 'vip' && (
                        <Badge className="bg-amber-500 text-white">
                          <Crown className="w-3 h-3 mr-1" />
                          VIP
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Favorileriniz, randevularınız ve mesajlarınız burada.
                </p>
              </div>

              <div className="flex gap-2">
                <Link href="/settings">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Ayarlar
                  </Button>
                </Link>
                <Link href="/escorts">
                  <Button size="sm" className="bg-gradient-to-r from-primary to-accent">
                    <Search className="w-4 h-4 mr-2" />
                    İlan Ara
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-6 border-b border-border/50">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="glass">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-pink-500/10">
                        <Heart className="w-6 h-6 text-pink-500" />
                      </div>
                      <div>
                        <div className="text-2xl font-black">{stats.favorites}</div>
                        <div className="text-sm text-muted-foreground">Favoriler</div>
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
                <Card className="glass">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-blue-500/10">
                        <Calendar className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <div className="text-2xl font-black">{stats.upcomingAppointments}</div>
                        <div className="text-sm text-muted-foreground">Gelecek Randevu</div>
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
                <Card className="glass">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-purple-500/10">
                        <MessageCircle className="w-6 h-6 text-purple-500" />
                      </div>
                      <div>
                        <div className="text-2xl font-black">{stats.unreadMessages}</div>
                        <div className="text-sm text-muted-foreground">Okunmamış</div>
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
                <Card className="glass">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-green-500/10">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      </div>
                      <div>
                        <div className="text-2xl font-black">{stats.totalBookings}</div>
                        <div className="text-sm text-muted-foreground">Toplam Randevu</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Main Content with Tabs */}
        <div className="container py-8">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
            <TabsList className="mb-8">
              <TabsTrigger value="overview">
                <Home className="w-4 h-4 mr-2" />
                Genel Bakış
              </TabsTrigger>
              <TabsTrigger value="appointments">
                <Calendar className="w-4 h-4 mr-2" />
                Randevular
              </TabsTrigger>
              <TabsTrigger value="favorites">
                <Heart className="w-4 h-4 mr-2" />
                Favoriler
              </TabsTrigger>
              <TabsTrigger value="messages">
                <MessageCircle className="w-4 h-4 mr-2" />
                Mesajlar
              </TabsTrigger>
              <TabsTrigger value="reviews">
                <Star className="w-4 h-4 mr-2" />
                Değerlendirmelerim
              </TabsTrigger>
              <TabsTrigger value="reports">
                <Flag className="w-4 h-4 mr-2" />
                Şikayetlerim
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analitik
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="w-4 h-4 mr-2" />
                Ayarlar
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Hızlı İşlemler</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Link href="/escorts">
                        <Button variant="outline" className="w-full justify-start">
                          <Search className="w-4 h-4 mr-2" />
                          İlan Ara
                        </Button>
                      </Link>
                      <Link href="/favorites">
                        <Button variant="outline" className="w-full justify-start">
                          <Heart className="w-4 h-4 mr-2" />
                          Favorilerim
                        </Button>
                      </Link>
                      <Link href="/messages">
                        <Button variant="outline" className="w-full justify-start">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Mesajlar
                        </Button>
                      </Link>
                      <Link href="/appointments">
                        <Button variant="outline" className="w-full justify-start">
                          <Calendar className="w-4 h-4 mr-2" />
                          Randevularım
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Upcoming Appointments */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Yaklaşan Randevular</CardTitle>
                        <Link href="/appointments">
                          <Button variant="link" className="text-primary p-0">
                            Tümünü Gör <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {mockAppointments
                          .filter(a => a.status === 'upcoming')
                          .map((appointment) => (
                            <div key={appointment.id} className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg">
                              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex-shrink-0">
                                <img
                                  src={appointment.escortPhoto}
                                  alt={appointment.escortName}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h4 className="font-bold">{appointment.escortName}</h4>
                                    <p className="text-sm text-muted-foreground">{appointment.service}</p>
                                  </div>
                                  <StatusBadge status={appointment.status} />
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(appointment.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{appointment.time}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{appointment.location}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <MessageCircle className="w-4 h-4 mr-1" />
                                  Mesaj
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Phone className="w-4 h-4 mr-1" />
                                  Ara
                                </Button>
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
                        <CardTitle>Mesajlar</CardTitle>
                        <Link href="/messages">
                          <Button variant="link" className="text-primary p-0">
                            Tümünü Gör <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {mockMessages.map((message) => (
                          <Link key={message.id} href={`/messages/${message.escortId}`}>
                            <div className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                              <div className="relative">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                                  <img
                                    src={message.escortPhoto}
                                    alt={message.escortName}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                {message.unread > 0 && (
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {message.unread}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h3 className="font-semibold truncate">{message.escortName}</h3>
                                  <span className="text-xs text-muted-foreground">{message.time}</span>
                                </div>
                                <p className="text-sm text-muted-foreground truncate">{message.lastMessage}</p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Favorites Preview */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Favoriler</CardTitle>
                      <Link href="/favorites">
                        <Button variant="link" className="text-primary p-0">
                          Tümünü Gör ({stats.favorites}) <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {favorites.map((escort) => (
                        <Link key={escort.id} href={`/escort/${escort.id}`}>
                          <Card className="glass overflow-hidden group hover:border-primary/50 transition-colors cursor-pointer">
                            <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                              <img
                                src={escort.profilePhoto || 'https://via.placeholder.com/300'}
                                alt={escort.displayName}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute top-2 right-2">
                                <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                              </div>
                            </div>
                            <CardContent className="p-3">
                              <h3 className="font-semibold text-sm truncate">{escort.displayName}</h3>
                              <p className="text-xs text-muted-foreground">{escort.city}</p>
                            </CardContent>
                          </Card>
                        </Link>
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
                      <p className="text-3xl font-bold text-green-600">{stats.totalBookings - stats.upcomingAppointments}</p>
                      <p className="text-sm text-muted-foreground">Tamamlanan</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-3xl font-bold text-purple-600">₺{stats.totalSpent.toLocaleString('tr-TR')}</p>
                      <p className="text-sm text-muted-foreground">Toplam Harcama</p>
                    </CardContent>
                  </Card>
                </div>

                {/* All Appointments */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tüm Randevular</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/20 transition-colors">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex-shrink-0">
                            <img
                              src={appointment.escortPhoto}
                              alt={appointment.escortName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-bold text-lg">{appointment.escortName}</h4>
                                <p className="text-sm text-muted-foreground">{appointment.service}</p>
                              </div>
                              <StatusBadge status={appointment.status} />
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(appointment.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{appointment.time}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{appointment.location}</span>
                              </div>
                            </div>

                            {appointment.price && (
                              <div className="flex items-center gap-2 mb-3">
                                <DollarSign className="w-4 h-4 text-green-600" />
                                <span className="font-semibold">₺{appointment.price.toLocaleString('tr-TR')}</span>
                              </div>
                            )}

                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <MessageCircle className="w-4 h-4 mr-1" />
                                Mesaj
                              </Button>
                              {appointment.status === 'upcoming' && (
                                <Button size="sm" variant="outline" className="text-red-600">
                                  <XCircle className="w-4 h-4 mr-1" />
                                  İptal
                                </Button>
                              )}
                              {appointment.status === 'completed' && (
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  <Star className="w-4 h-4 mr-1" />
                                  Değerlendir
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Favorilerim</h2>
                  <p className="text-muted-foreground">Toplam {stats.favorites} favori escort</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favorites.map((escort) => (
                    <Link key={escort.id} href={`/escort/${escort.id}`}>
                      <Card className="glass overflow-hidden group hover:border-primary/50 transition-colors cursor-pointer">
                        <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                          <img
                            src={escort.profilePhoto || 'https://via.placeholder.com/300'}
                            alt={escort.displayName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute top-2 right-2">
                            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <h3 className="font-semibold text-sm truncate">{escort.displayName}</h3>
                          <p className="text-xs text-muted-foreground">{escort.city}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
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
                      {mockMessages.map((message) => (
                        <Link key={message.id} href={`/messages/${message.escortId}`}>
                          <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/20 transition-colors cursor-pointer">
                            <div className="relative">
                              <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                                <img
                                  src={message.escortPhoto}
                                  alt={message.escortName}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              {message.unread > 0 && (
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                                  {message.unread}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-semibold">{message.escortName}</h3>
                                <span className="text-xs text-muted-foreground">{message.time}</span>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{message.lastMessage}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Reviews Tab - Değerlendirmelerim */}
            <TabsContent value="reviews">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Değerlendirmelerim</h2>
                  <Badge variant="secondary">{mockReviews.length} değerlendirme</Badge>
                </div>

                {mockReviews.length > 0 ? (
                  <div className="space-y-4">
                    {mockReviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex-shrink-0">
                              <img
                                src={review.escortPhoto}
                                alt={review.escortName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-bold text-lg">{review.escortName}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    Randevu: {new Date(review.bookingDate).toLocaleDateString('tr-TR')}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-5 h-5 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-muted-foreground mb-2">{review.comment}</p>
                              <p className="text-xs text-muted-foreground">
                                Değerlendirildi: {new Date(review.date).toLocaleDateString('tr-TR')}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-bold text-lg mb-2">Henüz değerlendirme yok</h3>
                      <p className="text-muted-foreground">
                        Tamamlanan randevularınızı değerlendirerek başlayabilirsiniz.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Reports Tab - Şikayetlerim */}
            <TabsContent value="reports">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Şikayetlerim</h2>
                  <Badge variant="secondary">{mockReports.length} şikayet</Badge>
                </div>

                {mockReports.length > 0 ? (
                  <div className="space-y-4">
                    {mockReports.map((report) => (
                      <Card key={report.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-xl ${report.status === 'resolved' ? 'bg-green-500/10' :
                                report.status === 'reviewing' ? 'bg-amber-500/10' : 'bg-muted'
                              }`}>
                              <Flag className={`w-6 h-6 ${report.status === 'resolved' ? 'text-green-500' :
                                  report.status === 'reviewing' ? 'text-amber-500' : 'text-muted-foreground'
                                }`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-bold text-lg">{report.escortName}</h3>
                                  <Badge variant="outline" className="mt-1">{report.reasonLabel}</Badge>
                                </div>
                                <Badge className={`${report.status === 'resolved' ? 'bg-green-500 text-white' :
                                    report.status === 'reviewing' ? 'bg-amber-500 text-white' :
                                      'bg-muted text-muted-foreground'
                                  }`}>
                                  {report.statusLabel}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground mb-2">{report.description}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>Oluşturuldu: {new Date(report.createdAt).toLocaleDateString('tr-TR')}</span>
                                {report.resolvedAt && (
                                  <span>Çözüldü: {new Date(report.resolvedAt).toLocaleDateString('tr-TR')}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Flag className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-bold text-lg mb-2">Şikayet yok</h3>
                      <p className="text-muted-foreground">
                        Henüz herhangi bir şikayette bulunmadınız.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Info Box */}
                <Card className="bg-muted/30 border-dashed">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">
                      ⚠️ Şikayetleriniz gizli tutulur ve yöneticiler tarafından incelenir.
                      Escort profil sayfalarından "<Flag className="w-4 h-4 inline mx-1" />İhbar Et"
                      butonuyla yeni şikayet oluşturabilirsiniz.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Aktivite Özeti</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-muted/20 rounded-lg">
                        <p className="text-3xl font-bold">{stats.favorites}</p>
                        <p className="text-sm text-muted-foreground">Favori</p>
                      </div>
                      <div className="text-center p-4 bg-muted/20 rounded-lg">
                        <p className="text-3xl font-bold">{stats.totalBookings}</p>
                        <p className="text-sm text-muted-foreground">Randevu</p>
                      </div>
                      <div className="text-center p-4 bg-muted/20 rounded-lg">
                        <p className="text-3xl font-bold">{stats.unreadMessages}</p>
                        <p className="text-sm text-muted-foreground">Okunmamış</p>
                      </div>
                      <div className="text-center p-4 bg-muted/20 rounded-lg">
                        <p className="text-3xl font-bold">₺{stats.totalSpent.toLocaleString('tr-TR')}</p>
                        <p className="text-sm text-muted-foreground">Harcama</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Detaylı Analitik</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <span className="text-sm">Bu ay harcama</span>
                        <span className="font-bold">₺{stats.thisMonthSpent.toLocaleString('tr-TR')}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <span className="text-sm">Toplam randevu</span>
                        <span className="font-bold">{stats.totalBookings}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <span className="text-sm">Favori escort</span>
                        <span className="font-bold">{stats.favorites}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="max-w-3xl space-y-6">
                {/* Profil Bilgileri */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Profil Bilgileri
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-white">
                          {user?.name?.charAt(0) || 'K'}
                        </div>
                        <Button size="sm" className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{user?.name || 'Müşteri'}</h3>
                        <p className="text-muted-foreground">{user?.email}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary">{user?.membership || 'Standart'} Üye</Badge>
                          {user?.membership === 'vip' && (
                            <Badge className="bg-amber-500 text-white">
                              <Crown className="w-3 h-3 mr-1" />
                              VIP
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Form Alanları */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Ad Soyad</label>
                        <input
                          type="text"
                          defaultValue={user?.name || ''}
                          placeholder="Ad Soyad"
                          className="w-full px-4 py-3 bg-muted/30 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">E-posta</label>
                        <input
                          type="email"
                          defaultValue={user?.email || ''}
                          placeholder="E-posta"
                          className="w-full px-4 py-3 bg-muted/30 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Telefon</label>
                        <input
                          type="tel"
                          placeholder="+90 5xx xxx xx xx"
                          className="w-full px-4 py-3 bg-muted/30 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Şehir</label>
                        <select className="w-full px-4 py-3 bg-muted/30 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                          <option value="">Şehir Seçin</option>
                          <option value="istanbul">İstanbul</option>
                          <option value="ankara">Ankara</option>
                          <option value="izmir">İzmir</option>
                          <option value="bursa">Bursa</option>
                          <option value="antalya">Antalya</option>
                        </select>
                      </div>
                    </div>

                    <Button className="w-full md:w-auto">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Değişiklikleri Kaydet
                    </Button>
                  </CardContent>
                </Card>

                {/* Bildirim Ayarları */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Bildirim Tercihleri
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: 'Yeni mesaj bildirimleri', desc: 'Escort\'lardan gelen mesajları anında al', defaultChecked: true },
                      { label: 'Randevu hatırlatmaları', desc: 'Randevu saatinden 1 saat önce bildirim', defaultChecked: true },
                      { label: 'Promosyon ve fırsatlar', desc: 'VIP indirimleri ve özel fırsatlar', defaultChecked: false },
                      { label: 'Yeni escort bildirimleri', desc: 'Favori şehirlerinde yeni escort eklendiğinde', defaultChecked: false },
                      { label: 'E-posta bildirimleri', desc: 'Önemli bildirimler e-posta olarak da gönderilsin', defaultChecked: true },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked={item.defaultChecked} className="sr-only peer" />
                          <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Gizlilik ve Güvenlik */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Gizlilik ve Güvenlik
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Şifre Değiştir</p>
                        <p className="text-sm text-muted-foreground">Hesap güvenliği için şifrenizi düzenli olarak değiştirin</p>
                      </div>
                      <Button variant="outline" size="sm">Değiştir</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">İki Faktörlü Doğrulama</p>
                        <p className="text-sm text-muted-foreground">Ek güvenlik katmanı ile hesabınızı koruyun</p>
                      </div>
                      <Button variant="outline" size="sm">Etkinleştir</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Oturum Geçmişi</p>
                        <p className="text-sm text-muted-foreground">Aktif oturumlarınızı görüntüleyin ve yönetin</p>
                      </div>
                      <Button variant="outline" size="sm">Görüntüle</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-900/50 rounded-lg bg-red-50/50 dark:bg-red-900/10">
                      <div>
                        <p className="font-medium text-red-600">Hesabı Sil</p>
                        <p className="text-sm text-red-500/80">Hesabınızı ve tüm verilerinizi kalıcı olarak silin</p>
                      </div>
                      <Button variant="destructive" size="sm">Sil</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* VIP Yükseltme */}
                {user?.membership !== 'vip' && (
                  <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30">
                    <CardContent className="p-6 text-center">
                      <Crown className="w-12 h-12 mx-auto mb-4 text-amber-500" />
                      <h3 className="font-bold mb-2">VIP'e Geçin</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Sınırsız mesajlaşma, VIP escortlara erişim ve daha fazla avantaj
                      </p>
                      <Link href="/vip">
                        <Button size="sm" className="w-full bg-gradient-to-r from-amber-500 to-orange-500">
                          Hemen Yükselt
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}
