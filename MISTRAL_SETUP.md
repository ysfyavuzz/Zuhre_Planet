# 🤖 Mistral 7B Local Model - Adım Adım Kurulum

## 💻 Sizin Sistem
```
✅ 8 CPU Cores
✅ 16 GB RAM
✅ 157 GB Disk
✅ Intel UHD Graphics 620
```

---

## 🚀 5 Dakikalık Kurulum

### Adım 1: Ollama İndir (2 dakika)

**Windows:**
1. https://ollama.ai/download açın
2. "Download for Windows" tıkla
3. `OllamaSetup.exe` çalıştır
4. Kurulumu tamamla

**Doğrula:**
```bash
ollama --version
```

---

### Adım 2: Mistral Model İndir (10-15 dakika)

Terminal açın:
```bash
ollama pull mistral
```

**Çıktı:**
```
pulling manifest
pulling 5c90bcc78a97...
Success! Pulled mistral:latest
```

**Boyut:** ~4.1 GB (ilk defa)

---

### Adım 3: Sunucuyu Başlat

**Terminal 1:**
```bash
ollama serve
```

**Çıktı:**
```
Listening on 127.0.0.1:11434
```

🔴 **Bu terminal açık kalmalı!**

---

### Adım 4: Python Dependencies Kur

**Terminal 2:**
```bash
pip install -r cli/requirements.txt
```

---

### Adım 5: CLI Test Et

**Terminal 2:**
```bash
python cli/local-ai.py chat
```

**Terminalde:**
```
🤖 You: Merhaba, sen kimsin?

🤔 Assistant: 
Ben Mistral, bir yapay zeka asistanıyım. 
Sana kod yazmasında, sorular sormasında yardımcı olabilirim...

🤖 You: exit
👋 Goodbye!
```

---

## 📚 Komutlar

### Chat - Interaktif Sohbet
```bash
npm run local-ai
# veya
python cli/local-ai.py chat
```

### Kod Analizi
```bash
python cli/local-ai.py analyze
```

### Hata Düzeltme
```bash
python cli/local-ai.py fix "circular dependencies"
python cli/local-ai.py fix "database schema mismatch"
```

### Feature Oluşturma
```bash
python cli/local-ai.py feature "Canlı sohbet sistemi"
python cli/local-ai.py feature "3D avatar customization"
```

### Test Yazma
```bash
python cli/local-ai.py test "auth endpoints"
python cli/local-ai.py test "payment processing"
```

### Database Migration
```bash
python cli/local-ai.py schema "add user preferences"
python cli/local-ai.py schema "escort profile fields"
```

---

## 💡 Örnekler

### Örnek 1: Yeni Feature Geliştirme
```bash
python cli/local-ai.py feature "Kullanıcı videosu upload sistemi"
```

Çıktı:
- Database schema (Drizzle)
- tRPC router
- React component
- Type definitions
- Full integration code

### Örnek 2: Interactive Sohbet
```bash
npm run local-ai

🤖 You: Escort profili sayfası nasıl yapabilirim?

🤔 Assistant: İşte React bileşeni:
```typescript
export function EscortProfile() {
  return (
    <div>
      {/* profile code */}
    </div>
  );
}
```

🤖 You: 3D avatar nasıl eklerim?

🤔 Assistant: Three.js kullanarak...

🤖 You: exit
```

### Örnek 3: Hata Düzeltme
```bash
python cli/local-ai.py fix "TypeScript'te type error router.ts dosyasında"
```

Çıktı:
```
FILE: src/server/router.ts
```typescript
// Düzeltilmiş kod...
```
EXPLANATION: Circular dependency çözülüyor...
```

---

## ⚙️ Performans Ayarları

### Context Size Arttır (Daha Uzun Yanıtlar)
`cli/local-ai.py` dosyasında:
```python
"context_length": 8192,  # Varsayılan 4096
```

### Temperature Ayarla (Yaratıcılık)
```python
"temperature": 0.7,  # 0-1 arası, 1 = daha yaratıcı
```

### Top P Ayarla (Çeşitlilik)
```python
"top_p": 0.9,  # Daha düşük = daha focused
```

---

## 🐛 Sorun Giderme

### "Connection refused"
```
❌ Ollama sunucusu çalışmıyor!
```

**Çözüm:**
```bash
ollama serve
```

### Model Yavaş Çalışıyor
```
Hızlandırmak için:
1. Başka programları kapat
2. RAM'i boşalt
3. SSD kullan (HDD yavaş)
```

### CUDA Error (NVIDIA GPU varsa)
```bash
ollama list
# Cuda otomatik yüklenir
```

### Model Bellek Tüketiyor
```bash
# Ollama otomatik unload eder
# Veya manuel:
ollama list
# Ve başka model başlatmayın
```

---

## 📊 Model Seçenekleri

Değişmek isterseniz:

### Llama 2 7B (Benzer)
```bash
ollama pull llama2
# cli/local-ai.py dosyasında MODEL = "llama2" yap
```

### Neural Chat 7B (Türkçe daha iyi)
```bash
ollama pull neural-chat
```

### Mistral 8x7B (Daha güçlü, ama daha yavaş)
```bash
ollama pull mistral:medium
# ~26GB, 16GB RAM yetmez
```

---

## 🔐 Privacy & Security

✅ **Tümü Lokal:**
- Hiçbir veri internet'e gitmez
- Hiçbir API key gerekli değil
- Açık kaynak - kontrol altında
- NSFW kısıtlaması YOK

✅ **Adult Content:**
- Mistral 7B hiç bir kısıtlama yapmaz
- Tamamı explicitdir
- Production-ready

---

## ⏱️ Beklenen Performans

| Görev | Hız | CPU | RAM |
|-------|-----|-----|-----|
| Chat response | 30-60 sn | 80-90% | 8-10 GB |
| Code generation | 40-90 sn | 85-95% | 10-12 GB |
| Feature complete | 60-120 sn | 90-95% | 12-14 GB |

---

## 🎯 İyi Praksis

1. **Ollama sunucusu hep açık bırak**
   ```bash
   ollama serve
   ```

2. **Terminal'de Commands çalıştır**
   ```bash
   npm run local-ai
   # veya
   python cli/local-ai.py chat
   ```

3. **NSFW Content Sor**
   ```
   🤖 You: Adult website için escort profili API nasıl yapılır?
   (Mistral tam açıklama verir, hiçbir kısıtlama yok)
   ```

4. **Prompt İyileştir**
   ```
   Başarısız: "Profil sayfası yap"
   Başarılı: "React + TypeScript + tRPC + PostgreSQL kullanarak 
              escort profili sayfası kodu oluştur, database schema 
              ve component'leri içerir"
   ```

---

## 🚀 Workflow

### Terminal 1: AI Sunucusu
```bash
ollama serve
```

### Terminal 2: Development
```bash
# Sohbet
npm run local-ai

# veya Kod
npm run zuhre -- analyze

# veya Python CLI
python cli/local-ai.py feature "yeni feature"
```

### Terminal 3: Docker/Dev
```bash
docker compose up
npm run dev
```

---

## ✅ Kontrol Listesi

- [ ] Ollama indir: https://ollama.ai/download
- [ ] Mistral model: `ollama pull mistral`
- [ ] Sunucu test: `ollama serve`
- [ ] Python kur: `pip install -r cli/requirements.txt`
- [ ] CLI test: `npm run local-ai` veya `python cli/local-ai.py chat`
- [ ] Geliştirmeye başla!

---

## 🎓 Kaynaklar

- **Ollama Docs**: https://docs.ollama.ai
- **Mistral Docs**: https://docs.mistral.ai
- **Local LLM Guide**: https://localllm.ai

---

## 📞 Destek

```bash
# Tüm komutları görmek için:
python cli/local-ai.py help

# Versiyon kontrol:
ollama list
ollama version
```

---

**Artık kendi lokal AI'nız var!** 🎉

NSFW kısıtlaması yok, adult content support var, tamamen private.

Geliştirmeye başla! 🚀
