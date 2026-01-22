/**
 * Messages API Service
 * 
 * @module services/api/messages
 * @category API Services
 * 
 * Handles all messaging-related API calls:
 * - Conversations management
 * - Sending and receiving messages
 * - Message status updates
 * 
 * @example
 * ```typescript
 * import { messagesService } from './messages';
 * 
 * const conversations = await messagesService.getConversations();
 * ```
 */

import { apiClient } from './client';

/**
 * Message types
 */
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  attachments?: string[];
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Message request types
 */
export interface SendMessageRequest {
  conversationId?: string;
  receiverId: string;
  content: string;
  type?: 'text' | 'image' | 'file';
  attachments?: string[];
}

/**
 * Messages Service
 */
export const messagesService = {
  /**
   * Get all conversations for current user
   * 
   * @returns List of conversations
   */
  async getConversations(): Promise<Conversation[]> {
    const response = await apiClient.get<Conversation[]>('/messages/conversations');
    return response.data;
  },

  /**
   * Get messages in a conversation
   * 
   * @param conversationId - Conversation ID
   * @param page - Page number for pagination
   * @param limit - Messages per page
   * @returns List of messages
   */
  async getMessages(
    conversationId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<{ messages: Message[]; total: number }> {
    const response = await apiClient.get<{ messages: Message[]; total: number }>(
      `/messages/conversations/${conversationId}`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  /**
   * Send a message
   * 
   * @param data - Message data
   * @returns Created message
   */
  async sendMessage(data: SendMessageRequest): Promise<Message> {
    const response = await apiClient.post<Message>('/messages', data);
    return response.data;
  },

  /**
   * Mark message as read
   * 
   * @param messageId - Message ID
   */
  async markAsRead(messageId: string): Promise<void> {
    await apiClient.patch(`/messages/${messageId}/read`);
  },

  /**
   * Mark all messages in a conversation as read
   * 
   * @param conversationId - Conversation ID
   */
  async markConversationAsRead(conversationId: string): Promise<void> {
    await apiClient.patch(`/messages/conversations/${conversationId}/read`);
  },

  /**
   * Delete a message
   * 
   * @param messageId - Message ID
   */
  async deleteMessage(messageId: string): Promise<void> {
    await apiClient.delete(`/messages/${messageId}`);
  },

  /**
   * Delete a conversation
   * 
   * @param conversationId - Conversation ID
   */
  async deleteConversation(conversationId: string): Promise<void> {
    await apiClient.delete(`/messages/conversations/${conversationId}`);
  },

  /**
   * Get unread message count
   * 
   * @returns Unread message count
   */
  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<{ count: number }>('/messages/unread-count');
    return response.data.count;
  },

  /**
   * Block a user
   * 
   * @param userId - User ID to block
   */
  async blockUser(userId: string): Promise<void> {
    await apiClient.post(`/messages/block/${userId}`);
  },

  /**
   * Unblock a user
   * 
   * @param userId - User ID to unblock
   */
  async unblockUser(userId: string): Promise<void> {
    await apiClient.delete(`/messages/block/${userId}`);
  },

  /**
   * Get blocked users
   * 
   * @returns List of blocked user IDs
   */
  async getBlockedUsers(): Promise<string[]> {
    const response = await apiClient.get<{ blockedUsers: string[] }>('/messages/blocked');
    return response.data.blockedUsers;
  },
};

export default messagesService;
