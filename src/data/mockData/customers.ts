/**
 * Mock Customers Data
 * 
 * Example customer profiles with different membership tiers and attributes.
 * Used for development and testing customer-related features.
 * 
 * @module data/mockData/customers
 * @category MockData
 */

export type MembershipTier = 'basic' | 'premium' | 'vip' | 'elite';

export interface Customer {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  membershipTier: MembershipTier;
  joinDate: string;
  isVerified: boolean;
  profilePhoto?: string;
  phoneNumber?: string;
  location?: {
    city: string;
    district?: string;
  };
  preferences?: {
    favoriteServices?: string[];
    preferredCities?: string[];
    ageRange?: [number, number];
    priceRange?: [number, number];
  };
  stats: {
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    totalSpent: number;
    averageRating: number; // Rating they give
    reviewsGiven: number;
  };
  wallet: {
    balance: number;
    credits: number;
    loyaltyPoints: number;
  };
  settings: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    privacy: {
      showOnlineStatus: boolean;
      showLastSeen: boolean;
      allowMessages: boolean;
    };
  };
  createdAt: string;
  lastActive: string;
}

export const mockCustomers: Customer[] = [
  {
    id: 'cust-001',
    username: 'ahmet_k',
    email: 'ahmet@example.com',
    fullName: 'Ahmet Kaya',
    membershipTier: 'basic',
    joinDate: '2024-01-15',
    isVerified: true,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmet',
    phoneNumber: '+905551234567',
    location: {
      city: 'İstanbul',
      district: 'Kadıköy',
    },
    preferences: {
      favoriteServices: ['classic', 'relaxation'],
      preferredCities: ['İstanbul', 'Ankara'],
      ageRange: [22, 35],
      priceRange: [500, 1500],
    },
    stats: {
      totalBookings: 12,
      completedBookings: 10,
      cancelledBookings: 2,
      totalSpent: 8500,
      averageRating: 4.5,
      reviewsGiven: 8,
    },
    wallet: {
      balance: 500,
      credits: 10,
      loyaltyPoints: 850,
    },
    settings: {
      notifications: {
        email: true,
        sms: true,
        push: true,
      },
      privacy: {
        showOnlineStatus: true,
        showLastSeen: true,
        allowMessages: true,
      },
    },
    createdAt: '2024-01-15T10:30:00Z',
    lastActive: '2024-03-20T18:45:00Z',
  },
  {
    id: 'cust-002',
    username: 'mehmet_premium',
    email: 'mehmet@example.com',
    fullName: 'Mehmet Yılmaz',
    membershipTier: 'premium',
    joinDate: '2023-11-10',
    isVerified: true,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mehmet',
    phoneNumber: '+905559876543',
    location: {
      city: 'Ankara',
      district: 'Çankaya',
    },
    preferences: {
      favoriteServices: ['couples', 'tantric', 'aromatherapy'],
      preferredCities: ['Ankara', 'İstanbul'],
      ageRange: [25, 40],
      priceRange: [1000, 3000],
    },
    stats: {
      totalBookings: 28,
      completedBookings: 26,
      cancelledBookings: 2,
      totalSpent: 35000,
      averageRating: 4.8,
      reviewsGiven: 22,
    },
    wallet: {
      balance: 2500,
      credits: 50,
      loyaltyPoints: 3500,
    },
    settings: {
      notifications: {
        email: true,
        sms: true,
        push: true,
      },
      privacy: {
        showOnlineStatus: false,
        showLastSeen: false,
        allowMessages: true,
      },
    },
    createdAt: '2023-11-10T14:20:00Z',
    lastActive: '2024-03-21T12:30:00Z',
  },
  {
    id: 'cust-003',
    username: 'can_vip',
    email: 'can@example.com',
    fullName: 'Can Demir',
    membershipTier: 'vip',
    joinDate: '2023-08-05',
    isVerified: true,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Can',
    phoneNumber: '+905551112233',
    location: {
      city: 'İzmir',
      district: 'Konak',
    },
    preferences: {
      favoriteServices: ['four_hands', 'nuru', 'couples', 'body_to_body'],
      preferredCities: ['İzmir', 'İstanbul', 'Antalya'],
      ageRange: [23, 38],
      priceRange: [1500, 5000],
    },
    stats: {
      totalBookings: 52,
      completedBookings: 50,
      cancelledBookings: 2,
      totalSpent: 95000,
      averageRating: 4.9,
      reviewsGiven: 45,
    },
    wallet: {
      balance: 10000,
      credits: 200,
      loyaltyPoints: 9500,
    },
    settings: {
      notifications: {
        email: true,
        sms: true,
        push: true,
      },
      privacy: {
        showOnlineStatus: true,
        showLastSeen: true,
        allowMessages: true,
      },
    },
    createdAt: '2023-08-05T09:15:00Z',
    lastActive: '2024-03-21T20:10:00Z',
  },
  {
    id: 'cust-004',
    username: 'burak_new',
    email: 'burak@example.com',
    fullName: 'Burak Özkan',
    membershipTier: 'basic',
    joinDate: '2024-03-01',
    isVerified: false,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Burak',
    phoneNumber: '+905554445566',
    location: {
      city: 'Antalya',
      district: 'Muratpaşa',
    },
    preferences: {
      favoriteServices: ['classic', 'swedish'],
      preferredCities: ['Antalya'],
      ageRange: [20, 30],
      priceRange: [400, 1000],
    },
    stats: {
      totalBookings: 3,
      completedBookings: 2,
      cancelledBookings: 1,
      totalSpent: 1200,
      averageRating: 4.0,
      reviewsGiven: 2,
    },
    wallet: {
      balance: 100,
      credits: 5,
      loyaltyPoints: 120,
    },
    settings: {
      notifications: {
        email: true,
        sms: false,
        push: true,
      },
      privacy: {
        showOnlineStatus: true,
        showLastSeen: true,
        allowMessages: true,
      },
    },
    createdAt: '2024-03-01T16:40:00Z',
    lastActive: '2024-03-21T15:20:00Z',
  },
  {
    id: 'cust-005',
    username: 'emre_elite',
    email: 'emre@example.com',
    fullName: 'Emre Çelik',
    membershipTier: 'elite',
    joinDate: '2023-05-20',
    isVerified: true,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emre',
    phoneNumber: '+905557778899',
    location: {
      city: 'İstanbul',
      district: 'Beşiktaş',
    },
    preferences: {
      favoriteServices: ['tantric', 'nuru', 'couples', 'four_hands', 'body_to_body'],
      preferredCities: ['İstanbul', 'Bodrum', 'Antalya', 'İzmir'],
      ageRange: [25, 45],
      priceRange: [2000, 10000],
    },
    stats: {
      totalBookings: 85,
      completedBookings: 83,
      cancelledBookings: 2,
      totalSpent: 185000,
      averageRating: 5.0,
      reviewsGiven: 78,
    },
    wallet: {
      balance: 25000,
      credits: 500,
      loyaltyPoints: 18500,
    },
    settings: {
      notifications: {
        email: true,
        sms: true,
        push: true,
      },
      privacy: {
        showOnlineStatus: false,
        showLastSeen: false,
        allowMessages: true,
      },
    },
    createdAt: '2023-05-20T11:00:00Z',
    lastActive: '2024-03-21T22:30:00Z',
  },
  {
    id: 'cust-006',
    username: 'burak_vip',
    email: 'burak@example.com',
    fullName: 'Burak Demir',
    membershipTier: 'vip',
    joinDate: '2023-08-12',
    isVerified: true,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Burak',
    phoneNumber: '+905551122334',
    location: {
      city: 'İzmir',
      district: 'Alsancak',
    },
    preferences: {
      favoriteServices: ['vip', 'tantric', 'couples'],
      preferredCities: ['İzmir', 'İstanbul'],
      ageRange: [24, 35],
      priceRange: [1500, 3500],
    },
    stats: {
      totalBookings: 42,
      completedBookings: 40,
      cancelledBookings: 2,
      totalSpent: 67000,
      averageRating: 4.7,
      reviewsGiven: 35,
    },
    wallet: {
      balance: 5500,
      credits: 120,
      loyaltyPoints: 6700,
    },
    settings: {
      notifications: {
        email: true,
        sms: true,
        push: true,
      },
      privacy: {
        showOnlineStatus: true,
        showLastSeen: true,
        allowMessages: true,
      },
    },
    createdAt: '2023-08-12T14:20:00Z',
    lastActive: '2024-03-21T20:15:00Z',
  },
  {
    id: 'cust-007',
    username: 'cenk_basic',
    email: 'cenk@example.com',
    fullName: 'Cenk Aydın',
    membershipTier: 'basic',
    joinDate: '2024-02-05',
    isVerified: true,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cenk',
    phoneNumber: '+905554455667',
    location: {
      city: 'Bursa',
      district: 'Nilüfer',
    },
    preferences: {
      favoriteServices: ['classic', 'aromatherapy'],
      preferredCities: ['Bursa'],
      ageRange: [22, 30],
      priceRange: [800, 1500],
    },
    stats: {
      totalBookings: 8,
      completedBookings: 7,
      cancelledBookings: 1,
      totalSpent: 5600,
      averageRating: 4.3,
      reviewsGiven: 6,
    },
    wallet: {
      balance: 800,
      credits: 15,
      loyaltyPoints: 560,
    },
    settings: {
      notifications: {
        email: true,
        sms: false,
        push: true,
      },
      privacy: {
        showOnlineStatus: true,
        showLastSeen: true,
        allowMessages: true,
      },
    },
    createdAt: '2024-02-05T09:30:00Z',
    lastActive: '2024-03-21T17:40:00Z',
  },
  {
    id: 'cust-008',
    username: 'deniz_premium',
    email: 'deniz@example.com',
    fullName: 'Deniz Koç',
    membershipTier: 'premium',
    joinDate: '2023-10-18',
    isVerified: true,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Deniz',
    phoneNumber: '+905556677889',
    location: {
      city: 'Antalya',
      district: 'Konyaaltı',
    },
    preferences: {
      favoriteServices: ['tantric', 'couples', 'body_to_body'],
      preferredCities: ['Antalya', 'İstanbul'],
      ageRange: [23, 32],
      priceRange: [1200, 2500],
    },
    stats: {
      totalBookings: 31,
      completedBookings: 29,
      cancelledBookings: 2,
      totalSpent: 48500,
      averageRating: 4.6,
      reviewsGiven: 26,
    },
    wallet: {
      balance: 3200,
      credits: 75,
      loyaltyPoints: 4850,
    },
    settings: {
      notifications: {
        email: true,
        sms: true,
        push: true,
      },
      privacy: {
        showOnlineStatus: true,
        showLastSeen: false,
        allowMessages: true,
      },
    },
    createdAt: '2023-10-18T11:15:00Z',
    lastActive: '2024-03-21T19:50:00Z',
  },
  {
    id: 'cust-009',
    username: 'efe_basic',
    email: 'efe@example.com',
    fullName: 'Efe Arslan',
    membershipTier: 'basic',
    joinDate: '2024-01-28',
    isVerified: false,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Efe',
    phoneNumber: '+905558899001',
    location: {
      city: 'Adana',
      district: 'Seyhan',
    },
    preferences: {
      favoriteServices: ['classic'],
      preferredCities: ['Adana'],
      ageRange: [25, 35],
      priceRange: [900, 1500],
    },
    stats: {
      totalBookings: 5,
      completedBookings: 4,
      cancelledBookings: 1,
      totalSpent: 3800,
      averageRating: 4.2,
      reviewsGiven: 3,
    },
    wallet: {
      balance: 450,
      credits: 8,
      loyaltyPoints: 380,
    },
    settings: {
      notifications: {
        email: true,
        sms: true,
        push: false,
      },
      privacy: {
        showOnlineStatus: true,
        showLastSeen: true,
        allowMessages: true,
      },
    },
    createdAt: '2024-01-28T13:25:00Z',
    lastActive: '2024-03-21T16:10:00Z',
  },
  {
    id: 'cust-010',
    username: 'ferhat_vip',
    email: 'ferhat@example.com',
    fullName: 'Ferhat Özkan',
    membershipTier: 'vip',
    joinDate: '2023-07-22',
    isVerified: true,
    profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ferhat',
    phoneNumber: '+905552233445',
    location: {
      city: 'Ankara',
      district: 'Kızılay',
    },
    preferences: {
      favoriteServices: ['vip', 'tantric', 'aromatherapy', 'couples'],
      preferredCities: ['Ankara', 'İstanbul', 'İzmir'],
      ageRange: [26, 38],
      priceRange: [1600, 3000],
    },
    stats: {
      totalBookings: 54,
      completedBookings: 52,
      cancelledBookings: 2,
      totalSpent: 89000,
      averageRating: 4.8,
      reviewsGiven: 48,
    },
    wallet: {
      balance: 7500,
      credits: 180,
      loyaltyPoints: 8900,
    },
    settings: {
      notifications: {
        email: true,
        sms: true,
        push: true,
      },
      privacy: {
        showOnlineStatus: false,
        showLastSeen: false,
        allowMessages: true,
      },
    },
    createdAt: '2023-07-22T10:00:00Z',
    lastActive: '2024-03-21T21:35:00Z',
  },
];

/**
 * Get customer by ID
 */
export function getCustomerById(id: string): Customer | undefined {
  return mockCustomers.find(c => c.id === id);
}

/**
 * Get customers by membership tier
 */
export function getCustomersByTier(tier: MembershipTier): Customer[] {
  return mockCustomers.filter(c => c.membershipTier === tier);
}

/**
 * Get top spending customers
 */
export function getTopCustomers(limit: number = 5): Customer[] {
  return [...mockCustomers]
    .sort((a, b) => b.stats.totalSpent - a.stats.totalSpent)
    .slice(0, limit);
}
