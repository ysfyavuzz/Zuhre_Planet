/**
 * API Services
 * 
 * @module services/api
 * @category API Services
 * 
 * Central export for all API services.
 * 
 * @example
 * ```typescript
 * import { authService, escortsService } from '@/services/api';
 * 
 * const user = await authService.login(email, password);
 * const escorts = await escortsService.getAll();
 * ```
 */

export * from './client';
export * from './auth';
export * from './escorts';
export * from './messages';
export * from './appointments';
export * from './payments';

export { default as authService } from './auth';
export { default as escortsService } from './escorts';
export { default as messagesService } from './messages';
export { default as appointmentsService } from './appointments';
export { default as paymentsService } from './payments';
