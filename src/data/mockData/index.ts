/**
 * Mock Data Index
 * 
 * Central export point for all mock data modules.
 * Provides easy access to customers, escorts, conversations, appointments, reviews,
 * notifications, transactions, and earnings data.
 * 
 * @module data/mockData
 * @category MockData
 * 
 * @example
 * ```typescript
 * import { mockCustomers, mockEscorts, mockReviews, mockNotifications } from '@/data/mockData';
 * 
 * // Get all customers
 * const customers = mockCustomers;
 * 
 * // Get specific escort
 * const escort = getEscortById('esc-001');
 * 
 * // Get reviews for escort
 * const reviews = getEscortReviews('esc-001');
 * 
 * // Get notifications for user
 * const notifications = getNotificationsByUserId('cust-001');
 * ```
 */

// Customers
export * from './customers';

// Escorts
export * from './escorts';

// Conversations
export * from './conversations';

// Appointments
export * from './appointments';

// Reviews
export * from './reviews';

// Notifications
export * from './notifications';

// Transactions
export * from './transactions';

// Earnings
export * from './earnings';
