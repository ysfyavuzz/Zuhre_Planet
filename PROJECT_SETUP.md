# Escort İlan Sitesi - Geliştirme Planı

> Proje güncelleme ve geliştirme rehberi

## 📊 Mevcut Durum Analizi

### ✅ Var olan Bileşenler

| Kategori | Component/Sayfa | Durum | Açıklama |
|----------|----------------|-------|----------|
| **Doğrulama** | AgeVerification.tsx | ✅ Aktif | 18+ yaş doğrulama modal'ı |
| **Ana Sayfa** | Home.tsx | ✅ Aktif | Hero, VIP carousel, listings |
| **Auth** | AuthContext.tsx | ✅ Aktif | Kullanıcı kimlik doğrulama |
| **Giriş** | ClientLogin.tsx | ✅ Aktif | Müşteri girişi |
| **Kayıt** | ClientRegister.tsx | ✅ Aktif | Müşteri kaydı |
| **Giriş** | EscortLogin.tsx | ✅ Aktif | Escort girişi |
| **Kayıt** | EscortRegister.tsx | ✅ Aktif | Escort kaydı |
| **Profil** | EscortProfile.tsx | ✅ Aktif | Escort detay sayfası |
| **Liste** | EscortList.tsx | ✅ Aktif | Tüm ilanlar listesi |
| **Dashboard** | EscortDashboard.tsx | ✅ Aktif | Escort paneli |

### ❌ Eksik Bileşenler

| Component | Öncelik | Açıklama |
|-----------|---------|----------|
| **RoleSelector** | 🔴 Kritik | Yaş doğrulama sonrası Müşteri/Escort seçimi |
| **RouteGuard** | 🟠 Yüksek | Escort profil sayfaları için erişim kontrolü |
| **GuestCatalog** | 🟡 Orta | Misafir kullanıcıların görebileceği vitrin |
| **ProtectedProfile** | 🟠 Yüksek | Sadece giriş yapmışların görebileceği detaylar |

---

## 🎯 Geliştirme Planı

### Faz 1: Temel Altyapı (Kritik)

#### 1.1 RoleSelector Component
```
src/components/RoleSelector.tsx
```

**Özellikler:**
- Yaş doğrulamasından sonra gösterilecek
- İki seçenek: "Müşteri Olarak Devam Et" / "Escort Olarak Devam Et"
- Seçim localStorage'a kaydedilecek
- Görsel tasarım: İki büyük kart, ikonlar, gradient butonlar

**Akış:**
```
AgeVerification → RoleSelector → {CustomerFlow | EscortFlow}
```

#### 1.2 Route Guard Enhancement
```
src/components/ProtectedRoute.tsx
```

**Özellikler:**
- Escort profil sayfalarında erişim kontrolü
- Misafir kullanıcılara "Giriş Yap" / "Kayıt Ol" seçeneği
- Escort kullanıcıları için doğrudan profil erişimi

### Faz 2: Müşteri Akışı

#### 2.1 Guest Catalog
```
src/pages/GuestCatalog.tsx
```

**Özellikler:**
- Misafir kullanıcıların görebileceği sınırlı vitrin
- Sadece isim, şehir, yaş (gizlenmiş) bilgisi
- "Detayları Görmek İçin Giriş Yapın" CTA

#### 2.2 Customer Dashboard
```
src/pages/CustomerDashboard.tsx
```

**Özellikler:**
- Favorilerim
- Randevularım
- Mesajlarım
- Bildirimler

### Faz 3: Escort Akışı

#### 3.1 Escort Public Profile
```
src/pages/EscortPublicProfile.tsx
```

**Özellikler:**
- Giriş yapmamış kullanıcılar için sınırlı görünüm
- Sadece ana profil fotoğrafı ve temel bilgiler
- "İletişime Geçmek İçin Giriş Yapın" modal

#### 3.2 Escort Private Dashboard
```
src/pages/EscortPrivateDashboard.tsx
```

**Özellikler:**
- Profil yönetimi
- Randevu talepleri
- Mesajlar
- İstatistikler

---

## 🔧 MCP Server Yapılandırması

### Aktif MCP Server'lar

```json
{
  "enabledMcpjsonServers": [
    "@modelcontextprotocol/server-github",
    "@modelcontextprotocol/server-filesystem",
    "@modelcontextprotocol/server-brave-search",
    "@modelcontextprotocol/server-memory",
    "hf-mcp"
  ]
}
```

### Proje İçin Kullanılacak MCP Servisleri

| MCP Server | Kullanım Alanı | Açıklama |
|------------|----------------|----------|
| **GitHub MCP** | Repo yönetimi | Commit, pull request, issue yönetimi |
| **Filesystem MCP** | Dosya işlemleri | Okuma, yazma, dizin yönetimi |
| **Brave Search MCP** | SEO araştırması | Anahtar kelime analizi |
| **Memory MCP** | Bağlam yönetimi | Proje geçmişi ve notlar |
| **Hugging Face MCP** | AI görseller | Profil fotoğrafı generation, içerik moderasyonu |

---

## 📁 Yeni Dosya Yapısı

```
src/
├── components/
│   ├── RoleSelector.tsx          [YENİ] - Müşteri/Escort seçimi
│   ├── ProtectedRoute.tsx        [YENİ] - Route guard component
│   └── GuestCard.tsx             [YENİ] - Misafir kullanıcı kartı
├── pages/
│   ├── RoleSelection.tsx         [YENİ] - Rol seçimi sayfası
│   ├── GuestCatalog.tsx          [YENİ] - Misafir katalog
│   └── CustomerDashboard.tsx     [YENİ] - Müşteri paneli
├── hooks/
│   ├── useRoleSelection.ts       [YENİ] - Rol seçimi hook'u
│   └── useGuestAccess.ts         [YENİ] - Misafir erişim hook'u
├── lib/
│   └── roleGuard.ts              [YENİ] - Rol bazlı guard fonksiyonları
└── types/
    └── role.ts                   [YENİ] - Rol tiplerı
```

---

## 🚀 Implementasyon Sırası

### Adım 1: RoleSelector Component
```bash
# Dosya oluştur
touch src/components/RoleSelector.tsx
```

### Adım 2: RoleSelection Page
```bash
# Dosya oluştur
touch src/pages/RoleSelection.tsx
```

### Adım 3: Route Güncellemeleri (App.tsx)
```typescript
// Route ekle:
<Route path="/role-selection">
  <RoleSelection />
</Route>
```

### Adım 4: ProtectedRoute Component
```bash
# Dosya oluştur
touch src/components/ProtectedRoute.tsx
```

### Adım 5: GuestCatalog Component
```bash
# Dosya oluştur
touch src/pages/GuestCatalog.tsx
```

### Adım 6: Test ve Dökümantasyon
```bash
# Test çalıştır
npm test

# Build kontrol
npm run build
```

---

## 📝 Kodlama Standartları

### TypeScript Kuralları
- ✅ Strict mode aktif
- ✅ Tüm fonksiyonlar JSDoc ile dökümante edilecek
- ✅ Interface'ler `I` öneki olmadan tanımlanacak
- ✅ Type export'ları `export type` ile yapılacak

### Component Yapısı
```tsx
/**
 * Component Açıklaması
 *
 * @module components/ComponentName
 * @category Components - Category
 *
 * Features:
 * - Feature 1
 * - Feature 2
 *
 * @example
 * ```tsx
 * <ComponentName prop="value" />
 * ```
 */
```

### Test Gereksinimleri
- ✅ Unit testler > %80 coverage
- ✅ E2E testler kritik akışlar için
- ✅ Visual regression testleri

---

## 🎨 Tasarım İlkeleri

### Renk Paleti
```css
--primary: #d946ef (pink-500)
--primary-dark: #c026d3 (pink-600)
--accent: #8b5cf6 (violet-500)
--background: #09090b (zinc-950)
--foreground: #fafafa (zinc-50)
```

### Tipografi
```css
font-family: 'Inter', sans-serif;
headings: font-black, tracking-tighter
body: text-base, leading-relaxed
```

### Spacing
```css
--spacing-xs: 0.5rem (2)
--spacing-sm: 1rem (4)
--spacing-md: 1.5rem (6)
--spacing-lg: 2rem (8)
--spacing-xl: 3rem (12)
```

---

## ✅ Checklist

### Faz 1 - Kritik
- [ ] RoleSelector component oluştur
- [ ] RoleSelection page oluştur
- [ ] App.tsx route ekle
- [ ] ProtectedRoute component oluştur
- [ ] AgeVerification → RoleSelector akışı
- [ ] localStorage entegrasyonu

### Faz 2 - Müşteri
- [ ] GuestCatalog oluştur
- [ ] CustomerDashboard oluştur
- [ ] Misafir erişim limitleri
- [ ] CustomerAuthContext güncelle

### Faz 3 - Escort
- [ ] EscortPublicProfile güncelle
- [ ] EscortPrivateDashboard güncelle
- [ ] Profil erişim kontrolleri
- [ ] EscortAuthContext güncelle

### Faz 4 - Test
- [ ] Unit testler yaz
- [ ] E2E testler yaz
- [ ] Build test
- [ ] Lint kontrol
- [ ] Dökümantasyon güncelle

---

## 📈 Başarı Metrikleri

| Metrik | Hedef | Güncel |
|--------|-------|--------|
| TypeScript Hataları | 0 | ✅ 0 |
| Test Coverage | %80+ | - |
| Build Time | < 60s | - |
| Lighthouse Skoru | 90+ | - |
| Accessibility | 100 | - |

---

**Son Güncelleme:** 18 Ocak 2026
**Durum:** Geliştirme Hazır
**Sürüm:** v4.0 - Role Selection Update
