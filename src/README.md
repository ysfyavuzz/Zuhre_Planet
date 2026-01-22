# Source Code

Bu klasör, tüm uygulama kaynak kodlarını içerir.

## 📁 Klasör Yapısı

| Klasör | Açıklama | Önemli Dosyalar |
|--------|----------|-----------------|
| `components/` | React UI bileşenleri | 3d/, admin/, ui/ |
| `components/3d/` | 3D efektli componentler | Button3D, Card3D, Badge3D, Avatar3D, Toggle3D |
| `components/ui/` | Temel UI componentleri | Badge, Button, Card, Input |
| `components/admin/` | Admin panel componentleri | - |
| `pages/` | Sayfa componentleri | Home, Catalog, Profile |
| `hooks/` | Custom React hook'ları | useAuth, useWebSocket |
| `contexts/` | React Context'leri | AuthContext, ThemeContext |
| `lib/` | Utility kütüphaneleri | utils, security, payment |
| `types/` | TypeScript tip tanımları | - |
| `services/` | API servisleri | adminApi, pushNotification |
| `data/` | Mock data modülleri | - |
| `styles/` | Global stiller ve CSS | 3d-effects.css, animations.css |
| `utils/` | Yardımcı fonksiyonlar | - |

## 🏗️ Mimari

### Component Hiyerarşisi

```
App
├── Pages (Routing)
│   ├── Home
│   ├── Catalog
│   ├── Profile
│   └── Admin
├── Layouts
│   ├── Header
│   ├── Footer
│   └── Navigation
└── Shared Components
    ├── 3D Components
    ├── UI Components
    └── Feature Components
```

### State Management

- **React Context**: Global state (Auth, Theme)
- **Component State**: Local state
- **URL State**: Routing parameters

### Styling Approach

- **Tailwind CSS**: Utility-first CSS framework
- **Custom CSS**: 3D effects, animations
- **CSS Modules**: Component-specific styles (where needed)

## 📚 Önemli Modüller

### 3D Components (`components/3d/`)

Gelişmiş 3D efektli componentler. Her biri:
- Framer Motion animasyonları
- GPU acceleration
- TypeScript tip güvenliği
- Kapsamlı JSDoc

**README:** [components/3d/README.md](./components/3d/README.md)

### Security (`lib/security/`)

Güvenlik modülleri:
- JWT authentication
- CSRF protection
- Rate limiting
- Input validation
- Password hashing

### Payment (`lib/payment/`)

Ödeme sistemi:
- Iyzico entegrasyonu
- Webhook handling
- Transaction logging

## 🎨 Stil Dosyaları

### `styles/3d-effects.css`
3D efekt utility sınıfları:
- Perspective containers
- Transform utilities
- Shadow levels
- Glow effects

### `styles/animations.css`
Animasyon tanımları:
- Keyframe animations
- Utility classes
- Animation delays/durations

## 🔧 Konfigürasyon

### TypeScript
- Strict mode enabled
- Path aliases (`@/`)
- Type checking

### ESLint
- React hooks rules
- TypeScript rules
- Import/export rules

## 📝 Kod Standartları

### Naming Conventions
- **Components**: PascalCase (`Button3D.tsx`)
- **Hooks**: camelCase with 'use' prefix (`useAuth.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Constants**: SCREAMING_SNAKE_CASE (`API_BASE_URL`)

### File Organization
```tsx
// 1. Imports
import * as React from 'react';
import { motion } from 'framer-motion';

// 2. Types/Interfaces
export interface Props {
  // ...
}

// 3. Constants
const VARIANTS = {
  // ...
};

// 4. Component
export const Component = () => {
  // ...
};
```

### JSDoc Standards
Tüm exportlanan componentler ve fonksiyonlar JSDoc içermeli:

```tsx
/**
 * Component açıklaması
 * 
 * @module path/to/module
 * @category Category
 * @example
 * ```tsx
 * <Component prop="value" />
 * ```
 */
```

## 🧪 Testing

Test dosyaları `__tests__/` veya `*.test.tsx` formatında:

```
src/
├── __tests__/
│   ├── components/
│   ├── hooks/
│   └── utils/
```

## 🚀 Geliştirme İpuçları

### Hot Reload
Vite HMR aktif - değişiklikler anında yansır

### Type Checking
```bash
npm run build  # TypeScript + Vite build
npx tsc --noEmit  # Sadece type check
```

### Linting
```bash
npm run lint  # ESLint
```

## 📖 İlgili Dokümantasyon

- [3D Effects Guide](../docs/3D_EFFECTS_GUIDE.md)
- [Architecture](../ARCHITECTURE.md)
- [Contributing](../CONTRIBUTING.md)

---

**Last Updated:** 2026-01-22 | **Version:** 4.2.0
