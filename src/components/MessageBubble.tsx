/**
 * MessageBubble Component
 *
 * Individual message bubble for chat interfaces.
 * Displays messages with different styles based on sender, type, and status.
 *
 * @module components/MessageBubble
 * @category Components - Messaging
 *
 * Features:
 * - Sent/received message styles
 * - Message types: text, image, video, file, system
 * - Timestamp display
 * - Read receipts
 * - Delivery status
 * - Attachment previews
 * - Avatar support
 * - Typing indicators
 * - Message actions (reply, delete, forward)
 *
 * @example
 * ```tsx
 * <MessageBubble
 *   message={message}
 *   isOwn={message.senderId === currentUserId}
 *   showAvatar={true}
 *   showActions={true}
 *   onReply={handleReply}
 *   onDelete={handleDelete}
 * />
 * ```
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Check, CheckCheck, Clock, MoreVertical, Reply, Trash2,
  Download, Eye, EyeOff, File, Image as ImageIcon, Video,
  AlertCircle, ChevronDown
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import type { Message } from '@/contexts/WebSocketContext';

/**
 * Props for MessageBubble component
 */
export interface MessageBubbleProps {
  /**
   * Message object
   */
  message: Message;
  /**
   * Whether this is the current user's message
   */
  isOwn: boolean;
  /**
   * Show sender avatar
   */
  showAvatar?: boolean;
  /**
   * Show message actions
   */
  showActions?: boolean;
  /**
   * Avatar URL
   */
  avatarUrl?: string;
  /**
   * Sender name
   */
  senderName?: string;
  /**
   * Reply handler
   */
  onReply?: (message: Message) => void;
  /**
   * Delete handler
   */
  onDelete?: (messageId: string) => void;
  /**
   * Download handler
   */
  onDownload?: (attachment: Message['attachments'][0]) => void;
  /**
   * Compact mode
   */
  compact?: boolean;
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * Get message type icon
 */
function getMessageIcon(type: Message['type']) {
  const icons = {
    text: null,
    image: <ImageIcon className="w-4 h-4" />,
    video: <Video className="w-4 h-4" />,
    file: <File className="w-4 h-4" />,
    system: <AlertCircle className="w-4 h-4" />,
    typing: null,
    read: null,
  };

  return icons[type];
}

/**
 * Get delivery status icon
 */
function getDeliveryStatusIcon(message: Message, isOwn: boolean) {
  if (!isOwn) return null;

  if (message.readAt) {
    return <CheckCheck className="w-4 h-4 text-blue-500" />;
  }

  if (message.deliveredAt) {
    return <CheckCheck className="w-4 h-4 text-gray-400" />;
  }

  return <Clock className="w-3 h-3 text-gray-400" />;
}

/**
 * MessageBubble Component
 *
 * Individual message display component.
 */
export default function MessageBubble({
  message,
  isOwn,
  showAvatar = true,
  showActions = false,
  avatarUrl,
  senderName = 'Kullanıcı',
  onReply,
  onDelete,
  onDownload,
  compact = false,
  className = '',
}: MessageBubbleProps) {
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [showAttachmentPreview, setShowAttachmentPreview] = useState(false);

  // Don't render typing indicators as bubbles
  if (message.type === 'typing' || message.type === 'read') {
    return null;
  }

  const isSystem = message.type === 'system';
  const hasAttachment = message.attachments && message.attachments.length > 0;

  // Render message content based on type
  const renderContent = () => {
    // System message
    if (isSystem) {
      return (
        <div className="text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-muted-foreground text-xs">
            {message.content}
          </span>
        </div>
      );
    }

    // File attachment
    if (message.type === 'file' && hasAttachment) {
      const attachment = message.attachments![0];
      return (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 max-w-xs">
          <div className="p-2 rounded bg-primary/10">
            <File className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{attachment.fileName}</p>
            <p className="text-xs text-muted-foreground">
              {attachment.fileSize ? `${(attachment.fileSize / 1024).toFixed(1)} KB` : ''}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDownload?.(attachment)}
            className="flex-shrink-0"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      );
    }

    // Image attachment
    if (message.type === 'image' && hasAttachment) {
      const attachment = message.attachments![0];
      return (
        <div className="space-y-2">
          <div
            className="rounded-lg overflow-hidden cursor-pointer"
            onClick={() => setShowAttachmentPreview(!showAttachmentPreview)}
          >
            <img
              src={attachment.thumbnailUrl || attachment.url}
              alt="Görsel eki"
              className="max-w-full h-auto"
            />
          </div>
          {message.content && (
            <p className="text-sm">{message.content}</p>
          )}
        </div>
      );
    }

    // Video attachment
    if (message.type === 'video' && hasAttachment) {
      const attachment = message.attachments![0];
      return (
        <div className="space-y-2">
          <div className="rounded-lg overflow-hidden bg-black">
            <video
              src={attachment.url}
              controls
              className="max-w-full"
            />
          </div>
          {message.content && (
            <p className="text-sm">{message.content}</p>
          )}
        </div>
      );
    }

    // Text message
    return (
      <div className="break-words whitespace-pre-wrap">
        {message.content}
      </div>
    );
  };

  return (
    <div className={`group flex ${isOwn ? 'justify-end' : 'justify-start'} ${className}`}>
      {/* Avatar */}
      {showAvatar && !isOwn && !isSystem && (
        <div className="flex-shrink-0 mr-2">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={senderName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
              {senderName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}

      {/* Message Content */}
      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[75%]`}>
        {/* Sender Name (group messages) */}
        {!isOwn && !isSystem && !compact && (
          <span className="text-xs text-muted-foreground mb-1 ml-1">
            {senderName}
          </span>
        )}

        {/* Message Bubble */}
        <div
          className={`relative ${
            isSystem
              ? ''
              : `px-4 py-2 rounded-2xl ${
                  isOwn
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-br-sm'
                    : 'bg-muted rounded-bl-sm'
                }`
          }`}
        >
          {renderContent()}

          {/* Actions Menu */}
          {showActions && !isSystem && (
            <div className="absolute top-0 right-0 -mt-8">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setShowActionsMenu(!showActionsMenu)}
              >
                <MoreVertical className="w-3 h-3" />
              </Button>

              {showActionsMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-full right-0 mt-1 bg-background border rounded-lg shadow-lg overflow-hidden z-10"
                >
                  {!isOwn && onReply && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start px-3 py-2 text-sm"
                      onClick={() => {
                        onReply(message);
                        setShowActionsMenu(false);
                      }}
                    >
                      <Reply className="w-4 h-4 mr-2" />
                      Yanıtla
                    </Button>
                  )}

                  {hasAttachment && onDownload && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start px-3 py-2 text-sm"
                      onClick={() => {
                        onDownload(message.attachments![0]);
                        setShowActionsMenu(false);
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      İndir
                    </Button>
                  )}

                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start px-3 py-2 text-sm text-red-500 hover:text-red-600"
                      onClick={() => {
                        onDelete(message.id);
                        setShowActionsMenu(false);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Sil
                    </Button>
                  )}
                </motion.div>
              )}
            </div>
          )}

          {/* Delivery Status */}
          {isOwn && !isSystem && (
            <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(message.timestamp, { addSuffix: true, locale: tr })}
              </span>
              {getDeliveryStatusIcon(message, isOwn)}
            </div>
          )}

          {/* Read Receipt */}
          {message.readAt && isOwn && (
            <div className="text-xs text-blue-500 mt-1">
              Okundu
            </div>
          )}
        </div>
      </div>

      {/* Own Avatar (optional) */}
      {showAvatar && isOwn && !isSystem && (
        <div className="flex-shrink-0 ml-2">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={senderName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
              {senderName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Typing Indicator Component
 */
export function TypingIndicator({ names }: { names: string[] }) {
  if (names.length === 0) return null;

  const text = names.length === 1
    ? `${names[0]} yazıyor...`
    : `${names.join(', ')} yazıyor...`;

  return (
    <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span>{text}</span>
    </div>
  );
}

/**
 * System Message Component
 */
export function SystemMessage({ message }: { message: Pick<Message, 'content' | 'timestamp'> }) {
  return (
    <div className="flex justify-center my-4">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-muted-foreground text-xs">
        <Clock className="w-3 h-3" />
        <span>{message.content}</span>
        <span className="text-[10px] opacity-70">
          {formatDistanceToNow(message.timestamp, { addSuffix: true, locale: tr })}
        </span>
      </div>
    </div>
  );
}

/**
 * Message Group Component
 *
 * Groups consecutive messages from the same sender.
 */
export function MessageGroup({
  messages,
  isOwn,
  showAvatar = true,
  avatarUrl,
  senderName,
  compact = false,
}: {
  messages: Message[];
  isOwn: boolean;
  showAvatar?: boolean;
  avatarUrl?: string;
  senderName?: string;
  compact?: boolean;
}) {
  if (messages.length === 0) return null;

  const firstMessage = messages[0];
  const lastMessage = messages[messages.length - 1];

  return (
    <div className={`space-y-1 ${isOwn ? 'items-end' : 'items-start'}`}>
      {messages.map((message, index) => (
        <MessageBubble
          key={message.id}
          message={message}
          isOwn={isOwn}
          showAvatar={index === 0 && showAvatar}
          avatarUrl={avatarUrl}
          senderName={senderName}
          compact={compact}
        />
      ))}
    </div>
  );
}
