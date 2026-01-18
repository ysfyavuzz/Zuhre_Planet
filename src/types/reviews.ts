// Review types for the escort platform

export interface Review {
  id: string;
  escortId: string;  // The escort being reviewed
  customerId: string; // The customer who wrote the review (hidden)
  customerName: string; // Display name (anonymized)
  rating: number; // 1-5 stars
  comment: string;
  date: Date;
  isVerified: boolean; // Verified meeting
  response?: {
    text: string;
    date: Date;
  };
  helpful: number; // Count of "helpful" votes
  flags: number; // Count of reports/warnings
}

export interface CustomerWarning {
  id: string;
  customerId: string; // The customer being warned about
  customerName: string; // Display name (anonymized)
  warningType: 'behavior' | 'payment' | 'safety' | 'respect' | 'other';
  severity: 'low' | 'medium' | 'high';
  comment: string;
  date: Date;
  escortId: string; // Who issued the warning
  upvotes: number; // Other escorts confirming
  verified: boolean; // Verified by admin
}

export interface EscortTrustScore {
  escortId: string;
  totalReviews: number;
  averageRating: number;
  responseRate: number; // % of reviews responded to
  responseTime: number; // Average hours to respond
  verifiedReviews: number;
  trustLevel: 'new' | 'established' | 'trusted' | 'top-rated';
}

// Helper function to calculate trust level
export function calculateTrustLevel(score: EscortTrustScore): EscortTrustScore['trustLevel'] {
  if (score.totalReviews < 5) return 'new';
  if (score.totalReviews < 20 && score.averageRating >= 4.5) return 'established';
  if (score.totalReviews >= 20 && score.averageRating >= 4.5) return 'trusted';
  if (score.totalReviews >= 50 && score.averageRating >= 4.8) return 'top-rated';
  return 'established';
}

// Trust level display config
export const TRUST_LEVEL_CONFIG = {
  'new': {
    label: 'Yeni Üye',
    color: 'text-gray-500',
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/20',
    icon: '🌱'
  },
  'established': {
    label: 'Kurulmuş',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    icon: '⭐'
  },
  'trusted': {
    label: 'Güvenilir',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    icon: '🏆'
  },
  'top-rated': {
    label: 'En İyi',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    icon: '👑'
  }
};

// Warning type config
export const WARNING_TYPE_CONFIG = {
  'behavior': {
    label: 'Davranış',
    icon: '⚠️',
    color: 'text-yellow-500',
    description: 'Uygunsuz davranış gösterdi'
  },
  'payment': {
    label: 'Ödeme',
    icon: '💰',
    color: 'text-red-500',
    description: 'Ödeme sorunları yaşandı'
  },
  'safety': {
    label: 'Güvenlik',
    icon: '🚫',
    color: 'text-red-600',
    description: 'Güvenlik ihlali'
  },
  'respect': {
    label: 'Saygı',
    icon: '🤝',
    color: 'text-orange-500',
    description: 'Saygısız tavır'
  },
  'other': {
    label: 'Diğer',
    icon: '📝',
    color: 'text-gray-500',
    description: 'Diğer konular'
  }
};

// Sample reviews data
export const sampleReviews: Review[] = [
  {
    id: '1',
    escortId: '1',
    customerId: 'cust_001',
    customerName: 'Müşteri A***',
    rating: 5,
    comment: 'Harika bir deneyimdi. Çok nazik ve profesyonel.',
    date: new Date('2024-01-10'),
    isVerified: true,
    response: {
      text: 'Teşekkür ederim, güzel yorumunuz için 💕',
      date: new Date('2024-01-10')
    },
    helpful: 12,
    flags: 0
  },
  {
    id: '2',
    escortId: '1',
    customerId: 'cust_002',
    customerName: 'Müşteri B***',
    rating: 4,
    comment: 'Güzel vakit geçirdik. Fotoğraflarındaki gibi.',
    date: new Date('2024-01-08'),
    isVerified: true,
    helpful: 8,
    flags: 0
  },
  {
    id: '3',
    escortId: '1',
    customerId: 'cust_003',
    customerName: 'Müşteri C***',
    rating: 5,
    comment: 'Muhteşem bir kişi, kesinlikle tekrar görüşmek isterim.',
    date: new Date('2024-01-05'),
    isVerified: true,
    response: {
      text: 'Sizi de beklerim 💋',
      date: new Date('2024-01-05')
    },
    helpful: 15,
    flags: 0
  }
];

// Sample warnings data (only visible to escorts)
export const sampleWarnings: CustomerWarning[] = [
  {
    id: 'warn_1',
    customerId: 'cust_bad_001',
    customerName: 'Müşteri X***',
    warningType: 'respect',
    severity: 'medium',
    comment: 'Randevuya geç kaldı ve saygısız davrandı.',
    date: new Date('2024-01-12'),
    escortId: '1',
    upvotes: 3,
    verified: true
  },
  {
    id: 'warn_2',
    customerId: 'cust_bad_002',
    customerName: 'Müşteri Y***',
    warningType: 'payment',
    severity: 'high',
    comment: 'Ödeme yapmadı, kaçtı.',
    date: new Date('2024-01-10'),
    escortId: '2',
    upvotes: 7,
    verified: true
  }
];

// Trust building tips for escorts
export const TRUST_TIPS = [
  {
    title: '📸 Gerçek Fotoğraflar Kullanın',
    description: 'Müşteriler gerçek fotoğrafları takdir eder. Fotoğraflarınız güncel ve gerçek olduğunda daha fazla randevu alırsınız.',
    impact: 'high'
  },
  {
    title: '⏰ Randevulara Vakitinde Gelin',
    description: 'Zamanında gitmek profesyonellik gösterir. Geç kalacağınızı önceden bildirin.',
    impact: 'high'
  },
  {
    title: '💬 Mesajlara Hızlı Yanıt Verin',
    description: 'Müşteriler hızlı yanıt bekler. 1 saat içinde yanıt vermek randevu şansınızı %50 artırır.',
    impact: 'medium'
  },
  {
    title: '🎯 Açık ve Detaylı Bilgi Verin',
    description: 'Hizmetleriniz, fiyatlarınız ve sınırlarınız hakkında açık olun. Bu beklenmedik durumları önler.',
    impact: 'high'
  },
  {
    title: '😊 Pozitif ve Nazik Olun',
    description: 'Güleryüz ve iyi mizaç, müşterilerinizin tekrar gelmesini sağlar.',
    impact: 'medium'
  },
  {
    title: '🧼 Hijyene Özen Gösterin',
    description: 'Temizlik birinci önceliğiniz olmalı. Müşteriler hijyen takdir eder ve buna göre yorum yapar.',
    impact: 'critical'
  },
  {
    title: '📍 Konum Bilgisi Doğru Olsun',
    description: 'Konumunuz doğru olduğunda müşteriler sizi kolayca bulur.',
    impact: 'medium'
  },
  {
    title: '⭐ Yorumlara Yanıt Verin',
    description: 'Müşteri yorumlarına nazikçe yanıt verin. Bu, diğer müşterilere de ilgilendiğinizi gösterir.',
    impact: 'medium'
  },
  {
    title: '🔒 Gizliliğe Saygı Duyun',
    description: 'Müşteri bilgilerini asla paylaşmayın. Bu, güvenilirliğinizi artırır.',
    impact: 'critical'
  },
  {
    title: '💰 Fiyatlarınız Açık Belirleyin',
    description: 'Fiyatlarınız önceden belliyse, hiçbir sürpriz olmaz ve anlaşmazlık çıkmaz.',
    impact: 'high'
  }
];

// Content to help escorts build trust
export const TRUST_BUILDING_CONTENT = {
  title: 'Müşterilerin Gözünde Güvenilir Olun',
  sections: [
    {
      heading: '🏆 Neden Güven Önemli?',
      content: `Müşteriler için en önemli faktör güvendir. Güvenilir escortlar 3 kat daha fazla randevu alır ve daha yüksek ücret talep edebilir.

Müşteriler yorumları okur ve diğer escortların tavsiyelerine güvenir. Sizin de güvenilir olduğunuzu kanıtlayın!`
    },
    {
      heading: '⭐ Yorumlar Nasıl Çalışır?',
      content: `Müşteriler randevu sonrasında yorum yapabilirler. Bu yorumlar:

• Sizin profilinizde görünür (sadece escort üyeler)
• Müşteri ismi gizli tutulur
• Diğer müşteriler yorumları göremez
• Yanlış yorumları bildirebilirsiniz

Olumlu yorumlar profilinizde "Güvenilir" rozetini kazanmanıza yardımcı olur!`
    },
    {
      heading: '⚠️ Müşteri Uyarı Sistemi',
      content: `Escortlar olarak birbirimizi korumalıyız. Problemli müşterileri uyarabilirsiniz:

• Müşteri uyarıları sadece escortlar görünür
• Diğer escortlar aynı müşteriyi onaylayabilir
• Yüksek onay alan uyarılar herkese gösterilir
• Bu sistem hepimizi korur

Not: Uyarı sistemi suistimal edilmemeli, sadece gerçek sorunları bildirin.`
    },
    {
      heading: '💡 Güven İpuçları',
      content: `Güven kazanmak için:

1. Profilinizi detaylı doldurun
2. Gerçek ve güncel fotoğraflar yükleyin
3. İlk 5 müşteriye indirim yapın - onlar yorum yazacak!
4. Mesajlara hızlı ve nazikçe yanıt verin
5. Randevulara zamanında gidin
6. Yorumlara nazikçe cevap verin

Unutmayın: Güven kazanmak aylar sürer ama kaybetmek saniyeler sürer!`
    }
  ]
};
