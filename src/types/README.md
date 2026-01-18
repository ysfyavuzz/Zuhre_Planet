# Types Dökümantasyonu

TypeScript type tanımlamaları ve interface'ler.

## 📋 Type Dosyaları

### loyalty.ts

Sadakat programı type'ları.

```typescript
export interface LoyaltyLevel {
  id: string;
  name: string;
  icon: string;
  color: string;
  border: string;
  gradient: string;
  benefits: string[];
  requiredPoints: number;
}

export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
```

**Seviyeler:**
- Bronze (0-99 puan)
- Silver (100-499 puan)
- Gold (500-999 puan)
- Platinum (1000-2499 puan)
- Diamond (2500+ puan)

### notifications.ts

Bildirim type'ları.

```typescript
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}
```

### payment.ts

Ödeme type'ları.

```typescript
export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_transfer';
  last4?: string;
  brand?: string;
}
```

## 🎯 Kullanım

```typescript
import type { LoyaltyLevel, Notification } from '@/types';

// Component props
interface Props {
  loyalty: LoyaltyLevel;
  notifications: Notification[];
}

// Type guards
function isDiamond(level: LoyaltyTier): boolean {
  return level === 'diamond';
}
```

## 📦 Mock Data Types

`mockData.ts` dosyasında tanımlanan ana type'lar:

```typescript
export interface Escort {
  id: string;
  displayName: string;
  city: string;
  district: string;
  hourlyRate: number;
  profilePhoto?: string;
  isVerifiedByAdmin: boolean;
  isVip: boolean;
  // ... daha fazla alan
}

export type ServiceType =
  | 'classic'
  | 'relaxation'
  | 'sport'
  // ... 100+ hizmet türü
```
