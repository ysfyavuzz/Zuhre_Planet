# Email Module

Escort platformu için email gönderme altyapısı. Nodemailer tabanlı, şablon desteği ve kuyruk sistemi ile.

## 📁 Dosya Yapısı

```
src/lib/email/
├── client.ts                      # Email client (Nodemailer)
├── queue.ts                       # Email queue sistemi
├── templates/                     # Email şablonları
│   ├── welcome.tsx                # Hoş geldin emaili
│   ├── booking-confirmation.tsx   # Randevu onay emaili
│   ├── password-reset.tsx         # Şifre sıfırlama
│   └── verification.tsx           # Email doğrulama
└── README.md                      # Bu dosya
```

## 🚀 Hızlı Başlangıç

### Environment Variables

`.env` dosyanıza ekleyin:

```bash
# Email Configuration (Gmail örneği)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@escortplatform.com
EMAIL_FROM_NAME=Escort Platform
```

### Gmail App Password Oluşturma

1. Google hesabınıza gidin: https://myaccount.google.com/
2. Security > 2-Step Verification > App passwords
3. Yeni bir app password oluşturun
4. Oluşturulan şifreyi `EMAIL_PASSWORD` olarak kullanın

### Temel Kullanım

```typescript
import { sendEmail } from '@/lib/email/client';

// Basit email gönderimi
await sendEmail({
  to: 'user@example.com',
  subject: 'Test Email',
  html: '<h1>Merhaba!</h1>',
  text: 'Merhaba!',
});
```

## 📧 Email Templates

### Welcome Email

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

### Booking Confirmation

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

### Password Reset

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

### Email Verification

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

## 🔄 Email Queue

Email queue sistemi asenkron email gönderimi ve retry mekanizması sağlar:

```typescript
import {
  enqueueEmail,
  sendEmailQueued,
  getQueueStatus,
} from '@/lib/email/queue';

// Queue'ya email ekle
enqueueEmail({
  to: 'user@example.com',
  subject: 'Test',
  html: '<h1>Test</h1>',
});

// veya kısayol:
sendEmailQueued({
  to: 'user@example.com',
  subject: 'Test',
  html: '<h1>Test</h1>',
});

// Queue durumunu kontrol et
const status = getQueueStatus();
console.log(status);
// {
//   total: 5,
//   pending: 3,
//   retrying: 2,
//   scheduled: 1
// }
```

### Özellikler

- **Auto-retry**: Başarısız emailler otomatik olarak tekrar denenir (max 3 kez)
- **Rate limiting**: Dakikada maximum 10 email
- **Scheduling**: İleri bir tarih için email planlayabilirsiniz
- **Non-blocking**: Email gönderimi ana iş akışını engellemez

### Bulk Email

```typescript
import { sendBulkEmailsQueued } from '@/lib/email/queue';

const emails = [
  { to: 'user1@example.com', subject: 'Test 1', html: '<h1>Test 1</h1>' },
  { to: 'user2@example.com', subject: 'Test 2', html: '<h1>Test 2</h1>' },
  { to: 'user3@example.com', subject: 'Test 3', html: '<h1>Test 3</h1>' },
];

const queueIds = sendBulkEmailsQueued(emails);
```

## 🎨 Email Template Özellikleri

Tüm email templateler:

- ✅ Responsive tasarım (mobil uyumlu)
- ✅ HTML + Plain Text versiyonları
- ✅ Türkçe dil desteği
- ✅ Modern ve profesyonel görünüm
- ✅ Marka tutarlılığı
- ✅ Dark mode uyumlu renkler

## 🔧 Advanced Kullanım

### Attachments

```typescript
await sendEmail({
  to: 'user@example.com',
  subject: 'Invoice',
  html: '<p>Faturanız ektedir.</p>',
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

### CC & BCC

```typescript
await sendEmail({
  to: 'user@example.com',
  cc: ['manager@example.com'],
  bcc: ['archive@example.com'],
  subject: 'Important Email',
  html: '<p>Content</p>',
});
```

### Custom From

```typescript
await sendEmail({
  to: 'user@example.com',
  subject: 'Support Email',
  html: '<p>How can we help?</p>',
  replyTo: 'support@example.com',
});
```

## 🧪 Testing

Development ortamında email credentials yoksa, Ethereal Email kullanılır:

```typescript
import { verifyEmailConfig } from '@/lib/email/client';

// Email config kontrolü
const isValid = await verifyEmailConfig();

if (!isValid) {
  console.log('Email not configured, using test account');
}
```

## 📊 Production Recommendations

### Queue Sistemi

In-memory queue development için uygundur, ancak production için:

- **Redis + Bull/BullMQ**: Distributed queue sistemi
- **AWS SQS**: Cloud-based queue
- **RabbitMQ**: Message broker

### Email Provider

- **SendGrid**: Güvenilir, ölçeklenebilir
- **AWS SES**: Düşük maliyet
- **Mailgun**: Developer-friendly
- **SMTP**: Kendi sunucunuz

### Monitoring

```typescript
import { getQueueStatus } from '@/lib/email/queue';

// Periyodik queue monitoring
setInterval(() => {
  const status = getQueueStatus();
  
  if (status.retrying > 10) {
    console.warn('Too many failing emails!');
  }
}, 60000);
```

## 🔗 Kaynaklar

- [Nodemailer Documentation](https://nodemailer.com/)
- [Email Design Best Practices](https://www.campaignmonitor.com/dev-resources/guides/coding/)
- [SMTP Service Providers](https://nodemailer.com/smtp/well-known/)

## 📞 Destek

Email gönderimi ile ilgili sorunlar için:

1. Environment variables kontrolü
2. SMTP credentials doğrulaması
3. Firewall/güvenlik ayarları
4. Email provider limitleri
