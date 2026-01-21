# Escort Platform - Sistem Mimarisi

> Kapsamlı teknik mimari ve kullanıcı rolleri dokümantasyonu.

---

## 🏗️ Genel Bakış

Escort Platform, üç ana kullanıcı türünü (Müşteri, Escort, Admin) ayrı sistemlerle yöneten modern bir web uygulamasıdır.

```
┌─────────────────────────────────────────────────────────────────┐
│                        ESCORT PLATFORM                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────┐    ┌─────────────┐    ┌──────────────┐         │
│   │   MÜŞTERİ   │    │   ESCORT    │    │    ADMIN     │         │
│   │   PORTAL    │    │   PORTAL    │    │   PANEL      │         │
│   └──────┬──────┘    └──────┬──────┘    └──────┬───────┘         │
│          │                   │                  │                 │
│   ┌──────▼──────────────────▼──────────────────▼───────┐         │
│   │                    AUTH LAYER                       │         │
│   │              (JWT + Role-Based Access)              │         │
│   └──────────────────────┬──────────────────────────────┘         │
│                          │                                        │
│   ┌──────────────────────▼──────────────────────────────┐         │
│   │                   API LAYER (tRPC)                   │         │
│   └──────────────────────┬──────────────────────────────┘         │
│                          │                                        │
│   ┌──────────────────────▼──────────────────────────────┐         │
│   │              DATABASE (Turso/LibSQL)                 │         │
│   └─────────────────────────────────────────────────────┘         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 👥 Kullanıcı Rolleri

### 1. Müşteri (Customer)

**Kayıt ve Giriş:**
- `/register`, `/register-client`, `/signup` → Müşteri kaydı
- `/login`, `/login-client` → Müşteri girişi

**Erişilebilir Sayfalar:**
| Sayfa | Route | Açıklama |
|-------|-------|----------|
| Ana Sayfa | `/` | Featured escort'lar, arama |
| İlan Listesi | `/escorts`, `/catalog` | Escort arama ve filtreleme |
| Escort Profili | `/escort/:id` | Escort detay sayfası |
| Favorilerim | `/favorites` | Favori escort'lar |
| Mesajlar | `/messages` | Message inbox |
| Randevularım | `/appointments` | Randevu yönetimi |
| Dashboard | `/dashboard` | Müşteri paneli |

**Özellikler:**
- ✅ Escort profillerini görüntüleme
- ✅ Favorilere ekleme
- ✅ Mesaj gönderme
- ✅ Randevu talebi
- ✅ Değerlendirme yazma
- ✅ VIP üyelik satın alma
- ✅ Sadakat puanı kazanma

---

### 2. Escort

**Kayıt ve Giriş:**
- `/register-escort` → Escort kaydı
- `/login-escort` → Escort girişi

**Erişilebilir Sayfalar:**
| Sayfa | Route | Açıklama |
|-------|-------|----------|
| Dashboard | `/escort/dashboard` | Ana kontrol paneli |
| Private Dashboard | `/escort/private-dashboard` | Özel panel |
| Analytics | `/escort/analytics` | İstatistikler |
| Market | `/escort/market` | Boost ve VIP paketleri |
| Mesajlar | `/messages` | Müşteri mesajları |
| Randevular | `/appointments` | Randevu yönetimi |

**Özellikler:**
- ✅ Profil oluşturma ve düzenleme
- ✅ Fotoğraf yükleme
- ✅ Fiyat belirleme
- ✅ Hizmet türü seçimi
- ✅ Çalışma saatleri ayarlama
- ✅ Mesaj alma ve yanıtlama
- ✅ Randevu onaylama/reddetme
- ✅ Gelir takibi
- ✅ Boost paketleri
- ✅ VIP üyelik

---

### 3. Admin

**Giriş:**
- Admin hesabı özel olarak oluşturulur
- Rol: `admin`

**Erişilebilir Sayfalar:**
| Sayfa | Route | Açıklama |
|-------|-------|----------|
| Dashboard | `/admin/dashboard` | Ana yönetim paneli |
| Onaylar | `/admin/approvals` | Onay bekleyenler |
| Monitoring | `/admin/monitoring` | Canlı izleme |
| Reports | `/admin/reports` | Raporlar |

**Admin Panel Sekmeleri (12 adet):**

1. **Genel Bakış** - Platform istatistikleri, KPI'lar
2. **Kullanıcılar** - Müşteri/Escort yönetimi
3. **İlanlar** - İlan onay/red/silme
4. **Değerlendirmeler** - Yorum moderasyonu
5. **Şikayetler** - Kullanıcı şikayetleri
6. **Ayarlar** - Site ayarları
7. **Tema** - Görsel özelleştirme
8. **Vitrin** - Featured escort'lar
9. **Medya** - Fotoğraf onay kuyruğu
10. **Sayfalar** - CMS sayfa yönetimi
11. **Navigasyon** - Menü düzenleme
12. **Üyeler** - VIP/Boost yönetimi

**Yetkiler:**
- ✅ Tüm kullanıcıları görüntüleme
- ✅ Kullanıcı yasaklama/askıya alma
- ✅ İlan onaylama/reddetme
- ✅ Fotoğraf onaylama
- ✅ Yorum moderasyonu
- ✅ Şikayet yönetimi
- ✅ Site ayarları
- ✅ Finansal raporlar
- ✅ Sistem logları

---

## 🔐 Authentication Flow

```
┌──────────────────┐
│    Kullanıcı     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐         ┌──────────────────┐
│   Login/Register │─────────▶│   AuthContext    │
└──────────────────┘         └────────┬─────────┘
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         │                            │                            │
         ▼                            ▼                            ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  role: 'user'    │    │  role: 'escort'  │    │  role: 'admin'   │
│  Müşteri Portal  │    │  Escort Portal   │    │  Admin Panel     │
└──────────────────┘    └──────────────────┘    └──────────────────┘
```

### JWT Token Yapısı
```typescript
{
  id: string,
  email: string,
  name: string,
  role: 'user' | 'escort' | 'admin',
  membership?: 'basic' | 'gold' | 'platinum' | 'diamond',
  isVerified: boolean,
  exp: number
}
```

---

## 📁 Klasör Yapısı

```
src/
├── components/           # UI Bileşenleri
│   ├── ui/               # Radix UI primitives
│   ├── Header.tsx        # Global header
│   ├── Footer.tsx        # Global footer
│   ├── FloatingNavigation.tsx
│   └── ...
│
├── pages/                # Sayfa Bileşenleri
│   ├── App.tsx           # Ana router
│   │
│   ├── # Genel Sayfalar
│   ├── Home.tsx
│   ├── Catalog.tsx
│   ├── EscortProfile.tsx
│   │
│   ├── # Auth Sayfaları
│   ├── ClientLogin.tsx   # Müşteri giriş
│   ├── ClientRegister.tsx
│   ├── EscortLogin.tsx   # Escort giriş
│   ├── EscortRegister.tsx
│   │
│   ├── # Müşteri Sayfaları
│   ├── CustomerDashboard.tsx
│   ├── MyFavorites.tsx
│   ├── MyAppointments.tsx
│   ├── Messages.tsx
│   │
│   ├── # Escort Sayfaları
│   ├── EscortDashboard.tsx
│   ├── EscortPrivateDashboard.tsx
│   ├── EscortAnalyticsDashboard.tsx
│   ├── EscortMarket.tsx
│   │
│   ├── # Admin Sayfaları
│   ├── AdminDashboard.tsx  # 2344 satır, 12 sekme
│   ├── AdminApprovals.tsx
│   ├── AdminRealTimeMonitoring.tsx
│   ├── AdminReports.tsx
│   │
│   └── # Legal Sayfalar
│       ├── TermsOfService.tsx
│       ├── PrivacyPolicy.tsx
│       ├── CookiePolicy.tsx
│       ├── KVKK.tsx
│       └── Safety.tsx
│
├── contexts/             # React Context'ler
│   ├── AuthContext.tsx   # JWT Authentication
│   ├── ThemeContext.tsx  # Dark/Light mode
│   └── NotificationContext.tsx
│
├── hooks/                # Custom React Hooks
│   ├── useAdminData.ts   # Admin data fetching
│   ├── useAdminActions.ts # Admin mutations
│   └── ...
│
├── lib/                  # Utilities
│   ├── email/            # Email service
│   ├── payment/          # İyzico integration
│   ├── security/         # Security utils
│   └── trpc.ts           # tRPC client
│
├── types/                # TypeScript Types
│   ├── admin.ts
│   ├── payment.ts
│   └── ...
│
└── utils/                # Helper Functions
    └── security.ts       # XSS, validation

```

---

## 🔄 Route Koruması

### DashboardAuthGuard Kullanımı

```tsx
// Admin sayfası örneği
export function AdminDashboard() {
  return (
    <DashboardAuthGuard requiredRole="admin">
      {/* Admin içeriği */}
    </DashboardAuthGuard>
  );
}

// Escort sayfası örneği
export function EscortDashboard() {
  return (
    <DashboardAuthGuard requiredRole="escort">
      {/* Escort içeriği */}
    </DashboardAuthGuard>
  );
}

// Müşteri sayfası örneği
export function MyFavorites() {
  return (
    <DashboardAuthGuard requiredRole="user">
      {/* Müşteri içeriği */}
    </DashboardAuthGuard>
  );
}
```

---

## 📊 Veritabanı Şeması

### Ana Tablolar

| Tablo | Açıklama |
|-------|----------|
| `users` | Tüm kullanıcılar (role field ile ayrım) |
| `escort_profiles` | Escort profil bilgileri |
| `escort_photos` | Escort fotoğrafları |
| `appointments` | Randevular |
| `conversations` | Mesaj konuşmaları |
| `messages` | Mesajlar |
| `reviews` | Değerlendirmeler |
| `favorites` | Favori escort'lar |
| `subscriptions` | VIP üyelikler |
| `payments` | Ödeme kayıtları |
| `notifications` | Bildirimler |
| `reports` | Şikayet raporları |

---

## 🛡️ Güvenlik Katmanları

1. **Authentication** - JWT token doğrulama
2. **Authorization** - Role-based access control
3. **Input Validation** - Sanitization, XSS koruması
4. **Rate Limiting** - API flood koruması
5. **CSP Headers** - Content Security Policy
6. **HTTPS** - SSL/TLS şifreleme

---

## 📈 Performans Optimizasyonları

- React.memo() - Header, Footer, Cards
- Lazy loading - Tüm route'lar
- Manual chunks - Vendor ayrımı
- Code splitting - Bundle %72 küçültme
- Image optimization - Lazy loading
- Virtual scrolling - Uzun listeler

---

*Son Güncelleme: Ocak 2026*
