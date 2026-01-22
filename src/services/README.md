# Services Dökümantasyonu

API service katmanı. Backend ile iletişim, WebSocket yönetimi ve push bildirimler.

## 📋 Service Listesi

| Service | Açıklama | Dosya |
|---------|----------|-------|
| **Admin API** | Admin dashboard API işlemleri | `adminApi.ts` |
| **Push Notification** | Tarayıcı push bildirimleri | `pushNotification.ts` |
| **Mock WebSocket** | WebSocket mock implementation | `mockWebSocket.ts` |

### API Services (`services/api/`)

tRPC ve REST API entegrasyonları.

| Service | Açıklama |
|---------|----------|
| `auth.ts` | Kimlik doğrulama API |
| `escorts.ts` | Escort profil API |
| `messages.ts` | Mesajlaşma API |
| `payments.ts` | Ödeme API |
| `appointments.ts` | Randevu API |

---

## 🎯 Service Mimarisi

### Katman Yapısı

```
┌─────────────────────────────────────┐
│         React Components            │
│  (UI Layer - Pages, Components)     │
└──────────────┬──────────────────────┘
               │
               │ useQuery/useMutation
               ▼
┌─────────────────────────────────────┐
│         Custom Hooks                │
│  (Business Logic - useAuth, etc.)   │
└──────────────┬──────────────────────┘
               │
               │ API calls
               ▼
┌─────────────────────────────────────┐
│         Services Layer              │ ◄── Bu katman
│  (API Client - adminApi, etc.)      │
└──────────────┬──────────────────────┘
               │
               │ HTTP/WebSocket
               ▼
┌─────────────────────────────────────┐
│         Backend API                 │
│  (tRPC, REST, WebSocket)            │
└─────────────────────────────────────┘
```

### Neden Service Layer?

✅ **Separation of Concerns**: Business logic'ten API logic'i ayırır  
✅ **Reusability**: Birden fazla hook/component'ten kullanılabilir  
✅ **Testability**: API çağrıları kolayca mock'lanabilir  
✅ **Centralization**: Tek bir yerde API endpoint yönetimi  
✅ **Type Safety**: TypeScript ile end-to-end tip güvenliği

---

## 📦 Admin API Service

### Genel Bakış

Admin dashboard için tüm API işlemlerini yöneten kapsamlı service katmanı.

**Dosya:** `src/services/adminApi.ts`

**Özellikler:**
- ✅ Type-safe API çağrıları
- ✅ Error handling ve retry logic
- ✅ Request/response interceptors
- ✅ Caching stratejisi
- ✅ Abort controller desteği

### Kullanım

```typescript
import { adminApi } from '@/services/adminApi';

// Kullanıcı listeleme
const users = await adminApi.users.list({
  page: 1,
  limit: 20,
  role: 'escort',
  status: 'pending',
});

// Kullanıcı onaylama
await adminApi.users.approve(userId, {
  note: 'Profil doğrulandı',
  verifiedAt: new Date(),
});

// İstatistik çekme
const stats = await adminApi.stats.getPlatformStats();
```

### API Kategorileri

#### 1. Users API

```typescript
adminApi.users.list(params: ListUsersParams): Promise<PaginatedResponse<AdminUser>>
adminApi.users.get(userId: string): Promise<AdminUser>
adminApi.users.update(userId: string, data: UpdateUserData): Promise<AdminUser>
adminApi.users.delete(userId: string): Promise<void>
adminApi.users.ban(userId: string, reason: string): Promise<void>
adminApi.users.unban(userId: string): Promise<void>
adminApi.users.approve(userId: string, note?: string): Promise<void>
adminApi.users.reject(userId: string, reason: string): Promise<void>
```

**Örnek:**
```typescript
// Onay bekleyen escort'ları listele
const pendingEscorts = await adminApi.users.list({
  role: 'escort',
  status: 'pending',
  page: 1,
  limit: 50,
});

// Escort'u onayla
await adminApi.users.approve(escortId, 'Kimlik doğrulandı');

// Kullanıcıyı banla
await adminApi.users.ban(userId, 'Kural ihlali');
```

#### 2. Listings API

```typescript
adminApi.listings.list(params: ListListingsParams): Promise<PaginatedResponse<AdminListing>>
adminApi.listings.get(listingId: string): Promise<AdminListing>
adminApi.listings.approve(listingId: string): Promise<void>
adminApi.listings.reject(listingId: string, reason: string): Promise<void>
adminApi.listings.feature(listingId: string, duration: number): Promise<void>
adminApi.listings.delete(listingId: string): Promise<void>
```

#### 3. Reviews API

```typescript
adminApi.reviews.list(params: ListReviewsParams): Promise<PaginatedResponse<AdminReview>>
adminApi.reviews.approve(reviewId: string): Promise<void>
adminApi.reviews.reject(reviewId: string, reason: string): Promise<void>
adminApi.reviews.delete(reviewId: string): Promise<void>
```

#### 4. Reports API

```typescript
adminApi.reports.list(params: ListReportsParams): Promise<PaginatedResponse<AdminReport>>
adminApi.reports.get(reportId: string): Promise<AdminReport>
adminApi.reports.resolve(reportId: string, action: string): Promise<void>
adminApi.reports.dismiss(reportId: string, note: string): Promise<void>
```

#### 5. Stats API

```typescript
adminApi.stats.getPlatformStats(): Promise<PlatformStats>
adminApi.stats.getUserStats(userId: string): Promise<UserStats>
adminApi.stats.getRevenueStats(period: string): Promise<RevenueStats>
adminApi.stats.getActivityStats(period: string): Promise<ActivityStats>
```

**Örnek:**
```typescript
// Platform genel istatistikleri
const stats = await adminApi.stats.getPlatformStats();
console.log(stats);
// {
//   totalUsers: 1542,
//   activeEscorts: 234,
//   totalRevenue: 45680,
//   pendingApprovals: 12,
//   ...
// }

// Gelir istatistikleri (son 30 gün)
const revenue = await adminApi.stats.getRevenueStats('30d');
```

#### 6. Settings API

```typescript
adminApi.settings.get(): Promise<SiteSettings>
adminApi.settings.update(data: Partial<SiteSettings>): Promise<SiteSettings>
adminApi.settings.updateNavigation(items: NavigationItem[]): Promise<void>
adminApi.settings.updatePages(pages: Page[]): Promise<void>
```

### Error Handling

```typescript
import { adminApi, AdminApiError } from '@/services/adminApi';

try {
  await adminApi.users.ban(userId, 'Spam');
} catch (error) {
  if (error instanceof AdminApiError) {
    console.error('API Error:', error.message);
    console.error('Status:', error.status);
    console.error('Code:', error.code);
    
    if (error.status === 403) {
      toast.error('Yetkiniz yok!');
    } else if (error.status === 404) {
      toast.error('Kullanıcı bulunamadı!');
    }
  }
}
```

### Request Interceptors

```typescript
// Her request'e token ekle
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (token refresh)
adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.status === 401) {
      // Token refresh logic
      const newToken = await refreshToken();
      localStorage.setItem('adminToken', newToken);
      // Retry original request
      return adminApi.request(error.config);
    }
    throw error;
  }
);
```

### Caching Strategy

```typescript
// Cache with TTL
const users = await adminApi.users.list({
  page: 1,
  limit: 20,
}, {
  cache: true,
  cacheTTL: 5 * 60 * 1000, // 5 dakika
});

// Cache invalidation
adminApi.cache.invalidate('users.list');

// Clear all cache
adminApi.cache.clear();
```

---

## 📣 Push Notification Service

### Genel Bakış

Tarayıcı push bildirimleri yönetimi. Native bildirimler, ses çalma ve badge sayısı.

**Dosya:** `src/services/pushNotification.ts`

**Özellikler:**
- ✅ Bildirim izni yönetimi
- ✅ Native bildirim gösterme
- ✅ Tıklama yönlendirmesi
- ✅ Badge sayısı güncelleme
- ✅ Ses çalma
- ✅ Sessiz mod desteği
- ✅ Custom icon ve badge

### Kullanım

```typescript
import { pushNotificationService } from '@/services/pushNotification';

// İzin iste
const permission = await pushNotificationService.requestPermission();

if (permission === 'granted') {
  // Bildirim göster
  pushNotificationService.showNotification('Yeni Mesaj', {
    body: 'Ayşe: Merhaba, nasılsın?',
    icon: '/avatars/ayse.jpg',
    badge: '/badge-icon.png',
    tag: 'message-123',
    url: '/messages/123',
    playSound: true,
    soundType: 'message',
  });
}
```

### API Reference

#### requestPermission()

Bildirim izni ister.

```typescript
const permission = await pushNotificationService.requestPermission();
// 'granted' | 'denied' | 'default'
```

#### showNotification(title, options)

Native bildirim gösterir.

```typescript
pushNotificationService.showNotification('Başlık', {
  body: 'Bildirim içeriği',
  icon: '/icon.png',          // İkon URL
  badge: '/badge.png',        // Badge URL
  tag: 'unique-id',           // Duplicate prevention
  url: '/target-page',        // Tıklama yönlendirmesi
  playSound: true,            // Ses çal
  soundType: 'notification',  // 'message' | 'call' | 'notification'
  vibrate: [200, 100, 200],  // Titreşim pattern
  requireInteraction: false,  // Otomatik kapanmasın
  silent: false,              // Sessiz mod
  actions: [                  // Aksiyon butonları
    { action: 'reply', title: 'Yanıtla', icon: '/reply.png' },
    { action: 'dismiss', title: 'Kapat', icon: '/close.png' },
  ],
});
```

#### updateBadgeCount(count)

Badge sayısını günceller.

```typescript
// Okunmamış mesaj sayısını göster
pushNotificationService.updateBadgeCount(5);

// Badge'i temizle
pushNotificationService.updateBadgeCount(0);
```

#### playSound(type)

Bildirim sesi çalar.

```typescript
pushNotificationService.playSound('message');   // Mesaj sesi
pushNotificationService.playSound('call');      // Arama sesi
pushNotificationService.playSound('notification'); // Genel bildirim
```

#### isSupported()

Tarayıcı desteğini kontrol eder.

```typescript
if (pushNotificationService.isSupported()) {
  // Push notification destekleniyor
}
```

### Event Listeners

```typescript
// Bildirime tıklama
pushNotificationService.on('click', (notification) => {
  console.log('Bildirime tıklandı:', notification.tag);
  // URL'ye yönlendir
  if (notification.url) {
    window.location.href = notification.url;
  }
});

// Bildirim kapatma
pushNotificationService.on('close', (notification) => {
  console.log('Bildirim kapatıldı:', notification.tag);
});

// Aksiyon tıklama
pushNotificationService.on('action', (action, notification) => {
  console.log('Aksiyon:', action, notification.tag);
  
  if (action === 'reply') {
    // Yanıtla dialogu aç
  } else if (action === 'dismiss') {
    // Bildirimi kapat
    notification.close();
  }
});
```

### Ses Yönetimi

```typescript
// Ses dosyalarını önceden yükle
await pushNotificationService.preloadSounds();

// Sessiz mod kontrolü
const isSilent = pushNotificationService.isSilentMode();

// Sessiz modu aç/kapat
pushNotificationService.setSilentMode(true);
```

### Örnekler

#### Mesaj Bildirimi

```typescript
function handleNewMessage(message: Message) {
  pushNotificationService.showNotification(
    message.senderName,
    {
      body: message.content.substring(0, 100),
      icon: message.senderAvatar,
      tag: `message-${message.id}`,
      url: `/messages/${message.conversationId}`,
      playSound: true,
      soundType: 'message',
      actions: [
        { action: 'reply', title: 'Yanıtla' },
        { action: 'mark-read', title: 'Okundu İşaretle' },
      ],
    }
  );
  
  // Badge sayısını artır
  const unreadCount = getUnreadMessageCount();
  pushNotificationService.updateBadgeCount(unreadCount);
}
```

#### Randevu Hatırlatma

```typescript
function sendAppointmentReminder(appointment: Appointment) {
  pushNotificationService.showNotification(
    'Randevu Hatırlatma',
    {
      body: `${appointment.clientName} ile randevunuz 1 saat sonra`,
      icon: '/calendar-icon.png',
      tag: `appointment-${appointment.id}`,
      url: `/appointments/${appointment.id}`,
      playSound: true,
      soundType: 'notification',
      requireInteraction: true, // Kullanıcı kapatana kadar göster
    }
  );
}
```

#### VIP Üyelik Bildirimi

```typescript
function notifyVipUpgrade(user: User) {
  pushNotificationService.showNotification(
    '🎉 VIP Üyelik Aktif!',
    {
      body: 'VIP özellikleriniz aktif edildi. Keyifli kullanımlar!',
      icon: '/vip-crown.png',
      badge: '/vip-badge.png',
      tag: 'vip-upgrade',
      url: '/dashboard?tab=vip',
      playSound: true,
      soundType: 'notification',
    }
  );
}
```

---

## 🔌 Mock WebSocket Service

### Genel Bakış

Development ve testing için WebSocket mock implementasyonu.

**Dosya:** `src/services/mockWebSocket.ts`

**Özellikler:**
- ✅ Gerçek WebSocket API'sini taklit eder
- ✅ Event simulation
- ✅ Delay simulation (network latency)
- ✅ Disconnect/reconnect simulation
- ✅ Message queuing

### Kullanım

```typescript
import { MockWebSocket } from '@/services/mockWebSocket';

// Mock WebSocket oluştur
const ws = new MockWebSocket('ws://localhost:3000/chat');

// Event listeners
ws.onopen = () => {
  console.log('Connected');
};

ws.onmessage = (event) => {
  console.log('Message:', event.data);
};

ws.onerror = (error) => {
  console.error('Error:', error);
};

ws.onclose = () => {
  console.log('Disconnected');
};

// Mesaj gönder
ws.send(JSON.stringify({ type: 'chat', message: 'Hello' }));

// Bağlantıyı kapat
ws.close();
```

### Mock Senaryoları

```typescript
// Delayed message simulation
mockWebSocket.simulateMessage(
  { type: 'message', content: 'Test' },
  { delay: 1000 } // 1 saniye gecikme
);

// Disconnect simulation
mockWebSocket.simulateDisconnect({
  reason: 'Connection lost',
  reconnectAfter: 3000, // 3 saniye sonra tekrar bağlan
});

// Error simulation
mockWebSocket.simulateError({
  code: 'AUTH_FAILED',
  message: 'Authentication failed',
});
```

---

## 🏗️ Service Oluşturma Şablonu

Yeni bir service oluştururken aşağıdaki şablonu kullanın:

```typescript
/**
 * [Service Name] Service
 *
 * [Brief description]
 *
 * @module services/[serviceName]
 * @category Services
 *
 * Features:
 * - Feature 1
 * - Feature 2
 * - Feature 3
 *
 * @example
 * ```typescript
 * import { myService } from '@/services/myService';
 *
 * const result = await myService.doSomething();
 * ```
 */

import type { ApiResponse, MyData } from '@/types';

/**
 * Service configuration
 */
interface ServiceConfig {
  baseUrl?: string;
  timeout?: number;
  retries?: number;
}

/**
 * Service class
 */
class MyService {
  private config: ServiceConfig;
  private cache: Map<string, any>;

  constructor(config: ServiceConfig = {}) {
    this.config = {
      baseUrl: config.baseUrl || '/api',
      timeout: config.timeout || 30000,
      retries: config.retries || 3,
    };
    this.cache = new Map();
  }

  /**
   * Main method
   */
  async doSomething(params: any): Promise<ApiResponse<MyData>> {
    try {
      const response = await fetch(`${this.config.baseUrl}/endpoint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Service error:', error);
      throw error;
    }
  }
}

// Export singleton
export const myService = new MyService();
```

---

## 🧪 Testing

```typescript
import { adminApi } from '@/services/adminApi';

// Mock fetch
global.fetch = jest.fn();

describe('adminApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should fetch users', async () => {
    const mockUsers = [
      { id: '1', name: 'User 1' },
      { id: '2', name: 'User 2' },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockUsers }),
    });

    const result = await adminApi.users.list({ page: 1, limit: 20 });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/users'),
      expect.any(Object)
    );
    expect(result.data).toEqual(mockUsers);
  });

  test('should handle errors', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(
      adminApi.users.list({ page: 1, limit: 20 })
    ).rejects.toThrow('Network error');
  });
});
```

---

## 📊 Service Monitoring

```typescript
// Request timing
const startTime = Date.now();
const result = await adminApi.users.list();
const duration = Date.now() - startTime;

console.log(`Request took ${duration}ms`);

// Error tracking
adminApi.on('error', (error) => {
  // Sentry'ye gönder
  Sentry.captureException(error);
});

// Success tracking
adminApi.on('success', (endpoint, duration) => {
  analytics.track('api_success', {
    endpoint,
    duration,
  });
});
```

---

## 🔗 İlgili Dökümantasyon

- [Hooks](../hooks/README.md) - Custom React hooks
- [Utils](../utils/README.md) - Utility functions
- [Types](../types/README.md) - TypeScript definitions
- [API Integration](../../docs/API_INTEGRATION.md) - API entegrasyon rehberi

---

**Dökümantasyon Versiyonu:** 1.0  
**Son Güncelleme:** 22 Ocak 2026
