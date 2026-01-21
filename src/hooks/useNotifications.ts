/**
 * useNotifications Hook
 *
 * Manages notifications, preferences, and real-time notification updates.
 * Integrates with push notifications and in-app notification center.
 *
 * @module hooks/useNotifications
 * @category Hooks
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  NotificationPreferences,
  NotificationStats,
  NotificationCategory,
  NotificationPriority,
  DEFAULT_NOTIFICATION_PREFERENCES,
  NOTIFICATION_TYPES,
  formatNotificationTemplate,
} from '@/types/notification';
import type { Notification, NotificationChannel } from '@/types/notification';

interface UseNotificationsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  onNotificationReceived?: (notification: Notification) => void;
  onNotificationRead?: (notificationId: string) => void;
  onError?: (error: Error) => void;
}

interface UseNotificationsReturn {
  // State
  notifications: Notification[];
  unreadCount: number;
  stats: NotificationStats;
  preferences: NotificationPreferences;
  isLoading: boolean;
  isPushEnabled: boolean;
  pushPermission: NotificationPermission;

  // Actions
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  clearAll: () => Promise<void>;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => Promise<void>;
  requestPushPermission: () => Promise<boolean>;
  sendTestNotification: () => Promise<void>;

  // Actions - notification actions
  handleNotificationAction: (notificationId: string, action: string) => Promise<void>;

  // Filter
  filterByCategory: (category: NotificationCategory) => Notification[];
  filterByPriority: (priority: NotificationPriority) => Notification[];
  getUnread: () => Notification[];
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: 'user-1',
    type: 'message_new',
    category: 'message',
    priority: 'normal',
    title: 'Yeni Mesaj',
    body: 'Ayşe Yılmaz size bir mesaj gönderdi',
    data: { conversationId: 'conv-1', senderName: 'Ayşe Yılmaz' },
    actionUrl: '/messages',
    actionLabel: 'Mesajı Gör',
    icon: '💬',
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    channels: ['push', 'in_app'],
  },
  {
    id: '2',
    userId: 'user-1',
    type: 'booking_confirmed',
    category: 'booking',
    priority: 'high',
    title: 'Randevu Onaylandı',
    body: 'Randevunuz onaylandı: 15 Ocak 2026 - 14:00',
    data: { bookingId: 'booking-1', date: '2026-01-15', time: '14:00' },
    actionUrl: '/appointments',
    actionLabel: 'Detayları Gör',
    icon: '✅',
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    channels: ['push', 'email', 'in_app'],
  },
  {
    id: '3',
    userId: 'user-1',
    type: 'review_new',
    category: 'review',
    priority: 'normal',
    title: 'Yeni Değerlendirme',
    body: 'Mehmet K. size 5 yıldız verdi',
    data: { reviewId: 'review-1', rating: 5, reviewerName: 'Mehmet K.' },
    actionUrl: '/reviews',
    actionLabel: 'Değerlendirmeyi Gör',
    icon: '⭐',
    read: true,
    readAt: new Date(Date.now() - 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    channels: ['push', 'in_app'],
  },
  {
    id: '4',
    userId: 'user-1',
    type: 'promotion_offer',
    category: 'promotion',
    priority: 'normal',
    title: 'Özel Fırsat!',
    body: 'VIP üyeliğe %20 indirim! Son 3 gün',
    data: { discount: 20, expiry: '3 gün' },
    actionUrl: '/pricing',
    actionLabel: 'Fırsatı Kaçırma',
    icon: '🎁',
    read: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    channels: ['push', 'email', 'in_app'],
  },
];

export function useNotifications(options: UseNotificationsOptions = {}): UseNotificationsReturn {
  const {
    autoRefresh = true,
    refreshInterval = 30000,
    onNotificationReceived,
    onNotificationRead,
    onError,
  } = options;

  // State
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_NOTIFICATION_PREFERENCES);
  const [isLoading, setIsLoading] = useState(false);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>('default');
  const [isPushEnabled, setIsPushEnabled] = useState(false);

  const refreshIntervalRef = useRef<number>();

  // Calculate stats
  const stats: NotificationStats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    byCategory: notifications.reduce((acc, n) => {
      acc[n.category] = (acc[n.category] || 0) + 1;
      return acc;
    }, {} as Partial<Record<NotificationCategory, number>>),
    byPriority: notifications.reduce((acc, n) => {
      acc[n.priority] = (acc[n.priority] || 0) + 1;
      return acc;
    }, {} as Partial<Record<NotificationPriority, number>>),
    todayCount: notifications.filter(n => {
      const today = new Date();
      return n.createdAt.toDateString() === today.toDateString();
    }).length,
    weekCount: notifications.filter(n => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return n.createdAt >= weekAgo;
    }).length,
  };

  const unreadCount = stats.unread;

  // Request push notification permission
  const requestPushPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setPushPermission(permission);

      if (permission === 'granted') {
        setIsPushEnabled(true);

        // Subscribe to push notifications (in production, use service worker)
        if ('serviceWorker' in navigator) {
          try {
            const registration = await navigator.serviceWorker.ready;
            // Convert VAPID key from base64 to Uint8Array
            const vapidKeyString = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';
            const vapidKey = urlBase64ToUint8Array(vapidKeyString);

            const subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: vapidKey as BufferSource,
            });
            // Send subscription to server
            console.log('Push subscription:', subscription);
          } catch (error) {
            console.error('Push subscription failed:', error);
          }
        }

        return true;
      }

      return false;
    } catch (error) {
      onError?.(error as Error);
      return false;
    }
  }, [onError]);

  // Send test notification
  const sendTestNotification = useCallback(async () => {
    if (!('Notification' in window)) {
      return;
    }

    if (pushPermission === 'granted') {
      new Notification('Test Bildirimi', {
        body: 'Bu bir test bildirimidir',
        icon: '/icon-192.png',
        badge: '/badge-72.png',
      });
    }
  }, [pushPermission]);

  // Mark as read
  const markAsRead = useCallback(async (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId
          ? { ...n, read: true, readAt: new Date() }
          : n
      )
    );
    onNotificationRead?.(notificationId);

    // In production, call API
    // await api.notifications.markAsRead(notificationId);
  }, [onNotificationRead]);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true, readAt: new Date() }))
    );

    // In production, call API
    // await api.notifications.markAllAsRead();
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));

    // In production, call API
    // await api.notifications.delete(notificationId);
  }, []);

  // Clear all notifications
  const clearAll = useCallback(async () => {
    setNotifications([]);

    // In production, call API
    // await api.notifications.clearAll();
  }, []);

  // Update preferences
  const updatePreferences = useCallback(async (newPrefs: Partial<NotificationPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPrefs }));

    // In production, call API
    // await api.notifications.updatePreferences(newPrefs);
  }, []);

  // Handle notification action
  const handleNotificationAction = useCallback(async (
    notificationId: string,
    action: string
  ) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification) return;

    // Mark as read when action is clicked
    await markAsRead(notificationId);

    // Navigate to action URL if exists
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }

    // In production, track action
    // await api.notifications.trackAction(notificationId, action);
  }, [notifications, markAsRead]);

  // Filter by category
  const filterByCategory = useCallback((category: NotificationCategory) => {
    return notifications.filter(n => n.category === category);
  }, [notifications]);

  // Filter by priority
  const filterByPriority = useCallback((priority: NotificationPriority) => {
    return notifications.filter(n => n.priority === priority);
  }, [notifications]);

  // Get unread notifications
  const getUnread = useCallback(() => {
    return notifications.filter(n => !n.read);
  }, [notifications]);

  // Initialize push permission
  useEffect(() => {
    if ('Notification' in window) {
      setPushPermission(Notification.permission);
      setIsPushEnabled(Notification.permission === 'granted');
    }
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    if (!autoRefresh) return;

    refreshIntervalRef.current = window.setInterval(() => {
      // In production, fetch new notifications
      // const newNotifications = await api.notifications.list();
      // setNotifications(newNotifications);
    }, refreshInterval);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [autoRefresh, refreshInterval]);

  return {
    // State
    notifications,
    unreadCount,
    stats,
    preferences,
    isLoading,
    isPushEnabled,
    pushPermission,

    // Actions
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    updatePreferences,
    requestPushPermission,
    sendTestNotification,
    handleNotificationAction,

    // Filter
    filterByCategory,
    filterByPriority,
    getUnread,
  };
}

/**
 * Helper to convert URL base64 to Uint8Array for VAPID key
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Helper to create a notification
 */
export function createNotification(
  typeId: string,
  variables: Record<string, any>,
  userId: string
): Notification {
  const type = NOTIFICATION_TYPES[typeId.toUpperCase()];
  if (!type) {
    throw new Error(`Unknown notification type: ${typeId}`);
  }

  const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return {
    id,
    userId,
    type: type.id,
    category: type.category,
    priority: type.priority,
    title: type.title,
    body: formatNotificationTemplate(type.bodyTemplate, variables),
    data: variables,
    icon: type.icon,
    read: false,
    createdAt: new Date(),
    channels: type.defaultChannels,
    ...(type.expireAfter && {
      expiresAt: new Date(Date.now() + type.expireAfter * 60 * 60 * 1000),
    }),
  };
}

/**
 * Helper to send notification to multiple channels
 */
export async function sendNotification(
  notification: Notification,
  channels: NotificationChannel[]
): Promise<void> {
  // In production, this would call your backend API
  console.log('Sending notification:', notification, 'to channels:', channels);

  // Show in-app notification immediately
  if (channels.includes('in_app')) {
    // Dispatch event for in-app notification
    window.dispatchEvent(new CustomEvent('notification:new', { detail: notification }));
  }

  // Show push notification if permission granted
  if (channels.includes('push') && 'Notification' in window && Notification.permission === 'granted') {
    new Notification(notification.title, {
      body: notification.body,
      icon: notification.icon || '/icon-192.png',
      data: notification.data,
    });
  }
}
