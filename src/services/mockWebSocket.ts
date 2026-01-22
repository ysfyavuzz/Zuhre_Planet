/**
 * Mock WebSocket Service
 *
 * Geliştirme ortamı için sahte WebSocket sunucusu.
 * Gerçek WebSocket sunucusu olmadan test yapabilmek için simülasyon.
 *
 * @module services/mockWebSocket
 * @category Services - Development
 *
 * Features:
 * - Simüle edilmiş mesaj alımı
 * - Rastgele typing indicator
 * - Rastgele online durum değişiklikleri
 * - Test senaryoları
 * - Delay simülasyonu
 * - Random message generation
 *
 * @example
 * ```typescript
 * import { mockWebSocketService } from '@/services/mockWebSocket';
 *
 * // Mesaj simülasyonu
 * mockWebSocketService.simulateIncomingMessage('conversation-1');
 *
 * // Typing simülasyonu
 * mockWebSocketService.simulateTyping('conversation-1', 'user-1');
 * ```
 */

import { Message, OnlineStatus } from '@/types/message';

/**
 * Mock user data
 */
const MOCK_USERS = [
  { id: 'user-1', name: 'Ayşe Yılmaz', avatar: undefined },
  { id: 'user-2', name: 'Zeynep Demir', avatar: undefined },
  { id: 'user-3', name: 'Elif Kaya', avatar: undefined },
  { id: 'user-4', name: 'Selin Aydın', avatar: undefined },
];

/**
 * Mock message templates
 */
const MESSAGE_TEMPLATES = [
  'Merhaba! Nasılsınız?',
  'Randevu alabilir miyim?',
  'Uygun musunuz?',
  'Fiyat bilgisi alabilir miyim?',
  'Konum bilgisi verebilir misiniz?',
  'Teşekkür ederim 🙏',
  'İyi günler! ☀️',
  'Anlıyorum, teşekkürler 💖',
  'Harika! Ne zaman müsaitsiniz?',
  'Tamam, görüşmek üzere 👋',
];

/**
 * Mock WebSocket Service Class
 */
class MockWebSocketService {
  private eventCallbacks: Map<string, Set<(data: any) => void>> = new Map();
  private typingTimeouts: Map<string, NodeJS.Timeout> = new Map();
  private simulationActive: boolean = false;
  private simulationInterval: NodeJS.Timeout | null = null;

  /**
   * Subscribe to an event
   */
  on(event: string, callback: (data: any) => void): () => void {
    if (!this.eventCallbacks.has(event)) {
      this.eventCallbacks.set(event, new Set());
    }

    const callbacks = this.eventCallbacks.get(event)!;
    callbacks.add(callback);

    // Return unsubscribe function
    return () => {
      callbacks.delete(callback);
    };
  }

  /**
   * Emit an event
   */
  private emit(event: string, data: any): void {
    const callbacks = this.eventCallbacks.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} callback:`, error);
        }
      });
    }
  }

  /**
   * Get random user
   */
  private getRandomUser() {
    return MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
  }

  /**
   * Get random message
   */
  private getRandomMessage(): string {
    return MESSAGE_TEMPLATES[Math.floor(Math.random() * MESSAGE_TEMPLATES.length)];
  }

  /**
   * Simulate incoming message
   */
  simulateIncomingMessage(conversationId: string, delay: number = 0): void {
    setTimeout(() => {
      const user = this.getRandomUser();
      const message: Message = {
        id: `mock-${Date.now()}-${Math.random()}`,
        conversationId,
        senderId: user.id,
        senderName: user.name,
        senderAvatar: user.avatar,
        content: this.getRandomMessage(),
        type: 'text',
        status: 'delivered',
        timestamp: new Date(),
        reactions: [],
      };

      this.emit('message', message);
    }, delay);
  }

  /**
   * Simulate typing indicator
   */
  simulateTyping(conversationId: string, userId?: string, duration: number = 3000): void {
    const user = userId ? MOCK_USERS.find(u => u.id === userId) : this.getRandomUser();
    if (!user) return;

    // Clear existing timeout
    const key = `${conversationId}-${user.id}`;
    if (this.typingTimeouts.has(key)) {
      clearTimeout(this.typingTimeouts.get(key)!);
    }

    // Start typing
    this.emit('typing', {
      conversationId,
      userId: user.id,
      userName: user.name,
      isTyping: true,
    });

    // Stop typing after duration
    const timeout = setTimeout(() => {
      this.emit('typing', {
        conversationId,
        userId: user.id,
        userName: user.name,
        isTyping: false,
      });
      this.typingTimeouts.delete(key);
    }, duration);

    this.typingTimeouts.set(key, timeout);
  }

  /**
   * Simulate status change
   */
  simulateStatusChange(userId?: string, status?: OnlineStatus): void {
    const user = userId ? MOCK_USERS.find(u => u.id === userId) : this.getRandomUser();
    if (!user) return;

    const statuses: OnlineStatus[] = ['online', 'away', 'busy', 'offline'];
    const randomStatus = status || statuses[Math.floor(Math.random() * statuses.length)];

    this.emit('presence', {
      userId: user.id,
      status: randomStatus,
      isOnline: randomStatus !== 'offline',
      lastSeen: randomStatus === 'offline' ? new Date() : undefined,
    });
  }

  /**
   * Simulate read receipt
   */
  simulateReadReceipt(conversationId: string, messageId: string): void {
    this.emit('read', {
      conversationId,
      messageId,
      readAt: new Date(),
    });
  }

  /**
   * Simulate delivery receipt
   */
  simulateDeliveryReceipt(conversationId: string, messageId: string): void {
    this.emit('delivered', {
      conversationId,
      messageId,
      deliveredAt: new Date(),
    });
  }

  /**
   * Start automatic simulation
   */
  startSimulation(conversationId: string, options: {
    messageInterval?: number;
    typingChance?: number;
    statusChangeChance?: number;
  } = {}): void {
    const {
      messageInterval = 10000, // 10 seconds
      typingChance = 0.3, // 30%
      statusChangeChance = 0.1, // 10%
    } = options;

    if (this.simulationActive) {
      this.stopSimulation();
    }

    this.simulationActive = true;

    this.simulationInterval = setInterval(() => {
      // Random typing
      if (Math.random() < typingChance) {
        this.simulateTyping(conversationId);
        
        // Send message after typing
        setTimeout(() => {
          this.simulateIncomingMessage(conversationId);
        }, 2000);
      }

      // Random status change
      if (Math.random() < statusChangeChance) {
        this.simulateStatusChange();
      }
    }, messageInterval);

    console.log('[MockWebSocket] Simulation started');
  }

  /**
   * Stop automatic simulation
   */
  stopSimulation(): void {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }

    // Clear all typing timeouts
    this.typingTimeouts.forEach(timeout => clearTimeout(timeout));
    this.typingTimeouts.clear();

    this.simulationActive = false;
    console.log('[MockWebSocket] Simulation stopped');
  }

  /**
   * Check if simulation is active
   */
  isSimulationActive(): boolean {
    return this.simulationActive;
  }

  /**
   * Simulate conversation scenario
   */
  simulateConversation(conversationId: string): void {
    // Initial greeting
    this.simulateIncomingMessage(conversationId, 1000);

    // Typing after 3 seconds
    setTimeout(() => {
      this.simulateTyping(conversationId);
    }, 3000);

    // Second message after 6 seconds
    setTimeout(() => {
      this.simulateIncomingMessage(conversationId);
    }, 6000);

    // Status change after 10 seconds
    setTimeout(() => {
      this.simulateStatusChange(undefined, 'away');
    }, 10000);
  }

  /**
   * Clear all event listeners
   */
  clearEventListeners(): void {
    this.eventCallbacks.clear();
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      eventListeners: Array.from(this.eventCallbacks.entries()).map(([event, callbacks]) => ({
        event,
        count: callbacks.size,
      })),
      activeTyping: this.typingTimeouts.size,
      simulationActive: this.simulationActive,
    };
  }
}

/**
 * Singleton instance
 */
export const mockWebSocketService = new MockWebSocketService();

/**
 * Default export
 */
export default mockWebSocketService;
