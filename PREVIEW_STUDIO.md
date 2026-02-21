# 🚀 Space Theme Preview Studio

## Hızlı Başlangıç

### 1. Server'ı Başlat

**Windows:**
```bash
start-preview.bat
```

**Mac/Linux:**
```bash
./start-preview.sh
```

**veya direkt Python:**
```bash
python -m http.server 8080
```

### 2. Tarayıcıda Aç

```
http://localhost:8080/preview.html
```

---

## 📚 Neler Yapabilirsin?

### 🎨 Galeri
- Space teması arka planlarını gör
- Nebula efektlerini inceleniş
- Yıldız alanını yapı gördü
- Glow kartlarını test et
- Button stillerini gözle
- Navbar tasarımını incele

### 🎭 Bileşenler
- Navbar bileşeni live preview
- Card bileşenleri örnekleri
- Component tasarımlarını göz

### 🎨 Renkler
- Tüm renk paletini gör
- Hex kodlarını kopyala
- Renk kombinasyonlarını test et

### ✨ İkonlar
- 6+ hazır icon seti
- İkon isimlerini gör
- Emojileri kullan

### 🤖 Görsel Üretim (Yakında)
- AI ile görsel oluştur
- Custom prompts yap
- Otomatik asset generation

---

## 🎯 Özellikler

✅ **Canlı Önizleme** - Tüm bileşenleri gerçek zamanlı gör
✅ **Kod Kopyala** - CSS kodlarını tek tıkla kopyala
✅ **Responsive** - Mobil ve desktop'da çalışır
✅ **Dark Mode** - Space teması öntanımlı
✅ **Arama** - Varlıkları hızlı ara (geliştirilme devam ediyor)
✅ **İndirme** - Tüm assets'leri indir (yakında)

---

## 📦 Dosya Yapısı

```
public/
├── preview.html              ← Ana arayüz (http://localhost:8080/preview.html)
├── space-background.svg      ← SVG arka planı
├── space-icons.svg           ← SVG icon seti
├── start-preview.bat         ← Windows server
└── start-preview.sh          ← Mac/Linux server

src/
├── styles/space-theme.css    ← CSS styling
└── components/SpaceTheme.tsx ← React bileşenleri
```

---

## 🔧 Kullanım

### Sidebar Menüsü

1. **📸 Görseller** - Tüm arka plan ve efektler
2. **🎨 Bileşenler** - Navbar, Cards, etc.
3. **🎭 Renkler** - Renk paleti ve hex kodları
4. **✨ İkonlar** - İkon seti
5. **🤖 Görsel Üret** - AI üretim (yakında)
6. **💬 Prompt Yap** - Custom prompts (yakında)
7. **⬇️ İndir** - Assets'leri indir
8. **📋 Kopyala** - Kod kopyala

### Kartlar

Her karta 3 aksiyon:
- **👁️ Önizle** - Modal'da büyük göster
- **📋 Kod** - CSS/HTML kodunu kopyala
- **⬇️ İndir** - Dosyayı indir

---

## 💾 Lokal Kullanım

### Şekilde İndir ve Kullan

```bash
# Git repo'sunden clone et
git clone <repo-url>
cd Zuhre_Planet

# Preview'ı aç
python -m http.server 8080
# http://localhost:8080/preview.html
```

### Docker'da Çalıştır

```bash
docker compose up
# http://localhost:80/preview.html
```

---

## 🎨 Customization

### Renkleri Değiştir

`space-theme.css`'de CSS variables'ı edit et:

```css
:root {
    --space-dark: #0a0e27;
    --cosmic-purple: #6d28d9;
    --cosmic-cyan: #06b6d4;
    /* vs */
}
```

### Bileşenleri Ekle

`preview.html`'e yeni kartlar ekle:

```html
<div class="preview-card">
    <div class="preview-image">🆕</div>
    <div class="preview-info">
        <div class="preview-title">Yeni Bileşen</div>
        <div class="preview-actions">
            <button onclick="previewAsset('new')">👁️ Önizle</button>
        </div>
    </div>
</div>
```

---

## 🚀 Development

### Hot Reload

```bash
# Terminal'de
python -m http.server 8080

# VS Code'da
# Tarayıcıyı yenile (F5) her değişiklikten sonra
```

### CSS Debug

Tarayıcı Console'u aç (F12) ve:
- Elementleri incele
- CSS'i test et
- JS error'larını gör

---

## 📊 Production

### Deploy

1. `preview.html`'i web sunucusuna yükle
2. Assets'leri (SVG, CSS) da yükle
3. URL'ye git ve kullan

### CDN

```html
<link rel="stylesheet" href="https://cdn.example.com/space-theme.css">
```

---

## 🐛 Troubleshooting

### Server başlamıyor
```bash
# Port 8080 kullanılıyor mı kontrol et
netstat -ano | findstr :8080

# Farklı port kullan
python -m http.server 9000
```

### CSS yüklenmedi
- Tarayıcıyı hard refresh et (Ctrl+Shift+R)
- Cache temizle
- DevTools'ta Network tab'ı kontrol et

### Emojiler görünmüyor
- UTF-8 encoding kontrol et
- Font desteği kontrol et

---

## 📝 Roadmap

- [ ] AI görsel üretim entegrasyonu
- [ ] Custom prompt builder
- [ ] Assets bulk download
- [ ] Theme editor
- [ ] Real-time collaboration
- [ ] Version history

---

## 💬 Feedback

Öneriler veya sorular? GitHub issues'na yazın!

---

**Keyif al! 🚀✨**
