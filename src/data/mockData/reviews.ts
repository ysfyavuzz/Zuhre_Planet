/**
 * Mock Reviews Data
 * 
 * Example reviews and ratings for escorts.
 * Used for development and testing review and rating features.
 * 
 * @module data/mockData/reviews
 * @category MockData
 */

export interface Review {
  id: string;
  appointmentId: string;
  customerId: string;
  customerName: string;
  escortId: string;
  escortName: string;
  rating: number; // 1-5
  serviceRating: number; // 1-5
  communicationRating: number; // 1-5
  cleanlinessRating: number; // 1-5
  valueRating: number; // 1-5
  title: string;
  comment: string;
  pros?: string[];
  cons?: string[];
  wouldRecommend: boolean;
  isVerifiedBooking: boolean;
  helpful: number; // Number of users who found this helpful
  createdAt: string;
  escortResponse?: {
    message: string;
    respondedAt: string;
  };
}

export const mockReviews: Review[] = [
  {
    id: 'rev-001',
    appointmentId: 'apt-003',
    customerId: 'cust-003',
    customerName: 'Can D.',
    escortId: 'esc-004',
    escortName: 'Selin',
    rating: 5.0,
    serviceRating: 5,
    communicationRating: 5,
    cleanlinessRating: 5,
    valueRating: 5,
    title: 'Mükemmel Hizmet',
    comment: 'Selin gerçekten profesyonel ve samimi. Otele geldi, her şey mükemmeldi. Kesinlikle tavsiye ederim.',
    pros: ['Profesyonel', 'Zamanında geldi', 'İletişim mükemmel', 'Temiz ve bakımlı'],
    cons: [],
    wouldRecommend: true,
    isVerifiedBooking: true,
    helpful: 12,
    createdAt: '2024-03-22T01:00:00Z',
    escortResponse: {
      message: 'Çok teşekkür ederim! Sizinle çalışmak harikaydı. Tekrar görüşmek üzere 💕',
      respondedAt: '2024-03-22T10:00:00Z',
    },
  },
  {
    id: 'rev-002',
    appointmentId: 'apt-007',
    customerId: 'cust-002',
    customerName: 'Mehmet Y.',
    escortId: 'esc-008',
    escortName: 'Ece',
    rating: 4.8,
    serviceRating: 5,
    communicationRating: 5,
    cleanlinessRating: 5,
    valueRating: 4,
    title: 'Harika Deneyim',
    comment: 'Ece çok profesyonel ve deneyimli. Tantra masajı harikaydı. Biraz pahalı ama değdi.',
    pros: ['Çok deneyimli', 'Profesyonel', 'Rahat ortam', 'İletişim çok iyi'],
    cons: ['Biraz pahalı'],
    wouldRecommend: true,
    isVerifiedBooking: true,
    helpful: 8,
    createdAt: '2024-03-19T22:00:00Z',
    escortResponse: {
      message: 'Teşekkürler! Sizinle çalışmak keyifliydi. İyi ki geldiniz 🌸',
      respondedAt: '2024-03-20T09:00:00Z',
    },
  },
  {
    id: 'rev-003',
    appointmentId: 'apt-008',
    customerId: 'cust-003',
    customerName: 'Can D.',
    escortId: 'esc-001',
    escortName: 'Ayşe',
    rating: 4.9,
    serviceRating: 5,
    communicationRating: 5,
    cleanlinessRating: 5,
    valueRating: 4,
    title: 'Çok İyi',
    comment: 'Ayşe ile ikinci randevum. Her zaman kaliteli hizmet. Güler yüzlü ve samimi.',
    pros: ['Güler yüzlü', 'Profesyonel', 'Temiz ortam', 'Zamanında'],
    cons: [],
    wouldRecommend: true,
    isVerifiedBooking: true,
    helpful: 15,
    createdAt: '2024-03-18T23:00:00Z',
    escortResponse: {
      message: 'Çok teşekkürler! Sizi görmek her zaman keyifli ✨',
      respondedAt: '2024-03-19T11:00:00Z',
    },
  },
  {
    id: 'rev-004',
    appointmentId: 'apt-009',
    customerId: 'cust-001',
    customerName: 'Ahmet K.',
    escortId: 'esc-007',
    escortName: 'Nazlı',
    rating: 4.7,
    serviceRating: 5,
    communicationRating: 4,
    cleanlinessRating: 5,
    valueRating: 5,
    title: 'İyi Hizmet',
    comment: 'Aromaterapi masajı çok rahatlattı. Nazlı işini iyi biliyor. Stüdyosu çok temiz.',
    pros: ['Temiz stüdyo', 'Profesyonel', 'İyi fiyat'],
    cons: ['İletişimde biraz yavaş'],
    wouldRecommend: true,
    isVerifiedBooking: true,
    helpful: 6,
    createdAt: '2024-03-17T18:00:00Z',
  },
  {
    id: 'rev-005',
    appointmentId: 'apt-001',
    customerId: 'cust-001',
    customerName: 'Ahmet K.',
    escortId: 'esc-001',
    escortName: 'Ayşe',
    rating: 4.5,
    serviceRating: 4,
    communicationRating: 5,
    cleanlinessRating: 5,
    valueRating: 4,
    title: 'İlk Deneyimim',
    comment: 'İlk kez böyle bir hizmete gittim. Ayşe çok anlayışlıydı ve rahat hissettirdi.',
    pros: ['Anlayışlı', 'Rahat ortam', 'Temiz'],
    cons: [],
    wouldRecommend: true,
    isVerifiedBooking: true,
    helpful: 10,
    createdAt: '2024-02-15T20:00:00Z',
    escortResponse: {
      message: 'İlk deneyiminiz için beni seçtiğiniz için teşekkürler! 💕',
      respondedAt: '2024-02-16T10:00:00Z',
    },
  },
  {
    id: 'rev-006',
    appointmentId: 'apt-002',
    customerId: 'cust-002',
    customerName: 'Mehmet Y.',
    escortId: 'esc-002',
    escortName: 'Zeynep',
    rating: 4.8,
    serviceRating: 5,
    communicationRating: 5,
    cleanlinessRating: 4,
    valueRating: 5,
    title: 'Eşimle Birlikte Gittik',
    comment: 'Çift masajı harikaydı. Zeynep çok profesyonel ve her ikimizle de ilgilendi.',
    pros: ['Çiftler için ideal', 'Profesyonel', 'Deneyimli'],
    cons: [],
    wouldRecommend: true,
    isVerifiedBooking: true,
    helpful: 20,
    createdAt: '2024-02-20T22:00:00Z',
    escortResponse: {
      message: 'Çok teşekkür ederim! İkinizi de görmek çok güzeldi 🌹',
      respondedAt: '2024-02-21T09:00:00Z',
    },
  },
  {
    id: 'rev-007',
    appointmentId: 'apt-006',
    customerId: 'cust-004',
    customerName: 'Burak Ö.',
    escortId: 'esc-006',
    escortName: 'Melis',
    rating: 4.3,
    serviceRating: 4,
    communicationRating: 4,
    cleanlinessRating: 5,
    valueRating: 4,
    title: 'Fena Değil',
    comment: 'İlk randevum. Melis nazikti ama biraz tecrübesiz geldi bana. Yine de memnunum.',
    pros: ['Nazik', 'Temiz', 'Zamanında'],
    cons: ['Biraz tecrübesiz'],
    wouldRecommend: true,
    isVerifiedBooking: true,
    helpful: 4,
    createdAt: '2024-03-05T16:00:00Z',
  },
  {
    id: 'rev-008',
    appointmentId: 'apt-003',
    customerId: 'cust-005',
    customerName: 'Emre Ç.',
    escortId: 'esc-009',
    escortName: 'Ceren',
    rating: 5.0,
    serviceRating: 5,
    communicationRating: 5,
    cleanlinessRating: 5,
    valueRating: 5,
    title: 'En İyisi',
    comment: 'Bodrum\'da en iyi hizmet. Ceren gerçekten ultra VIP. Her şey mükemmeldi.',
    pros: ['Mükemmel hizmet', 'Çok dilli', 'Lüks', 'Profesyonel'],
    cons: [],
    wouldRecommend: true,
    isVerifiedBooking: true,
    helpful: 25,
    createdAt: '2024-03-10T20:00:00Z',
    escortResponse: {
      message: 'Sizinle çalışmak bir onurdu! Teşekkürler 💎',
      respondedAt: '2024-03-11T10:00:00Z',
    },
  },
  {
    id: 'rev-009',
    appointmentId: 'apt-004',
    customerId: 'cust-003',
    customerName: 'Can D.',
    escortId: 'esc-010',
    escortName: 'Deniz',
    rating: 4.9,
    serviceRating: 5,
    communicationRating: 5,
    cleanlinessRating: 5,
    valueRating: 4,
    title: 'Çok Deneyimli',
    comment: 'Deniz ile üçüncü randevum. Her seferinde mükemmel. En deneyimli terapist.',
    pros: ['Çok deneyimli', '8 yıllık tecrübe', 'Profesyonel', 'İletişim mükemmel'],
    cons: ['Biraz pahalı ama değer'],
    wouldRecommend: true,
    isVerifiedBooking: true,
    helpful: 18,
    createdAt: '2024-03-12T22:00:00Z',
    escortResponse: {
      message: 'Çok teşekkürler! Müdavim müşterilerimle çalışmak çok keyifli 💕',
      respondedAt: '2024-03-13T09:00:00Z',
    },
  },
  {
    id: 'rev-010',
    appointmentId: 'apt-005',
    customerId: 'cust-002',
    customerName: 'Mehmet Y.',
    escortId: 'esc-005',
    escortName: 'Derya',
    rating: 4.7,
    serviceRating: 5,
    communicationRating: 4,
    cleanlinessRating: 5,
    valueRating: 5,
    title: 'Spor Masajı Uzmanı',
    comment: 'Koşu sonrası kaslarım çok yorulmuştu. Derya spor masajında gerçekten uzman. Çok rahatlattı.',
    pros: ['Spor masajında uzman', 'Profesyonel', 'İyi fiyat'],
    cons: [],
    wouldRecommend: true,
    isVerifiedBooking: true,
    helpful: 9,
    createdAt: '2024-03-14T18:00:00Z',
    escortResponse: {
      message: 'Teşekkürler! Sporcularla çalışmayı seviyorum 💪',
      respondedAt: '2024-03-15T10:00:00Z',
    },
  },
];

/**
 * Get review by ID
 */
export function getReviewById(id: string): Review | undefined {
  return mockReviews.find(r => r.id === id);
}

/**
 * Get reviews for escort
 */
export function getEscortReviews(escortId: string): Review[] {
  return mockReviews
    .filter(r => r.escortId === escortId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Get reviews by customer
 */
export function getCustomerReviews(customerId: string): Review[] {
  return mockReviews
    .filter(r => r.customerId === customerId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Get average rating for escort
 */
export function getEscortAverageRating(escortId: string): number {
  const reviews = getEscortReviews(escortId);
  if (reviews.length === 0) return 0;
  
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}

/**
 * Get rating breakdown for escort
 */
export function getEscortRatingBreakdown(escortId: string): {
  [key: number]: number;
} {
  const reviews = getEscortReviews(escortId);
  const breakdown: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  
  reviews.forEach(review => {
    const roundedRating = Math.round(review.rating);
    breakdown[roundedRating]++;
  });
  
  return breakdown;
}

/**
 * Get top reviews (most helpful)
 */
export function getTopReviews(limit: number = 5): Review[] {
  return [...mockReviews]
    .sort((a, b) => b.helpful - a.helpful)
    .slice(0, limit);
}

/**
 * Get recent reviews
 */
export function getRecentReviews(limit: number = 10): Review[] {
  return [...mockReviews]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
