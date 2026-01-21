/**
 * Messages Panel Component
 *
 * Conversation list sidebar with search, filters, and quick actions.
 * Displays all conversations with unread counts, typing indicators, and online status.
 *
 * @module components/MessagesPanel
 * @category Components - Messaging
 */

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  MessageCircle,
  Search,
  Pin,
  Archive,
  MoreVertical,
  X,
  Check,
  Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Conversation, OnlineStatus } from '@/types/message';

interface MessagesPanelProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  onPinConversation?: (conversationId: string) => void;
  onUnpinConversation?: (conversationId: string) => void;
  onArchiveConversation?: (conversationId: string) => void;
  onDeleteConversation?: (conversationId: string) => void;
  onStartNewChat?: () => void;
  className?: string;
}

const statusColors: Record<OnlineStatus, string> = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
};

export function MessagesPanel({
  conversations,
  activeConversationId,
  onSelectConversation,
  onPinConversation,
  onUnpinConversation,
  onArchiveConversation,
  onDeleteConversation,
  onStartNewChat,
  className = '',
}: MessagesPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'pinned' | 'archived'>('all');
  const [showMenuFor, setShowMenuFor] = useState<string | null>(null);

  // Filter conversations
  const filteredConversations = useMemo(() => {
    let results = [...conversations];

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(c =>
        c.participantName.toLowerCase().includes(query)
      );
    }

    // Apply filter
    switch (filter) {
      case 'unread':
        results = results.filter(c => c.unreadCount > 0);
        break;
      case 'pinned':
        results = results.filter(c => c.isPinned);
        break;
      case 'archived':
        results = results.filter(c => c.isArchived);
        break;
    }

    // Sort: pinned first, then by last message time
    results.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      const timeA = a.lastMessageAt?.getTime() || 0;
      const timeB = b.lastMessageAt?.getTime() || 0;
      return timeB - timeA;
    });

    return results;
  }, [conversations, searchQuery, filter]);

  const getStatusColor = (status: OnlineStatus) => statusColors[status];

  const formatLastMessage = (conversation: Conversation) => {
    if (!conversation.lastMessage) return 'Henüz mesaj yok';

    const msg = conversation.lastMessage;
    if (msg.type === 'image') return '📷 Fotoğraf';
    if (msg.type === 'video') return '🎥 Video';
    if (msg.type === 'audio') return '🎤 Ses mesajı';
    if (msg.type === 'location') return '📍 Konum';
    if (msg.type === 'file') return '📎 Dosya';

    return msg.content.length > 40
      ? msg.content.substring(0, 40) + '...'
      : msg.content;
  };

  const formatTime = (date?: Date) => {
    if (!date) return '';
    return formatDistanceToNow(date, { addSuffix: true, locale: tr });
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Mesajlar</h2>
          <Button size="icon" variant="ghost" onClick={onStartNewChat}>
            <MessageCircle className="w-5 h-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Sohbet ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
            className="flex-1"
          >
            Tümü
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('unread')}
            className="flex-1"
          >
            Okunmamış
          </Button>
          <Button
            variant={filter === 'pinned' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('pinned')}
            className="flex-1"
          >
            Sabitlenmiş
          </Button>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {filteredConversations.map((conversation) => {
              const isActive = activeConversationId === conversation.id;
              const isTyping = conversation.typingUsers.length > 0;

              return (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    onClick={() => onSelectConversation(conversation.id)}
                    className={`w-full p-4 text-left transition-all relative group ${
                      isActive
                        ? 'bg-primary/10 border-l-4 border-l-primary'
                        : 'hover:bg-muted/50 border-l-4 border-l-transparent'
                    }`}
                  >
                    {/* Pin indicator */}
                    {conversation.isPinned && (
                      <div className="absolute top-2 right-2">
                        <Pin className="w-3 h-3 text-primary fill-primary" />
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-bold text-lg overflow-hidden">
                          {conversation.participantAvatar ? (
                            <img
                              src={conversation.participantAvatar}
                              alt={conversation.participantName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            conversation.participantName[0].toUpperCase()
                          )}
                        </div>

                        {/* Online indicator */}
                        <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(conversation.onlineStatus)} border-2 border-background rounded-full`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-semibold truncate ${
                            conversation.isMuted ? 'text-muted-foreground' : ''
                          }`}>
                            {conversation.participantName}
                          </h3>
                          <span className="text-xs text-muted-foreground shrink-0 ml-2">
                            {formatTime(conversation.lastMessageAt)}
                          </span>
                        </div>

                        {/* Last message or typing indicator */}
                        <div className="flex items-center justify-between gap-2">
                          {isTyping ? (
                            <div className="flex items-center gap-1 text-sm text-primary">
                              <Clock className="w-3 h-3 animate-pulse" />
                              <span className="animate-pulse">Yazıyor...</span>
                            </div>
                          ) : (
                            <p className={`text-sm truncate ${
                              conversation.unreadCount > 0 ? 'font-medium' : 'text-muted-foreground'
                            }`}>
                              {conversation.lastMessage?.senderId === 'me' && (
                                <Check className="w-3 h-3 inline mr-1 text-blue-500" />
                              )}
                              {formatLastMessage(conversation)}
                            </p>
                          )}

                          {/* Unread count */}
                          {conversation.unreadCount > 0 && (
                            <Badge className="bg-primary text-primary-foreground shrink-0">
                              {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                            </Badge>
                          )}
                        </div>

                        {/* Muted indicator */}
                        {conversation.isMuted && (
                          <p className="text-xs text-muted-foreground mt-1">🔇 Sessize alındı</p>
                        )}
                      </div>
                    </div>

                    {/* Quick actions menu */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMenuFor(showMenuFor === conversation.id ? null : conversation.id);
                        }}
                      >
                        <MoreVertical className="w-3 h-3" />
                      </Button>
                    </div>

                    {/* Menu dropdown */}
                    <AnimatePresence>
                      {showMenuFor === conversation.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-2 top-10 bg-background border rounded-lg shadow-xl z-50 overflow-hidden min-w-[150px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="p-1">
                            {conversation.isPinned ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start"
                                onClick={() => {
                                  onUnpinConversation?.(conversation.id);
                                  setShowMenuFor(null);
                                }}
                              >
                                <Pin className="w-4 h-4 mr-2" />
                                Sabitlemeyi kaldır
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start"
                                onClick={() => {
                                  onPinConversation?.(conversation.id);
                                  setShowMenuFor(null);
                                }}
                              >
                                <Pin className="w-4 h-4 mr-2" />
                                Sabitle
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start"
                              onClick={() => {
                                onArchiveConversation?.(conversation.id);
                                setShowMenuFor(null);
                              }}
                            >
                              <Archive className="w-4 h-4 mr-2" />
                              Arşivle
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-red-600 hover:text-red-700"
                              onClick={() => {
                                onDeleteConversation?.(conversation.id);
                                setShowMenuFor(null);
                              }}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Sil
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <MessageCircle className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="font-semibold mb-2">
              {searchQuery ? 'Sohpet bulunamadı' : 'Henüz sohbetiniz yok'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery
                ? 'Arama kriterlerinize uygun sohpet bulunamadı'
                : 'İlk sohbeti başlatmak için bir escort profili ziyaret edin'}
            </p>
            {onStartNewChat && (
              <Button onClick={onStartNewChat} variant="outline">
                Yeni Sohpet Başlat
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export { MessagesPanel as default };
