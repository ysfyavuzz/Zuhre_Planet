# Zuhre Planet

**Zuhre Planet**, modern teknolojilerle geliştirilmiş, yüksek performanslı ve ölçeklenebilir bir "Yetişkin İlan ve Randevu" platformudur. Bu proje, hem son kullanıcılar (müşteriler) hem de hizmet sağlayıcılar (escortlar) için zengin özelliklere sahip, güvenli ve type-safe bir ortam sunar.

![Proje Önizlemesi](https://i.imgur.com/gI2Fz1i.png) <!-- TODO: Gerçek bir ekran görüntüsü ekle -->

---

## ✨ Temel Özellikler

- **Modüler Müşteri & Escort Panelleri:** Rol bazlı (Admin, Escort, Müşteri) tamamen ayrılmış, modern ve kullanışlı arayüzler.
- **Canlı Mesajlaşma (Live Chat):** WebSocket tabanlı, gerçek zamanlı sohbet sistemi.
- **Gelişmiş İlan Listeleme:** Filtreleme, sıralama ve arama özelliklerine sahip dinamik ilan kataloğu.
- **Randevu Yönetim Sistemi:** Kullanıcıların randevu oluşturmasını, takip etmesini ve yönetmesini sağlayan tam teşekküllü bir sistem.
- **Cüzdan ve Kredi Sistemi:** Kullanıcıların bakiye yükleyip harcama yapabildiği entegre cüzdan.
- **Değerlendirme ve Puanlama:** Güvenilirliği artıran, randevu sonrası değerlendirme ve puanlama sistemi.
- **Type-Safe API:** Frontend ve backend arasında tam tip güvenliği sağlayan tRPC katmanı.
- **Docker ile Kolay Kurulum:** Tek komutla tüm altyapıyı (Veritabanı, API, Web Sunucusu) canlıya alma imkanı.

## 🚀 Teknoloji Stack'i

- **Frontend**: React, Vite, TypeScript, Wouter, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, tRPC, Drizzle ORM, JWT, Bcrypt
- **Veritabanı**: PostgreSQL
- **Deployment**: Docker, Docker Compose, Nginx

## 📂 Proje Dokümanları

Projenin yapısını ve kurulum süreçlerini anlamak için aşağıdaki dokümanları inceleyebilirsiniz:

- **[Mimari Dokümanı (`ARCHITECTURE.md`)](ARCHITECTURE.md):** Projenin teknik mimarisini, klasör yapısını ve teknoloji seçimlerini detaylıca öğrenin.
- **[Kurulum Rehberi (`PROJECT_SETUP.md`)](PROJECT_SETUP.md):** Geliştirme ortamınızı yerel makinenizde nasıl kuracağınızı öğrenin.
- **[Canlıya Alma Rehberi (`DEPLOYMENT.md`)](DEPLOYMENT.md):** Projeyi bir VPS sunucusunda nasıl canlıya alacağınızı adım adım öğrenin.

---

## 🏁 Hızlı Başlangıç

### Geliştirme Ortamı

1.  **Projeyi klonlayın:**
    ```bash
    git clone [PROJE_GITHUB_URL] zuhre-planet
    cd zuhre-planet
    ```

2.  **Bağımlılıkları yükleyin:**
    ```bash
    npm install
    ```

3.  **Ortam değişkenlerini ayarlayın:**
    ```bash
    cp .env.example .env
    # .env dosyasını kendi ayarlarınızla düzenleyin
    ```

4.  **Docker ile veritabanını başlatın:**
    ```bash
    docker-compose up -d db
    ```

5.  **Veritabanı migration'larını çalıştırın:**
    ```bash
    npm run db:migrate
    ```

6.  **Geliştirme sunucusunu başlatın:**
    ```bash
    npm run dev
    ```

Uygulamanız artık `http://localhost:5173` adresinde çalışıyor olacak.

### Canlı Ortam (Production)

Detaylı talimatlar için lütfen **[Canlıya Alma Rehberi (`DEPLOYMENT.md`)](DEPLOYMENT.md)** dokümanını takip edin.

---

## 🤝 Katkıda Bulunma

Bu projeye katkıda bulunmak isterseniz, lütfen [CONTRIBUTING.md](CONTRIBUTING.md) dosyasını inceleyin.

## 📝 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakınız.