/**
 * useChat Hook
 *
 * WebSocket-based real-time messaging hook.
 * Manages chat state, WebSocket connection, and message operations.
 *
 * @module hooks/useChat
 * @category Hooks
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Message,
  Conversation,
  MessageState,
  MessageAction,
  OnlineStatus,
  WSMessage,
  TypingUser,
  MessageAttachment,
  ChatError,
} from '@/types/message';

interface UseChatOptions {
  wsUrl?: string;
  autoReconnect?: boolean;
  reconnectInterval?: number;
  enablePresence?: boolean;
  onMessageReceived?: (message: Message) => void;
  onConversationUpdated?: (conversation: Conversation) => void;
  onError?: (error: ChatError) => void;
}

interface UseChatReturn {
  // State
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  presences: Record<string, OnlineStatus>;
  typingUsers: Record<string, TypingUser[]>;

  // Actions
  setActiveConversation: (conversationId: string | null) => void;
  sendMessage: (conversationId: string, content: string, type?: string, attachments?: MessageAttachment[]) => Promise<void>;
  editMessage: (messageId: string, content: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  reactToMessage: (messageId: string, emoji: string) => Promise<void>;
  markAsRead: (conversationId: string, messageId: string) => Promise<void>;
  loadMoreMessages: (conversationId: string) => Promise<void>;
  pinConversation: (conversationId: string) => Promise<void>;
  unpinConversation: (conversationId: string) => Promise<void>;
  archiveConversation: (conversationId: string) => Promise<void>;
  muteConversation: (conversationId: string, duration?: number) => Promise<void>;
  unmuteConversation: (conversationId: string) => Promise<void>;
  blockUser: (userId: string) => Promise<void>;
  unblockUser: (userId: string) => Promise<void>;

  // Typing
  startTyping: (conversationId: string) => void;
  stopTyping: (conversationId: string) => void;

  // Connection
  connect: () => void;
  disconnect: () => void;
}

// Simulated data store (replace with actual API)
const mockConversations: Conversation[] = [
  {
    id: '1',
    participantId: 'escort-1',
    participantName: 'Ayşe Yılmaz',
    participantAvatar: undefined,
    participantType: 'escort',
    unreadCount: 3,
    isPinned: true,
    isArchived: false,
    isMuted: false,
    onlineStatus: 'online',
    typingUsers: [],
    createdAt: new Date(),
  },
  {
    id: '2',
    participantId: 'escort-2',
    participantName: 'Zeynep Demir',
    participantAvatar: undefined,
    participantType: 'escort',
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
    isMuted: false,
    onlineStatus: 'offline',
    typingUsers: [],
    createdAt: new Date(),
  },
];

const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      conversationId: '1',
      senderId: 'escort-1',
      senderName: 'Ayşe Yılmaz',
      content: 'Merhaba! Hoş geldiniz 💖',
      type: 'text',
      status: 'read',
      timestamp: new Date(Date.now() - 3600000),
      reactions: [],
    },
    {
      id: 'm2',
      conversationId: '1',
      senderId: 'me',
      senderName: 'Ben',
      content: 'Merhaba, nasılsınız?',
      type: 'text',
      status: 'read',
      timestamp: new Date(Date.now() - 3000000),
      reactions: [],
    },
  ],
};

export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const {
    wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:3001'}/ws/chat`,
    autoReconnect = true,
    reconnectInterval = 3000,
    enablePresence = true,
    onMessageReceived,
    onConversationUpdated,
    onError,
  } = options;

  // State
  const [state, setState] = useState<MessageState>({
    conversations: mockConversations,
    activeConversationId: null,
    messages: mockMessages,
    drafts: {},
    presences: {},
    isLoading: false,
    error: null,
    typingUsers: {},
  });

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number>();
  const typingTimeoutRef = useRef<Record<string, number>>({});

  // WebSocket connect
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setIsConnecting(true);

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const wsMessage: WSMessage = JSON.parse(event.data);
          handleWSMessage(wsMessage);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setIsConnecting(false);
        onError?.({
          type: 'CONNECTION_FAILED',
          message: 'Bağlantı hatası',
          retryable: true,
        });
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsConnecting(false);
        wsRef.current = null;

        if (autoReconnect) {
          reconnectTimeoutRef.current = window.setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };
    } catch (error) {
      setIsConnecting(false);
      onError?.({
        type: 'CONNECTION_FAILED',
        message: 'Bağlantı kurulamadı',
        retryable: true,
      });
    }
  }, [wsUrl, autoReconnect, reconnectInterval, onError]);

  // WebSocket disconnect
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    wsRef.current?.close();
    wsRef.current = null;
    setIsConnected(false);
  }, []);

  // Handle WebSocket message
  const handleWSMessage = useCallback((wsMessage: WSMessage) => {
    switch (wsMessage.type) {
      case 'message:new':
        const newMessage = wsMessage.payload as Message;
        setState(prev => ({
          ...prev,
          messages: {
            ...prev.messages,
            [newMessage.conversationId]: [
              ...(prev.messages[newMessage.conversationId] || []),
              newMessage,
            ],
          },
        }));
        onMessageReceived?.(newMessage);
        break;

      case 'message:read':
      case 'message:delivered':
        const updatedMessage = wsMessage.payload as Message;
        setState(prev => ({
          ...prev,
          messages: {
            ...prev.messages,
            [updatedMessage.conversationId]: prev.messages[updatedMessage.conversationId]?.map(m =>
              m.id === updatedMessage.id ? updatedMessage : m
            ) || [],
          },
        }));
        break;

      case 'conversation:typing':
        const { conversationId, user } = wsMessage.payload;
        setState(prev => {
          const typingUsers = [...(prev.typingUsers[conversationId] || []).filter(
            u => u.userId !== user.userId
          ), { ...user, timestamp: new Date() }];
          return {
            ...prev,
            typingUsers: { ...prev.typingUsers, [conversationId]: typingUsers },
          };
        });
        break;

      case 'presence:update':
        const presence = wsMessage.payload;
        setState(prev => ({
          ...prev,
          presences: { ...prev.presences, [presence.userId]: presence.status },
          conversations: prev.conversations.map(c =>
            c.participantId === presence.userId
              ? { ...c, onlineStatus: presence.status }
              : c
          ),
        }));
        break;

      default:
        console.log('Unhandled WebSocket message type:', wsMessage.type);
    }
  }, [onMessageReceived]);

  // Send WebSocket message
  const sendWSMessage = useCallback((message: WSMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected');
    }
  }, []);

  // Set active conversation
  const setActiveConversation = useCallback((conversationId: string | null) => {
    setState(prev => ({ ...prev, activeConversationId: conversationId }));

    // Mark messages as read when switching conversation
    if (conversationId) {
      const lastMessage = state.messages[conversationId]?.[0];
      if (lastMessage) {
        markAsRead(conversationId, lastMessage.id);
      }
    }
  }, [state.messages]);

  // Send message
  const sendMessage = useCallback(async (
    conversationId: string,
    content: string,
    type = 'text',
    attachments?: MessageAttachment[]
  ) => {
    const tempId = `temp-${Date.now()}`;
    const tempMessage: Message = {
      id: tempId,
      conversationId,
      senderId: 'me',
      senderName: 'Ben',
      content,
      type: type as any,
      status: 'sending',
      timestamp: new Date(),
      reactions: [],
    };

    // Add temp message
    setState(prev => ({
      ...prev,
      messages: {
        ...prev.messages,
        [conversationId]: [
          tempMessage,
          ...(prev.messages[conversationId] || []),
        ],
      },
    }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const realMessage: Message = {
        ...tempMessage,
        id: `msg-${Date.now()}`,
        status: 'sent',
      };

      // Replace temp message with real message
      setState(prev => ({
        ...prev,
        messages: {
          ...prev.messages,
          [conversationId]: prev.messages[conversationId]?.map(m =>
            m.id === tempId ? realMessage : m
          ) || [realMessage],
        },
      }));

      // Update conversation
      const updatedConversation = state.conversations.find(c => c.id === conversationId);
      if (updatedConversation) {
        const newConv = {
          ...updatedConversation,
          lastMessage: realMessage,
          lastMessageAt: new Date(),
        };
        setState(prev => ({
          ...prev,
          conversations: prev.conversations.map(c =>
            c.id === conversationId ? newConv : c
          ),
        }));
        onConversationUpdated?.(newConv);
      }

      // Send via WebSocket
      sendWSMessage({
        type: 'message:new',
        payload: realMessage,
        timestamp: new Date(),
      });
    } catch (error) {
      // Handle error
      setState(prev => ({
        ...prev,
        messages: {
          ...prev.messages,
          [conversationId]: prev.messages[conversationId]?.map(m =>
            m.id === tempId ? { ...m, status: 'failed' } : m
          ) || [],
        },
      }));
      onError?.({
        type: 'SEND_FAILED',
        message: 'Mesaj gönderilemedi',
        retryable: true,
      });
    }
  }, [sendWSMessage, state.conversations, onConversationUpdated, onError]);

  // Edit message
  const editMessage = useCallback(async (messageId: string, content: string) => {
    // Find message
    let foundConversationId: string | null = null;
    let foundMessage: Message | null = null;

    for (const [convId, messages] of Object.entries(state.messages)) {
      const msg = messages.find(m => m.id === messageId);
      if (msg) {
        foundConversationId = convId;
        foundMessage = msg;
        break;
      }
    }

    if (!foundMessage || !foundConversationId) return;

    setState(prev => ({
      ...prev,
      messages: {
        ...prev.messages,
        [foundConversationId!]: prev.messages[foundConversationId!]?.map(m =>
          m.id === messageId
            ? { ...m, content, isEdited: true, editedAt: new Date() }
            : m
        ) || [],
      },
    }));
  }, [state.messages]);

  // Delete message
  const deleteMessage = useCallback(async (messageId: string) => {
    setState(prev => {
      const newMessages = { ...prev.messages };
      for (const convId in newMessages) {
        newMessages[convId] = newMessages[convId]?.filter(m => m.id !== messageId) || [];
      }
      return { ...prev, messages: newMessages };
    });
  }, []);

  // React to message
  const reactToMessage = useCallback(async (messageId: string, emoji: string) => {
    // Find and update message
    setState(prev => {
      const newMessages = { ...prev.messages };
      for (const convId in newMessages) {
        newMessages[convId] = newMessages[convId]?.map(m => {
          if (m.id === messageId) {
            const existingReaction = m.reactions?.find(r => r.userId === 'me');
            if (existingReaction) {
              // Remove reaction
              return {
                ...m,
                reactions: m.reactions?.filter(r => r.userId !== 'me') || [],
              };
            } else {
              // Add reaction
              return {
                ...m,
                reactions: [
                  ...(m.reactions || []),
                  {
                    emoji,
                    userId: 'me',
                    userName: 'Ben',
                    timestamp: new Date(),
                  },
                ],
              };
            }
          }
          return m;
        }) || [];
      }
      return { ...prev, messages: newMessages };
    });
  }, []);

  // Mark as read
  const markAsRead = useCallback(async (conversationId: string, messageId: string) => {
    setState(prev => ({
      ...prev,
      messages: {
        ...prev.messages,
        [conversationId]: prev.messages[conversationId]?.map(m =>
          m.id === messageId || (m.status !== 'read' && new Date(m.timestamp) < new Date())
            ? { ...m, status: 'read' }
            : m
        ) || [],
      },
      conversations: prev.conversations.map(c =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
      ),
    }));

    sendWSMessage({
      type: 'message:read',
      payload: { conversationId, messageId },
      timestamp: new Date(),
    });
  }, [sendWSMessage]);

  // Load more messages
  const loadMoreMessages = useCallback(async (conversationId: string) => {
    // Simulate loading more messages
    console.log('Loading more messages for:', conversationId);
  }, []);

  // Pin conversation
  const pinConversation = useCallback(async (conversationId: string) => {
    setState(prev => ({
      ...prev,
      conversations: prev.conversations.map(c =>
        c.id === conversationId ? { ...c, isPinned: true } : c
      ),
    }));
  }, []);

  // Unpin conversation
  const unpinConversation = useCallback(async (conversationId: string) => {
    setState(prev => ({
      ...prev,
      conversations: prev.conversations.map(c =>
        c.id === conversationId ? { ...c, isPinned: false } : c
      ),
    }));
  }, []);

  // Archive conversation
  const archiveConversation = useCallback(async (conversationId: string) => {
    setState(prev => ({
      ...prev,
      conversations: prev.conversations.map(c =>
        c.id === conversationId ? { ...c, isArchived: true } : c
      ),
    }));
  }, []);

  // Mute conversation
  const muteConversation = useCallback(async (conversationId: string, duration?: number) => {
    setState(prev => ({
      ...prev,
      conversations: prev.conversations.map(c =>
        c.id === conversationId
          ? {
              ...c,
              isMuted: true,
              mutedUntil: duration ? new Date(Date.now() + duration * 60 * 60 * 1000) : undefined,
            }
          : c
      ),
    }));
  }, []);

  // Unmute conversation
  const unmuteConversation = useCallback(async (conversationId: string) => {
    setState(prev => ({
      ...prev,
      conversations: prev.conversations.map(c =>
        c.id === conversationId
          ? { ...c, isMuted: false, mutedUntil: undefined }
          : c
      ),
    }));
  }, []);

  // Block user
  const blockUser = useCallback(async (userId: string) => {
    console.log('Blocking user:', userId);
  }, []);

  // Unblock user
  const unblockUser = useCallback(async (userId: string) => {
    console.log('Unblocking user:', userId);
  }, []);

  // Start typing
  const startTyping = useCallback((conversationId: string) => {
    // Clear existing timeout
    if (typingTimeoutRef.current[conversationId]) {
      clearTimeout(typingTimeoutRef.current[conversationId]);
    }

    // Send typing start
    sendWSMessage({
      type: 'conversation:typing',
      payload: { conversationId, typing: true },
      timestamp: new Date(),
    });

    // Auto-stop typing after timeout
    typingTimeoutRef.current[conversationId] = window.setTimeout(() => {
      stopTyping(conversationId);
    }, 3000) as unknown as number;
  }, [sendWSMessage]);

  // Stop typing
  const stopTyping = useCallback((conversationId: string) => {
    if (typingTimeoutRef.current[conversationId]) {
      clearTimeout(typingTimeoutRef.current[conversationId]);
    }

    sendWSMessage({
      type: 'conversation:typing',
      payload: { conversationId, typing: false },
      timestamp: new Date(),
    });
  }, [sendWSMessage]);

  // Auto-connect on mount
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    // State
    conversations: state.conversations,
    activeConversationId: state.activeConversationId,
    messages: state.messages,
    isConnected,
    isConnecting,
    error: state.error,
    presences: state.presences as unknown as Record<string, OnlineStatus>,
    typingUsers: state.typingUsers || {},

    // Actions
    setActiveConversation,
    sendMessage,
    editMessage,
    deleteMessage,
    reactToMessage,
    markAsRead,
    loadMoreMessages,
    pinConversation,
    unpinConversation,
    archiveConversation,
    muteConversation,
    unmuteConversation,
    blockUser,
    unblockUser,

    // Typing
    startTyping,
    stopTyping,

    // Connection
    connect,
    disconnect,
  };
}
