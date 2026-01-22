/**
 * Authentication React Query Hooks
 * 
 * @module hooks/api/useAuth
 * @category Hooks
 * 
 * Kimlik doğrulama işlemleri için React Query hook'ları.
 * Login, register, logout ve profil yönetimi işlemlerini yönetir.
 * 
 * @example
 * ```typescript
 * const { mutate: login } = useLogin();
 * login({ email: 'user@example.com', password: 'password' });
 * ```
 */

import { useMutation, useQuery, useQueryClient, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { authService, LoginRequest, RegisterRequest, User } from '@/services/api/auth';

/**
 * Query keys
 */
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};

/**
 * Mevcut kullanıcı bilgilerini getirir
 * 
 * @param options - Query options
 * @returns Query result
 */
export function useMe(options?: Omit<UseQueryOptions<User, Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: () => authService.me(),
    ...options,
  });
}

/**
 * Kullanıcı girişi yapar
 * 
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useLogin(
  options?: UseMutationOptions<Awaited<ReturnType<typeof authService.login>>, Error, LoginRequest>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data.email, data.password),
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.me(), data.user);
      // Query cache updated
    },
    ...options,
  });
}

/**
 * Yeni kullanıcı kaydı yapar
 * 
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useRegister(
  options?: UseMutationOptions<Awaited<ReturnType<typeof authService.register>>, Error, RegisterRequest>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(authKeys.me(), data.user);
      // Query cache updated
    },
    ...options,
  });
}

/**
 * Kullanıcı çıkışı yapar
 * 
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useLogout(options?: UseMutationOptions<void, Error>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: (data, variables, context) => {
      queryClient.removeQueries({ queryKey: authKeys.all });
      queryClient.clear();
      // Query cache updated
    },
    ...options,
  });
}

/**
 * Şifre sıfırlama isteği gönderir
 * 
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useForgotPassword(options?: UseMutationOptions<void, Error, string>) {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    ...options,
  });
}

/**
 * Şifreyi sıfırlar
 * 
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useResetPassword(
  options?: UseMutationOptions<void, Error, { token: string; password: string }>
) {
  return useMutation({
    mutationFn: ({ token, password }) => authService.resetPassword(token, password),
    ...options,
  });
}

/**
 * Kullanıcı profilini günceller
 * 
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useUpdateProfile(options?: UseMutationOptions<User, Error, Partial<User>>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<User>) => authService.updateProfile(data),
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(authKeys.me(), data);
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
      // Query cache updated
    },
    ...options,
  });
}

/**
 * Kullanıcı şifresini değiştirir
 * 
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useChangePassword(
  options?: UseMutationOptions<void, Error, { currentPassword: string; newPassword: string }>
) {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }) =>
      authService.changePassword(currentPassword, newPassword),
    ...options,
  });
}

/**
 * Email doğrulama kodu gönderir
 * 
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useVerifyEmail(options?: UseMutationOptions<void, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
      // Query cache updated
    },
    ...options,
  });
}

/**
 * Email doğrulama kodunu yeniden gönderir
 * 
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useResendVerification(options?: UseMutationOptions<void, Error>) {
  return useMutation({
    mutationFn: () => authService.resendVerification(),
    ...options,
  });
}
