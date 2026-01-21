/**
 * Mock Bildirimler Verisi
 * 
 * Örnek bildirim verileri.
 * Randevu, mesaj, sistem, ödeme ve güvenlik bildirimleri içerir.
 * 
 * @module data/mockData/notifications
 * @category MockData
 */

/**
 * Bildirim türleri
 */
export type NotificationType = 'randevu' | 'mesaj' | 'sistem' | 'ödeme' | 'güvenlik';

/**
 * Bildirim öncelik seviyeleri
 */
export type NotificationPriority = 'low' | 'normal' | 'high';

/**
 * Bildirim interface
 */
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
  icon?: string;
  priority: NotificationPriority;
}

/**
 * Mock bildirimler koleksiyonu
 */
export const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    userId: 'cust-001',
    type: 'randevu',
    title: 'Randevu Onaylandı',
    message: 'Ayşe ile 25 Ocak 19:00 randevunuz onaylandı.',
    isRead: false,
    createdAt: '2024-01-20T10:30:00Z',
    link: '/my-appointments',
    icon: '✅',
    priority: 'high',
  },
  {
    id: 'notif-002',
    userId: 'esc-001',
    type: 'mesaj',
    title: 'Yeni Mesaj',
    message: 'Mehmet Y. size bir mesaj gönderdi.',
    isRead: false,
    createdAt: '2024-01-20T11:15:00Z',
    link: '/messages',
    icon: '💬',
    priority: 'normal',
  },
  {
    id: 'notif-003',
    userId: 'cust-002',
    type: 'ödeme',
    title: 'Ödeme Başarılı',
    message: '1.500 TL tutarındaki ödemeniz başarıyla alındı.',
    isRead: true,
    createdAt: '2024-01-19T16:45:00Z',
    link: '/billing',
    icon: '💳',
    priority: 'normal',
  },
  {
    id: 'notif-004',
    userId: 'esc-002',
    type: 'randevu',
    title: 'Yeni Randevu Talebi',
    message: 'Can K. 26 Ocak için randevu talebinde bulundu.',
    isRead: false,
    createdAt: '2024-01-20T09:20:00Z',
    link: '/escort/appointments',
    icon: '📅',
    priority: 'high',
  },
  {
    id: 'notif-005',
    userId: 'cust-003',
    type: 'sistem',
    title: 'Profil Güncellendi',
    message: 'Profil bilgileriniz başarıyla güncellendi.',
    isRead: true,
    createdAt: '2024-01-19T14:30:00Z',
    icon: '⚙️',
    priority: 'low',
  },
  {
    id: 'notif-006',
    userId: 'esc-003',
    type: 'güvenlik',
    title: 'Güvenlik Uyarısı',
    message: 'Hesabınıza yeni bir cihazdan giriş yapıldı.',
    isRead: false,
    createdAt: '2024-01-20T08:00:00Z',
    link: '/settings/security',
    icon: '🔒',
    priority: 'high',
  },
  {
    id: 'notif-007',
    userId: 'cust-004',
    type: 'mesaj',
    title: 'Mesaj Yanıtlandı',
    message: 'Zeynep mesajınıza yanıt verdi.',
    isRead: true,
    createdAt: '2024-01-19T12:10:00Z',
    link: '/messages',
    icon: '💬',
    priority: 'normal',
  },
  {
    id: 'notif-008',
    userId: 'esc-004',
    type: 'ödeme',
    title: 'Kazanç Aktarıldı',
    message: '5.200 TL kazancınız hesabınıza aktarıldı.',
    isRead: false,
    createdAt: '2024-01-20T07:30:00Z',
    link: '/escort/earnings',
    icon: '💰',
    priority: 'high',
  },
  {
    id: 'notif-009',
    userId: 'cust-005',
    type: 'randevu',
    title: 'Randevu Hatırlatması',
    message: 'Yarın 20:00 randevunuzu unutmayın.',
    isRead: false,
    createdAt: '2024-01-20T10:00:00Z',
    link: '/my-appointments',
    icon: '⏰',
    priority: 'normal',
  },
  {
    id: 'notif-010',
    userId: 'esc-005',
    type: 'sistem',
    title: 'Profil Onaylandı',
    message: 'Profiliniz admin tarafından onaylandı ve yayında.',
    isRead: true,
    createdAt: '2024-01-18T15:20:00Z',
    icon: '✅',
    priority: 'high',
  },
  {
    id: 'notif-011',
    userId: 'cust-001',
    type: 'güvenlik',
    title: 'Şifre Değiştirildi',
    message: 'Hesap şifreniz başarıyla değiştirildi.',
    isRead: true,
    createdAt: '2024-01-18T11:45:00Z',
    icon: '🔑',
    priority: 'high',
  },
  {
    id: 'notif-012',
    userId: 'esc-006',
    type: 'randevu',
    title: 'Randevu İptal Edildi',
    message: 'Ali T. 24 Ocak randevusunu iptal etti.',
    isRead: false,
    createdAt: '2024-01-20T06:15:00Z',
    link: '/escort/appointments',
    icon: '❌',
    priority: 'normal',
  },
  {
    id: 'notif-013',
    userId: 'cust-002',
    type: 'mesaj',
    title: 'Yeni Mesaj',
    message: 'Elif size özel bir mesaj gönderdi.',
    isRead: false,
    createdAt: '2024-01-20T05:50:00Z',
    link: '/messages',
    icon: '💬',
    priority: 'normal',
  },
  {
    id: 'notif-014',
    userId: 'esc-007',
    type: 'ödeme',
    title: 'Ödeme Bekleniyor',
    message: 'Randevu ücreti ödeme bekliyor.',
    isRead: true,
    createdAt: '2024-01-19T18:30:00Z',
    link: '/escort/earnings',
    icon: '⏳',
    priority: 'normal',
  },
  {
    id: 'notif-015',
    userId: 'cust-003',
    type: 'sistem',
    title: 'Üyelik Yükseltildi',
    message: 'Premium üyeliğiniz aktif edildi.',
    isRead: false,
    createdAt: '2024-01-20T04:00:00Z',
    icon: '⭐',
    priority: 'high',
  },
  {
    id: 'notif-016',
    userId: 'esc-008',
    type: 'randevu',
    title: 'Randevu Tamamlandı',
    message: 'Bugünkü randevunuz tamamlandı olarak işaretlendi.',
    isRead: true,
    createdAt: '2024-01-19T22:30:00Z',
    link: '/escort/appointments',
    icon: '✔️',
    priority: 'low',
  },
  {
    id: 'notif-017',
    userId: 'cust-004',
    type: 'güvenlik',
    title: 'İki Faktörlü Doğrulama',
    message: 'İki faktörlü doğrulama başarıyla etkinleştirildi.',
    isRead: true,
    createdAt: '2024-01-19T13:15:00Z',
    icon: '🔐',
    priority: 'normal',
  },
  {
    id: 'notif-018',
    userId: 'esc-009',
    type: 'mesaj',
    title: 'Görüşme Talebi',
    message: 'Yeni bir görüşme talebi aldınız.',
    isRead: false,
    createdAt: '2024-01-20T03:20:00Z',
    link: '/messages',
    icon: '📞',
    priority: 'high',
  },
  {
    id: 'notif-019',
    userId: 'cust-005',
    type: 'ödeme',
    title: 'Cüzdan Yükleme',
    message: 'Cüzdanınıza 2.000 TL yüklendi.',
    isRead: false,
    createdAt: '2024-01-20T02:45:00Z',
    link: '/wallet',
    icon: '💵',
    priority: 'normal',
  },
  {
    id: 'notif-020',
    userId: 'esc-010',
    type: 'sistem',
    title: 'Fotoğraf Onaylandı',
    message: 'Yüklediğiniz 3 fotoğraf onaylandı.',
    isRead: true,
    createdAt: '2024-01-19T10:00:00Z',
    icon: '📸',
    priority: 'low',
  },
  {
    id: 'notif-021',
    userId: 'cust-001',
    type: 'randevu',
    title: 'Randevu Yaklaşıyor',
    message: '2 saat sonra randevunuz başlıyor.',
    isRead: false,
    createdAt: '2024-01-20T17:00:00Z',
    link: '/my-appointments',
    icon: '🔔',
    priority: 'high',
  },
  {
    id: 'notif-022',
    userId: 'esc-001',
    type: 'güvenlik',
    title: 'Kimlik Doğrulandı',
    message: 'Kimlik doğrulama işleminiz başarılı.',
    isRead: true,
    createdAt: '2024-01-17T14:20:00Z',
    icon: '✅',
    priority: 'high',
  },
  {
    id: 'notif-023',
    userId: 'cust-002',
    type: 'mesaj',
    title: 'Video Mesaj',
    message: 'Selin size video mesaj gönderdi.',
    isRead: false,
    createdAt: '2024-01-20T01:30:00Z',
    link: '/messages',
    icon: '🎥',
    priority: 'normal',
  },
  {
    id: 'notif-024',
    userId: 'esc-002',
    type: 'ödeme',
    title: 'Komisyon Kesintisi',
    message: 'Aylık komisyon kesintisi yapıldı.',
    isRead: true,
    createdAt: '2024-01-19T00:00:00Z',
    link: '/escort/earnings',
    icon: '📊',
    priority: 'normal',
  },
  {
    id: 'notif-025',
    userId: 'cust-003',
    type: 'sistem',
    title: 'Bakım Bildirimi',
    message: 'Yarın 02:00-04:00 arası sistem bakımı yapılacak.',
    isRead: false,
    createdAt: '2024-01-20T00:15:00Z',
    icon: '🔧',
    priority: 'low',
  },
  {
    id: 'notif-026',
    userId: 'esc-003',
    type: 'randevu',
    title: 'Değerlendirme Alındı',
    message: 'Müşteriniz size 5 yıldız verdi.',
    isRead: false,
    createdAt: '2024-01-19T23:45:00Z',
    link: '/reviews',
    icon: '⭐',
    priority: 'normal',
  },
  {
    id: 'notif-027',
    userId: 'cust-004',
    type: 'güvenlik',
    title: 'Şüpheli Aktivite',
    message: 'Hesabınızda şüpheli aktivite tespit edildi.',
    isRead: false,
    createdAt: '2024-01-20T00:00:00Z',
    link: '/settings/security',
    icon: '⚠️',
    priority: 'high',
  },
  {
    id: 'notif-028',
    userId: 'esc-004',
    type: 'mesaj',
    title: 'Favori Listeleme',
    message: '5 yeni kullanıcı sizi favorilere ekledi.',
    isRead: true,
    createdAt: '2024-01-19T20:00:00Z',
    icon: '❤️',
    priority: 'low',
  },
  {
    id: 'notif-029',
    userId: 'cust-005',
    type: 'ödeme',
    title: 'İndirim Kuponu',
    message: 'Yeni üyelere özel %20 indirim kuponunuz var.',
    isRead: false,
    createdAt: '2024-01-19T19:30:00Z',
    link: '/pricing',
    icon: '🎁',
    priority: 'normal',
  },
  {
    id: 'notif-030',
    userId: 'esc-005',
    type: 'sistem',
    title: 'Müşaaitlik Güncellendi',
    message: 'Çalışma saatleriniz başarıyla güncellendi.',
    isRead: true,
    createdAt: '2024-01-19T17:15:00Z',
    icon: '📅',
    priority: 'low',
  },
];

/**
 * Kullanıcı ID'sine göre bildirimleri getir
 */
export const getNotificationsByUserId = (userId: string): Notification[] => {
  return mockNotifications.filter(n => n.userId === userId);
};

/**
 * Okunmamış bildirimleri getir
 */
export const getUnreadNotifications = (userId: string): Notification[] => {
  return mockNotifications.filter(n => n.userId === userId && !n.isRead);
};

/**
 * Bildirim türüne göre filtrele
 */
export const getNotificationsByType = (userId: string, type: NotificationType): Notification[] => {
  return mockNotifications.filter(n => n.userId === userId && n.type === type);
};

/**
 * Önceliğe göre bildirimleri getir
 */
export const getNotificationsByPriority = (userId: string, priority: NotificationPriority): Notification[] => {
  return mockNotifications.filter(n => n.userId === userId && n.priority === priority);
};
