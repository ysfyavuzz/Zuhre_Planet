# 3D Effects Guide

Bu rehber, platformdaki 3D efektlerin detaylı açıklamasını, kullanımını ve best practices'i içerir.

## 📚 İçindekiler

1. [3D Efektler Nedir?](#3d-efektler-nedir)
2. [CSS 3D Transforms](#css-3d-transforms)
3. [3D Component Library](#3d-component-library)
4. [Animasyon Sistemi](#animasyon-sistemi)
5. [Performance](#performance)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

## 3D Efektler Nedir?

3D efektler, web elementlerine derinlik, perspektif ve gerçekçilik kazandıran CSS ve JavaScript teknikleridir. Platform genelinde:

- **Derinlik**: Layered shadows, elevation levels
- **Perspektif**: Transform-style: preserve-3d
- **İnteraktivite**: Mouse tracking, tilt effects
- **Animasyonlar**: Smooth transitions, spring physics

## CSS 3D Transforms

### Temel Transform Özellikleri

```css
/* Perspective container */
.perspective-1500 {
  perspective: 1500px;
  transform-style: preserve-3d;
}

/* 3D rotations */
.rotate-y-12 { transform: rotateY(12deg); }
.rotate-x-12 { transform: rotateX(12deg); }

/* Translate Z (depth) */
.translate-z-20 { transform: translateZ(20px); }
```

### Shadow Levels

Platform 3 farklı shadow level kullanır:

```css
/* Small - Subtle elevation */
.shadow-3d-sm {
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.1),
    0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Medium - Standard depth */
.shadow-3d-md {
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.15),
    0 8px 16px rgba(0, 0, 0, 0.15),
    0 16px 32px rgba(0, 0, 0, 0.1);
}

/* Large - Dramatic elevation */
.shadow-3d-lg {
  box-shadow: 
    0 8px 16px rgba(0, 0, 0, 0.2),
    0 16px 32px rgba(0, 0, 0, 0.2),
    0 32px 64px rgba(0, 0, 0, 0.15);
}
```

### Glow Effects

```css
/* Primary glow - Rose/Pink */
.glow-primary {
  box-shadow: 0 0 40px rgba(225, 29, 72, 0.4);
}

/* Accent glow - Purple */
.glow-accent {
  box-shadow: 0 0 40px rgba(124, 58, 237, 0.4);
}

/* Success glow - Green */
.glow-success {
  box-shadow: 0 0 40px rgba(16, 185, 129, 0.4);
}
```

## 3D Component Library

### Button3D

**Features:**
- Ripple click effect
- Gradient shine sweep
- Press animation (translateY + scale)
- Hover glow

**Usage:**
```tsx
import { Button3D } from '@/components/3d';

<Button3D 
  variant="primary" 
  size="lg"
  onClick={handleSubmit}
>
  Gönder
</Button3D>
```

**Variants:**
- `primary`: Rose gradient (default)
- `secondary`: Purple gradient
- `success`: Green gradient
- `danger`: Red gradient
- `outline`: Transparent with border

### Card3D

**Features:**
- Mouse-following shine overlay
- Floating shadow animation
- Parallax depth (children translateZ)
- Tilt effect (8deg max)

**Usage:**
```tsx
import { Card3D } from '@/components/3d';

<Card3D 
  elevation="high" 
  glow 
  hover
  padding="lg"
>
  <h3>Title</h3>
  <p>Content...</p>
</Card3D>
```

**Props:**
- `elevation`: 'low' | 'medium' | 'high'
- `glow`: boolean (pulse glow effect)
- `hover`: boolean (enable/disable tilt)
- `padding`: 'none' | 'sm' | 'md' | 'lg'

### Icon3D

**Features:**
- 360° rotation animation
- Bounce effect
- Pulse glow ring
- Floating animation

**Usage:**
```tsx
import { Icon3D } from '@/components/3d';
import { Heart } from 'lucide-react';

<Icon3D 
  icon={<Heart />}
  variant="primary"
  size="lg"
  glow
  float
  bounce
  rotate360
/>
```

### Input3D

**Features:**
- Floating label animation
- Animated border gradient (on focus)
- Shake on error
- Focus glow ring

**Usage:**
```tsx
import { Input3D } from '@/components/3d';
import { Mail } from 'lucide-react';

<Input3D 
  label="Email" 
  icon={<Mail />}
  error="Invalid email"
  floatingLabel
  type="email"
/>
```

### Badge3D

**Features:**
- Floating Y-axis animation
- Pulse glow on active
- Hover scale
- Gradient backgrounds

**Usage:**
```tsx
import { Badge3D } from '@/components/3d';

<Badge3D 
  variant="primary" 
  pulse 
  float
>
  New
</Badge3D>
```

### Avatar3D

**Features:**
- Ring glow effect
- Online pulse indicator
- Gradient border option
- Hover zoom

**Usage:**
```tsx
import { Avatar3D } from '@/components/3d';

<Avatar3D 
  src="/avatar.jpg"
  online
  gradient
  size="lg"
/>
```

### Toggle3D

**Features:**
- 3D knob movement (spring physics)
- Color transition on toggle
- Glow on active
- Label support

**Usage:**
```tsx
import { Toggle3D } from '@/components/3d';

<Toggle3D 
  checked={enabled}
  onChange={setEnabled}
  label="Enable notifications"
  size="md"
/>
```

## Animasyon Sistemi

### Framer Motion Configuration

Tüm 3D componentler Framer Motion kullanır:

```tsx
// Spring animation (smooth, natural)
transition={{
  type: 'spring',
  stiffness: 400,
  damping: 30,
}}

// Cubic-bezier (precise control)
transition={{
  duration: 0.3,
  ease: [0.25, 0.46, 0.45, 0.94]
}}
```

### Keyframe Animations

Platform 3 ana animasyon kategorisi kullanır:

1. **Transform Animations**
   - float, rotate, scale, bounce
   
2. **Opacity Animations**
   - fadeIn, fadeOut, pulse
   
3. **Combined Animations**
   - fadeInUp, scaleIn, slideInLeft

## Performance

### GPU Acceleration

```css
.transform-gpu {
  transform: translateZ(0);
  will-change: transform;
}
```

### Optimization Tips

1. **Limit 3D Elements**: Max 10-15 per viewport
2. **Lazy Loading**: Load 3D effects on scroll
3. **Conditional Rendering**: Disable on mobile if needed
4. **Will-change**: Use sparingly, remove after animation

### Performance Metrics

Target metrics:
- **FPS**: 60fps minimum
- **Animation Duration**: 200-500ms average
- **First Paint**: No blocking 3D effects

## Best Practices

### 1. Consistent Timing

```tsx
// Use platform standard timings
const TIMING = {
  fast: 0.2,      // Micro-interactions
  normal: 0.3,    // Standard transitions
  slow: 0.5,      // Complex animations
};
```

### 2. Accessibility

```tsx
// Respect prefers-reduced-motion
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 3. Progressive Enhancement

```tsx
// Check for 3D support
const supports3D = CSS.supports('transform-style', 'preserve-3d');

if (supports3D) {
  // Enable 3D effects
} else {
  // Fallback to 2D
}
```

### 4. Mobile Optimization

```tsx
// Reduce 3D effects on mobile
const isMobile = window.innerWidth < 768;

<Card3D hover={!isMobile} />
```

## Troubleshooting

### Problem: Animasyonlar Çalışmıyor

**Çözüm:**
1. `framer-motion` installed mi kontrol et
2. CSS dosyaları import edilmiş mi
3. Browser 3D transform desteği var mı

### Problem: Performance Düşük

**Çözüm:**
1. 3D element sayısını azalt
2. `will-change` kullan
3. GPU acceleration aktif et
4. Viewport dışındaki animasyonları durdur

### Problem: Z-fighting / Flickering

**Çözüm:**
```css
/* Increase perspective */
.container {
  perspective: 2000px; /* Daha yüksek değer */
}

/* Fix z-index layers */
.element {
  transform: translateZ(1px); /* Minimal z offset */
}
```

### Problem: Touch Events Çalışmıyor

**Çözüm:**
```tsx
// Both mouse and touch events
<div
  onMouseMove={handleMove}
  onTouchMove={handleMove}
>
```

## Kaynaklar

### CSS Files
- `src/styles/3d-effects.css` - 3D utility classes
- `src/styles/animations.css` - Animation definitions
- `tailwind.config.js` - Tailwind extensions

### Components
- `src/components/3d/` - All 3D components

### Documentation
- `src/components/3d/README.md` - Component docs
- `docs/ANIMATIONS_GUIDE.md` - Animation guide

### External Resources
- [Framer Motion Docs](https://www.framer.com/motion/)
- [CSS Transforms MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)

---

**Last Updated:** 2026-01-22 | **Version:** 4.2.0
