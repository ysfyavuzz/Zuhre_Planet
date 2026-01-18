# Database Migrations / Veritabanı Göçleri

> **EN:** This folder contains SQL migration files that manage database schema changes.  
> **TR:** Bu klasör, veritabanı şema değişikliklerini yöneten SQL migration dosyalarını içerir.

## 📁 File Structure / Dosya Yapısı

```
drizzle/migrations/
├── 0001_initial_schema.sql    # EN: Initial schema (all tables) / TR: İlk şema (tüm tablolar)
├── 0002_add_indexes.sql        # EN: Performance indexes / TR: Performance indexleri
└── README.md                    # EN: This file / TR: Bu dosya
```

---

## 🚀 Usage / Kullanım

### Running Migrations / Migration Çalıştırma

**English:**
```bash
# Run all migrations
npm run db:migrate

# Reset and recreate database
npm run db:reset
```

**Türkçe:**
```bash
# Tüm migration'ları çalıştır
npm run db:migrate

# Veritabanını sıfırla ve yeniden oluştur
npm run db:reset
```

---

### Creating Migrations / Migration Oluşturma

**English:**

To create a new migration:

1. Create a new SQL file using the next sequence number:
   ```
   000X_description.sql
   ```

2. Write your migration SQL:
   ```sql
   -- Description of changes
   CREATE TABLE IF NOT EXISTS new_table (...);
   ALTER TABLE existing_table ADD COLUMN new_column TEXT;
   ```

3. Test the migration:
   ```bash
   npm run db:migrate
   ```

**Türkçe:**

Yeni bir migration oluşturmak için:

1. Sıradaki numarayı kullanarak yeni bir SQL dosyası oluştur:
   ```
   000X_description.sql
   ```

2. Migration SQL'ini yaz:
   ```sql
   -- Description of changes
   CREATE TABLE IF NOT EXISTS new_table (...);
   ALTER TABLE existing_table ADD COLUMN new_column TEXT;
   ```

3. Migration'ı test et:
   ```bash
   npm run db:migrate
   ```

---

## 📋 Migration List / Migration Listesi

### 0001_initial_schema.sql
**Date / Tarih:** 2026-01-18  
**EN Description:** Initial database schema creation  
**TR Açıklama:** İlk veritabanı şeması oluşturulması

**Tables / Tablolar:**
- `users` - **EN:** User accounts / **TR:** Kullanıcı hesapları
- `escort_profiles` - **EN:** Escort profile information / **TR:** Escort profil bilgileri
- `escort_photos` - **EN:** Profile photos / **TR:** Profil fotoğrafları
- `conversations` - **EN:** Messaging conversations / **TR:** Mesajlaşma konuşmaları
- `messages` - **EN:** Individual messages / **TR:** Bireysel mesajlar
- `bookings` - **EN:** Appointment reservations / **TR:** Randevu rezervasyonları
- `reviews` - **EN:** Customer reviews / **TR:** Müşteri değerlendirmeleri
- `favorites` - **EN:** Favorite list / **TR:** Favori listesi
- `transactions` - **EN:** Credit/payment transactions / **TR:** Kredi/ödeme işlemleri
- `notifications` - **EN:** Notifications / **TR:** Bildirimler
- `vip_memberships` - **EN:** VIP membership tracking / **TR:** VIP üyelik takibi

### 0002_add_indexes.sql
**Date / Tarih:** 2026-01-18  
**EN Description:** Performance indexes for frequently queried columns  
**TR Açıklama:** Sık sorgulanan kolonlar için performance indexleri

**Index Categories / Index Kategorileri:**
- **EN:** Primary lookups (open_id, email, user_id) / **TR:** Birincil aramalar (open_id, email, user_id)
- **EN:** Search filters (city, district, status) / **TR:** Arama filtreleri (city, district, status)
- **EN:** Sorting (created_at, updated_at, rating) / **TR:** Sıralama (created_at, updated_at, rating)
- **EN:** Joins (foreign keys) / **TR:** Birleştirmeler (foreign keys)

---

## ⚠️ Important Notes / Önemli Notlar

**English:**
1. **Migration Order:** Migrations are executed sequentially based on the number in the filename
2. **Non-Reversible:** Due to SQLite limitations, some changes cannot be reversed
3. **Testing:** Always test new migrations in development environment first
4. **Backup:** Backup your database before running migrations in production

**Türkçe:**
1. **Migration Sırası:** Migration'lar dosya adındaki numaraya göre sırayla çalıştırılır
2. **Geri Alınamaz:** SQLite sınırlamaları nedeniyle bazı değişiklikler geri alınamaz
3. **Test:** Yeni migration'ları önce development ortamında test edin
4. **Yedek:** Production'da çalıştırmadan önce veritabanını yedekleyin

---

## 🔧 Migration Script / Migration Scripti

**English:**

The migration script (`scripts/migrate.ts`) provides the following functions:

- `npm run db:migrate` - Run pending migrations
- `npm run db:seed` - Add demo/test data
- `npm run db:reset` - Reset and recreate database

**Türkçe:**

Migration script (`scripts/migrate.ts`) şu işlevleri sunar:

- `npm run db:migrate` - Bekleyen migration'ları çalıştır
- `npm run db:seed` - Demo/test verilerini ekle
- `npm run db:reset` - Veritabanını sıfırla ve yeniden oluştur

---

## 📖 Resources / Kaynaklar

- [Drizzle ORM Migrations](https://orm.drizzle.team/docs/migrations)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
