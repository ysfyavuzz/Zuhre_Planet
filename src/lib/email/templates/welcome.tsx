/**
 * Welcome Email Template
 * 
 * Email template sent to new users after successful registration.
 * Includes platform introduction and next steps.
 * 
 * @module lib/email/templates/welcome
 * @category Library - Email Templates
 */

export interface WelcomeEmailProps {
  userName: string;
  userEmail: string;
  userRole: 'client' | 'escort' | 'admin';
  loginUrl?: string;
}

/**
 * Generate welcome email HTML
 */
export function renderWelcomeEmail(props: WelcomeEmailProps): string {
  const { userName, userEmail, userRole, loginUrl } = props;

  const roleText = userRole === 'escort' 
    ? 'Hizmet Sağlayıcı' 
    : userRole === 'client' 
    ? 'Müşteri' 
    : 'Admin';

  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hoş Geldiniz</title>
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
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #6366f1;
      margin-bottom: 10px;
    }
    h1 {
      color: #1f2937;
      font-size: 24px;
      margin-bottom: 20px;
    }
    .content {
      margin-bottom: 30px;
    }
    .button {
      display: inline-block;
      background-color: #6366f1;
      color: #ffffff;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 14px;
      color: #6b7280;
      text-align: center;
    }
    .info-box {
      background-color: #f3f4f6;
      border-left: 4px solid #6366f1;
      padding: 15px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🌟 Escort Platform</div>
    </div>

    <h1>Hoş Geldiniz, ${userName}!</h1>

    <div class="content">
      <p>Merhaba ${userName},</p>
      
      <p>
        Escort Platform'a ${roleText} olarak başarıyla kayıt oldunuz. 
        Platformumuza hoş geldiniz!
      </p>

      <div class="info-box">
        <strong>Hesap Bilgileriniz:</strong><br>
        <strong>Email:</strong> ${userEmail}<br>
        <strong>Rol:</strong> ${roleText}
      </div>

      ${userRole === 'escort' ? `
        <p>
          <strong>Hizmet Sağlayıcı olarak yapabilecekleriniz:</strong>
        </p>
        <ul>
          <li>Profilinizi oluşturun ve düzenleyin</li>
          <li>Fotoğraflarınızı yükleyin</li>
          <li>Hizmet fiyatlarınızı belirleyin</li>
          <li>Müşterilerle mesajlaşın</li>
          <li>VIP üyelik satın alın</li>
          <li>Randevularınızı yönetin</li>
        </ul>
      ` : ''}

      ${userRole === 'client' ? `
        <p>
          <strong>Müşteri olarak yapabilecekleriniz:</strong>
        </p>
        <ul>
          <li>Hizmet sağlayıcıları arayın ve keşfedin</li>
          <li>Favorilerinize ekleyin</li>
          <li>Mesajlaşma yapın</li>
          <li>Randevu alın</li>
          <li>Değerlendirme yapın</li>
        </ul>
      ` : ''}

      ${loginUrl ? `
        <div style="text-align: center;">
          <a href="${loginUrl}" class="button">Platforma Giriş Yap</a>
        </div>
      ` : ''}

      <p>
        Herhangi bir sorunuz olursa, lütfen bizimle iletişime geçmekten çekinmeyin.
      </p>

      <p>
        İyi günler dileriz!<br>
        <strong>Escort Platform Ekibi</strong>
      </p>
    </div>

    <div class="footer">
      <p>
        Bu email ${userEmail} adresine gönderilmiştir.<br>
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
export function renderWelcomeEmailText(props: WelcomeEmailProps): string {
  const { userName, userEmail, userRole } = props;
  
  const roleText = userRole === 'escort' 
    ? 'Hizmet Sağlayıcı' 
    : userRole === 'client' 
    ? 'Müşteri' 
    : 'Admin';

  return `
Hoş Geldiniz, ${userName}!

Merhaba ${userName},

Escort Platform'a ${roleText} olarak başarıyla kayıt oldunuz.
Platformumuza hoş geldiniz!

Hesap Bilgileriniz:
- Email: ${userEmail}
- Rol: ${roleText}

Herhangi bir sorunuz olursa, lütfen bizimle iletişime geçmekten çekinmeyin.

İyi günler dileriz!
Escort Platform Ekibi

© 2026 Escort Platform. Tüm hakları saklıdır.
  `.trim();
}
