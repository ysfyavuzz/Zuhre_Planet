import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { trpc } from '../lib/trpc';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
  MessageCircle, Send, Image as ImageIcon, Smile, MoreVertical,
  Search, ArrowLeft, Check, CheckCheck, Circle, Phone, Video,
  Info, Archive, Trash2, Ban, Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function Messages() {
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: user } = trpc.auth.me.useQuery();
  const { data: conversations = [] } = trpc.messages.listConversations.useQuery(
    undefined,
    { enabled: !!user }
  );

  const { data: messages = [] } = trpc.messages.getMessages.useQuery(
    { conversationId: selectedConversationId! },
    { enabled: !!selectedConversationId, refetchInterval: 3000 }
  );

  const sendMessageMutation = trpc.messages.sendMessage.useMutation({
    onSuccess: () => {
      setMessageText('');
      scrollToBottom();
    },
  });

  const markAsReadMutation = trpc.messages.markAsRead.useMutation();

  useEffect(() => {
    if (selectedConversationId) {
      markAsReadMutation.mutate({ conversationId: selectedConversationId });
    }
  }, [selectedConversationId, messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversationId) return;
    
    sendMessageMutation.mutate({
      conversationId: selectedConversationId,
      content: messageText,
      messageType: 'text',
    });
  };

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  const filteredConversations = conversations.filter(conv => {
    const otherUser = conv.otherUser;
    return otherUser.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           otherUser.displayName?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="card-premium p-12 text-center max-w-md">
          <MessageCircle className="w-20 h-20 mx-auto mb-6 text-muted-foreground/30" />
          <h3 className="text-2xl font-bold mb-3">Giriş Yapın</h3>
          <p className="text-muted-foreground mb-6">
            Mesajlaşma özelliğini kullanmak için giriş yapmalısınız.
          </p>
          <Button className="w-full bg-gradient-to-r from-primary to-accent">
            Giriş Yap
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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
                <p className="text-sm text-muted-foreground">
                  {conversations.length} sohbet
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
          {/* Conversations List */}
          <Card className="card-premium lg:col-span-1 flex flex-col">
            <CardHeader className="pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Sohbet ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            
            <Separator />
            
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length > 0 ? (
                <div className="divide-y divide-border/50">
                  {filteredConversations.map((conversation) => {
                    const otherUser = conversation.otherUser;
                    const isSelected = selectedConversationId === conversation.id;
                    const unreadCount = user.role === 'escort' 
                      ? conversation.unreadCountEscort 
                      : conversation.unreadCountCustomer;

                    return (
                      <button
                        key={conversation.id}
                        onClick={() => setSelectedConversationId(conversation.id)}
                        className={`w-full p-4 text-left transition-colors hover:bg-muted/50 ${
                          isSelected ? 'bg-muted/50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Avatar */}
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-bold text-lg">
                              {(otherUser.displayName || otherUser.name || 'U')[0].toUpperCase()}
                            </div>
                            {/* Online indicator */}
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold truncate">
                                {otherUser.displayName || otherUser.name || 'Kullanıcı'}
                              </h3>
                              <span className="text-xs text-muted-foreground">
                                {conversation.lastMessageAt && formatDistanceToNow(
                                  new Date(conversation.lastMessageAt),
                                  { addSuffix: true, locale: tr }
                                )}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm text-muted-foreground truncate flex-1">
                                {conversation.lastMessageText || 'Henüz mesaj yok'}
                              </p>
                              {unreadCount > 0 && (
                                <Badge className="bg-primary text-primary-foreground px-2 py-0 text-xs">
                                  {unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <MessageCircle className="w-16 h-16 text-muted-foreground/30 mb-4" />
                  <h3 className="font-semibold mb-2">Sohbet Bulunamadı</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? 'Arama kriterlerinize uygun sohbet bulunamadı' : 'Henüz sohbetiniz yok'}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Chat Area */}
          <Card className="card-premium lg:col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-bold">
                          {(selectedConversation.otherUser.displayName || selectedConversation.otherUser.name || 'U')[0].toUpperCase()}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                      </div>
                      <div>
                        <h3 className="font-bold">
                          {selectedConversation.otherUser.displayName || selectedConversation.otherUser.name || 'Kullanıcı'}
                        </h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                          Çevrimiçi
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Phone className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Video className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Info className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <Separator />

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.length > 0 ? (
                    <>
                      {messages.map((message) => {
                        const isOwn = message.senderId === user.id;
                        
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                              <div
                                className={`rounded-2xl px-4 py-2 ${
                                  isOwn
                                    ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
                                    : 'bg-muted'
                                }`}
                              >
                                {message.messageType === 'text' && (
                                  <p className="text-sm break-words">{message.content}</p>
                                )}
                                {message.messageType === 'photo' && message.photoUrl && (
                                  <img
                                    src={message.photoUrl}
                                    alt="Shared"
                                    className="rounded-lg max-w-full"
                                  />
                                )}
                              </div>
                              <div className={`flex items-center gap-1 mt-1 px-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(message.createdAt).toLocaleTimeString('tr-TR', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                                {isOwn && (
                                  message.isRead ? (
                                    <CheckCheck className="w-3 h-3 text-blue-500" />
                                  ) : (
                                    <Check className="w-3 h-3 text-muted-foreground" />
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <MessageCircle className="w-16 h-16 text-muted-foreground/30 mb-4" />
                      <h3 className="font-semibold mb-2">Sohbet Başlatın</h3>
                      <p className="text-sm text-muted-foreground">
                        İlk mesajı göndererek sohbeti başlatın
                      </p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Message Input */}
                <div className="p-4">
                  <div className="flex items-end gap-2">
                    <Button variant="ghost" size="icon" className="mb-1">
                      <ImageIcon className="w-5 h-5" />
                    </Button>
                    
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Mesajınızı yazın..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="pr-10 min-h-[44px]"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 bottom-1"
                      >
                        <Smile className="w-5 h-5" />
                      </Button>
                    </div>

                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim() || sendMessageMutation.isLoading}
                      className="bg-gradient-to-r from-primary to-accent"
                      size="icon"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 px-2">
                    Enter ile gönder, Shift+Enter ile yeni satır
                  </p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <MessageCircle className="w-20 h-20 text-muted-foreground/30 mb-6" />
                <h3 className="text-2xl font-bold mb-3">Mesajlaşmaya Başlayın</h3>
                <p className="text-muted-foreground max-w-md">
                  Soldaki listeden bir sohbet seçin veya yeni bir sohbet başlatmak için bir escort profili ziyaret edin.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
