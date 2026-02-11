# Proje Mimarisi: Zuhre Planet

Bu doküman, Zuhre Planet projesinin teknik mimarisini, kullanılan teknolojileri ve klasör yapısını detaylı bir şekilde açıklamaktadır.

## 1. Genel Bakış

Proje, modern bir **monorepo-benzeri** yapıya sahip, tam yığın (full-stack) bir TypeScript uygulamasıdır. Frontend (Vite + React) ve Backend (Node.js + tRPC) aynı proje altında geliştirilmiştir ve Docker ile kolayca canlıya alınabilir.

- **Frontend**: Vite tarafından derlenen, React tabanlı, yüksek performanslı bir Tek Sayfa Uygulaması (SPA).
- **Backend**: Node.js üzerinde çalışan, tRPC ile type-safe bir API sunan, Express tabanlı sunucu.
- **Veritabanı**: PostgreSQL, Drizzle ORM ile yönetilir.
- **Canlıya Alma (Deployment)**: Docker, Docker Compose ve Nginx (Reverse Proxy olarak) kullanılarak yapılır.

## 2. Teknoloji Stack'i

- **Dil**: TypeScript (Tüm projede)
- **Frontend**:
    - **Framework**: React 18
    - **Derleyici**: Vite
    - **Routing**: Wouter
    - **Styling**: Tailwind CSS
    - **UI Bileşenleri**: Radix UI, `shadcn/ui` (uyarlanmış)
    - **Animasyon**: Framer Motion
- **Backend**:
    - **Runtime**: Node.js
    - **Web Server**: Express.js
    - **API Framework**: tRPC (Type-safe API katmanı)
    - **Veritabanı ORM**: Drizzle ORM
    - **Kimlik Doğrulama**: JWT (JSON Web Tokens) & `bcryptjs`
- **Veritabanı**: PostgreSQL
- **Deployment**:
    - **Konteynerleştirme**: Docker & Docker Compose
    - **Web Sunucusu / Reverse Proxy**: Nginx

## 3. Klasör Yapısı

```
/
├── api/                  # Vercel gibi serverless ortamlar için tRPC handler
├── drizzle/              # Drizzle ORM migration ve seed dosyaları
├── public/               # Statik dosyalar (favicon, robots.txt)
├── src/
│   ├── components/       # Paylaşılan React bileşenleri (UI, Layout vb.)
│   ├── contexts/         # React Context'leri (Auth, Theme vb.)
│   ├── drizzle/          # Veritabanı şeması (schema.ts) ve istemci (db.ts)
│   ├── hooks/            # Özel React hook'ları (useChat vb.)
│   ├── lib/              # Yardımcı fonksiyonlar ve tRPC istemcisi (utils.ts, trpc.ts)
│   ├── pages/            # Ana sayfa bileşenleri ve rotalar
│   │   ├── customer/     # Müşteri paneli sayfaları
│   │   ├── dashboard/    # Escort paneli sayfaları
│   │   └── App.tsx       # Ana yönlendirici (Router)
│   ├── server/           # Backend kodu
│   │   ├── routers/      # tRPC router'ları (auth, escort, appointment vb.)
│   │   ├── context.ts    # tRPC context'i (veritabanı bağlantısı içerir)
│   │   ├── router.ts     # Ana tRPC router ve middleware'ler
│   │   └── server.ts     # Express sunucusunun giriş noktası (entry point)
│   ├── services/         # (Artık kullanılmıyor) Mock servisler
│   └── types/            # Global TypeScript tipleri
├── .env.example          # Gerekli ortam değişkenleri için şablon
├── Dockerfile            # Backend uygulamasını paketleyen Docker dosyası
├── docker-compose.yml    # Veritabanı, API ve Nginx'i yöneten Compose dosyası
├── nginx.conf            # Nginx için reverse proxy konfigürasyonu
├── package.json          # Proje bağımlılıkları ve script'leri
└── tsconfig.json         # TypeScript ana konfigürasyonu
└── tsconfig.server.json  # TypeScript backend derleme konfigürasyonu
```

## 4. Mimari Akışı

### 4.1. Geliştirme (Local) Ortamı

1.  Geliştirici, `docker-compose up` komutunu çalıştırarak PostgreSQL veritabanını başlatır.
2.  `npm run dev` komutu ile Vite geliştirme sunucusu (frontend) ve Node.js backend sunucusu (nodemon ile) aynı anda çalışır.
3.  Frontend, tarayıcıda `localhost:5173`'te, backend ise `localhost:3000`'de hizmet verir.
4.  Frontend, `localhost:3000/trpc` adresindeki tRPC API'sine istek atar.

### 4.2. Canlı (Production) Ortamı (VPS)

1.  `docker-compose up -d --build` komutu çalıştırılır.
2.  **`db` servisi**: PostgreSQL veritabanını bir Docker konteynerinde başlatır. Veriler, sunucuda kalıcı bir `volume`'da saklanır.
3.  **`api` servisi**: `Dockerfile`'ı kullanarak Node.js backend'ini derler, optimize eder ve bir konteyner içinde başlatır. Bu konteyner sadece kendi ağı (`escilan_network`) içinden erişilebilirdir.
4.  **`nginx` servisi**: Dış dünyaya açılan kapıdır (Port 80 ve 443).
    - `https://yourdomain.com/` adresine gelen istekleri, derlenmiş frontend dosyalarının (`/dist`) bulunduğu klasöre yönlendirir.
    - `https://yourdomain.com/api/*` adresine gelen istekleri, `api` servisine (backend) proxy'ler.
    - `https://yourdomain.com/ws` WebSocket bağlantılarını `api` servisine yönlendirir.
    - Let's Encrypt (Certbot) ile SSL sertifikalarını yönetir ve HTTPS trafiği sağlar.

Bu yapı, projenin hem geliştirme hem de canlıya alma süreçlerini standart, ölçeklenebilir ve güvenli hale getirir.