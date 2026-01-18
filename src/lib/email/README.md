# Email Module / Email Modülü

> **EN:** Email sending infrastructure for the escort platform. Built with Nodemailer, includes templates and queue system.  
> **TR:** Escort platformu için email gönderme altyapısı. Nodemailer tabanlı, şablon desteği ve kuyruk sistemi ile.

---

## 📁 File Structure / Dosya Yapısı

```
src/lib/email/
├── client.ts                      # EN: Email client (Nodemailer) / TR: Email istemcisi (Nodemailer)
├── queue.ts                       # EN: Email queue system / TR: Email kuyruk sistemi
├── templates/                     # EN: Email templates / TR: Email şablonları
│   ├── welcome.tsx                # EN: Welcome email / TR: Hoş geldin emaili
│   ├── booking-confirmation.tsx   # EN: Booking confirmation / TR: Randevu onay emaili
│   ├── password-reset.tsx         # EN: Password reset / TR: Şifre sıfırlama
│   └── verification.tsx           # EN: Email verification / TR: Email doğrulama
└── README.md                      # EN: This file / TR: Bu dosya
```

---

## 🚀 Quick Start / Hızlı Başlangıç

### Environment Variables / Ortam Değişkenleri

**English:**

Add to your `.env` file:

```bash
# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@escortplatform.com
EMAIL_FROM_NAME=Escort Platform
```

**Türkçe:**

`.env` dosyanıza ekleyin:

```bash
# Email Konfigürasyonu (Gmail örneği)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=sizin-emailiniz@gmail.com
EMAIL_PASSWORD=sizin-uygulama-sifreniz
EMAIL_FROM=noreply@escortplatform.com
EMAIL_FROM_NAME=Escort Platform
```

---

### Gmail App Password Setup / Gmail Uygulama Şifresi Oluşturma

**English:**

1. Go to Google Account: https://myaccount.google.com/
2. Navigate to: Security > 2-Step Verification > App passwords
3. Create a new app password
4. Use the generated password as `EMAIL_PASSWORD`

**Türkçe:**

1. Google hesabınıza gidin: https://myaccount.google.com/
2. Security > 2-Step Verification > App passwords adımlarını izleyin
3. Yeni bir app password oluşturun
4. Oluşturulan şifreyi `EMAIL_PASSWORD` olarak kullanın

---

### Basic Usage / Temel Kullanım

**English:**

```typescript
import { sendEmail } from '@/lib/email/client';

// Send a simple email
await sendEmail({
  to: 'user@example.com',
  subject: 'Test Email',
  html: '<h1>Hello!</h1>',
  text: 'Hello!',
});
```

**Türkçe:**

```typescript
import { sendEmail } from '@/lib/email/client';

// Basit email gönderimi
await sendEmail({
  to: 'kullanici@example.com',
  subject: 'Test Email',
  html: '<h1>Merhaba!</h1>',
  text: 'Merhaba!',
});
```

---

## 📧 Email Templates / Email Şablonları

### Welcome Email / Hoş Geldin Emaili

**English:**

```typescript
import {
  renderWelcomeEmail,
  renderWelcomeEmailText,
} from '@/lib/email/templates/welcome';
import { sendEmail } from '@/lib/email/client';

const html = renderWelcomeEmail({
  userName: 'John Doe',
  userEmail: 'john@example.com',
  userRole: 'client',
  loginUrl: 'https://platform.com/login',
});

const text = renderWelcomeEmailText({
  userName: 'John Doe',
  userEmail: 'john@example.com',
  userRole: 'client',
});

await sendEmail({
  to: 'john@example.com',
  subject: 'Welcome!',
  html,
  text,
});
```

**Türkçe:**

```typescript
import {
  renderWelcomeEmail,
  renderWelcomeEmailText,
} from '@/lib/email/templates/welcome';
import { sendEmail } from '@/lib/email/client';

const html = renderWelcomeEmail({
  userName: 'Ahmet Yılmaz',
  userEmail: 'ahmet@example.com',
  userRole: 'client',
  loginUrl: 'https://platform.com/login',
});

const text = renderWelcomeEmailText({
  userName: 'Ahmet Yılmaz',
  userEmail: 'ahmet@example.com',
  userRole: 'client',
});

await sendEmail({
  to: 'ahmet@example.com',
  subject: 'Hoş Geldiniz!',
  html,
  text,
});
```

---

### Booking Confirmation / Randevu Onayı

**English:**

```typescript
import {
  renderBookingConfirmationEmail,
} from '@/lib/email/templates/booking-confirmation';

const html = renderBookingConfirmationEmail({
  bookingId: 123,
  clientName: 'John Doe',
  escortName: 'Jane',
  startTime: new Date('2026-01-20 14:00'),
  endTime: new Date('2026-01-20 16:00'),
  duration: 2,
  totalAmount: 1000,
  location: 'Istanbul, Beşiktaş',
  notes: 'Please be on time.',
  cancelUrl: 'https://platform.com/bookings/123/cancel',
});

await sendEmail({
  to: 'john@example.com',
  subject: 'Booking Confirmation #123',
  html,
});
```

**Türkçe:**

```typescript
import {
  renderBookingConfirmationEmail,
} from '@/lib/email/templates/booking-confirmation';

const html = renderBookingConfirmationEmail({
  bookingId: 123,
  clientName: 'Ahmet Yılmaz',
  escortName: 'Ayşe',
  startTime: new Date('2026-01-20 14:00'),
  endTime: new Date('2026-01-20 16:00'),
  duration: 2,
  totalAmount: 1000,
  location: 'Istanbul, Beşiktaş',
  notes: 'Lütfen zamanında gelin.',
  cancelUrl: 'https://platform.com/bookings/123/cancel',
});

await sendEmail({
  to: 'ahmet@example.com',
  subject: 'Randevu Onayı #123',
  html,
});
```

---

### Password Reset / Şifre Sıfırlama

**English:**

```typescript
import {
  renderPasswordResetEmail,
} from '@/lib/email/templates/password-reset';

const html = renderPasswordResetEmail({
  userName: 'John Doe',
  resetUrl: 'https://platform.com/reset-password?token=abc123',
  expiryHours: 1,
});

await sendEmail({
  to: 'john@example.com',
  subject: 'Password Reset Request',
  html,
});
```

**Türkçe:**

```typescript
import {
  renderPasswordResetEmail,
} from '@/lib/email/templates/password-reset';

const html = renderPasswordResetEmail({
  userName: 'Ahmet Yılmaz',
  resetUrl: 'https://platform.com/reset-password?token=abc123',
  expiryHours: 1,
});

await sendEmail({
  to: 'ahmet@example.com',
  subject: 'Şifre Sıfırlama Talebi',
  html,
});
```

---

### Email Verification / Email Doğrulama

**English:**

```typescript
import {
  renderVerificationEmail,
} from '@/lib/email/templates/verification';

const html = renderVerificationEmail({
  userName: 'John Doe',
  verificationUrl: 'https://platform.com/verify?token=xyz789',
  expiryHours: 24,
});

await sendEmail({
  to: 'john@example.com',
  subject: 'Verify Your Email Address',
  html,
});
```

**Türkçe:**

```typescript
import {
  renderVerificationEmail,
} from '@/lib/email/templates/verification';

const html = renderVerificationEmail({
  userName: 'Ahmet Yılmaz',
  verificationUrl: 'https://platform.com/verify?token=xyz789',
  expiryHours: 24,
});

await sendEmail({
  to: 'ahmet@example.com',
  subject: 'Email Adresinizi Doğrulayın',
  html,
});
```

---

## 🔄 Email Queue / Email Kuyruğu

**English:**

The email queue system provides asynchronous email sending and retry mechanism:

```typescript
import {
  enqueueEmail,
  sendEmailQueued,
  getQueueStatus,
} from '@/lib/email/queue';

// Add email to queue
enqueueEmail({
  to: 'user@example.com',
  subject: 'Test',
  html: '<h1>Test</h1>',
});

// Or use shortcut:
sendEmailQueued({
  to: 'user@example.com',
  subject: 'Test',
  html: '<h1>Test</h1>',
});

// Check queue status
const status = getQueueStatus();
console.log(status);
// {
//   total: 5,
//   pending: 3,
//   retrying: 2,
//   scheduled: 1
// }
```

**Türkçe:**

Email kuyruk sistemi asenkron email gönderimi ve retry mekanizması sağlar:

```typescript
import {
  enqueueEmail,
  sendEmailQueued,
  getQueueStatus,
} from '@/lib/email/queue';

// Kuyruğa email ekle
enqueueEmail({
  to: 'kullanici@example.com',
  subject: 'Test',
  html: '<h1>Test</h1>',
});

// veya kısayol kullan:
sendEmailQueued({
  to: 'kullanici@example.com',
  subject: 'Test',
  html: '<h1>Test</h1>',
});

// Kuyruk durumunu kontrol et
const durum = getQueueStatus();
console.log(durum);
// {
//   total: 5,
//   pending: 3,
//   retrying: 2,
//   scheduled: 1
// }
```

---

### Queue Features / Kuyruk Özellikleri

**English:**
- **Auto-retry**: Failed emails are automatically retried (max 3 times)
- **Rate limiting**: Maximum 10 emails per minute
- **Scheduling**: Schedule emails for future delivery
- **Non-blocking**: Email sending doesn't block main workflow

**Türkçe:**
- **Otomatik tekrar deneme**: Başarısız emailler otomatik olarak tekrar denenir (max 3 kez)
- **Rate limiting**: Dakikada maximum 10 email
- **Zamanlama**: İleri bir tarih için email planlayabilirsiniz
- **Non-blocking**: Email gönderimi ana iş akışını engellemez

---

### Bulk Email / Toplu Email

**English:**

```typescript
import { sendBulkEmailsQueued } from '@/lib/email/queue';

const emails = [
  { to: 'user1@example.com', subject: 'Test 1', html: '<h1>Test 1</h1>' },
  { to: 'user2@example.com', subject: 'Test 2', html: '<h1>Test 2</h1>' },
  { to: 'user3@example.com', subject: 'Test 3', html: '<h1>Test 3</h1>' },
];

const queueIds = sendBulkEmailsQueued(emails);
```

**Türkçe:**

```typescript
import { sendBulkEmailsQueued } from '@/lib/email/queue';

const emailler = [
  { to: 'kullanici1@example.com', subject: 'Test 1', html: '<h1>Test 1</h1>' },
  { to: 'kullanici2@example.com', subject: 'Test 2', html: '<h1>Test 2</h1>' },
  { to: 'kullanici3@example.com', subject: 'Test 3', html: '<h1>Test 3</h1>' },
];

const kuyrukIdleri = sendBulkEmailsQueued(emailler);
```

---

## 🎨 Email Template Features / Email Şablon Özellikleri

**English:**

All email templates include:
- ✅ Responsive design (mobile-friendly)
- ✅ HTML + Plain Text versions
- ✅ Turkish language support
- ✅ Modern and professional appearance
- ✅ Brand consistency
- ✅ Dark mode compatible colors

**Türkçe:**

Tüm email templateler:
- ✅ Responsive tasarım (mobil uyumlu)
- ✅ HTML + Plain Text versiyonları
- ✅ Türkçe dil desteği
- ✅ Modern ve profesyonel görünüm
- ✅ Marka tutarlılığı
- ✅ Dark mode uyumlu renkler

---

## 🔧 Advanced Usage / Gelişmiş Kullanım

### Attachments / Ekler

**English:**

```typescript
await sendEmail({
  to: 'user@example.com',
  subject: 'Invoice',
  html: '<p>Your invoice is attached.</p>',
  attachments: [
    {
      filename: 'invoice.pdf',
      path: '/path/to/invoice.pdf',
    },
    {
      filename: 'logo.png',
      content: Buffer.from('...'),
    },
  ],
});
```

**Türkçe:**

```typescript
await sendEmail({
  to: 'kullanici@example.com',
  subject: 'Fatura',
  html: '<p>Faturanız ektedir.</p>',
  attachments: [
    {
      filename: 'fatura.pdf',
      path: '/yol/fatura.pdf',
    },
    {
      filename: 'logo.png',
      content: Buffer.from('...'),
    },
  ],
});
```

---

### CC & BCC

**English:**

```typescript
await sendEmail({
  to: 'user@example.com',
  cc: ['manager@example.com'],
  bcc: ['archive@example.com'],
  subject: 'Important Email',
  html: '<p>Content</p>',
});
```

**Türkçe:**

```typescript
await sendEmail({
  to: 'kullanici@example.com',
  cc: ['yonetici@example.com'],
  bcc: ['arsiv@example.com'],
  subject: 'Önemli Email',
  html: '<p>İçerik</p>',
});
```

---

### Custom Reply-To / Özel Yanıtla Adresi

**English:**

```typescript
await sendEmail({
  to: 'user@example.com',
  subject: 'Support Email',
  html: '<p>How can we help?</p>',
  replyTo: 'support@example.com',
});
```

**Türkçe:**

```typescript
await sendEmail({
  to: 'kullanici@example.com',
  subject: 'Destek Emaili',
  html: '<p>Nasıl yardımcı olabiliriz?</p>',
  replyTo: 'destek@example.com',
});
```

---

## 🧪 Testing / Test

**English:**

In development environment without email credentials, Ethereal Email is used:

```typescript
import { verifyEmailConfig } from '@/lib/email/client';

// Check email configuration
const isValid = await verifyEmailConfig();

if (!isValid) {
  console.log('Email not configured, using test account');
}
```

**Türkçe:**

Development ortamında email credentials yoksa, Ethereal Email kullanılır:

```typescript
import { verifyEmailConfig } from '@/lib/email/client';

// Email config kontrolü
const gecerliMi = await verifyEmailConfig();

if (!gecerliMi) {
  console.log('Email yapılandırılmamış, test hesabı kullanılıyor');
}
```

---

## 📊 Production Recommendations / Production Önerileri

### Queue System / Kuyruk Sistemi

**English:**

In-memory queue is suitable for development, but for production:
- **Redis + Bull/BullMQ**: Distributed queue system
- **AWS SQS**: Cloud-based queue
- **RabbitMQ**: Message broker

**Türkçe:**

In-memory queue development için uygundur, ancak production için:
- **Redis + Bull/BullMQ**: Distributed queue sistemi
- **AWS SQS**: Cloud-based queue
- **RabbitMQ**: Message broker

---

### Email Provider / Email Sağlayıcı

**English:**
- **SendGrid**: Reliable, scalable
- **AWS SES**: Low cost
- **Mailgun**: Developer-friendly
- **SMTP**: Your own server

**Türkçe:**
- **SendGrid**: Güvenilir, ölçeklenebilir
- **AWS SES**: Düşük maliyet
- **Mailgun**: Developer-friendly
- **SMTP**: Kendi sunucunuz

---

### Monitoring / İzleme

**English:**

```typescript
import { getQueueStatus } from '@/lib/email/queue';

// Periodic queue monitoring
setInterval(() => {
  const status = getQueueStatus();
  
  if (status.retrying > 10) {
    console.warn('Too many failing emails!');
  }
}, 60000);
```

**Türkçe:**

```typescript
import { getQueueStatus } from '@/lib/email/queue';

// Periyodik kuyruk monitoring
setInterval(() => {
  const durum = getQueueStatus();
  
  if (durum.retrying > 10) {
    console.warn('Çok fazla başarısız email!');
  }
}, 60000);
```

---

## �� Resources / Kaynaklar

- [Nodemailer Documentation / Dokümantasyon](https://nodemailer.com/)
- [Email Design Best Practices / Email Tasarım En İyi Uygulamalar](https://www.campaignmonitor.com/dev-resources/guides/coding/)
- [SMTP Service Providers / SMTP Servis Sağlayıcıları](https://nodemailer.com/smtp/well-known/)

---

## 📞 Support / Destek

**English:**

For email sending issues:
1. Check environment variables
2. Verify SMTP credentials
3. Check firewall/security settings
4. Review email provider limits

**Türkçe:**

Email gönderimi ile ilgili sorunlar için:
1. Environment variables kontrolü
2. SMTP credentials doğrulaması
3. Firewall/güvenlik ayarları
4. Email provider limitleri
