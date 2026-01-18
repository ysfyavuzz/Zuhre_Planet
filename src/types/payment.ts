// Güvenli Ödeme Sistemi
// Platform üzerinden güvenli ödeme ve iade garantisi

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'refunded' | 'cancelled' | 'disputed';
export type PaymentMethod = 'credit_card' | 'bank_transfer' | 'mobile_payment' | 'crypto';

export interface Payment {
  id: string;
  bookingId: string;
  customerId: string;
  escortId: string;
  amount: number;
  platformFee: number; // Platform komisyonu
  escortNet: number; // Escortın alacağı net tutar
  status: PaymentStatus;
  method: PaymentMethod;
  createdAt: Date;
  completedAt?: Date;
  refundReason?: string;
  transactionId?: string;
}

export interface PaymentSecurity {
  encrypted: boolean;
  ssl: boolean;
  pciDss: boolean;
  twoFactor: boolean;
  fraudDetection: boolean;
}

export interface RefundRequest {
  id: string;
  paymentId: string;
  bookingId: string;
  requesterId: string;
  reason: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'investigating';
  evidence?: string[]; // Fotoğraf veya ek deliller
  createdAt: Date;
  resolvedAt?: Date;
}

export interface DisputeResolution {
  disputeId: string;
  paymentId: string;
  initiator: 'customer' | 'escort';
  reason: 'no_show' | 'service_not_provided' | 'misrepresentation' | 'safety_issue' | 'other';
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'escalated';
  evidence: {
    reporter: string[];
    other: string[];
  };
  adminNotes?: string;
  resolution?: {
    action: 'full_refund' | 'partial_refund' | 'release_payment' | 'ban_user';
    amount?: number;
    reason: string;
  };
  createdAt: Date;
  resolvedAt?: Date;
}

// Ödeme güvenliği ayarları
export const PAYMENT_SECURITY = {
  encryption: {
    type: 'AES-256',
    description: 'End-to-end şifreleme ile ödeme bilgileriniz koruma altında'
  },
  ssl: {
    version: 'TLS 1.3',
    provider: '256-bit SSL',
    description: 'Güvenli bağlantı ile verileriniz şifreli iletilir'
  },
  pciDss: {
    compliant: true,
    level: 'Level 1',
    description: 'PCI DSS Level 1 sertifikalı ödeme altyapısı'
  },
  fraud: {
    enabled: true,
    systems: ['device_fingerprinting', 'behavior_analysis', 'ip_checking'],
    description: 'Dolandırıcılık koruma sistemleri aktif'
  },
  hold: {
    duration: 24, // saat - ödemenin havuzda tutulma süresi
    description: 'Randevu tamamlanana kadar ödeme havuzda tutulur'
  },
  refund: {
    window: 48, // saat - iade talep süresi
    automatic: true,
    description: '48 saat içinde iade talebinizi inceleyip sonuçlandırırız'
  }
};

// Müşteri için ödeme güvenliği açıklamaları
export const CUSTOMER_PAYMENT_SECURITY = {
  title: '💳 Güvenli Ödeme Garantisi',
  benefits: [
    {
      icon: '🔒',
      title: 'Para Koruma Garantisi',
      description: 'Ödemeniz randevu tamamlanana kadar güvenli havuzda tutulur. Sorun yaşarsanız paranız iade edilir.',
      highlights: ['24 saat havuzda tutma', '48 saat iade hakkı', 'Otomatik iade sistemi']
    },
    {
      icon: '✅',
      title: 'Randevu Onay Garantisi',
      description: 'Escort randevuyu onaylamazsa veya gelmezse tam para iadesi.',
      highlights: ['Onaylanmazsa iade',      'Gelmezse iade',
        'Anında işleme']
    },
    {
      icon: '🛡️',
      title: 'Uyuşmazlık Çözümü',
      description: 'Herhangi bir sorun yaşarsanız destek ekibimiz 24 saat içinde müdahale eder.',
      highlights: ['24/7 destek', 'Adil çözüm', 'Delil incelemesi']
    },
    {
      icon: '📱',
      title: 'Gizlilik Koruması',
      description: 'Ödeme bilgileriniz asla escortlarla paylaşılmaz. Banka ekstresinde gizli görünür.',
      highlights: ['Gizli ödeme', 'Kişisel veri koruması', 'KVKK uyumlu']
    },
    {
      icon: '⭐',
      title: 'Sadakat Puanı Bonusu',
      description: 'Platform üzerinden ödeme yaparak her randevudan ekstra puan kazanın!',
      highlights: ['Her randevu +50 puan', 'Sorunsuz randevu +100 puan', 'VIP statüsü hızlanması']
    },
    {
      icon: '🚫',
      title: 'Kötü Müşteri Olmayın',
      description: 'Kurallara uymayan, saygısız veya ödeme yapmayan kullanıcılar platformdan uzaklaştırılır.',
      highlights: ['Oylama sistemi', 'Escort raporu', 'Sürekli ihal = ban']
    }
  ],
  refundPolicy: {
    title: 'İade Koşulları',
    conditions: [
      {
        scenario: 'Escort gelmezse',
        refund: '%100 iade',
        timeline: 'Otomatik, 24 saat içinde'
      },
      {
        scenario: 'Escort randevuyu iptal ederse (24 saat önceden bildirim yapmazsa)',
        refund: '%100 iade',
        timeline: 'Otomatik'
      },
      {
        scenario: 'Fotoğraflar gerçek değilse',
        refund: '%100 iade',
        timeline: 'Delil incelemesi sonrası'
      },
      {
        scenario: 'Güvenlik ihlali',
        refund: '%100 iade',
        timeline: 'Acil müdahale'
      },
      {
        scenario: 'Müşteri randevuyu iptal ederse (24 saat önceden bildirim yapmazsa)',
        refund: 'İade yok',
        timeline: '-'
      }
    ]
  },
  howItWorks: [
    {
      step: 1,
      title: 'Randevu Oluştur',
      description: 'Tarih, saat ve süre seçin'
    },
    {
      step: 2,
      title: 'Güvenli Ödeme',
      description: 'Ödemenizi platform havuzuna yapın'
    },
    {
      step: 3,
      title: 'Randevu Onayı',
      description: 'Escort talebi onaylar'
    },
    {
      step: 4,
      title: 'Randevu Gerçekleşir',
      description: 'Tarih ve saatte randevu yapılır'
    },
    {
      step: 5,
      title: 'Onay & Puan',
      description: 'Her iki taraf da onay verir, puan kazanır'
    },
    {
      step: 6,
      title: 'Para Transferi',
      description: 'Escortın hesabına net tutar geçer'
    }
  ]
};

// Escort için ödeme güvenliği açıklamaları
export const ESCORT_PAYMENT_SECURITY = {
  title: '💰 Para Güvende & Garantili',
  benefits: [
    {
      icon: '💎',
      title: 'Garantili Ödeme',
      description: 'Müşteri ödemeyi platforma yapar. Randevu sonunda paranız garanti altında.',
      highlights: ['Önceden tahsilat',      'Asla ödenmez kalmazsınız',
        'Net tutar belirgin']
    },
    {
      icon: '🚫',
      title: 'Kötü Müşteriyi Seçmeme Hakkı',
      description: 'Müşteri uyarı sistemini kullanarak sorunlu müşterileri görebilir ve randevu kabul etmeyebilirsiniz.',
      highlights: ['Uyarı sistemi',        'Diğer escortların yorumları',
        'Kırmızı bayrak görme']
    },
    {
      icon: '⭐',
      title: 'Sadakat Puanı Bonusu',
      description: 'Platform üzerinden ödeme alan her randevunuzdan ekstra puan kazanın!',
      highlights: ['Her randevu +50 puan', 'Sorunsuz onay +100 puan', 'Görünürlük artışı']
    },
    {
      icon: '📊',
      title: 'Gelir Takibi',
      description: 'Tüm kazançlarınızı detaylı şekilde görüntüleyin ve analiz edin.',
      highlights: ['Detaylı raporlama',        'Aylık/haftalık özet',
        'Vergi dokümasyonu']
    },
    {
      icon: '🛡️',
      title: 'Uyuşmazlık Koruması',
      description: 'Müşteri haksız iade talep ederse destek ekibimiz sizi korur.',
      highlights: ['Adil çözüm',        'Delil incelemesi',
        'Escort hakları korunur']
    },
    {
      icon: '💳',
      title: 'Hızlı Para Transferi',
      description: 'Randevu onaylandıktan sonra 24 saat içinde paranız hesabınızda.',
      highlights: ['Otomatik transfer',        'Her zaman',
        'Komisyon önceden bellli']
    }
  ],
  commission: {
    title: 'Platform Komisyonu',
    rates: [
      { tier: 'Başlangıç', commission: 20, description: 'İlk 50 randevu' },
      { tier: 'Standart', commission: 15, description: '50-200 randevu' },
      { tier: 'Premium', commission: 10, description: '200+ randevu' },
      { tier: 'VIP', commission: 5, description: 'VIP üyeler' }
    ],
    note: 'Komisyon sadece başarılı randevulardan alınır. İade durumunda komisyon iade edilir.'
  },
  badCustomerProtection: {
    title: 'Kötü Müşteriden Korunma',
    features: [
      {
        icon: '⚠️',
        title: 'Müşteri Uyarı Sistemi',
        description: 'Diğer escortlar tarafından bildirilen sorunlu müşterileri görürsünüz.'
      },
      {
        icon: '👁️',
        title: 'Randevu Öncesi Görme',
        description: 'Randevu kabul etmeden önce müşterinin uyarı geçmişini inceleyebilirsiniz.'
      },
      {
        icon: '❌',
        title: 'Reddetme Hakkı',
        description: 'Uyarısı yüksek olan müşterileri randevu taleplerini reddetme hakkınız vardır.'
      },
      {
        icon: '📢',
        title: 'Bildirim Hakkı',
        description: 'Sorunlu müşterileri sistemimize bildirebilir, diğer escortları koruyabilirsiniz.'
      },
      {
        icon: '⭐',
        title: 'Puan Cezası',
        description: 'Kuralları çiğneyen müşterilerin puanları düşer, hesapları sınırlandırılır.'
      },
      {
        icon: '🔒',
        title: 'Hesap Askıya Alma',
        description: 'Tekrarlayan ihlallerde müşteri hesapları otomatik askıya alınır.'
      }
    ]
  },
  loyaltyPoints: {
    title: 'Sadakat Puanı Avantajları',
    successfulBooking: {
      points: 50,
      description: 'Her başarılı randevu',
      multiplier: 'x2'
    },
    bothConfirmed: {
      points: 100,
      description: 'İki taraf da onaylarsa',
      multiplier: 'x3'
    },
    customerReturns: {
      points: 30,
      description: 'Müşteri tekrar gelirse'
    },
    fiveStarReview: {
      points: 30,
      description: '5 yıldızlı yorum'
    }
  }
};

// Randevu durumları ve puan etkileri
export const BOOKING_STATUS_POINTS = {
  // Başarılı randevular (pozitif)
  completed_confirmed: {
    customer: 50,
    escort: 50,
    description: 'Randevu başarıyla tamamlandı, her iki taraf da onayladı'
  },
  completed_5star: {
    customer: 80,
    escort: 80,
    description: '5 yıldızlı yorumlu başarılı randevu'
  },
  first_booking: {
    customer: 100,
    escort: 100,
    description: 'İlk randevu bonusu'
  },
  repeat_customer: {
    customer: 30,
    escort: 50,
    description: 'Tekrarlayan müşteri bonusu'
  },

  // Negatif durumlar
  customer_no_show: {
    customer: -200,
    escort: 100, // Tazminat
    description: 'Müşteri gelmedi'
  },
  escort_no_show: {
    customer: 100, // Tazminat
    escort: -300,
    description: 'Escort gelmedi'
  },
  last_minute_cancel: {
    customer: -100,
    escort: -50,
    description: 'Son dakika iptali (24 saatten az)'
  },
  rude_behavior: {
    customer: -150,
    escort: -100,
    description: 'Saygısız davranış bildirimi'
  }
};

// Ödeme methodları
export const PAYMENT_METHODS = {
  credit_card: {
    name: 'Kredi Kartı',
    icon: '💳',
    enabled: true,
    fee: 0
  },
  bank_transfer: {
    name: 'Banka Transferi',
    icon: '🏦',
    enabled: true,
    fee: 0
  },
  mobile_payment: {
    name: 'Mobil Ödeme',
    icon: '📱',
    enabled: false,
    fee: 0,
    comingSoon: true
  },
  crypto: {
    name: 'Kripto Para',
    icon: '🪙',
    enabled: false,
    fee: 0,
    comingSoon: true
  }
};

// Platform komisyon hesaplama
export function calculatePlatformFee(amount: number, totalBookings: number): number {
  if (totalBookings < 50) return amount * 0.20; // %20
  if (totalBookings < 200) return amount * 0.15; // %15
  if (totalBookings >= 200) return amount * 0.10; // %10
  return amount * 0.20;
}

// Escort net ödeme hesaplama
export function calculateEscortNet(amount: number, totalBookings: number): number {
  const fee = calculatePlatformFee(amount, totalBookings);
  return amount - fee;
}

// Sadakat puanı hesaplama
export function calculateBookingPoints(
  status: keyof typeof BOOKING_STATUS_POINTS,
  userRole: 'customer' | 'escort',
  basePoints: number,
  multipliers?: {
    isFiveStar?: boolean;
    isFirstBooking?: boolean;
    isRepeat?: boolean;
    vipStatus?: boolean;
  }
): number {
  let points = BOOKING_STATUS_POINTS[status][userRole];
  if (points === undefined) points = basePoints;

  // Çarpanlar
  if (multipliers?.isFiveStar) points += 30;
  if (multipliers?.isFirstBooking) points += 100;
  if (multipliers?.isRepeat) points += userRole === 'escort' ? 50 : 30;
  if (multipliers?.vipStatus) points = Math.floor(points * 1.5);

  return points;
}
