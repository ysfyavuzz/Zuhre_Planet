# 🚀 Zuhre Planet - Gemini CLI Setup Guide

## Kurulum

CLI zaten kurulu! Sadece API key'lerini ekle.

## 1. API Keys Alma

### Anthropic (Claude API)
1. https://console.anthropic.com/ git
2. API Key oluştur
3. `.env` dosyasına ekle:
```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### Google (Gemini API - optional)
1. https://aistudio.google.com/app/apikeys git
2. API Key oluştur (Gemini 2.0 seç)
3. `.env` dosyasına ekle:
```env
GEMINI_API_KEY=your-gemini-key-here
```

## 2. CLI Komutları

### Code Analysis
```bash
npm run zuhre -- analyze
```
Kod yapısını analiz et, hataları bul, iyileştirme öner.

### Automatic Fixes
```bash
npm run zuhre -- fix "circular dependencies"
npm run zuhre -- fix "database schema"
npm run zuhre -- fix "type errors"
```
Sorunları otomatik düzelt ve kod öner.

### Feature Development
```bash
npm run zuhre -- feature "User messaging system"
npm run zuhre -- feature "Video upload"
npm run zuhre -- feature "Real-time notifications"
```
Yeni feature için tam stack kod oluştur:
- Database schema
- tRPC routers
- React components
- Type definitions

### Test Writing
```bash
npm run zuhre -- test "auth router"
npm run zuhre -- test "database operations"
npm run zuhre -- test "payment integration"
```
Test kodu otomatik yaz.

### Database Migrations
```bash
npm run zuhre -- schema
npm run zuhre -- schema "add user preferences"
```
Drizzle migrations oluştur ve çalıştır.

### Deployment Config
```bash
npm run zuhre -- deploy
npm run zuhre -- deploy "AWS ECS"
npm run zuhre -- deploy "DigitalOcean"
```
Production deployment config'i oluştur.

### Interactive Chat
```bash
npm run zuhre -- chat
```
Gemini'yle interaktif sohbet:
```
🤖 You: How do I implement a file upload endpoint?

🤔 Assistant: Here's a complete implementation...

🤖 You: How about error handling?

🤔 Assistant: For error handling...

Type 'exit' to quit
```

## 3. Global Command Setup

Daha kolay kullanım için:

```bash
npm link
```

Sonra global olarak kullan:

```bash
zuhre analyze
zuhre fix "database schema"
zuhre feature "New feature"
zuhre chat
```

## 4. Workflow Örneği

Gerçek bir geliştirme senaryosu:

### 1️⃣ Yeni Feature Planı
```bash
npm run zuhre -- feature "User profile customization"
```

### 2️⃣ Kod Review
```bash
npm run zuhre -- analyze
```

### 3️⃣ Test Yazma
```bash
npm run zuhre -- test "user profile endpoints"
```

### 4️⃣ Database Schema
```bash
npm run zuhre -- schema "add user preferences table"
```

### 5️⃣ Deployment Ready
```bash
npm run zuhre -- deploy
```

## 5. CI/CD Integration

GitHub Actions'ta kullan:

```yaml
- name: Code Analysis
  run: npm run zuhre -- analyze > analysis.txt

- name: Generate Tests
  run: npm run zuhre -- test "new-feature"

- name: Check Schema
  run: npm run zuhre -- schema --validate
```

## 6. Troubleshooting

### "Cannot find module @anthropic-ai/sdk"
```bash
npm install --save-dev @anthropic-ai/sdk
```

### API Key Errors
```bash
# .env dosyasının doğru olduğunu kontrol et
cat .env | grep API_KEY

# API key'i test et
npm run zuhre -- chat
```

### Permission Denied
```bash
chmod +x bin/zuhre.js
```

## 7. Dosya Yapısı

```
project/
├── cli/
│   └── zuhre-cli.ts          # Main CLI tool
├── bin/
│   └── zuhre.js              # Global bin entry
├── agents/
│   └── multi-agent.ts        # Multi-agent system
└── .env                       # API keys (git ignore!)
```

## 8. Kullanılabilir Prompts

Terminal'de örnek komutlar:

```bash
# Full feature development
zuhre feature "Add 3D avatar customization"

# Fix specific issues
zuhre fix "type mismatch in auth router"
zuhre fix "optimize large bundle size"
zuhre fix "database connection pooling"

# Schema operations
zuhre schema "migrate users to new structure"

# Testing
zuhre test "WebSocket connections"
zuhre test "payment processing"

# Deployment
zuhre deploy "Docker Swarm"
zuhre deploy "Kubernetes cluster"

# Interactive development
zuhre chat  # Multi-turn conversation
```

## 9. Tips & Tricks

1. **Long-running operations**: Chat mode'u kullan longer context için
2. **Code snippets**: `fix` ve `feature` commands'dan çıktı direkt dosyaya yazabilirsin
3. **Schema changes**: Test ortamında `schema` command'ı çalıştır önce
4. **Team collaboration**: Output'ları team'le paylaş PR'da

## 10. Sonraki Adımlar

- [ ] API key'lerini `.env`'ye ekle
- [ ] `npm run zuhre -- help` ile tüm komutları göz at
- [ ] İlk feature'u `zuhre feature` ile oluştur
- [ ] Test yaz `zuhre test` ile
- [ ] Deploy config oluştur `zuhre deploy` ile

---

**Artık AI-powered development workflow'un hazır!** 🚀

Her kod değişikliği, yeni feature, hata düzeltme veya deployment işini kolaylaştır.

Let me know if you need anything else!
