/**
 * Booking Confirmation Email Template
 * 
 * Email template sent after successful booking confirmation.
 * Includes booking details, time, location, and cancellation policy.
 * 
 * @module lib/email/templates/booking-confirmation
 * @category Library - Email Templates
 */

import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export interface BookingConfirmationEmailProps {
  bookingId: number;
  clientName: string;
  escortName: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in hours
  totalAmount: number;
  location?: string;
  notes?: string;
  cancelUrl?: string;
}

/**
 * Generate booking confirmation email HTML
 */
export function renderBookingConfirmationEmail(props: BookingConfirmationEmailProps): string {
  const {
    bookingId,
    clientName,
    escortName,
    startTime,
    endTime,
    duration,
    totalAmount,
    location,
    notes,
    cancelUrl,
  } = props;

  const formattedDate = format(startTime, "d MMMM yyyy, EEEE", { locale: tr });
  const formattedStartTime = format(startTime, "HH:mm", { locale: tr });
  const formattedEndTime = format(endTime, "HH:mm", { locale: tr });

  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Randevu Onayı</title>
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
    .success-icon {
      font-size: 48px;
      margin-bottom: 10px;
    }
    h1 {
      color: #10b981;
      font-size: 24px;
      margin-bottom: 10px;
    }
    .booking-details {
      background-color: #f3f4f6;
      border-radius: 6px;
      padding: 20px;
      margin: 20px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      font-weight: 600;
      color: #6b7280;
    }
    .detail-value {
      color: #1f2937;
    }
    .highlight-box {
      background-color: #dbeafe;
      border-left: 4px solid #3b82f6;
      padding: 15px;
      margin: 20px 0;
    }
    .button {
      display: inline-block;
      background-color: #ef4444;
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
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="success-icon">✅</div>
      <h1>Randevunuz Onaylandı!</h1>
      <p>Rezervasyon Numarası: <strong>#${bookingId}</strong></p>
    </div>

    <p>Merhaba ${clientName},</p>
    
    <p>
      Randevunuz başarıyla onaylanmıştır. Aşağıda rezervasyon detaylarınızı bulabilirsiniz:
    </p>

    <div class="booking-details">
      <div class="detail-row">
        <span class="detail-label">Hizmet Sağlayıcı:</span>
        <span class="detail-value">${escortName}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Tarih:</span>
        <span class="detail-value">${formattedDate}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Saat:</span>
        <span class="detail-value">${formattedStartTime} - ${formattedEndTime}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Süre:</span>
        <span class="detail-value">${duration} saat</span>
      </div>
      ${location ? `
      <div class="detail-row">
        <span class="detail-label">Konum:</span>
        <span class="detail-value">${location}</span>
      </div>
      ` : ''}
      <div class="detail-row">
        <span class="detail-label">Toplam Tutar:</span>
        <span class="detail-value"><strong>${totalAmount.toLocaleString('tr-TR')} TL</strong></span>
      </div>
    </div>

    ${notes ? `
    <div class="highlight-box">
      <strong>Notlar:</strong><br>
      ${notes}
    </div>
    ` : ''}

    <div class="highlight-box">
      <strong>⏰ Hatırlatma:</strong><br>
      Lütfen randevunuza zamanında gelin. Gecikmeler durumunda 
      ${escortName} ile iletişime geçiniz.
    </div>

    <p>
      <strong>İptal Politikası:</strong><br>
      Randevunuzu iptal etmeniz gerekirse, lütfen en az 24 saat önceden 
      bildirimde bulunun. Son dakika iptalleri için ücret iadesi yapılamayabilir.
    </p>

    ${cancelUrl ? `
    <div style="text-align: center;">
      <a href="${cancelUrl}" class="button">Randevuyu İptal Et</a>
    </div>
    ` : ''}

    <p>
      Keyifli bir deneyim geçirmenizi dileriz!
    </p>

    <p>
      Saygılarımızla,<br>
      <strong>Escort Platform Ekibi</strong>
    </p>

    <div class="footer">
      <p>
        Rezervasyon #${bookingId}<br>
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
export function renderBookingConfirmationEmailText(props: BookingConfirmationEmailProps): string {
  const {
    bookingId,
    clientName,
    escortName,
    startTime,
    endTime,
    duration,
    totalAmount,
    location,
    notes,
  } = props;

  const formattedDate = format(startTime, "d MMMM yyyy, EEEE", { locale: tr });
  const formattedStartTime = format(startTime, "HH:mm", { locale: tr });
  const formattedEndTime = format(endTime, "HH:mm", { locale: tr });

  return `
Randevunuz Onaylandı!

Merhaba ${clientName},

Randevunuz başarıyla onaylanmıştır.

Rezervasyon Detayları:
- Rezervasyon No: #${bookingId}
- Hizmet Sağlayıcı: ${escortName}
- Tarih: ${formattedDate}
- Saat: ${formattedStartTime} - ${formattedEndTime}
- Süre: ${duration} saat
${location ? `- Konum: ${location}` : ''}
- Toplam Tutar: ${totalAmount.toLocaleString('tr-TR')} TL

${notes ? `Notlar:\n${notes}\n` : ''}

İptal Politikası:
Randevunuzu iptal etmeniz gerekirse, lütfen en az 24 saat önceden 
bildirimde bulunun.

Keyifli bir deneyim geçirmenizi dileriz!

Saygılarımızla,
Escort Platform Ekibi

© 2026 Escort Platform
  `.trim();
}
