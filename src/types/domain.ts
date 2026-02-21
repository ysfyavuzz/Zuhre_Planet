/**
 * DOMAIN TYPES & INTERFACES
 *
 * Bu dosya, uygulamanın temel veri yapılarını ve tip tanımlarını içerir.
 * Single Responsibility Principle (SRP) gereği, veri modelleri burada tanımlanır
 * ve tüm uygulama tarafından buradan tüketilir.
 */

// --- ENUMS & CONSTANTS ---

export type UserRole =
  | "visitor"
  | "member"
  | "vip_member"
  | "escort"
  | "agency"
  | "admin";

export type SubscriptionTier = "standard" | "gold" | "diamond" | "elite";

export type VerificationStatus =
  | "unverified"
  | "pending"
  | "verified"
  | "rejected";

// Grid Sistemi için Span Tanımları (Tetris Layout)
export type GridSpan = "1x1" | "2x1" | "2x2" | "4x1" | "6x1";

// --- CORE INTERFACES ---

// Temel Kullanıcı Profili (Ortak Alanlar)
export interface BaseProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  role: UserRole;
  isOnline: boolean;
  lastSeen?: Date;
}

// Onay Durumu (Medya ve Profil Değişiklikleri için)
export type ApprovalStatus = "approved" | "pending" | "rejected";

export interface MediaItem {
  id: string;
  originalUrl: string; // Yüklenen orijinal görselin URL'si
  processedUrl?: string; // AI tarafından işlenmiş görselin URL'si (bulanıklaştırılmış, maskeli vb.)
  type: "image" | "video";
  status: ApprovalStatus;
  rejectionReason?: string; // Eğer reddedilirse nedeni
  // Bu medya öğesine özel işleme seçenekleri (eğer varsa)
  imageProcessingOptions?: {
    faceMaskingEnabled?: boolean;
    blurBackground?: boolean;
    customMaskId?: string;
    brightnessAdjustment?: number;
    contrastAdjustment?: number;
  };
}

// İlan Profili (Escort/Agency)
export interface ListingProfile extends BaseProfile {
  slug?: string; // URL için benzersiz tanımlayıcı
  stageName?: string; // Sahne adı
  age?: number; // Yaş
  city?: string; // Şehir
  district?: string; // İlçe
  bio?: string; // Kısa biyografi
  biography?: string; // Uzun biyografi
  slogan?: string; // Slogan
  coverImage?: string; // Kapak görseli
  thumbnailVideo?: string; // Önizleme videosu
  gallery?: string | any[]; // Galeri (JSON string or Array)
  mediaPrivacySettings?: any; // Medya gizlilik ayarları
  services: string[]; // Sunulan hizmetler (tags)
  languages: string[]; // Konuşulan diller

  // Fiziksel Özellikler
  height?: number; // cm
  weight?: number; // kg
  eyeColor?: string;
  hairColor?: string;

  // Sistem Durumları
  tier: SubscriptionTier;
  verificationStatus: VerificationStatus;
  hasVerifiedBadge?: boolean; // Yeni alan (Opsiyonel yapıldı)
  isBoosted: boolean; // Öne çıkarılmış mı?
  gridSpan: GridSpan; // Grid'deki boyutu

  // Bekleyen Değişiklikler (Staging Area)
  pendingChanges?: Partial<ListingProfile>;

  // İstatistikler
  rating: number;
  reviewCount: number;
  viewCount: number;

  // İletişim (Gizlilik ayarlarına göre değişir)
  whatsapp?: string;
  phone?: string;

  // Fiyatlandırma
  rates?: {
    hourly: number;
    daily?: number;
    currency: "TRY" | "USD" | "EUR";
  };
}

// Filtreleme Seçenekleri
export interface FilterOptions {
  city?: string;
  district?: string;
  ageRange?: [number, number];
  priceRange?: [number, number];
  services?: string[];
  tier?: SubscriptionTier[];
  verifiedOnly?: boolean;
}

// --- CRM & SOSYAL ARAYÜZLER ---

// Randevu Durumu
export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

// Randevu Kaydı
export interface Appointment {
  id: string;
  clientId: string;
  clientDisplayName: string; // Müşteri ismi (veya rumuz)
  date: Date;
  duration: number; // Saat cinsinden
  status: AppointmentStatus;
  location: string;
  price: number;
  escortNote?: string; // Escort'un kendine aldığı özel not
  clientRating?: number; // Escort'un müşteriye verdiği puan (Güvenlik skoru için)
}

// Takipçi / Hayran
export interface Follower {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string;
  status: "pending" | "approved" | "blocked"; // Onay mekanizması
  requestedAt: Date;
}

// Müsaitlik Takvimi
export interface AvailabilitySlot {
  dayOfWeek: number; // 0=Pazar, 1=Pazartesi...
  startTime: string; // "14:00"
  endTime: string; // "22:00"
  isAvailable: boolean;
}

// Profil Sağlığı (Gamification)
export interface ProfileHealth {
  score: number; // 0-100 arası
  missingFields: string[]; // "bio", "video", "price"
  nextReward?: string; // "1 Günlük Vitrin Hakkı"
}

// Kart Bileşeni Props
export interface StandardCardProps {
  profile: ListingProfile;
  onQuickView?: (profile: ListingProfile) => void;
  showVideoOnHover?: boolean;
}

// Modal Bileşeni Props
export interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ListingProfile | null;
}
