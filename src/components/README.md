# Components Dökümantasyonu

Bu klasör, escort ilan platformunun tüm React UI component'lerini içerir.

## 📋 Component Listesi

### Ana Component'ler

| Component | Açıklama |
|-----------|----------|
| `Header.tsx` | Site başlığı, navigation ve kullanıcı menüsü |
| `BottomNav.tsx` | Mobil alt navigation menüsü |
| `StandardCard.tsx` | Standart escort kartı (liste görünümü) |
| `VipPremiumCard.tsx` | VIP/Premium escort kartı (özel görünüm) |

### Auth & Verification

| Component | Açıklama |
|-----------|----------|
| `AgeVerification.tsx` | Yaş doğrulama modal'ı (18+ uyarısı) |
| `ErrorBoundary.tsx` | React error boundary component'i |
| `ErrorDisplay.tsx` | Hata mesajı gösterme component'i |

### Booking & Reviews

| Component | Açıklama |
|-----------|----------|
| `BookingForm.tsx` | Rezervasyon formu |
| `CustomerRatingForm.tsx` | Müşteri değerlendirme formu |
| `PostBookingReview.tsx` | Rezervasyon sonrası değerlendirme |

### UI Elements

| Component | Açıklama |
|-----------|----------|
| `AdBanner.tsx` | Reklam banner'ı |
| `LoadingStates.tsx` | Yükleme animasyonları |
| `NotificationsPanel.tsx` | Bildirim paneli |
| `PlatformBenefits.tsx` | Platform avantajları gösterimi |
| `PaymentSecurity.tsx` | Ödeme güvenliği bilgileri |
| `LoyaltyDashboard.tsx` | Sadakat programı paneli |
| `ChatInterface.tsx` | Mesajlaşma arayüzü |

## 🎯 Kullanım Notları

### Kart Component'leri

**StandardCard**: Standart escort'lar için kullanılır
```tsx
<StandardCard escort={escortData} />
```

**VipPremiumCard**: VIP ve Premium escort'lar için kullanılır
```tsx
<VipPremiumCard escort={escortData} />
```

### Error Handling

**ErrorBoundary**: Tüm route'ları sarmalayarak hata yakalar
```tsx
<RouteErrorBoundary>
  <Suspense fallback={<RouteLoading />}>
    <Component />
  </Suspense>
</RouteErrorBoundary>
```

## 📦 Bağımlılıklar

- Radix UI (ui/ klasöründe)
- Framer Motion (animasyonlar)
- Lucide React (ikonlar)
- Wouter (routing)

## 🔧 Bakım Notları

- Tüm component'ler TypeScript ile yazılmıştır
- Her component kendi stil ve mantığını içerir
- UI component'leri `components/ui/` klasöründe yer alır
