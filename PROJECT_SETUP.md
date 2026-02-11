# Geliştirme Ortamı Kurulum Rehberi

Bu rehber, Zuhre Planet projesini yerel geliştirme ortamınızda (localhost) kurmak ve çalıştırmak için gerekli adımları içerir.

## Ön Gereksinimler

- **Node.js**: v20 veya üzeri
- **npm**: v9 veya üzeri
- **Docker** ve **Docker Compose**: Konteynerleştirilmiş veritabanını çalıştırmak için.
- **Git**: Versiyon kontrolü için.

---

## Kurulum Adımları

### 1. Projeyi Klonlama

Projeyi bilgisayarınıza klonlayın ve proje dizinine gidin.

```bash
git clone [PROJE_GITHUB_URL] zuhre-planet
cd zuhre-planet
```

### 2. Bağımlılıkları Yükleme

Projenin tüm Node.js bağımlılıklarını `npm` kullanarak yükleyin.

```bash
npm install
```

### 3. Ortam Değişkenlerini Ayarlama

Projenin çalışması için gerekli olan veritabanı bağlantı bilgileri ve gizli anahtarlar gibi ortam değişkenlerini ayarlamanız gerekir.

`.env.example` dosyasını kopyalayarak `.env` adında yeni bir dosya oluşturun.

```bash
cp .env.example .env
```

Oluşturduğunuz `.env` dosyasını açıp içindeki değerleri kendi geliştirme ortamınıza göre düzenleyebilirsiniz. Genellikle yerel geliştirme için varsayılan değerler yeterlidir.

**Önemli Değişkenler:**
- `DATABASE_URL`: Docker Compose tarafından kullanılacak PostgreSQL bağlantı adresidir. Varsayılan haliyle bırakabilirsiniz.
- `JWT_SECRET`: Geliştirme ortamı için herhangi bir anahtar girebilirsiniz.

### 4. Veritabanını Başlatma

Proje, bir PostgreSQL veritabanı kullanır. Geliştirme ortamında bu veritabanını kolayca başlatmak için Docker Compose kullanıyoruz.

Aşağıdaki komutu çalıştırarak sadece veritabanı servisini (`db`) arka planda başlatın:

```bash
docker-compose up -d db
```

- `-d` (detached mode): Konteynerin terminali meşgul etmeden arka planda çalışmasını sağlar.

Veritabanı konteynerinin çalıştığını `docker ps` komutu ile kontrol edebilirsiniz. `escilan_db` isminde bir konteyner görmelisiniz.

### 5. Veritabanı Migration

Veritabanı şemasını (`src/drizzle/schema.ts`) veritabanına uygulamak için Drizzle migration komutunu çalıştırın.

```bash
npm run db:migrate
```

Bu komut, `drizzle/migrations` klasöründeki SQL dosyalarını çalıştırarak veritabanı tablolarını oluşturacaktır.

**(Opsiyonel) Veritabanını Demo Verilerle Doldurma:**

Eğer uygulamayı test etmek için başlangıç verilerine ihtiyacınız varsa, `seed` script'ini çalıştırabilirsiniz.

```bash
npm run db:seed
```

---

## Geliştirme Sunucusunu Çalıştırma

Tüm kurulum adımları tamamlandıktan sonra, hem frontend (Vite) hem de backend (tRPC/Express) geliştirme sunucularını aynı anda başlatmak için aşağıdaki komutu çalıştırın:

```bash
npm run dev
```

Bu komut şunları yapar:
- **Frontend:** `http://localhost:5173` adresinde Vite geliştirme sunucusunu başlatır. (Hot-Reloading aktif)
- **Backend:** `http://localhost:3000` adresinde Node.js sunucusunu `nodemon` gibi bir araçla izleyerek (watch mode) başlatır.

Artık tarayıcınızdan `http://localhost:5173` adresine giderek uygulamayı görüntüleyebilir ve geliştirmeye başlayabilirsiniz.

## Faydalı Komutlar

- **Testleri Çalıştır:** `npm test`
- **Frontend ve Backend'i Derle (Production için):** `npm run build`
- **Lint Kontrolü:** `npm run lint`
- **Veritabanını Sıfırla:** `npm run db:reset`