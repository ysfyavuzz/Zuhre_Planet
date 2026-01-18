/**
 * Email Verification Template
 * 
 * Email template sent for email address verification.
 * Includes verification link with secure token.
 * 
 * @module lib/email/templates/verification
 * @category Library - Email Templates
 */

export interface VerificationEmailProps {
  userName: string;
  verificationUrl: string;
  expiryHours?: number;
}

/**
 * Generate email verification email HTML
 */
export function renderVerificationEmail(props: VerificationEmailProps): string {
  const { userName, verificationUrl, expiryHours = 24 } = props;

  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Doğrulama</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .icon {
      font-size: 64px;
      margin-bottom: 10px;
    }
    h1 {
      color: #1f2937;
      font-size: 24px;
      margin-bottom: 20px;
    }
    .button {
      display: inline-block;
      background-color: #10b981;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
    }
    .info-box {
      background-color: #dbeafe;
      border-left: 4px solid #3b82f6;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 14px;
      color: #6b7280;
      text-align: center;
    }
    .link-box {
      background-color: #f3f4f6;
      padding: 15px;
      border-radius: 6px;
      word-break: break-all;
      font-family: monospace;
      font-size: 12px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="icon">📧</div>
      <h1>Email Adresinizi Doğrulayın</h1>
    </div>

    <p>Merhaba ${userName},</p>
    
    <p>
      Escort Platform'a hoş geldiniz! Hesabınızı aktifleştirmek için 
      email adresinizi doğrulamanız gerekmektedir.
    </p>

    <div style="text-align: center;">
      <a href="${verificationUrl}" class="button">Email Adresimi Doğrula</a>
    </div>

    <p style="text-align: center; color: #6b7280; font-size: 14px;">
      veya bu bağlantıyı tarayıcınıza kopyalayın:
    </p>

    <div class="link-box">
      ${verificationUrl}
    </div>

    <div class="info-box">
      <strong>ℹ️ Bilgilendirme:</strong><br>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>Bu doğrulama bağlantısı ${expiryHours} saat boyunca geçerlidir</li>
        <li>Email adresinizi doğrulamadan bazı özellikleri kullanamazsınız</li>
        <li>Bağlantı sadece bir kez kullanılabilir</li>
      </ul>
    </div>

    <p>
      <strong>Email adresinizi neden doğrulamanız gerekiyor?</strong>
    </p>
    <ul>
      <li>Hesabınızın güvenliğini sağlamak için</li>
      <li>Önemli bildirimleri alabilmeniz için</li>
      <li>Şifre sıfırlama gibi işlemleri yapabilmeniz için</li>
      <li>Platform kurallarına uyum sağlamak için</li>
    </ul>

    <p>
      <strong>Bu hesabı siz oluşturmadınız mı?</strong><br>
      Eğer bu hesabı siz oluşturmadıysanız, bu emaili görmezden gelebilirsiniz. 
      Hesap doğrulanmadığı sürece aktif olmayacaktır.
    </p>

    <p>
      Herhangi bir sorunuz varsa, destek ekibimizle iletişime geçebilirsiniz.
    </p>

    <p>
      Saygılarımızla,<br>
      <strong>Escort Platform Ekibi</strong>
    </p>

    <div class="footer">
      <p>
        Bu email otomatik olarak gönderilmiştir.<br>
        © 2026 Escort Platform. Tüm hakları saklıdır.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate plain text version
 */
export function renderVerificationEmailText(props: VerificationEmailProps): string {
  const { userName, verificationUrl, expiryHours = 24 } = props;

  return `
Email Adresinizi Doğrulayın

Merhaba ${userName},

Escort Platform'a hoş geldiniz! Hesabınızı aktifleştirmek için 
email adresinizi doğrulamanız gerekmektedir.

Email adresinizi doğrulamak için aşağıdaki bağlantıyı kullanın:
${verificationUrl}

Bilgilendirme:
- Bu doğrulama bağlantısı ${expiryHours} saat boyunca geçerlidir
- Email adresinizi doğrulamadan bazı özellikleri kullanamazsınız
- Bağlantı sadece bir kez kullanılabilir

Email adresinizi neden doğrulamanız gerekiyor?
- Hesabınızın güvenliğini sağlamak için
- Önemli bildirimleri alabilmeniz için
- Şifre sıfırlama gibi işlemleri yapabilmeniz için
- Platform kurallarına uyum sağlamak için

Bu hesabı siz oluşturmadınız mı?
Eğer bu hesabı siz oluşturmadıysanız, bu emaili görmezden gelebilirsiniz.

Saygılarımızla,
Escort Platform Ekibi

© 2026 Escort Platform
  `.trim();
}
