/**
 * WebSocket Context
 *
 * Real-time messaging infrastructure using WebSocket connections.
 * Provides context for managing WebSocket connections, messages, and chat state.
 *
 * @module contexts/WebSocketContext
 * @category Contexts - State Management
 *
 * Features:
 * - WebSocket connection management
 * - Message sending/receiving
 * - Connection status tracking
 * - Auto-reconnect on disconnect
 * - Message queue for offline mode
 * - Typing indicators
 * - Read receipts
 * - Multiple conversation support
 *
 * Message Types:
 * - text: Plain text messages
 * - image: Image attachments
 * - video: Video attachments
 * - file: File attachments
 * - system: System notifications
 * - typing: Typing indicator
 * - read: Read receipt
 *
 * @example
 * ```tsx
 * // In App root
 * <WebSocketProvider url="wss://api.example.com/ws">
 *   <App />
 * </WebSocketProvider>
 *
 * // In component
 * const { messages, sendMessage, connectionStatus } = useWebSocket();
 *
 * sendMessage({
 *   conversationId: 'conv-123',
 *   type: 'text',
 *   content: 'Hello!',
 * });
 * ```
 */

import { createContext, useContext, useState, useCallback, useEffect, ReactNode, useRef } from 'react';

/**
 * Connection status type
 */
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error';

/**
 * Message type enum
 */
export type MessageType = 'text' | 'image' | 'video' | 'file' | 'system' | 'typing' | 'read';

/**
 * Message interface
 */
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  readAt?: Date;
  deliveredAt?: Date;
  attachments?: MessageAttachment[];
  metadata?: Record<string, any>;
}

/**
 * Message attachment interface
 */
export interface MessageAttachment {
  id: string;
  type: 'image' | 'video' | 'file';
  url: string;
  thumbnailUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
}

/**
 * Conversation interface
 */
export interface Conversation {
  id: string;
  participants: ConversationParticipant[];
  lastMessage?: Message;
  lastMessageAt?: Date;
  unreadCount: number;
  typingUsers: string[];
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

/**
 * Conversation participant interface
 */
export interface ConversationParticipant {
  id: string;
  name: string;
  avatar?: string;
  role: 'escort' | 'customer' | 'admin';
  isOnline?: boolean;
  lastSeen?: Date;
}

/**
 * Typing indicator interface
 */
export interface TypingIndicator {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}

/**
 * WebSocket message interface (server protocol)
 */
export interface WebSocketMessage {
  type: 'message' | 'typing' | 'read' | 'presence' | 'error' | 'ping' | 'pong';
  data: any;
}

/**
 * WebSocket Context Interface
 */
interface WebSocketContextValue {
  // Connection
  connectionStatus: ConnectionStatus;
  isConnected: boolean;
  reconnect: () => void;
  disconnect: () => void;

  // Messages
  messages: Message[];
  sendMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  markAsRead: (conversationId: string, messageId: string) => void;
  markConversationAsRead: (conversationId: string) => void;

  // Conversations
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (conversationId: string | null) => void;
  loadConversation: (conversationId: string) => Promise<void>;

  // Typing
  sendTypingIndicator: (conversationId: string, isTyping: boolean) => void;
  typingUsers: string[];

  // Error handling
  error: Error | null;
  clearError: () => void;
}

/**
 * Default context value
 */
const defaultContext: WebSocketContextValue = {
  connectionStatus: 'disconnected',
  isConnected: false,
  reconnect: () => {},
  disconnect: () => {},
  messages: [],
  sendMessage: () => {},
  markAsRead: () => {},
  markConversationAsRead: () => {},
  conversations: [],
  activeConversationId: null,
  setActiveConversationId: () => {},
  loadConversation: async () => {},
  sendTypingIndicator: () => {},
  typingUsers: [],
  error: null,
  clearError: () => {},
};

// Create context
const WebSocketContext = createContext<WebSocketContextValue | undefined>(undefined);

/**
 * Generate unique message ID
 */
function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * WebSocket Provider Props
 */
interface WebSocketProviderProps {
  children: ReactNode;
  /**
   * WebSocket server URL
   */
  url: string;
  /**
   * Auto-connect on mount
   */
  autoConnect?: boolean;
  /**
   * Reconnect interval (ms)
   */
  reconnectInterval?: number;
  /**
   * Max reconnect attempts
   */
  maxReconnectAttempts?: number;
  /**
   * User authentication token
   */
  token?: string;
}

/**
 * WebSocket Provider Component
 *
 * Provides WebSocket connection and messaging functionality to child components.
 */
export function WebSocketProvider({
  children,
  url,
  autoConnect = true,
  reconnectInterval = 3000,
  maxReconnectAttempts = 10,
  token,
}: WebSocketProviderProps) {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const messageQueueRef = useRef<Omit<Message, 'id' | 'timestamp'>[]>([]);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionStatus('connecting');
    setError(null);

    try {
      const wsUrl = token ? `${url}?token=${token}` : url;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('[WebSocket] Connected');
        setConnectionStatus('connected');
        reconnectAttemptsRef.current = 0;

        // Send queued messages
        while (messageQueueRef.current.length > 0) {
          const queuedMessage = messageQueueRef.current.shift();
          if (queuedMessage) {
            ws.send(JSON.stringify({
              type: 'message',
              data: queuedMessage,
            }));
          }
        }
      };

      ws.onmessage = (event) => {
        try {
          const wsMessage: WebSocketMessage = JSON.parse(event.data);
          handleWebSocketMessage(wsMessage);
        } catch (err) {
          console.error('[WebSocket] Failed to parse message:', err);
        }
      };

      ws.onclose = (event) => {
        console.log('[WebSocket] Disconnected:', event.code, event.reason);
        setConnectionStatus('disconnected');
        wsRef.current = null;

        // Auto-reconnect
        if (autoConnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          setConnectionStatus('reconnecting');
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      ws.onerror = (event) => {
        console.error('[WebSocket] Error:', event);
        setConnectionStatus('error');
        setError(new Error('WebSocket connection error'));
      };

      wsRef.current = ws;
    } catch (err) {
      console.error('[WebSocket] Connection failed:', err);
      setConnectionStatus('error');
      setError(err instanceof Error ? err : new Error('Failed to connect'));
    }
  }, [url, token, autoConnect, reconnectInterval, maxReconnectAttempts]);

  // Disconnect
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setConnectionStatus('disconnected');
  }, []);

  // Manual reconnect
  const reconnect = useCallback(() => {
    disconnect();
    reconnectAttemptsRef.current = 0;
    connect();
  }, [disconnect, connect]);

  // Handle incoming WebSocket messages
  const handleWebSocketMessage = useCallback((wsMessage: WebSocketMessage) => {
    switch (wsMessage.type) {
      case 'message':
        const message: Message = {
          ...wsMessage.data,
          timestamp: new Date(wsMessage.data.timestamp),
        };

        setMessages(prev => {
          // Check if message already exists
          if (prev.some(m => m.id === message.id)) {
            return prev;
          }
          return [...prev, message];
        });

        // Update conversation last message
        setConversations(prev => prev.map(conv => {
          if (conv.id === message.conversationId) {
            return {
              ...conv,
              lastMessage: message,
              lastMessageAt: message.timestamp,
              updatedAt: message.timestamp,
            };
          }
          return conv;
        }));

        break;

      case 'typing':
        const typing: TypingIndicator = wsMessage.data;
        setTypingUsers(prev => {
          if (typing.isTyping) {
            return [...prev.filter(u => u !== typing.userId), typing.userId];
          } else {
            return prev.filter(u => u !== typing.userId);
          }
        });

        // Update conversation typing users
        setConversations(prev => prev.map(conv => {
          if (conv.id === typing.conversationId) {
            return {
              ...conv,
              typingUsers: typing.isTyping
                ? [...conv.typingUsers.filter(u => u !== typing.userId), typing.userId]
                : conv.typingUsers.filter(u => u !== typing.userId),
            };
          }
          return conv;
        }));

        break;

      case 'read':
        // Update message read status
        setMessages(prev => prev.map(msg => {
          if (msg.id === wsMessage.data.messageId) {
            return {
              ...msg,
              readAt: new Date(wsMessage.data.readAt),
            };
          }
          return msg;
        }));
        break;

      case 'presence':
        // Update user online status
        setConversations(prev => prev.map(conv => ({
          ...conv,
          participants: conv.participants.map(p => {
            if (p.id === wsMessage.data.userId) {
              return {
                ...p,
                isOnline: wsMessage.data.isOnline,
                lastSeen: wsMessage.data.lastSeen ? new Date(wsMessage.data.lastSeen) : undefined,
              };
            }
            return p;
          }),
        })));
        break;

      case 'error':
        console.error('[WebSocket] Server error:', wsMessage.data);
        setError(new Error(wsMessage.data.message || 'WebSocket error'));
        break;

      case 'pong':
        // Heartbeat response
        break;

      default:
        console.log('[WebSocket] Unknown message type:', wsMessage.type);
    }
  }, []);

  // Send message
  const sendMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: generateMessageId(),
      timestamp: new Date(),
    };

    // Add to local state immediately (optimistic update)
    setMessages(prev => [...prev, newMessage]);

    // Update conversation
    setConversations(prev => prev.map(conv => {
      if (conv.id === message.conversationId) {
        return {
          ...conv,
          lastMessage: newMessage,
          lastMessageAt: newMessage.timestamp,
          updatedAt: newMessage.timestamp,
        };
      }
      return conv;
    }));

    // Send via WebSocket if connected
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'message',
        data: newMessage,
      }));
    } else {
      // Queue message for when connection is restored
      messageQueueRef.current.push(newMessage);
    }
  }, []);

  // Mark message as read
  const markAsRead = useCallback((conversationId: string, messageId: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId && msg.conversationId === conversationId) {
        return { ...msg, readAt: new Date() };
      }
      return msg;
    }));

    // Send read receipt via WebSocket
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'read',
        data: { conversationId, messageId, readAt: new Date().toISOString() },
      }));
    }
  }, []);

  // Mark entire conversation as read
  const markConversationAsRead = useCallback((conversationId: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.conversationId === conversationId && !msg.readAt) {
        return { ...msg, readAt: new Date() };
      }
      return msg;
    }));

    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return { ...conv, unreadCount: 0 };
      }
      return conv;
    }));

    // Send read receipt via WebSocket
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'read',
        data: { conversationId, readAt: new Date().toISOString() },
      }));
    }
  }, []);

  // Send typing indicator
  const sendTypingIndicator = useCallback((conversationId: string, isTyping: boolean) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'typing',
        data: { conversationId, isTyping },
      }));
    }
  }, []);

  // Load conversation messages
  const loadConversation = useCallback(async (conversationId: string) => {
    setActiveConversationId(conversationId);

    // In real app, fetch from API
    // For now, just filter existing messages
    setMessages(prev => prev.filter(m => m.conversationId === conversationId));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect]);

  // Heartbeat (ping every 30s)
  useEffect(() => {
    if (connectionStatus !== 'connected') return;

    const interval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [connectionStatus]);

  const value: WebSocketContextValue = {
    connectionStatus,
    isConnected: connectionStatus === 'connected',
    reconnect,
    disconnect,
    messages,
    sendMessage,
    markAsRead,
    markConversationAsRead,
    conversations,
    activeConversationId,
    setActiveConversationId,
    loadConversation,
    sendTypingIndicator,
    typingUsers,
    error,
    clearError,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

/**
 * Hook to use WebSocket context
 *
 * @example
 * ```tsx
 * function ChatComponent() {
 *   const { messages, sendMessage, connectionStatus } = useWebSocket();
 *
 *   const handleSend = () => {
 *     if (connectionStatus === 'connected') {
 *       sendMessage({
 *         conversationId: 'conv-123',
 *         senderId: 'user-1',
 *         receiverId: 'user-2',
 *         type: 'text',
 *         content: 'Hello!',
 *       });
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <div>Status: {connectionStatus}</div>
 *       {messages.map(msg => (
 *         <div key={msg.id}>{msg.content}</div>
 *       ))}
 *       <button onClick={handleSend}>Send</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
}

/**
 * Convenience hook for chat functionality
 */
export function useChat(conversationId?: string) {
  const ws = useWebSocket();
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const conversationMessages = conversationId
    ? ws.messages.filter(m => m.conversationId === conversationId)
    : ws.messages;

  const sendTextMessage = useCallback((content: string, receiverId: string) => {
    if (!conversationId) return;

    ws.sendMessage({
      conversationId,
      senderId: 'current-user', // In real app, get from auth
      receiverId,
      type: 'text',
      content,
    });
  }, [conversationId, ws]);

  const sendTyping = useCallback((typing: boolean) => {
    if (!conversationId) return;

    setIsTyping(typing);
    ws.sendTypingIndicator(conversationId, typing);

    // Auto-stop typing indicator after 3 seconds
    if (typing && typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (typing) {
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        ws.sendTypingIndicator(conversationId, false);
      }, 3000);
    }
  }, [conversationId, ws]);

  const markAsRead = useCallback(() => {
    if (conversationId) {
      ws.markConversationAsRead(conversationId);
    }
  }, [conversationId, ws.markConversationAsRead]);

  return {
    ...ws,
    conversationMessages,
    sendTextMessage,
    sendTyping,
    isTyping,
    markAsRead,
  };
}
