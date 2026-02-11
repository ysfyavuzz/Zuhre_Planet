# 🚀 Deployment (Yayınlama) Rehberi

Bu dokümantasyon, Zuhre Planet projesini production ortamına deploy etmek için gereken tüm adımları ve konfigürasyonları içerir.

---

## 📋 İçindekiler

- [Environment Variables](#-environment-variables)
- [Vercel Deployment](#-vercel-deployment)
- [Netlify Deployment](#-netlify-deployment)
- [Docker Deployment](#-docker-deployment)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Production Checklist](#-production-checklist)
- [Troubleshooting](#-troubleshooting)

---

## 🔐 Environment Variables

### Gerekli Environment Variables

Production ortamında aşağıdaki environment variables'ların tanımlanması zorunludur:

```env
# === UYGULAMA ===
VITE_APP_NAME=Zuhre Planet
VITE_APP_URL=https://your-domain.com
VITE_APP_ENV=production

# === DATABASE (LibSQL/Turso) ===
DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token

# === ÖDEME (iyzico) ===
VITE_IYZICO_API_KEY=your-iyzico-api-key
VITE_IYZICO_SECRET_KEY=your-iyzico-secret-key
VITE_IYZICO_BASE_URL=https://api.iyzipay.com

# === EMAIL (SMTP) ===
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@your-domain.com

# === AUTHENTICATION ===
JWT_SECRET=your-super-secret-jwt-key-change-this-minimum-32-chars
JWT_EXPIRES_IN=7d

# === ANALYTICS (Opsiyonel) ===
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

### Environment Variable Detayları

| Variable | Açıklama | Örnek |
|----------|----------|-------|
| `VITE_APP_NAME` | Uygulama adı | `Zuhre Planet` |
| `VITE_APP_URL` | Production domain | `https://example.com` |
| `VITE_APP_ENV` | Ortam tipi | `production` |
| `DATABASE_URL` | Turso database URL'i | `libsql://db.turso.io` |
| `TURSO_AUTH_TOKEN` | Turso auth token | `eyJ...` |
| `VITE_IYZICO_API_KEY` | İyzico API key | `sandbox-xxx` |
| `VITE_IYZICO_SECRET_KEY` | İyzico secret key | `sandbox-yyy` |
| `JWT_SECRET` | JWT şifreleme anahtarı (min 32 karakter) | `your-random-32-char-secret` |
| `SMTP_HOST` | Email SMTP sunucusu | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | Email kullanıcı adı | `noreply@example.com` |
| `SMTP_PASS` | Email şifresi/app password | `xxxx xxxx xxxx xxxx` |

### Local Development (.env.local)

Development için `.env.local` dosyası oluşturun:

```bash
cp .env.example .env.local
```

### Security Best Practices

- ✅ **Asla `.env` dosyasını git'e commit etmeyin**
- ✅ JWT_SECRET minimum 32 karakter olmalı
- ✅ Production'da test/sandbox credentials kullanmayın
- ✅ Email app password kullanın (gerçek şifre değil)
- ✅ Sensitive değerleri environment variable olarak saklayın
- ✅ `.env.example` dosyasını güncel tutun (değerler olmadan)

---

## 🟢 Vercel Deployment

Vercel, React/Vite projeleri için en hızlı ve kolay deployment platformudur. Otomatik SSL, CDN ve CI/CD sunar.

### Adım 1: Vercel Hesabı Oluşturma

1. [vercel.com](https://vercel.com) adresine gidin
2. GitHub hesabınızla giriş yapın
3. Repository'nize erişim izni verin

### Adım 2: Proje İçe Aktarma

```bash
# Vercel CLI kurulumu (opsiyonel)
npm i -g vercel

# Vercel'e giriş yapın
vercel login

# Projeyi import edin
vercel
```

**Web UI üzerinden:**

1. Vercel Dashboard → "Add New Project"
2. GitHub repository seçin
3. Framework Preset: `Vite` seçin
4. Root Directory: `./` (varsayılan)
5. Build Command: `npm run build`
6. Output Directory: `dist`

### Adım 3: Environment Variables Ekleme

**Dashboard üzerinden:**

1. Project Settings → Environment Variables
2. Yukarıdaki tüm environment variables'ları ekleyin
3. **Production**, **Preview**, **Development** ortamlarını seçin
4. "Save" butonuna tıklayın

**CLI üzerinden:**

```bash
vercel env add VITE_APP_URL
# Değeri girin ve ortam seçin (production, preview, development)
```

### Adım 4: Deployment Konfigürasyonu (vercel.json)

Proje kökünde `vercel.json` zaten mevcut:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "outputDirectory": "dist",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Adım 5: Deploy

```bash
# Production deploy
vercel --prod

# Preview deploy (test için)
vercel
```

### Adım 6: Custom Domain Ekleme

1. Vercel Dashboard → Project → Settings → Domains
2. Domain adınızı girin (örn: `example.com`)
3. DNS kayıtlarını domain provider'ınızda ayarlayın:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

4. SSL otomatik olarak aktif edilir (Let's Encrypt)

### Vercel Deployment Avantajları

- ✅ Otomatik SSL/HTTPS
- ✅ Global CDN (edge network)
- ✅ Otomatik CI/CD (git push = auto deploy)
- ✅ Preview deployments (her PR için)
- ✅ Rollback desteği
- ✅ Analytics ve monitoring
- ✅ Serverless functions desteği

---

## 🔵 Netlify Deployment

Netlify, Vercel'e alternatif olarak kullanılabilecek bir platformdur.

### Adım 1: Netlify Hesabı Oluşturma

1. [netlify.com](https://netlify.com) adresine gidin
2. GitHub hesabınızla giriş yapın
3. "Add new site" → "Import an existing project"

### Adım 2: Build Settings

```
Build command: npm run build
Publish directory: dist
```

### Adım 3: netlify.toml Konfigürasyonu

Proje kökünde `netlify.toml` zaten mevcut:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### Adım 4: Environment Variables

1. Site Settings → Environment Variables
2. Tüm environment variables'ları ekleyin
3. "Save" butonuna tıklayın

### Adım 5: Deploy

```bash
# Netlify CLI kurulumu
npm i -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

### Netlify Forms (Bonus)

Contact formları için Netlify Forms kullanabilirsiniz (built-in):

```html
<form name="contact" method="POST" data-netlify="true">
  <input type="text" name="name" />
  <input type="email" name="email" />
  <textarea name="message"></textarea>
  <button type="submit">Gönder</button>
</form>
```

---

## 🐳 Docker Deployment

Docker ile containerized deployment yapabilirsiniz.

### Dockerfile

Proje kökünde `Dockerfile` zaten mevcut:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source
COPY . .

# Build
RUN npm run build

# Production image
FROM nginx:alpine

# Copy build files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Docker Build & Run

```bash
# Build image
docker build -t escort-platform:latest .

# Run container
docker run -d \
  -p 80:80 \
  --name escort-platform \
  -e DATABASE_URL="libsql://your-db.turso.io" \
  -e TURSO_AUTH_TOKEN="your-token" \
  escort-platform:latest

# Check logs
docker logs escort-platform

# Stop container
docker stop escort-platform

# Remove container
docker rm escort-platform
```

### Docker Compose (docker-compose.yml)

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "80:80"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - TURSO_AUTH_TOKEN=${TURSO_AUTH_TOKEN}
      - JWT_SECRET=${JWT_SECRET}
      - VITE_IYZICO_API_KEY=${VITE_IYZICO_API_KEY}
      - VITE_IYZICO_SECRET_KEY=${VITE_IYZICO_SECRET_KEY}
      - SMTP_HOST=${SMTP_HOST}
      - SMTP_PORT=${SMTP_PORT}
      - SMTP_USER=${SMTP_USER}
      - SMTP_PASS=${SMTP_PASS}
    restart: unless-stopped
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

**Çalıştırma:**

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Rebuild
docker-compose up -d --build
```

### Docker Hub'a Push

```bash
# Tag image
docker tag escort-platform:latest yourusername/escort-platform:v1.0.0

# Login to Docker Hub
docker login

# Push image
docker push yourusername/escort-platform:v1.0.0
```

---

## ⚙️ CI/CD Pipeline

### GitHub Actions (Önerilen)

`.github/workflows/deploy.yml` dosyası oluşturun:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
  
  build:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_APP_URL: ${{ secrets.VITE_APP_URL }}
          VITE_IYZICO_API_KEY: ${{ secrets.VITE_IYZICO_API_KEY }}
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist/
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### GitHub Secrets Ekleme

1. GitHub Repository → Settings → Secrets and Variables → Actions
2. "New repository secret" butonuna tıklayın
3. Gerekli secrets'ları ekleyin:

```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
VITE_APP_URL
DATABASE_URL
TURSO_AUTH_TOKEN
JWT_SECRET
VITE_IYZICO_API_KEY
VITE_IYZICO_SECRET_KEY
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASS
```

### CI/CD Pipeline Açıklaması

**Test Job:**
1. Kodu checkout eder
2. Node.js 18 kurar
3. Dependencies yükler
4. Linter çalıştırır
5. Test suite'i çalıştırır
6. Coverage raporu yükler

**Build Job:**
1. Test job başarılı olduktan sonra çalışır
2. Production build oluşturur
3. Build artifacts'ı yükler

**Deploy Job:**
1. Sadece `main` branch'e push olduğunda çalışır
2. Build artifacts'ı indirir
3. Vercel'e deploy eder

---

## ✅ Production Checklist

### Pre-Deployment

- [ ] **Environment Variables** tüm platformlarda ayarlandı
- [ ] **Database migrations** production database'e çalıştırıldı
- [ ] **Database seed** (gerekirse) production data ile dolduruldu
- [ ] **İyzico production credentials** alındı ve ayarlandı
- [ ] **SMTP email** yapılandırması test edildi
- [ ] **JWT_SECRET** güçlü ve unique (min 32 karakter)
- [ ] **Test suite** %100 geçiyor (`npm test`)
- [ ] **E2E testler** başarılı (`npm run test:e2e`)
- [ ] **Build** başarılı (`npm run build`)
- [ ] **Linter** hatasız (`npm run lint`)
- [ ] **TypeScript** hatasız (`tsc --noEmit`)

### Security

- [ ] **CSP headers** aktif (vercel.json/netlify.toml)
- [ ] **SSL/HTTPS** sertifikası aktif
- [ ] **Security headers** yapılandırıldı
- [ ] **Rate limiting** aktif ve test edildi
- [ ] **XSS koruma** utilities kullanılıyor
- [ ] **SQL injection** koruması aktif
- [ ] **Input sanitization** tüm formlarda uygulandı
- [ ] **CSRF token** implementasyonu doğrulandı
- [ ] **Sensitive data** environment variables'da
- [ ] **`.env` dosyası** `.gitignore`'da

### Performance

- [ ] **Bundle size** optimize edildi (<%200kB gzip)
- [ ] **Code splitting** implementasyonu doğrulandı
- [ ] **Lazy loading** route'lar için aktif
- [ ] **Image optimization** yapıldı
- [ ] **Gzip/Brotli** compression aktif
- [ ] **Cache headers** doğru ayarlandı
- [ ] **CDN** kullanılıyor (Vercel/Netlify)

### Monitoring & Analytics

- [ ] **Google Analytics** entegre edildi (opsiyonel)
- [ ] **Sentry** error tracking kuruldu (opsiyonel)
- [ ] **Performance monitoring** aktif
- [ ] **Uptime monitoring** ayarlandı
- [ ] **Log aggregation** yapılandırıldı

### SEO

- [ ] **robots.txt** production'da doğru
- [ ] **sitemap.xml** güncel
- [ ] **Meta tags** tüm sayfalarda mevcut
- [ ] **Open Graph** tags ayarlandı
- [ ] **Canonical URLs** doğru
- [ ] **SSL redirect** (http → https) aktif

### Post-Deployment

- [ ] **Manual testing** production'da yapıldı
- [ ] **Payment flow** test edildi (sandbox)
- [ ] **Email delivery** test edildi
- [ ] **Mobile responsive** test edildi
- [ ] **Cross-browser testing** yapıldı
- [ ] **Performance audit** (Lighthouse) çalıştırıldı
- [ ] **Security scan** yapıldı
- [ ] **Backup strategy** oluşturuldu
- [ ] **Rollback plan** hazırlandı
- [ ] **Documentation** güncellendi

---

## 🔧 Troubleshooting

### Build Hataları

#### Problem: "Cannot find module" hatası

```bash
# Solution 1: node_modules temizle
rm -rf node_modules package-lock.json
npm install

# Solution 2: Cache temizle
npm cache clean --force
npm install
```

#### Problem: TypeScript compilation hatası

```bash
# TypeScript hatalarını kontrol et
tsc --noEmit

# tsconfig.json'ı kontrol et
```

#### Problem: Vite build memory hatası

```bash
# Node memory limitini artır
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

### Environment Variables

#### Problem: Environment variables çalışmıyor

```bash
# .env.local dosyasının olduğundan emin olun
ls -la .env*

# VITE_ prefix'i kontrol edin (client-side için gerekli)
# ✅ VITE_APP_URL=...
# ❌ APP_URL=...

# Server restart edin
npm run dev
```

#### Problem: Production'da farklı değerler

- Vercel/Netlify dashboard'da environment variables'ı kontrol edin
- Ortam seçimini kontrol edin (Production/Preview/Development)
- Deploy sonrası environment değişikliği varsa yeniden deploy edin

### Database

#### Problem: Database connection hatası

```bash
# Turso CLI ile bağlantıyı test edin
turso db show your-database-name

# Auth token'ı kontrol edin
echo $TURSO_AUTH_TOKEN

# DATABASE_URL formatını kontrol edin
# ✅ libsql://your-db.turso.io
# ❌ https://your-db.turso.io
```

#### Problem: Migration hataları

```bash
# Mevcut migration durumunu kontrol et
npm run db:status

# Migration'ları sıfırla (dikkatli!)
npm run db:reset

# Yeniden migrate et
npm run db:migrate
```

### Deployment

#### Problem: Vercel deployment başarısız

```bash
# Logs kontrol edin
vercel logs

# Build command'ı kontrol edin
# vercel.json > buildCommand

# Output directory'yi kontrol edin
# vercel.json > outputDirectory: "dist"
```

#### Problem: 404 hatası (routing çalışmıyor)

**Vercel:**
- `vercel.json` içinde rewrites kontrol edin
- `"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]`

**Netlify:**
- `netlify.toml` içinde redirects kontrol edin
- `[[redirects]]` bölümünü kontrol edin

**Nginx:**
- `try_files $uri $uri/ /index.html;` olmalı

### Performance

#### Problem: Yavaş sayfa yükleme

```bash
# Bundle size kontrol et
npm run build

# Lighthouse audit çalıştır
# Chrome DevTools > Lighthouse

# Bundle analyzer kullan
npm install -D rollup-plugin-visualizer
```

**Çözümler:**
- Code splitting kullan (lazy loading)
- Image optimization yap
- Unused dependencies kaldır
- Tree shaking aktif olduğundan emin ol

### SSL/HTTPS

#### Problem: SSL sertifikası hatası

**Vercel/Netlify:**
- Otomatik SSL aktif olmalı
- Domain DNS ayarlarını kontrol edin
- 24-48 saat bekleyin (DNS propagation)

**Custom server:**
```bash
# Let's Encrypt ile SSL kurulumu
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Email

#### Problem: Email gönderilmiyor

```bash
# SMTP ayarlarını test edin
# Gmail için App Password kullanın (gerçek şifre değil)

# Port 587 (TLS) veya 465 (SSL) kullanın
# Port 25 birçok hosting'de kapalıdır
```

**Gmail App Password oluşturma:**
1. Google Account → Security
2. 2-Step Verification aktif olmalı
3. App Passwords oluştur
4. "Mail" ve "Other" seç
5. Oluşturulan şifreyi `SMTP_PASS` olarak kullan

### Payment (İyzico)

#### Problem: Payment callback 404

```bash
# Callback URL'ini kontrol edin
# İyzico dashboard'da kayıtlı olmalı

# Production'da:
https://yourdomain.com/payment/callback

# Test için ngrok kullanın:
ngrok http 3000
```

#### Problem: 3D Secure çalışmıyor

- İyzico sandbox/production credentials doğru mu?
- Callback URL doğru mu?
- Browser console'da hata var mı?

---

## 📞 Destek

Deployment sürecinde sorun yaşarsanız:

1. **Loglara bakın**: `vercel logs` veya `netlify logs`
2. **Documentation**: Bu dokümanı kontrol edin
3. **GitHub Issues**: Proje repository'sinde issue açın
4. **Community**: Vercel/Netlify Discord/Forum

---

## 🎉 Başarılı Deployment!

Tüm adımları tamamladıysanız, projeniz artık production'da live! 🚀

**Kontrol Listesi:**
- ✅ Site erişilebilir (SSL aktif)
- ✅ Authentication çalışıyor
- ✅ Database bağlantısı aktif
- ✅ Email gönderimi çalışıyor
- ✅ Payment flow test edildi
- ✅ Monitoring aktif

**Sonraki Adımlar:**
1. Performance monitoring kurun
2. Regular backups yapılandırın
3. Uptime monitoring ekleyin
4. Analytics verileri takip edin
5. User feedback toplayın

---

**Dokümantasyon Versiyonu:** v1.0.0
**Son Güncelleme:** Ocak 2026
**Proje Versiyonu:** v4.1.0
