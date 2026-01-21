/**
 * Mock Data Index
 * 
 * Central export point for all mock data modules.
 * Provides easy access to customers, escorts, conversations, appointments, and reviews.
 * 
 * @module data/mockData
 * @category MockData
 * 
 * @example
 * ```typescript
 * import { mockCustomers, mockEscorts, mockReviews } from '@/data/mockData';
 * 
 * // Get all customers
 * const customers = mockCustomers;
 * 
 * // Get specific escort
 * const escort = getEscortById('esc-001');
 * 
 * // Get reviews for escort
 * const reviews = getEscortReviews('esc-001');
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
