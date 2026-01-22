/**
 * Messages Page
 *
 * Real-time messaging interface with WebSocket-based live chat.
 * Features conversation list, chat area with message history, and message sending.
 *
 * @module pages/Messages
 * @category Pages - Dashboard
 *
 * Features:
 * - WebSocket-based real-time messaging
 * - Conversation list with search and filters
 * - Typing indicators and presence status
 * - Message reactions, edit, and delete
 * - Read receipts and delivery status
 * - File attachments (images, videos, audio, files)
 * - Location sharing
 * - Voice messages
 * - Quick replies
 * - Conversation pinning and archiving
 * - User blocking and muting
 *
 * @example
 * ```tsx
 * // Route: /messages
 * <Messages />
 * ```
 */

import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessagesPanel } from '@/components/MessagesPanel';
import { ChatWindow } from '@/components/ChatWindow';
import { useChat } from '@/hooks/useChat';
import {
  MessageCircle,
  ArrowLeft,
  Wifi,
  WifiOff,
  Bell,
  BellOff,
  Info,
  MoreVertical,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Messages() {
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [showConnectionStatus, setShowConnectionStatus] = useState(true);

  const {
    conversations,
    activeConversationId,
    messages,
    isConnected,
    isConnecting,
    error,
    presences,
    typingUsers,

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
    startTyping,
    stopTyping,
    connect,
    disconnect,
  } = useChat({
    autoReconnect: true,
    enablePresence: true,
  });

  // Auto-hide connection status after 3 seconds
  useEffect(() => {
    if (isConnected) {
      const timer = setTimeout(() => setShowConnectionStatus(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isConnected]);

  // Get active conversation
  const activeConversation = conversations.find(c => c.id === activeConversationId) || null;
  const activeMessages = activeConversationId ? (messages[activeConversationId] || []) : [];

  // Handle back button (mobile)
  const handleBack = () => {
    setActiveConversation(null);
  };

  // Connection status indicator
  const ConnectionStatus = () => (
    <AnimatePresence>
      {showConnectionStatus && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-2"
        >
          <Badge
            variant={isConnected ? 'default' : 'destructive'}
            className="flex items-center gap-2 shadow-lg"
          >
            {isConnected ? (
              <>
                <Wifi className="w-3 h-3" />
                Çevrimiçi
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3" />
                {isConnecting ? 'Bağlanıyor...' : 'Çevrimdışı'}
              </>
            )}
          </Badge>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ConnectionStatus />

      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Mesajlar
                </h1>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    {conversations.length} sohbet
                  </p>
                  {isConnected && (
                    <Badge variant="outline" className="text-xs">
                      <Wifi className="w-3 h-3 mr-1 text-green-500" />
                      Canlı
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Header actions */}
            <div className="flex items-center gap-2">
              {activeConversation && (
                <>
                  {activeConversation.isMuted ? (
                    <Button variant="ghost" size="icon">
                      <BellOff className="w-5 h-5 text-muted-foreground" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon">
                      <Bell className="w-5 h-5" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon">
                    <Info className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
          {/* Sidebar - Conversations List */}
          <Card className="lg:col-span-1 overflow-hidden">
            <MessagesPanel
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelectConversation={(id) => {
                setActiveConversation(id);
                // Mark as read when switching conversation
                const conv = conversations.find(c => c.id === id);
                if (conv && conv.unreadCount > 0) {
                  const lastMessage = messages[id]?.[0];
                  if (lastMessage) {
                    markAsRead(id, lastMessage.id);
                  }
                }
              }}
              onPinConversation={pinConversation}
              onUnpinConversation={unpinConversation}
              onArchiveConversation={archiveConversation}
              onStartNewChat={() => setIsNewChatModalOpen(true)}
            />
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 overflow-hidden">
            <ChatWindow
              conversation={activeConversation}
              messages={activeMessages}
              onSendMessage={(content, type, attachments) => activeConversationId ? sendMessage(activeConversationId, content, type, attachments) : Promise.resolve()}
              onEditMessage={editMessage}
              onDeleteMessage={deleteMessage}
              onReactToMessage={reactToMessage}
              onCall={() => {}}
              onVideoCall={() => {}}
              onShowInfo={() => {}}
              isMobile={false}
            />
          </Card>
        </div>
      </div>

      {/* New Chat Modal */}
      <AnimatePresence>
        {isNewChatModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsNewChatModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-background rounded-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold mb-2">Yeni Sohpet Başlat</h2>
                <p className="text-muted-foreground">
                  Sohpet başlatmak için bir escort profili ziyaret edin
                </p>
              </div>

              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  🔍 İlanlarda ara
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  ⭐ Favorilerime git
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  📍 Yakındaki escortlar
                </Button>
              </div>

              <Button
                variant="ghost"
                className="w-full mt-4"
                onClick={() => setIsNewChatModalOpen(false)}
              >
                İptal
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { Messages };
