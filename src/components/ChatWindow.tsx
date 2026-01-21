/**
 * Chat Window Component
 *
 * Real-time chat interface with message display, typing indicators, and reactions.
 * Supports multiple message types with auto-scroll and read receipts.
 *
 * @module components/ChatWindow
 * @category Components - Messaging
 */

import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Phone,
  Video,
  Info,
  MoreVertical,
  Check,
  CheckCheck,
  Clock,
  MapPin,
  Mic,
  Image,
  FileImage,
  File,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message, Conversation, OnlineStatus } from '@/types/message';
import { MessageInput } from './MessageInput';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

interface ChatWindowProps {
  conversation: Conversation | null;
  messages: Message[];
  onSendMessage: (content: string, type?: string, attachments?: any[]) => Promise<void>;
  onEditMessage?: (messageId: string, content: string) => Promise<void>;
  onDeleteMessage?: (messageId: string) => Promise<void>;
  onReactToMessage?: (messageId: string, emoji: string) => Promise<void>;
  onCall?: () => void;
  onVideoCall?: () => void;
  onShowInfo?: () => void;
  currentUserId?: string;
  isMobile?: boolean;
  onBack?: () => void;
  className?: string;
}

const statusLabels: Record<OnlineStatus, string> = {
  online: 'Çevrimiçi',
  offline: 'Çevrimdışı',
  away: 'Uzakta',
  busy: 'Meşgul',
};

export function ChatWindow({
  conversation,
  messages,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onReactToMessage,
  onCall,
  onVideoCall,
  onShowInfo,
  currentUserId = 'me',
  isMobile = false,
  onBack,
  className = '',
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      // MessageInput will handle this
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderMessageContent = (message: Message) => {
    switch (message.type) {
      case 'image':
        return (
          <div className="space-y-2">
            {message.mediaUrl && (
              <img
                src={message.mediaUrl}
                alt="Gönderilen resim"
                className="max-w-full rounded-lg"
              />
            )}
            {message.content && <p className="text-sm">{message.content}</p>}
          </div>
        );

      case 'video':
        return (
          <div className="space-y-2">
            {message.mediaUrl && (
              <video
                src={message.mediaUrl}
                controls
                className="max-w-full rounded-lg max-h-[300px]"
              />
            )}
            {message.content && <p className="text-sm">{message.content}</p>}
          </div>
        );

      case 'audio':
        return (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Mic className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="h-10 bg-primary/10 rounded-full flex items-center px-4">
                <div className="w-16 h-1 bg-primary/30 rounded-full">
                  <div className="w-1/3 h-full bg-primary rounded-full" />
                </div>
              </div>
              <p className="text-xs opacity-60 mt-1">
                {message.mediaDuration ? `${Math.floor(message.mediaDuration / 60)}:${(message.mediaDuration % 60).toString().padStart(2, '0')}` : '0:00'}
              </p>
            </div>
          </div>
        );

      case 'location':
        return (
          <div className="flex items-start gap-3">
            <MapPin className="w-8 h-8 text-red-500 shrink-0 mt-1" />
            <div>
              <p className="font-semibold">Konum Paylaşıldı</p>
              <p className="text-sm opacity-80">{message.location?.address}</p>
            </div>
          </div>
        );

      case 'file':
        return (
          <div className="flex items-center gap-3 p-3 bg-black/10 rounded-lg">
            <File className="w-8 h-8 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{message.fileName}</p>
              <p className="text-xs opacity-60">
                {message.fileSize ? `${(message.fileSize / 1024).toFixed(1)} KB` : ''}
              </p>
            </div>
          </div>
        );

      default:
        return <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>;
    }
  };

  const getStatusColor = (status: OnlineStatus) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-400';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
    }
  };

  if (!conversation) {
    return (
      <div className={`flex flex-col h-full ${className}`}>
        <div className="flex-1 flex items-center justify-center text-center p-8">
          <div>
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Info className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold mb-2">Mesajlaşmaya Başlayın</h3>
            <p className="text-muted-foreground max-w-md">
              Soldaki listeden bir sohbet seçin veya yeni bir sohbet başlatmak için bir escort profili ziyaret edin.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isMobile && onBack && (
              <Button variant="ghost" size="icon" onClick={onBack}>
                ←
              </Button>
            )}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-bold">
                {conversation.participantAvatar ? (
                  <img
                    src={conversation.participantAvatar}
                    alt={conversation.participantName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  conversation.participantName[0].toUpperCase()
                )}
              </div>
              <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(conversation.onlineStatus)} border-2 border-background rounded-full`} />
            </div>
            <div>
              <h3 className="font-bold flex items-center gap-2">
                {conversation.participantName}
                {conversation.isMuted && (
                  <Badge variant="secondary" className="text-xs">🔇 Sessiz</Badge>
                )}
              </h3>
              <p className="text-xs text-muted-foreground">
                {statusLabels[conversation.onlineStatus]}
                {conversation.typingUsers.length > 0 && (
                  <span className="ml-2 text-primary animate-pulse">• Yazıyor...</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onCall && (
              <Button variant="ghost" size="icon">
                <Phone className="w-5 h-5" />
              </Button>
            )}
            {onVideoCall && (
              <Button variant="ghost" size="icon">
                <Video className="w-5 h-5" />
              </Button>
            )}
            {onShowInfo && (
              <Button variant="ghost" size="icon">
                <Info className="w-5 h-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <Clock className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="font-medium text-lg">Henüz mesaj yok</p>
              <p className="text-sm mt-2">İlk mesajı siz gönderin</p>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => {
              const isOwn = message.senderId === currentUserId;
              const showAvatar = !isOwn && (index === 0 || messages[index - 1]?.senderId !== message.senderId);

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] ${isOwn ? 'order-2' : 'order-1'}`}>
                    {/* Sender avatar for received messages */}
                    {!isOwn && showAvatar && (
                      <div className="flex items-end gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs font-bold shrink-0">
                          {message.senderName[0]}
                        </div>
                        <span className="text-xs text-muted-foreground">{message.senderName}</span>
                      </div>
                    )}

                    {/* Message bubble */}
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        isOwn
                          ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {renderMessageContent(message)}

                      {/* Reactions */}
                      {message.reactions && message.reactions.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {message.reactions.map((reaction, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-black/10 rounded-full text-sm"
                            >
                              {reaction.emoji}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Message footer */}
                    <div className={`flex items-center gap-2 mt-1 px-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(new Date(message.timestamp))}
                      </span>
                      {isOwn && (
                        <>
                          {message.status === 'read' ? (
                            <CheckCheck className="w-3 h-3 text-blue-500" />
                          ) : message.status === 'delivered' ? (
                            <CheckCheck className="w-3 h-3 text-muted-foreground" />
                          ) : message.status === 'sent' ? (
                            <Check className="w-3 h-3 text-muted-foreground" />
                          ) : (
                            <Clock className="w-3 h-3 text-muted-foreground animate-spin" />
                          )}
                        </>
                      )}
                      {message.isEdited && (
                        <span className="text-xs text-muted-foreground">(düzenlendi)</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        )}
      </div>

      {/* Message Input */}
      <MessageInput
        conversationId={conversation.id}
        onSendMessage={onSendMessage}
        isMuted={conversation.isMuted}
      />
    </div>
  );
}

export { ChatWindow as default };
