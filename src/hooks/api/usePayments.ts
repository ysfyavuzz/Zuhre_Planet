/**
 * Payments React Query Hooks
 * 
 * @module hooks/api/usePayments
 * @category Hooks
 * 
 * Ödeme işlemleri için React Query hook'ları.
 * VIP paket satın alma, ödeme yönetimi ve işlem geçmişi gibi işlemleri yönetir.
 * 
 * @example
 * ```typescript
 * const { data: packages } = useVipPackages();
 * const { mutate: purchaseVip } = usePurchaseVip();
 * ```
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import {
  paymentsService,
  Payment,
  Transaction,
  VipPackage,
  PaymentMethod,
} from '@/services/api/payments';

/**
 * Query keys
 */
export const paymentsKeys = {
  all: ['payments'] as const,
  vipPackages: () => [...paymentsKeys.all, 'vip-packages'] as const,
  transactions: (page?: number, limit?: number) =>
    [...paymentsKeys.all, 'transactions', { page, limit }] as const,
  payment: (id: string) => [...paymentsKeys.all, 'payment', id] as const,
  paymentMethods: () => [...paymentsKeys.all, 'payment-methods'] as const,
};

/**
 * VIP paketlerini getirir
 * 
 * @param options - Query options
 * @returns Query result
 */
export function useVipPackages(
  options?: Omit<UseQueryOptions<VipPackage[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: paymentsKeys.vipPackages(),
    queryFn: () => paymentsService.getVipPackages(),
    ...options,
  });
}

/**
 * İşlem geçmişini getirir
 * 
 * @param page - Sayfa numarası
 * @param limit - Sayfa başına kayıt sayısı
 * @param options - Query options
 * @returns Query result
 */
export function useTransactions(
  page: number = 1,
  limit: number = 20,
  options?: Omit<
    UseQueryOptions<{ transactions: Transaction[]; total: number }, Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: paymentsKeys.transactions(page, limit),
    queryFn: () => paymentsService.getTransactions(page, limit),
    ...options,
  });
}

/**
 * Belirli bir ödemenin detaylarını getirir
 * 
 * @param id - Ödeme ID
 * @param options - Query options
 * @returns Query result
 */
export function usePayment(
  id: string,
  options?: Omit<UseQueryOptions<Payment, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: paymentsKeys.payment(id),
    queryFn: () => paymentsService.getPayment(id),
    enabled: !!id,
    ...options,
  });
}

/**
 * Kayıtlı ödeme yöntemlerini getirir
 * 
 * @param options - Query options
 * @returns Query result
 */
export function usePaymentMethods(
  options?: Omit<
    UseQueryOptions<
      { id: string; type: PaymentMethod; last4: string; expiryMonth: number; expiryYear: number }[],
      Error
    >,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: paymentsKeys.paymentMethods(),
    queryFn: () => paymentsService.getPaymentMethods(),
    ...options,
  });
}

/**
 * Ödeme intent'i oluşturur
 * 
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useCreatePaymentIntent(
  options?: UseMutationOptions<
    { clientSecret: string; paymentId: string },
    Error,
    { amount: number; currency?: string; description?: string }
  >
) {
  return useMutation({
    mutationFn: ({ amount, currency, description }) =>
      paymentsService.createPaymentIntent(amount, currency, description),
    ...options,
  });
}

/**
 * Ödemeyi onaylar
 * 
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useConfirmPayment(
  options?: UseMutationOptions<Payment, Error, { paymentId: string; paymentMethodId: string }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ paymentId, paymentMethodId }) =>
      paymentsService.confirmPayment(paymentId, paymentMethodId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: paymentsKeys.transactions() });
      queryClient.invalidateQueries({ queryKey: paymentsKeys.payment(variables.paymentId) });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

/**
 * VIP paketi satın alır
 * 
 * @param options - Mutation options
 * @returns Mutation result
 */
export function usePurchaseVip(
  options?: UseMutationOptions<
    { payment: Payment; vipExpiresAt: string },
    Error,
    { packageId: string; paymentMethodId: string }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ packageId, paymentMethodId }) =>
      paymentsService.purchaseVip(packageId, paymentMethodId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: paymentsKeys.transactions() });
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

/**
 * İade talebi oluşturur
 * 
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useRequestRefund(
  options?: UseMutationOptions<Transaction, Error, { paymentId: string; reason: string }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ paymentId, reason }) => paymentsService.requestRefund(paymentId, reason),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: paymentsKeys.transactions() });
      queryClient.invalidateQueries({ queryKey: paymentsKeys.payment(variables.paymentId) });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

/**
 * Ödeme yöntemi ekler
 * 
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useAddPaymentMethod(
  options?: UseMutationOptions<
    { id: string; type: PaymentMethod; last4: string },
    Error,
    string
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentMethodId: string) => paymentsService.addPaymentMethod(paymentMethodId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: paymentsKeys.paymentMethods() });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

/**
 * Ödeme yöntemini siler
 * 
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useDeletePaymentMethod(options?: UseMutationOptions<void, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => paymentsService.deletePaymentMethod(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: paymentsKeys.paymentMethods() });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}
