# Utils Dökümantasyonu

Utility fonksiyonlar ve yardımcı araçlar. Güvenlik, ses yönetimi ve genel yardımcı fonksiyonlar.

## 📋 Utility Listesi

| Utility | Açıklama | Dosya |
|---------|----------|-------|
| **Security** | XSS koruması, validasyon, sanitizasyon | `security.ts` |
| **Sounds** | Bildirim sesleri yönetimi | `sounds.ts` |

---

## 🔒 Security Utilities

### Genel Bakış

Input sanitization, XSS koruması ve güvenlik yardımcı fonksiyonları.

**Dosya:** `src/utils/security.ts`

**Özellikler:**
- ✅ HTML sanitization (XSS prevention)
- ✅ URL validation
- ✅ Email validation
- ✅ Phone number validation (TR format)
- ✅ SQL injection prevention
- ✅ File upload validation
- ✅ CSRF token helpers

### HTML Sanitization

#### sanitizeHTML(html)

HTML içeriğini XSS saldırılarına karşı temizler.

```typescript
import { sanitizeHTML } from '@/utils/security';

// Kullanıcı input'u temizle
const userInput = '<script>alert("XSS")</script><p>Safe content</p>';
const clean = sanitizeHTML(userInput);
// Sonuç: '<p>Safe content</p>'

// Form verisi temizleme
const formData = {
  name: sanitizeHTML(input.name),
  bio: sanitizeHTML(input.bio),
  description: sanitizeHTML(input.description),
};
```

**Kaldırılan tehlikeli elementler:**
- `<script>`, `<iframe>`, `<object>`, `<embed>`
- `<link>`, `<style>` (inline CSS)
- `on*` event attributes (onclick, onerror, etc.)
- `javascript:` protokol

**İzin verilen güvenli elementler:**
- Text formatting: `<p>`, `<br>`, `<strong>`, `<em>`, `<u>`
- Lists: `<ul>`, `<ol>`, `<li>`
- Links: `<a>` (href sanitized)
- Images: `<img>` (src sanitized)

#### escapeHTML(text)

HTML karakterlerini encode eder.

```typescript
import { escapeHTML } from '@/utils/security';

const text = '<div>Test & "quotes"</div>';
const escaped = escapeHTML(text);
// Sonuç: '&lt;div&gt;Test &amp; &quot;quotes&quot;&lt;/div&gt;'

// Display kullanıcı mesajı
<div dangerouslySetInnerHTML={{ __html: escapeHTML(message) }} />
```

#### stripHTML(html)

Tüm HTML etiketlerini kaldırır, sadece text kalır.

```typescript
import { stripHTML } from '@/utils/security';

const html = '<p>Hello <strong>World</strong>!</p>';
const text = stripHTML(html);
// Sonuç: 'Hello World!'

// Preview için plain text
const preview = stripHTML(article.content).substring(0, 100);
```

### URL Validation

#### validateURL(url)

URL'in geçerli ve güvenli olduğunu kontrol eder.

```typescript
import { validateURL } from '@/utils/security';

const url1 = 'https://example.com';
const url2 = 'javascript:alert(1)';
const url3 = 'file:///etc/passwd';

validateURL(url1); // true
validateURL(url2); // false (dangerous protocol)
validateURL(url3); // false (file protocol)

// Form validation
if (!validateURL(input.website)) {
  errors.website = 'Geçersiz URL formatı';
}
```

**İzin verilen protokoller:**
- `http://`, `https://`
- `mailto:` (email links)

**Reddedilen protokoller:**
- `javascript:`, `data:`, `file:`, `ftp:`

#### isExternalURL(url)

URL'in harici bir site olup olmadığını kontrol eder.

```typescript
import { isExternalURL } from '@/utils/security';

isExternalURL('https://example.com'); // true
isExternalURL('/profile/123'); // false
isExternalURL('https://mysite.com'); // false (same domain)

// External link icon göster
{isExternalURL(link.url) && <ExternalLinkIcon />}
```

### Email & Phone Validation

#### validateEmail(email)

Email adresinin formatını kontrol eder.

```typescript
import { validateEmail } from '@/utils/security';

validateEmail('user@example.com'); // true
validateEmail('invalid.email'); // false
validateEmail('test@'); // false

// Form validation
if (!validateEmail(input.email)) {
  errors.email = 'Geçersiz email adresi';
}
```

#### validatePhoneNumber(phone)

Türk telefon numarası formatını kontrol eder.

```typescript
import { validatePhoneNumber } from '@/utils/security';

validatePhoneNumber('05551234567'); // true
validatePhoneNumber('5551234567'); // true
validatePhoneNumber('+905551234567'); // true
validatePhoneNumber('123456'); // false

// Form validation
if (!validatePhoneNumber(input.phone)) {
  errors.phone = 'Geçersiz telefon numarası (05XXXXXXXXX)';
}
```

**Kabul edilen formatlar:**
- `05XXXXXXXXX` (11 rakam)
- `5XXXXXXXXX` (10 rakam)
- `+905XXXXXXXXX` (12 karakter)
- `(555) 123-4567` (parantez ve tire ile)

#### formatPhoneNumber(phone)

Telefon numarasını standart formata çevirir.

```typescript
import { formatPhoneNumber } from '@/utils/security';

formatPhoneNumber('5551234567'); // '05551234567'
formatPhoneNumber('+905551234567'); // '05551234567'
formatPhoneNumber('(555) 123-4567'); // '05551234567'
```

### SQL Injection Prevention

#### escapeSQLString(str)

SQL string'ini escape eder.

```typescript
import { escapeSQLString } from '@/utils/security';

const userInput = "test'; DROP TABLE users; --";
const safe = escapeSQLString(userInput);
// Sonuç: "test''; DROP TABLE users; --" (single quotes escaped)

// SQL query oluşturma (Drizzle ORM önerilir)
const query = `SELECT * FROM users WHERE name = '${escapeSQLString(name)}'`;
```

**⚠️ Uyarı:** Mümkün olduğunca parameterized queries kullanın:

```typescript
// ✅ İyi: Drizzle ORM ile parameterized query
const users = await db
  .select()
  .from(usersTable)
  .where(eq(usersTable.name, userInput));

// ❌ Kötü: Raw SQL string concatenation
const users = await db.execute(
  `SELECT * FROM users WHERE name = '${userInput}'`
);
```

### File Upload Validation

#### validateFileType(file, allowedTypes)

Dosya tipinin izin verilen türlerden biri olduğunu kontrol eder.

```typescript
import { validateFileType, ALLOWED_IMAGE_TYPES } from '@/utils/security';

const file = input.files[0];

if (!validateFileType(file, ALLOWED_IMAGE_TYPES)) {
  throw new Error('Sadece JPG, PNG ve WebP dosyaları yüklenebilir');
}

// Custom allowed types
const allowed = ['application/pdf', 'image/jpeg'];
if (!validateFileType(file, allowed)) {
  throw new Error('Geçersiz dosya tipi');
}
```

**Önceden tanımlı type grupları:**
```typescript
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
];
```

#### validateFileSize(file, maxSizeInMB)

Dosya boyutunu kontrol eder.

```typescript
import { validateFileSize } from '@/utils/security';

const file = input.files[0];
const maxSize = 5; // 5 MB

if (!validateFileSize(file, maxSize)) {
  throw new Error(`Dosya boyutu maksimum ${maxSize}MB olmalıdır`);
}
```

#### getFileSizeInMB(file)

Dosya boyutunu MB cinsinden döndürür.

```typescript
import { getFileSizeInMB } from '@/utils/security';

const file = input.files[0];
const sizeInMB = getFileSizeInMB(file);

console.log(`Dosya boyutu: ${sizeInMB.toFixed(2)} MB`);
```

### CSRF Token Helpers

#### generateCSRFToken()

Random CSRF token oluşturur.

```typescript
import { generateCSRFToken } from '@/utils/security';

const token = generateCSRFToken();
// Sonuç: 'a3f8d9c7b2e1...' (32 karakter hex)

// Form'a ekle
<input type="hidden" name="csrf_token" value={token} />
```

#### validateCSRFToken(token, expectedToken)

CSRF token'ı doğrular (constant-time comparison).

```typescript
import { validateCSRFToken } from '@/utils/security';

const isValid = validateCSRFToken(
  submittedToken,
  storedToken
);

if (!isValid) {
  throw new Error('CSRF token doğrulaması başarısız');
}
```

### Comprehensive Examples

#### Form Input Sanitization

```typescript
import { sanitizeHTML, validateEmail, validatePhoneNumber } from '@/utils/security';

function handleFormSubmit(formData: FormData) {
  // Tüm text input'ları temizle
  const sanitized = {
    name: sanitizeHTML(formData.name),
    bio: sanitizeHTML(formData.bio),
    website: formData.website, // URL validation ile birlikte kullan
    email: formData.email, // Email validation ile birlikte kullan
    phone: formData.phone, // Phone validation ile birlikte kullan
  };

  // Validations
  const errors: Record<string, string> = {};

  if (!validateEmail(sanitized.email)) {
    errors.email = 'Geçersiz email adresi';
  }

  if (!validatePhoneNumber(sanitized.phone)) {
    errors.phone = 'Geçersiz telefon numarası';
  }

  if (!validateURL(sanitized.website)) {
    errors.website = 'Geçersiz website URL';
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  // Save to database
  await db.user.create(sanitized);
}
```

#### Profile Photo Upload

```typescript
import {
  validateFileType,
  validateFileSize,
  ALLOWED_IMAGE_TYPES,
} from '@/utils/security';

async function handlePhotoUpload(file: File) {
  // Type validation
  if (!validateFileType(file, ALLOWED_IMAGE_TYPES)) {
    throw new Error('Sadece JPG, PNG ve WebP dosyaları yüklenebilir');
  }

  // Size validation (max 5MB)
  if (!validateFileSize(file, 5)) {
    throw new Error('Dosya boyutu maksimum 5MB olmalıdır');
  }

  // Upload to storage
  const url = await uploadToS3(file);

  // Update database
  await db.escortProfile.update({
    where: { id: profileId },
    data: { profilePhoto: url },
  });
}
```

---

## 🔊 Sound Utilities

### Genel Bakış

Bildirim sesleri yönetimi. Ses dosyalarını preload eder ve çalar.

**Dosya:** `src/utils/sounds.ts`

**Özellikler:**
- ✅ Ses dosyaları preload
- ✅ Ses çalma fonksiyonları
- ✅ Ses seviyesi kontrolü
- ✅ Sessiz mod
- ✅ Multiple instance support
- ✅ Error handling

### API Reference

#### playSound(type)

Bildirim sesi çalar.

```typescript
import { playSound } from '@/utils/sounds';

// Mesaj sesi
playSound('message');

// Bildirim sesi
playSound('notification');

// Arama sesi
playSound('call');

// Başarı sesi
playSound('success');

// Hata sesi
playSound('error');

// Gönderildi sesi
playSound('sent');
```

**Ses tipleri:**
- `message` - Yeni mesaj geldi
- `notification` - Genel bildirim
- `call` - Gelen arama
- `success` - Başarılı işlem
- `error` - Hata oluştu
- `sent` - Mesaj gönderildi

#### setSoundEnabled(enabled)

Sesleri aç/kapat.

```typescript
import { setSoundEnabled, isSoundEnabled } from '@/utils/sounds';

// Sesleri kapat
setSoundEnabled(false);

// Sesleri aç
setSoundEnabled(true);

// Durum kontrolü
if (isSoundEnabled()) {
  playSound('message');
}
```

#### setSoundVolume(volume)

Ses seviyesini ayarla (0.0 - 1.0).

```typescript
import { setSoundVolume, getSoundVolume } from '@/utils/sounds';

// %50 ses seviyesi
setSoundVolume(0.5);

// Maksimum ses
setSoundVolume(1.0);

// Sessiz (muted)
setSoundVolume(0.0);

// Mevcut ses seviyesi
const currentVolume = getSoundVolume();
console.log(`Ses seviyesi: ${currentVolume * 100}%`);
```

#### preloadSounds()

Tüm ses dosyalarını önceden yükler (performance optimization).

```typescript
import { preloadSounds } from '@/utils/sounds';

// App başlangıcında
useEffect(() => {
  preloadSounds();
}, []);
```

### Kullanım Örnekleri

#### Message Notification

```typescript
import { playSound } from '@/utils/sounds';

function handleNewMessage(message: Message) {
  // Bildirim göster
  showNotification(message.senderName, {
    body: message.content,
  });

  // Ses çal
  playSound('message');

  // Badge sayısını artır
  updateBadgeCount(unreadCount + 1);
}
```

#### Settings Page

```typescript
import {
  isSoundEnabled,
  setSoundEnabled,
  getSoundVolume,
  setSoundVolume,
  playSound,
} from '@/utils/sounds';

function SoundSettings() {
  const [enabled, setEnabled] = useState(isSoundEnabled());
  const [volume, setVolume] = useState(getSoundVolume());

  const handleToggle = (value: boolean) => {
    setEnabled(value);
    setSoundEnabled(value);
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    setSoundVolume(value);
  };

  const handleTest = () => {
    playSound('notification');
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => handleToggle(e.target.checked)}
        />
        Sesleri Etkinleştir
      </label>

      <label>
        Ses Seviyesi: {Math.round(volume * 100)}%
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          disabled={!enabled}
        />
      </label>

      <button onClick={handleTest} disabled={!enabled}>
        Test Ses
      </button>
    </div>
  );
}
```

#### Success/Error Feedback

```typescript
import { playSound } from '@/utils/sounds';

async function handleFormSubmit(data: FormData) {
  try {
    await api.submit(data);

    // Başarı sesi
    playSound('success');
    toast.success('Form başarıyla gönderildi!');
  } catch (error) {
    // Hata sesi
    playSound('error');
    toast.error('Form gönderilemedi!');
  }
}
```

---

## 🎨 Formatting Utilities

### String Formatting

```typescript
/**
 * Capitalize first letter of string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
}

/**
 * Remove extra whitespace
 */
export function normalizeWhitespace(str: string): string {
  return str.replace(/\s+/g, ' ').trim();
}

// Usage
const title = capitalize('hello world'); // 'Hello world'
const preview = truncate(article.content, 100); // 'Lorem ipsum...'
const clean = normalizeWhitespace('  Hello   World  '); // 'Hello World'
```

### Number Formatting

```typescript
/**
 * Format number as currency (Turkish Lira)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(amount);
}

/**
 * Format number with thousand separators
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('tr-TR').format(num);
}

// Usage
const price = formatCurrency(1500); // '₺1.500,00'
const views = formatNumber(15234); // '15.234'
```

### Date Formatting

```typescript
/**
 * Format date relative to now (2 saat önce, dün, etc.)
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Az önce';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} dakika önce`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} saat önce`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} gün önce`;

  return new Intl.DateTimeFormat('tr-TR').format(date);
}

/**
 * Format date as Turkish locale
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

// Usage
const lastSeen = formatRelativeTime(new Date('2026-01-22T10:00:00'));
// '4 saat önce'

const publishedDate = formatDate(new Date('2026-01-15'));
// '15 Ocak 2026'
```

---

## 🧪 Testing

```typescript
import {
  sanitizeHTML,
  validateEmail,
  validatePhoneNumber,
  formatCurrency,
} from '@/utils/security';

describe('Security Utils', () => {
  test('should sanitize HTML', () => {
    const dirty = '<script>alert("XSS")</script><p>Safe</p>';
    const clean = sanitizeHTML(dirty);
    expect(clean).not.toContain('<script>');
    expect(clean).toContain('<p>Safe</p>');
  });

  test('should validate email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('invalid')).toBe(false);
  });

  test('should validate Turkish phone', () => {
    expect(validatePhoneNumber('05551234567')).toBe(true);
    expect(validatePhoneNumber('123')).toBe(false);
  });

  test('should format currency', () => {
    expect(formatCurrency(1500)).toBe('₺1.500,00');
  });
});
```

---

## 📦 Utility Organization

```
src/utils/
├── security.ts         # Security utilities
├── sounds.ts           # Sound management
├── formatting.ts       # String/number/date formatting (planned)
├── storage.ts          # LocalStorage helpers (planned)
└── validation.ts       # Additional validators (planned)
```

---

## 🔗 İlgili Dökümantasyon

- [Security Module](../lib/security/README.md) - Advanced security features
- [Services](../services/README.md) - API services
- [Hooks](../hooks/README.md) - Custom React hooks
- [Types](../types/README.md) - TypeScript definitions

---

**Dökümantasyon Versiyonu:** 1.0  
**Son Güncelleme:** 22 Ocak 2026
