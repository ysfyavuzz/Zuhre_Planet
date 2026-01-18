# Pages Dökümantasyonu

Bu klasör, escort ilan platformunun tüm sayfa component'lerini içerir.

## 📋 Sayfa Listesi

### Ana Sayfalar

| Sayfa | Route | Açıklama |
|-------|-------|----------|
| `App.tsx` | - | Ana router ve route tanımlamaları |
| `Home.tsx` | `/` | Ana sayfa - featured escort'lar |
| `Catalog.tsx` | `/catalog` | Escort kataloğu (filtreleme ile) |
| `EscortList.tsx` | `/escorts` | Tüm escort listesi |
| `NotFound.tsx` | - | 404 sayfa bulunamadı |

### Profil Sayfaları

| Sayfa | Route | Açıklama |
|-------|-------|----------|
| `EscortProfile.tsx` | `/escort/:id` | Escort profil detay sayfası |

### Kimlik Doğrulama

| Sayfa | Route | Açıklama |
|-------|-------|----------|
| `EscortLogin.tsx` | `/login-escort` | Escort girişi |
| `EscortRegister.tsx` | `/register-escort` | Escort kaydı |
| `ClientLogin.tsx` | `/login`, `/login-client` | Müşteri girişi |
| `ClientRegister.tsx` | `/register-client` | Müşteri kaydı |

### Escort Dashboard

| Sayfa | Route | Açıklama |
|-------|-------|----------|
| `EscortDashboard.tsx` | `/escort/dashboard` | Escort kontrol paneli |
| `EscortMarket.tsx` | `/escort/market` | Escort pazar yeri |

### Müşteri Paneli

| Sayfa | Route | Açıklama |
|-------|-------|----------|
| `MyFavorites.tsx` | `/favorites` | Favorilerim |
| `Messages.tsx` | `/messages` | Mesajlar |
| `MyAppointments.tsx` | `/appointments` | Randevularım |

### Admin Paneli

| Sayfa | Route | Açıklama |
|-------|-------|----------|
| `AdminDashboard.tsx` | `/admin/dashboard` | Admin kontrol paneli |
| `AdminApprovals.tsx` | `/admin/approvals` | Onay bekleyenler |

### Diğer

| Sayfa | Route | Açıklama |
|-------|-------|----------|
| `Pricing.tsx` | `/pricing`, `/vip` | VIP/Premium fiyatlandırma |
| `SEO.tsx` | `/seo` | SEO ayarları sayfası |

## 🎯 Route Yapısı

```typescript
/                           → Home
/catalog                    → Catalog
/escorts                    → EscortList
/escort/:id                 → EscortProfile
/login                      → ClientLogin
/register                   → ClientRegister
/favorites                  → MyFavorites
/messages                   → Messages
/appointments               → MyAppointments
/pricing, /vip              → Pricing
/escort/dashboard           → EscortDashboard
/escort/market              → EscortMarket
/admin/dashboard            → AdminDashboard
```

## 📝 Sayfa Component'leri

### Lazy Loading

Tüm sayfalar lazy-loaded olarak yüklenir:
```typescript
const Home = lazy(() => import("@/pages/Home").then(m => ({ default: m.default || m.Home })));
const Catalog = lazy(() => import("@/pages/Catalog").then(m => ({ default: m.default })));
// ... diğer sayfalar
```

### Error Handling

Her sayfa `RouteErrorBoundary` ve `Suspense` ile sarmalanmıştır:
```typescript
<Route path="/catalog">
  <RouteErrorBoundary>
    <Suspense fallback={<RouteLoading />}>
      <Catalog />
    </Suspense>
  </RouteErrorBoundary>
</Route>
```

## 🔧 Geliştirme Notları

- Yeni sayfa eklerken `App.tsx`'e route tanımlamasını ekleyin
- Her sayfa kendi içinde data fetching ve state yönetimi yapar
- tRPC ve React Query kullanılarak data fetching yapılır
