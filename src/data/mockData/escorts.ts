/**
 * Mock Escorts Data
 * 
 * Example escort profiles with varied cities, attributes, and services.
 * Used for development and testing escort-related features.
 * 
 * @module data/mockData/escorts
 * @category MockData
 */

export interface EscortProfile {
  id: string;
  displayName: string;
  realName?: string; // Private, only for admin
  city: string;
  district: string;
  age: number;
  height: number; // cm
  weight: number; // kg
  bodyType: 'slim' | 'athletic' | 'curvy' | 'plus-size' | 'average';
  breastSize?: 'A' | 'B' | 'C' | 'D' | 'DD+';
  ethnicity: string;
  hairColor: string;
  eyeColor: string;
  hourlyRate: number;
  isVip: boolean;
  isVerifiedByAdmin: boolean;
  profilePhoto: string;
  photos: string[];
  videos?: string[];
  services: string[];
  languages: string[];
  about: string;
  description: string;
  smoking: 'yes' | 'no' | 'occasional';
  alcohol: 'yes' | 'no' | 'social';
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  workingHours: {
    start: string; // e.g., "09:00"
    end: string; // e.g., "22:00"
  };
  stats: {
    totalBookings: number;
    totalReviews: number;
    averageRating: number;
    responseRate: number; // percentage
    responseTime: number; // minutes
    completedBookings: number;
    cancelledBookings: number;
    viewCount: number;
  };
  earnings: {
    totalEarned: number;
    thisMonth: number;
    lastMonth: number;
  };
  joinDate: string;
  lastSeen: string;
  isOnline: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

export const mockEscorts: EscortProfile[] = [
  {
    id: 'esc-001',
    displayName: 'Ayşe',
    city: 'İstanbul',
    district: 'Beşiktaş',
    age: 25,
    height: 168,
    weight: 55,
    bodyType: 'slim',
    breastSize: 'C',
    ethnicity: 'Türk',
    hairColor: 'Kahverengi',
    eyeColor: 'Yeşil',
    hourlyRate: 1500,
    isVip: true,
    isVerifiedByAdmin: true,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ayse',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    ],
    videos: ['video1.mp4'],
    services: ['classic', 'couples', 'tantric', 'aromatherapy', 'body_to_body'],
    languages: ['Türkçe', 'İngilizce', 'Rusça'],
    about: 'Merhaba! Ben Ayşe, 25 yaşındayım. Profesyonel ve kaliteli hizmet sunuyorum.',
    description: 'VIP hizmet, özel randevu sistemi. Sadece ciddi müşteriler.',
    smoking: 'no',
    alcohol: 'social',
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false,
    },
    workingHours: {
      start: '14:00',
      end: '23:00',
    },
    stats: {
      totalBookings: 145,
      totalReviews: 89,
      averageRating: 4.9,
      responseRate: 98,
      responseTime: 5,
      completedBookings: 140,
      cancelledBookings: 5,
      viewCount: 5420,
    },
    earnings: {
      totalEarned: 217500,
      thisMonth: 45000,
      lastMonth: 52000,
    },
    joinDate: '2023-06-15',
    lastSeen: '2024-03-21T18:30:00Z',
    isOnline: true,
    verificationStatus: 'verified',
  },
  {
    id: 'esc-002',
    displayName: 'Zeynep',
    city: 'Ankara',
    district: 'Çankaya',
    age: 28,
    height: 172,
    weight: 60,
    bodyType: 'athletic',
    breastSize: 'D',
    ethnicity: 'Türk',
    hairColor: 'Sarı',
    eyeColor: 'Mavi',
    hourlyRate: 2000,
    isVip: true,
    isVerifiedByAdmin: true,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zeynep',
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400',
    ],
    videos: ['video2.mp4', 'video3.mp4'],
    services: ['classic', 'four_hands', 'nuru', 'couples', 'tantric', 'body_to_body'],
    languages: ['Türkçe', 'İngilizce', 'Almanca'],
    about: 'Deneyimli ve profesyonel. Müşteri memnuniyeti önceliğimdir.',
    description: 'Elite hizmet. Ankara\'nın en iyisi. Özel isteklere açık.',
    smoking: 'occasional',
    alcohol: 'yes',
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    },
    workingHours: {
      start: '10:00',
      end: '02:00',
    },
    stats: {
      totalBookings: 210,
      totalReviews: 156,
      averageRating: 4.8,
      responseRate: 95,
      responseTime: 8,
      completedBookings: 205,
      cancelledBookings: 5,
      viewCount: 8930,
    },
    earnings: {
      totalEarned: 420000,
      thisMonth: 80000,
      lastMonth: 75000,
    },
    joinDate: '2023-03-10',
    lastSeen: '2024-03-21T20:15:00Z',
    isOnline: true,
    verificationStatus: 'verified',
  },
  {
    id: 'esc-003',
    displayName: 'Elif',
    city: 'İzmir',
    district: 'Konak',
    age: 23,
    height: 165,
    weight: 52,
    bodyType: 'slim',
    breastSize: 'B',
    ethnicity: 'Türk',
    hairColor: 'Siyah',
    eyeColor: 'Kahverengi',
    hourlyRate: 1200,
    isVip: false,
    isVerifiedByAdmin: true,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elif',
    photos: [
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400',
      'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=400',
    ],
    services: ['classic', 'relaxation', 'aromatherapy', 'swedish'],
    languages: ['Türkçe', 'İngilizce'],
    about: 'Yeni başladım ama çok hevesliyim. Samimi bir ortam sunuyorum.',
    description: 'Genç ve enerjik. İzmir\'de hizmetinizdeyim.',
    smoking: 'no',
    alcohol: 'no',
    availability: {
      monday: false,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false,
    },
    workingHours: {
      start: '15:00',
      end: '22:00',
    },
    stats: {
      totalBookings: 45,
      totalReviews: 32,
      averageRating: 4.6,
      responseRate: 92,
      responseTime: 12,
      completedBookings: 43,
      cancelledBookings: 2,
      viewCount: 2150,
    },
    earnings: {
      totalEarned: 54000,
      thisMonth: 18000,
      lastMonth: 14400,
    },
    joinDate: '2024-01-05',
    lastSeen: '2024-03-21T17:45:00Z',
    isOnline: false,
    verificationStatus: 'verified',
  },
  {
    id: 'esc-004',
    displayName: 'Selin',
    city: 'Antalya',
    district: 'Muratpaşa',
    age: 26,
    height: 170,
    weight: 58,
    bodyType: 'curvy',
    breastSize: 'DD+',
    ethnicity: 'Türk',
    hairColor: 'Kızıl',
    eyeColor: 'Yeşil',
    hourlyRate: 1800,
    isVip: true,
    isVerifiedByAdmin: true,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Selin',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    ],
    videos: ['video4.mp4'],
    services: ['classic', 'couples', 'nuru', 'tantric', 'four_hands'],
    languages: ['Türkçe', 'İngilizce', 'Fransızca'],
    about: 'Antalya\'da turizm sezonunda aktifim. Yabancı dil bilgim var.',
    description: 'Lüks otellerde outcall hizmet. Sadece VIP müşteriler.',
    smoking: 'no',
    alcohol: 'social',
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    },
    workingHours: {
      start: '11:00',
      end: '01:00',
    },
    stats: {
      totalBookings: 98,
      totalReviews: 72,
      averageRating: 4.9,
      responseRate: 97,
      responseTime: 6,
      completedBookings: 95,
      cancelledBookings: 3,
      viewCount: 4280,
    },
    earnings: {
      totalEarned: 176400,
      thisMonth: 32400,
      lastMonth: 39600,
    },
    joinDate: '2023-08-20',
    lastSeen: '2024-03-21T19:00:00Z',
    isOnline: true,
    verificationStatus: 'verified',
  },
  {
    id: 'esc-005',
    displayName: 'Derya',
    city: 'Bursa',
    district: 'Osmangazi',
    age: 30,
    height: 175,
    weight: 65,
    bodyType: 'athletic',
    breastSize: 'C',
    ethnicity: 'Türk',
    hairColor: 'Kumral',
    eyeColor: 'Ela',
    hourlyRate: 1600,
    isVip: false,
    isVerifiedByAdmin: true,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Derya',
    photos: [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
      'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=400',
    ],
    services: ['classic', 'sport', 'deep_tissue', 'swedish', 'relaxation'],
    languages: ['Türkçe'],
    about: 'Bursa\'da profesyonel hizmet. Spor masajı konusunda uzmanım.',
    description: 'Deneyimli terapist. Sporcular için özel programlar.',
    smoking: 'no',
    alcohol: 'no',
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    },
    workingHours: {
      start: '09:00',
      end: '20:00',
    },
    stats: {
      totalBookings: 67,
      totalReviews: 54,
      averageRating: 4.7,
      responseRate: 90,
      responseTime: 15,
      completedBookings: 65,
      cancelledBookings: 2,
      viewCount: 1890,
    },
    earnings: {
      totalEarned: 107200,
      thisMonth: 22400,
      lastMonth: 19200,
    },
    joinDate: '2023-10-12',
    lastSeen: '2024-03-20T16:30:00Z',
    isOnline: false,
    verificationStatus: 'verified',
  },
  {
    id: 'esc-006',
    displayName: 'Melis',
    city: 'İstanbul',
    district: 'Kadıköy',
    age: 24,
    height: 162,
    weight: 50,
    bodyType: 'slim',
    breastSize: 'B',
    ethnicity: 'Türk',
    hairColor: 'Sarı',
    eyeColor: 'Mavi',
    hourlyRate: 1300,
    isVip: false,
    isVerifiedByAdmin: true,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Melis',
    photos: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400',
    ],
    services: ['classic', 'relaxation', 'aromatherapy'],
    languages: ['Türkçe', 'İngilizce'],
    about: 'Anadolu yakasında hizmet veriyorum. Sakin ve huzurlu ortam.',
    description: 'Günübirlik randevular. Temizlik ve hijyen öncelik.',
    smoking: 'no',
    alcohol: 'social',
    availability: {
      monday: true,
      tuesday: true,
      wednesday: false,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false,
    },
    workingHours: {
      start: '13:00',
      end: '21:00',
    },
    stats: {
      totalBookings: 38,
      totalReviews: 28,
      averageRating: 4.5,
      responseRate: 88,
      responseTime: 18,
      completedBookings: 36,
      cancelledBookings: 2,
      viewCount: 1520,
    },
    earnings: {
      totalEarned: 49400,
      thisMonth: 15600,
      lastMonth: 13000,
    },
    joinDate: '2024-02-01',
    lastSeen: '2024-03-21T15:20:00Z',
    isOnline: false,
    verificationStatus: 'verified',
  },
  {
    id: 'esc-007',
    displayName: 'Nazlı',
    city: 'İzmir',
    district: 'Bornova',
    age: 27,
    height: 168,
    weight: 56,
    bodyType: 'average',
    breastSize: 'C',
    ethnicity: 'Türk',
    hairColor: 'Kahverengi',
    eyeColor: 'Kahverengi',
    hourlyRate: 1400,
    isVip: false,
    isVerifiedByAdmin: true,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nazli',
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400',
    ],
    services: ['classic', 'swedish', 'hot_stone', 'aromatherapy'],
    languages: ['Türkçe', 'İngilizce'],
    about: 'İzmir Bornova\'da özel stüdyom var. Rahat ve temiz ortam.',
    description: 'Doğal taşlar ve esansiyel yağlarla özel tedavi.',
    smoking: 'occasional',
    alcohol: 'social',
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false,
    },
    workingHours: {
      start: '10:00',
      end: '22:00',
    },
    stats: {
      totalBookings: 56,
      totalReviews: 42,
      averageRating: 4.7,
      responseRate: 93,
      responseTime: 10,
      completedBookings: 54,
      cancelledBookings: 2,
      viewCount: 2340,
    },
    earnings: {
      totalEarned: 78400,
      thisMonth: 19600,
      lastMonth: 16800,
    },
    joinDate: '2023-11-25',
    lastSeen: '2024-03-21T18:00:00Z',
    isOnline: true,
    verificationStatus: 'verified',
  },
  {
    id: 'esc-008',
    displayName: 'Ece',
    city: 'Ankara',
    district: 'Kızılay',
    age: 29,
    height: 173,
    weight: 62,
    bodyType: 'curvy',
    breastSize: 'D',
    ethnicity: 'Türk',
    hairColor: 'Siyah',
    eyeColor: 'Siyah',
    hourlyRate: 1700,
    isVip: true,
    isVerifiedByAdmin: true,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ece',
    photos: [
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    ],
    videos: ['video5.mp4'],
    services: ['classic', 'couples', 'tantric', 'nuru', 'body_to_body', 'four_hands'],
    languages: ['Türkçe', 'İngilizce', 'Rusça'],
    about: 'Ankara merkezde lüks dairede hizmet. Çiftler için özel paketler.',
    description: 'VIP müşterilere özel. Gizlilik garantisi.',
    smoking: 'no',
    alcohol: 'yes',
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    },
    workingHours: {
      start: '12:00',
      end: '02:00',
    },
    stats: {
      totalBookings: 124,
      totalReviews: 98,
      averageRating: 4.8,
      responseRate: 96,
      responseTime: 7,
      completedBookings: 120,
      cancelledBookings: 4,
      viewCount: 5870,
    },
    earnings: {
      totalEarned: 210800,
      thisMonth: 51000,
      lastMonth: 47600,
    },
    joinDate: '2023-07-08',
    lastSeen: '2024-03-21T21:10:00Z',
    isOnline: true,
    verificationStatus: 'verified',
  },
  {
    id: 'esc-009',
    displayName: 'Ceren',
    city: 'Bodrum',
    district: 'Merkez',
    age: 25,
    height: 169,
    weight: 54,
    bodyType: 'slim',
    breastSize: 'C',
    ethnicity: 'Türk',
    hairColor: 'Sarı',
    eyeColor: 'Yeşil',
    hourlyRate: 2500,
    isVip: true,
    isVerifiedByAdmin: true,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ceren',
    photos: [
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400',
      'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=400',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    ],
    videos: ['video6.mp4', 'video7.mp4'],
    services: ['classic', 'couples', 'tantric', 'nuru', 'four_hands', 'body_to_body'],
    languages: ['Türkçe', 'İngilizce', 'İtalyanca', 'Fransızca'],
    about: 'Bodrum\'da lüks yat ve villalarda outcall hizmet. Çok dilli.',
    description: 'Ultra VIP. Sadece elite müşteriler. Uluslararası standart.',
    smoking: 'no',
    alcohol: 'yes',
    availability: {
      monday: false,
      tuesday: false,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    },
    workingHours: {
      start: '16:00',
      end: '04:00',
    },
    stats: {
      totalBookings: 78,
      totalReviews: 65,
      averageRating: 5.0,
      responseRate: 99,
      responseTime: 3,
      completedBookings: 78,
      cancelledBookings: 0,
      viewCount: 6720,
    },
    earnings: {
      totalEarned: 195000,
      thisMonth: 62500,
      lastMonth: 50000,
    },
    joinDate: '2023-09-15',
    lastSeen: '2024-03-21T22:30:00Z',
    isOnline: true,
    verificationStatus: 'verified',
  },
  {
    id: 'esc-010',
    displayName: 'Deniz',
    city: 'İstanbul',
    district: 'Şişli',
    age: 31,
    height: 176,
    weight: 68,
    bodyType: 'athletic',
    breastSize: 'D',
    ethnicity: 'Türk',
    hairColor: 'Kızıl',
    eyeColor: 'Yeşil',
    hourlyRate: 1900,
    isVip: true,
    isVerifiedByAdmin: true,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Deniz',
    photos: [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
      'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=400',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    ],
    videos: ['video8.mp4'],
    services: ['classic', 'sport', 'deep_tissue', 'tantric', 'couples', 'four_hands'],
    languages: ['Türkçe', 'İngilizce', 'Almanca', 'Rusça'],
    about: 'En deneyimli terapistlerden biriyim. 8 yıllık tecrübe.',
    description: 'Premium hizmet. Kurumsal müşteriler ve diplomatlar tercih ediyor.',
    smoking: 'no',
    alcohol: 'social',
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false,
    },
    workingHours: {
      start: '10:00',
      end: '23:00',
    },
    stats: {
      totalBookings: 287,
      totalReviews: 245,
      averageRating: 4.9,
      responseRate: 98,
      responseTime: 4,
      completedBookings: 283,
      cancelledBookings: 4,
      viewCount: 12450,
    },
    earnings: {
      totalEarned: 545300,
      thisMonth: 76000,
      lastMonth: 68400,
    },
    joinDate: '2022-12-01',
    lastSeen: '2024-03-21T20:45:00Z',
    isOnline: true,
    verificationStatus: 'verified',
  },
];

/**
 * Get escort by ID
 */
export function getEscortById(id: string): EscortProfile | undefined {
  return mockEscorts.find(e => e.id === id);
}

/**
 * Get escorts by city
 */
export function getEscortsByCity(city: string): EscortProfile[] {
  return mockEscorts.filter(e => e.city === city);
}

/**
 * Get VIP escorts
 */
export function getVipEscorts(): EscortProfile[] {
  return mockEscorts.filter(e => e.isVip);
}

/**
 * Get online escorts
 */
export function getOnlineEscorts(): EscortProfile[] {
  return mockEscorts.filter(e => e.isOnline);
}

/**
 * Get top rated escorts
 */
export function getTopRatedEscorts(limit: number = 5): EscortProfile[] {
  return [...mockEscorts]
    .sort((a, b) => b.stats.averageRating - a.stats.averageRating)
    .slice(0, limit);
}
