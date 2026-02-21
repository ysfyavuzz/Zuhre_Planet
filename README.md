# 🌐 Zuhre Planet - Escort Platform

**Modern, Type-Safe Escort Management Platform**

---

## 📁 Klasör Yapısı

```
zuhre-planet/
│
├── 📂 src/                   ← Tüm kaynak kodlar
│   ├── client/               (React Frontend)
│   ├── server/               (Express/tRPC Backend)
│   └── components/           (React Bileşenleri)
│
├── 📂 public/                ← Static dosyalar
├── 📂 api/                   ← API endpoints
├── 📂 cli/                   ← Command Line Interface
├── 📂 drizzle/               ← Database migrations
├── 📂 tests/                 ← Test dosyaları
├── 📂 scripts/               ← Build scripts
├── 📂 uploads/               ← User uploads (Resimler)
│
├── 📄 Dockerfile             ← Docker image
├── 📄 package.json           ← Dependencies
├── 📄 tsconfig.json          ← TypeScript config
├── 📄 vite.config.ts         ← Vite config
└── 📄 drizzle.config.ts      ← Database config
```

---

## 🚀 Başlangıç

### Kurulum
```bash
cd D:\Projeler\Zuhre_Planet
npm install
```

### Geliştirme
```bash
npm run dev
```

### Docker
```bash
docker build -t zuhre_planet-api .
docker-compose up -d
```

---

## 📚 Teknik Stack

- **Frontend:** React 18 + TypeScript
- **Backend:** Express + tRPC
- **Database:** PostgreSQL + Drizzle ORM
- **Build:** Vite
- **Testing:** Jest + Playwright
- **Container:** Docker

---

## 🔑 Ana Dosyalar

| Dosya | Amaç |
|-------|------|
| `package.json` | Dependencies |
| `Dockerfile` | Container image |
| `.env.example` | Environment template |
| `src/` | Tüm kodlar |

---

**Temiz ve hazır proje yapısı** ✅
