# 🚀 Mistral 7B Local Model Setup Guide

## NSFW Kısıtlaması Olmayan, Local AI Model Kurulumu

### Sistem Özellikleri (Sizin)
```
✅ 8 CPU Cores
✅ 16 GB RAM
✅ 157 GB Disk
✅ Intel UHD Graphics 620
```

### Seçilen Model: Mistral 7B
```
✅ Açık kaynak
✅ NSFW kısıtlaması YOK
✅ 16GB RAM'e mükemmel
✅ Yüksek kalite output
✅ Hızlı işleme
```

---

## 📥 Adım 1: Ollama Kur

### Windows
1. https://ollama.ai/download git
2. "Download for Windows" tıkla
3. `.exe` dosyasını çalıştır
4. Kurulumu tamamla

### Kurulumu Doğrula
```bash
ollama --version
```

---

## 📦 Adım 2: Mistral 7B Model İndir

Ollama başladıktan sonra terminal'de:

```bash
ollama pull mistral
```

**Burası zaman alacak** (~4.1GB download, ~10-15 dakika)

İndir tamamlanırsa:
```
Success! Pulled mistral:latest
```

---

## ✅ Adım 3: Model'i Test Et

```bash
ollama run mistral
```

Terminal'de:
```
>>> Merhaba, sen kimsin?
I am Mistral, an AI assistant...

>>> Kullanıcı profili sayfası nasıl yapabilirim?
Here's a complete example...

>>> exit
```

---

## 🔌 Adım 4: CLI'ye Entegre Et

Zuhre Planet CLI'yi Mistral ile kullan:

### A. Local API Server Başlat

Terminal 1'de:
```bash
ollama serve
```

Çıktı:
```
Listening on 127.0.0.1:11434
```

### B. CLI'yi Güncelle

`cli/zuhre-cli.ts` dosyasında, Anthropic client'i yerine Ollama kullan:

```typescript
// Ollama endpoint
const OLLAMA_API = process.env.OLLAMA_API || "http://127.0.0.1:11434";
```

### C. Yeni CLI Komut Ekle

Terminal 2'de:
```bash
npm run zuhre -- local-chat
```

---

## 🎯 Kullanım

### Terminal 1: Model Çalıştır
```bash
ollama serve
```

### Terminal 2: CLI Kullan
```bash
# Chat mode
npm run zuhre -- chat

# Kod analizi
npm run zuhre -- analyze

# Feature geliştirme
npm run zuhre -- feature "yeni özellik"
```

---

## 📊 Alternatif Modeller

### Llama 2 7B
```bash
ollama pull llama2
```

### Neural Chat 7B
```bash
ollama pull neural-chat
```

### OpenHermes 2.5
```bash
ollama pull openhermes
```

### Tüm Modelleri Görmek
```bash
ollama list
```

---

## ⚡ Performans Optimizasyonu

### Ollama Context Size Arttır
```bash
# Model'i 8192 token context ile çalıştır
ollama run mistral --context-size 8192
```

### GPU Kullan (Eğer NVIDIA varsa)
```bash
# CUDA desteği ile
# Ollama otomatik CUDA bulur
```

### RAM Yönetimi
```bash
# Arka planda birden fazla model çalıştırmayın
# Ollama otomatik unload eder eski modelleri
```

---

## 📝 Docker ile Ollama

Alternatif: Docker container'da çalıştır

```bash
docker run -d -v ollama:/root/.ollama -p 11434:11434 ollama/ollama
```

Sonra model çek:
```bash
docker exec <container-id> ollama pull mistral
```

---

## 🔗 CLI Integration Script

`cli/ollama-setup.ts` oluştur:

```typescript
import fetch from 'node-fetch';

const OLLAMA_API = "http://127.0.0.1:11434/api/generate";

export async function askMistral(prompt: string): Promise<string> {
  const response = await fetch(OLLAMA_API, {
    method: "POST",
    body: JSON.stringify({
      model: "mistral",
      prompt: prompt,
      stream: true,
    }),
  });

  let result = "";
  for await (const chunk of response.body) {
    const line = chunk.toString();
    if (line) {
      const json = JSON.parse(line);
      result += json.response;
      process.stdout.write(json.response);
    }
  }
  return result;
}

// Kullanım:
// const answer = await askMistral("Escort profili sayfası nasıl yapılır?");
```

---

## 🎓 Mistral 7B Özellikleri

✅ **Strengths:**
- NSFW kısıtlaması YOK
- Hızlı inference
- Düşük resource kullanımı
- İyi code generation
- Turkish dil desteği

⚠️ **Limitations:**
- Llama 2 13B kadar detaylı değil
- Bazen repetitif olabilir
- Context window 8192 token

---

## 📊 Beklenen Performans

| Görev | Hız | Kalite |
|-------|-----|--------|
| Code generation | ⚡⚡⚡ Çok hızlı | ⭐⭐⭐⭐ İyi |
| Q&A | ⚡⚡⚡ Çok hızlı | ⭐⭐⭐⭐ İyi |
| Summarization | ⚡⚡⚡ Çok hızlı | ⭐⭐⭐⭐ İyi |
| Creative writing | ⚡⚡ Hızlı | ⭐⭐⭐⭐ İyi |
| Analysis | ⚡⚡ Hızlı | ⭐⭐⭐ Orta |

---

## 🚀 Tavsiye Edilen Workflow

### 1. Ollama Başlat
```bash
ollama serve
```

### 2. Model Çalıştır
```bash
ollama run mistral
```

### 3. CLI ile Kullan
```bash
npm run zuhre -- local-chat
```

### 4. Requests Yapıştır
```
>>> Zuhre Planet'e yeni 3D avatar sistemi nasıl ekleyebilirim?
```

---

## 💡 NSFW Content Handling

Mistral 7B'nin NSFW kısıtlaması yoktur:

```
>>> Adult website için uygun prompts yazabilir misin?
(Mistral hiç bir kısıtlama yapmadan cevaplar)
```

Bunu kontrol etmek isterseniz:
```bash
# Moderasyon ekle (opsiyonel)
# Openai Moderation API yerine local model kullan
```

---

## 📚 Kaynaklar

- **Ollama**: https://ollama.ai
- **Mistral**: https://mistral.ai
- **Model Docs**: https://docs.ollama.ai

---

## ✅ Kontrol Listesi

- [ ] Ollama indir ve kur
- [ ] `ollama pull mistral` çalıştır
- [ ] `ollama serve` başlat (Terminal 1)
- [ ] `ollama run mistral` test et
- [ ] CLI'ye entegre et
- [ ] `npm run zuhre -- chat` kullan

---

## 🎉 Hazır!

Artık NSFW kısıtlaması olmayan, kendi bilgisayarınızda çalışan AI modeli var!

```bash
ollama serve
# Başka bir terminal'de:
npm run zuhre -- chat
```

Sorular sor, code oluştur, adult web sitesi geliştir! 🚀

---

**Herhangi bir soru varsa haber ver!**
