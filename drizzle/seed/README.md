# Database Seeding / Veritabanı Veri Doldurma

> **EN:** This folder contains seed files used to populate the database with demo and test data.  
> **TR:** Bu klasör, veritabanını demo ve test verileri ile doldurmak için kullanılan seed dosyalarını içerir.

---

## 📁 File Structure / Dosya Yapısı

```
drizzle/seed/
├── demo-data.ts     # EN: Demo/test data seeder / TR: Demo/test veri seeder
└── README.md        # EN: This file / TR: Bu dosya
```

---

## 🚀 Usage / Kullanım

### Loading Demo Data / Demo Verileri Yükleme

**English:**
```bash
# Populate database with demo data
npm run db:seed
```

⚠️ **Warning:** This command clears existing data and replaces it with demo data!

**Türkçe:**
```bash
# Veritabanını demo verilerle doldur
npm run db:seed
```

⚠️ **Uyarı:** Bu komut mevcut verileri temizler ve demo verilerle değiştirir!

---

### Safe Loading / Güvenli Yükleme

**English:**

Before running in production environment:

```bash
# First, backup the database
cp local.db local.db.backup

# Then run seed
npm run db:seed
```

**Türkçe:**

Production ortamında çalıştırmadan önce:

```bash
# Önce veritabanını yedekle
cp local.db local.db.backup

# Sonra seed çalıştır
npm run db:seed
```

---

## 📊 Demo Data Set / Demo Veri Seti

### Users (6 items) / Kullanıcılar (6 adet)

| Role/Rol | Email                     | Display Name      |
|----------|---------------------------|-------------------|
| admin    | admin@escortplatform.com  | Platform Admin    |
| client   | client1@example.com       | Ahmet Yılmaz      |
| client   | client2@example.com       | Mehmet Demir      |
| escort   | escort1@example.com       | Ayşe              |
| escort   | escort2@example.com       | Elif              |
| escort   | escort3@example.com       | Zeynep            |

### Escort Profiles (3 items) / Escort Profilleri (3 adet)

**1. Ayşe - Professional Massage / Profesyonel Masaj**
   - **EN:** City: Istanbul / Beşiktaş
   - **TR:** Şehir: Istanbul / Beşiktaş
   - **EN:** Rate: 500 TL/hour
   - **TR:** Ücret: 500 TL/saat
   - **EN:** VIP: Yes, Verified: Yes
   - **TR:** VIP: Evet, Doğrulanmış: Evet

**2. Elif - VIP Service / VIP Hizmet**
   - **EN:** City: Istanbul / Kadıköy
   - **TR:** Şehir: Istanbul / Kadıköy
   - **EN:** Rate: 750 TL/hour
   - **TR:** Ücret: 750 TL/saat
   - **EN:** VIP: Yes, Verified: Yes
   - **TR:** VIP: Evet, Doğrulanmış: Evet

**3. Zeynep - Classic Massage / Klasik Masaj**
   - **EN:** City: Ankara / Çankaya
   - **TR:** Şehir: Ankara / Çankaya
   - **EN:** Rate: 400 TL/hour
   - **TR:** Ücret: 400 TL/saat
   - **EN:** VIP: No, Verified: Yes
   - **TR:** VIP: Hayır, Doğrulanmış: Evet

### Other Data / Diğer Veriler

- **EN:** Photos: 5 profile photos / **TR:** Fotoğraflar: 5 adet profil fotoğrafı
- **EN:** Conversation: 1 sample chat (3 messages) / **TR:** Konuşma: 1 adet örnek mesajlaşma (3 mesaj)
- **EN:** Booking: 1 confirmed appointment / **TR:** Randevu: 1 adet onaylanmış randevu
- **EN:** Favorites: 2 favorite records / **TR:** Favoriler: 2 adet favori kaydı

---

## 🔧 Adding Your Own Seed Data / Kendi Seed Verilerinizi Ekleme

**English:**

To add new seed data:

1. Open `demo-data.ts` file
2. Add new data to the relevant array:

```typescript
const demoUsers = [
  // Existing users...
  {
    openId: 'new-user-001',
    role: 'client',
    email: 'newuser@example.com',
    displayName: 'New User',
  },
];
```

3. Run the seed:
```bash
npm run db:seed
```

**Türkçe:**

Yeni seed verileri eklemek için:

1. `demo-data.ts` dosyasını açın
2. İlgili array'e yeni veri ekleyin:

```typescript
const demoUsers = [
  // Mevcut kullanıcılar...
  {
    openId: 'new-user-001',
    role: 'client',
    email: 'newuser@example.com',
    displayName: 'Yeni Kullanıcı',
  },
];
```

3. Seed'i çalıştırın:
```bash
npm run db:seed
```

---

## 🎯 Usage Scenarios / Kullanım Senaryoları

### Development Environment / Development Ortamı

**English:**
```bash
# For a clean start
npm run db:reset    # Reset database
npm run db:seed     # Load demo data
```

**Türkçe:**
```bash
# Temiz bir başlangıç için
npm run db:reset    # Veritabanını sıfırla
npm run db:seed     # Demo verileri yükle
```

### Test Environment / Test Ortamı

**English:**
```bash
# Clean data before each test
npm run db:seed
```

**Türkçe:**
```bash
# Her test öncesi temiz veri
npm run db:seed
```

### Demo/Staging

**English:**
```bash
# For realistic demo data
npm run db:seed
```

**Türkçe:**
```bash
# Realistic demo verisi için
npm run db:seed
```

---

## ⚠️ Important Notes / Önemli Notlar

**English:**
1. **Don't Use in Production:** This data is for development/testing only
2. **Data Loss:** Running seed will delete existing data
3. **IDs:** Seed data uses fixed IDs (1, 2, 3...)
4. **Passwords:** Demo users don't have passwords (OAuth is used)

**Türkçe:**
1. **Production'da Kullanmayın:** Bu veriler sadece development/test içindir
2. **Veri Kaybı:** Seed çalıştırıldığında mevcut veriler silinir
3. **ID'ler:** Seed verileri sabit ID'ler kullanır (1, 2, 3...)
4. **Şifreler:** Demo kullanıcıların şifreleri bulunmamaktadır (OAuth kullanılıyor)

---

## 📖 Resources / Kaynaklar

- [Drizzle ORM Seeding](https://orm.drizzle.team/docs/seeding)
- [SQLite Testing Best Practices](https://www.sqlite.org/testing.html)
