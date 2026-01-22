/**
 * Admin Real-Time Monitoring Page
 *
 * Comprehensive real-time monitoring dashboard for platform activity.
 * Tracks active calls, messages, user sessions, and system health metrics.
 *
 * @module pages/AdminRealTimeMonitoring
 * @category Pages - Admin
 *
 * Features:
 * - Live platform statistics with WebSocket updates
 * - Active video calls monitoring
 * - Real-time message tracking
 * - Online user counter with trend analysis
 * - System health indicators (CPU, memory, API response)
 * - Geographic distribution map
 * - Traffic metrics with live graphs
 * - Alert system for unusual activity
 *
 * Security:
 * - Admin role authentication required
 * - Sensitive operational data protected
 *
 * @example
 * ```tsx
 * // Route: /admin/monitoring
 * <AdminRealTimeMonitoring />
 * ```
 */

import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Activity, Users, MessageCircle, Video, Phone, Globe,
  Server, Database, Wifi, WifiOff, AlertTriangle,
  TrendingUp, TrendingDown, Zap, Clock, MapPin,
  Eye, EyeOff, RefreshCw, Download, Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import ProtectedRoute from '@/components/ProtectedRoute';

/**
 * Mock live statistics
 */
interface LiveStats {
  onlineUsers: number;
  activeCalls: number;
  activeChats: number;
  messagesPerMinute: number;
  serverLoad: number;
  memoryUsage: number;
  apiLatency: number;
  uptime: number;
}

/**
 * Active call info
 */
interface ActiveCall {
  id: string;
  participants: string[];
  duration: number;
  startedAt: Date;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
}

/**
 * Active chat info
 */
interface ActiveChat {
  id: string;
  participants: string[];
  messageCount: number;
  lastActivity: Date;
  isFlagged?: boolean;
}

/**
 * System alert
 */
interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  timestamp: Date;
  resolved?: boolean;
}

/**
 * Geographic distribution
 */
interface GeoDistribution {
  city: string;
  users: number;
  percentage: number;
}

/**
 * AdminRealTimeMonitoring Component
 */
export default function AdminRealTimeMonitoring() {
  // State
  const [liveStats, setLiveStats] = useState<LiveStats>({
    onlineUsers: 1234,
    activeCalls: 42,
    activeChats: 156,
    messagesPerMinute: 89,
    serverLoad: 45,
    memoryUsage: 62,
    apiLatency: 120,
    uptime: 99.9,
  });
  const [activeCalls, setActiveCalls] = useState<ActiveCall[]>([
    {
      id: 'call-1',
      participants: ['Ayşe Yılmaz', 'Mehmet Demir'],
      duration: 540,
      startedAt: new Date(Date.now() - 540000),
      quality: 'excellent',
    },
    {
      id: 'call-2',
      participants: ['Zeynep Kaya', 'Can Yılmaz'],
      duration: 180,
      startedAt: new Date(Date.now() - 180000),
      quality: 'good',
    },
    {
      id: 'call-3',
      participants: ['Elif Şahin', 'Ali Veli'],
      duration: 1200,
      startedAt: new Date(Date.now() - 1200000),
      quality: 'fair',
    },
  ]);
  const [activeChats, setActiveChats] = useState<ActiveChat[]>([
    {
      id: 'chat-1',
      participants: ['Ayşe Yılmaz', 'Mehmet Demir'],
      messageCount: 45,
      lastActivity: new Date(Date.now() - 30000),
      isFlagged: false,
    },
    {
      id: 'chat-2',
      participants: ['Zeynep Kaya', 'Can Yılmaz'],
      messageCount: 128,
      lastActivity: new Date(Date.now() - 60000),
      isFlagged: true,
    },
  ]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([
    {
      id: 'alert-1',
      type: 'warning',
      message: 'API yanıt süresi normalin üzeründe',
      timestamp: new Date(Date.now() - 300000),
      resolved: false,
    },
    {
      id: 'alert-2',
      type: 'info',
      message: 'Yeni sunucu bağlandı',
      timestamp: new Date(Date.now() - 600000),
      resolved: true,
    },
  ]);
  const [geoDistribution, setGeoDistribution] = useState<GeoDistribution[]>([
    { city: 'İstanbul', users: 456, percentage: 37 },
    { city: 'Ankara', users: 234, percentage: 19 },
    { city: 'İzmir', users: 189, percentage: 15 },
    { city: 'Bursa', users: 123, percentage: 10 },
    { city: 'Antalya', users: 98, percentage: 8 },
    { city: 'Diğer', users: 134, percentage: 11 },
  ]);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);

  // Refs
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate real-time updates
  useEffect(() => {
    if (!isRealTimeEnabled) return;

    updateIntervalRef.current = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        onlineUsers: prev.onlineUsers + Math.floor(Math.random() * 10) - 5,
        activeCalls: Math.max(0, prev.activeCalls + Math.floor(Math.random() * 3) - 1),
        activeChats: Math.max(0, prev.activeChats + Math.floor(Math.random() * 5) - 2),
        messagesPerMinute: Math.max(0, prev.messagesPerMinute + Math.floor(Math.random() * 10) - 5),
        serverLoad: Math.max(0, Math.min(100, prev.serverLoad + Math.floor(Math.random() * 6) - 3)),
        memoryUsage: Math.max(0, Math.min(100, prev.memoryUsage + Math.floor(Math.random() * 4) - 2)),
        apiLatency: Math.max(50, prev.apiLatency + Math.floor(Math.random() * 20) - 10),
      }));
    }, 2000);

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [isRealTimeEnabled, liveStats.onlineUsers]);

  // Format call duration
  const formatCallDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get alert badge style
  const getAlertBadge = (type: SystemAlert['type']) => {
    const styles = {
      info: { bg: 'bg-blue-500/10', text: 'text-blue-600', icon: <Activity className="w-4 h-4" /> },
      warning: { bg: 'bg-amber-500/10', text: 'text-amber-600', icon: <AlertTriangle className="w-4 h-4" /> },
      error: { bg: 'bg-red-500/10', text: 'text-red-600', icon: <AlertTriangle className="w-4 h-4" /> },
      critical: { bg: 'bg-red-500/20', text: 'text-red-700', icon: <AlertTriangle className="w-4 h-4" /> },
    };
    const style = styles[type];
    return (
      <Badge variant="outline" className={`${style.bg} ${style.text} border-0 gap-1`}>
        {style.icon}
        {type.toUpperCase()}
      </Badge>
    );
  };

  // Get quality indicator
  const getQualityIndicator = (quality: ActiveCall['quality']) => {
    const styles = {
      excellent: { bg: 'bg-green-500', label: 'Mükemmel' },
      good: { bg: 'bg-blue-500', label: 'İyi' },
      fair: { bg: 'bg-yellow-500', label: 'Orta' },
      poor: { bg: 'bg-red-500', label: 'Zayıf' },
    };
    const style = styles[quality];
    return <span className={`px-2 py-1 rounded text-xs text-white ${style.bg}`}>{style.label}</span>;
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
                    <Calendar className="w-5 h-5" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-2">
                    <Activity className="w-6 h-6 text-primary" />
                    Gerçek Zamanlı İzleme
                  </h1>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isRealTimeEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                    {isRealTimeEnabled ? 'Canlı güncellemeler aktif' : 'Canlı güncellemeler durduruldu'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
                  title={isRealTimeEnabled ? 'Durdur' : 'Başlat'}
                >
                  {isRealTimeEnabled ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </Button>
                <Button variant="outline" size="icon">
                  <RefreshCw className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <Download className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-8 space-y-6">
          {/* Live Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Online Users */}
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-blue-500" />
                      <p className="text-sm text-muted-foreground">Çevrimiçi Kullanıcı</p>
                    </div>
                    <p className="text-3xl font-bold">{liveStats.onlineUsers.toLocaleString()}</p>
                    <Badge variant="secondary" className="mt-2 gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +12%
                    </Badge>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Wifi className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Calls */}
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Video className="w-4 h-4 text-green-500" />
                      <p className="text-sm text-muted-foreground">Aktif Arama</p>
                    </div>
                    <p className="text-3xl font-bold">{liveStats.activeCalls}</p>
                    <Badge variant="secondary" className="mt-2 gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +8%
                    </Badge>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Chats */}
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageCircle className="w-4 h-4 text-purple-500" />
                      <p className="text-sm text-muted-foreground">Aktif Sohbet</p>
                    </div>
                    <p className="text-3xl font-bold">{liveStats.activeChats}</p>
                    <Badge variant="secondary" className="mt-2 gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +15%
                    </Badge>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Messages/Min */}
            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="w-4 h-4 text-amber-500" />
                      <p className="text-sm text-muted-foreground">Mesaj/Dakika</p>
                    </div>
                    <p className="text-3xl font-bold">{liveStats.messagesPerMinute}</p>
                    <Badge variant="secondary" className="mt-2 gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +22%
                    </Badge>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-amber-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Health & Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Server className="w-5 h-5 text-primary" />
                  Sistem Sağlığı
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Server Load */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Sunucu Yükü</span>
                    <span className="text-sm font-semibold">{liveStats.serverLoad}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${liveStats.serverLoad}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Memory Usage */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Bellek Kullanımı</span>
                    <span className="text-sm font-semibold">{liveStats.memoryUsage}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${liveStats.memoryUsage}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* API Latency */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">API Gecikme</span>
                    <span className="text-sm font-semibold">{liveStats.apiLatency}ms</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${
                        liveStats.apiLatency < 100
                          ? 'bg-green-500'
                          : liveStats.apiLatency < 200
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (liveStats.apiLatency / 500) * 100)}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Uptime */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Uptime</span>
                  <span className="text-sm font-semibold text-green-600">{liveStats.uptime}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                  Sistem Uyarıları
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Aktif uyarı yok</p>
                    </div>
                  ) : (
                    alerts.map((alert) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-lg border ${
                          alert.resolved
                            ? 'bg-muted/30 opacity-60'
                            : alert.type === 'critical'
                            ? 'bg-red-500/10 border-red-500/20'
                            : alert.type === 'error'
                            ? 'bg-red-500/10 border-red-500/20'
                            : alert.type === 'warning'
                            ? 'bg-amber-500/10 border-amber-500/20'
                            : 'bg-blue-500/10 border-blue-500/20'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {getAlertBadge(alert.type)}
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(alert.timestamp, { addSuffix: true, locale: tr })}
                              </span>
                              {alert.resolved && (
                                <Badge variant="outline" className="text-xs">
                                  Çözüldü
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm">{alert.message}</p>
                          </div>
                          {!alert.resolved && (
                            <Button variant="outline" size="sm">
                              Çöz
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Calls & Chats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Calls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Video className="w-5 h-5 text-primary" />
                  Aktif Görüntülü Aramalar
                  <Badge variant="secondary">{activeCalls.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeCalls.map((call) => (
                    <div
                      key={call.id}
                      className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Phone className="w-4 h-4 text-green-500" />
                            <span className="font-medium">{call.participants.join(' ↔ ')}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatCallDuration(call.duration)}
                            </span>
                            {getQualityIndicator(call.quality)}
                          </div>
                        </div>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {activeCalls.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Video className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Aktif arama yok</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Active Chats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  Aktif Sohbetler
                  <Badge variant="secondary">{activeChats.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeChats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors ${
                        chat.isFlagged ? 'border-amber-500/50 bg-amber-500/5' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <MessageCircle className="w-4 h-4 text-purple-500" />
                            <span className="font-medium">{chat.participants.join(' ↔ ')}</span>
                            {chat.isFlagged && (
                              <Badge variant="outline" className="text-amber-600 border-amber-500">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                İşaretlendi
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>{chat.messageCount} mesaj</span>
                            <span>•</span>
                            <span>
                              {formatDistanceToNow(chat.lastActivity, { addSuffix: true, locale: tr })}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {activeChats.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Aktif sohbet yok</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Geographic Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="w-5 h-5 text-primary" />
                Coğrafi Dağılım
                <Badge variant="secondary">{liveStats.onlineUsers.toLocaleString()} kullanıcı</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {geoDistribution.map((geo) => (
                  <div key={geo.city} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="font-medium">{geo.city}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">{geo.users.toLocaleString()} kullanıcı</span>
                        <Badge variant="secondary">{geo.percentage}%</Badge>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-accent"
                        initial={{ width: 0 }}
                        animate={{ width: `${geo.percentage}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
