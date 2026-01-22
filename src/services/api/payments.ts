/**
 * Payments API Service
 * 
 * @module services/api/payments
 * @category API Services
 * 
 * Handles all payment-related API calls:
 * - Creating payment intents
 * - Processing payments
 * - VIP package purchases
 * - Transaction history
 * 
 * @example
 * ```typescript
 * import { paymentsService } from './payments';
 * 
 * const intent = await paymentsService.createPaymentIntent(100);
 * ```
 */

import { apiClient } from './client';

/**
 * Payment types
 */
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'bank_transfer' | 'crypto';

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  paymentId: string;
  type: 'charge' | 'refund' | 'transfer';
  amount: number;
  currency: string;
  status: PaymentStatus;
  description: string;
  createdAt: string;
}

export interface VipPackage {
  id: string;
  name: string;
  duration: number; // in days
  price: number;
  features: string[];
  popular?: boolean;
}

/**
 * Payment request types
 */
export interface CreatePaymentIntentRequest {
  amount: number;
  currency?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface ConfirmPaymentRequest {
  paymentId: string;
  paymentMethodId: string;
}

export interface PurchaseVipRequest {
  packageId: string;
  paymentMethodId: string;
}

/**
 * Payments Service
 */
export const paymentsService = {
  /**
   * Create payment intent
   * 
   * @param amount - Payment amount
   * @param currency - Currency code (default: TRY)
   * @param description - Payment description
   * @returns Payment intent details
   */
  async createPaymentIntent(
    amount: number,
    currency: string = 'TRY',
    description?: string
  ): Promise<{ clientSecret: string; paymentId: string }> {
    const response = await apiClient.post<{ clientSecret: string; paymentId: string }>(
      '/payments/intent',
      {
        amount,
        currency,
        description,
      }
    );
    return response.data;
  },

  /**
   * Confirm payment
   * 
   * @param paymentId - Payment ID
   * @param paymentMethodId - Payment method ID
   * @returns Confirmed payment
   */
  async confirmPayment(paymentId: string, paymentMethodId: string): Promise<Payment> {
    const response = await apiClient.post<Payment>('/payments/confirm', {
      paymentId,
      paymentMethodId,
    });
    return response.data;
  },

  /**
   * Get payment by ID
   * 
   * @param id - Payment ID
   * @returns Payment details
   */
  async getPayment(id: string): Promise<Payment> {
    const response = await apiClient.get<Payment>(`/payments/${id}`);
    return response.data;
  },

  /**
   * Get user's transactions
   * 
   * @param page - Page number
   * @param limit - Items per page
   * @returns List of transactions
   */
  async getTransactions(
    page: number = 1,
    limit: number = 20
  ): Promise<{ transactions: Transaction[]; total: number }> {
    const response = await apiClient.get<{ transactions: Transaction[]; total: number }>(
      '/payments/transactions',
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  /**
   * Get VIP packages
   * 
   * @returns List of VIP packages
   */
  async getVipPackages(): Promise<VipPackage[]> {
    const response = await apiClient.get<VipPackage[]>('/payments/vip/packages');
    return response.data;
  },

  /**
   * Purchase VIP package
   * 
   * @param packageId - VIP package ID
   * @param paymentMethodId - Payment method ID
   * @returns Purchase confirmation
   */
  async purchaseVip(
    packageId: string,
    paymentMethodId: string
  ): Promise<{ payment: Payment; vipExpiresAt: string }> {
    const response = await apiClient.post<{ payment: Payment; vipExpiresAt: string }>(
      '/payments/vip/purchase',
      {
        packageId,
        paymentMethodId,
      }
    );
    return response.data;
  },

  /**
   * Request refund
   * 
   * @param paymentId - Payment ID
   * @param reason - Refund reason
   * @returns Refund details
   */
  async requestRefund(paymentId: string, reason: string): Promise<Transaction> {
    const response = await apiClient.post<Transaction>(`/payments/${paymentId}/refund`, {
      reason,
    });
    return response.data;
  },

  /**
   * Get payment methods
   * 
   * @returns List of saved payment methods
   */
  async getPaymentMethods(): Promise<
    { id: string; type: PaymentMethod; last4: string; expiryMonth: number; expiryYear: number }[]
  > {
    const response = await apiClient.get<
      { id: string; type: PaymentMethod; last4: string; expiryMonth: number; expiryYear: number }[]
    >('/payments/methods');
    return response.data;
  },

  /**
   * Add payment method
   * 
   * @param paymentMethodId - Payment method ID from payment provider
   * @returns Added payment method
   */
  async addPaymentMethod(paymentMethodId: string): Promise<{
    id: string;
    type: PaymentMethod;
    last4: string;
  }> {
    const response = await apiClient.post<{ id: string; type: PaymentMethod; last4: string }>(
      '/payments/methods',
      {
        paymentMethodId,
      }
    );
    return response.data;
  },

  /**
   * Delete payment method
   * 
   * @param id - Payment method ID
   */
  async deletePaymentMethod(id: string): Promise<void> {
    await apiClient.delete(`/payments/methods/${id}`);
  },
};

export default paymentsService;
