/**
 * ConversationList Component
 *
 * Sidebar component displaying active conversations and contacts.
 * Shows conversation list with unread indicators, last message, and online status.
 *
 * @module components/ConversationList
 * @category Components - Messaging
 *
 * Features:
 * - Conversation list with avatars
 * - Unread message count badges
 * - Last message preview
 * - Online status indicators
 * - Active conversation highlight
 * - Search functionality
 * - Filter by status (all, unread, archived)
 * - Conversation actions (archive, delete, mark read)
 * - Sort by recent activity
 *
 * @example
 * ```tsx
 * <ConversationList
 *   conversations={conversations}
 *   activeConversationId="conv-123"
 *   onSelectConversation={(id) => console.log(id)}
 *   onArchive={(id) => console.log('Archived:', id)}
 *   onDelete={(id) => console.log('Deleted:', id)}
 *   showSearch={true}
 *   showFilter={true}
 * />
 * ```
 */

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  MessageCircle, Search, Archive, Trash2, CheckCircle2,
  Clock, User, MoreVertical, Pin, X, Eye, EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { Conversation } from '@/contexts/WebSocketContext';

/**
 * Filter type
 */
export type ConversationFilter = 'all' | 'unread' | 'archived';

/**
 * Props for ConversationList component
 */
export interface ConversationListProps {
  /**
   * Conversation list
   */
  conversations: Conversation[];
  /**
   * Active conversation ID
   */
  activeConversationId?: string | null;
  /**
   * Conversation select handler
   */
  onSelectConversation?: (conversationId: string) => void;
  /**
   * Archive handler
   */
  onArchive?: (conversationId: string) => void;
  /**
   * Delete handler
   */
  onDelete?: (conversationId: string) => void;
  /**
   * Mark as read handler
   */
  onMarkRead?: (conversationId: string) => void;
  /**
   * Show search bar
   */
  showSearch?: boolean;
  /**
   * Show filter tabs
   */
  showFilter?: boolean;
  /**
   * Compact mode (for smaller spaces)
   */
  compact?: boolean;
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * Get status indicator color
 */
function getStatusColor(isOnline?: boolean): string {
  return isOnline
    ? 'bg-green-500'
    : 'bg-gray-400';
}

/**
 * ConversationList Component
 *
 * Sidebar conversation list with search and filters.
 */
export default function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
  onArchive,
  onDelete,
  onMarkRead,
  showSearch = true,
  showFilter = true,
  compact = false,
  className = '',
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<ConversationFilter>('all');
  const [expandedMenuId, setExpandedMenuId] = useState<string | null>(null);

  // Filter and sort conversations
  const filteredConversations = useMemo(() => {
    let filtered = [...conversations];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(conv => {
        const participantNames = conv.participants.map(p => p.name.toLowerCase()).join(' ');
        return participantNames.includes(searchQuery.toLowerCase());
      });
    }

    // Status filter
    if (filter === 'unread') {
      filtered = filtered.filter(conv => conv.unreadCount > 0);
    }

    // Sort by last message time
    filtered.sort((a, b) => {
      const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : new Date(a.updatedAt).getTime();
      const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : new Date(b.updatedAt).getTime();
      return bTime - aTime;
    });

    return filtered;
  }, [conversations, searchQuery, filter]);

  // Handle conversation select
  const handleSelect = (conversationId: string) => {
    if (onSelectConversation) {
      onSelectConversation(conversationId);
    }
    setExpandedMenuId(null);
  };

  // Get last message preview
  const getLastMessagePreview = (conversation: Conversation): string => {
    if (!conversation.lastMessage) {
      return 'Henüz mesaj yok';
    }

    const msg = conversation.lastMessage;
    if (msg.type === 'image') return '📷 Görsel';
    if (msg.type === 'video') return '🎬 Video';
    if (msg.type === 'file') return '📎 Dosya';
    if (msg.type === 'system') return '📢 Sistem';

    return msg.content;
  };

  // Render conversation item
  const renderConversationItem = (conversation: Conversation) => {
    const isActive = conversation.id === activeConversationId;
    const participant = conversation.participants[0]; // First participant
    const isTyping = conversation.typingUsers.length > 0;

    return (
      <motion.div
        key={conversation.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0 }}
        className="relative"
      >
        <div
          className={`p-3 rounded-lg cursor-pointer transition-all ${
            isActive
              ? 'bg-primary/10 border-primary'
              : 'hover:bg-muted/50 border-transparent'
          } border`}
          onClick={() => handleSelect(conversation.id)}
        >
          <div className="flex items-start gap-3">
            {/* Avatar with Online Status */}
            <div className="relative flex-shrink-0">
              {participant.avatar ? (
                <img
                  src={participant.avatar}
                  alt={participant.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  {participant.name.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Online Status Indicator */}
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(participant.isOnline)}`}
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className={`font-semibold text-sm truncate ${isActive ? 'text-foreground' : ''}`}>
                  {participant.name}
                </h4>

                <div className="flex items-center gap-1">
                  {/* Time */}
                  <span className="text-xs text-muted-foreground">
                    {conversation.lastMessageAt
                      ? formatDistanceToNow(new Date(conversation.lastMessageAt), {
                          addSuffix: true,
                          locale: tr,
                        })
                      : formatDistanceToNow(new Date(conversation.updatedAt), {
                          addSuffix: true,
                          locale: tr,
                        })}
                  </span>

                  {/* Actions Menu Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedMenuId(expandedMenuId === conversation.id ? null : conversation.id);
                    }}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Last Message */}
              <div className="flex items-center justify-between">
                <p className={`text-sm truncate ${isTyping ? 'text-primary italic' : 'text-muted-foreground'}`}>
                  {isTyping ? 'Yazıyor...' : getLastMessagePreview(conversation)}
                </p>

                {/* Unread Badge */}
                {conversation.unreadCount > 0 && (
                  <Badge
                    variant={isActive ? 'default' : 'secondary'}
                    className={`flex-shrink-0 ${isActive ? 'bg-primary' : ''}`}
                  >
                    {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Actions Menu */}
          {expandedMenuId === conversation.id && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-2 top-12 bg-background border rounded-lg shadow-lg overflow-hidden z-10"
            >
              {onMarkRead && conversation.unreadCount > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkRead(conversation.id);
                    setExpandedMenuId(null);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted text-left"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Okundu Say
                </button>
              )}

              {onArchive && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onArchive(conversation.id);
                    setExpandedMenuId(null);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted text-left"
                >
                  <Archive className="w-4 h-4" />
                  Arşivle
                </button>
              )}

              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(conversation.id);
                    setExpandedMenuId(null);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-red-500/10 text-red-500 text-left"
                >
                  <Trash2 className="w-4 h-4" />
                  Sil
                </button>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b space-y-4">
        <h2 className="font-bold text-lg">Mesajlar</h2>

        {/* Search */}
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        )}

        {/* Filter Tabs */}
        {showFilter && (
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
          </div>
        )}
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <MessageCircle className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="font-semibold text-muted-foreground mb-2">
              {searchQuery ? 'Sonuç bulunamadı' : 'Mesaj yok'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery
                ? 'Başka bir arama terimi deneyin'
                : 'İlk mesajı gönderin'}
            </p>
          </div>
        ) : (
          filteredConversations.map(renderConversationItem)
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t">
        <div className="text-xs text-muted-foreground text-center">
          {conversations.length} konuşma
          {conversations.filter(c => c.unreadCount > 0).length > 0 && (
            <>
              {' • '}
              <span className="text-primary font-semibold">
                {conversations.reduce((sum, c) => sum + c.unreadCount, 0)} okunmamış
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Compact Conversation List
 */
export function ConversationListCompact(props: ConversationListProps) {
  return <ConversationList {...props} compact showSearch={false} showFilter={false} />;
}

/**
 * Conversation Card (for embedding in pages)
 */
export function ConversationCard({
  conversation,
  isActive,
  onClick,
}: {
  conversation: Conversation;
  isActive?: boolean;
  onClick?: () => void;
}) {
  const participant = conversation.participants[0];
  const lastMessagePreview = conversation.lastMessage
    ? conversation.lastMessage.type === 'image'
      ? '📷 Görsel'
      : conversation.lastMessage.type === 'video'
      ? '🎬 Video'
      : conversation.lastMessage.content
    : 'Henüz mesaj yok';

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isActive ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {participant.avatar ? (
              <img
                src={participant.avatar}
                alt={participant.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                {participant.name.charAt(0).toUpperCase()}
              </div>
            )}
            {/* Online Status */}
            <div
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(participant.isOnline)}`}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold truncate">{participant.name}</h4>
              {conversation.unreadCount > 0 && (
                <Badge variant="default">{conversation.unreadCount}</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {lastMessagePreview}
            </p>
            <p className="text-xs text-muted-foreground">
              {conversation.lastMessageAt
                ? formatDistanceToNow(new Date(conversation.lastMessageAt), { addSuffix: true, locale: tr })
                : formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true, locale: tr })
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
