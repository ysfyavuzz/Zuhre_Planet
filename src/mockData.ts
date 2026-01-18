/**
 * Mock Data Module (mockData.ts)
 * 
 * Mock data and type definitions for development and testing.
 * Contains sample escort profiles, service definitions, and view limits.
 * Used for frontend development without backend connectivity.
 * 
 * @module mockData
 * @category Data
 * 
 * Features:
 * - Escort profile interfaces and mock data
 * - Service type definitions (30+ service categories)
 * - Service categories and detailed descriptions
 * - Mock advertisements
 * - View limit configurations for different user roles
 * - Helper functions for view limit calculations
 * 
 * Data Includes:
 * - Escort profile mock data (6 sample profiles)
 * - Physical attributes (height, weight, body type, etc.)
 * - Service offerings with pricing modifiers
 * - Language support
 * - Online status and statistics
 * - Mock ads for promotions
 * 
 * User Roles:
 * - guest: Limited preview (5 photos, no videos)
 * - user: Basic member (10 photos, 1 video)
 * - premium: Premium member (20 photos, 5 videos)
 * - vip: VIP member (unlimited photos and videos)
 * 
 * Service Categories:
 * - Classic massage services (8 types)
 * - Special services (8 types)
 * - Wellness & care (8 types)
 * - Sensory play (8 types)
 * - BDSM & Fetish (9 types)
 * - Fetish services (7 types)
 * - Group services (5 types)
 * 
 * @example
 * ```typescript
 * import { 
 *   mockEscorts, 
 *   SERVICE_CATEGORIES, 
 *   getVisiblePhotoCount 
 * } from '@/mockData';
 * 
 * // Get mock profiles
 * const profile = mockEscorts[0];
 * 
 * // Calculate visible items for user role
 * const photoCount = getVisiblePhotoCount(20, 'premium');
 * 
 * // Get service category
 * const classicServices = SERVICE_CATEGORIES.hizmet.services;
 * ```
 * 
 * @typedef {import('./mockData').Escort} Escort
 * @typedef {import('./mockData').ServiceType} ServiceType
 * @typedef {import('./mockData').UserRole} UserRole
 * 
 * @todo Replace with real data from backend
 * @todo Implement dynamic mock data generation
 * @todo Add performance statistics to profiles
 */

// Mock data for development and testing

export interface EscortStats {
  totalBookings: number;
  totalReviews: number;
  averageRating: number;
  responseRate: number; // percentage
  responseTime: number; // minutes
  completedBookings: number;
  cancelledBookings: number;
  noShowBookings: number;
}

export interface Escort {
  id: string;
  displayName: string;
  city: string;
  district: string;
  hourlyRate: number;
  profilePhoto?: string;
  isVerifiedByAdmin: boolean;
  isVip: boolean;
  age?: number;
  height?: number;
  weight?: number;
  rating?: number;
  reviewCount?: number;
  photos?: string[];
  videos?: string[];
  // Yeni filtre özellikleri
  ethnicity?: string;
  bodyType?: string;
  breastSize?: string;
  hipType?: string;
  hairColor?: string;
  eyeColor?: string;
  // Yaşam tarzı özellikleri
  smoking?: 'yes' | 'no' | 'occasional';
  alcohol?: 'yes' | 'no' | 'social';
  // Hizmet özellikleri
  services?: ServiceType[];
  // Ek bilgiler
  languages?: string[];
  about?: string;
  // Online durum ve istatistikler
  lastSeen?: Date | string;
  stats?: EscortStats;
}

// Hizmet türleri
export type ServiceType =
  | 'classic'          // - Klasik escort hizmeti
  | 'relaxation'       // - Rahatlama hizmeti
  | 'sport'            // - Spor hizmeti
  | 'swedish'          // - İsveç tarzı
  | 'deep_tissue'      // - Derin doku
  | 'hot_stone'        // - Sıcak taş hizmeti
  | 'thai'             // - Tay tarzı
  | 'aromatherapy'     // Aromaterapi
  | 'couples'          // - Çift hizmeti
  | 'four_hands'       // - Dört el
  | 'body_to_body'     // - Vücut vücut
  | 'tantric'          // - Tantra hizmeti
  | 'lingam'           // - Lingam hizmeti
  | 'yoni'             // - Yoni hizmeti
  | 'nuru'             // - Nuru hizmeti
  | 'soapy'            // Sabunlu hizmet
  | 'prostate'         // - Prostat hizmeti
  | 'foot'             // - Ayak hizmeti
  | 'facial'           // - Yüz hizmeti
  | 'scalp'            // - Kafa derisi
  | 'reflexology'      // Refleksoloji
  | 'shiatsu'          // Shiatsu
  | 'balinese'         // - Bali tarzı
  | 'hot_oil'          // - Sıcak yağ
  | 'ice_fire'         // - Buz ve ateş
  | 'chocolate'        // - Çikolata hizmeti
  | 'honey'            // - Bal hizmeti
  | 'bdsm_light'       // Hafif BDSM
  | 'bdsm_advanced'    // İleri seviye BDSM
  | 'domination'       // Dominasyon
  | 'submission'       // Teslimiyet
  | 'role_play'        // Rol oyunu
  | 'fetish_light'     // Hafif fetiş
  | 'fetish_advanced'  // İleri seviye fetiş
  | 'group_2'          // 2 kişilik grup
  | 'group_3'          // 3 kişilik grup
  | 'group_4_plus'     // 4+ kişilik grup
  | 'lesbian'          // Lezbiyen şov
  | 'gay'              // - Gay hizmeti
  | 'toy_show'         // Oyuncak şov
  | 'golden_shower'    // Altın yağmur
  | 'strap_on'         // Strapon
  | 'trampling'        // Çiğnem
  | 'facesitting'      // Yüz oturma
  | 'spanking'         // Tokatlama
  | 'bondage'          // Bağlama
  | 'sensory'          // - Duyusal hizmeti
  | 'blindfold'        // Bağlı göz
  | 'feather'          // Tüy dokunuşu
  | 'ice_play'         // Buz oyunu
  | 'wax_play'         // Mum oyunu
  | 'edging'           // Kenar atlama
  | 'tease'            // Tahrik
  | 'full_service';    // Tam hizmet

// Hizmet kategorileri
export const SERVICE_CATEGORIES = {
  hizmet: {
    name: 'Hizmet Hizmetleri',
    icon: '💆',
    services: [
      { id: 'classic', name: 'Klasik Hizmet', description: 'Geleneksel hizmet tekniği', popular: true },
      { id: 'relaxation', name: 'Rahatlama Hizmetı', description: 'Stres giderici hizmet', popular: true },
      { id: 'sport', name: 'Spor Hizmetı', description: 'Sporcular için derin doku hizmetı' },
      { id: 'swedish', name: 'İsveç Hizmetı', description: 'Rahatlatıcı İsveç tekniği', popular: true },
      { id: 'deep_tissue', name: 'Derin Doku Hizmetı', description: 'Kas derinliklerine etkili' },
      { id: 'hot_stone', name: 'Sıcak Taş Hizmetı', description: 'Volkanik taşlarla hizmet' },
      { id: 'thai', name: 'Tay Hizmetı', description: 'Geleneksel - Tay tarzı' },
      { id: 'aromaterapi', name: 'Aromaterapi', description: 'Esansiyel yağlarla hizmet' }
    ]
  },
  ozel: {
    name: 'Özel Hizmetlar',
    icon: '✨',
    services: [
      { id: 'couples', name: 'Çift Hizmetı', description: 'Çiftler birlikte hizmet', popular: true },
      { id: 'four_hands', name: 'Dört El Hizmetı', description: 'İki terapist simultane' },
      { id: 'body_to_body', name: 'Vücut Vücut Hizmetı', description: 'Vücut temaslı hizmet' },
      { id: 'tantric', name: 'Tantra Hizmetı', description: 'Spiritüel tantra' },
      { id: 'lingam', name: 'Lingam Hizmetı', description: 'Erkekler için özel' },
      { id: 'yoni', name: 'Yoni Hizmetı', description: 'Kadınlar için özel' },
      { id: 'nuru', name: 'Nuru Hizmetı', description: 'Japon özel hizmetı' },
      { id: 'soapy', name: 'Sabunlu Hizmet', description: 'Köpüklü hizmet' }
    ]
  },
  wellness: {
    name: 'Wellness & Bakım',
    icon: '🌿',
    services: [
      { id: 'prostate', name: 'Prostat Hizmetı', description: 'Sağlık için prostat hizmetı' },
      { id: 'foot', name: 'Ayak Hizmetı', description: 'Refleksoloji ile ayak hizmetı' },
      { id: 'facial', name: 'Yüz Hizmetı', description: 'Yüz ve boyun hizmetı' },
      { id: 'scalp', name: 'Kafa Derisi Hizmetı', description: 'Baş hizmetı' },
      { id: 'reflexology', name: 'Refleksoloji', description: 'Nokta terapi' },
      { id: 'shiatsu', name: 'Shiatsu', description: 'Japon basınç hizmetı' },
      { id: 'balinese', name: 'Bali Hizmetı', description: 'Bali adası tekniği' },
      { id: 'hot_oil', name: 'Sıcak Yağ Hizmetı', description: 'Isıtılmış yağlarla' }
    ]
  },
  sensory: {
    name: 'Duyusal Oyunlar',
    icon: '🔥',
    services: [
      { id: 'ice_fire', name: 'Buz ve Ateş', description: 'Sıcak ve soğuk duyusu' },
      { id: 'chocolate', name: 'Çikolata Hizmetı', description: 'Çikolatalı hizmet' },
      { id: 'honey', name: 'Bal Hizmetı', description: 'Ballı hizmet' },
      { id: 'sensory', name: 'Duyusal Hizmet', description: '5 duyu uyaran' },
      { id: 'blindfold', name: 'Bağlı Göz', description: 'Gözler bağlı hizmet' },
      { id: 'feather', name: 'Tüy Dokunuşu', description: 'Tüy ile uyarım' },
      { id: 'ice_play', name: 'Buz Oyunu', description: 'Buz ile oyun' },
      { id: 'wax_play', name: 'Mum Oyunu', description: 'Mum damlatma' }
    ]
  },
  bdsm: {
    name: 'BDSM & Fetiş',
    icon: '⛓️',
    services: [
      { id: 'bdsm_light', name: 'Hafif BDSM', description: 'Başlangıç seviyesi BDSM', popular: true },
      { id: 'bdsm_advanced', name: 'İleri BDSM', description: 'Deneyimli için' },
      { id: 'domination', name: 'Dominasyon', description: 'Dominant rol' },
      { id: 'submission', name: 'Teslimiyet', description: 'Sub rol' },
      { id: 'role_play', name: 'Rol Oyunu', description: 'Fantezi rolleri', popular: true },
      { id: 'bondage', name: 'Bağlama', description: 'Japon bağlama' },
      { id: 'spanking', name: 'Tokatlama', description: 'Göğüs tokatlama' },
      { id: 'facesitting', name: 'Yüz Oturma', description: 'Yüz üzerinde oturma' },
      { id: 'trampling', name: 'Çiğnem', description: 'Üzerinde yürüme' }
    ]
  },
  fetish: {
    name: 'Fetiş Hizmetler',
    icon: '🎭',
    services: [
      { id: 'fetish_light', name: 'Hafif Fetiş', description: 'Yumuşak fetiş' },
      { id: 'fetish_advanced', name: 'İleri Fetiş', description: 'Hard fetiş' },
      { id: 'strap_on', name: 'Strapon', description: 'Strapon hizmeti' },
      { id: 'toy_show', name: 'Oyuncak Şov', description: 'Oyuncak gösteri' },
      { id: 'golden_shower', name: 'Altın Yağmur', description: 'Altın duş' },
      { id: 'edging', name: 'Kenar Atlama', description: 'Tahrik kontrolü' },
      { id: 'tease', name: 'Tahrik', description: 'Uzun tahrik' }
    ]
  },
  grup: {
    name: 'Grup Hizmetleri',
    icon: '👥',
    services: [
      { id: 'group_2', name: '2 Kişilik Grup', description: 'İki escort', popular: true },
      { id: 'group_3', name: '3 Kişilik Grup', description: 'Üç escort' },
      { id: 'group_4_plus', name: '4+ Kişilik Grup', description: 'Daha fazla escort' },
      { id: 'lesbian', name: 'Lezbiyen Şov', description: 'Kız-Kız şov' },
      { id: 'gay', name: 'Gay Hizmet', description: 'Erkek-Erkek hizmet' }
    ]
  }
};

// Hizmet detaylı açıklamaları
export const SERVICE_DETAILS = {
  classic: {
    name: 'Klasik Hizmet',
    description: 'Geleneksel Türk hizmetı tekniği. Kas gevşemesi ve rahatlama.',
    duration: [30, 60, 90],
    priceModifier: 1.0
  },
  relaxation: {
    name: 'Rahatlama Hizmetı',
    description: 'Yumuşak dokunuşlarla stres giderici hizmet.',
    duration: [60, 90, 120],
    priceModifier: 1.1
  },
  nuru: {
    name: 'Nuru Hizmetı',
    description: 'Japon özel hizmet tekniği. Kayganlık ile vücut teması.',
    duration: [60, 90],
    priceModifier: 1.8
  },
  bdsm_light: {
    name: 'Hafif BDSM',
    description: 'Başlangıç seviyesi BDSM deneyimi. Bağlama, hafif domina.',
    duration: [60, 90, 120],
    priceModifier: 2.0,
    warning: 'Önce görüşme şart'
  },
  group_2: {
    name: '2 Kişilik Grup',
    description: 'İki escort simultane hizmet.',
    duration: [60, 90, 120],
    priceModifier: 2.5
  }
};

export const mockEscorts: Escort[] = [
  {
    id: '1',
    displayName: 'Ayşe Yılmaz',
    city: 'İstanbul',
    district: 'Kadıköy',
    hourlyRate: 1500,
    profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
    isVerifiedByAdmin: true,
    isVip: true,
    age: 24,
    height: 170,
    weight: 55,
    rating: 5.0,
    reviewCount: 42,
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800',
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
      'https://images.unsplash.com/photo-1502682297470-dc3c3fbeaca4?w=800',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
    ],
    videos: [
      'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4',
      'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_5mb.mp4',
    ],
    ethnicity: 'Avrupalı',
    bodyType: 'Fit',
    breastSize: 'Orta',
    hipType: 'Kıvraklı',
    hairColor: 'Kumral',
    eyeColor: 'Ela',
    smoking: 'no',
    alcohol: 'social',
    services: ['classic', 'relaxation', 'swedish', 'deep_tissue', 'hot_stone', 'body_to_body', 'nuru', 'tantric'],
    languages: ['Türkçe', 'İngilizce'],
    about: 'Profesyonel escort, 5 yıllık deneyim. Hijyen ve kalite çok önemli.',
    lastSeen: new Date(Date.now() - 10 * 60 * 1000), // 10 dk önce
    stats: {
      totalBookings: 156,
      totalReviews: 42,
      averageRating: 5.0,
      responseRate: 95,
      responseTime: 15,
      completedBookings: 148,
      cancelledBookings: 5,
      noShowBookings: 3
    }
  },
  {
    id: '2',
    displayName: 'Elif Demir',
    city: 'İstanbul',
    district: 'Beşiktaş',
    hourlyRate: 2000,
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
    isVerifiedByAdmin: true,
    isVip: true,
    age: 26,
    height: 168,
    weight: 52,
    rating: 4.9,
    reviewCount: 38,
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800',
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800',
      'https://images.unsplash.com/photo-1502682297470-dc3c3fbeaca4?w=800',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800',
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800',
    ],
    videos: [
      'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    ],
    ethnicity: 'Rus',
    bodyType: 'İnce',
    breastSize: 'Büyük',
    hipType: 'Geniş',
    hairColor: 'Sarı',
    eyeColor: 'Mavi'
  },
  {
    id: '3',
    displayName: 'Zeynep Kaya',
    city: 'Bursa',
    district: 'Nilüfer',
    hourlyRate: 1200,
    profilePhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
    isVerifiedByAdmin: true,
    isVip: false,
    age: 23,
    height: 165,
    weight: 50,
    rating: 4.8,
    reviewCount: 25,
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800',
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800',
      'https://images.unsplash.com/photo-1502682297470-dc3c3fbeaca4?w=800',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800',
    ],
    videos: [],
    ethnicity: 'Karışık',
    bodyType: 'Zayıf',
    breastSize: 'Küçük',
    hipType: 'Dar',
    hairColor: 'Siyah',
    eyeColor: 'Kahverengi'
  },
  {
    id: '4',
    displayName: 'Selin Arslan',
    city: 'İstanbul',
    district: 'Şişli',
    hourlyRate: 2500,
    profilePhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
    isVerifiedByAdmin: true,
    isVip: true,
    age: 27,
    height: 172,
    weight: 56,
    rating: 5.0,
    reviewCount: 56,
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800',
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800',
      'https://images.unsplash.com/photo-1502682297470-dc3c3fbeaca4?w=800',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800',
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800',
    ],
    videos: [
      'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4',
    ],
    ethnicity: 'Ukraynalı',
    bodyType: 'Atletik',
    breastSize: 'Çok Büyük',
    hipType: 'Yuvarlak',
    hairColor: 'Kahverengi',
    eyeColor: 'Yeşil'
  },
  {
    id: '5',
    displayName: 'Deniz Çelik',
    city: 'Kocaeli',
    district: 'İzmit',
    hourlyRate: 1000,
    profilePhoto: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800',
    isVerifiedByAdmin: true,
    isVip: false,
    age: 22,
    height: 160,
    weight: 48,
    rating: 4.7,
    reviewCount: 18,
    photos: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800',
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800',
    ],
    videos: [],
    ethnicity: 'Orta Doğulu',
    bodyType: 'Orta',
    breastSize: 'Orta',
    hipType: 'Orta',
    hairColor: 'Kızıl',
    eyeColor: 'Yeşil'
  },
  {
    id: '6',
    displayName: 'Ece Öztürk',
    city: 'İstanbul',
    district: 'Bakırköy',
    hourlyRate: 1800,
    profilePhoto: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800',
    isVerifiedByAdmin: true,
    isVip: true,
    age: 25,
    height: 174,
    weight: 54,
    rating: 4.9,
    reviewCount: 31,
    photos: [
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800',
      'https://images.unsplash.com/photo-1502682297470-dc3c3fbeaca4?w=800',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800',
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800',
    ],
    videos: [
      'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    ],
    ethnicity: 'Latin',
    bodyType: 'Dolgun',
    breastSize: 'Doğal',
    hipType: 'Kıvraklı',
    hairColor: 'Platin',
    eyeColor: 'Mavi'
  }
];

// Mock ads
export const mockAds = [
  {
    id: 'ad1',
    title: 'VIP Üyelik - %50 İndirim',
    description: 'Premium özelliklere erişim sağlayın',
    imageUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400',
    link: '/vip'
  },
  {
    id: 'ad2',
    title: 'Güvenli Taşıma Hizmeti',
    description: '7/24 güvenli ulaşım',
    imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400',
    link: '/safety'
  }
];

// Kullanıcı rollerine göre görüntüleme limitleri
export const VIEW_LIMITS = {
  guest: {
    photos: 5,
    videos: 0,
    label: 'Misafir'
  },
  user: {
    photos: 10,
    videos: 1,
    label: 'Üye'
  },
  premium: {
    photos: 20,
    videos: 5,
    label: 'Premium Üye'
  },
  vip: {
    photos: Infinity,
    videos: Infinity,
    label: 'VIP Üye'
  }
} as const;

export type UserRole = keyof typeof VIEW_LIMITS;

// Kullanıcının rolüne göre görüntüleme limitini getir
export function getViewLimits(role?: UserRole) {
  return VIEW_LIMITS[role || 'guest'];
}

// Kullanıcının kaç fotoğraf görebileceğini hesapla
export function getVisiblePhotoCount(totalPhotos: number, role?: UserRole): number {
  const limits = getViewLimits(role);
  return Math.min(totalPhotos, limits.photos);
}

// Kullanıcının kaç video görebileceğini hesapla
export function getVisibleVideoCount(totalVideos: number, role?: UserRole): number {
  const limits = getViewLimits(role);
  if (limits.videos === Infinity) return totalVideos;
  return Math.min(totalVideos, limits.videos);
}

// Alias for backward compatibility
export const mockMasseuses = mockEscorts;
