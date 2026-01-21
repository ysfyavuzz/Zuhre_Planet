/**
 * Notification Center Component
 *
 * Dropdown panel for displaying and managing notifications.
 * Features filtering, marking as read, and quick actions.
 *
 * @module components/NotificationCenter
 * @category Components - Notification
 */

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Bell,
  BellRing,
  Check,
  CheckCheck,
  X,
  Settings,
  Trash2,
  MoreVertical,
  Filter,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  Notification,
  NotificationCategory,
  NotificationPriority,
  NOTIFICATION_CATEGORY_INFO,
} from '@/types/notification';

interface NotificationCenterProps {
  notifications: Notification[];
  unreadCount: number;
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onActionClick?: (notification: Notification) => void;
  onOpenSettings?: () => void;
  className?: string;
}

const PRIORITY_COLORS: Record<NotificationPriority, string> = {
  low: 'border-l-gray-400',
  normal: 'border-l-blue-400',
  high: 'border-l-orange-400',
  urgent: 'border-l-red-400',
};

export function NotificationCenter({
  notifications,
  unreadCount,
  isOpen,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll,
  onActionClick,
  onOpenSettings,
  className = '',
}: NotificationCenterProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | NotificationCategory>('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    let results = [...notifications];

    if (filter === 'unread') {
      results = results.filter(n => !n.read);
    } else if (filter !== 'all') {
      results = results.filter(n => n.category === filter);
    }

    // Sort: unread first, then by date
    results.sort((a, b) => {
      if (a.read !== b.read) {
        return a.read ? 1 : -1;
      }
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    return results;
  }, [notifications, filter]);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
    onActionClick?.(notification);
    onClose();
  };

  const formatTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true, locale: tr });
  };

  const getCategoryInfo = (category: NotificationCategory) => {
    return NOTIFICATION_CATEGORY_INFO[category];
  };

  return (
    <div className={className}>
      {/* Trigger Button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => isOpen ? onClose() : null}
      >
        {unreadCount > 0 ? (
          <BellRing className="w-5 h-5" />
        ) : (
          <Bell className="w-5 h-5" />
        )}
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={onClose}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-12 w-[380px] max-h-[600px] bg-background border rounded-xl shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg">Bildirimler</h3>
                  <div className="flex items-center gap-1">
                    {onOpenSettings && (
                      <Button variant="ghost" size="icon" onClick={onOpenSettings}>
                        <Settings className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={onClose}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button
                      variant={filter === 'all' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setFilter('all')}
                    >
                      Tümü
                    </Button>
                    <Button
                      variant={filter === 'unread' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setFilter('unread')}
                    >
                      Okunmamış
                      {unreadCount > 0 && ` (${unreadCount})`}
                    </Button>
                  </div>

                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onMarkAllAsRead}
                      className="text-xs"
                    >
                      <CheckCheck className="w-4 h-4 mr-1" />
                      Tümünü Oku
                    </Button>
                  )}
                </div>

                {/* Category Filters */}
                <div className="flex gap-1 mt-3 overflow-x-auto pb-1">
                  {Object.values(NOTIFICATION_CATEGORY_INFO).map((cat) => (
                    <Button
                      key={cat.label}
                      variant={filter === cat.category ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setFilter(cat.category)}
                      className="shrink-0"
                    >
                      {cat.icon} {cat.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {filteredNotifications.length > 0 ? (
                  <div className="divide-y">
                    <AnimatePresence mode="popLayout">
                      {filteredNotifications.map((notification) => {
                        const categoryInfo = getCategoryInfo(notification.category);

                        return (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <button
                              onClick={() => handleNotificationClick(notification)}
                              className={`w-full p-4 text-left transition-colors hover:bg-muted/50 border-l-4 ${
                                notification.read ? 'opacity-60' : ''
                              } ${PRIORITY_COLORS[notification.priority]}`}
                            >
                              <div className="flex items-start gap-3">
                                {/* Icon */}
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xl shrink-0">
                                  {notification.icon || categoryInfo.icon}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <h4 className={`font-semibold text-sm ${
                                      notification.read ? 'font-normal' : ''
                                    }`}>
                                      {notification.title}
                                    </h4>
                                    <span className="text-xs text-muted-foreground shrink-0 ml-2">
                                      {formatTime(notification.createdAt)}
                                    </span>
                                  </div>

                                  <p className={`text-sm text-muted-foreground line-clamp-2 ${
                                    notification.read ? '' : 'font-medium'
                                  }`}>
                                    {notification.body}
                                  </p>

                                  {/* Action button */}
                                  {notification.actionLabel && (
                                    <div className="mt-2">
                                      <Badge variant="outline" className="text-xs">
                                        {notification.actionLabel}
                                      </Badge>
                                    </div>
                                  )}
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDelete(notification.id);
                                    }}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                  {!notification.read && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onMarkAsRead(notification.id);
                                      }}
                                    >
                                      <Check className="w-3 h-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </button>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center p-8">
                    <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
                      <Bell className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="font-semibold mb-2">
                      {filter === 'unread' ? 'Okunmamış bildirim yok' : 'Bildirim yok'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {filter === 'unread'
                        ? 'Tüm bildirimlerinizi okudunuz'
                        : 'Henüz bildiriminiz yok'}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-4 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearAll}
                    className="w-full text-muted-foreground"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Tüm Bildirimleri Temizle
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export { NotificationCenter as default };
