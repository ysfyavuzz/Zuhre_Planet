/**
 * E2E Test Fixtures
 * 
 * Test data for E2E tests including user credentials,
 * escort profiles, and other mock data.
 */

/**
 * Test user credentials
 */
export const TEST_USERS = {
  client: {
    email: 'test.client@example.com',
    password: 'TestPassword123!',
    name: 'Test Müşteri',
  },
  escort: {
    email: 'test.escort@example.com',
    password: 'TestPassword123!',
    name: 'Test Escort',
  },
  admin: {
    email: 'test.admin@example.com',
    password: 'AdminPassword123!',
    name: 'Test Admin',
  },
};

/**
 * Test escort data
 */
export const TEST_ESCORTS = [
  {
    id: '1',
    name: 'Ayşe',
    age: 25,
    city: 'İstanbul',
    district: 'Beşiktaş',
    price: 1500,
    services: ['Masaj', 'Terapi'],
  },
  {
    id: '2',
    name: 'Elif',
    age: 28,
    city: 'Ankara',
    district: 'Çankaya',
    price: 2000,
    services: ['VIP Hizmet', 'Eşlik'],
  },
  {
    id: '3',
    name: 'Zeynep',
    age: 23,
    city: 'İzmir',
    district: 'Alsancak',
    price: 1200,
    services: ['Masaj', 'Eğlence'],
  },
];

/**
 * Test cities
 */
export const TEST_CITIES = [
  'İstanbul',
  'Ankara',
  'İzmir',
  'Antalya',
  'Bursa',
];

/**
 * Test services
 */
export const TEST_SERVICES = [
  'Masaj',
  'Terapi',
  'VIP Hizmet',
  'Eşlik',
  'Eğlence',
];

/**
 * Test messages
 */
export const TEST_MESSAGES = [
  {
    id: '1',
    content: 'Merhaba, nasılsınız?',
    sender: 'client',
  },
  {
    id: '2',
    content: 'İyiyim, teşekkür ederim.',
    sender: 'escort',
  },
];

/**
 * Test appointment data
 */
export const TEST_APPOINTMENT = {
  date: '2024-02-15',
  time: '14:00',
  duration: 2,
  location: 'İstanbul, Beşiktaş',
  notes: 'Test randevu notları',
};

/**
 * Test payment data
 */
export const TEST_PAYMENT = {
  cardNumber: '4242424242424242',
  expiry: '12/25',
  cvv: '123',
  name: 'Test Kullanıcı',
};

/**
 * Test VIP package
 */
export const TEST_VIP_PACKAGE = {
  id: '1',
  name: 'VIP Paket - 30 Gün',
  price: 299,
  duration: 30,
};
