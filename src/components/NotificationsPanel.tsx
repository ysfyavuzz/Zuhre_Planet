import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bell, MessageCircle, Calendar, Star, Crown,
  Gift, Users, AlertTriangle, Info, CheckCircle2,
  X, Trash2, Settings, Mail
} from 'lucide-react';
import {
  Notification,
  NOTIFICATION_TEMPLATES,
  WARNING_LEVELS
} from '@/types/notifications';

interface NotificationsPanelProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDelete: (id: string) => void;
}

export function NotificationsPanel({
  notifications,
  unreadCount,
  onMarkRead,
  onMarkAllRead,
  onDelete
}: NotificationsPanelProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'bookings' | 'points'>('all');
  const [openSettings, setOpenSettings] = useState(false);

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notif.isRead;
    if (activeTab === 'bookings') return notif.type.startsWith('booking');
    if (activeTab === 'points') return ['points_earned', 'referral_success', 'vip_expiring'].includes(notif.type);
    return true;
  });

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'new_message':
        return { icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' };
      case 'new_booking':
      case 'booking_confirmed':
        return { icon: Calendar, color: 'text-green-500', bg: 'bg-green-500/10' };
      case 'booking_cancelled':
      case 'booking_reminder':
        return { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-500/10' };
      case 'review_received':
        return { icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
      case 'profile_approved':
        return { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-600/10' };
      case 'profile_rejected':
        return { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' };
      case 'vip_expiring':
        return { icon: Crown, color: 'text-amber-500', bg: 'bg-amber-500/10' };
      case 'points_earned':
      case 'referral_success':
        return { icon: Gift, color: 'text-purple-500', bg: 'bg-purple-500/10' };
      case 'warning':
        return { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-600/10' };
      default:
        return { icon: Info, color: 'text-gray-500', bg: 'bg-gray-500/10' };
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setOpenSettings(!openSettings)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {openSettings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 top-12 w-96 max-h-[80vh] bg-background border rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-4 border-b bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <h3 className="font-bold">Bildirimler</h3>
                  {unreadCount > 0 && (
                    <Badge variant="secondary">{unreadCount} yeni</Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={onMarkAllRead}
                    title="Tümünü okundu işaretle"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setOpenSettings(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="all" className="text-xs">Tümü</TabsTrigger>
                  <TabsTrigger value="unread" className="text-xs">Okunmamış</TabsTrigger>
                  <TabsTrigger value="bookings" className="text-xs">Randevu</TabsTrigger>
                  <TabsTrigger value="points" className="text-xs">Puan</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-[60vh]">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Bildirim bulunmuyor</p>
                </div>
              ) : (
                filteredNotifications.map((notif) => {
                  const { icon: Icon, color, bg } = getNotificationIcon(notif.type);
                  return (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 border-b hover:bg-muted/30 transition-colors cursor-pointer ${
                        !notif.isRead ? 'bg-primary/5' : ''
                      }`}
                      onClick={() => onMarkRead(notif.id)}
                    >
                      <div className="flex gap-3">
                        <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center shrink-0`}>
                          <Icon className={`w-5 h-5 ${color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-sm">{notif.title}</p>
                            {!notif.isRead && (
                              <span className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {notif.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notif.createdAt).toLocaleDateString('tr-TR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(notif.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer - Email Settings */}
            <div className="p-3 border-t bg-muted/20">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  // Open email settings modal
                  alert('E-posta bildirim ayarları açılacak...');
                }}
              >
                <Mail className="w-4 h-4 mr-2" />
                E-posta Bildirim Ayarları
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// User Warnings Display Component
export function UserWarningsPanel({ warnings }: { warnings: Array<any> }) {
  if (warnings.length === 0) return null;

  return (
    <Card className="border-orange-500/30 bg-orange-500/5">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-orange-700 dark:text-orange-400 mb-2">
              Dikkat: {warnings.length} Uyarınız Bulunuyor
            </h4>
            <div className="space-y-2">
              {warnings.map((warning) => {
                const level = WARNING_LEVELS[warning.type];
                return (
                  <div
                    key={warning.id}
                    className={`p-3 rounded-lg ${level.bgColor} ${level.color} text-sm`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span>{level.icon}</span>
                      <span className="font-semibold">{level.label}</span>
                    </div>
                    <p className="text-xs opacity-90">{warning.description}</p>
                    <p className="text-xs mt-1 opacity-75">
                      {new Date(warning.issuedAt).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              ⚠️ Uyarılar, hesap durumunuzu etkileyebilir. Lütfen platform kurallarına uyunuz.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
