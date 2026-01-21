/**
 * Mock Kazanç Verileri
 * 
 * Escort kazançları için örnek veriler.
 * Günlük, haftalık, aylık kazançlar ve randevu detayları içerir.
 * 
 * @module data/mockData/earnings
 * @category MockData
 */

/**
 * Günlük kazanç interface
 */
export interface DailyEarning {
  date: string;
  amount: number;
  appointments: number;
  commission: number;
  netEarning: number;
}

/**
 * Haftalık kazanç interface
 */
export interface WeeklyEarning {
  weekStart: string;
  weekEnd: string;
  weekNumber: number;
  amount: number;
  appointments: number;
  commission: number;
  netEarning: number;
}

/**
 * Aylık kazanç interface
 */
export interface MonthlyEarning {
  month: string;
  year: number;
  amount: number;
  appointments: number;
  commission: number;
  netEarning: number;
  avgPerAppointment: number;
}

/**
 * Randevu kazanç detayı
 */
export interface AppointmentEarning {
  appointmentId: string;
  customerId: string;
  customerName: string;
  date: string;
  service: string;
  duration: number;
  grossAmount: number;
  commission: number;
  netAmount: number;
  paymentMethod: string;
  status: 'paid' | 'pending' | 'cancelled';
}

/**
 * Komisyon detayı
 */
export interface CommissionDetail {
  date: string;
  appointmentId: string;
  grossAmount: number;
  commissionRate: number;
  commissionAmount: number;
  netAmount: number;
}

/**
 * Ödeme geçmişi
 */
export interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  method: 'bank_transfer' | 'wallet' | 'cash';
  status: 'completed' | 'pending' | 'failed';
  reference: string;
}

/**
 * Kazanç istatistikleri
 */
export interface EarningStats {
  totalEarned: number;
  totalCommission: number;
  totalNet: number;
  totalAppointments: number;
  avgPerAppointment: number;
  bestMonth: {
    month: string;
    amount: number;
  };
  currentMonthEarning: number;
  lastMonthEarning: number;
  growthRate: number;
}

/**
 * Ana kazanç verileri interface
 */
export interface EarningsData {
  escortId: string;
  dailyEarnings: DailyEarning[];
  weeklyEarnings: WeeklyEarning[];
  monthlyEarnings: MonthlyEarning[];
  appointmentEarnings: AppointmentEarning[];
  commissionDetails: CommissionDetail[];
  paymentHistory: PaymentHistory[];
  stats: EarningStats;
}

/**
 * Mock kazanç verileri
 */
export const mockEarningsData: Record<string, EarningsData> = {
  'esc-001': {
    escortId: 'esc-001',
    dailyEarnings: [
      { date: '2024-01-20', amount: 4500, appointments: 3, commission: 675, netEarning: 3825 },
      { date: '2024-01-19', amount: 3000, appointments: 2, commission: 450, netEarning: 2550 },
      { date: '2024-01-18', amount: 6000, appointments: 4, commission: 900, netEarning: 5100 },
      { date: '2024-01-17', amount: 3500, appointments: 2, commission: 525, netEarning: 2975 },
      { date: '2024-01-16', amount: 4500, appointments: 3, commission: 675, netEarning: 3825 },
      { date: '2024-01-15', amount: 5000, appointments: 3, commission: 750, netEarning: 4250 },
      { date: '2024-01-14', amount: 0, appointments: 0, commission: 0, netEarning: 0 },
      { date: '2024-01-13', amount: 7000, appointments: 5, commission: 1050, netEarning: 5950 },
      { date: '2024-01-12', amount: 4500, appointments: 3, commission: 675, netEarning: 3825 },
      { date: '2024-01-11', amount: 3000, appointments: 2, commission: 450, netEarning: 2550 },
      { date: '2024-01-10', amount: 4000, appointments: 2, commission: 600, netEarning: 3400 },
      { date: '2024-01-09', amount: 5500, appointments: 4, commission: 825, netEarning: 4675 },
      { date: '2024-01-08', amount: 3500, appointments: 2, commission: 525, netEarning: 2975 },
      { date: '2024-01-07', amount: 0, appointments: 0, commission: 0, netEarning: 0 },
      { date: '2024-01-06', amount: 6000, appointments: 4, commission: 900, netEarning: 5100 },
      { date: '2024-01-05', amount: 4500, appointments: 3, commission: 675, netEarning: 3825 },
      { date: '2024-01-04', amount: 3000, appointments: 2, commission: 450, netEarning: 2550 },
      { date: '2024-01-03', amount: 5000, appointments: 3, commission: 750, netEarning: 4250 },
      { date: '2024-01-02', amount: 4000, appointments: 3, commission: 600, netEarning: 3400 },
      { date: '2024-01-01', amount: 0, appointments: 0, commission: 0, netEarning: 0 },
      { date: '2023-12-31', amount: 8000, appointments: 5, commission: 1200, netEarning: 6800 },
      { date: '2023-12-30', amount: 6500, appointments: 4, commission: 975, netEarning: 5525 },
      { date: '2023-12-29', amount: 5000, appointments: 3, commission: 750, netEarning: 4250 },
      { date: '2023-12-28', amount: 4500, appointments: 3, commission: 675, netEarning: 3825 },
      { date: '2023-12-27', amount: 5500, appointments: 4, commission: 825, netEarning: 4675 },
      { date: '2023-12-26', amount: 3000, appointments: 2, commission: 450, netEarning: 2550 },
      { date: '2023-12-25', amount: 0, appointments: 0, commission: 0, netEarning: 0 },
      { date: '2023-12-24', amount: 7000, appointments: 5, commission: 1050, netEarning: 5950 },
      { date: '2023-12-23', amount: 6000, appointments: 4, commission: 900, netEarning: 5100 },
      { date: '2023-12-22', amount: 4500, appointments: 3, commission: 675, netEarning: 3825 },
    ],
    weeklyEarnings: [
      { weekStart: '2024-01-15', weekEnd: '2024-01-21', weekNumber: 3, amount: 28500, appointments: 17, commission: 4275, netEarning: 24225 },
      { weekStart: '2024-01-08', weekEnd: '2024-01-14', weekNumber: 2, amount: 24500, appointments: 15, commission: 3675, netEarning: 20825 },
      { weekStart: '2024-01-01', weekEnd: '2024-01-07', weekNumber: 1, amount: 22500, appointments: 14, commission: 3375, netEarning: 19125 },
      { weekStart: '2023-12-25', weekEnd: '2023-12-31', weekNumber: 52, amount: 34000, appointments: 21, commission: 5100, netEarning: 28900 },
      { weekStart: '2023-12-18', weekEnd: '2023-12-24', weekNumber: 51, amount: 31000, appointments: 19, commission: 4650, netEarning: 26350 },
      { weekStart: '2023-12-11', weekEnd: '2023-12-17', weekNumber: 50, amount: 28500, appointments: 18, commission: 4275, netEarning: 24225 },
      { weekStart: '2023-12-04', weekEnd: '2023-12-10', weekNumber: 49, amount: 26000, appointments: 16, commission: 3900, netEarning: 22100 },
      { weekStart: '2023-11-27', weekEnd: '2023-12-03', weekNumber: 48, amount: 24500, appointments: 15, commission: 3675, netEarning: 20825 },
      { weekStart: '2023-11-20', weekEnd: '2023-11-26', weekNumber: 47, amount: 27500, appointments: 17, commission: 4125, netEarning: 23375 },
      { weekStart: '2023-11-13', weekEnd: '2023-11-19', weekNumber: 46, amount: 25500, appointments: 16, commission: 3825, netEarning: 21675 },
      { weekStart: '2023-11-06', weekEnd: '2023-11-12', weekNumber: 45, amount: 23000, appointments: 14, commission: 3450, netEarning: 19550 },
      { weekStart: '2023-10-30', weekEnd: '2023-11-05', weekNumber: 44, amount: 22000, appointments: 13, commission: 3300, netEarning: 18700 },
    ],
    monthlyEarnings: [
      { month: 'Ocak', year: 2024, amount: 75500, appointments: 46, commission: 11325, netEarning: 64175, avgPerAppointment: 1641 },
      { month: 'Aralık', year: 2023, amount: 119500, appointments: 74, commission: 17925, netEarning: 101575, avgPerAppointment: 1615 },
      { month: 'Kasım', year: 2023, amount: 100500, appointments: 62, commission: 15075, netEarning: 85425, avgPerAppointment: 1621 },
      { month: 'Ekim', year: 2023, amount: 95000, appointments: 59, commission: 14250, netEarning: 80750, avgPerAppointment: 1610 },
      { month: 'Eylül', year: 2023, amount: 88000, appointments: 55, commission: 13200, netEarning: 74800, avgPerAppointment: 1600 },
      { month: 'Ağustos', year: 2023, amount: 112000, appointments: 70, commission: 16800, netEarning: 95200, avgPerAppointment: 1600 },
      { month: 'Temmuz', year: 2023, amount: 105000, appointments: 65, commission: 15750, netEarning: 89250, avgPerAppointment: 1615 },
      { month: 'Haziran', year: 2023, amount: 98000, appointments: 61, commission: 14700, netEarning: 83300, avgPerAppointment: 1607 },
      { month: 'Mayıs', year: 2023, amount: 92000, appointments: 57, commission: 13800, netEarning: 78200, avgPerAppointment: 1614 },
      { month: 'Nisan', year: 2023, amount: 85000, appointments: 53, commission: 12750, netEarning: 72250, avgPerAppointment: 1604 },
      { month: 'Mart', year: 2023, amount: 79000, appointments: 49, commission: 11850, netEarning: 67150, avgPerAppointment: 1612 },
      { month: 'Şubat', year: 2023, amount: 72000, appointments: 45, commission: 10800, netEarning: 61200, avgPerAppointment: 1600 },
    ],
    appointmentEarnings: [
      { appointmentId: 'appt-001', customerId: 'cust-001', customerName: 'Mehmet Y.', date: '2024-01-20', service: 'VIP Escort', duration: 2, grossAmount: 1500, commission: 225, netAmount: 1275, paymentMethod: 'Cüzdan', status: 'paid' },
      { appointmentId: 'appt-002', customerId: 'cust-002', customerName: 'Ali K.', date: '2024-01-20', service: 'Klasik Escort', duration: 1, grossAmount: 1500, commission: 225, netAmount: 1275, paymentMethod: 'Kredi Kartı', status: 'paid' },
      { appointmentId: 'appt-003', customerId: 'cust-003', customerName: 'Can M.', date: '2024-01-20', service: 'Couples Massage', duration: 3, grossAmount: 1500, commission: 225, netAmount: 1275, paymentMethod: 'Cüzdan', status: 'paid' },
      { appointmentId: 'appt-004', customerId: 'cust-004', customerName: 'Emre S.', date: '2024-01-19', service: 'VIP Escort', duration: 2, grossAmount: 1500, commission: 225, netAmount: 1275, paymentMethod: 'Havale', status: 'paid' },
      { appointmentId: 'appt-005', customerId: 'cust-005', customerName: 'Burak T.', date: '2024-01-19', service: 'Klasik Escort', duration: 1, grossAmount: 1500, commission: 225, netAmount: 1275, paymentMethod: 'Cüzdan', status: 'paid' },
      { appointmentId: 'appt-006', customerId: 'cust-001', customerName: 'Mehmet Y.', date: '2024-01-18', service: 'Tantric', duration: 2, grossAmount: 1500, commission: 225, netAmount: 1275, paymentMethod: 'Cüzdan', status: 'paid' },
      { appointmentId: 'appt-007', customerId: 'cust-002', customerName: 'Ali K.', date: '2024-01-18', service: 'VIP Escort', duration: 2, grossAmount: 1500, commission: 225, netAmount: 1275, paymentMethod: 'Kredi Kartı', status: 'paid' },
      { appointmentId: 'appt-008', customerId: 'cust-003', customerName: 'Can M.', date: '2024-01-18', service: 'Aromatherapy', duration: 1, grossAmount: 1500, commission: 225, netAmount: 1275, paymentMethod: 'Cüzdan', status: 'paid' },
      { appointmentId: 'appt-009', customerId: 'cust-004', customerName: 'Emre S.', date: '2024-01-18', service: 'Klasik Escort', duration: 1, grossAmount: 1500, commission: 225, netAmount: 1275, paymentMethod: 'Havale', status: 'paid' },
      { appointmentId: 'appt-010', customerId: 'cust-005', customerName: 'Burak T.', date: '2024-01-17', service: 'VIP Escort', duration: 2, grossAmount: 1750, commission: 262.5, netAmount: 1487.5, paymentMethod: 'Cüzdan', status: 'pending' },
    ],
    commissionDetails: [
      { date: '2024-01-20', appointmentId: 'appt-001', grossAmount: 1500, commissionRate: 15, commissionAmount: 225, netAmount: 1275 },
      { date: '2024-01-20', appointmentId: 'appt-002', grossAmount: 1500, commissionRate: 15, commissionAmount: 225, netAmount: 1275 },
      { date: '2024-01-20', appointmentId: 'appt-003', grossAmount: 1500, commissionRate: 15, commissionAmount: 225, netAmount: 1275 },
      { date: '2024-01-19', appointmentId: 'appt-004', grossAmount: 1500, commissionRate: 15, commissionAmount: 225, netAmount: 1275 },
      { date: '2024-01-19', appointmentId: 'appt-005', grossAmount: 1500, commissionRate: 15, commissionAmount: 225, netAmount: 1275 },
      { date: '2024-01-18', appointmentId: 'appt-006', grossAmount: 1500, commissionRate: 15, commissionAmount: 225, netAmount: 1275 },
      { date: '2024-01-18', appointmentId: 'appt-007', grossAmount: 1500, commissionRate: 15, commissionAmount: 225, netAmount: 1275 },
      { date: '2024-01-18', appointmentId: 'appt-008', grossAmount: 1500, commissionRate: 15, commissionAmount: 225, netAmount: 1275 },
      { date: '2024-01-18', appointmentId: 'appt-009', grossAmount: 1500, commissionRate: 15, commissionAmount: 225, netAmount: 1275 },
      { date: '2024-01-17', appointmentId: 'appt-010', grossAmount: 1750, commissionRate: 15, commissionAmount: 262.5, netAmount: 1487.5 },
    ],
    paymentHistory: [
      { id: 'pay-001', date: '2024-01-15', amount: 22100, method: 'bank_transfer', status: 'completed', reference: 'BT-20240115-001' },
      { id: 'pay-002', date: '2024-01-08', amount: 19550, method: 'bank_transfer', status: 'completed', reference: 'BT-20240108-001' },
      { id: 'pay-003', date: '2024-01-01', amount: 18700, method: 'bank_transfer', status: 'completed', reference: 'BT-20240101-001' },
      { id: 'pay-004', date: '2023-12-25', amount: 28900, method: 'bank_transfer', status: 'completed', reference: 'BT-20231225-001' },
      { id: 'pay-005', date: '2023-12-18', amount: 26350, method: 'bank_transfer', status: 'completed', reference: 'BT-20231218-001' },
    ],
    stats: {
      totalEarned: 1049500,
      totalCommission: 157425,
      totalNet: 892075,
      totalAppointments: 655,
      avgPerAppointment: 1602,
      bestMonth: {
        month: 'Aralık 2023',
        amount: 119500,
      },
      currentMonthEarning: 75500,
      lastMonthEarning: 119500,
      growthRate: -36.8,
    },
  },
};

/**
 * Escort ID'sine göre kazanç verilerini getir
 */
export const getEarningsByEscortId = (escortId: string): EarningsData | undefined => {
  return mockEarningsData[escortId];
};

/**
 * Günlük kazançları getir
 */
export const getDailyEarnings = (escortId: string): DailyEarning[] => {
  return mockEarningsData[escortId]?.dailyEarnings || [];
};

/**
 * Haftalık kazançları getir
 */
export const getWeeklyEarnings = (escortId: string): WeeklyEarning[] => {
  return mockEarningsData[escortId]?.weeklyEarnings || [];
};

/**
 * Aylık kazançları getir
 */
export const getMonthlyEarnings = (escortId: string): MonthlyEarning[] => {
  return mockEarningsData[escortId]?.monthlyEarnings || [];
};

/**
 * Randevu kazançlarını getir
 */
export const getAppointmentEarnings = (escortId: string): AppointmentEarning[] => {
  return mockEarningsData[escortId]?.appointmentEarnings || [];
};

/**
 * Komisyon detaylarını getir
 */
export const getCommissionDetails = (escortId: string): CommissionDetail[] => {
  return mockEarningsData[escortId]?.commissionDetails || [];
};

/**
 * Ödeme geçmişini getir
 */
export const getPaymentHistory = (escortId: string): PaymentHistory[] => {
  return mockEarningsData[escortId]?.paymentHistory || [];
};

/**
 * Kazanç istatistiklerini getir
 */
export const getEarningStats = (escortId: string): EarningStats | undefined => {
  return mockEarningsData[escortId]?.stats;
};
