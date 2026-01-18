import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Send, AlertCircle, CheckCircle2, X, Info,
  Shield, Clock, User, Lock, MapPin, Mic, Image,
  Video, Bell, BellOff, Ban, MoreVertical, Smile,
  FileImage, Paperclip, XCircle
} from 'lucide-react';
import {
  CHAT_RULES,
  sanitizeMessage,
  checkSpam,
  MESSAGE_RULES,
  WARNING_LEVELS
} from '@/types/notifications';

// Mesaj tipi genişletme
export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'location' | 'file';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  violations?: string[];
  type: MessageType;
  // Medya için ek alanlar
  mediaUrl?: string;
  mediaDuration?: number; // ses/video süresi (saniye)
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  fileName?: string;
  fileSize?: number;
}

export interface ChatSettings {
  muted: boolean;
  mutedUntil?: Date;
  blocked: boolean;
  blockedAt?: Date;
  notificationsEnabled: boolean;
}

interface ChatInterfaceProps {
  chatId: string;
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
  userType: 'escort' | 'customer';
  messages: Message[];
  chatSettings?: ChatSettings;
  onSendMessage: (content: string, type?: MessageType, mediaData?: any) => void;
  onBlockUser?: () => void;
  onMuteUser?: (duration?: number) => void; // duration in hours
  onReportUser?: () => void;
}

export function ChatInterface({
  chatId,
  recipientId,
  recipientName,
  recipientAvatar,
  userType,
  messages,
  chatSettings,
  onSendMessage,
  onBlockUser,
  onMuteUser,
  onReportUser
}: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState('');
  const [showRules, setShowRules] = useState(true);
  const [messageHistory, setMessageHistory] = useState<Array<{ content: string; timestamp: number }>>([]);
  const [violations, setViolations] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingTimerRef = useRef<number>();
  const rules = userType === 'escort' ? CHAT_RULES.escort : CHAT_RULES.customer;

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000) as unknown as number;
    } else {
      clearInterval(recordingTimerRef.current as unknown as number);
      setRecordingDuration(0);
    }
    return () => clearInterval(recordingTimerRef.current as unknown as number);
  }, [isRecording]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || isSending) return;

    // Check for spam
    const currentHistory = [...messageHistory, { content: newMessage, timestamp: Date.now() }];
    if (checkSpam(currentHistory)) {
      setViolations(['Spam tespit edildi. Lütfen bekleyin ve farklı bir mesaj deneyin.']);
      setTimeout(() => setViolations([]), 3000);
      return;
    }

    // Check message length
    if (newMessage.length > MESSAGE_RULES.maxLength) {
      setViolations([`Mesaj çok uzun. Maksimum ${MESSAGE_RULES.maxLength} karakter.`]);
      setTimeout(() => setViolations([]), 3000);
      return;
    }

    // Sanitize message
    const { clean, violations: foundViolations } = sanitizeMessage(newMessage);

    if (foundViolations.length > 0) {
      setViolations(foundViolations);
      setTimeout(() => setViolations([]), 5000);

      const hasCriticalViolation = foundViolations.some(v =>
        v.includes('Küfürlü dil') || v.includes('Yasak içerik')
      );

      if (hasCriticalViolation) {
        return;
      }

      setMessageHistory(currentHistory.slice(-20));
      onSendMessage(clean, 'text');
      setNewMessage('');
      return;
    }

    setMessageHistory(currentHistory.slice(-20));
    onSendMessage(clean, 'text');
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Konum gönderme
  const handleSendLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: 'Konum bilgisi' // Gerçek uygulamada reverse geocoding yapılmalı
          };
          onSendMessage(JSON.stringify(locationData), 'location', locationData);
          setShowAttachmentMenu(false);
        },
        (error) => {
          console.error('Konum alınamadı:', error);
          alert('Konum alınamadı. Lütfen konum izinlerini kontrol edin.');
        }
      );
    } else {
      alert('Tarayıcınız konum özelliğini desteklemiyor.');
    }
  };

  // Resim gönderme
  const handleSendImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Gerçek uygulamada buraya upload edilmeli
        const reader = new FileReader();
        reader.onload = (event) => {
          onSendMessage('', 'image', {
            url: event.target?.result,
            fileName: file.name,
            fileSize: file.size
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
    setShowAttachmentMenu(false);
  };

  // Video gönderme
  const handleSendVideo = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          onSendMessage('', 'video', {
            url: event.target?.result,
            fileName: file.name,
            fileSize: file.size
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
    setShowAttachmentMenu(false);
  };

  // Ses kaydetme
  const handleToggleRecording = () => {
    if (isRecording) {
      // Kaydı durdur ve gönder
      setIsRecording(false);
      // Gerçek uygulamada burada ses kaydı alınıp gönderilmeli
      onSendMessage('Ses mesajı (demo)', 'audio', { duration: recordingDuration });
    } else {
      // Kayda başla
      setIsRecording(true);
      setRecordingDuration(0);
    }
  };

  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100 border-red-300';
      case 'medium': return 'text-orange-600 bg-orange-100 border-orange-300';
      case 'low': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  // Render message based on type
  const renderMessage = (message: Message) => {
    if (message.type === 'location' && message.location) {
      return (
        <div className="flex items-center gap-3">
          <MapPin className="w-8 h-8 text-red-500 shrink-0" />
          <div>
            <p className="font-semibold">Konum Paylaşıldı</p>
            <p className="text-xs text-muted-foreground">{message.location.address}</p>
          </div>
        </div>
      );
    }

    if (message.type === 'image') {
      return (
        <div>
          {message.mediaUrl && (
            <img
              src={message.mediaUrl}
              alt="Gönderilen resim"
              className="max-w-full rounded-lg mb-2"
            />
          )}
          {message.fileName && (
            <p className="text-xs opacity-70">{message.fileName}</p>
          )}
        </div>
      );
    }

    if (message.type === 'video') {
      return (
        <div>
          {message.mediaUrl && (
            <video
              src={message.mediaUrl}
              controls
              className="max-w-full rounded-lg mb-2"
            />
          )}
          {message.fileName && (
            <p className="text-xs opacity-70">{message.fileName}</p>
          )}
        </div>
      );
    }

    if (message.type === 'audio') {
      return (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Mic className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="h-8 bg-primary/10 rounded-full flex items-center px-3">
              <div className="w-full h-1 bg-primary/30 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-primary"></div>
              </div>
            </div>
            <p className="text-xs opacity-60 mt-1">
              {message.mediaDuration ? formatTime(message.mediaDuration) : '0:00'}
            </p>
          </div>
        </div>
      );
    }

    // Default text message
    return <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {/* Chat Header */}
      <div className="p-4 border-b bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                {recipientAvatar ? (
                  <img src={recipientAvatar} alt={recipientName} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-primary" />
                )}
              </div>
              {chatSettings?.muted && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                  <BellOff className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold flex items-center gap-2">
                {recipientName}
                {chatSettings?.blocked && (
                  <Badge variant="destructive" className="text-xs">Engellendi</Badge>
                )}
              </h3>
              <p className="text-xs text-muted-foreground capitalize">
                {userType}
                {chatSettings?.muted && ' • Sessize alındı'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRules(!showRules)}
            >
              <Shield className="w-4 h-4 mr-2" />
              Kurallar
            </Button>

            {/* Settings Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              >
                <MoreVertical className="w-5 h-5" />
              </Button>

              <AnimatePresence>
                {showSettingsMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-12 w-56 bg-background border rounded-lg shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          onMuteUser?.(chatSettings?.muted ? 0 : 24); // Toggle mute (24 hours)
                          setShowSettingsMenu(false);
                        }}
                      >
                        {chatSettings?.muted ? (
                          <>
                            <Bell className="w-4 h-4 mr-2" />
                            Sesi Aç
                          </>
                        ) : (
                          <>
                            <BellOff className="w-4 h-4 mr-2" />
                            24 Saat Sessize Al
                          </>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700"
                        onClick={() => {
                          onBlockUser?.();
                          setShowSettingsMenu(false);
                        }}
                      >
                        <Ban className="w-4 h-4 mr-2" />
                        {chatSettings?.blocked ? 'Engeli Kaldır' : 'Engelle'}
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          onReportUser?.();
                          setShowSettingsMenu(false);
                        }}
                      >
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Bildir
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Rules Warning */}
      <AnimatePresence>
        {showRules && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b bg-amber-500/5 border-amber-500/20"
          >
            <div className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-bold text-amber-700 dark:text-amber-400 mb-1">
                    {rules.title}
                  </h4>
                  <p className="text-sm text-amber-600 dark:text-amber-300">
                    {rules.warningMessage}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={() => setShowRules(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {rules.rules.slice(0, showRules ? undefined : 0).map((rule) => (
                  <div
                    key={rule.id}
                    className={`p-3 rounded-lg border ${getSeverityColor(rule.severity)} text-xs`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span>{rule.icon}</span>
                      <span className="font-bold">{rule.title}</span>
                    </div>
                    <p className="opacity-90">{rule.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-700 dark:text-blue-300">
                    <p className="font-semibold mb-1">Önemli Bilgiler:</p>
                    <ul className="space-y-1 opacity-90">
                      <li>• Telefon numarası veya e-posta paylaşımı yasaktır</li>
                      <li>• Tüm mesajlar kayıt altına alınır</li>
                      <li>• Kural ihlali hesap askıya almaya neden olabilir</li>
                      <li>• Müşteriler/escortlar birbirlerini korunmalıdır</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blocked User Message */}
      {chatSettings?.blocked && (
        <div className="p-4 bg-red-500/10 border-b border-red-500/20">
          <div className="flex items-center gap-3">
            <Ban className="w-5 h-5 text-red-500" />
            <div className="text-sm">
              <p className="font-semibold text-red-700 dark:text-red-400">
                Bu kullanıcıyı engellediniz
              </p>
              <p className="text-red-600 dark:text-red-300">
                Engellemeyi kaldırmak için ayarlar menüsünü kullanın.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Violations Warning */}
      <AnimatePresence>
        {violations.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b bg-red-500/10 border-red-500/30"
          >
            <div className="p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-red-700 dark:text-red-400 text-sm">
                    Mesajınız İçeren Uyarılar:
                  </p>
                  <ul className="text-sm text-red-600 dark:text-red-300 mt-1 space-y-1">
                    {violations.map((v, i) => (
                      <li key={i}>• {v}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/10">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">Henüz mesaj yok</p>
              <p className="text-sm">İlk mesajı siz gönderin</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.senderId === recipientId ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    message.senderId === recipientId
                      ? 'bg-muted text-foreground'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  {message.senderId === recipientId && (
                    <p className="text-xs font-semibold mb-1 opacity-70">{message.senderName}</p>
                  )}
                  {renderMessage(message)}
                  <div className="flex items-center justify-end gap-2 mt-1">
                    <p className="text-xs opacity-60">
                      {new Date(message.timestamp).toLocaleTimeString('tr-TR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    {message.senderId !== recipientId && (
                      <>
                        {message.isRead ? (
                          <CheckCircle2 className="w-3 h-3 opacity-60" />
                        ) : (
                          <Clock className="w-3 h-3 opacity-60" />
                        )}
                      </>
                    )}
                  </div>
                  {message.violations && message.violations.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-white/20">
                      <p className="text-xs opacity-80">⚠️ İçerik sansürlendi</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-background">
        <div className="flex items-end gap-2">
          {/* Attachment Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              disabled={chatSettings?.blocked}
            >
              <Paperclip className="w-5 h-5" />
            </Button>

            <AnimatePresence>
              {showAttachmentMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-12 left-0 bg-background border rounded-lg shadow-xl z-50 overflow-hidden"
                >
                  <div className="p-2 space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={handleSendImage}
                    >
                      <Image className="w-4 h-4 mr-2" />
                      Resim Gönder
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={handleSendVideo}
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Video Gönder
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={handleSendLocation}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Konum Gönder
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Text Input */}
          <div className="flex-1">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Mesajınızı yazın... (Shift+Enter için alt satır)"
              className="min-h-[60px] max-h-[200px] resize-none"
              maxLength={MESSAGE_RULES.maxLength}
              disabled={chatSettings?.blocked}
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                {newMessage.length} / {MESSAGE_RULES.maxLength}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <Lock className="w-3 h-3 mr-1" />
                  Şifreli
                </Badge>
              </div>
            </div>
          </div>

          {/* Audio Recording Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleRecording}
            disabled={chatSettings?.blocked}
            className={isRecording ? 'bg-red-500 hover:bg-red-600 text-white' : ''}
          >
            {isRecording ? (
              <div className="text-center">
                <XCircle className="w-5 h-5" />
                <p className="text-xs mt-1">{formatTime(recordingDuration)}</p>
              </div>
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </Button>

          {/* Send Button */}
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending || chatSettings?.blocked}
            size="icon"
            className="h-[60px] w-[60px] shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>

        {/* Quick Tips */}
        <div className="mt-3 p-3 bg-muted/20 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>İpucu:</strong> Nazik ve kibar olun. Detayları randevu öncesinde konuşun.
          </p>
        </div>
      </div>
    </div>
  );
}

// Chat Rules Modal Component
export function ChatRulesModal({ userType, onClose }: { userType: 'escort' | 'customer'; onClose: () => void }) {
  const rules = userType === 'escort' ? CHAT_RULES.escort : CHAT_RULES.customer;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-background rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
      >
        <div className="p-6 border-b bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold">{rules.title}</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">{rules.warningMessage}</p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-4">
            {rules.rules.map((rule) => (
              <Card key={rule.id} className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{rule.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold">{rule.title}</h4>
                        <Badge
                          variant="outline"
                          className={
                            rule.severity === 'high'
                              ? 'border-red-500 text-red-500'
                              : rule.severity === 'medium'
                              ? 'border-orange-500 text-orange-500'
                              : 'border-yellow-500 text-yellow-500'
                          }
                        >
                          {rule.severity === 'high' ? 'Ciddi' : rule.severity === 'medium' ? 'Orta' : 'Hafif'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{rule.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Sonuç: <span className="font-semibold">{rule.violationAction}</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-semibold mb-2">Güvenli İletişim İpuçları:</p>
                <ul className="space-y-1">
                  <li>• Ödeme bilgilerinizi asla paylaşmayın</li>
                  <li>• Kişisel bilgilerinizi koruyun</li>
                  <li>• Uygunsuz içeriklerden kaçının</li>
                  <li>• Diğer tarafı saygıyla treatedin</li>
                  <li>• Şüpheli davranışı bildirin</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-muted/20">
          <Button className="w-full" onClick={onClose}>
            Anladım, Kuralları Kabul Ediyorum
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// Block/Mute Confirmation Modal
export function BlockUserModal({
  userName,
  action,
  onConfirm,
  onCancel
}: {
  userName: string;
  action: 'block' | 'mute';
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-background rounded-xl max-w-md w-full p-6"
      >
        <div className="text-center mb-6">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            action === 'block' ? 'bg-red-500/20' : 'bg-amber-500/20'
          }`}>
            {action === 'block' ? (
              <Ban className="w-8 h-8 text-red-500" />
            ) : (
              <BellOff className="w-8 h-8 text-amber-500" />
            )}
          </div>
          <h3 className="text-xl font-bold mb-2">
            {action === 'block' ? 'Kullanıcıyı Engelle' : 'Kullanıcıyı Sessize Al'}
          </h3>
          <p className="text-muted-foreground">
            {action === 'block'
              ? `${userName} kullanıcısını engellemek istediğinizden emin misiniz? Bu kullanıcı size artık mesaj gönderemez.`
              : `${userName} kullanıcısını 24 saat sessize almak istediğinizden emin misiniz?`}
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            İptal
          </Button>
          <Button
            variant={action === 'block' ? 'destructive' : 'default'}
            className="flex-1"
            onClick={onConfirm}
          >
            {action === 'block' ? 'Engelle' : 'Sessize Al'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
