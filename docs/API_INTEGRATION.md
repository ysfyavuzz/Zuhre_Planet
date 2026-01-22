# 🔌 API Integration (API Entegrasyonu) Rehberi

Bu dokümantasyon, Escort Platform projesindeki API servislerinin nasıl kullanılacağını, mock verilerden gerçek API'ye nasıl geçileceğini ve best practices'leri açıklar.

---

## 📋 İçindekiler

- [API Service Architecture](#-api-service-architecture)
- [Mock'tan Real API'ye Geçiş](#-mocktan-real-apiye-geçiş)
- [Error Handling Patterns](#-error-handling-patterns)
- [Caching Strategies](#-caching-strategies)
- [Authentication Flow](#-authentication-flow)
- [API Client Configuration](#-api-client-configuration)
- [Service Usage Examples](#-service-usage-examples)
- [Testing API Integration](#-testing-api-integration)

---

## 🏗️ API Service Architecture

### Technology Stack

| Katman | Teknoloji | Açıklama |
|--------|-----------|----------|
| **API Client** | tRPC | Type-safe API client |
| **State Management** | TanStack Query | Server state & caching |
| **HTTP Client** | Axios | HTTP istekleri |
| **Backend** | tRPC Server | Type-safe API endpoints |
| **Database** | Drizzle ORM + Turso | LibSQL database |

### Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   React Components                  │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│              TanStack Query (React Query)           │
│  - Caching                                          │
│  - Background refetching                            │
│  - Optimistic updates                               │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│                  tRPC Client                        │
│  - Type-safe API calls                              │
│  - Auto-completion                                   │
│  - Runtime validation                                │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│                  Axios HTTP Client                  │
│  - Interceptors (auth, errors)                      │
│  - Request/Response transformation                   │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│                  tRPC Server                        │
│  - Route handlers                                    │
│  - Validation (Zod)                                  │
│  - Business logic                                    │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│              Drizzle ORM + Turso                    │
│  - Database queries                                  │
│  - Transactions                                      │
└─────────────────────────────────────────────────────┘
```

### Directory Structure

```
src/
├── lib/
│   ├── api/
│   │   ├── client.ts          # tRPC client setup
│   │   ├── trpc.ts            # tRPC utilities
│   │   └── axios.ts           # Axios instance
│   │
│   ├── routers/               # tRPC routers
│   │   ├── auth.ts            # Authentication endpoints
│   │   ├── escorts.ts         # Escort CRUD operations
│   │   ├── bookings.ts        # Booking management
│   │   ├── payments.ts        # Payment processing
│   │   ├── messages.ts        # Messaging system
│   │   └── index.ts           # Router aggregation
│   │
│   ├── services/              # Business logic
│   │   ├── authService.ts
│   │   ├── escortService.ts
│   │   └── paymentService.ts
│   │
│   └── hooks/                 # React Query hooks
│       ├── useAuth.ts
│       ├── useEscorts.ts
│       ├── useBookings.ts
│       └── usePayments.ts
│
└── mockData.ts                # Mock data (development)
```

---

## 🔄 Mock'tan Real API'ye Geçiş

Proje başlangıçta mock verilerle çalışır. Production'a geçmek için aşağıdaki adımları takip edin.

### Adım 1: Environment Variable Ayarlama

`.env.local` dosyasında API modunu ayarlayın:

```env
# Development (mock data)
VITE_API_MODE=mock

# Production (real API)
VITE_API_MODE=production

# API Base URL
VITE_API_URL=https://api.yourdomain.com
```

### Adım 2: API Client Configuration

`src/lib/api/client.ts` dosyası:

```typescript
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../routers';

const API_MODE = import.meta.env.VITE_API_MODE || 'mock';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${API_URL}/trpc`,
      
      // Auth header ekle
      headers() {
        const token = localStorage.getItem('auth_token');
        return {
          authorization: token ? `Bearer ${token}` : '',
        };
      },
      
      // Fetch options
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include', // Cookies için
        });
      },
    }),
  ],
});
```

### Adım 3: Service Layer ile Abstraction

Her service mock ve real API'yi desteklemeli:

```typescript
// src/lib/services/escortService.ts
import { api } from '../api/client';
import { mockEscorts } from '../../mockData';

const API_MODE = import.meta.env.VITE_API_MODE || 'mock';

export const escortService = {
  // List all escorts
  async getEscorts(filters?: FilterOptions) {
    if (API_MODE === 'mock') {
      // Mock data kullan
      return mockEscorts.filter(escort => {
        // Filtreleme logic
        if (filters?.city && escort.city !== filters.city) return false;
        if (filters?.minAge && escort.age < filters.minAge) return false;
        return true;
      });
    }
    
    // Real API kullan
    return api.escorts.list.query(filters);
  },

  // Get single escort
  async getEscort(id: string) {
    if (API_MODE === 'mock') {
      return mockEscorts.find(e => e.id === id);
    }
    
    return api.escorts.getById.query({ id });
  },

  // Create escort profile
  async createEscort(data: CreateEscortInput) {
    if (API_MODE === 'mock') {
      // Mock: Console log ve fake response
      console.log('Mock: Creating escort', data);
      return { id: Math.random().toString(), ...data };
    }
    
    return api.escorts.create.mutate(data);
  },

  // Update escort
  async updateEscort(id: string, data: UpdateEscortInput) {
    if (API_MODE === 'mock') {
      console.log('Mock: Updating escort', id, data);
      return { id, ...data };
    }
    
    return api.escorts.update.mutate({ id, data });
  },

  // Delete escort
  async deleteEscort(id: string) {
    if (API_MODE === 'mock') {
      console.log('Mock: Deleting escort', id);
      return { success: true };
    }
    
    return api.escorts.delete.mutate({ id });
  },
};
```

### Adım 4: React Query Hooks

`src/lib/hooks/useEscorts.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { escortService } from '../services/escortService';
import type { FilterOptions } from '../types';

// List escorts
export function useEscorts(filters?: FilterOptions) {
  return useQuery({
    queryKey: ['escorts', filters],
    queryFn: () => escortService.getEscorts(filters),
    staleTime: 5 * 60 * 1000, // 5 dakika
  });
}

// Single escort
export function useEscort(id: string) {
  return useQuery({
    queryKey: ['escorts', id],
    queryFn: () => escortService.getEscort(id),
    enabled: !!id, // id varsa çalıştır
  });
}

// Create escort
export function useCreateEscort() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: escortService.createEscort,
    onSuccess: () => {
      // Cache'i invalidate et
      queryClient.invalidateQueries({ queryKey: ['escorts'] });
    },
  });
}

// Update escort
export function useUpdateEscort() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEscortInput }) =>
      escortService.updateEscort(id, data),
    onSuccess: (_, variables) => {
      // Specific escort cache'ini invalidate et
      queryClient.invalidateQueries({ queryKey: ['escorts', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['escorts'] });
    },
  });
}

// Delete escort
export function useDeleteEscort() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: escortService.deleteEscort,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['escorts'] });
    },
  });
}
```

### Adım 5: Component'te Kullanım

```typescript
import { useEscorts, useCreateEscort } from '../lib/hooks/useEscorts';

function EscortList() {
  const { data: escorts, isLoading, error } = useEscorts({
    city: 'Istanbul',
    minAge: 21,
  });

  const createMutation = useCreateEscort();

  const handleCreate = async (data: CreateEscortInput) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('Escort created successfully!');
    } catch (error) {
      toast.error('Failed to create escort');
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {escorts?.map(escort => (
        <EscortCard key={escort.id} escort={escort} />
      ))}
    </div>
  );
}
```

---

## 🚨 Error Handling Patterns

### Global Error Handler

`src/lib/api/errorHandler.ts`:

```typescript
import { TRPCClientError } from '@trpc/client';
import { toast } from 'sonner';

export function handleApiError(error: unknown) {
  if (error instanceof TRPCClientError) {
    const { message, data } = error;
    
    // HTTP status codes
    switch (data?.httpStatus) {
      case 400:
        toast.error('Geçersiz istek: ' + message);
        break;
      case 401:
        toast.error('Oturum süreniz doldu. Lütfen tekrar giriş yapın.');
        // Redirect to login
        window.location.href = '/login';
        break;
      case 403:
        toast.error('Bu işlem için yetkiniz yok.');
        break;
      case 404:
        toast.error('İstenen kaynak bulunamadı.');
        break;
      case 429:
        toast.error('Çok fazla istek gönderdiniz. Lütfen bekleyin.');
        break;
      case 500:
        toast.error('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
        break;
      default:
        toast.error('Bir hata oluştu: ' + message);
    }
    
    // Log to error tracking (Sentry)
    if (import.meta.env.PROD) {
      console.error('API Error:', error);
      // Sentry.captureException(error);
    }
  } else {
    toast.error('Beklenmeyen bir hata oluştu.');
    console.error('Unknown error:', error);
  }
}
```

### Component Level Error Handling

```typescript
import { handleApiError } from '../lib/api/errorHandler';

function MyComponent() {
  const { data, error } = useEscorts();

  // React Query error handling
  useEffect(() => {
    if (error) {
      handleApiError(error);
    }
  }, [error]);

  // Mutation error handling
  const createMutation = useCreateEscort({
    onError: (error) => {
      handleApiError(error);
    },
  });

  return <div>{/* ... */}</div>;
}
```

### Retry Strategy

```typescript
// src/lib/api/client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // 401, 403, 404 hataları için retry yapma
        if (error instanceof TRPCClientError) {
          const httpStatus = error.data?.httpStatus;
          if ([401, 403, 404].includes(httpStatus)) {
            return false;
          }
        }
        
        // Maksimum 3 retry
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => {
        // Exponential backoff: 1s, 2s, 4s
        return Math.min(1000 * 2 ** attemptIndex, 30000);
      },
    },
  },
});
```

---

## 💾 Caching Strategies

### React Query Cache Configuration

```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: Data ne kadar süre "fresh" kabul edilir
      staleTime: 5 * 60 * 1000, // 5 dakika
      
      // Cache time: Data cache'de ne kadar tutulur
      cacheTime: 10 * 60 * 1000, // 10 dakika
      
      // Refetch stratejileri
      refetchOnWindowFocus: true, // Pencere focus olduğunda refetch
      refetchOnReconnect: true,    // İnternet bağlantısı geldiğinde refetch
      refetchOnMount: true,        // Component mount olduğunda refetch
    },
  },
});
```

### Specific Cache Strategies

```typescript
// Sık değişmeyen data (escort profiles)
export function useEscorts() {
  return useQuery({
    queryKey: ['escorts'],
    queryFn: escortService.getEscorts,
    staleTime: 10 * 60 * 1000, // 10 dakika
    cacheTime: 30 * 60 * 1000, // 30 dakika
  });
}

// Sık değişen data (messages)
export function useMessages() {
  return useQuery({
    queryKey: ['messages'],
    queryFn: messageService.getMessages,
    staleTime: 0, // Her zaman stale
    refetchInterval: 30 * 1000, // 30 saniyede bir refetch
  });
}

// User-specific data
export function useUserProfile() {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: authService.getProfile,
    staleTime: 60 * 60 * 1000, // 1 saat
    cacheTime: 60 * 60 * 1000,
  });
}
```

### Optimistic Updates

```typescript
export function useUpdateEscort() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: escortService.updateEscort,
    
    // Optimistic update
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['escorts', id] });
      
      // Snapshot previous value
      const previousEscort = queryClient.getQueryData(['escorts', id]);
      
      // Optimistically update
      queryClient.setQueryData(['escorts', id], (old: any) => ({
        ...old,
        ...data,
      }));
      
      // Return context with previous value
      return { previousEscort };
    },
    
    // Rollback on error
    onError: (err, variables, context) => {
      if (context?.previousEscort) {
        queryClient.setQueryData(
          ['escorts', variables.id],
          context.previousEscort
        );
      }
    },
    
    // Refetch on success or error
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['escorts', variables.id] });
    },
  });
}
```

### Cache Invalidation Patterns

```typescript
// Manual invalidation
const queryClient = useQueryClient();

// Tüm escorts cache'ini invalidate et
queryClient.invalidateQueries({ queryKey: ['escorts'] });

// Specific escort
queryClient.invalidateQueries({ queryKey: ['escorts', escortId] });

// Prefix match (tüm escort related)
queryClient.invalidateQueries({ queryKey: ['escorts'] });

// Remove from cache
queryClient.removeQueries({ queryKey: ['escorts', escortId] });

// Reset all queries
queryClient.resetQueries();
```

---

## 🔐 Authentication Flow

### JWT Token Management

```typescript
// src/lib/auth/tokenManager.ts
export const tokenManager = {
  // Token storage
  setToken(token: string) {
    localStorage.setItem('auth_token', token);
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  removeToken() {
    localStorage.removeItem('auth_token');
  },

  // Token validation
  isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiresAt = payload.exp * 1000;
      return Date.now() < expiresAt;
    } catch {
      return false;
    }
  },

  // Auto refresh
  async refreshToken() {
    const currentToken = this.getToken();
    if (!currentToken) return null;

    try {
      const response = await api.auth.refreshToken.mutate({ token: currentToken });
      this.setToken(response.token);
      return response.token;
    } catch {
      this.removeToken();
      return null;
    }
  },
};
```

### Auth Context

```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { tokenManager } from '../lib/auth/tokenManager';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const token = tokenManager.getToken();
      
      if (token && tokenManager.isTokenValid(token)) {
        try {
          // Fetch user profile
          const profile = await api.auth.getProfile.query();
          setUser(profile);
        } catch {
          tokenManager.removeToken();
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Auto refresh token
  useEffect(() => {
    const interval = setInterval(async () => {
      const token = tokenManager.getToken();
      if (token) {
        await tokenManager.refreshToken();
      }
    }, 15 * 60 * 1000); // 15 dakikada bir

    return () => clearInterval(interval);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.auth.login.mutate({ email, password });
    tokenManager.setToken(response.token);
    setUser(response.user);
  };

  const logout = () => {
    tokenManager.removeToken();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

### Protected Routes

```typescript
// src/components/ProtectedRoute.tsx
import { Navigate } from 'wouter';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'escort' | 'admin';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
}

// Usage
<Route path="/dashboard">
  <ProtectedRoute requiredRole="escort">
    <EscortDashboard />
  </ProtectedRoute>
</Route>
```

---

## ⚙️ API Client Configuration

### Axios Instance

```typescript
// src/lib/api/axios.ts
import axios from 'axios';
import { tokenManager } from '../auth/tokenManager';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (auth header)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (error handling)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Token expired - refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const newToken = await tokenManager.refreshToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);
```

### tRPC Client Setup

```typescript
// src/lib/api/trpc.ts
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../routers';

export const trpc = createTRPCReact<AppRouter>();

// Provider setup in main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';

const queryClient = new QueryClient();

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${import.meta.env.VITE_API_URL}/trpc`,
      headers() {
        const token = tokenManager.getToken();
        return {
          authorization: token ? `Bearer ${token}` : '',
        };
      },
    }),
  ],
});

function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <YourApp />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

---

## 📝 Service Usage Examples

### Escort Service

```typescript
// List escorts
const escorts = await escortService.getEscorts({
  city: 'Istanbul',
  minAge: 21,
  maxAge: 35,
});

// Get single escort
const escort = await escortService.getEscort('escort-id-123');

// Create escort
const newEscort = await escortService.createEscort({
  name: 'Ayşe',
  age: 25,
  city: 'Istanbul',
  description: 'VIP escort',
});

// Update escort
await escortService.updateEscort('escort-id-123', {
  description: 'Updated description',
});

// Delete escort
await escortService.deleteEscort('escort-id-123');
```

### Booking Service

```typescript
// Create booking
const booking = await bookingService.createBooking({
  escortId: 'escort-id-123',
  date: '2026-02-01',
  time: '19:00',
  duration: 2, // hours
  location: 'Istanbul, Beşiktaş',
});

// Get user bookings
const bookings = await bookingService.getUserBookings();

// Cancel booking
await bookingService.cancelBooking('booking-id-456');
```

### Payment Service

```typescript
// Create payment
const payment = await paymentService.createPayment({
  amount: 1000,
  packageType: 'vip',
  cardDetails: {
    number: '5528790000000008',
    holder: 'John Doe',
    expiry: '12/30',
    cvv: '123',
  },
});

// Get payment history
const payments = await paymentService.getPaymentHistory();
```

### Message Service

```typescript
// Get conversations
const conversations = await messageService.getConversations();

// Get messages
const messages = await messageService.getMessages('conversation-id-789');

// Send message
await messageService.sendMessage({
  conversationId: 'conversation-id-789',
  content: 'Merhaba!',
});

// Mark as read
await messageService.markAsRead('message-id-321');
```

---

## 🧪 Testing API Integration

### Unit Testing Services

```typescript
// src/lib/services/__tests__/escortService.test.ts
import { describe, it, expect, vi } from 'vitest';
import { escortService } from '../escortService';
import { api } from '../../api/client';

// Mock tRPC client
vi.mock('../../api/client', () => ({
  api: {
    escorts: {
      list: {
        query: vi.fn(),
      },
      getById: {
        query: vi.fn(),
      },
      create: {
        mutate: vi.fn(),
      },
    },
  },
}));

describe('escortService', () => {
  it('should fetch escorts with filters', async () => {
    const mockEscorts = [
      { id: '1', name: 'Test Escort', city: 'Istanbul' },
    ];
    
    vi.mocked(api.escorts.list.query).mockResolvedValue(mockEscorts);

    const result = await escortService.getEscorts({ city: 'Istanbul' });

    expect(result).toEqual(mockEscorts);
    expect(api.escorts.list.query).toHaveBeenCalledWith({ city: 'Istanbul' });
  });

  it('should handle errors', async () => {
    vi.mocked(api.escorts.list.query).mockRejectedValue(
      new Error('Network error')
    );

    await expect(escortService.getEscorts()).rejects.toThrow('Network error');
  });
});
```

### Testing React Query Hooks

```typescript
// src/lib/hooks/__tests__/useEscorts.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEscorts } from '../useEscorts';
import { escortService } from '../../services/escortService';

vi.mock('../../services/escortService');

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

describe('useEscorts', () => {
  it('should fetch escorts successfully', async () => {
    const mockEscorts = [{ id: '1', name: 'Test' }];
    vi.mocked(escortService.getEscorts).mockResolvedValue(mockEscorts);

    const { result } = renderHook(() => useEscorts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockEscorts);
  });

  it('should handle errors', async () => {
    vi.mocked(escortService.getEscorts).mockRejectedValue(
      new Error('API Error')
    );

    const { result } = renderHook(() => useEscorts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });
});
```

### E2E Testing API Integration

```typescript
// tests/e2e/api-integration.spec.ts
import { test, expect } from '@playwright/test';

test.describe('API Integration', () => {
  test('should login and fetch user data', async ({ page }) => {
    // Navigate to login
    await page.goto('/login');

    // Fill login form
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Wait for redirect
    await page.waitForURL('/dashboard');

    // Verify user data loaded
    await expect(page.locator('text=Hoşgeldiniz')).toBeVisible();
  });

  test('should create booking', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Go to escort profile
    await page.goto('/escort/123');

    // Click booking button
    await page.click('text=Randevu Oluştur');

    // Fill booking form
    await page.fill('[name="date"]', '2026-02-01');
    await page.fill('[name="time"]', '19:00');

    // Submit
    await page.click('button:has-text("Rezervasyon Yap")');

    // Verify success
    await expect(page.locator('text=Randevu oluşturuldu')).toBeVisible();
  });
});
```

---

## 🎯 Best Practices

### 1. Type Safety

```typescript
// Always use TypeScript types from tRPC
import type { RouterOutputs } from '../lib/routers';

type Escort = RouterOutputs['escorts']['getById'];
type EscortList = RouterOutputs['escorts']['list'];
```

### 2. Error Boundaries

```typescript
// Wrap components with error boundaries
import { ErrorBoundary } from 'react-error-boundary';

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <YourApp />
    </ErrorBoundary>
  );
}
```

### 3. Loading States

```typescript
// Always handle loading states
function MyComponent() {
  const { data, isLoading, error } = useEscorts();

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage />;
  if (!data) return <EmptyState />;

  return <DataView data={data} />;
}
```

### 4. Pagination

```typescript
export function useEscortsPaginated(page: number = 1) {
  return useQuery({
    queryKey: ['escorts', 'paginated', page],
    queryFn: () => escortService.getEscorts({ page, limit: 20 }),
    keepPreviousData: true, // Keep old data while fetching new
  });
}
```

### 5. Infinite Scroll

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';

export function useEscortsInfinite() {
  return useInfiniteQuery({
    queryKey: ['escorts', 'infinite'],
    queryFn: ({ pageParam = 1 }) =>
      escortService.getEscorts({ page: pageParam, limit: 20 }),
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
  });
}
```

---

## 📞 Support

API integration ile ilgili sorularınız için:
- **Documentation**: Bu dokümanı inceleyin
- **GitHub Issues**: Proje repository'sinde issue açın
- **Examples**: `src/lib/hooks` klasöründeki örneklere bakın

---

**Dokümantasyon Versiyonu:** v1.0.0
**Son Güncelleme:** Ocak 2026
**Proje Versiyonu:** v4.1.0
