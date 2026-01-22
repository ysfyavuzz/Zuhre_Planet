/**
 * WebSocket Debug Panel
 *
 * Geliştirme için WebSocket debug paneli.
 * SADECE development ortamında görünür.
 *
 * @module components/dev/WebSocketDebugPanel
 * @category Components - Development
 *
 * Features:
 * - Bağlantı durumu gösterimi
 * - Gelen/giden mesaj logu
 * - Manuel mesaj gönderme
 * - Simülasyon kontrolleri
 * - Online kullanıcı listesi
 * - Typing indicator kontrolleri
 * - Event statistics
 *
 * @example
 * ```tsx
 * {import.meta.env.DEV && <WebSocketDebugPanel />}
 * ```
 */

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { mockWebSocketService } from '@/services/mockWebSocket';
import {
  Wifi,
  WifiOff,
  Send,
  Trash2,
  Play,
  Pause,
  Activity,
  Users,
  MessageSquare,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LogEntry {
  id: string;
  type: 'sent' | 'received' | 'system';
  timestamp: Date;
  data: any;
}

export function WebSocketDebugPanel() {
  const {
    isConnected,
    connectionStatus,
    onlineUsers,
    typingUsers,
    messages,
    conversations,
    connect,
    disconnect,
    sendMessage,
    onMessage,
    onTyping,
    onUserStatus,
  } = useWebSocket();

  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [messageContent, setMessageContent] = useState('');
  const [conversationId, setConversationId] = useState('conv-1');
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState<'logs' | 'state' | 'controls'>('logs');

  // Add log entry
  const addLog = (type: LogEntry['type'], data: any) => {
    const log: LogEntry = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      timestamp: new Date(),
      data,
    };
    setLogs(prev => [log, ...prev].slice(0, 100)); // Keep last 100 logs
  };

  // Subscribe to WebSocket events
  useEffect(() => {
    const unsubscribeMessage = onMessage((message) => {
      addLog('received', { type: 'message', message });
    });

    const unsubscribeTyping = onTyping((data) => {
      addLog('received', { type: 'typing', data });
    });

    const unsubscribeStatus = onUserStatus((data) => {
      addLog('received', { type: 'status', data });
    });

    return () => {
      unsubscribeMessage();
      unsubscribeTyping();
      unsubscribeStatus();
    };
  }, [onMessage, onTyping, onUserStatus]);

  // Log connection status changes
  useEffect(() => {
    addLog('system', { event: 'connection_status', status: connectionStatus });
  }, [connectionStatus]);

  // Handle send message
  const handleSendMessage = () => {
    if (!messageContent.trim() || !isConnected) return;

    sendMessage({
      conversationId,
      senderId: 'debug-user',
      receiverId: 'test-user',
      type: 'text',
      content: messageContent,
    });

    addLog('sent', { type: 'message', content: messageContent, conversationId });
    setMessageContent('');
  };

  // Handle simulation
  const handleSimulation = () => {
    if (isSimulating) {
      mockWebSocketService.stopSimulation();
      setIsSimulating(false);
    } else {
      mockWebSocketService.startSimulation(conversationId, {
        messageInterval: 10000,
        typingChance: 0.3,
        statusChangeChance: 0.1,
      });
      setIsSimulating(true);
    }
  };

  // Clear logs
  const clearLogs = () => {
    setLogs([]);
  };

  // Don't render in production
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed bottom-4 right-4 z-[9999]"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="h-12 w-12 rounded-full shadow-lg"
              variant="default"
              size="icon"
            >
              <Activity className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Debug panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-4 right-4 z-[9999] w-[500px] max-h-[600px]"
          >
            <Card className="flex flex-col h-full shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  <h3 className="font-semibold">WebSocket Debug</h3>
                  <Badge
                    variant={isConnected ? 'default' : 'secondary'}
                    className={cn(
                      isConnected && 'bg-green-500 hover:bg-green-600'
                    )}
                  >
                    {isConnected ? (
                      <>
                        <Wifi className="h-3 w-3 mr-1" />
                        Connected
                      </>
                    ) : (
                      <>
                        <WifiOff className="h-3 w-3 mr-1" />
                        Disconnected
                      </>
                    )}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Tabs */}
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('logs')}
                  className={cn(
                    'flex-1 px-4 py-2 text-sm font-medium transition-colors',
                    activeTab === 'logs'
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <MessageSquare className="inline h-4 w-4 mr-2" />
                  Logs
                </button>
                <button
                  onClick={() => setActiveTab('state')}
                  className={cn(
                    'flex-1 px-4 py-2 text-sm font-medium transition-colors',
                    activeTab === 'state'
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Users className="inline h-4 w-4 mr-2" />
                  State
                </button>
                <button
                  onClick={() => setActiveTab('controls')}
                  className={cn(
                    'flex-1 px-4 py-2 text-sm font-medium transition-colors',
                    activeTab === 'controls'
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Activity className="inline h-4 w-4 mr-2" />
                  Controls
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-auto p-4">
                {/* Logs Tab */}
                {activeTab === 'logs' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-muted-foreground">
                        {logs.length} entries
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearLogs}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear
                      </Button>
                    </div>
                    {logs.map(log => (
                      <div
                        key={log.id}
                        className={cn(
                          'p-2 rounded text-xs font-mono',
                          log.type === 'sent' && 'bg-blue-50 dark:bg-blue-950/20',
                          log.type === 'received' && 'bg-green-50 dark:bg-green-950/20',
                          log.type === 'system' && 'bg-gray-50 dark:bg-gray-950/20'
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="outline" className="text-[10px]">
                            {log.type}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">
                            {log.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <pre className="whitespace-pre-wrap break-all">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}

                {/* State Tab */}
                {activeTab === 'state' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Connection</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <span className="font-mono">{connectionStatus}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Online Users:</span>
                          <span className="font-mono">{onlineUsers.size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Typing Users:</span>
                          <span className="font-mono">{typingUsers.length}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2">Messages</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total:</span>
                          <span className="font-mono">{messages.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Conversations:</span>
                          <span className="font-mono">{conversations.length}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2">Online Users List</h4>
                      <div className="space-y-1">
                        {Array.from(onlineUsers).map(userId => (
                          <Badge key={userId} variant="secondary" className="text-xs">
                            {userId}
                          </Badge>
                        ))}
                        {onlineUsers.size === 0 && (
                          <p className="text-xs text-muted-foreground">No online users</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Controls Tab */}
                {activeTab === 'controls' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Connection Control</h4>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={connect}
                          disabled={isConnected}
                          variant="outline"
                        >
                          Connect
                        </Button>
                        <Button
                          size="sm"
                          onClick={disconnect}
                          disabled={!isConnected}
                          variant="outline"
                        >
                          Disconnect
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2">Send Message</h4>
                      <div className="space-y-2">
                        <Input
                          placeholder="Conversation ID"
                          value={conversationId}
                          onChange={(e) => setConversationId(e.target.value)}
                          className="text-xs"
                        />
                        <Textarea
                          placeholder="Message content..."
                          value={messageContent}
                          onChange={(e) => setMessageContent(e.target.value)}
                          className="text-xs min-h-[60px]"
                        />
                        <Button
                          size="sm"
                          onClick={handleSendMessage}
                          disabled={!isConnected || !messageContent.trim()}
                          className="w-full"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Send
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2">Simulation</h4>
                      <div className="space-y-2">
                        <Button
                          size="sm"
                          onClick={handleSimulation}
                          variant={isSimulating ? 'destructive' : 'default'}
                          className="w-full"
                        >
                          {isSimulating ? (
                            <>
                              <Pause className="h-4 w-4 mr-2" />
                              Stop Simulation
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Start Simulation
                            </>
                          )}
                        </Button>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => mockWebSocketService.simulateIncomingMessage(conversationId)}
                            className="flex-1"
                          >
                            Simulate Message
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => mockWebSocketService.simulateTyping(conversationId)}
                            className="flex-1"
                          >
                            Simulate Typing
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => mockWebSocketService.simulateConversation(conversationId)}
                          className="w-full"
                        >
                          Full Conversation
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
