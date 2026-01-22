# Hooks Dökümantasyonu

Custom React hooks koleksiyonu. Business logic ve state management için yeniden kullanılabilir hook'lar.

## 📋 Hook Listesi

### API Hooks (`hooks/api/`)

API entegrasyonu için React Query tabanlı hook'lar.

| Hook | Açıklama |
|------|----------|
| `useAuth.ts` | Kimlik doğrulama işlemleri (login, register, logout) |
| `useAppointments.ts` | Randevu yönetimi (create, update, cancel) |
| `useEscorts.ts` | Escort profil sorgulama ve listeleme |
| `useMessages.ts` | Mesajlaşma API işlemleri |
| `usePayments.ts` | Ödeme işlemleri (checkout, history) |

### Business Logic Hooks

| Hook | Açıklama |
|------|----------|
| `useAdminActions.ts` | Admin CRUD işlemleri (approve, reject, ban, delete) |
| `useAdminData.ts` | Admin dashboard veri sorgulama |
| `useAnalytics.ts` | Analytics ve istatistik takibi |
| `useChat.ts` | WebSocket tabanlı real-time mesajlaşma |
| `useGuestAccess.ts` | Misafir kullanıcı erişim yönetimi |
| `useNotifications.ts` | Bildirim yönetimi ve state |
| `useOnlineStatus.ts` | Kullanıcı online/offline durumu |
| `useReviews.ts` | Değerlendirme sistemi (create, update, delete) |
| `useWebSocket.ts` | Genel WebSocket bağlantı yönetimi |

---

## 🎯 Kullanım Örnekleri

### useAuth - Kimlik Doğrulama

```typescript
import { useLogin, useRegister, useMe } from '@/hooks/api/useAuth';

function LoginForm() {
  const { mutate: login, isPending } = useLogin({
    onSuccess: () => {
      toast.success('Giriş başarılı!');
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (data: LoginRequest) => {
    login(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={isPending}>
        {isPending ? 'Giriş yapılıyor...' : 'Giriş Yap'}
      </button>
    </form>
  );
}

// Mevcut kullanıcı bilgisi
function UserProfile() {
  const { data: user, isLoading } = useMe();

  if (isLoading) return <Spinner />;

  return <div>Hoş geldin, {user?.firstName}!</div>;
}
```

**Özellikler:**
- ✅ React Query ile otomatik caching
- ✅ Mutation state yönetimi (loading, error, success)
- ✅ Token refresh otomasyonu
- ✅ Type-safe API çağrıları

---

### useChat - Real-Time Mesajlaşma

```typescript
import { useChat } from '@/hooks/useChat';

function ChatInterface({ userId }: { userId: string }) {
  const {
    conversations,
    messages,
    isConnected,
    sendMessage,
    setActiveConversation,
    presences,
  } = useChat({
    wsUrl: 'ws://localhost:3000/chat',
    autoReconnect: true,
    onMessageReceived: (message) => {
      // Yeni mesaj geldiğinde ses çal
      playSound('message');
    },
  });

  const handleSendMessage = async (content: string) => {
    if (activeConversationId) {
      await sendMessage(activeConversationId, content);
    }
  };

  return (
    <div>
      <div className="status">
        {isConnected ? '🟢 Bağlı' : '🔴 Bağlantı kesildi'}
      </div>
      
      <ConversationList 
        conversations={conversations}
        onSelect={setActiveConversation}
        presences={presences}
      />
      
      <MessageList messages={messages[activeConversationId] || []} />
      
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}
```

**Özellikler:**
- ✅ WebSocket real-time bağlantı
- ✅ Otomatik reconnection
- ✅ Online/offline presence tracking
- ✅ Typing indicators
- ✅ Message reactions (emoji)
- ✅ Read receipts

---

### useNotifications - Bildirim Yönetimi

```typescript
import { useNotifications } from '@/hooks/useNotifications';

function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    isLoading,
  } = useNotifications({
    autoFetch: true,
    refetchInterval: 30000, // Her 30 saniyede bir güncelle
  });

  return (
    <div>
      <h2>
        Bildirimler 
        {unreadCount > 0 && (
          <span className="badge">{unreadCount}</span>
        )}
      </h2>
      
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRead={() => markAsRead(notification.id)}
          onDelete={() => deleteNotification(notification.id)}
        />
      ))}
      
      {notifications.length > 0 && (
        <button onClick={markAllAsRead}>
          Tümünü Okundu İşaretle
        </button>
      )}
    </div>
  );
}
```

**Özellikler:**
- ✅ Okunmamış bildirim sayısı tracking
- ✅ Real-time bildirim güncellemeleri
- ✅ Bildirim filtreleme (type, read status)
- ✅ Bildirim önceliklendirme
- ✅ Desktop bildirim entegrasyonu

---

### useAnalytics - Analytics Takibi

```typescript
import { useAnalytics } from '@/hooks/useAnalytics';

function EscortDashboard() {
  const {
    trackPageView,
    trackEvent,
    trackConversion,
    analytics,
  } = useAnalytics();

  useEffect(() => {
    // Sayfa görüntüleme takibi
    trackPageView('/dashboard');
  }, []);

  const handleProfileUpdate = () => {
    // Event takibi
    trackEvent('profile_update', {
      category: 'user_action',
      label: 'profile_photo_changed',
    });
  };

  const handleBookingCompleted = (amount: number) => {
    // Conversion takibi
    trackConversion('booking_completed', amount);
  };

  return (
    <div>
      <h2>Dashboard Analytics</h2>
      <div className="stats">
        <div>Profile Views: {analytics.profileViews}</div>
        <div>Messages: {analytics.messageCount}</div>
        <div>Bookings: {analytics.bookingCount}</div>
      </div>
    </div>
  );
}
```

**Özellikler:**
- ✅ Google Analytics entegrasyonu
- ✅ Custom event tracking
- ✅ Conversion tracking
- ✅ User journey mapping
- ✅ A/B testing support

---

### useAdminActions - Admin İşlemleri

```typescript
import { useAdminActions } from '@/hooks/useAdminActions';

function AdminApprovalPanel() {
  const {
    approveEscort,
    rejectEscort,
    banUser,
    deleteUser,
    isPending,
  } = useAdminActions({
    onSuccess: (action, id) => {
      toast.success(`${action} başarılı!`);
      queryClient.invalidateQueries(['pending-escorts']);
    },
  });

  const handleApprove = (escortId: string) => {
    approveEscort(escortId, {
      note: 'Profil doğrulandı',
      verifiedAt: new Date(),
    });
  };

  const handleReject = (escortId: string, reason: string) => {
    rejectEscort(escortId, {
      reason,
      notifyUser: true,
    });
  };

  return (
    <div>
      {pendingEscorts.map((escort) => (
        <div key={escort.id}>
          <h3>{escort.displayName}</h3>
          <button 
            onClick={() => handleApprove(escort.id)}
            disabled={isPending}
          >
            ✅ Onayla
          </button>
          <button 
            onClick={() => handleReject(escort.id, 'Eksik bilgi')}
            disabled={isPending}
          >
            ❌ Reddet
          </button>
        </div>
      ))}
    </div>
  );
}
```

**Özellikler:**
- ✅ Bulk operations (toplu işlem)
- ✅ Undo/redo support
- ✅ Action confirmation dialogs
- ✅ Audit logging
- ✅ Role-based permissions

---

### useWebSocket - WebSocket Bağlantı Yönetimi

```typescript
import { useWebSocket } from '@/hooks/useWebSocket';

function RealTimeFeature() {
  const {
    isConnected,
    send,
    subscribe,
    unsubscribe,
    error,
  } = useWebSocket({
    url: 'ws://localhost:3000/ws',
    autoConnect: true,
    reconnectAttempts: 5,
    reconnectInterval: 3000,
    onConnect: () => {
      console.log('WebSocket connected');
    },
    onDisconnect: () => {
      console.log('WebSocket disconnected');
    },
  });

  useEffect(() => {
    // Event'lere subscribe ol
    const unsubscribeFromMessages = subscribe('message', (data) => {
      console.log('New message:', data);
    });

    const unsubscribeFromPresence = subscribe('presence', (data) => {
      console.log('User presence:', data);
    });

    return () => {
      unsubscribeFromMessages();
      unsubscribeFromPresence();
    };
  }, [subscribe]);

  const sendPing = () => {
    send('ping', { timestamp: Date.now() });
  };

  return (
    <div>
      <div>Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</div>
      {error && <div className="error">{error}</div>}
      <button onClick={sendPing}>Send Ping</button>
    </div>
  );
}
```

**Özellikler:**
- ✅ Otomatik reconnection
- ✅ Event subscription system
- ✅ Connection state management
- ✅ Error handling
- ✅ Heartbeat/ping support

---

### useReviews - Değerlendirme Sistemi

```typescript
import { useReviews } from '@/hooks/useReviews';

function ReviewsPanel({ escortId }: { escortId: string }) {
  const {
    reviews,
    averageRating,
    totalReviews,
    createReview,
    updateReview,
    deleteReview,
    reportReview,
    isLoading,
  } = useReviews(escortId);

  const handleSubmitReview = async (data: ReviewFormData) => {
    await createReview({
      escortId,
      rating: data.rating,
      comment: data.comment,
      isAnonymous: data.isAnonymous,
    });
  };

  return (
    <div>
      <div className="stats">
        <span>⭐ {averageRating.toFixed(1)}</span>
        <span>({totalReviews} değerlendirme)</span>
      </div>
      
      <ReviewForm onSubmit={handleSubmitReview} />
      
      <div className="reviews-list">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onEdit={(id, data) => updateReview(id, data)}
            onDelete={(id) => deleteReview(id)}
            onReport={(id, reason) => reportReview(id, reason)}
          />
        ))}
      </div>
    </div>
  );
}
```

**Özellikler:**
- ✅ Rating calculation (average)
- ✅ Review CRUD operations
- ✅ Anonymous review support
- ✅ Review moderation/reporting
- ✅ Pagination support
- ✅ Verified purchase indicator

---

### useOnlineStatus - Online Durum Takibi

```typescript
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

function UserPresence({ userId }: { userId: string }) {
  const {
    isOnline,
    lastSeen,
    presenceData,
  } = useOnlineStatus(userId);

  return (
    <div className="user-presence">
      {isOnline ? (
        <span className="online-indicator">🟢 Online</span>
      ) : (
        <span className="offline-indicator">
          ⚫ Son görülme: {formatRelativeTime(lastSeen)}
        </span>
      )}
      
      {presenceData?.isTyping && (
        <span className="typing-indicator">Yazıyor...</span>
      )}
    </div>
  );
}
```

**Özellikler:**
- ✅ Real-time online/offline tracking
- ✅ Last seen timestamp
- ✅ Typing indicator
- ✅ Idle detection
- ✅ Privacy mode support

---

### useGuestAccess - Misafir Erişim

```typescript
import { useGuestAccess } from '@/hooks/useGuestAccess';

function CatalogPage() {
  const {
    isGuest,
    guestLimits,
    canViewProfile,
    canSendMessage,
    showUpgradePrompt,
  } = useGuestAccess();

  const handleProfileClick = (escortId: string) => {
    if (!canViewProfile()) {
      showUpgradePrompt('Profil detaylarını görmek için üye olmalısınız.');
      return;
    }
    
    navigate(`/escort/${escortId}`);
  };

  return (
    <div>
      {isGuest && (
        <div className="guest-notice">
          ⚠️ Misafir modu - Sınırlı özellikler
          (Kalan görüntüleme: {guestLimits.remainingViews}/10)
        </div>
      )}
      
      <EscortList onProfileClick={handleProfileClick} />
    </div>
  );
}
```

**Özellikler:**
- ✅ Misafir limitleri (görüntüleme, mesaj)
- ✅ Upgrade prompt sistemi
- ✅ Feature gating
- ✅ Session tracking

---

## 🔄 Hook Yaşam Döngüsü

### React Query Hook Pattern

```typescript
// 1. Query Key Tanımı
export const escortKeys = {
  all: ['escorts'] as const,
  lists: () => [...escortKeys.all, 'list'] as const,
  list: (filters: string) => [...escortKeys.lists(), { filters }] as const,
  details: () => [...escortKeys.all, 'detail'] as const,
  detail: (id: string) => [...escortKeys.details(), id] as const,
};

// 2. Hook Tanımı
export function useEscortDetail(id: string) {
  return useQuery({
    queryKey: escortKeys.detail(id),
    queryFn: () => escortApi.getDetail(id),
    enabled: !!id, // id varsa çalıştır
    staleTime: 5 * 60 * 1000, // 5 dakika fresh
    cacheTime: 10 * 60 * 1000, // 10 dakika cache
  });
}

// 3. Mutation Tanımı
export function useUpdateEscort() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateEscortData) => escortApi.update(data),
    onSuccess: (data, variables) => {
      // Cache'i invalidate et
      queryClient.invalidateQueries(escortKeys.detail(variables.id));
      queryClient.invalidateQueries(escortKeys.lists());
    },
  });
}
```

---

## 🎨 Best Practices

### 1. Hook Composition

```typescript
// ❌ Kötü: Component içinde karmaşık logic
function MyComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    fetch('/api/data')
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);
  
  return <div>{/* ... */}</div>;
}

// ✅ İyi: Custom hook ile encapsulation
function MyComponent() {
  const { data, isLoading } = useData();
  return <div>{/* ... */}</div>;
}
```

### 2. Error Handling

```typescript
function useDataWithErrorHandling() {
  const { data, error, isError } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
    onError: (error) => {
      // Global error handling
      toast.error(error.message);
      console.error('Data fetch error:', error);
    },
    retry: 3, // 3 kere tekrar dene
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return { data, error, isError };
}
```

### 3. Optimistic Updates

```typescript
function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateProfileApi,
    onMutate: async (newData) => {
      // İşlem başlamadan önce
      await queryClient.cancelQueries(['profile']);
      
      // Önceki değeri kaydet
      const previousProfile = queryClient.getQueryData(['profile']);
      
      // Optimistic update
      queryClient.setQueryData(['profile'], newData);
      
      return { previousProfile };
    },
    onError: (err, newData, context) => {
      // Hata olursa geri al
      queryClient.setQueryData(['profile'], context.previousProfile);
    },
    onSettled: () => {
      // Her durumda cache'i güncelle
      queryClient.invalidateQueries(['profile']);
    },
  });
}
```

---

## 🧪 Testing

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './useAuth';

describe('useAuth', () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  test('should login successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    result.current.login({
      email: 'test@example.com',
      password: 'password123',
    });

    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));
  });
});
```

---

## 📦 Hook Organizasyonu

```
src/hooks/
├── api/                    # API entegrasyon hook'ları
│   ├── index.ts           # Re-export
│   ├── useAuth.ts
│   ├── useEscorts.ts
│   └── usePayments.ts
│
├── useChat.ts             # Business logic hooks
├── useNotifications.ts
├── useWebSocket.ts
└── ...
```

**Naming Convention:**
- API hooks: `use[Resource]` (useAuth, useEscorts)
- Business hooks: `use[Feature]` (useChat, useAnalytics)
- Utility hooks: `use[Utility]` (useDebounce, useLocalStorage)

---

## 🔗 İlgili Dökümantasyon

- [Components](../components/README.md) - UI component'leri
- [Services](../services/README.md) - API service layer
- [Utils](../utils/README.md) - Utility functions
- [Types](../types/README.md) - TypeScript type definitions

---

**Dökümantasyon Versiyonu:** 1.0  
**Son Güncelleme:** 22 Ocak 2026
