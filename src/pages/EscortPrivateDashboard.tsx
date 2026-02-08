/**
 * EscortPrivateDashboard Page
 *
 * Private dashboard for escort users to manage their profile, bookings, and analytics.
 * Shows profile overview, upcoming bookings, messages, earnings, and quick actions.
 *
 * @module pages/EscortPrivateDashboard
 * @category Pages - Dashboard
 *
 * Features:
 * - Profile overview card with stats
 * - Profile completion percentage
 * - Quick actions (edit profile, add photos, manage services)
 * - Upcoming bookings with status tracking
 * - Unread messages
 * - Earnings overview (views, favorites, response rate)
 * - Revenue/earnings display
 * - VIP status and upgrade prompts
 * - Analytics preview
 * - Profile visibility management
 *
 * @example
 * ```tsx
 * // Route: /escort/dashboard/private
 * // Escort's private dashboard
 * <EscortPrivateDashboard />
 * ```
 */

import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ProtectedRoute from '@/components/ProtectedRoute';
import EscUserProfileCard, { EscUserProfileCardCompact } from '@/components/EscUserProfileCard';
import VideoUpload, { Video } from '@/components/VideoUpload';
import { mockEscorts } from '@/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { getStoredRole } from '@/components/RoleSelector';
import {
  Eye, EyeOff, Heart, Calendar, MessageCircle, Edit, Settings,
  Star, TrendingUp, Crown, Shield, CheckCircle2, Clock,
  AlertCircle, Plus, Upload, Image as ImageIcon, Video as VideoIcon,
  Phone, Mail, DollarSign, Users, BarChart3, Bell,
  ChevronRight, LogOut, Home, ExternalLink, Zap, Target, MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SEO } from '@/pages/SEO';

/**
 * Mock booking data for escorts
 */
const mockEscortBookings = [
  {
    id: '1',
    customerName: 'Ahmet Y.',
    date: '2026-01-25',
    time: '19:00',
    duration: '2 saat',
    service: 'Akşam Yemeği',
    location: 'İstanbul, Beşiktaş',
    status: 'confirmed', // 'confirmed' | 'pending' | 'cancelled' | 'completed'
    amount: 1500,
  },
  {
    id: '2',
    customerName: 'Mehmet K.',
    date: '2026-01-26',
    time: '20:00',
    duration: '3 saat',
    service: 'Etkinlik Eşliği',
    location: 'İstanbul, Kadıköy',
    status: 'pending',
    amount: 2000,
  },
];

/**
 * Mock message data for escorts
 */
const mockEscortMessages = [
  {
    id: '1',
    customerName: 'Ahmet Y.',
    lastMessage: 'Randevuyu onaylıyorum, görüşmek istiyorum.',
    time: '14:30',
    unread: 1,
  },
];

/**
 * Mock earnings data
 */
const mockEarnings = {
  todayViews: 45,
  weekViews: 320,
  totalFavorites: 28,
  responseRate: 85,
  averageRating: 4.8,
};

/**
 * Status badge component for bookings
 */
function BookingStatusBadge({ status }: { status: string }) {
  const configs = {
    confirmed: { label: 'Onaylandı', color: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20' },
    pending: { label: 'Beklemede', color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20' },
    cancelled: { label: 'İptal', color: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20' },
    completed: { label: 'Tamamlandı', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20' },
  };

  const config = configs[status as keyof typeof configs] || configs.pending;

  return <Badge className={config.color}>{config.label}</Badge>;
}

/**
 * Escort private dashboard component
 */
export default function EscortPrivateDashboard() {
  const { user } = useAuth();
  const userRole = getStoredRole();

  // Video state
  const [videos, setVideos] = useState<Video[]>([
    {
      id: 'video-1',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: '',
      title: 'Tanıtım Videosu',
      duration: 120,
      size: 15 * 1024 * 1024,
      uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      isPrimary: true,
      status: 'completed',
    },
  ]);

  // Mock profile data (in real app, fetch from API)
  const profile = useMemo(() => {
    return {
      ...mockEscorts[0],
      membership: user?.membership || 'standard',
      visibility: 'public' as const,
      completionPercentage: 75,
      lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      createdAt: typeof mockEscorts[0]?.createdAt === 'string' ? mockEscorts[0].createdAt : new Date(mockEscorts[0]?.createdAt || Date.now()).toISOString(),
    };
  }, [user]);

  const stats = useMemo(() => ({
    views: 1245,
    favorites: mockEarnings.totalFavorites,
    bookings: mockEscortBookings.length,
    reviews: 18,
    averageRating: mockEarnings.averageRating,
    responseRate: mockEarnings.responseRate,
  }), []);

  // Calculate earnings (mock)
  const earnings = useMemo(() => {
    const completedBookings = mockEscortBookings.filter(b => b.status === 'completed');
    return {
      thisMonth: completedBookings.reduce((sum, b) => sum + (b.amount || 0), 0),
      thisMonthCount: completedBookings.length,
      total: 45000,
    };
  }, []);

  // Video handlers
  const handleVideoUpload = async (files: File[]) => {
    // Simulate upload - in real app, upload to server
    const newVideos = files.map((file, index) => ({
      id: `video-${Date.now()}-${index}`,
      url: URL.createObjectURL(file),
      thumbnail: '',
      title: file.name,
      duration: Math.floor(Math.random() * 180) + 60, // Mock duration
      size: file.size,
      uploadedAt: new Date(),
      isPrimary: videos.length === 0 && index === 0,
      status: 'completed' as const,
    }));

    setVideos(prev => [...prev, ...newVideos]);
    return newVideos;
  };

  const handleVideoDelete = (videoId: string) => {
    setVideos(prev => prev.filter(v => v.id !== videoId));
  };

  const handleVideoSetPrimary = (videoId: string) => {
    setVideos(prev => prev.map(v => ({ ...v, isPrimary: v.id === videoId })));
  };

  const handleVideoReorder = (fromIndex: number, toIndex: number) => {
    setVideos(prev => {
      const newVideos = [...prev];
      const [removed] = newVideos.splice(fromIndex, 1);
      newVideos.splice(toIndex, 0, removed);
      return newVideos;
    });
  };

  return (
    <ProtectedRoute accessLevel="escort">
      <div className="min-h-screen bg-background">
        <SEO
          title="Escort Paneli | Escort Platform"
          description="Profilinizi yönetin, randevuları takip edin ve istatistikleri görün."
        />

        {/* Header */}
        <section className="bg-gradient-to-br from-blue-500/10 via-background to-cyan-500/10 border-b border-border/50">
          <div className="container py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black mb-2 tracking-tighter">
                  Hoş Geldin, {profile.displayName} 💎
                </h1>
                <p className="text-muted-foreground">
                  Profilinizi yönetin, randevuları takip edin ve istatistiklerinizi görün.
                </p>
              </div>

              <div className="flex gap-2">
                <Link href={`/escort/${profile.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Profil Görüntüle
                  </Button>
                </Link>
                <Link href="/escort/dashboard/settings">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Ayarlar
                  </Button>
                </Link>
                <Link href="/">
                  <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-500">
                    <Home className="w-4 h-4 mr-2" />
                    Ana Sayfa
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-8 border-b border-border/50">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="glass">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-blue-500/10">
                        <Eye className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <div className="text-2xl font-black">{stats.views}</div>
                        <div className="text-sm text-muted-foreground">Görüntülenme</div>
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
                      <div className="p-3 rounded-xl bg-cyan-500/10">
                        <Heart className="w-6 h-6 text-cyan-500" />
                      </div>
                      <div>
                        <div className="text-2xl font-black">{stats.favorites}</div>
                        <div className="text-sm text-muted-foreground">Favori</div>
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
                      <div className="p-3 rounded-xl bg-blue-500/10">
                        <Calendar className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <div className="text-2xl font-black">{mockEscortBookings.length}</div>
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
                <Card className="glass">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-green-500/10">
                        <DollarSign className="w-6 h-6 text-green-500" />
                      </div>
                      <div>
                        <div className="text-2xl font-black">₺{earnings.thisMonth.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Bu Ay</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="glass">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-amber-500/10">
                        <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                      </div>
                      <div>
                        <div className="text-2xl font-black">{stats.averageRating}</div>
                        <div className="text-sm text-muted-foreground">Puan</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Overview */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black tracking-tighter">Profilim</h2>
                  <Link href={`/escort/${profile.id}/edit`}>
                    <Button size="sm" className="gap-2">
                      <Edit className="w-4 h-4" />
                      Profili Düzenle
                    </Button>
                  </Link>
                </div>

                <EscUserProfileCard
                  profile={profile}
                  stats={stats}
                  showExtendedStats={true}
                  onEdit={() => {/* Navigate to edit */}}
                />
              </div>

              {/* Upcoming Bookings */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black tracking-tighter">Randevular</h2>
                  <Link href="/escort/dashboard/bookings">
                    <Button variant="link" className="text-blue-500 dark:text-blue-400 font-bold p-0">
                      Tümünü Gör <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>

                <div className="space-y-3">
                  {mockEscortBookings.map((booking) => (
                    <Card key={booking.id} className="glass">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-lg">{booking.customerName}</h3>
                              <BookingStatusBadge status={booking.status} />
                            </div>

                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-4 text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{new Date(booking.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{booking.time}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Target className="w-4 h-4" />
                                  <span>{booking.duration}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>{booking.service}</span>
                                <span>•</span>
                                <span>{booking.location}</span>
                              </div>

                              <div className="flex items-center gap-2 font-semibold text-green-600 dark:text-green-400">
                                <DollarSign className="w-4 h-4" />
                                ₺{booking.amount?.toLocaleString()}
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
                      </CardContent>
                    </Card>
                  ))}

                  {mockEscortBookings.length === 0 && (
                    <Card className="glass">
                      <CardContent className="p-12 text-center">
                        <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                        <h3 className="text-lg font-bold mb-2">Randevu Bulunmuyor</h3>
                        <p className="text-muted-foreground mb-6">
                          Henüz yaklaşan randevunuz yok.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* Messages Preview */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black tracking-tighter">Mesajlar</h2>
                  <Link href="/messages">
                    <Button variant="link" className="text-blue-500 dark:text-blue-400 font-bold p-0">
                      Tümünü Gör <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>

                <div className="space-y-3">
                  {mockEscortMessages.map((message) => (
                    <Link key={message.id} href={`/messages/${message.id}`}>
                      <Card className="glass hover:border-purple-500/50 transition-colors cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
                                <Users className="w-6 h-6 text-purple-500" />
                              </div>
                              {message.unread > 0 && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                                  {message.unread}
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-semibold truncate">{message.customerName}</h3>
                                <span className="text-xs text-muted-foreground">{message.time}</span>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{message.lastMessage}</p>
                            </div>

                            <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Video Management */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black tracking-tighter flex items-center gap-2">
                    <VideoIcon className="w-6 h-6 text-purple-500" />
                    Videolarım
                  </h2>
                  <Badge variant="outline" className="text-purple-600 dark:text-purple-400 border-purple-500/30">
                    {videos.length} / {profile.membership === 'vip' ? '∞' : profile.membership === 'premium' ? '20' : '10'}
                  </Badge>
                </div>

                <VideoUpload
                  videos={videos}
                  onUpload={handleVideoUpload}
                  onDelete={handleVideoDelete}
                  onSetPrimary={handleVideoSetPrimary}
                  onReorder={handleVideoReorder}
                  maxVideos={profile.membership === 'vip' ? 999 : profile.membership === 'premium' ? 20 : 10}
                  maxSize={50 * 1024 * 1024}
                  isVip={profile.membership === 'vip'}
                />
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-lg">Hızlı İşlemler</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href={`/escort/${profile.id}/edit`}>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Profili Düzenle
                    </Button>
                  </Link>
                  <Link href={`/escort/${profile.id}/photos`}>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Fotoğraf Ekle
                    </Button>
                  </Link>
                  <button
                    onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
                    className="w-full"
                  >
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <VideoIcon className="w-4 h-4 mr-2" />
                      Video Ekle
                    </Button>
                  </button>
                  <Link href={`/escort/${profile.id}/services`}>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Star className="w-4 h-4 mr-2" />
                      Hizmetleri Yönet
                    </Button>
                  </Link>
                  <Link href={`/escort/${profile.id}/availability`}>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Clock className="w-4 h-4 mr-2" />
                              Müsaitlik
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Earnings Overview */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    İstatistikler
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Bugün</span>
                      <span className="font-semibold">{mockEarnings.todayViews} görüntülenme</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: '70%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Bu Hafta</span>
                      <span className="font-semibold">{mockEarnings.weekViews} görüntülenme</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: '85%' }} />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground mb-1">Favoriler</div>
                      <div className="text-lg font-black">{mockEarnings.totalFavorites}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Yanıt Oranı</div>
                      <div className="text-lg font-black">%{mockEarnings.responseRate}</div>
                    </div>
                  </div>

                  <Separator />

                  <Link href="/escort/dashboard/analytics">
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Detaylı Analitik
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Earnings CTA - Upgrade to VIP */}
              {profile.membership !== 'vip' && (
                <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30">
                  <CardContent className="p-6 text-center">
                    <Crown className="w-12 h-12 mx-auto mb-4 text-amber-500" />
                    <h3 className="font-bold mb-2">VIP'e Geçin</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Profilinizi öne çıkarın, daha fazla randevu alın.
                    </p>
                    <Link href="/vip">
                      <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500">
                        VIP'e Geç
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* Profile Visibility */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Profil Görünürlülüğü
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium">Profil Aktif</span>
                    </div>
                    <Badge variant="outline" className="text-green-600 dark:text-green-400 border-green-500/30">
                      Herkes görebilir
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Profiliniz şu anda herkese açık olarak görüntülenmektedir.
                  </p>

                  <Separator />

                  <Button variant="outline" className="w-full justify-start text-sm" size="sm">
                    <EyeOff className="w-4 h-4 mr-2" />
                    Profili Gizle
                  </Button>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Bildirimler
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-500/30" />
                    <p className="text-sm text-muted-foreground mb-1">Yeni bildirim yok</p>
                    <p className="text-xs text-muted-foreground">
                      Tüm bildirimler burada görünecektir.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Logout Section */}
        <section className="py-8 border-t border-border/50">
          <div className="container">
            <Card className="bg-red-500/5 border-red-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-red-700 dark:text-red-400 mb-1">Çıkış Yap</h3>
                    <p className="text-sm text-red-600 dark:text-red-300">
                      Oturumu kapatmak ve çıkış yapmak istediğinizden emin misiniz?
                    </p>
                  </div>
                  <Button variant="outline" className="border-red-500/30 hover:bg-red-500 hover:text-white">
                    <LogOut className="w-4 h-4 mr-2" />
                    Çıkış Yap
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}
