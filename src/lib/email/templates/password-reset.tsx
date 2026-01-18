/**
 * Password Reset Email Template
 * 
 * Email template sent when user requests password reset.
 * Includes reset link with secure token and expiry information.
 * 
 * @module lib/email/templates/password-reset
 * @category Library - Email Templates
 */

export interface PasswordResetEmailProps {
  userName: string;
  resetUrl: string;
  expiryHours?: number;
}

/**
 * Generate password reset email HTML
 */
export function renderPasswordResetEmail(props: PasswordResetEmailProps): string {
  const { userName, resetUrl, expiryHours = 1 } = props;

  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Şifre Sıfırlama</title>
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
      font-size: 48px;
      margin-bottom: 10px;
    }
    h1 {
      color: #1f2937;
      font-size: 24px;
      margin-bottom: 20px;
    }
    .button {
      display: inline-block;
      background-color: #6366f1;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .warning-box {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
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
      <div class="icon">🔐</div>
      <h1>Şifre Sıfırlama Talebi</h1>
    </div>

    <p>Merhaba ${userName},</p>
    
    <p>
      Hesabınız için şifre sıfırlama talebinde bulundunuz. 
      Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:
    </p>

    <div style="text-align: center;">
      <a href="${resetUrl}" class="button">Şifremi Sıfırla</a>
    </div>

    <p style="text-align: center; color: #6b7280; font-size: 14px;">
      veya bu bağlantıyı tarayıcınıza kopyalayın:
    </p>

    <div class="link-box">
      ${resetUrl}
    </div>

    <div class="warning-box">
      <strong>⚠️ Önemli Güvenlik Bilgileri:</strong><br>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>Bu bağlantı ${expiryHours} saat boyunca geçerlidir</li>
        <li>Bağlantı sadece bir kez kullanılabilir</li>
        <li>Bu talebi siz yapmadıysanız, bu emaili görmezden gelin</li>
        <li>Şifrenizi asla kimseyle paylaşmayın</li>
      </ul>
    </div>

    <p>
      <strong>Bu talebi siz yapmadınız mı?</strong><br>
      Eğer şifre sıfırlama talebinde bulunmadıysanız, hesabınızın güvenliği 
      için mevcut şifrenizi değiştirmenizi öneririz ve bu emaili görmezden gelebilirsiniz.
    </p>

    <p>
      Herhangi bir sorunuz varsa, lütfen destek ekibimizle iletişime geçin.
    </p>

    <p>
      Saygılarımızla,<br>
      <strong>Escort Platform Güvenlik Ekibi</strong>
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
export function renderPasswordResetEmailText(props: PasswordResetEmailProps): string {
  const { userName, resetUrl, expiryHours = 1 } = props;

  return `
Şifre Sıfırlama Talebi

Merhaba ${userName},

Hesabınız için şifre sıfırlama talebinde bulundunuz.

Şifrenizi sıfırlamak için aşağıdaki bağlantıyı kullanın:
${resetUrl}

Önemli Güvenlik Bilgileri:
- Bu bağlantı ${expiryHours} saat boyunca geçerlidir
- Bağlantı sadece bir kez kullanılabilir
- Bu talebi siz yapmadıysanız, bu emaili görmezden gelin
- Şifrenizi asla kimseyle paylaşmayın

Bu talebi siz yapmadınız mı?
Eğer şifre sıfırlama talebinde bulunmadıysanız, hesabınızın güvenliği 
için mevcut şifrenizi değiştirmenizi öneririz.

Saygılarımızla,
Escort Platform Güvenlik Ekibi

© 2026 Escort Platform
  `.trim();
}
