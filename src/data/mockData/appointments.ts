/**
 * Mock Appointments Data
 * 
 * Example appointments between customers and escorts in different states.
 * Used for development and testing booking and calendar features.
 * 
 * @module data/mockData/appointments
 * @category MockData
 */

export type AppointmentStatus = 
  | 'pending' // Waiting for escort confirmation
  | 'confirmed' // Confirmed by escort
  | 'completed' // Service completed
  | 'cancelled' // Cancelled by customer or escort
  | 'no-show'; // Customer didn't show up

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  escortId: string;
  escortName: string;
  serviceType: string;
  date: string;
  time: string;
  duration: number; // in hours
  price: number;
  status: AppointmentStatus;
  location: {
    type: 'incall' | 'outcall';
    address?: string;
    city: string;
    district: string;
  };
  notes?: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod?: 'credit_card' | 'cash' | 'wallet';
  createdAt: string;
  updatedAt: string;
  cancelledBy?: 'customer' | 'escort';
  cancellationReason?: string;
  reviewId?: string; // Link to review if completed
}

export const mockAppointments: Appointment[] = [
  {
    id: 'apt-001',
    customerId: 'cust-001',
    customerName: 'Ahmet Kaya',
    escortId: 'esc-001',
    escortName: 'Ayşe',
    serviceType: 'Klasik Masaj',
    date: '2024-03-22',
    time: '18:00',
    duration: 1,
    price: 1500,
    status: 'confirmed',
    location: {
      type: 'incall',
      city: 'İstanbul',
      district: 'Beşiktaş',
    },
    notes: 'Lütfen zamanında gelin.',
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    createdAt: '2024-03-21T17:30:00Z',
    updatedAt: '2024-03-21T17:35:00Z',
  },
  {
    id: 'apt-002',
    customerId: 'cust-002',
    customerName: 'Mehmet Yılmaz',
    escortId: 'esc-002',
    escortName: 'Zeynep',
    serviceType: 'Çift Masajı',
    date: '2024-03-23',
    time: '20:00',
    duration: 2,
    price: 4000,
    status: 'confirmed',
    location: {
      type: 'incall',
      city: 'Ankara',
      district: 'Çankaya',
    },
    notes: 'Eşimle birlikte geleceğiz.',
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    createdAt: '2024-03-21T19:45:00Z',
    updatedAt: '2024-03-21T19:50:00Z',
  },
  {
    id: 'apt-003',
    customerId: 'cust-003',
    customerName: 'Can Demir',
    escortId: 'esc-004',
    escortName: 'Selin',
    serviceType: 'VIP Hizmet',
    date: '2024-03-21',
    time: '21:00',
    duration: 3,
    price: 5400,
    status: 'completed',
    location: {
      type: 'outcall',
      address: 'Rixos Premium Belek',
      city: 'Antalya',
      district: 'Belek',
    },
    paymentStatus: 'paid',
    paymentMethod: 'wallet',
    createdAt: '2024-03-21T15:00:00Z',
    updatedAt: '2024-03-22T00:30:00Z',
    reviewId: 'rev-001',
  },
  {
    id: 'apt-004',
    customerId: 'cust-001',
    customerName: 'Ahmet Kaya',
    escortId: 'esc-003',
    escortName: 'Elif',
    serviceType: 'Klasik Masaj',
    date: '2024-03-20',
    time: '16:00',
    duration: 1,
    price: 1200,
    status: 'cancelled',
    location: {
      type: 'incall',
      city: 'İzmir',
      district: 'Konak',
    },
    paymentStatus: 'refunded',
    paymentMethod: 'credit_card',
    createdAt: '2024-03-20T15:00:00Z',
    updatedAt: '2024-03-20T16:00:00Z',
    cancelledBy: 'escort',
    cancellationReason: 'Bugün müsait değilim.',
  },
  {
    id: 'apt-005',
    customerId: 'cust-005',
    customerName: 'Emre Çelik',
    escortId: 'esc-009',
    escortName: 'Ceren',
    serviceType: 'Ultra VIP Yat Hizmeti',
    date: '2024-03-24',
    time: '16:00',
    duration: 4,
    price: 10000,
    status: 'confirmed',
    location: {
      type: 'outcall',
      address: 'Palmarina Bodrum',
      city: 'Bodrum',
      district: 'Merkez',
    },
    notes: 'Yat: Princess V78. Özel istekler mesajda.',
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    createdAt: '2024-03-21T20:00:00Z',
    updatedAt: '2024-03-21T20:05:00Z',
  },
  {
    id: 'apt-006',
    customerId: 'cust-004',
    customerName: 'Burak Özkan',
    escortId: 'esc-006',
    escortName: 'Melis',
    serviceType: 'Rahatlama Masajı',
    date: '2024-03-25',
    time: '14:00',
    duration: 1,
    price: 1300,
    status: 'pending',
    location: {
      type: 'incall',
      city: 'İstanbul',
      district: 'Kadıköy',
    },
    paymentStatus: 'pending',
    createdAt: '2024-03-21T12:00:00Z',
    updatedAt: '2024-03-21T12:00:00Z',
  },
  {
    id: 'apt-007',
    customerId: 'cust-002',
    customerName: 'Mehmet Yılmaz',
    escortId: 'esc-008',
    escortName: 'Ece',
    serviceType: 'Tantra Masajı',
    date: '2024-03-19',
    time: '19:00',
    duration: 2,
    price: 3400,
    status: 'completed',
    location: {
      type: 'incall',
      city: 'Ankara',
      district: 'Kızılay',
    },
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    createdAt: '2024-03-19T10:00:00Z',
    updatedAt: '2024-03-19T21:30:00Z',
    reviewId: 'rev-002',
  },
  {
    id: 'apt-008',
    customerId: 'cust-003',
    customerName: 'Can Demir',
    escortId: 'esc-001',
    escortName: 'Ayşe',
    serviceType: 'VIP Hizmet',
    date: '2024-03-18',
    time: '20:00',
    duration: 2,
    price: 3000,
    status: 'completed',
    location: {
      type: 'incall',
      city: 'İstanbul',
      district: 'Beşiktaş',
    },
    paymentStatus: 'paid',
    paymentMethod: 'wallet',
    createdAt: '2024-03-18T14:00:00Z',
    updatedAt: '2024-03-18T22:30:00Z',
    reviewId: 'rev-003',
  },
  {
    id: 'apt-009',
    customerId: 'cust-001',
    customerName: 'Ahmet Kaya',
    escortId: 'esc-007',
    escortName: 'Nazlı',
    serviceType: 'Aromaterapi Masajı',
    date: '2024-03-17',
    time: '15:00',
    duration: 1.5,
    price: 2100,
    status: 'completed',
    location: {
      type: 'incall',
      city: 'İzmir',
      district: 'Bornova',
    },
    paymentStatus: 'paid',
    paymentMethod: 'cash',
    createdAt: '2024-03-17T10:00:00Z',
    updatedAt: '2024-03-17T17:00:00Z',
    reviewId: 'rev-004',
  },
  {
    id: 'apt-010',
    customerId: 'cust-004',
    customerName: 'Burak Özkan',
    escortId: 'esc-004',
    escortName: 'Selin',
    serviceType: 'Klasik Masaj',
    date: '2024-03-15',
    time: '13:00',
    duration: 1,
    price: 1800,
    status: 'no-show',
    location: {
      type: 'incall',
      city: 'Antalya',
      district: 'Muratpaşa',
    },
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    createdAt: '2024-03-14T16:00:00Z',
    updatedAt: '2024-03-15T14:00:00Z',
    notes: 'Müşteri gelmedi.',
  },
];

/**
 * Get appointment by ID
 */
export function getAppointmentById(id: string): Appointment | undefined {
  return mockAppointments.find(a => a.id === id);
}

/**
 * Get appointments for customer
 */
export function getCustomerAppointments(customerId: string): Appointment[] {
  return mockAppointments.filter(a => a.customerId === customerId);
}

/**
 * Get appointments for escort
 */
export function getEscortAppointments(escortId: string): Appointment[] {
  return mockAppointments.filter(a => a.escortId === escortId);
}

/**
 * Get appointments by status
 */
export function getAppointmentsByStatus(status: AppointmentStatus): Appointment[] {
  return mockAppointments.filter(a => a.status === status);
}

/**
 * Get upcoming appointments
 */
export function getUpcomingAppointments(userId: string, userType: 'customer' | 'escort'): Appointment[] {
  const appointments = userType === 'customer'
    ? getCustomerAppointments(userId)
    : getEscortAppointments(userId);
  
  const now = new Date();
  return appointments.filter(a => {
    const appointmentDate = new Date(a.date);
    return appointmentDate >= now && (a.status === 'pending' || a.status === 'confirmed');
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Get past appointments
 */
export function getPastAppointments(userId: string, userType: 'customer' | 'escort'): Appointment[] {
  const appointments = userType === 'customer'
    ? getCustomerAppointments(userId)
    : getEscortAppointments(userId);
  
  const now = new Date();
  return appointments.filter(a => {
    const appointmentDate = new Date(a.date);
    return appointmentDate < now || a.status === 'completed';
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
