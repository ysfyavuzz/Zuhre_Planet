# ⚡ QUICK START - Local Mistral 7B + Zuhre Planet CLI

## 🎯 3 Komut = Başında Hazır

### Terminal 1: AI Sunucusunu Başlat
```bash
ollama serve
```
✅ Çıktı: `Listening on 127.0.0.1:11434`

### Terminal 2: Development
```bash
# OPTION A: Interactive Chat
npm run local-ai

# OPTION B: Direct Commands
python cli/local-ai.py feature "yeni özellik"
python cli/local-ai.py fix "hata açıklaması"
python cli/local-ai.py analyze
```

### Terminal 3: Docker Services
```bash
docker compose up
```

---

## 📋 Sık Komutlar

```bash
# Sohbet (en etkili)
npm run local-ai

# Kod analizi
python cli/local-ai.py analyze

# Feature geliştirme (full-stack)
python cli/local-ai.py feature "Canlı sohbet"

# Hata düzeltme
python cli/local-ai.py fix "type mismatch"

# Test yazma
python cli/local-ai.py test "auth endpoints"

# Database schema
python cli/local-ai.py schema "add fields"

# Help
python cli/local-ai.py help
```

---

## 🎓 Konuşma Örnekleri

### Örnek 1: Feature Geliştir
```bash
python cli/local-ai.py feature "Video upload sistemi - S3 integrations"
```
Çıktı: Kod, schema, router, component, types - hepsi!

### Örnek 2: Interactive Chat
```bash
npm run local-ai

🤖 You: Escort profili nasıl yapılır?
🤔 Assistant: React component, database schema...

🤖 You: 3D avatar ekle
🤔 Assistant: Three.js ile...

🤖 You: NSFW content handling
🤔 Assistant: (hiçbir kısıtlama yok - tam açıklama)
```

### Örnek 3: Hata Düzelt
```bash
python cli/local-ai.py fix "router.ts'de circular dependency"
```

---

## ✅ Kurulum Checklist

```bash
# 1. Ollama İndir
https://ollama.ai/download

# 2. Model İndir
ollama pull mistral

# 3. Dependencies
pip install -r cli/requirements.txt

# 4. Sunucuyu Başlat
ollama serve

# 5. Test Et
npm run local-ai
```

---

## 💪 Sistem Özellikleri

✅ **8 CPU, 16GB RAM, 157GB Disk** = Mistral 7B mükemmel!

| Kapasite | Durum |
|----------|-------|
| CPU | ✅ 8 cores → Yeterli |
| RAM | ✅ 16 GB → İdeal |
| Disk | ✅ 157 GB → Bol |
| GPU | ⚠️ Intel UHD → CPU OK |

---

## 🔐 Privacy & Features

✅ **Tamamen Local**
✅ **NSFW Kısıtlaması YOK**
✅ **Açık Kaynak**
✅ **Hiçbir API Key Gerekli Değil**
✅ **Adult Content Support**

---

## 🚨 Hızlı Çözümler

| Problem | Çözüm |
|---------|-------|
| "Connection refused" | `ollama serve` başlat |
| Model yavaş | Başka programları kapat |
| High RAM usage | Normal - Mistral 7B = 8-12GB |
| "model not found" | `ollama pull mistral` çalıştır |

---

## 📊 Komut Seçme Rehberi

```
Ne istiyorsun?

→ Sohbet / Soru sor
  npm run local-ai

→ Kod geliştir
  python cli/local-ai.py feature "..."

→ Hata bul / düzelt
  python cli/local-ai.py fix "..."

→ Test yaz
  python cli/local-ai.py test "..."

→ Database update
  python cli/local-ai.py schema "..."
```

---

## 🎯 Production Workflow

```
1. ollama serve (Terminal 1)

2. npm run local-ai (Terminal 2)
   🤖 You: Kullanıcı profili sayfası

3. docker compose up (Terminal 3)

4. Geliştir, test et, deploy et!
```

---

## 📚 Daha Fazla Info

- `MISTRAL_SETUP.md` - Detaylı kurulum
- `LOCAL_MODEL_SETUP.md` - Model konfigürasyonu
- `QUICKSTART.md` - Genel başlangıç
- `CLI_SETUP_GUIDE.md` - CLI detaylar

---

**Tamamı hazır! Başla!** 🚀

```bash
ollama serve
npm run local-ai
```
