/**
 * Push Notification Service
 *
 * Tarayıcı push bildirimleri yönetimi.
 * Native bildirimler, ses çalma ve badge sayısı güncelleme.
 *
 * @module services/pushNotification
 * @category Services
 *
 * Features:
 * - Bildirim izni isteme
 * - Native bildirim gösterme
 * - Bildirim tıklama yönlendirmesi
 * - Badge sayısı güncelleme
 * - Ses çalma (opsiyonel)
 * - Sessiz mod desteği
 * - Bildirim önceliği
 * - Custom icon ve badge
 *
 * @example
 * ```typescript
 * import { pushNotificationService } from '@/services/pushNotification';
 *
 * // İzin iste
 * const permission = await pushNotificationService.requestPermission();
 *
 * // Bildirim göster
 * pushNotificationService.showNotification('Yeni Mesaj', {
 *   body: 'Ayşe: Merhaba!',
 *   icon: '/avatar.jpg',
 *   tag: 'message-123'
 * });
 * ```
 */

export type SoundType = 'message' | 'call' | 'notification';

export interface NotificationOptions extends globalThis.NotificationOptions {
  /**
   * Notification tag (duplicate prevention)
   */
  tag?: string;

  /**
   * Bildirime tıklandığında gidilecek URL
   */
  url?: string;

  /**
   * Ses çalınsın mı?
   */
  playSound?: boolean;

  /**
   * Ses tipi
   */
  soundType?: SoundType;

  /**
   * Sessiz mod
   */
  silent?: boolean;

  /**
   * Bildirim önceliği
   */
  priority?: 'default' | 'high' | 'low';

  /**
   * Custom data
   */
  data?: any;
}

/**
 * Push Notification Service Class
 */
class PushNotificationService {
  private permission: NotificationPermission = 'default';
  private soundEnabled: boolean = true;
  private badgeCount: number = 0;
  private audioCache: Map<SoundType, HTMLAudioElement> = new Map();

  constructor() {
    // Check initial permission
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }

    // Preload sounds
    this.preloadSounds();

    // Listen for notification clicks
    this.setupNotificationClickHandler();
  }

  /**
   * Preload notification sounds
   */
  private preloadSounds() {
    const sounds: Record<SoundType, string> = {
      message: '/sounds/message.mp3',
      call: '/sounds/call.mp3',
      notification: '/sounds/notification.mp3',
    };

    Object.entries(sounds).forEach(([type, url]) => {
      const audio = new Audio();
      audio.src = url;
      audio.preload = 'auto';
      this.audioCache.set(type as SoundType, audio);
    });
  }

  /**
   * Setup notification click handler
   */
  private setupNotificationClickHandler() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'notification-click') {
          const url = event.data.url;
          if (url) {
            window.location.href = url;
          }
        }
      });
    }
  }

  /**
   * Check if notifications are supported
   */
  isSupported(): boolean {
    return 'Notification' in window;
  }

  /**
   * Get current permission status
   */
  getPermission(): NotificationPermission {
    return this.permission;
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      console.warn('Notifications are not supported in this browser');
      return 'denied';
    }

    if (this.permission === 'granted') {
      return 'granted';
    }

    try {
      this.permission = await Notification.requestPermission();
      return this.permission;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return 'denied';
    }
  }

  /**
   * Show a notification
   */
  async showNotification(title: string, options: NotificationOptions = {}): Promise<Notification | null> {
    // Check permission
    if (this.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return null;
    }

    // Default options
    const defaultOptions: globalThis.NotificationOptions = {
      icon: '/logo.png',
      badge: '/badge.png',
      requireInteraction: false,
      silent: options.silent ?? false,
      ...options,
    };

    try {
      // Create notification
      const notification = new Notification(title, defaultOptions);

      // Handle click
      notification.onclick = () => {
        window.focus();
        
        if (options.url) {
          window.location.href = options.url;
        }

        notification.close();
      };

      // Play sound if enabled
      if (options.playSound !== false && !options.silent && this.soundEnabled) {
        this.playSound(options.soundType || 'notification');
      }

      return notification;
    } catch (error) {
      console.error('Failed to show notification:', error);
      return null;
    }
  }

  /**
   * Show a message notification
   */
  async showMessageNotification(
    senderName: string,
    message: string,
    options: Partial<NotificationOptions> = {}
  ): Promise<Notification | null> {
    return this.showNotification(senderName, {
      body: message,
      tag: `message-${options.tag || Date.now()}`,
      icon: options.icon || '/logo.png',
      soundType: 'message',
      url: options.url || '/messages',
      ...options,
    });
  }

  /**
   * Play notification sound
   */
  playSound(soundType: SoundType = 'notification'): void {
    if (!this.soundEnabled) return;

    const audio = this.audioCache.get(soundType);
    
    if (audio) {
      // Clone and play to allow multiple simultaneous plays
      const clone = audio.cloneNode() as HTMLAudioElement;
      clone.volume = 0.5;
      clone.play().catch(error => {
        console.error('Failed to play notification sound:', error);
      });
    } else {
      console.warn(`Sound not found: ${soundType}`);
    }
  }

  /**
   * Enable/disable sounds
   */
  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
  }

  /**
   * Get sound enabled status
   */
  isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  /**
   * Update badge count
   */
  updateBadge(count: number): void {
    this.badgeCount = Math.max(0, count);

    // Update browser badge (if supported)
    if ('setAppBadge' in navigator) {
      if (this.badgeCount > 0) {
        (navigator as any).setAppBadge(this.badgeCount).catch((error: Error) => {
          console.error('Failed to set app badge:', error);
        });
      } else {
        (navigator as any).clearAppBadge().catch((error: Error) => {
          console.error('Failed to clear app badge:', error);
        });
      }
    }

    // Update document title
    this.updateDocumentTitle();
  }

  /**
   * Increment badge count
   */
  incrementBadge(amount: number = 1): void {
    this.updateBadge(this.badgeCount + amount);
  }

  /**
   * Decrement badge count
   */
  decrementBadge(amount: number = 1): void {
    this.updateBadge(this.badgeCount - amount);
  }

  /**
   * Clear badge
   */
  clearBadge(): void {
    this.updateBadge(0);
  }

  /**
   * Get current badge count
   */
  getBadgeCount(): number {
    return this.badgeCount;
  }

  /**
   * Update document title with badge count
   */
  private updateDocumentTitle(): void {
    const baseTitle = 'Escilan - Masaj & Escort Platformu';
    
    if (this.badgeCount > 0) {
      document.title = `(${this.badgeCount}) ${baseTitle}`;
    } else {
      document.title = baseTitle;
    }
  }

  /**
   * Close all notifications with a specific tag
   */
  closeNotificationsByTag(tag: string): void {
    if ('serviceWorker' in navigator && 'getNotifications' in ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then(registration => {
        registration.getNotifications({ tag }).then(notifications => {
          notifications.forEach(notification => notification.close());
        });
      });
    }
  }

  /**
   * Close all notifications
   */
  closeAllNotifications(): void {
    if ('serviceWorker' in navigator && 'getNotifications' in ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then(registration => {
        registration.getNotifications().then(notifications => {
          notifications.forEach(notification => notification.close());
        });
      });
    }
  }

  /**
   * Test notification
   */
  async testNotification(): Promise<void> {
    const permission = await this.requestPermission();
    
    if (permission === 'granted') {
      this.showNotification('Test Bildirimi', {
        body: 'Bildirimler başarıyla çalışıyor! 🎉',
        icon: '/logo.png',
        playSound: true,
        soundType: 'notification',
      });
    }
  }
}

/**
 * Singleton instance
 */
export const pushNotificationService = new PushNotificationService();

/**
 * Default export
 */
export default pushNotificationService;
