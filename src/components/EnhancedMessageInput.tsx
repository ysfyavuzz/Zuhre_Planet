/**
 * Enhanced Message Input Component
 *
 * Gelişmiş mesaj giriş alanı.
 * Auto-resize, emoji picker, dosya ekleme ve typing indicator desteği.
 *
 * @module components/EnhancedMessageInput
 * @category Components - Chat
 *
 * Features:
 * - Auto-resize textarea
 * - Emoji picker entegrasyonu
 * - Dosya ekleme butonu
 * - Ses kaydı butonu (opsiyonel)
 * - Typing indicator tetikleme
 * - Enter ile gönderme (Shift+Enter yeni satır)
 * - Karakter limiti göstergesi
 * - Attachment preview
 * - Responsive tasarım
 * - Dark mode uyumlu
 *
 * @example
 * ```tsx
 * <EnhancedMessageInput
 *   onSend={(content, attachments) => console.log(content)}
 *   onTyping={(isTyping) => console.log('Typing:', isTyping)}
 *   placeholder="Mesajınızı yazın..."
 * />
 * ```
 */

import { useState, useRef, useCallback, KeyboardEvent, ChangeEvent, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Send,
  Paperclip,
  Smile,
  Mic,
  X,
  Image as ImageIcon,
  FileText,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface MessageAttachment {
  id: string;
  file: File;
  preview?: string;
  type: 'image' | 'video' | 'audio' | 'file';
}

export interface EnhancedMessageInputProps {
  /**
   * Mesaj gönderildiğinde callback
   */
  onSend: (content: string, attachments?: MessageAttachment[]) => void;

  /**
   * Typing durumu değiştiğinde callback
   */
  onTyping?: (isTyping: boolean) => void;

  /**
   * Placeholder metni
   */
  placeholder?: string;

  /**
   * Maksimum karakter sayısı
   */
  maxLength?: number;

  /**
   * Dosya ekleme aktif mi?
   */
  enableAttachments?: boolean;

  /**
   * Emoji picker aktif mi?
   */
  enableEmoji?: boolean;

  /**
   * Ses kaydı aktif mi?
   */
  enableVoice?: boolean;

  /**
   * Ek CSS sınıfları
   */
  className?: string;

  /**
   * Disabled durumu
   */
  disabled?: boolean;

  /**
   * Auto-focus
   */
  autoFocus?: boolean;
}

/**
 * EnhancedMessageInput Component
 *
 * Gelişmiş mesaj input alanı.
 */
export function EnhancedMessageInput({
  onSend,
  onTyping,
  placeholder = 'Mesajınızı yazın...',
  maxLength = 4000,
  enableAttachments = true,
  enableEmoji = true,
  enableVoice = false,
  className,
  disabled = false,
  autoFocus = false,
}: EnhancedMessageInputProps) {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  /**
   * Handle typing indicator
   */
  const handleTypingStart = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true);
      onTyping?.(true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing after 3 seconds
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onTyping?.(false);
    }, 3000);
  }, [isTyping, onTyping]);

  /**
   * Handle content change
   */
  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    
    // Enforce max length
    if (newContent.length <= maxLength) {
      setContent(newContent);
      
      // Trigger typing indicator
      if (newContent.length > 0) {
        handleTypingStart();
      }
    }
  }, [maxLength, handleTypingStart]);

  /**
   * Handle send message
   */
  const handleSend = useCallback(() => {
    const trimmedContent = content.trim();
    
    if (trimmedContent.length === 0 && attachments.length === 0) {
      return;
    }

    // Send message
    onSend(trimmedContent, attachments.length > 0 ? attachments : undefined);

    // Clear input
    setContent('');
    setAttachments([]);

    // Stop typing indicator
    setIsTyping(false);
    onTyping?.(false);

    // Clear timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Focus back on textarea
    textareaRef.current?.focus();
  }, [content, attachments, onSend, onTyping]);

  /**
   * Handle key press
   */
  const handleKeyPress = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter to send (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  /**
   * Handle file selection
   */
  const handleFileSelect = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const newAttachments: MessageAttachment[] = files.map(file => {
      const id = `${Date.now()}-${Math.random()}`;
      let type: MessageAttachment['type'] = 'file';
      
      if (file.type.startsWith('image/')) {
        type = 'image';
      } else if (file.type.startsWith('video/')) {
        type = 'video';
      } else if (file.type.startsWith('audio/')) {
        type = 'audio';
      }

      // Create preview for images
      let preview: string | undefined;
      if (type === 'image') {
        preview = URL.createObjectURL(file);
      }

      return {
        id,
        file,
        preview,
        type,
      };
    });

    setAttachments(prev => [...prev, ...newAttachments]);

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  /**
   * Remove attachment
   */
  const removeAttachment = useCallback((id: string) => {
    setAttachments(prev => {
      const attachment = prev.find(a => a.id === id);
      if (attachment?.preview) {
        URL.revokeObjectURL(attachment.preview);
      }
      return prev.filter(a => a.id !== id);
    });
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Revoke object URLs
      attachments.forEach(attachment => {
        if (attachment.preview) {
          URL.revokeObjectURL(attachment.preview);
        }
      });
    };
  }, [attachments]);

  const canSend = content.trim().length > 0 || attachments.length > 0;
  const charCount = content.length;
  const showCharCount = charCount > maxLength * 0.8;

  return (
    <div className={cn('flex flex-col gap-2 p-3 bg-background border-t', className)}>
      {/* Attachments preview */}
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex flex-wrap gap-2 overflow-hidden"
          >
            {attachments.map(attachment => (
              <motion.div
                key={attachment.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="relative group"
              >
                {/* Image preview */}
                {attachment.type === 'image' && attachment.preview && (
                  <div className="relative h-20 w-20 rounded-lg overflow-hidden border-2 border-border">
                    <img
                      src={attachment.preview}
                      alt={attachment.file.name}
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={() => removeAttachment(attachment.id)}
                      className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                      type="button"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* File preview */}
                {attachment.type !== 'image' && (
                  <div className="relative h-20 w-32 rounded-lg border-2 border-border bg-muted flex flex-col items-center justify-center p-2">
                    <FileText size={24} className="text-muted-foreground mb-1" />
                    <p className="text-xs text-muted-foreground truncate w-full text-center">
                      {attachment.file.name}
                    </p>
                    <button
                      onClick={() => removeAttachment(attachment.id)}
                      className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                      type="button"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div className="flex items-end gap-2">
        {/* Attachment button */}
        {enableAttachments && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="shrink-0"
            >
              <Paperclip size={20} />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
            />
          </>
        )}

        {/* Emoji button */}
        {enableEmoji && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={disabled}
            className="shrink-0"
            onClick={() => {
              // TODO: Open emoji picker
              console.log('Emoji picker not implemented yet');
            }}
          >
            <Smile size={20} />
          </Button>
        )}

        {/* Text input */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus={autoFocus}
            className="min-h-[44px] max-h-32 resize-none pr-12"
            rows={1}
          />
          
          {/* Character count */}
          {showCharCount && (
            <div className={cn(
              'absolute bottom-2 right-2 text-xs',
              charCount >= maxLength ? 'text-red-500' : 'text-muted-foreground'
            )}>
              {charCount}/{maxLength}
            </div>
          )}
        </div>

        {/* Voice button */}
        {enableVoice && !canSend && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={disabled}
            className="shrink-0"
            onClick={() => {
              // TODO: Start voice recording
              console.log('Voice recording not implemented yet');
            }}
          >
            <Mic size={20} />
          </Button>
        )}

        {/* Send button */}
        {canSend && (
          <Button
            type="button"
            onClick={handleSend}
            disabled={disabled}
            size="icon"
            className="shrink-0"
          >
            <Send size={20} />
          </Button>
        )}
      </div>

      {/* Helper text */}
      <p className="text-xs text-muted-foreground">
        <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">Enter</kbd> gönder,{' '}
        <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">Shift+Enter</kbd> yeni satır
      </p>
    </div>
  );
}
