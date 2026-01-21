/**
 * Notification UI Components
 *
 * Toast notifications and notification center display components.
 * Provides real-time notification display with animations and interactions.
 *
 * @module components/Notifications
 * @category Components - UI
 *
 * Components:
 * - NotificationToast: Auto-dismissing toast notifications
 * - NotificationCenter: Persistent notification history panel
 * - NotificationBell: Bell icon with unread counter
 *
 * @example
 * ```tsx
 * // Toast notifications
 * <NotificationToast />
 *
 * // Notification center (in header/sidebar)
 * <NotificationCenter />
 *
 * // Bell icon (in header)
 * <NotificationBell />
 * ```
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Bell, X, Check, MessageCircle, Calendar, Settings, Trash2,
  CheckCircle2, AlertCircle, Info, Star, User, Clock,
  Gift, ChevronRight, ExternalLink, Volume2, VolumeX
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useNotifications, Notification } from '@/contexts/NotificationContext';

/**
 * Get notification icon component by type
 */
function getNotificationIcon(notification: Notification) {
  if (notification.icon) {
    return <span className="text-xl">{notification.icon}</span>;
  }

  const icons = {
    message: MessageCircle,
    booking: Calendar,
    system: Settings,
    promo: Gift,
    review: Star,
    profile: User,
  };

  const Icon = icons[notification.type] || Bell;

  const colorClasses = {
    message: 'text-blue-500 bg-blue-500/20',
    booking: 'text-green-500 bg-green-500/20',
    system: 'text-gray-500 bg-gray-500/20',
    promo: 'text-purple-500 bg-purple-500/20',
    review: 'text-amber-500 bg-amber-500/20',
    profile: 'text-cyan-500 bg-cyan-500/20',
  };

  return (
    <div className={`p-2 rounded-lg ${colorClasses[notification.type]}`}>
      <Icon className="w-5 h-5" />
    </div>
  );
}

/**
 * Get priority badge color
 */
function getPriorityBadge(priority: string) {
  const configs = {
    low: { label: 'Düşük', color: 'bg-gray-500/10 text-gray-700 border-gray-500/30' },
    normal: { label: 'Normal', color: 'bg-blue-500/10 text-blue-700 border-blue-500/30' },
    high: { label: 'Yüksek', color: 'bg-orange-500/10 text-orange-700 border-orange-500/30' },
    urgent: { label: 'Acil', color: 'bg-red-500/10 text-red-700 border-red-500/30' },
  };

  return configs[priority as keyof typeof configs] || configs.normal;
}

/**
 * NotificationToast Component
 *
 * Displays auto-dismissing toast notifications at the bottom right of screen.
 */
export function NotificationToast() {
  const { toasts, removeToast, markAsRead } = useNotifications();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-auto"
          >
            <Card
              className="w-80 shadow-lg border-l-4 cursor-pointer hover:shadow-xl transition-shadow"
              style={{
                borderLeftColor: toast.priority === 'urgent' ? '#ef4444' :
                                 toast.priority === 'high' ? '#f97316' :
                                 toast.priority === 'low' ? '#6b7280' : '#3b82f6',
              }}
              onClick={() => {
                if (toast.onClick) {
                  toast.onClick();
                }
                markAsRead(toast.id);
                removeToast(toast.id);
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(toast)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm truncate">{toast.title}</h4>
                      <Badge variant="outline" className={getPriorityBadge(toast.priority).color + ' text-xs py-0 px-1.5'}>
                        {getPriorityBadge(toast.priority).label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {toast.message}
                    </p>

                    {/* Action Button */}
                    {toast.action && toast.actionLabel && (
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 h-auto text-xs mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.action!();
                          markAsRead(toast.id);
                          removeToast(toast.id);
                        }}
                      >
                        {toast.actionLabel}
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    )}
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeToast(toast.id);
                    }}
                    className="flex-shrink-0 p-1 rounded hover:bg-muted transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * NotificationBell Component
 *
 * Bell icon with unread counter for header.
 */
export function NotificationBell() {
  const { unreadCount, toggleNotificationCenter, showNotificationCenter } = useNotifications();

  return (
    <button
      onClick={toggleNotificationCenter}
      className="relative p-2 rounded-lg hover:bg-muted transition-colors"
      aria-label="Bildirimler"
    >
      <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'text-primary' : 'text-muted-foreground'}`} />

      {/* Unread Badge */}
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}

      {/* Active indicator when notification center is open */}
      {showNotificationCenter && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
      )}
    </button>
  );
}

/**
 * NotificationCenter Component
 *
 * Persistent notification history panel with mark as read and delete actions.
 */
export function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    showNotificationCenter,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotifications();

  if (!showNotificationCenter) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={() => {}}
      />

      {/* Notification Panel */}
      <div className="fixed top-16 right-4 bottom-4 w-full max-w-md z-50 flex flex-col">
        <Card className="card-premium flex-1 flex flex-col shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b bg-muted/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                <h3 className="font-bold">Bildirimler</h3>
                {unreadCount > 0 && (
                  <Badge variant="default">{unreadCount} yeni</Badge>
                )}
              </div>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Tümünü Okundu Say
                  </Button>
                )}
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearAll}
                    className="text-muted-foreground hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {}}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
              >
                Tümü ({notifications.length})
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
              >
                Okunmamış ({notifications.length - unreadCount})
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <Bell className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h4 className="font-semibold text-muted-foreground mb-2">Bildirim Yok</h4>
                <p className="text-sm text-muted-foreground">
                  Yeni bildirimleriniz burada görüntülenecek
                </p>
              </div>
            ) : (
              <div className="divide-y">
                <AnimatePresence initial={false}>
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                        !notification.read ? 'bg-primary/5' : ''
                      }`}
                      onClick={() => {
                        if (notification.onClick) {
                          notification.onClick();
                        }
                        markAsRead(notification.id);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-semibold text-sm ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {notification.title}
                            </h4>
                            <Badge variant="outline" className={getPriorityBadge(notification.priority).color + ' text-xs py-0 px-1.5'}>
                              {getPriorityBadge(notification.priority).label}
                            </Badge>
                            {!notification.read && (
                              <span className="w-2 h-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {notification.message}
                          </p>

                          {/* Footer */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>
                                {formatDistanceToNow(notification.timestamp, {
                                  addSuffix: true,
                                  locale: tr,
                                })}
                              </span>
                            </div>

                            {/* Action Button */}
                            {notification.action && notification.actionLabel && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  notification.action!();
                                  markAsRead(notification.id);
                                }}
                              >
                                {notification.actionLabel}
                                <ChevronRight className="w-3 h-3 ml-1" />
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="flex-shrink-0 p-1 rounded hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-4 border-t bg-muted/30">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{notifications.length} bildirim</span>
                <span>{unreadCount} okunmamış</span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

/**
 * Notification Preferences Component
 *
 * Settings for notification preferences.
 */
export function NotificationPreferences() {
  const { preferences, updatePreferences } = useNotifications();

  return (
    <Card className="card-premium">
      <CardContent className="p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Bildirim Ayarları
        </h3>

        <div className="space-y-4">
          {/* Enable Sound */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Sesli Bildirimler</p>
              <p className="text-sm text-muted-foreground">Bildirim geldiğinde ses çal</p>
            </div>
            <button
              onClick={() => updatePreferences({ enableSound: !preferences.enableSound })}
              className={`w-12 h-6 rounded-full transition-colors ${
                preferences.enableSound ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  preferences.enableSound ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Enable Browser Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Tarayıcı Bildirimleri</p>
              <p className="text-sm text-muted-foreground">Tarayıcı bildirimlerini göster</p>
            </div>
            <button
              onClick={() => updatePreferences({ enableBrowser: !preferences.enableBrowser })}
              className={`w-12 h-6 rounded-full transition-colors ${
                preferences.enableBrowser ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  preferences.enableBrowser ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Enable Toast */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Toast Bildirimleri</p>
              <p className="text-sm text-muted-foreground">Ekran bildirimlerini göster</p>
            </div>
            <button
              onClick={() => updatePreferences({ enableToast: !preferences.enableToast })}
              className={`w-12 h-6 rounded-full transition-colors ${
                preferences.enableToast ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  preferences.enableToast ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Quiet Hours */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Sessiz Saatler</p>
              <p className="text-sm text-muted-foreground">
                {preferences.quietHours.enabled
                  ? `${preferences.quietHours.start} - ${preferences.quietHours.end}`
                  : 'Kapalı'}
              </p>
            </div>
            <button
              onClick={() => updatePreferences({
                quietHours: {
                  ...preferences.quietHours,
                  enabled: !preferences.quietHours.enabled,
                },
              })}
              className={`w-12 h-6 rounded-full transition-colors ${
                preferences.quietHours.enabled ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  preferences.quietHours.enabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Sound Toggle Icon */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
            {preferences.enableSound ? (
              <Volume2 className="w-5 h-5 text-primary" />
            ) : (
              <VolumeX className="w-5 h-5 text-muted-foreground" />
            )}
            <span className="text-sm">
              {preferences.enableSound ? 'Ses açık' : 'Ses kapalı'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
