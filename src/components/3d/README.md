# 3D Components

Bu klasör, platform genelinde kullanılan gelişmiş 3D bileşenleri içerir. Tüm bileşenler derinlik, elevation ve interaktif efektler ile tasarlanmıştır.

## 📦 Bileşenler

### Button3D
Gelişmiş 3D buton bileşeni.

**Özellikler:**
- Press efekti (translateY + scale)
- Ripple click animasyonu
- Gradient shine sweep
- Hover floating glow
- Active state depth
- Loading ve disabled states

**Kullanım:**
```tsx
import { Button3D } from '@/components/3d';

<Button3D variant="primary" size="lg">
  Gönder
</Button3D>
```

### Card3D
Gelişmiş 3D kart bileşeni.

**Özellikler:**
- 1500px perspective derinliği
- Smooth tilt animasyonu
- Shine/glare overlay efekti
- Floating shadow
- Parallax iç elemanlar

**Kullanım:**
```tsx
import { Card3D } from '@/components/3d';

<Card3D elevation="high" glow>
  <h3>İçerik Başlığı</h3>
  <p>Kart içeriği...</p>
</Card3D>
```

### Icon3D
Gelişmiş 3D ikon wrapper bileşeni.

**Özellikler:**
- 360° rotation animasyonu
- Bounce animasyon
- Pulse glow efekti
- Gradient fill
- Floating efekt

**Kullanım:**
```tsx
import { Icon3D } from '@/components/3d';
import { Heart } from 'lucide-react';

<Icon3D icon={<Heart />} glow float variant="primary" />
```

### Input3D
Gelişmiş 3D input bileşeni.

**Özellikler:**
- Focus glow ring
- Animated border gradient
- Floating label
- Success/error state animations
- Shake on error
- İkon desteği

**Kullanım:**
```tsx
import { Input3D } from '@/components/3d';
import { Mail } from 'lucide-react';

<Input3D 
  label="Email" 
  icon={<Mail />}
  error="Geçersiz email"
  floatingLabel
/>
```

### Badge3D ⭐ YENİ
3D badge/etiket bileşeni.

**Özellikler:**
- Floating efekt animasyonu
- Pulse glow (aktif durumlarda)
- Gradient arka plan
- Hover scale
- Çoklu varyant

**Kullanım:**
```tsx
import { Badge3D } from '@/components/3d';

<Badge3D variant="primary" pulse>
  Yeni
</Badge3D>
```

### Avatar3D ⭐ YENİ
3D avatar bileşeni.

**Özellikler:**
- Ring glow efekti
- Online pulse indicator
- Hover zoom
- Border gradient
- Fallback desteği

**Kullanım:**
```tsx
import { Avatar3D } from '@/components/3d';

<Avatar3D 
  src="/avatar.jpg" 
  online 
  gradient 
  size="lg"
/>
```

### Toggle3D ⭐ YENİ
3D toggle/switch bileşeni.

**Özellikler:**
- 3D knob hareketi
- Renk geçişi
- Glow on active
- Smooth spring animasyon
- Label desteği

**Kullanım:**
```tsx
import { Toggle3D } from '@/components/3d';

<Toggle3D 
  checked={enabled} 
  onChange={setEnabled}
  label="Bildirimleri aç"
/>
```

## 🎨 Genel Özellikler

Tüm 3D bileşenler şu özellikleri paylaşır:

- **Framer Motion** tabanlı animasyonlar
- **TypeScript** tip güvenliği
- **Responsive** tasarım
- **Accessibility** uyumlu
- **Dark mode** desteği (yakında)
- **Özelleştirilebilir** stil desteği

## 🔧 Teknik Detaylar

### Animasyon Sistemi
- Spring animasyonlar (stiffness: 400, damping: 30)
- Cubic-bezier transitions
- 60fps hedefi
- Reduced motion desteği

### 3D Efektler
- Perspective: 1500px
- Transform-style: preserve-3d
- Backface-visibility kontrol
- Layered shadows

### Performance
- GPU acceleration (transform-gpu)
- Will-change optimizasyonları
- Lazy loading desteği
- Minimal re-render

## 📚 İlgili Dosyalar

- `src/styles/3d-effects.css` - 3D CSS utility sınıfları
- `src/styles/animations.css` - Animasyon tanımları
- `tailwind.config.js` - Tailwind konfigürasyonu
- `docs/3D_EFFECTS_GUIDE.md` - Detaylı 3D efektler rehberi

## 🎯 Best Practices

1. **Performans**
   - Çok fazla 3D element kullanmaktan kaçının
   - Görünümde olmayan elementlerde animasyonları durdurun
   - Mobile cihazlarda 3D efektleri azaltın

2. **Accessibility**
   - Keyboard navigation desteği verin
   - Screen reader friendly olun
   - `prefers-reduced-motion` için destek ekleyin

3. **UX**
   - Animasyonları aşırıya kaçırmayın
   - Tutarlı timing kullanın
   - Geri bildirim sağlayan animasyonlar kullanın

## 🐛 Troubleshooting

**Problem:** Animasyonlar düzgün çalışmıyor
- `framer-motion` kurulu olduğundan emin olun
- CSS dosyalarının import edildiğini kontrol edin
- Browser 3D transform desteğini kontrol edin

**Problem:** Performance sorunları
- `will-change` kullanın
- Animasyon sayısını azaltın
- GPU acceleration'ı etkinleştirin

## 📝 Changelog

### v2.0.0 (Faz 4)
- ✨ Badge3D, Avatar3D, Toggle3D eklendi
- ⚡ Button3D ripple efekti eklendi
- ⚡ Card3D shine overlay eklendi
- ⚡ Icon3D rotation ve bounce eklendi
- ⚡ Input3D floating label eklendi
- 📝 Tüm bileşenlere JSDoc eklendi

### v1.0.0
- 🎉 İlk sürüm
- Button3D, Card3D, Icon3D, Input3D bileşenleri
