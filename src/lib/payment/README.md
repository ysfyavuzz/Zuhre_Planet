# Payment Integration Module / Ödeme Entegrasyonu Modülü

> **EN:** Iyzico payment integration module for the escort platform.  
> **TR:** Escort platformu için Iyzico ödeme entegrasyonu modülü.

---

## 📁 File Structure / Dosya Yapısı

```
src/lib/payment/
├── types.ts       # EN: TypeScript type definitions / TR: TypeScript tip tanımlamaları
├── iyzico.ts      # EN: Iyzico API client / TR: Iyzico API istemcisi
├── utils.ts       # EN: Helper functions / TR: Yardımcı fonksiyonlar
├── webhooks.ts    # EN: Webhook handler / TR: Webhook yöneticisi
└── README.md      # EN: This file / TR: Bu dosya
```

---

## 🚀 Quick Start / Hızlı Başlangıç

### Environment Variables / Ortam Değişkenleri

**English:**

Add to your `.env` file:

```bash
# Iyzico API Credentials
IYZICO_API_KEY=your_api_key_here
IYZICO_SECRET_KEY=your_secret_key_here
IYZICO_BASE_URL=https://sandbox-api.iyzipay.com  # or production URL
IYZICO_WEBHOOK_SECRET=your_webhook_secret_here

# Application URL
VITE_APP_URL=http://localhost:3000
```

**Türkçe:**

`.env` dosyanıza ekleyin:

```bash
# Iyzico API Kimlik Bilgileri
IYZICO_API_KEY=sizin_api_anahtariniz
IYZICO_SECRET_KEY=sizin_gizli_anahtariniz
IYZICO_BASE_URL=https://sandbox-api.iyzipay.com  # veya production URL
IYZICO_WEBHOOK_SECRET=sizin_webhook_gizli_anahtariniz

# Uygulama URL'i
VITE_APP_URL=http://localhost:3000
```

---

### Basic Usage / Temel Kullanım

**English:**

```typescript
import { IyzicoClient } from '@/lib/payment/iyzico';
import { formatPrice } from '@/lib/payment/utils';

// Create client
const iyzicoClient = new IyzicoClient();

// Initiate payment
const payment = await iyzicoClient.initiatePayment({
  amount: 50000, // 500 TL (in kuruş - smallest currency unit)
  currency: 'TRY',
  description: 'VIP Membership - 1 Month',
  userId: 123,
  packageId: 'vip-monthly',
  callbackUrl: 'https://yoursite.com/payment/callback',
});

if (payment.success) {
  // Redirect user to checkout page
  window.location.href = payment.checkoutUrl;
}
```

**Türkçe:**

```typescript
import { IyzicoClient } from '@/lib/payment/iyzico';
import { formatPrice } from '@/lib/payment/utils';

// İstemci oluştur
const iyzicoClient = new IyzicoClient();

// Ödeme başlat
const payment = await iyzicoClient.initiatePayment({
  amount: 50000, // 500 TL (kuruş cinsinden)
  currency: 'TRY',
  description: 'VIP Üyelik - 1 Ay',
  userId: 123,
  packageId: 'vip-monthly',
  callbackUrl: 'https://yoursite.com/payment/callback',
});

if (payment.success) {
  // Kullanıcıyı checkout sayfasına yönlendir
  window.location.href = payment.checkoutUrl;
}
```

---

## 📋 Features / Özellikler

### 1. Payment Operations / Ödeme İşlemleri

**English:**
- ✅ Credit card payments
- ✅ 3D Secure support
- ✅ Installment options
- ✅ Payment verification
- ✅ Refund processing

**Türkçe:**
- ✅ Kredi kartı ödemeleri
- ✅ 3D Secure desteği
- ✅ Taksit seçenekleri
- ✅ Ödeme doğrulama
- ✅ İade işlemleri

### 2. Type Safety / Tip Güvenliği

**English:**

TypeScript type definitions for all payment operations:

```typescript
import type {
  PaymentRequest,
  PaymentResponse,
  PaymentStatus,
  CreditPackage,
} from '@/lib/payment/types';
```

**Türkçe:**

Tüm ödeme işlemleri için TypeScript tip tanımlamaları:

```typescript
import type {
  PaymentRequest,
  PaymentResponse,
  PaymentStatus,
  CreditPackage,
} from '@/lib/payment/types';
```

### 3. Utility Functions / Yardımcı Fonksiyonlar

**English:**

```typescript
import {
  formatPrice,
  convertToSmallestUnit,
  validateAmount,
  calculateDiscount,
  validateCardNumber,
  maskCardNumber,
} from '@/lib/payment/utils';

// Price formatting
formatPrice(50000, 'TRY'); // "500,00 TL"

// Currency conversion
convertToSmallestUnit(500); // 50000 kuruş

// Discount calculation
calculateDiscount(100000, 20); // 80000 (20% discount)

// Card number validation
validateCardNumber('4242424242424242'); // true

// Card number masking
maskCardNumber('4242424242424242'); // "************4242"
```

**Türkçe:**

```typescript
import {
  formatPrice,
  convertToSmallestUnit,
  validateAmount,
  calculateDiscount,
  validateCardNumber,
  maskCardNumber,
} from '@/lib/payment/utils';

// Fiyat formatlama
formatPrice(50000, 'TRY'); // "500,00 TL"

// Para birimi dönüşümü
convertToSmallestUnit(500); // 50000 kuruş

// İndirim hesaplama
calculateDiscount(100000, 20); // 80000 (20% indirim)

// Kart numarası validasyonu
validateCardNumber('4242424242424242'); // true

// Kart numarası maskeleme
maskCardNumber('4242424242424242'); // "************4242"
```

### 4. Webhook Handling / Webhook Yönetimi

**English:**

```typescript
import { handlePaymentWebhook } from '@/lib/payment/webhooks';

// In your webhook endpoint
app.post('/api/payment/webhook', async (req, res) => {
  const result = await handlePaymentWebhook(
    req.body,
    req.headers,
    {
      secretKey: process.env.IYZICO_WEBHOOK_SECRET,
      allowedIPs: ['185.86.130.0/24'], // Iyzico IP range
    }
  );

  res.status(result.success ? 200 : 400).json(result);
});
```

**Türkçe:**

```typescript
import { handlePaymentWebhook } from '@/lib/payment/webhooks';

// Webhook endpoint'inizde
app.post('/api/payment/webhook', async (req, res) => {
  const result = await handlePaymentWebhook(
    req.body,
    req.headers,
    {
      secretKey: process.env.IYZICO_WEBHOOK_SECRET,
      allowedIPs: ['185.86.130.0/24'], // Iyzico IP aralığı
    }
  );

  res.status(result.success ? 200 : 400).json(result);
});
```

---

## 🔐 Security / Güvenlik

### Webhook Validation / Webhook Doğrulama

**English:**

Webhooks undergo the following security checks:

1. **Signature Verification**: HMAC-SHA256 signature validation
2. **IP Whitelist**: Only requests from Iyzico IPs are accepted
3. **Payload Validation**: Incoming data structure is validated

**Türkçe:**

Webhook'lar aşağıdaki güvenlik kontrollerinden geçer:

1. **İmza Doğrulama**: HMAC-SHA256 imza validasyonu
2. **IP Beyaz Listesi**: Sadece Iyzico IP'lerinden gelen istekler kabul edilir
3. **Payload Validasyonu**: Gelen veri yapısı doğrulanır

### PCI-DSS Compliance / PCI-DSS Uyumluluğu

**English:**
- ❌ Card information is never stored on the server
- ✅ All payment processing is done through Iyzico
- ✅ 3D Secure is mandatory
- ✅ SSL/TLS encryption

**Türkçe:**
- ❌ Kart bilgileri asla sunucuda saklanmaz
- ✅ Tüm ödeme işlemleri Iyzico üzerinden yapılır
- ✅ 3D Secure zorunlu
- ✅ SSL/TLS şifrelemesi

---

## 💳 Payment Flow / Ödeme Akışı

### 1. Payment Initiation / Ödeme Başlatma

**English:**
```
User → App: Select credit package
App → Iyzico: initiatePayment()
Iyzico → App: checkoutUrl
App → User: Redirect to checkout page
```

**Türkçe:**
```
Kullanıcı → Uygulama: Kredi paketi seç
Uygulama → Iyzico: initiatePayment()
Iyzico → Uygulama: checkoutUrl
Uygulama → Kullanıcı: Checkout sayfasına yönlendir
```

### 2. Payment Processing / Ödeme İşleme

**English:**
```
User → Iyzico: Enter card information
Iyzico → Bank: 3D Secure verification
Bank → Iyzico: Approval
Iyzico → App: Callback (token)
App → Iyzico: verifyPayment(token)
Iyzico → App: Payment details
App → DB: Add credits
App → User: Success message
```

**Türkçe:**
```
Kullanıcı → Iyzico: Kart bilgilerini gir
Iyzico → Banka: 3D Secure doğrulama
Banka → Iyzico: Onay
Iyzico → Uygulama: Callback (token)
Uygulama → Iyzico: verifyPayment(token)
Iyzico → Uygulama: Ödeme detayları
Uygulama → DB: Kredi ekle
Uygulama → Kullanıcı: Başarı mesajı
```

### 3. Webhook Processing / Webhook İşleme

**English:**
```
Iyzico → App: Webhook (payment.success)
App → App: Verify signature
App → DB: Record transaction
App → DB: Update balance
App → Iyzico: 200 OK
```

**Türkçe:**
```
Iyzico → Uygulama: Webhook (payment.success)
Uygulama → Uygulama: İmza doğrula
Uygulama → DB: Transaction kaydet
Uygulama → DB: Bakiye güncelle
Uygulama → Iyzico: 200 OK
```

---

## 📦 Credit Packages / Kredi Paketleri

**English:**

Example package definitions:

```typescript
const creditPackages: CreditPackage[] = [
  {
    id: 'credits-100',
    name: '100 Credits',
    credits: 100,
    price: 10000, // 100 TL
    currency: 'TRY',
  },
  {
    id: 'credits-500',
    name: '500 Credits',
    credits: 500,
    price: 45000, // 450 TL (10% discount)
    currency: 'TRY',
    discount: 10,
    popular: true,
  },
  {
    id: 'credits-1000',
    name: '1000 Credits',
    credits: 1000,
    price: 80000, // 800 TL (20% discount)
    currency: 'TRY',
    discount: 20,
  },
];
```

**Türkçe:**

Örnek paket tanımlamaları:

```typescript
const creditPackages: CreditPackage[] = [
  {
    id: 'credits-100',
    name: '100 Kredi',
    credits: 100,
    price: 10000, // 100 TL
    currency: 'TRY',
  },
  {
    id: 'credits-500',
    name: '500 Kredi',
    credits: 500,
    price: 45000, // 450 TL (10% indirim)
    currency: 'TRY',
    discount: 10,
    popular: true,
  },
  {
    id: 'credits-1000',
    name: '1000 Kredi',
    credits: 1000,
    price: 80000, // 800 TL (20% indirim)
    currency: 'TRY',
    discount: 20,
  },
];
```

---

## 🧪 Test Cards (Sandbox) / Test Kartları (Sandbox)

**English:**

For testing in Iyzico sandbox environment:

| Card Number       | Result   | 3D Secure |
|-------------------|----------|-----------|
| 5528790000000008  | Success  | Yes       |
| 4242424242424242  | Success  | No        |
| 5406675406675403  | Failed   | Yes       |

**CVV:** Any 3 digits  
**Expiry:** Any future date  
**3D Password:** 123456

**Türkçe:**

Iyzico sandbox ortamında test için:

| Kart Numarası     | Sonuç    | 3D Secure |
|-------------------|----------|-----------|
| 5528790000000008  | Başarılı | Evet      |
| 4242424242424242  | Başarılı | Hayır     |
| 5406675406675403  | Hatalı   | Evet      |

**CVV:** Herhangi 3 rakam  
**Son Kullanma:** Gelecekteki herhangi bir tarih  
**3D Şifresi:** 123456

---

## ⚠️ Important Notes / Önemli Notlar

### Development / Geliştirme

**English:**
- Use sandbox URL: `https://sandbox-api.iyzipay.com`
- Use test API key/secret
- Test with test cards

**Türkçe:**
- Sandbox URL kullanın: `https://sandbox-api.iyzipay.com`
- Test API key/secret kullanın
- Test kartlarıyla ödeme yapın

### Production / Canlı Ortam

**English:**
- Switch to production URL: `https://api.iyzipay.com`
- Use real API credentials
- SSL certificate is mandatory
- Define webhook URL in Iyzico panel

**Türkçe:**
- Production URL'e geçin: `https://api.iyzipay.com`
- Gerçek API credentials kullanın
- SSL sertifikası zorunlu
- Webhook URL'i Iyzico panelinden tanımlayın

---

## 🔗 Resources / Kaynaklar

- [Iyzico API Documentation / API Dokümantasyonu](https://dev.iyzipay.com/)
- [Iyzico Node.js SDK](https://github.com/iyzico/iyzipay-node)
- [PCI-DSS Compliance / Uyumluluk](https://www.pcisecuritystandards.org/)

---

## 📞 Support / Destek

**English:**

For payment integration questions:
- Iyzico Support: destek@iyzico.com
- Iyzico Phone: 0850 222 0 998

**Türkçe:**

Ödeme entegrasyonu ile ilgili sorular için:
- Iyzico Destek: destek@iyzico.com
- Iyzico Telefon: 0850 222 0 998
