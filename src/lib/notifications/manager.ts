/**
 * Notification Manager
 *
 * Manages push notification subscriptions and service worker registration.
 * Handles VAPID key generation and push message delivery.
 *
 * @module lib/notifications/manager
 * @category Lib - Notifications
 */

/**
 * Notification Manager Class
 */
export class NotificationManager {
  private static instance: NotificationManager;
  private subscription: PushSubscription | null = null;
  private registration: ServiceWorkerRegistration | null = null;

  private constructor() {}

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  /**
   * Initialize push notifications
   */
  async init(): Promise<boolean> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications not supported');
      return false;
    }

    try {
      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('Service Worker registered');

      // Subscribe to push notifications
      await this.subscribe();

      return true;
    } catch (error) {
      console.error('Failed to init push notifications:', error);
      return false;
    }
  }

  /**
   * Subscribe to push notifications
   */
  async subscribe(): Promise<PushSubscription | null> {
    if (!this.registration) {
      throw new Error('Service Worker not registered');
    }

    try {
      // Get existing subscription
      const existingSubscription = await this.registration.pushManager.getSubscription();

      if (existingSubscription) {
        this.subscription = existingSubscription;
        return existingSubscription;
      }

      // Convert VAPID key (base64 string to Uint8Array)
      const vapidKey = this.urlBase64ToUint8Array(
        import.meta.env.VITE_VAPID_PUBLIC_KEY || ''
      );

      // Subscribe to push
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey as BufferSource,
      });

      this.subscription = subscription;

      // Send subscription to server
      await this.sendSubscriptionToServer(subscription);

      console.log('Push subscribed:', subscription);

      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push:', error);
      return null;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(): Promise<void> {
    if (!this.subscription) {
      return;
    }

    try {
      await this.subscription.unsubscribe();
      this.subscription = null;

      // Notify server
      await this.sendUnsubscribeToServer();

      console.log('Push unsubscribed');
    } catch (error) {
      console.error('Failed to unsubscribe from push:', error);
    }
  }

  /**
   * Get current subscription
   */
  getSubscription(): PushSubscription | null {
    return this.subscription;
  }

  /**
   * Check if push is supported
   */
  isSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  }

  /**
   * Check notification permission
   */
  getPermission(): NotificationPermission {
    if ('Notification' in window) {
      return Notification.permission;
    }
    return 'denied';
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied';
    }

    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      await this.subscribe();
    }

    return permission;
  }

  /**
   * Send subscription to server
   */
  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send subscription to server');
      }

      console.log('Subscription sent to server');
    } catch (error) {
      console.error('Failed to send subscription:', error);
    }
  }

  /**
   * Send unsubscribe to server
   */
  private async sendUnsubscribeToServer(): Promise<void> {
    try {
      if (!this.subscription) {
        return;
      }

      const response = await fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: this.subscription,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send unsubscribe to server');
      }

      console.log('Unsubscribe sent to server');
    } catch (error) {
      console.error('Failed to send unsubscribe:', error);
    }
  }

  /**
   * Convert URL base64 to Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }
}

/**
 * Export singleton instance
 */
export const notificationManager = NotificationManager.getInstance();

/**
 * Helper to show local notification (fallback)
 */
export function showLocalNotification(title: string, options?: NotificationOptions): void {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/icon-192.png',
      badge: '/badge-72.png',
      ...options,
    });
  }
}

/**
 * Helper to request permission and show notification
 */
export async function requestAndShowNotification(
  title: string,
  options?: NotificationOptions
): Promise<void> {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      showLocalNotification(title, options);
    }
  }
}
