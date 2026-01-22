/**
 * Appointments React Query Hooks
 * 
 * @module hooks/api/useAppointments
 * @category Hooks
 * 
 * Randevu yönetimi için React Query hook'ları.
 * Randevu oluşturma, onaylama, iptal etme ve listeleme işlemlerini yönetir.
 * 
 * @example
 * ```typescript
 * const { data: appointments } = useMyAppointments();
 * const { mutate: createAppointment } = useCreateAppointment();
 * ```
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import {
  appointmentsService,
  Appointment,
  AppointmentStatus,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
} from '@/services/api/appointments';

/**
 * Query keys
 */
export const appointmentsKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentsKeys.all, 'list'] as const,
  list: (status?: AppointmentStatus) => [...appointmentsKeys.lists(), { status }] as const,
  details: () => [...appointmentsKeys.all, 'detail'] as const,
  detail: (id: string) => [...appointmentsKeys.details(), id] as const,
  upcoming: () => [...appointmentsKeys.all, 'upcoming'] as const,
  past: () => [...appointmentsKeys.all, 'past'] as const,
  availability: (escortId: string, date: string) =>
    [...appointmentsKeys.all, 'availability', escortId, date] as const,
};

/**
 * Kullanıcının randevularını getirir
 * 
 * @param status - Filtre için durum
 * @param options - Query options
 * @returns Query result
 */
export function useMyAppointments(
  status?: AppointmentStatus,
  options?: Omit<UseQueryOptions<Appointment[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: appointmentsKeys.list(status),
    queryFn: () => appointmentsService.getMyAppointments(status),
    ...options,
  });
}

/**
 * Belirli bir randevunun detaylarını getirir
 * 
 * @param id - Randevu ID
 * @param options - Query options
 * @returns Query result
 */
export function useAppointment(
  id: string,
  options?: Omit<UseQueryOptions<Appointment, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: appointmentsKeys.detail(id),
    queryFn: () => appointmentsService.getById(id),
    enabled: !!id,
    ...options,
  });
}

/**
 * Yaklaşan randevuları getirir
 * 
 * @param options - Query options
 * @returns Query result
 */
export function useUpcomingAppointments(
  options?: Omit<UseQueryOptions<Appointment[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: appointmentsKeys.upcoming(),
    queryFn: () => appointmentsService.getUpcoming(),
    ...options,
  });
}

/**
 * Geçmiş randevuları getirir
 * 
 * @param options - Query options
 * @returns Query result
 */
export function usePastAppointments(
  options?: Omit<UseQueryOptions<Appointment[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: appointmentsKeys.past(),
    queryFn: () => appointmentsService.getPast(),
    ...options,
  });
}

/**
 * Escort'un müsaitlik durumunu kontrol eder
 * 
 * @param escortId - Escort ID
 * @param date - Tarih
 * @param options - Query options
 * @returns Query result
 */
export function useCheckAvailability(
  escortId: string,
  date: string,
  options?: Omit<
    UseQueryOptions<{ time: string; available: boolean }[], Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: appointmentsKeys.availability(escortId, date),
    queryFn: () => appointmentsService.checkAvailability(escortId, date),
    enabled: !!escortId && !!date,
    ...options,
  });
}

/**
 * Yeni randevu oluşturur
 * 
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useCreateAppointment(
  options?: UseMutationOptions<Appointment, Error, CreateAppointmentRequest>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAppointmentRequest) => appointmentsService.create(data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: appointmentsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentsKeys.upcoming() });
      queryClient.invalidateQueries({
        queryKey: appointmentsKeys.availability(variables.escortId, variables.date),
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

/**
 * Randevuyu günceller
 * 
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useUpdateAppointment(
  options?: UseMutationOptions<Appointment, Error, { id: string; data: UpdateAppointmentRequest }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => appointmentsService.update(id, data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: appointmentsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentsKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: appointmentsKeys.upcoming() });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

/**
 * Randevuyu onaylar
 * 
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useConfirmAppointment(options?: UseMutationOptions<Appointment, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => appointmentsService.confirm(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: appointmentsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentsKeys.detail(variables) });
      queryClient.invalidateQueries({ queryKey: appointmentsKeys.upcoming() });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

/**
 * Randevuyu iptal eder
 * 
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useCancelAppointment(
  options?: UseMutationOptions<Appointment, Error, { id: string; reason?: string }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }) => appointmentsService.cancel(id, reason),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: appointmentsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentsKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: appointmentsKeys.upcoming() });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

/**
 * Randevuyu tamamlar
 * 
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useCompleteAppointment(options?: UseMutationOptions<Appointment, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => appointmentsService.complete(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: appointmentsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentsKeys.detail(variables) });
      queryClient.invalidateQueries({ queryKey: appointmentsKeys.upcoming() });
      queryClient.invalidateQueries({ queryKey: appointmentsKeys.past() });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

/**
 * Randevuyu siler
 * 
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useDeleteAppointment(options?: UseMutationOptions<void, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => appointmentsService.delete(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: appointmentsKeys.lists() });
      queryClient.removeQueries({ queryKey: appointmentsKeys.detail(variables) });
      queryClient.invalidateQueries({ queryKey: appointmentsKeys.upcoming() });
      queryClient.invalidateQueries({ queryKey: appointmentsKeys.past() });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}
