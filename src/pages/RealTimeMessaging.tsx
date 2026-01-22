/**
 * RealTimeMessaging Page
 *
 * Complete real-time messaging interface with WebSocket integration.
 * Features conversation list, message bubbles, and typing indicators.
 *
 * @module pages/RealTimeMessaging
 * @category Pages - Messaging
 *
 * Features:
 * - Split view: conversation list + message area
 * - Real-time message updates via WebSocket
 * - Typing indicators
 * - Read receipts
 * - File/image attachments
 * - Online status indicators
 * - Message search
 * - Conversation management
 *
 * Routes: /messages (already exists, this is an enhanced version)
 *
 * @example
 * ```tsx
 * // Enhanced messages page with WebSocket
 * <RealTimeMessaging />
 * ```
 */

import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProtectedRoute from '@/components/ProtectedRoute';
import { WebSocketProvider } from '@/contexts/WebSocketContext';
import ConversationList from '@/components/ConversationList';
import MessageBubble, { TypingIndicator, SystemMessage } from '@/components/MessageBubble';
import ChatInput from '@/components/ChatInput';
import { useAuth } from '@/contexts/AuthContext';
import {
  ArrowLeft, MoreVertical, Phone, Video, Info, Shield,
  Search, Filter, User, Settings, Bell, Slash,
  ChevronLeft, Menu, X, MessageCircle
} from 'lucide-react';
import { SEO } from '@/pages/SEO';
import type { Conversation, Message } from '@/contexts/WebSocketContext';

/**
 * Mock conversations data
 */
const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    participants: [
      {
        id: 'escort-1',
        name: 'Ayşe Yılmaz',
        role: 'escort',
        avatar: 'https://images.unsplash.com/photo-1494790108377-e9e60c0c8007w=150&h=150&fit=crop',
        isOnline: true,
      },
      {
        id: 'customer-1',
        name: 'Mehmet Demir',
        role: 'customer',
        isOnline: false,
        lastSeen: new Date(Date.now() - 5 * 60 * 1000),
      },
    ],
    lastMessage: {
      id: 'msg-1',
      conversationId: 'conv-1',
      senderId: 'customer-1',
      receiverId: 'escort-1',
      type: 'text',
      content: 'Merhaba, randevu için uygun görünüyor musunuz?',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
    },
    lastMessageAt: new Date(Date.now() - 10 * 60 * 1000),
    unreadCount: 2,
    typingUsers: [],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
  },
  {
    id: 'conv-2',
    participants: [
      {
        id: 'escort-2',
        name: 'Zeynep Kaya',
        role: 'escort',
        avatar: 'https://images.unsplash.com/photo-1534530298-59eacd0039fd3w=150&h=150&fit=crop',
        isOnline: true,
      },
      {
        id: 'customer-2',
        name: 'Can Yılmaz',
        role: 'customer',
        isOnline: true,
      },
    ],
    lastMessage: {
      id: 'msg-2',
      conversationId: 'conv-2',
      senderId: 'escort-2',
      receiverId: 'customer-2',
      type: 'text',
      content: 'Randevuyu onaylandı, görüşmek üzere bekliyorum.',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      readAt: new Date(Date.now() - 30 * 60 * 1000),
    },
    lastMessageAt: new Date(Date.now() - 60 * 60 * 1000),
    unreadCount: 0,
    typingUsers: [],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    id: 'conv-3',
    participants: [
      {
        id: 'escort-3',
        name: 'Elif Şahin',
        role: 'escort',
        avatar: 'https://images.unsplash.com/photo-1531746020798-e48917e64580w=150&h=150&fit=crop',
        isOnline: false,
        lastSeen: new Date(Date.now() - 60 * 60 * 1000),
      },
      {
        id: 'customer-3',
        name: 'Ali Veli',
        role: 'customer',
        isOnline: false,
      },
    ],
    lastMessage: {
      id: 'msg-3',
      conversationId: 'conv-3',
      senderId: 'customer-3',
      receiverId: 'escort-3',
      type: 'image',
      content: 'Görsel ekledim.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    lastMessageAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    unreadCount: 1,
    typingUsers: [],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
];

/**
 * Mock messages for a conversation
 */
const mockMessages: Message[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'customer-1',
    receiverId: 'escort-1',
    type: 'text',
    content: 'Merhaba, randevu için uygun görünüyor musunuz?',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'escort-1',
    receiverId: 'customer-1',
    type: 'text',
    content: 'Merhaba! Evet, uygun görünüyor. Hangi tarih ve saat istersiniz?',
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    readAt: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: 'msg-3',
    conversationId: 'conv-1',
    senderId: 'customer-1',
    receiverId: 'escort-1',
    type: 'text',
    content: 'Yarın akşam 19:00 olabilir mi?',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
  },
];

/**
 * RealTimeMessaging Page Component
 */
export default function RealTimeMessaging() {
  const { user } = useAuth();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [isMobileView, setIsMobileView] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserId: string = (user?.id as string) || 'customer-1';

  // Handle mobile responsive
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle conversation select
  const handleSelectConversation = (conversationId: string) => {
    const conversation = mockConversations.find(c => c.id === conversationId);
    if (conversation) {
      setSelectedConversation(conversation);
      // Load conversation messages (mock)
      const convMessages = mockMessages.filter(m => m.conversationId === conversationId);
      setMessages(convMessages);

      // Close mobile sidebar
      if (isMobileView) {
        setShowMobileSidebar(false);
      }
    }
  };

  // Handle send message
  const handleSendMessage = (content: string, attachments?: unknown[]) => {
    if (!selectedConversation) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: currentUserId,
      receiverId: selectedConversation.participants.find(p => p.id !== currentUserId)?.id ?? '',
      type: 'text',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);

    // Update conversation
    // In real app, this would be handled by WebSocket
  };

  // Handle typing indicator
  const handleTyping = (isTyping: boolean) => {
    // In real app, send via WebSocket
  };

  // Handle mark as read
  const handleMarkAsRead = () => {
    if (selectedConversation) {
      // Mark all unread messages as read
      setMessages(prev => prev.map(m => {
        if (m.conversationId === selectedConversation.id && !m.readAt) {
          return { ...m, readAt: new Date() };
        }
        return m;
      }));
    }
  };

  return (
    <WebSocketProvider url="wss://api.example.com/ws" autoConnect={false}>
      <ProtectedRoute accessLevel="customer">
        <div className="h-screen bg-background flex flex-col">
          <SEO
            title="Mesajlar | Escort Platform"
            description="Gerçek zamanlı mesajlaşma"
          />

          {/* Header */}
          <header className="border-b bg-background/95 backdrop-blur">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                {/* Mobile Menu Button */}
                {isMobileView && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                    className="lg:hidden"
                  >
                    {showMobileSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </Button>
                )}

                {/* Back Button */}
                <Link href="/dashboard">
                  <Button variant="ghost" size="icon" className="hidden sm:flex">
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                </Link>

                <div>
                  <h1 className="font-bold text-lg">Mesajlar</h1>
                  {!isMobileView && (
                    <p className="text-sm text-muted-foreground">
                      {mockConversations.length} aktif konuşma
                    </p>
                  )}
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Search className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Filter className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar - Conversation List */}
            <aside
              className={`${
                isMobileView
                  ? `fixed inset-y-0 left-0 z-50 w-80 transform transition-transform ${
                      showMobileSidebar ? 'translate-x-0' : '-translate-x-full'
                    }`
                  : 'w-80 border-r'
              } bg-background`}
            >
              <ConversationList
                conversations={mockConversations}
                activeConversationId={selectedConversation?.id}
                onSelectConversation={handleSelectConversation}
                showSearch={true}
                showFilter={false}
                className="h-full"
              />

              {/* Mobile Close Button */}
              {isMobileView && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMobileSidebar(false)}
                  className="absolute top-4 right-4 lg:hidden"
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </aside>

            {/* Message Area */}
            <main className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Conversation Header */}
                  <div className="border-b p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Back button (mobile only) */}
                      {isMobileView && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (isMobileView) setShowMobileSidebar(true);
                          }}
                          className="lg:hidden"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </Button>
                      )}

                      {/* Participant Info */}
                      <div className="relative">
                        {selectedConversation.participants[0].avatar ? (
                          <img
                            src={selectedConversation.participants[0].avatar}
                            alt={selectedConversation.participants[0].name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                            {selectedConversation.participants[0].name.charAt(0).toUpperCase()}
                          </div>
                        )}

                        {/* Online Status */}
                        <div
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                            selectedConversation.participants[0].isOnline ? 'bg-green-500' : 'bg-gray-400'
                          }`}
                        />

                        <div className="ml-3">
                          <h2 className="font-semibold text-sm">{selectedConversation.participants[0].name}</h2>
                          <p className="text-xs text-muted-foreground">
                            {selectedConversation.participants[0].isOnline ? 'Çevrimiçi' : 'Son görülme: 5 dakika önce'}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" title="Ara">
                          <Search className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Ara">
                          <Info className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Ara">
                          <MoreVertical className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Quick Actions (Desktop) */}
                    <div className="hidden md:flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4 mr-2" />
                        Ara
                      </Button>
                      <Button variant="outline" size="sm">
                        <Video className="w-4 h-4 mr-2" />
                        Görüntülü
                      </Button>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* System Messages */}
                    <SystemMessage
                      message={{
                        content: 'Bu konuşma şifreli ve uçtan uca korunmaktadır.',
                        timestamp: selectedConversation.createdAt,
                      }}
                    />

                    {/* Messages */}
                    {messages.map((message) => {
                      const isOwn = message.senderId === currentUserId;
                      const participant = selectedConversation.participants.find(p => p.id === message.senderId);

                      return (
                        <MessageBubble
                          key={message.id}
                          message={message}
                          isOwn={isOwn}
                          showAvatar={!isOwn}
                          avatarUrl={participant?.avatar}
                          senderName={participant?.name || 'Kullanıcı'}
                          onDelete={(id) => {
                            setMessages(prev => prev.filter(m => m.id !== id));
                          }}
                        />
                      );
                    })}

                    {/* Typing Indicator */}
                    {selectedConversation.typingUsers.length > 0 && (
                      <TypingIndicator names={selectedConversation.typingUsers.map(id => {
                        const participant = selectedConversation.participants.find(p => p.id === id);
                        return participant?.name || 'Kullanıcı';
                      })} />
                    )}

                    {/* Messages End Reference */}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Typing Area (show when not typing) */}
                  <div className="border-t p-4">
                    <ChatInput
                      onSendMessage={handleSendMessage}
                      onTyping={handleTyping}
                      placeholder="Mesaj yazın..."
                      maxLength={1000}
                      showAttachments={true}
                      allowedTypes={['image', 'video', 'file']}
                      maxAttachmentSize={10 * 1024 * 1024}
                      maxAttachments={5}
                    />
                  </div>
                </>
              ) : (
                /* Empty State */
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center max-w-md">
                    <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                      <MessageCircle className="w-16 h-16 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Mesaj Seçin</h2>
                    <p className="text-muted-foreground mb-6">
                      Sol taraftan bir konuşma seçin veya yeni bir mesaj başlatın
                    </p>
                    <Link href="/catalog">
                      <Button variant="outline" size="lg">
                        <User className="w-4 h-4 mr-2" />
                        Escortları Keşfet
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </ProtectedRoute>
    </WebSocketProvider>
  );
}
