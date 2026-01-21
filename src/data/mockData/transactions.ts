/**
 * Mock İşlemler Verisi
 * 
 * Örnek finansal işlem verileri.
 * Yükleme, harcama, iade ve komisyon işlemlerini içerir.
 * 
 * @module data/mockData/transactions
 * @category MockData
 */

/**
 * İşlem türleri
 */
export type TransactionType = 'yükleme' | 'harcama' | 'iade' | 'komisyon';

/**
 * İşlem durumları
 */
export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'cancelled';

/**
 * Ödeme yöntemleri
 */
export type PaymentMethod = 'kredi_kartı' | 'havale' | 'cüzdan' | 'nakit';

/**
 * İşlem interface
 */
export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
  balance: number;
  relatedAppointmentId?: string;
}

/**
 * Mock işlemler koleksiyonu
 */
export const mockTransactions: Transaction[] = [
  {
    id: 'txn-001',
    userId: 'cust-001',
    type: 'yükleme',
    amount: 5000,
    description: 'Cüzdan yükleme',
    date: '2024-01-20T10:00:00Z',
    status: 'completed',
    paymentMethod: 'kredi_kartı',
    balance: 5000,
  },
  {
    id: 'txn-002',
    userId: 'cust-001',
    type: 'harcama',
    amount: -1500,
    description: 'Randevu ödemesi - Ayşe',
    date: '2024-01-20T14:30:00Z',
    status: 'completed',
    paymentMethod: 'cüzdan',
    balance: 3500,
    relatedAppointmentId: 'appt-001',
  },
  {
    id: 'txn-003',
    userId: 'esc-001',
    type: 'harcama',
    amount: 1275,
    description: 'Randevu geliri (komisyon sonrası)',
    date: '2024-01-20T14:30:00Z',
    status: 'completed',
    paymentMethod: 'cüzdan',
    balance: 12750,
    relatedAppointmentId: 'appt-001',
  },
  {
    id: 'txn-004',
    userId: 'esc-001',
    type: 'komisyon',
    amount: -225,
    description: 'Platform komisyonu (%15)',
    date: '2024-01-20T14:30:00Z',
    status: 'completed',
    paymentMethod: 'cüzdan',
    balance: 12525,
    relatedAppointmentId: 'appt-001',
  },
  {
    id: 'txn-005',
    userId: 'cust-002',
    type: 'yükleme',
    amount: 3000,
    description: 'Havale ile yükleme',
    date: '2024-01-19T16:00:00Z',
    status: 'completed',
    paymentMethod: 'havale',
    balance: 3000,
  },
  {
    id: 'txn-006',
    userId: 'cust-002',
    type: 'harcama',
    amount: -2000,
    description: 'Randevu ödemesi - Zeynep',
    date: '2024-01-19T18:00:00Z',
    status: 'completed',
    paymentMethod: 'cüzdan',
    balance: 1000,
    relatedAppointmentId: 'appt-002',
  },
  {
    id: 'txn-007',
    userId: 'esc-002',
    type: 'harcama',
    amount: 1700,
    description: 'Randevu geliri (komisyon sonrası)',
    date: '2024-01-19T18:00:00Z',
    status: 'completed',
    paymentMethod: 'cüzdan',
    balance: 28450,
    relatedAppointmentId: 'appt-002',
  },
  {
    id: 'txn-008',
    userId: 'esc-002',
    type: 'komisyon',
    amount: -300,
    description: 'Platform komisyonu (%15)',
    date: '2024-01-19T18:00:00Z',
    status: 'completed',
    paymentMethod: 'cüzdan',
    balance: 28150,
    relatedAppointmentId: 'appt-002',
  },
  {
    id: 'txn-009',
    userId: 'cust-003',
    type: 'yükleme',
    amount: 10000,
    description: 'Cüzdan yükleme - Premium üyelik',
    date: '2024-01-18T12:00:00Z',
    status: 'completed',
    paymentMethod: 'kredi_kartı',
    balance: 10000,
  },
  {
    id: 'txn-010',
    userId: 'cust-003',
    type: 'harcama',
    amount: -1200,
    description: 'Randevu ödemesi - Elif',
    date: '2024-01-19T15:00:00Z',
    status: 'completed',
    paymentMethod: 'cüzdan',
    balance: 8800,
    relatedAppointmentId: 'appt-003',
  },
  {
    id: 'txn-011',
    userId: 'esc-003',
    type: 'harcama',
    amount: 1020,
    description: 'Randevu geliri (komisyon sonrası)',
    date: '2024-01-19T15:00:00Z',
    status: 'completed',
    paymentMethod: 'cüzdan',
    balance: 15280,
    relatedAppointmentId: 'appt-003',
  },
  {
    id: 'txn-012',
    userId: 'cust-004',
    type: 'yükleme',
    amount: 2500,
    description: 'Cüzdan yükleme',
    date: '2024-01-17T10:00:00Z',
    status: 'completed',
    paymentMethod: 'kredi_kartı',
    balance: 2500,
  },
  {
    id: 'txn-013',
    userId: 'cust-004',
    type: 'harcama',
    amount: -800,
    description: 'Randevu ödemesi - Selin',
    date: '2024-01-18T20:00:00Z',
    status: 'completed',
    paymentMethod: 'cüzdan',
    balance: 1700,
    relatedAppointmentId: 'appt-004',
  },
  {
    id: 'txn-014',
    userId: 'esc-004',
    type: 'harcama',
    amount: 680,
    description: 'Randevu geliri (komisyon sonrası)',
    date: '2024-01-18T20:00:00Z',
    status: 'completed',
    paymentMethod: 'cüzdan',
    balance: 9420,
    relatedAppointmentId: 'appt-004',
  },
  {
    id: 'txn-015',
    userId: 'cust-005',
    type: 'yükleme',
    amount: 7500,
    description: 'Havale ile yükleme',
    date: '2024-01-16T14:00:00Z',
    status: 'completed',
    paymentMethod: 'havale',
    balance: 7500,
  },
  {
    id: 'txn-016',
    userId: 'cust-005',
    type: 'harcama',
    amount: -1800,
    description: 'Randevu ödemesi - Deniz',
    date: '2024-01-17T19:00:00Z',
    status: 'completed',
    paymentMethod: 'cüzdan',
    balance: 5700,
    relatedAppointmentId: 'appt-005',
  },
  {
    id: 'txn-017',
    userId: 'esc-005',
    type: 'harcama',
    amount: 1530,
    description: 'Randevu geliri (komisyon sonrası)',
    date: '2024-01-17T19:00:00Z',
    status: 'completed',
    paymentMethod: 'cüzdan',
    balance: 18920,
    relatedAppointmentId: 'appt-005',
  },
  {
    id: 'txn-018',
    userId: 'esc-006',
    type: 'harcama',
    amount: 2550,
    description: 'Randevu geliri (komisyon sonrası)',
    date: '2024-01-16T21:00:00Z',
    status: 'completed',
    paymentMethod: 'cüzdan',
    balance: 22340,
    relatedAppointmentId: 'appt-006',
  },
  {
    id: 'txn-019',
    userId: 'esc-006',
    type: 'komisyon',
    amount: -450,
    description: 'Platform komisyonu (%15)',
    date: '2024-01-16T21:00:00Z',
    status: 'completed',
    paymentMethod: 'cüzdan',
    balance: 21890,
    relatedAppointmentId: 'appt-006',
  },
  {
    id: 'txn-020',
    userId: 'cust-001',
    type: 'iade',
    amount: 500,
    description: 'İptal edilen randevu iadesi',
    date: '2024-01-15T11:00:00Z',
    status: 'completed',
    paymentMethod: 'cüzdan',
    balance: 4000,
    relatedAppointmentId: 'appt-007',
  },
  {
    id: 'txn-021',
    userId: 'cust-002',
    type: 'yükleme',
    amount: 4000,
    description: 'Kredi kartı ile yükleme',
    date: '2024-01-14T09:00:00Z',
    status: 'completed',
    paymentMethod: 'kredi_kartı',
    balance: 4500,
  },
  {
    id: 'txn-022',
    userId: 'esc-007',
    type: 'harcama',
    amount: 1700,
    description: 'Randevu geliri (komisyon sonrası)',
    date: '2024-01-13T18:30:00Z',
    status: 'completed',
    paymentMethod: 'cüzdan',
    balance: 13250,
    relatedAppointmentId: 'appt-008',
  },
  {
    id: 'txn-023',
    userId: 'esc-007',
    type: 'komisyon',
    amount: -300,
    description: 'Platform komisyonu (%15)',
    date: '2024-01-13T18:30:00Z',
    status: 'completed',
    paymentMethod: 'cüzdan',
    balance: 12950,
    relatedAppointmentId: 'appt-008',
  },
  {
    id: 'txn-024',
    userId: 'cust-003',
    type: 'harcama',
    amount: -2200,
    description: 'Randevu ödemesi - Ceren',
    date: '2024-01-12T20:00:00Z',
    status: 'completed',
    paymentMethod: 'cüzdan',
    balance: 6600,
    relatedAppointmentId: 'appt-009',
  },
  {
    id: 'txn-025',
    userId: 'esc-008',
    type: 'harcama',
    amount: 1870,
    description: 'Randevu geliri (komisyon sonrası)',
    date: '2024-01-12T20:00:00Z',
    status: 'completed',
    paymentMethod: 'cüzdan',
    balance: 25640,
    relatedAppointmentId: 'appt-009',
  },
  {
    id: 'txn-026',
    userId: 'cust-004',
    type: 'yükleme',
    amount: 1500,
    description: 'Cüzdan yükleme',
    date: '2024-01-11T13:00:00Z',
    status: 'completed',
    paymentMethod: 'kredi_kartı',
    balance: 3200,
  },
  {
    id: 'txn-027',
    userId: 'cust-005',
    type: 'harcama',
    amount: -950,
    description: 'Randevu ödemesi - Burcu',
    date: '2024-01-10T17:00:00Z',
    status: 'completed',
    paymentMethod: 'cüzdan',
    balance: 4750,
    relatedAppointmentId: 'appt-010',
  },
  {
    id: 'txn-028',
    userId: 'esc-009',
    type: 'harcama',
    amount: 807,
    description: 'Randevu geliri (komisyon sonrası)',
    date: '2024-01-10T17:00:00Z',
    status: 'completed',
    paymentMethod: 'cüzdan',
    balance: 11580,
    relatedAppointmentId: 'appt-010',
  },
  {
    id: 'txn-029',
    userId: 'esc-009',
    type: 'komisyon',
    amount: -143,
    description: 'Platform komisyonu (%15)',
    date: '2024-01-10T17:00:00Z',
    status: 'completed',
    paymentMethod: 'cüzdan',
    balance: 11437,
    relatedAppointmentId: 'appt-010',
  },
  {
    id: 'txn-030',
    userId: 'cust-001',
    type: 'harcama',
    amount: -1600,
    description: 'Randevu ödemesi - Melis',
    date: '2024-01-09T19:30:00Z',
    status: 'completed',
    paymentMethod: 'cüzdan',
    balance: 2400,
    relatedAppointmentId: 'appt-011',
  },
  {
    id: 'txn-031',
    userId: 'esc-010',
    type: 'harcama',
    amount: 1360,
    description: 'Randevu geliri (komisyon sonrası)',
    date: '2024-01-09T19:30:00Z',
    status: 'completed',
    paymentMethod: 'cüzdan',
    balance: 16720,
    relatedAppointmentId: 'appt-011',
  },
  {
    id: 'txn-032',
    userId: 'cust-002',
    type: 'yükleme',
    amount: 3500,
    description: 'Havale ile yükleme',
    date: '2024-01-08T11:00:00Z',
    status: 'pending',
    paymentMethod: 'havale',
    balance: 1000,
  },
  {
    id: 'txn-033',
    userId: 'cust-003',
    type: 'harcama',
    amount: -1400,
    description: 'Randevu ödemesi - Ece',
    date: '2024-01-07T16:00:00Z',
    status: 'completed',
    paymentMethod: 'cüzdan',
    balance: 5200,
    relatedAppointmentId: 'appt-012',
  },
  {
    id: 'txn-034',
    userId: 'esc-001',
    type: 'harcama',
    amount: 1190,
    description: 'Randevu geliri (komisyon sonrası)',
    date: '2024-01-07T16:00:00Z',
    status: 'completed',
    paymentMethod: 'cüzdan',
    balance: 11335,
    relatedAppointmentId: 'appt-012',
  },
  {
    id: 'txn-035',
    userId: 'cust-004',
    type: 'iade',
    amount: 700,
    description: 'İptal edilen randevu iadesi',
    date: '2024-01-06T10:00:00Z',
    status: 'completed',
    paymentMethod: 'cüzdan',
    balance: 2500,
    relatedAppointmentId: 'appt-013',
  },
  {
    id: 'txn-036',
    userId: 'cust-005',
    type: 'yükleme',
    amount: 6000,
    description: 'Kredi kartı ile yükleme',
    date: '2024-01-05T14:00:00Z',
    status: 'completed',
    paymentMethod: 'kredi_kartı',
    balance: 6700,
  },
  {
    id: 'txn-037',
    userId: 'esc-002',
    type: 'harcama',
    amount: 2380,
    description: 'Randevu geliri (komisyon sonrası)',
    date: '2024-01-04T20:30:00Z',
    status: 'completed',
    paymentMethod: 'cüzdan',
    balance: 26450,
    relatedAppointmentId: 'appt-014',
  },
  {
    id: 'txn-038',
    userId: 'esc-002',
    type: 'komisyon',
    amount: -420,
    description: 'Platform komisyonu (%15)',
    date: '2024-01-04T20:30:00Z',
    status: 'completed',
    paymentMethod: 'cüzdan',
    balance: 26030,
    relatedAppointmentId: 'appt-014',
  },
  {
    id: 'txn-039',
    userId: 'cust-001',
    type: 'harcama',
    amount: -1100,
    description: 'Randevu ödemesi - Aylin',
    date: '2024-01-03T18:00:00Z',
    status: 'failed',
    paymentMethod: 'kredi_kartı',
    balance: 2400,
  },
  {
    id: 'txn-040',
    userId: 'cust-002',
    type: 'yükleme',
    amount: 2000,
    description: 'Cüzdan yükleme',
    date: '2024-01-02T12:00:00Z',
    status: 'completed',
    paymentMethod: 'kredi_kartı',
    balance: 2000,
  },
];

/**
 * Kullanıcı ID'sine göre işlemleri getir
 */
export const getTransactionsByUserId = (userId: string): Transaction[] => {
  return mockTransactions.filter(t => t.userId === userId);
};

/**
 * İşlem türüne göre filtrele
 */
export const getTransactionsByType = (userId: string, type: TransactionType): Transaction[] => {
  return mockTransactions.filter(t => t.userId === userId && t.type === type);
};

/**
 * İşlem durumuna göre filtrele
 */
export const getTransactionsByStatus = (userId: string, status: TransactionStatus): Transaction[] => {
  return mockTransactions.filter(t => t.userId === userId && t.status === status);
};

/**
 * Tarih aralığına göre işlemleri getir
 */
export const getTransactionsByDateRange = (
  userId: string,
  startDate: string,
  endDate: string
): Transaction[] => {
  return mockTransactions.filter(
    t => t.userId === userId && t.date >= startDate && t.date <= endDate
  );
};

/**
 * Toplam bakiye hesapla
 */
export const calculateTotalBalance = (userId: string): number => {
  const userTransactions = getTransactionsByUserId(userId);
  if (userTransactions.length === 0) return 0;
  return userTransactions[userTransactions.length - 1].balance;
};
