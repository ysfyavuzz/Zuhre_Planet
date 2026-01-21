/**
 * ChatInput Component
 *
 * Message input component with attachment support, emoji picker, and send button.
 * Handles text input, file uploads, and message sending.
 *
 * @module components/ChatInput
 * @category Components - Messaging
 *
 * Features:
 * - Text input with auto-resize
 * - File attachment (image, video, document)
 * - Emoji picker button
 * - Send button
 * - Character limit indicator
 * - Voice message recording (future)
 * - GIF picker integration (future)
 * - Typing indicator auto-send
 *
 * @example
 * ```tsx
 * <ChatInput
 *   onSendMessage={handleSend}
 *   onTyping={handleTyping}
 *   disabled={false}
 *   placeholder="Mesaj yazın..."
 *   maxLength={1000}
 * />
 * ```
 */

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Send, Paperclip, Smile, X, Image as ImageIcon,
  Video, File, Mic, MicOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Attachment type
 */
export type AttachmentType = 'image' | 'video' | 'file';

/**
 * Attachment interface
 */
export interface ChatAttachment {
  file: File;
  type: AttachmentType;
  preview: string;
  id: string;
}

/**
 * Props for ChatInput component
 */
export interface ChatInputProps {
  /**
   * Send message handler
   */
  onSendMessage: (content: string, attachments?: ChatAttachment[]) => void | Promise<void>;
  /**
   * Typing indicator handler
   */
  onTyping?: (isTyping: boolean) => void;
  /**
   * Disabled state
   */
  disabled?: boolean;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Max character length
   */
  maxLength?: number;
  /**
   * Show attachment button
   */
  showAttachments?: boolean;
  /**
   * Allowed attachment types
   */
  allowedTypes?: AttachmentType[];
  /**
   * Max attachment size (bytes)
   */
  maxAttachmentSize?: number;
  /**
   * Max attachments
   */
  maxAttachments?: number;
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * Format file size to human readable format
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * ChatInput Component
 *
 * Message input with attachment support.
 */
export default function ChatInput({
  onSendMessage,
  onTyping,
  disabled = false,
  placeholder = 'Mesaj yazın...',
  maxLength = 1000,
  showAttachments = true,
  allowedTypes = ['image', 'video', 'file'],
  maxAttachmentSize = 10 * 1024 * 1024, // 10MB
  maxAttachments = 5,
  className = '',
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [message]);

  // Handle typing indicator
  const handleInputChange = (value: string) => {
    setMessage(value);

    if (onTyping) {
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Send typing indicator
      onTyping(true);

      // Auto-stop after 3 seconds of no typing
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 3000);
    }
  };

  // Handle file selection
  const handleFileSelect = (files: FileList | File[], type: AttachmentType) => {
    const fileArray = Array.from(files).slice(0, maxAttachments - attachments.length);

    fileArray.forEach(file => {
      // Validate file size
      if (file.size > maxAttachmentSize) {
        alert(`Dosya boyutu çok büyük (Maksimum: ${formatFileSize(maxAttachmentSize)})`);
        return;
      }

      // Create attachment object
      const attachment: ChatAttachment = {
        file,
        type,
        preview: '',
        id: `att-${Date.now()}-${Math.random()}`,
      };

      if (type === 'image' || type === 'video') {
        const reader = new FileReader();
        reader.onload = (e) => {
          attachment.preview = e.target?.result as string;
          setAttachments(prev => [...prev, attachment]);
        };
        reader.readAsDataURL(file);
      } else {
        setAttachments(prev => [...prev, attachment]);
      }
    });
  };

  // Remove attachment
  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  // Handle send
  const handleSend = () => {
    if (!message.trim() && attachments.length === 0) return;

    onSendMessage(message.trim(), attachments);
    setMessage('');
    setAttachments([]);
  };

  // Handle keyboard send (Enter to send, Shift+Enter for new line)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = (message.trim().length > 0 || attachments.length > 0) && !disabled;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Attachments Preview */}
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2"
          >
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="relative group"
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-2">
                    {attachment.preview && (
                      <img
                        src={attachment.preview}
                        alt={attachment.file.name}
                        className="h-16 w-16 object-cover rounded"
                      />
                    )}
                    {!attachment.preview && (
                      <div className="h-16 w-16 flex items-center justify-center bg-muted rounded">
                        {attachment.type === 'image' && <ImageIcon className="w-6 h-6" />}
                        {attachment.type === 'video' && <Video className="w-6 h-6" />}
                        {attachment.type === 'file' && <File className="w-6 h-6" />}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground truncate max-w-16">
                      {attachment.file.name}
                    </p>
                  </CardContent>
                </Card>

                {/* Remove Button */}
                <button
                  onClick={() => removeAttachment(attachment.id)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <Card className="border-2">
        <CardContent className="p-2">
          <div className="flex items-end gap-2">
            {/* Attachment Button */}
            {showAttachments && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0"
                  onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                  disabled={disabled}
                >
                  <Paperclip className="w-5 h-5" />
                </Button>

                {/* Attachment Menu */}
                {showAttachmentMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full left-0 mb-2 bg-background border rounded-lg shadow-lg p-2 z-10"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          handleFileSelect(e.target.files, 'image');
                          setShowAttachmentMenu(false);
                        }
                      }}
                      accept="image/*"
                      multiple
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          handleFileSelect(e.target.files, 'video');
                          setShowAttachmentMenu(false);
                        }
                      }}
                      accept="video/*"
                      multiple
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          handleFileSelect(e.target.files, 'file');
                          setShowAttachmentMenu(false);
                        }
                      }}
                      accept=".pdf,.doc,.docx,.txt"
                      multiple
                    />

                    <div className="space-y-1">
                      {allowedTypes.includes('image') && (
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted rounded transition-colors text-left"
                        >
                          <ImageIcon className="w-4 h-4" />
                          Görsel
                        </button>
                      )}
                      {allowedTypes.includes('video') && (
                        <button
                          onClick={() => {
                            const input = fileInputRef.current;
                            if (input) input.click();
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted rounded transition-colors text-left"
                        >
                          <Video className="w-4 h-4" />
                          Video
                        </button>
                      )}
                      {allowedTypes.includes('file') && (
                        <button
                          onClick={() => {
                            const input = fileInputRef.current;
                            if (input) input.click();
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted rounded transition-colors text-left"
                        >
                          <File className="w-4 h-4" />
                          Dosya
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Text Input */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                maxLength={maxLength}
                rows={1}
                className="w-full resize-none border-0 focus:ring-0 bg-transparent text-sm max-h-32"
                style={{ minHeight: '24px' }}
              />

              {/* Character Count */}
              {maxLength && (
                <div className="absolute bottom-0 right-0 text-xs text-muted-foreground">
                  {message.length}/{maxLength}
                </div>
              )}
            </div>

            {/* Emoji Button */}
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0"
              disabled={disabled}
            >
              <Smile className="w-5 h-5" />
            </Button>

            {/* Send Button */}
            <Button
              onClick={handleSend}
              disabled={!canSend}
              size="icon"
              className="flex-shrink-0 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Voice Recording (Future) */}
      {/* <div className="flex justify-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsRecording(!isRecording)}
          className={isRecording ? 'text-red-500' : ''}
        >
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>
      </div> */}
    </div>
  );
}

/**
 * Compact Chat Input
 */
export function ChatInputCompact(props: ChatInputProps) {
  return (
    <ChatInput {...props} className={props.className} />
  );
}
