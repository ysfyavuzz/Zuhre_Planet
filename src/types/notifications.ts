// Bildirim ve Mesajlaşma Sistemi

// Bildirim türleri
export type NotificationType =
  | 'new_message'
  | 'new_booking'
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'booking_reminder'
  | 'review_received'
  | 'profile_approved'
  | 'profile_rejected'
  | 'vip_expiring'
  | 'points_earned'
  | 'referral_success'
  | 'warning'
  | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
  expiresAt?: Date;
  actionUrl?: string;
}

export interface EmailNotification {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

// Bildirim yapılandırması
export const NOTIFICATION_CONFIG = {
  // Email ayarları
  email: {
    from: 'noreply@escortplatform.com',
    fromName: 'Escort Platform',
    replyTo: 'support@escortplatform.com'
  },

  // TTL (Time to Live)
  ttl: {
    message: 30, // gün
    booking: 7,
    warning: 90,
    system: 365
  },

  // Bildirim tercihleri
  preferences: {
    email: {
      new_message: true,
      new_booking: true,
      booking_reminder: true,
      review_received: true,
      vip_expiring: true,
      marketing: false
    },
    push: {
      new_message: true,
      new_booking: true,
      booking_reminder: true,
      review_received: true
    },
    sms: {
      new_booking: true,
      booking_reminder: true
    }
  }
};

// Bildirim şablonları
export const NOTIFICATION_TEMPLATES = {
  // Mesaj bildirimleri
  new_message: {
    title: 'Yeni Mesaj',
    message: '{sender} size mesaj gönderdi',
    emailSubject: 'Yeni mesajınız var',
    emailTemplate: 'new_message'
  },

  // Randevu bildirimleri
  new_booking: {
    title: 'Yeni Randevu Talebi',
    message: '{customer} randevu talebiniz var: {date} {time}',
    emailSubject: 'Yeni randevu talebi',
    emailTemplate: 'new_booking'
  },
  booking_confirmed: {
    title: 'Randevu Onaylandı',
    message: 'Randevunuz onaylandı: {date} {time}',
    emailSubject: 'Randevu onaylandı',
    emailTemplate: 'booking_confirmed'
  },
  booking_cancelled: {
    title: 'Randevu İptal Edildi',
    message: '{reason} nedeniyle randevu iptal edildi',
    emailSubject: 'Randevu iptal edildi',
    emailTemplate: 'booking_cancelled'
  },
  booking_reminder: {
    title: 'Randevu Hatırlatma',
    message: 'Yarınki randevunuz: {date} {time}. Lütfen zamanında gidin.',
    emailSubject: 'Randevu hatırlatması',
    emailTemplate: 'booking_reminder',
    remindHoursBefore: [24, 2] // 24 saat ve 2 saat önce
  },

  // Yorum bildirimleri
  review_received: {
    title: 'Yeni Yorum Aldınız',
    message: '{customer} sizi {rating} yıldızla değerlendirdi',
    emailSubject: 'Yeni yorum aldınız',
    emailTemplate: 'review_received'
  },

  // Profil bildirimleri
  profile_approved: {
    title: 'Profiliniz Onaylandı',
    message: 'Tebrikler! Profiliniz artık yayında.',
    emailSubject: 'Profiliniz onaylandı',
    emailTemplate: 'profile_approved'
  },
  profile_rejected: {
    title: 'Profil Güncellemesi Gerekli',
    message: 'Lütfen profili güncelleyin: {reason}',
    emailSubject: 'Profil güncellemesi gerekli',
    emailTemplate: 'profile_rejected'
  },

  // VIP bildirimleri
  vip_expiring: {
    title: 'VIP Üyelik Sonlanıyor',
    message: 'VIP üyeliğiniz {days} gün sonra sonlanıyor',
    emailSubject: 'VIP üyelik sonlanıyor',
    emailTemplate: 'vip_expiring',
    warnDaysBefore: [7, 3, 1]
  },

  // Puan bildirimleri
  points_earned: {
    title: 'Puan Kazandınız',
    message: 'Tebrikler! {points} puan kazandınız',
    emailSubject: 'Puan kazandınız',
    emailTemplate: 'points_earned',
    showOnlyIf: [100, 500, 1000] // Sadece bu miktarlarda bildirim
  },

  // Davet bildirimleri
  referral_success: {
    title: 'Davet Başarılı',
    message: '{referralName} üye oldu!',
    emailSubject: 'Davet başarılı',
    emailTemplate: 'referral_success'
  },

  // Uyarılar
  warning: {
    title: 'Uyarı',
    message: '{warningMessage}',
    emailSubject: 'Platform uyarısı',
    emailTemplate: 'warning',
    severity: 'medium'
  },

  // Sistem
  system: {
    title: 'Platform Bilgisi',
    message: '{message}',
    emailSubject: 'Platform bilgisi',
    emailTemplate: 'system'
  }
};

// Chat kuralları
export const CHAT_RULES = {
  // Escort kuralları
  escort: {
    title: 'Escort Kuralları',
    rules: [
      {
        id: 'no_explicit',
        title: 'Müstehcen İçerik Yasak',
        description: 'Mesajlarda açık, cinsel içerik yasaktır.',
        icon: '🚫',
        severity: 'high',
        violationAction: 'ban'
      },
      {
        id: 'no_external_contact',
        title: 'Dış İletişim Yasak',
        description: 'Telefon numarası veya e-posta istemek yasaktır.',
        icon: '📵',
        severity: 'medium',
        violationAction: 'warning'
      },
      {
        id: 'no_cash_discussion',
        title: 'Nakit Para Görüşmesi',
        description: 'Sadece platform üzerinden ödeme kabul edin.',
        icon: '💰',
        severity: 'high',
        violationAction: 'ban'
      },
      {
        id: 'be_respectful',
        title: 'Saygılı Olun',
        description: 'Her müşteriye nazik ve profesyonel olun.',
        icon: '🤝',
        severity: 'low',
        violationAction: 'warning'
      },
      {
        id: 'no_drugs',
        title: 'Uyuşturucu Yasak',
        description: 'Uyuşturucu teklif etmek kesinlikle yasaktır.',
        icon: '🚷',
        severity: 'high',
        violationAction: 'permanent_ban'
      }
    ],
    warningMessage: 'Kurallara uymazsanız hesabınız askıya alınır.'
  },

  // Müşteri kuralları
  customer: {
    title: 'Müşteri Kuralları',
    rules: [
      {
        id: 'be_respectful',
        title: 'Saygılı Olun',
        description: 'Escortlara nazik ve kibarlı davranın.',
        icon: '🤝',
        severity: 'high',
        violationAction: 'ban'
      },
      {
        id: 'no_negotiation',
        title: 'Pazarlık Yapmayın',
        description: 'İlan fiyatları üzerinden görüşün.',
        icon: '🚫',
        severity: 'medium',
        violationAction: 'warning'
      },
      {
        id: 'no_time_wasting',
        title: 'Zaman Kaybetmeyin',
        description: 'Ciddi değilseniz randevu almayın.',
        icon: '⏰',
        severity: 'medium',
        violationAction: 'warning'
      },
      {
        id: 'no_explicit_chat',
        title: 'Müstehcen İçerik Yasak',
        description: 'Ahlak dışı mesajlar yasaktır.',
        icon: '🚫',
        severity: 'high',
        violationAction: 'ban'
      },
      {
        id: 'keep_appointments',
        title: 'Randevulara Sadık Kalın',
        description: 'Son dakika iptallerden kaçının.',
        icon: '✅',
        severity: 'medium',
        violationAction: 'warning'
      }
    ],
    warningMessage: 'Kuralları ihlal etmek platformdan uzaklaştırılmanıza neden olabilir.'
  }
};

// Sansür listesi
export const PROFANITY_FILTER = {
  // Türkçe küfürler
  turkish: [
    'amk', 'şerefsiz', 'ibne', 'göt', 'yarrak', 'sikik', 'oç', 'piç', 'kahpe',
    'orospu', 'fahişe', 'yavşak', 'siktiğim', 'anneni', 'aneni'
  ],

  // İngilizce küfürler
  english: [
    'fuck', 'shit', 'bitch', 'whore', 'slut', 'bastard', 'damn', 'ass',
    'dick', 'cock', 'pussy', 'cunt', 'hell'
  ],

  // Uygunsuz terimler
  inappropriate: [
    'porn', 'seks', 'sex', 'hardcore', 'xxx', '18+', 'fetish', 'bdsm',
    'escort service', 'massage happy' // Spam/banned services
  ],

  // Telefon patternleri (block external contact attempts)
  phonePatterns: [
    /\d{10,11}/g, // Turkish phone numbers
    /\d{3}[-\s]?\d{3}[-\s]?\d{4}/g,
    /05\d{2}[-\s]?\d{3}[-\s]?\d{4}/g,
    /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g
  ],

  // E-posta patternleri
  emailPatterns: [
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    /gmail\.com/i,
    /hotmail\.com/i,
    /yahoo\.com/i
  ]
};

// Mesaj kuralları
export const MESSAGE_RULES = {
  maxLength: 500,
  maxImages: 3,
  maxVideos: 0, // Video gönderimi için ayrı özellik gerekir
  forbiddenContent: [
    {
      pattern: /\d{10,11}/,
      description: 'Telefon numarası',
      replacement: '***'
    },
    {
      pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
      description: 'E-posta adresi',
      replacement: '***@***.***'
    }
  ],
  spamDetection: {
    repeatedMessageThreshold: 3,
    timeWindow: 60000, // 1 dakika
    maxMessagesPerMinute: 10,
    capsLockThreshold: 0.7, // %70 büyük harf = spam şüphesi
  }
};

// Uyarı seviyeleri
export const WARNING_LEVELS = {
  low: {
    label: 'Hafif Uyarı',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    icon: '⚠️',
    action: 'notify'
  },
  medium: {
    label: 'Orta Seviye Uyarı',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    icon: '🔶',
    action: 'suspend_24h'
  },
  high: {
    label: 'Ciddi Uyarı',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    icon: '🛑',
    action: 'suspend_7d'
  },
  critical: {
    label: 'Son Uyarı',
    color: 'text-red-800',
    bgColor: 'bg-red-200',
    icon: '⛔',
    action: 'ban'
  }
};

// Randevu hatırlatma mesajları
export const BOOKING_REMINDERS = {
  beforeBooking: {
    title: '💬 Nazik Bir Randevu Geçirin',
    messages: [
      {
        text: 'Lütfen randevu talebi oluştururken kibarlı ve nazik olun.',
        position: 'top',
        variant: 'info'
      },
      {
        text: 'Gereksiz yere randevu talebi oluşturmaktan kaçının.',
        position: 'top',
        variant: 'warning'
      }
    ]
  },
  afterBooking: {
    title: '✅ Randevu Oluşturuldu',
    messages: [
      {
        text: 'Randevu saatinde lütfen hazır ve temiz olun.',
        variant: 'info'
      },
      {
        text: 'Geç kalacağınızı en az 2 saat önce bildirin.',
        variant: 'warning'
      },
      {
        text: 'Randevuyu iptal edecekseniz 24 saat önce haber verin.',
        variant: 'info'
      }
    ]
  },
  reminders: {
    '24h': {
      title: '⏰ Yarın Randevunuz Var',
      message: 'Yarın {date} saat {time} randevunuz var. Hazırlanın!',
      actions: ['onayla', 'iptal_et']
    },
    '2h': {
      title: '🚀 2 Saat Sonra Randevu',
      message: '2 saat sonra randevunuz var. Yola çıkın!',
      actions: ['ona_geldim', 'geç_kalicami']
    }
  }
};

// Kullanıcı uyarı sistemi
export interface UserWarning {
  id: string;
  userId: string;
  type: keyof typeof WARNING_LEVELS;
  reason: string;
  description: string;
  issuedBy: 'system' | 'admin' | 'auto';
  issuedAt: Date;
  expiresAt?: Date;
  isRead: boolean;
  action?: {
    type: 'suspend' | 'ban' | 'restriction';
    duration?: number; // hours/days
  };
}

// Uyarı oluşturma fonksiyonu
export function createUserWarning(
  userId: string,
  type: keyof typeof WARNING_LEVELS,
  reason: string,
  description: string
): UserWarning {
  return {
    id: `warn_${Date.now()}_${userId}`,
    userId,
    type,
    reason,
    description,
    issuedBy: 'system',
    issuedAt: new Date(),
    isRead: false
  };
}

// Mesaj sansürleme fonksiyonu
export function sanitizeMessage(message: string): { clean: string; violations: string[] } {
  let cleanMessage = message;
  const violations: string[] = [];

  // Türkçe küfürleri sansürle
  PROFANITY_FILTER.turkish.forEach(word => {
    const regex = new RegExp(word, 'gi');
    if (regex.test(cleanMessage)) {
      cleanMessage = cleanMessage.replace(regex, '*'.repeat(word.length));
      violations.push(`Küfürlü dil kullanımı`);
    }
  });

  // İngilizce küfürleri sansürle
  PROFANITY_FILTER.english.forEach(word => {
    const regex = new RegExp(word, 'gi');
    if (regex.test(cleanMessage)) {
      cleanMessage = cleanMessage.replace(regex, '*'.repeat(word.length));
      violations.push(`Uygunsuz İngilizce kelime`);
    }
  });

  // Uygunsuz terimleri sansürle
  PROFANITY_FILTER.inappropriate.forEach(term => {
    const regex = new RegExp(term, 'gi');
    if (regex.test(cleanMessage)) {
      cleanMessage = cleanMessage.replace(regex, '***');
      violations.push(`Yasak içerik: ${term}`);
    }
  });

  // Telefon numaralarını maskele
  PROFANITY_FILTER.phonePatterns.forEach(pattern => {
    if (pattern.test(cleanMessage)) {
      cleanMessage = cleanMessage.replace(pattern, '***');
      violations.push('Telefon numarası paylaşımı');
    }
  });

  // E-posta adreslerini maskele
  PROFANITY_FILTER.emailPatterns.forEach(pattern => {
    if (pattern.test(cleanMessage)) {
      cleanMessage = cleanMessage.replace(pattern, '***@***.***');
      violations.push('Dış iletişim bilgisi');
    }
  });

  return { clean: cleanMessage, violations };
}

// Spam kontrolü
export function checkSpam(messages: Array<{ content: string; timestamp: number }>): boolean {
  const now = Date.now();
  const timeWindow = MESSAGE_RULES.spamDetection.timeWindow;

  // Aynı mesaj tekrarı
  const recentMessages = messages.filter(m => now - m.timestamp < timeWindow);

  const messageCounts = new Map<string, number>();
  recentMessages.forEach(m => {
    const count = messageCounts.get(m.content) || 0;
    messageCounts.set(m.content, count + 1);
  });

  for (const [message, count] of messageCounts) {
    if (count >= MESSAGE_RULES.spamDetection.repeatedMessageThreshold) {
      return true;
    }
  }

  // Çok hızlı mesaj gönderimi
  if (recentMessages.length >= MESSAGE_RULES.spamDetection.maxMessagesPerMinute) {
    return true;
  }

  // Caps lock spam kontrolü
  recentMessages.forEach(m => {
    const upperCase = m.content.replace(/[^A-Z]/g, '').length;
    const total = m.content.replace(/[^a-zA-Z]/g, '').length;
    if (total > 0) {
      const ratio = upperCase / total;
      if (ratio >= MESSAGE_RULES.spamDetection.capsLockThreshold) {
        return true;
      }
    }
  });

  return false;
}

// Bildirim oluşturma helper'ı
export function createNotification(
  userId: string,
  type: NotificationType,
  data: Record<string, any>
): Notification {
  const template = NOTIFICATION_TEMPLATES[type];

  return {
    id: `notif_${Date.now()}_${userId}`,
    userId,
    type,
    title: template.title,
    message: template.message.replace(/\{(\w+)\}/g, (_, key) => data[key] || ''),
    data,
    isRead: false,
    createdAt: new Date(),
    actionUrl: data.actionUrl
  };
}
