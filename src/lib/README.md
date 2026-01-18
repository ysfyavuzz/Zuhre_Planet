# Lib Dökümantasyonu

Bu klasör, uygulamanın temel fonksiyonlarını, router'larını ve yardımcı kodlarını içerir.

## 📋 Dosya Listesi

### Core Dosyalar

| Dosya | Açıklama |
|-------|----------|
| `trpc.tsx` | tRPC provider ve client konfigürasyonu |
| `routers.ts` | tRPC router export (merkezi export noktası) |

### Database

| Dosya | Açıklama |
|-------|----------|
| `db.ts` | Database client ve helper fonksiyonları |
| `storage.ts` | Mock S3 storage implementasyonu |

### Routers

| Dosya | Açıklama |
|-------|----------|
| `_core/systemRouter.ts` | Sistem operasyonları |
| `paymentRouter.ts` | Ödeme işlemleri router'ı |

### Utilities

| Dosya | Açıklama |
|-------|----------|
| `utils.ts` | Yardımcı fonksiyonlar |

## 🎯 Kullanım

### tRPC

tRPC client oluşturma:
```typescript
import { trpc } from '@/lib/trpc';

// Query
const { data } = trpc.auth.me.useQuery();

// Mutation
const mutate = trpc.escort.createProfile.useMutation();
```

### Database

Database fonksiyonları:
```typescript
import { getAllApprovedEscorts, getEscortProfileById } from '@/lib/db';

const escorts = await getAllApprovedEscorts(20, 0);
const profile = await getEscortProfileById(123);
```

### Storage

Storage kullanımı (mock):
```typescript
import { storagePut } from '@/lib/storage';

const url = await storagePut('photos/image.jpg', imageBuffer);
```

## 📦 Router'lar

### Auth Router
- `auth.me` - Mevcut kullanıcı bilgisi
- `auth.login` - Giriş
- `auth.logout` - Çıkış

### Escort Router
- `escort.createProfile` - Profil oluşturma
- `escort.updateProfile` - Profil güncelleme
- `escort.getProfile` - Profil getirme

### Payment Router
- `payment.createIntent` - Ödeme intent oluştur
- `payment.confirm` - Ödeme onayla

## 🔧 Yapılandırma

Environment Variables:
```bash
VITE_TURSO_URL=libsql://...
VITE_TURSO_AUTH_TOKEN=...
```
