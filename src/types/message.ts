/**
 * Message Types
 *
 * Type definitions for real-time messaging system.
 * Supports WebSocket-based real-time communication.
 *
 * @module types/message
 * @category Types
 */

/**
 * Message types supported in the chat system
 */
export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'location' | 'file' | 'system';

/**
 * Message delivery status
 */
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

/**
 * User online status
 */
export type OnlineStatus = 'online' | 'offline' | 'away' | 'busy';

/**
 * Base message interface
 */
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: MessageType;
  status: MessageStatus;
  timestamp: Date;
  isEdited?: boolean;
  editedAt?: Date;
  replyTo?: string; // Message ID being replied to
  reactions?: MessageReaction[];
  // Media fields
  mediaUrl?: string;
  mediaDuration?: number; // for audio/video in seconds
  mediaThumbnail?: string;
  // Location
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  // File
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
}

/**
 * Message reaction
 */
export interface MessageReaction {
  emoji: string;
  userId: string;
  userName: string;
  timestamp: Date;
}

/**
 * Conversation metadata
 */
export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  participantType: 'escort' | 'customer';
  lastMessage?: Message;
  lastMessageAt?: Date;
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
  isMuted: boolean;
  mutedUntil?: Date;
  onlineStatus: OnlineStatus;
  typingUsers: TypingUser[];
  createdAt: Date;
}

/**
 * Typing user info
 */
export interface TypingUser {
  userId: string;
  userName: string;
  timestamp: Date;
}

/**
 * Message input state
 */
export interface MessageInput {
  text: string;
  attachments: MessageAttachment[];
  replyTo?: Message;
}

/**
 * Message attachment
 */
export interface MessageAttachment {
  id: string;
  type: 'image' | 'video' | 'audio' | 'file';
  file: File;
  preview?: string;
  uploadProgress?: number;
}

/**
 * WebSocket message types
 */
export type WSMessageType =
  | 'message:new'
  | 'message:updated'
  | 'message:deleted'
  | 'message:read'
  | 'message:delivered'
  | 'conversation:typing'
  | 'conversation:online'
  | 'conversation:offline'
  | 'presence:update';

/**
 * WebSocket message payload
 */
export interface WSMessage {
  type: WSMessageType;
  payload: any;
  timestamp: Date;
}

/**
 * Chat settings
 */
export interface ChatSettings {
  soundEnabled: boolean;
  desktopNotifications: boolean;
  mobileNotifications: boolean;
  previewMessages: boolean;
  showOnline: boolean;
  showReadReceipts: boolean;
  showTypingIndicators: boolean;
}

/**
 * Presence state for user
 */
export interface PresenceState {
  userId: string;
  status: OnlineStatus;
  lastSeen: Date;
  currentConversation?: string;
  isTyping: boolean;
  typingInConversation?: string;
}

/**
 * Message draft (unsaved message)
 */
export interface MessageDraft {
  conversationId: string;
  text: string;
  attachments: MessageAttachment[];
  timestamp: Date;
}

/**
 * Message search result
 */
export interface MessageSearchResult {
  message: Message;
  conversation: Conversation;
  matchedText: string;
  highlightedText: string;
}

/**
 * Message report
 */
export interface MessageReport {
  id: string;
  messageId: string;
  reporterId: string;
  reportedUserId: string;
  reason: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

/**
 * Message event types for state management
 */
export type MessageEvent =
  | { type: 'SEND_MESSAGE'; payload: { conversationId: string; content: string; type?: MessageType } }
  | { type: 'EDIT_MESSAGE'; payload: { messageId: string; content: string } }
  | { type: 'DELETE_MESSAGE'; payload: { messageId: string } }
  | { type: 'REACT_TO_MESSAGE'; payload: { messageId: string; emoji: string } }
  | { type: 'MARK_AS_READ'; payload: { conversationId: string; messageId: string } }
  | { type: 'TYPING_START'; payload: { conversationId: string } }
  | { type: 'TYPING_STOP'; payload: { conversationId: string } }
  | { type: 'LOAD_MESSAGES'; payload: { conversationId: string; limit?: number; before?: string } }
  | { type: 'LOAD_CONVERSATIONS'; payload: { limit?: number } }
  | { type: 'PIN_CONVERSATION'; payload: { conversationId: string } }
  | { type: 'UNPIN_CONVERSATION'; payload: { conversationId: string } }
  | { type: 'ARCHIVE_CONVERSATION'; payload: { conversationId: string } }
  | { type: 'UNARCHIVE_CONVERSATION'; payload: { conversationId: string } }
  | { type: 'MUTE_CONVERSATION'; payload: { conversationId: string; duration?: number } }
  | { type: 'UNMUTE_CONVERSATION'; payload: { conversationId: string } }
  | { type: 'BLOCK_USER'; payload: { userId: string } }
  | { type: 'UNBLOCK_USER'; payload: { userId: string } }
  | { type: 'REPORT_MESSAGE'; payload: { messageId: string; reason: string; description?: string } };

/**
 * Message state for reducer
 */
export interface MessageState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>; // conversationId -> messages
  drafts: Record<string, MessageDraft>;
  presences: Record<string, PresenceState>;
  isLoading: boolean;
  error: string | null;
  typingUsers: Record<string, TypingUser[]>; // conversationId -> typing users
}

/**
 * Message action types
 */
export type MessageAction = MessageEvent & { type: string };

/**
 * Chat error types
 */
export type ChatErrorType =
  | 'CONNECTION_FAILED'
  | 'SEND_FAILED'
  | 'LOAD_FAILED'
  | 'UPLOAD_FAILED'
  | 'INVALID_FILE'
  | 'RATE_LIMITED'
  | 'BLOCKED'
  | 'PERMISSION_DENIED';

/**
 * Chat error
 */
export interface ChatError {
  type: ChatErrorType;
  message: string;
  code?: string;
  retryable: boolean;
  details?: any;
}

/**
 * File upload constraints
 */
export interface FileUploadConstraints {
  maxSize: number; // in bytes
  allowedTypes: string[];
  maxCount: number;
  maxHeight?: number;
  maxWidth?: number;
  maxDuration?: number; // for video/audio in seconds
}

/**
 * Emoji category
 */
export interface EmojiCategory {
  id: string;
  name: string;
  emojis: Emoji[];
}

/**
 * Emoji
 */
export interface Emoji {
  emoji: string;
  name: string;
  keywords: string[];
  skinTones?: string[];
}

/**
 * Quick reply suggestion
 */
export interface QuickReply {
  id: string;
  text: string;
  icon?: string;
  category?: string;
}

/**
 * Chat analytics event
 */
export interface ChatAnalyticsEvent {
  eventType: 'message_sent' | 'message_received' | 'conversation_opened' | 'reaction_added' | 'search_performed';
  userId: string;
  conversationId?: string;
  messageId?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

/**
 * Constants
 */
export const MESSAGE_LIMITS = {
  MAX_LENGTH: 4000,
  MAX_ATTACHMENTS: 10,
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_VIDEO_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_AUDIO_SIZE: 25 * 1024 * 1024, // 25MB
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
} as const;

export const REACTION_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥', '👏', '🎉'] as const;

export const QUICK_REPLIES: QuickReply[] = [
  { id: '1', text: 'Merhaba, nasılsınız?', icon: '👋' },
  { id: '2', text: 'Randevu alabilir miyim?', icon: '📅' },
  { id: '3', text: 'Uygun musunuz?', icon: '✨' },
  { id: '4', text: 'Fiyat bilgisi alabilir miyim?', icon: '💰' },
  { id: '5', text: 'Konum bilgisi verebilir misiniz?', icon: '📍' },
] as const;

export const TYPING_TIMEOUT = 3000; // ms
export const PRESENCE_UPDATE_INTERVAL = 30000; // ms
export const MESSAGE_LOAD_BATCH = 50;
