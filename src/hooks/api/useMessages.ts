/**
 * Messages React Query Hooks
 * 
 * @module hooks/api/useMessages
 * @category Hooks
 * 
 * Mesajlaşma işlemleri için React Query hook'ları.
 * Konuşmalar, mesaj gönderme ve okundu işaretleme gibi işlemleri yönetir.
 * 
 * @example
 * ```typescript
 * const { data: conversations } = useConversations();
 * const { mutate: sendMessage } = useSendMessage();
 * ```
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { messagesService, Conversation, Message, SendMessageRequest } from '@/services/api/messages';

/**
 * Query keys
 */
export const messagesKeys = {
  all: ['messages'] as const,
  conversations: () => [...messagesKeys.all, 'conversations'] as const,
  conversation: (id: string) => [...messagesKeys.all, 'conversation', id] as const,
  unreadCount: () => [...messagesKeys.all, 'unread-count'] as const,
  blockedUsers: () => [...messagesKeys.all, 'blocked-users'] as const,
};

/**
 * Tüm konuşmaları getirir
 * 
 * @param options - Query options
 * @returns Query result
 */
export function useConversations(
  options?: Omit<UseQueryOptions<Conversation[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: messagesKeys.conversations(),
    queryFn: () => messagesService.getConversations(),
    ...options,
  });
}

/**
 * Belirli bir konuşmadaki mesajları getirir
 * 
 * @param conversationId - Konuşma ID
 * @param page - Sayfa numarası
 * @param limit - Sayfa başına mesaj sayısı
 * @param options - Query options
 * @returns Query result
 */
export function useMessages(
  conversationId: string,
  page: number = 1,
  limit: number = 50,
  options?: Omit<
    UseQueryOptions<{ messages: Message[]; total: number }, Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: messagesKeys.conversation(conversationId),
    queryFn: () => messagesService.getMessages(conversationId, page, limit),
    enabled: !!conversationId,
    ...options,
  });
}

/**
 * Okunmamış mesaj sayısını getirir
 * 
 * @param options - Query options
 * @returns Query result
 */
export function useUnreadCount(options?: Omit<UseQueryOptions<number, Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: messagesKeys.unreadCount(),
    queryFn: () => messagesService.getUnreadCount(),
    refetchInterval: 30000, // 30 saniyede bir yenile
    ...options,
  });
}

/**
 * Engellenmiş kullanıcı listesini getirir
 * 
 * @param options - Query options
 * @returns Query result
 */
export function useBlockedUsers(options?: Omit<UseQueryOptions<string[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: messagesKeys.blockedUsers(),
    queryFn: () => messagesService.getBlockedUsers(),
    ...options,
  });
}

/**
 * Mesaj gönderir
 * 
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useSendMessage(
  options?: UseMutationOptions<Message, Error, SendMessageRequest>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendMessageRequest) => messagesService.sendMessage(data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: messagesKeys.conversations() });
      if (variables.conversationId) {
        queryClient.invalidateQueries({
          queryKey: messagesKeys.conversation(variables.conversationId),
        });
      }
    },
    ...options,
  });
}

/**
 * Mesajı okundu olarak işaretler
 * 
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useMarkAsRead(options?: UseMutationOptions<void, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => messagesService.markAsRead(messageId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: messagesKeys.conversations() });
      queryClient.invalidateQueries({ queryKey: messagesKeys.unreadCount() });
    },
    ...options,
  });
}

/**
 * Konuşmadaki tüm mesajları okundu olarak işaretler
 * 
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useMarkConversationAsRead(options?: UseMutationOptions<void, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => messagesService.markConversationAsRead(conversationId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: messagesKeys.conversations() });
      queryClient.invalidateQueries({ queryKey: messagesKeys.conversation(variables) });
      queryClient.invalidateQueries({ queryKey: messagesKeys.unreadCount() });
    },
    ...options,
  });
}

/**
 * Mesaj siler
 * 
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useDeleteMessage(options?: UseMutationOptions<void, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => messagesService.deleteMessage(messageId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: messagesKeys.conversations() });
    },
    ...options,
  });
}

/**
 * Konuşma siler
 * 
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useDeleteConversation(options?: UseMutationOptions<void, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => messagesService.deleteConversation(conversationId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: messagesKeys.conversations() });
      queryClient.removeQueries({ queryKey: messagesKeys.conversation(variables) });
    },
    ...options,
  });
}

/**
 * Kullanıcıyı engeller
 * 
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useBlockUser(options?: UseMutationOptions<void, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => messagesService.blockUser(userId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: messagesKeys.blockedUsers() });
      queryClient.invalidateQueries({ queryKey: messagesKeys.conversations() });
    },
    ...options,
  });
}

/**
 * Kullanıcının engelini kaldırır
 * 
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useUnblockUser(options?: UseMutationOptions<void, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => messagesService.unblockUser(userId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: messagesKeys.blockedUsers() });
    },
    ...options,
  });
}
