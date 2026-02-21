# 🎨 Stable Diffusion XL (SDXL) - Adult Content Image Generation Setup

## Adult Content Image Generation - Kaliteli ve Restriction-Free

### Sistem Özellikleri (Sizin)
```
✅ 8 CPU Cores
✅ 16 GB RAM
✅ 157 GB Disk
✅ Intel UHD Graphics 620 (CPU fallback)
```

### Model: Stable Diffusion XL (SDXL)
```
✅ Açık kaynak (RESTRICTED DEĞİL)
✅ NSFW fully supported
✅ Highest image quality
✅ 16GB RAM'e uygun
✅ Commercial use OK
```

---

## 🚀 KURULUM

### Option 1: Docker Compose (RECOMMENDED) ⭐

```bash
# 1. docker-compose.sdxl.yml oluştur
# (aşağıya bak)

# 2. Başlat
docker compose -f docker-compose.sdxl.yml up

# 3. Web UI açık
http://localhost:7860
```

### Option 2: Standalone Installation

```bash
# 1. Repo clone
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git

# 2. Run
cd stable-diffusion-webui
python -m venv venv
./venv/Scripts/activate  # Windows
pip install -r requirements.txt

# 3. Download model
# (otomatik yapılır ilk başta)

# 4. Start
python webui.py --opt-sub-quad-attention
```

---

## 📋 DOCKER COMPOSE FILE

Yeni dosya oluştur: `docker-compose.sdxl.yml`

```yaml
version: '3.8'

services:
  sdxl:
    image: continuumio/miniconda3:latest
    container_name: sdxl-webui
    ports:
      - "7860:7860"
    volumes:
      - ./sdxl-models:/models
      - ./sdxl-outputs:/outputs
    environment:
      - CUDA_VISIBLE_DEVICES=0
      - TZ=UTC
    stdin_open: true
    tty: true
    command: |
      bash -c "
        cd /tmp &&
        git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git &&
        cd stable-diffusion-webui &&
        pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu &&
        pip install -q -r requirements.txt &&
        python webui.py --listen --opt-sub-quad-attention --no-half
      "
```

---

## 🖼️ MODELS İNDİR

### Best for Adult Content:

#### 1. Stable Diffusion XL (Official)
```
https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0
```

#### 2. DreamShaper XL v2 (Adult optimized)
```
https://huggingface.co/Lykon/DreamShaper
```

#### 3. Juggernaut XL (Realism)
```
https://huggingface.co/ehristoforu/SDXL-Juggernaut
```

#### 4. Chilloutmix (Anime + Adult)
```
https://huggingface.co/Uminosachi/chilloutmix
```

---

## 🎯 KULLANIM

### Web UI'dan

1. http://localhost:7860 açın
2. Prompt yazın
3. Generate

### Örnek Prompts (Adult Content)

```
"Ultra realistic photography, professional lighting, 
beautiful woman, 25 years old, wearing, 8k, highly detailed, 
skin details, perfect face, professional photoshoot"
```

```
"High quality glamour photography, intimate lighting, 
sensual pose, artistic nudity, professional studio, 
masterpiece, ultra detailed"
```

```
"3D render, beautiful character design, anime style, 
detailed features, sexy pose, professional lighting, 
HD resolution"
```

---

## 💻 API USAGE

```python
import requests
import json

SDXL_API = "http://127.0.0.1:7860/api"

def generate_image(prompt: str, negative_prompt: str = ""):
    """SDXL'den görsel oluştur"""
    
    payload = {
        "prompt": prompt,
        "negative_prompt": negative_prompt or "low quality, blurry",
        "steps": 30,
        "width": 768,
        "height": 1024,
        "scale": 7.5,
    }
    
    response = requests.post(
        f"{SDXL_API}/txt2img",
        json=payload
    )
    
    return response.json()

# Kullanım
result = generate_image(
    "Beautiful woman, professional photoshoot, 8k"
)

# Görseli kaydet
with open("output.png", "wb") as f:
    f.write(result["images"][0])
```

---

## 🔧 OPTIMIZATION (16GB RAM için)

### Enable Faster Processing:

```bash
# docker-compose'a ekle environment:
environment:
  - ENABLE_ATTENTION_SLICING=1
  - ENABLE_MEM_EFFICIENT_ATTENTION=1
  - CUDA_LAUNCH_BLOCKING=0
```

### Model Optimize:

- Use quantized GGUF models (4-5x hızlı)
- Enable VAE tiling (RAM tasarrufu)
- Use lower steps (20-30 yeterli)

---

## ⚡ PERFORMANCE

| Setting | Speed | Quality | VRAM |
|---------|-------|---------|------|
| 20 steps, 512x512 | ⚡⚡⚡⚡ | ⭐⭐⭐ | 4 GB |
| 30 steps, 768x768 | ⚡⚡⚡ | ⭐⭐⭐⭐ | 8 GB |
| 40 steps, 1024x1024 | ⚡⚡ | ⭐⭐⭐⭐⭐ | 10 GB |

Your GPU: Intel UHD = CPU fallback
→ İlk çalıştırma ~2-3 dakika

---

## 📊 ALTERNATIF MODELS

### Komercial (Free tier)

- **Leonardo AI** - NSFW allowed
- **Civitai** - Adult models
- **Tensor Art** - Custom models

### Open Source

- **Real Cartoon XL** - Anime/cartoon
- **Ghibli Style** - Studio style
- **LoRA Models** - Custom trained

---

## 🔐 NSFW HANDLING

SDXL'nin bu avantajı:
✅ **Safety filter yok**
✅ **Uncensored generation**
✅ **Adult content full support**
✅ **Custom LoRA models**
✅ **Commercial usage**

---

## 🎓 ADVANCED: Custom LoRA

Adult content için fine-tuned models:

```
Civitai üzerinden bulunabilen:
- Portrait LoRA
- Anime NSFW LoRA
- Realistic body LoRA
- Style transfer LoRA
```

---

## 📋 QUICK START

```bash
# 1. Model indir
mkdir -p sdxl-models sdxl-outputs

# 2. Docker compose başlat
docker compose -f docker-compose.sdxl.yml up

# 3. Web UI aç
# http://localhost:7860

# 4. Prompt yaz ve generate
```

---

## 🚀 INTEGRATION (Zuhre Planet'e)

### Python API Client

```python
# cli/image-generator.py

import requests
from PIL import Image
from io import BytesIO

class SDXLGenerator:
    def __init__(self, api_url="http://127.0.0.1:7860"):
        self.api_url = api_url
    
    def generate(self, prompt: str, output_path: str):
        """Görsel oluştur"""
        response = requests.post(
            f"{self.api_url}/api/txt2img",
            json={
                "prompt": prompt,
                "negative_prompt": "low quality",
                "steps": 30,
                "width": 768,
                "height": 1024,
            }
        )
        
        # Save image
        image_data = response.json()["images"][0]
        image = Image.open(BytesIO(image_data))
        image.save(output_path)
        
        return output_path

# Kullanım
generator = SDXLGenerator()
generator.generate(
    "Beautiful woman, professional photo",
    "output.png"
)
```

### tRPC Integration

```typescript
// src/server/routers/image.router.ts

export const imageRouter = router({
  generateImage: publicProcedure
    .input(z.object({
      prompt: z.string(),
      userId: z.number(),
    }))
    .mutation(async ({ input }) => {
      // SDXL API call
      const response = await fetch("http://sdxl:7860/api/txt2img", {
        method: "POST",
        body: JSON.stringify({
          prompt: input.prompt,
          // ... settings
        }),
      });
      
      // Save to database & storage
      const image = await db.insert(schema.generatedImages).values({
        userId: input.userId,
        prompt: input.prompt,
        imageUrl: "/uploads/...",
      });
      
      return image;
    }),
});
```

---

## 📚 KAYNAKLAR

- **AUTOMATIC1111 WebUI**: https://github.com/AUTOMATIC1111/stable-diffusion-webui
- **Civitai Models**: https://civitai.com
- **HuggingFace Models**: https://huggingface.co/models
- **SDXL Docs**: https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0

---

## ✅ KONTROL LİSTESİ

- [ ] Docker Compose file oluştur
- [ ] Model indir (Civitai veya HuggingFace)
- [ ] `docker compose up` başlat
- [ ] http://localhost:7860 test et
- [ ] İlk görsel oluştur
- [ ] API'ye entegre et
- [ ] Zuhre Planet'e ekle

---

**Artık kaliteli, restriction-free görsel üretebilirsin!** 🎨

Next: Entegrasyon ve workflow setup.
