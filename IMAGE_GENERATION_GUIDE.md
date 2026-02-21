# 🎨 Adult Content Image Generation - Complete Guide

## En Kaliteli, Restriction-Free Görsel Üretimi

### Seçilen Model: Stable Diffusion XL (SDXL)
```
✅ Professional quality (8K capable)
✅ NSFW fully uncensored
✅ No content restrictions
✅ Open source
✅ Fast inference
✅ Fine-tuning support
✅ Commercial use OK
```

---

## 🚀 3 ADIMDA KURULUM

### Adım 1: Full Docker Compose Başlat
```bash
docker compose -f docker-compose.full.yml up
```

**Başlayacaklar:**
- API Server (port 3000)
- PostgreSQL (port 5432)
- Nginx (port 80)
- SDXL Web UI (port 7860) ← **Image generation**
- Ollama (port 11434) ← Text generation

### Adım 2: Web UI'dan Model İndir
1. http://localhost:7860 açın
2. "Admin Panel" → "Settings" 
3. "Models" → Search "Stable Diffusion XL"
4. Download (ilk defa 2.5-5 GB)

### Adım 3: Test Et
```bash
python cli/image-generator.py generate "beautiful woman, professional photo"
```

---

## 📋 KOMUTLAR

### Single Image Generation
```bash
python cli/image-generator.py generate "your prompt here"
```

### Escort Profile Image
```bash
python cli/image-generator.py profile "Luna" "blonde hair, 24, photographer style"
```

### Batch Generation (Dosyadan)
```bash
# prompts.txt oluştur:
cat > prompts.txt << EOF
Beautiful woman, professional studio photo
Glamour photography, intimate lighting
Artistic nude photography, professional
EOF

# Çalıştır:
python cli/image-generator.py batch prompts.txt
```

### Web UI Aç
```bash
npm run sdxl-web
# veya
python cli/image-generator.py web
```

---

## 💬 PROMPT YAZMA REHBERİ

### Temel Yapı
```
[Subject] [Style] [Quality] [Details]
```

### Adult Content - İyi Prompt'lar

**Örnek 1: Glamour Photography**
```
Ultra realistic photography of beautiful woman, 25 years old,
professional studio lighting, intimate pose, sensual expression,
skin texture detail, 8k, highly detailed, masterpiece
```

**Örnek 2: Professional Photoshoot**
```
Professional glamour photography, model in studio setting,
professional makeup and lighting, artistic composition,
skin details, perfect features, HD 8k resolution, 
magazine quality, high fashion style
```

**Örnek 3: Artistic Nude**
```
Artistic photography, classical lighting, sensual pose,
aesthetic composition, professional photography,
artistic expression, detailed skin texture, studio setting,
masterpiece quality, ultra detailed
```

**Örnek 4: Character Design (Anime)**
```
Beautiful anime character, detailed features, 
professional illustration, fantasy art style, 
high quality artwork, vibrant colors, detailed clothing,
perfect proportions, masterpiece
```

### Negative Prompts (Kötü Şeyleri Engelle)
```
"low quality, blurry, distorted, ugly, bad anatomy, 
malformed, deformed, missing limbs, extra limbs, 
watermark, text, logo"
```

---

## 🎯 ADULT-SPECIFIC MODELS

Model'i değiştirmek için Web UI'da:

### Best for Realism
- **Stable Diffusion XL** (Default) - 8K quality
- **Juggernaut XL** - Maximum realism
- **DreamShaper XL** - Professional photography

### Best for Anime/Manga
- **Chilloutmix** - Anime style with NSFW support
- **Ghibli Style** - Studio-like quality

### Best for Specific Styles
- **Real Cartoon XL** - Comic/cartoon style
- **Pencil Drawing** - Sketch/drawing style

---

## 🔧 OPTIMIZATION (16GB RAM)

### Faster Generation (20 sn/image)
```yaml
# Web UI Settings:
Steps: 20
Sampler: DPM++ 2M SDE
Guidance Scale: 7.0
Height: 512
Width: 512
```

### Best Quality (60 sn/image)
```yaml
Steps: 30
Sampler: DPM++ 2M Karras
Guidance Scale: 7.5
Height: 768
Width: 1024
```

### Maximum Quality (2-3 dakika)
```yaml
Steps: 40
Sampler: DPM++ 2M Karras
Guidance Scale: 7.5
Height: 1024
Width: 1024
```

---

## 🔐 NO RESTRICTIONS

✅ **Tamamen NSFW Support**
✅ **Adult content fully allowed**
✅ **No safety filters**
✅ **Explicit content generation OK**
✅ **No content moderation**
✅ **Fully customizable**

---

## 📊 PERFORMANCE

| Resolution | Steps | Time | Quality | RAM |
|-----------|-------|------|---------|-----|
| 512x512 | 20 | 15s | ⭐⭐⭐ | 4GB |
| 768x768 | 30 | 45s | ⭐⭐⭐⭐ | 8GB |
| 1024x1024 | 40 | 120s | ⭐⭐⭐⭐⭐ | 12GB |

**Your system:** Intel UHD → CPU fallback (slower, but works)

---

## 🎨 ADVANCED: Custom LoRA

LoRA = Fine-tuned models for specific styles

### Using LoRA
1. Download LoRA file (.safetensors)
2. Place in `sdxl-models/lora/`
3. Web UI'da select LoRA
4. Use in prompt: `<lora:name:0.7>`

### Popular Adult LoRA
- Realistic body types
- Specific ethnicities
- Fashion styles
- Intimate poses
- Studio photography

**Source:** https://civitai.com (filter: "NSFW")

---

## 💻 API INTEGRATION

### tRPC Router (TypeScript)

```typescript
// src/server/routers/image.router.ts

export const imageRouter = router({
  generateImage: protectedProcedure
    .input(z.object({
      prompt: z.string(),
      style: z.enum(["photography", "anime", "art"]),
      count: z.number().min(1).max(5),
    }))
    .mutation(async ({ ctx, input }) => {
      // Call SDXL API
      const response = await fetch("http://sdxl:7860/api/txt2img", {
        method: "POST",
        body: JSON.stringify({
          prompt: `${input.prompt}, ${input.style} style`,
          steps: 30,
          width: 768,
          height: 1024,
        }),
      });
      
      const result = await response.json();
      
      // Save to database
      const image = await db.insert(schema.generatedImages).values({
        userId: ctx.user.id,
        prompt: input.prompt,
        imageUrl: `/uploads/${filename}`,
        style: input.style,
        createdAt: new Date(),
      });
      
      return image;
    }),
  
  getImages: protectedProcedure
    .query(async ({ ctx }) => {
      return db.query.generatedImages.findMany({
        where: eq(schema.generatedImages.userId, ctx.user.id),
        orderBy: (t) => desc(t.createdAt),
        limit: 50,
      });
    }),
});
```

### React Component

```typescript
// src/components/ImageGenerator.tsx

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  
  const generateMutation = trpc.image.generateImage.useMutation({
    onSuccess: (data) => {
      setImages([...images, data.imageUrl]);
      setPrompt("");
    },
  });
  
  const handleGenerate = async () => {
    setLoading(true);
    await generateMutation.mutateAsync({
      prompt,
      style: "photography",
      count: 1,
    });
    setLoading(false);
  };
  
  return (
    <div className="image-generator">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe the image..."
      />
      
      <button 
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate"}
      </button>
      
      <div className="gallery">
        {images.map((img) => (
          <img key={img} src={img} alt="Generated" />
        ))}
      </div>
    </div>
  );
}
```

---

## 🚀 WORKFLOW

### Development Workflow

```bash
# Terminal 1: Docker services
docker compose -f docker-compose.full.yml up

# Terminal 2: Image generation
python cli/image-generator.py generate "prompt"

# Terminal 3: Development
npm run dev

# Terminal 4: Code
code .
```

### Production Workflow

1. **User requests image** (React component)
2. **Frontend → tRPC** (sends prompt)
3. **tRPC → SDXL API** (generates image)
4. **SDXL → saves file** (to disk)
5. **Save metadata** (to database)
6. **Return URL** (to frontend)
7. **Display** (in gallery/profile)

---

## 📁 DIRECTORY STRUCTURE

```
Zuhre_Planet/
├── cli/
│   ├── image-generator.py     ← Image gen CLI
│   ├── local-ai.py            ← Text generation
│   └── zuhre-cli.ts           ← TypeScript CLI
├── sdxl-models/               ← Downloaded models
├── sdxl-outputs/              ← Generated images
├── uploads/                   ← Stored in database
├── docker-compose.full.yml    ← All services
└── src/
    └── server/routers/
        └── image.router.ts    ← tRPC integration
```

---

## ✅ KONTROL LİSTESİ

- [ ] `docker compose -f docker-compose.full.yml up`
- [ ] Wait for SDXL download (~5GB, 10-15 min)
- [ ] http://localhost:7860 test
- [ ] First image generate: `python cli/image-generator.py generate "..."`
- [ ] tRPC router ekle
- [ ] React component entegre
- [ ] Production test

---

## 📞 TROUBLESHOOTING

### "SDXL server not running"
```bash
docker compose -f docker-compose.full.yml up sdxl
```

### Slow generation
- Lower resolution (512x512)
- Fewer steps (20 instead of 30)
- CPU fallback slow - get GPU (NVIDIA recommended)

### Out of memory
- Use VAE tiling (Web UI setting)
- Lower resolution
- Fewer steps
- Or: Upgrade RAM

### Model not found
```bash
# Download in Web UI:
Admin Panel → Settings → Models → Search & Download
```

---

## 🎓 RESOURCES

- **SDXL Docs**: https://huggingface.co/stabilityai/stable-diffusion-xl
- **Civitai Models**: https://civitai.com (filter: NSFW)
- **Open WebUI**: https://openwebui.com
- **LoRA Database**: https://civitai.com/models

---

## 🔐 PRIVACY & SECURITY

✅ **Completely Local** - No cloud uploads
✅ **No content restrictions** - Full NSFW support
✅ **No moderation** - Adult content fully allowed
✅ **Open source** - Auditable code
✅ **Commercial ready** - Usage rights OK

---

## 🎉 READY TO GO!

High-quality, unrestricted adult content image generation
fully integrated with Zuhre Planet platform.

```bash
npm run gen-image "your prompt"
# or
npm run sdxl-web
# or
npm run docker compose -f docker-compose.full.yml up
```

**Yaşa!** 🎨

Let me know if you need anything else!
