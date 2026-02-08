/**
 * Admin Messages Page
 *
 * Admin mesaj yönetimi ve moderasyon sayfası.
 * Super Admin için tüm mesajları okuma, inceleme ve yönetme özellikleri.
 *
 * @module pages/AdminMessages
 * @category Pages - Admin
 *
 * Features:
 * - Tüm mesajları görüntüleme (Super Admin)
 * - Okunmuş/okunmamış filtreleme
 * - Mesaj türüne göre filtreleme (sorgu, şikayet, destek)
 * - Konuşma detaylarını görüntüleme
 * - Mesaj silme
 * - Yanıt gönderme
 * - Okundu işaretleme
 *
 * Message Types:
 * - inquiry: Randevu ve hizmet sorguları
 * - complaint: Kullanıcı şikayetleri
 * - support: Destek talepleri
 * - chat: Genel sohbet mesajları
 *
 * Permission Requirements:
 * - canViewAllMessages: Tüm mesajları görüntüleme
 * - canModerateMessages: Mesaj silme ve düzenleme
 * - isSuperAdmin: Sınırsız erişim
 *
 * @example
 * ```tsx
 * // Route: /admin/messages
 * <AdminMessages />
 * ```
 */

import * as React from 'react';
import { AdminSidebar } from '@/components/admin';
import { Search, Filter, Eye, Trash2, AlertCircle, MessageSquare, Reply, ChevronDown, UserCircle, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  conversationId: string;
  from: string;
  fromId: string;
  to: string;
  toId: string;
  subject: string;
  content: string;
  timestamp: string;
  status: 'read' | 'unread';
  type: 'inquiry' | 'complaint' | 'support' | 'chat';
  messages: ChatMessage[];
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export default function AdminMessages() {
  const { user, isSuperAdmin, permissions } = useAuth();
  const [filter, setFilter] = React.useState<'all' | 'unread' | 'inquiry' | 'complaint'>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedConversation, setSelectedConversation] = React.useState<Message | null>(null);
  const [showFullDetails, setShowFullDetails] = React.useState(false);

  // Mock conversations - en güncelden en eskiye
  const conversations: Message[] = [
    {
      id: 'conv-1',
      conversationId: 'conv-1',
      from: 'Ahmet Yılmaz',
      fromId: 'user-1',
      to: 'Ayşe Demir',
      toId: 'escort-1',
      subject: 'Randevu talebi',
      content: 'Bu hafta sonu müsait misiniz?',
      timestamp: '2024-01-15T10:30:00',
      status: 'unread',
      type: 'inquiry',
      messages: [
        { id: 'm1', senderId: 'user-1', senderName: 'Ahmet Yılmaz', content: 'Merhaba, bu hafta sonu müsait misiniz?', timestamp: '2024-01-15T10:28:00', read: true },
        { id: 'm2', senderId: 'escort-1', senderName: 'Ayşe Demir', content: 'Merhaba! Evet, Cumartesi akşam 19:00 gibi müsaitim.', timestamp: '2024-01-15T10:30:00', read: true },
        { id: 'm3', senderId: 'user-1', senderName: 'Ahmet Yılmaz', content: 'Harika! O zaman randevu oluşturabilir misiniz?', timestamp: '2024-01-15T10:32:00', read: false },
      ]
    },
    {
      id: 'conv-2',
      conversationId: 'conv-2',
      from: 'Mehmet Kaya',
      fromId: 'user-2',
      to: 'Admin',
      toId: 'admin-1',
      subject: 'Şikayet: İlan #123',
      content: 'İlan bilgileri yanlış',
      timestamp: '2024-01-15T09:15:00',
      status: 'read',
      type: 'complaint',
      messages: [
        { id: 'm4', senderId: 'user-2', senderName: 'Mehmet Kaya', content: 'Merhaba, İlan #123\'deki telefon numarası yanlış. Lütfen düzeltin.', timestamp: '2024-01-15T09:15:00', read: true },
        { id: 'm5', senderId: 'admin-1', senderName: 'Admin', content: 'Şikayetiniz için teşekkürler. İlanı inceliyoruz.', timestamp: '2024-01-15T09:20:00', read: true },
      ]
    },
    {
      id: 'conv-3',
      conversationId: 'conv-3',
      from: 'Zeynep Aksoy',
      fromId: 'user-3',
      to: 'Fatma Yıldız',
      toId: 'escort-2',
      subject: 'Hizmet detayları',
      content: 'Hangi hizmetleri sunuyorsunuz?',
      timestamp: '2024-01-14T16:45:00',
      status: 'read',
      type: 'inquiry',
      messages: [
        { id: 'm6', senderId: 'user-3', senderName: 'Zeynep Aksoy', content: 'Merhaba, hangi hizmetleri sunuyorsunuz?', timestamp: '2024-01-14T16:45:00', read: true },
        { id: 'm7', senderId: 'escort-2', senderName: 'Fatma Yıldız', content: 'Merhaba, profilimde tüm hizmetlerimi detaylıca açıkladım. Sorunuz varsa cevaplayabilirim.', timestamp: '2024-01-14T17:00:00', read: true },
      ]
    },
    {
      id: 'conv-4',
      conversationId: 'conv-4',
      from: 'Can Yılmaz',
      fromId: 'user-4',
      to: 'Admin',
      toId: 'admin-1',
      subject: 'Destek talebi',
      content: 'Para yatıramıyorum',
      timestamp: '2024-01-13T14:20:00',
      status: 'unread',
      type: 'support',
      messages: [
        { id: 'm8', senderId: 'user-4', senderName: 'Can Yılmaz', content: 'Merhaba, kredi kartı ile para yatırmaya çalışıyorum ama hata alıyorum.', timestamp: '2024-01-13T14:20:00', read: false },
      ]
    },
  ];

  const filteredConversations = conversations.filter(m => {
    const matchesFilter = filter === 'all' ||
      filter === 'unread' ? m.status === 'unread' :
      filter === m.type;
    const matchesSearch = searchQuery === '' ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.to.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const canViewAllMessages = isSuperAdmin || permissions?.canViewAllMessages;
  const canModerateMessages = isSuperAdmin || permissions?.canModerateMessages;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Mesaj Yönetimi</h1>
                <p className="text-gray-500 mt-1">Kullanıcı mesajlarını görüntüleyin ve yönetin</p>
              </div>
              {isSuperAdmin && (
                <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-3 py-1">
                  <Shield className="w-4 h-4 mr-1" />
                  Super Admin
                </Badge>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6">
              <p className="text-sm text-gray-500">Toplam Mesaj</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{conversations.length}</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-gray-500">Okunmamış</p>
              <p className="text-2xl font-bold text-sky-600 mt-1">
                {conversations.filter(m => m.status === 'unread').length}
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-gray-500">Sorgular</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {conversations.filter(m => m.type === 'inquiry').length}
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-gray-500">Şikayetler</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {conversations.filter(m => m.type === 'complaint').length}
              </p>
            </Card>
          </div>

          {/* Super Admin Alert */}
          {isSuperAdmin && (
            <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-semibold text-blue-900">Sınırsız Erişim</p>
                    <p className="text-sm text-blue-700">
                      Tüm mesajları okuyabilir, silebilir ve moderasyon yapabilirsiniz.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search & Filters */}
          <Card className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Mesaj ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">Tümü</option>
                <option value="unread">Okunmamış</option>
                <option value="inquiry">Sorgular</option>
                <option value="complaint">Şikayetler</option>
              </select>
            </div>
          </Card>

          {/* Messages List */}
          <div className="space-y-4">
            <AnimatePresence>
              {filteredConversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                      selectedConversation?.id === conversation.id ? 'ring-2 ring-pink-500' : ''
                    }`}
                    onClick={() => {
                      if (canViewAllMessages) {
                        setSelectedConversation(
                          selectedConversation?.id === conversation.id ? null : conversation
                        );
                      }
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <MessageSquare className="w-5 h-5 text-pink-600" />
                          <h3 className="font-semibold text-gray-900">{conversation.subject}</h3>
                          <Badge
                            variant={conversation.status === 'unread' ? 'default' : 'secondary'}
                            className={conversation.status === 'unread' ? 'bg-orange-500' : ''}
                          >
                            {conversation.status === 'unread' ? 'Okunmamış' : 'Okunmuş'}
                          </Badge>
                          <Badge variant="outline">{conversation.type}</Badge>
                          {canViewAllMessages && (
                            <Badge variant="outline" className="text-xs">
                              {conversation.messages.length} mesaj
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium flex items-center gap-1">
                            <UserCircle className="w-4 h-4" />
                            {conversation.from}
                          </span>
                          <span className="mx-2">→</span>
                          <span className="font-medium flex items-center gap-1">
                            <UserCircle className="w-4 h-4" />
                            {conversation.to}
                          </span>
                        </p>
                        <p className="text-gray-700 line-clamp-2">{conversation.content}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(conversation.timestamp).toLocaleString('tr-TR')}
                        </p>

                        {/* Last message preview for super admin */}
                        {canViewAllMessages && conversation.messages.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">Son mesaj:</p>
                            <p className="text-sm text-gray-700 italic">
                              {conversation.messages[conversation.messages.length - 1].content}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {canViewAllMessages && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedConversation(
                                selectedConversation?.id === conversation.id ? null : conversation
                              );
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        {canModerateMessages && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>

                  {/* Expanded Conversation Details */}
                  <AnimatePresence>
                    {selectedConversation?.id === conversation.id && canViewAllMessages && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <Card className="mt-4 border-l-4 border-l-pink-500">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-semibold text-gray-900">
                                Konuşma Detayları
                              </h4>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedConversation(null)}
                              >
                                Kapat
                              </Button>
                            </div>

                            {/* Messages Timeline */}
                            <div className="space-y-4">
                              {selectedConversation.messages.map((msg) => (
                                <motion.div
                                  key={msg.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className={`flex ${
                                    msg.senderId === selectedConversation.fromId
                                      ? 'justify-start'
                                      : 'justify-end'
                                  }`}
                                >
                                  <div
                                    className={`max-w-[70%] rounded-lg px-4 py-3 ${
                                      msg.senderId === selectedConversation.fromId
                                        ? 'bg-blue-50 text-left'
                                        : 'bg-pink-50 text-right'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-sm font-medium">
                                        {msg.senderName}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {new Date(msg.timestamp).toLocaleString('tr-TR')}
                                      </span>
                                    </div>
                                    <p className="text-sm">{msg.content}</p>
                                    {!msg.read && msg.senderId !== selectedConversation.toId && (
                                      <Badge className="mt-1" variant="secondary">Okunmadı</Badge>
                                    )}
                                  </div>
                                </motion.div>
                              ))}
                            </div>

                            {/* Quick Actions */}
                            {isSuperAdmin && (
                              <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  <Reply className="w-4 h-4 mr-1" />
                                  Yanıtla
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4 mr-1" />
                                  Okundu İşaretle
                                </Button>
                                <Button size="sm" variant="destructive">
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Konuşmayı Sil
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredConversations.length === 0 && (
              <Card className="p-12 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Mesaj bulunamadı</p>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
