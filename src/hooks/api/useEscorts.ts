/**
 * Escorts React Query Hooks
 * 
 * @module hooks/api/useEscorts
 * @category Hooks
 * 
 * Escort listeleme ve yönetimi için React Query hook'ları.
 * Filtreleme, arama, favoriler ve raporlama işlemlerini yönetir.
 * 
 * @example
 * ```typescript
 * const { data: escorts } = useEscorts({ city: 'Istanbul' });
 * const { mutate: addFavorite } = useAddToFavorites();
 * ```
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import {
  escortsService,
  Escort,
  EscortFilters,
  PaginationParams,
  PaginatedResponse,
} from '@/services/api/escorts';

/**
 * Query keys
 */
export const escortsKeys = {
  all: ['escorts'] as const,
  lists: () => [...escortsKeys.all, 'list'] as const,
  list: (filters?: EscortFilters, pagination?: PaginationParams) =>
    [...escortsKeys.lists(), { filters, pagination }] as const,
  details: () => [...escortsKeys.all, 'detail'] as const,
  detail: (id: string) => [...escortsKeys.details(), id] as const,
  featured: () => [...escortsKeys.all, 'featured'] as const,
  vip: () => [...escortsKeys.all, 'vip'] as const,
  favorites: () => [...escortsKeys.all, 'favorites'] as const,
  search: (query: string, pagination?: PaginationParams) =>
    [...escortsKeys.all, 'search', query, pagination] as const,
  byCity: (city: string, pagination?: PaginationParams) =>
    [...escortsKeys.all, 'city', city, pagination] as const,
  similar: (id: string) => [...escortsKeys.all, 'similar', id] as const,
};

/**
 * Tüm escort listesini filtreler ve sayfalama ile getirir
 * 
 * @param filters - Filtre kriterleri
 * @param pagination - Sayfalama parametreleri
 * @param options - Query options
 * @returns Query result
 */
export function useEscorts(
  filters?: EscortFilters,
  pagination?: PaginationParams,
  options?: Omit<UseQueryOptions<PaginatedResponse<Escort>, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: escortsKeys.list(filters, pagination),
    queryFn: () => escortsService.getAll(filters, pagination),
    ...options,
  });
}

/**
 * Belirli bir escort'un detaylarını getirir
 * 
 * @param id - Escort ID
 * @param options - Query options
 * @returns Query result
 */
export function useEscort(
  id: string,
  options?: Omit<UseQueryOptions<Escort, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: escortsKeys.detail(id),
    queryFn: () => escortsService.getById(id),
    enabled: !!id,
    ...options,
  });
}

/**
 * Öne çıkan escort listesini getirir
 * 
 * @param limit - Getir limit
 * @param options - Query options
 * @returns Query result
 */
export function useFeaturedEscorts(
  limit: number = 10,
  options?: Omit<UseQueryOptions<Escort[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: escortsKeys.featured(),
    queryFn: () => escortsService.getFeatured(limit),
    ...options,
  });
}

/**
 * VIP escort listesini getirir
 * 
 * @param limit - Getir limit
 * @param options - Query options
 * @returns Query result
 */
export function useVipEscorts(
  limit: number = 10,
  options?: Omit<UseQueryOptions<Escort[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: escortsKeys.vip(),
    queryFn: () => escortsService.getVip(limit),
    ...options,
  });
}

/**
 * Escort araması yapar
 * 
 * @param query - Arama sorgusu
 * @param pagination - Sayfalama parametreleri
 * @param options - Query options
 * @returns Query result
 */
export function useSearchEscorts(
  query: string,
  pagination?: PaginationParams,
  options?: Omit<UseQueryOptions<PaginatedResponse<Escort>, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: escortsKeys.search(query, pagination),
    queryFn: () => escortsService.search(query, pagination),
    enabled: !!query && query.length > 0,
    ...options,
  });
}

/**
 * Şehre göre escort listesi getirir
 * 
 * @param city - Şehir adı
 * @param pagination - Sayfalama parametreleri
 * @param options - Query options
 * @returns Query result
 */
export function useEscortsByCity(
  city: string,
  pagination?: PaginationParams,
  options?: Omit<UseQueryOptions<PaginatedResponse<Escort>, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: escortsKeys.byCity(city, pagination),
    queryFn: () => escortsService.getByCity(city, pagination),
    enabled: !!city,
    ...options,
  });
}

/**
 * Favori escort listesini getirir
 * 
 * @param pagination - Sayfalama parametreleri
 * @param options - Query options
 * @returns Query result
 */
export function useFavoriteEscorts(
  pagination?: PaginationParams,
  options?: Omit<UseQueryOptions<PaginatedResponse<Escort>, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: escortsKeys.favorites(),
    queryFn: () => escortsService.getFavorites(pagination),
    ...options,
  });
}

/**
 * Benzer escort listesini getirir
 * 
 * @param id - Escort ID
 * @param limit - Getir limit
 * @param options - Query options
 * @returns Query result
 */
export function useSimilarEscorts(
  id: string,
  limit: number = 6,
  options?: Omit<UseQueryOptions<Escort[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: escortsKeys.similar(id),
    queryFn: () => escortsService.getSimilar(id, limit),
    enabled: !!id,
    ...options,
  });
}

/**
 * Favorilere escort ekler
 * 
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useAddToFavorites(options?: UseMutationOptions<void, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => escortsService.addToFavorites(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: escortsKeys.favorites() });
      queryClient.invalidateQueries({ queryKey: escortsKeys.detail(variables) });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

/**
 * Favorilerden escort kaldırır
 * 
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useRemoveFromFavorites(options?: UseMutationOptions<void, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => escortsService.removeFromFavorites(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: escortsKeys.favorites() });
      queryClient.invalidateQueries({ queryKey: escortsKeys.detail(variables) });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

/**
 * Escort profilini raporlar
 * 
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useReportEscort(
  options?: UseMutationOptions<void, Error, { id: string; reason: string; description: string }>
) {
  return useMutation({
    mutationFn: ({ id, reason, description }) => escortsService.report(id, reason, description),
    ...options,
  });
}
