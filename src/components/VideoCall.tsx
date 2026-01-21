/**
 * VideoCall Component
 *
 * Complete video calling interface with WebRTC integration.
 * Features video grid, controls, screen sharing, and call management.
 *
 * @module components/VideoCall
 * @category Components - Messaging
 *
 * Features:
 * - Video grid layout (self + remote)
 * - Mute/unmute audio
 * - Camera on/off
 * - Screen sharing
 * - Call controls (end, chat, settings)
 * - Connection status indicator
 * - Picture-in-picture mode
 * - Fullscreen support
 * - Recording indicator
 * - Call timer
 * - Participant info display
 * - Connection quality indicator
 *
 * @example
 * ```tsx
 * <VideoCall
 *   callId="call-123"
 *   localStream={localStream}
 *   remoteStream={remoteStream}
 *   participant={{ id: 'user-2', name: 'Ayşe Yılmaz', avatar: '...' }}
 *   onEndCall={() => console.log('Call ended')}
 *   onToggleChat={() => setShowChat(true)}
 * />
 * ```
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, MonitorUp,
  MessageCircle, Settings, Maximize2, Minimize2, User,
  Signal, SignalHigh, SignalLow, Radio, AlertCircle,
  Copy, Check, Volume2, VolumeX, Users, Pin, PinOff,
  Camera, Webcam, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

/**
 * Connection quality type
 */
export type ConnectionQuality = 'excellent' | 'good' | 'fair' | 'poor';

/**
 * Call status type
 */
export type CallStatus = 'connecting' | 'connected' | 'reconnecting' | 'ended' | 'failed';

/**
 * Participant interface
 */
export interface CallParticipant {
  id: string;
  name: string;
  avatar?: string;
  role?: 'escort' | 'customer' | 'admin';
  isMuted?: boolean;
  isVideoOff?: boolean;
  connectionQuality?: ConnectionQuality;
}

/**
 * Props for VideoCall component
 */
export interface VideoCallProps {
  /**
   * Unique call ID
   */
  callId: string;
  /**
   * Local media stream
   */
  localStream?: MediaStream;
  /**
   * Remote media stream
   */
  remoteStream?: MediaStream;
  /**
   * Remote participant info
   */
  participant: CallParticipant;
  /**
   * Current call status
   */
  callStatus?: CallStatus;
  /**
   * Call start time
   */
  callStartTime?: Date;
  /**
   * Is call being recorded
   */
  isRecording?: boolean;
  /**
   * Show chat button
   */
  showChat?: boolean;
  /**
   * Show settings button
   */
  showSettings?: boolean;
  /**
   * Enable screen sharing
   */
  enableScreenShare?: boolean;
  /**
   * End call handler
   */
  onEndCall?: () => void | Promise<void>;
  /**
   * Toggle mute handler
   */
  onToggleMute?: () => void | Promise<void>;
  /**
   * Toggle video handler
   */
  onToggleVideo?: () => void | Promise<void>;
  /**
   * Toggle screen share handler
   */
  onToggleScreenShare?: () => void | Promise<void>;
  /**
   * Open chat handler
   */
  onToggleChat?: () => void;
  /**
   * Open settings handler
   */
  onOpenSettings?: () => void;
  /**
   * Toggle fullscreen handler
   */
  onToggleFullscreen?: () => void;
  /**
   * Toggle PiP handler
   */
  onTogglePiP?: () => void;
  /**
   * Copy call link handler
   */
  onCopyLink?: () => void | Promise<boolean>;
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * Get connection quality icon
 */
function getConnectionQualityIcon(quality: ConnectionQuality) {
  const icons = {
    excellent: <SignalHigh className="w-4 h-4 text-green-500" />,
    good: <SignalHigh className="w-4 h-4 text-blue-500" />,
    fair: <Signal className="w-4 h-4 text-yellow-500" />,
    poor: <SignalLow className="w-4 h-4 text-red-500" />,
  };
  return icons[quality];
}

/**
 * Get connection quality text
 */
function getConnectionQualityText(quality: ConnectionQuality): string {
  const texts = {
    excellent: 'Mükemmel',
    good: 'İyi',
    fair: 'Orta',
    poor: 'Zayıf',
  };
  return texts[quality];
}

/**
 * Format call duration
 */
function formatCallDuration(startTime: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);

  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * VideoCall Component
 *
 * Complete video calling interface.
 */
export default function VideoCall({
  callId,
  localStream,
  remoteStream,
  participant,
  callStatus = 'connecting',
  callStartTime,
  isRecording = false,
  showChat = true,
  showSettings = true,
  enableScreenShare = true,
  onEndCall,
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  onToggleChat,
  onOpenSettings,
  onToggleFullscreen,
  onTogglePiP,
  onCopyLink,
  className = '',
}: VideoCallProps) {
  // Local state
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<ConnectionQuality>('good');
  const [copied, setCopied] = useState(false);
  const [callDuration, setCallDuration] = useState<string>('00:00');
  const [showParticipantInfo, setShowParticipantInfo] = useState(false);

  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Set up video streams
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Update call duration
  useEffect(() => {
    if (!callStartTime || callStatus !== 'connected') return;

    const interval = setInterval(() => {
      setCallDuration(formatCallDuration(callStartTime));
    }, 1000);

    setCallDuration(formatCallDuration(callStartTime));

    return () => clearInterval(interval);
  }, [callStartTime, callStatus]);

  // Handle mute toggle
  const handleToggleMute = useCallback(async () => {
    const newState = !isMuted;
    setIsMuted(newState);

    if (onToggleMute) {
      await onToggleMute();
    }

    // Mute local stream
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !newState;
      });
    }
  }, [isMuted, localStream, onToggleMute]);

  // Handle video toggle
  const handleToggleVideo = useCallback(async () => {
    const newState = !isVideoOff;
    setIsVideoOff(newState);

    if (onToggleVideo) {
      await onToggleVideo();
    }

    // Disable local stream
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !newState;
      });
    }
  }, [isVideoOff, localStream, onToggleVideo]);

  // Handle screen share toggle
  const handleToggleScreenShare = useCallback(async () => {
    const newState = !isScreenSharing;
    setIsScreenSharing(newState);

    if (onToggleScreenShare) {
      await onToggleScreenShare();
    }
  }, [isScreenSharing, onToggleScreenShare]);

  // Handle fullscreen
  const handleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      containerRef.current.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(console.error);
      setIsFullscreen(false);
    }

    if (onToggleFullscreen) {
      onToggleFullscreen();
    }
  }, [isFullscreen, onToggleFullscreen]);

  // Handle PiP
  const handlePiP = useCallback(async () => {
    if (!remoteVideoRef.current) return;

    try {
      if (!isPiP) {
        await (remoteVideoRef.current as any).requestPictureInPicture();
        setIsPiP(true);
      } else {
        await document.exitPictureInPicture();
        setIsPiP(false);
      }

      if (onTogglePiP) {
        onTogglePiP();
      }
    } catch (err) {
      console.error('PiP error:', err);
    }
  }, [isPiP, onTogglePiP]);

  // Handle copy link
  const handleCopyLink = useCallback(async () => {
    const link = window.location.href + `/call/${callId}`;

    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);

      if (onCopyLink) {
        await onCopyLink();
      }

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  }, [callId, onCopyLink]);

  // Get call status badge
  const getCallStatusBadge = () => {
    const statusConfig = {
      connecting: { label: 'Bağlanıyor', variant: 'secondary' as const, icon: <AlertCircle className="w-3 h-3" /> },
      connected: { label: 'Bağlı', variant: 'default' as const, icon: <Check className="w-3 h-3" /> },
      reconnecting: { label: 'Yeniden Bağlanılıyor', variant: 'secondary' as const, icon: <AlertCircle className="w-3 h-3" /> },
      ended: { label: 'Bitti', variant: 'secondary' as const, icon: null },
      failed: { label: 'Bağlantı Hatası', variant: 'destructive' as const, icon: <AlertCircle className="w-3 h-3" /> },
    };

    const config = statusConfig[callStatus];
    return (
      <Badge variant={config.variant} className="gap-1">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  return (
    <div ref={containerRef} className={`h-screen bg-background flex flex-col ${className}`}>
      {/* Top Bar */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between p-4">
          {/* Left: Call Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {getCallStatusBadge()}
              {isRecording && (
                <Badge variant="destructive" className="gap-1 animate-pulse">
                  <Radio className="w-3 h-3" />
                  Kayıt
                </Badge>
              )}
            </div>

            <Separator orientation="vertical" className="h-6" />

            <div>
              <h1 className="font-semibold">{participant.name}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {callStatus === 'connected' && callStartTime && (
                  <span>{callDuration}</span>
                )}
                <span>•</span>
                {getConnectionQualityIcon(connectionQuality)}
                <span className="text-xs">{getConnectionQualityText(connectionQuality)}</span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyLink}
              title="Bağlantıyı Kopyala"
            >
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handlePiP}
              title="Picture-in-Picture"
            >
              <MonitorUp className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleFullscreen}
              title="Tam Ekran"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </Button>

            {showSettings && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onOpenSettings}
                title="Ayarlar"
              >
                <Settings className="w-5 h-5" />
              </Button>
            )}

            {showChat && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleChat}
                title="Sohbet"
              >
                <MessageCircle className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Video Area */}
      <main className="flex-1 relative">
        {callStatus === 'ended' ? (
          // Call Ended Screen
          <div className="absolute inset-0 flex items-center justify-center bg-background">
            <div className="text-center">
              <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                <PhoneOff className="w-16 h-16 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Arama Sonlandı</h2>
              <p className="text-muted-foreground mb-6">
                {callStartTime && `Arama süresi: ${callDuration}`}
              </p>
              <Button onClick={onEndCall} size="lg">
                Kapat
              </Button>
            </div>
          </div>
        ) : callStatus === 'failed' ? (
          // Call Failed Screen
          <div className="absolute inset-0 flex items-center justify-center bg-background">
            <div className="text-center">
              <div className="inline-flex p-4 rounded-full bg-red-500/10 mb-4">
                <AlertCircle className="w-16 h-16 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Bağlantı Hatası</h2>
              <p className="text-muted-foreground mb-6">
                Arama bağlanırken bir hata oluştu. Lütfen tekrar deneyin.
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Yeniden Dene
                </Button>
                <Button onClick={onEndCall} variant="destructive">
                  Kapat
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Video Grid
          <div className="h-full flex">
            {/* Remote Video (Main) */}
            <div className="flex-1 relative bg-black">
              {remoteStream ? (
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-white">
                    {participant.avatar ? (
                      <img
                        src={participant.avatar}
                        alt={participant.name}
                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl font-bold mx-auto mb-4">
                        {participant.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <h3 className="text-2xl font-bold">{participant.name}</h3>
                    {callStatus === 'connecting' && (
                      <p className="mt-2 text-white/70 animate-pulse">Bağlanıyor...</p>
                    )}
                  </div>
                </div>
              )}

              {/* Participant Info Overlay */}
              <AnimatePresence>
                {showParticipantInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute top-4 left-4 bg-black/60 backdrop-blur text-white p-4 rounded-lg"
                  >
                    <h3 className="font-semibold">{participant.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-white/80 mt-1">
                      {getConnectionQualityIcon(connectionQuality)}
                      <span>{getConnectionQualityText(connectionQuality)}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pin Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowParticipantInfo(!showParticipantInfo)}
                className="absolute top-4 right-4 text-white hover:bg-white/20"
              >
                {showParticipantInfo ? <PinOff className="w-5 h-5" /> : <Pin className="w-5 h-5" />}
              </Button>
            </div>

            {/* Local Video (Picture-in-Picture) */}
            <div className="absolute bottom-24 right-4 w-48 h-36 bg-black rounded-lg overflow-hidden shadow-2xl border-2 border-white/20">
              {localStream && !isVideoOff ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                  <User className="w-12 h-12 text-white" />
                </div>
              )}

              {/* Local Video Mute Indicator */}
              {isMuted && (
                <div className="absolute top-2 left-2 bg-red-500 text-white p-1 rounded-full">
                  <MicOff className="w-3 h-3" />
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Control Bar */}
      <footer className="border-t bg-background/95 backdrop-blur">
        <div className="flex items-center justify-center gap-2 p-4">
          {/* Mute Button */}
          <Button
            variant={isMuted ? 'destructive' : 'outline'}
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={handleToggleMute}
            title={isMuted ? 'Mikrofonu Aç' : 'Mikrofonu Kapat'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>

          {/* Video Button */}
          <Button
            variant={isVideoOff ? 'destructive' : 'outline'}
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={handleToggleVideo}
            title={isVideoOff ? 'Kamerayı Aç' : 'Kamerayı Kapat'}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </Button>

          {/* Screen Share Button */}
          {enableScreenShare && (
            <Button
              variant={isScreenSharing ? 'default' : 'outline'}
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={handleToggleScreenShare}
              title={isScreenSharing ? 'Ekran Paylaşımını Bitir' : 'Ekran Paylaş'}
            >
              <MonitorUp className="w-5 h-5" />
            </Button>
          )}

          {/* End Call Button */}
          <Button
            variant="destructive"
            size="icon"
            className="h-14 w-14 rounded-full"
            onClick={onEndCall}
            title="Aramayı Sonlandır"
          >
            <PhoneOff className="w-6 h-6" />
          </Button>

          {/* Volume Button */}
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full"
            title="Ses Seviyesi"
          >
            <Volume2 className="w-5 h-5" />
          </Button>
        </div>
      </footer>
    </div>
  );
}

/**
 * Incoming Call Modal
 */
export function IncomingCallModal({
  caller,
  onAccept,
  onReject,
  isVideoCall = true,
}: {
  caller: CallParticipant;
  onAccept: () => void | Promise<void>;
  onReject: () => void | Promise<void>;
  isVideoCall?: boolean;
}) {
  const [isRinging, setIsRinging] = useState(true);

  useEffect(() => {
    // Ring for 30 seconds then auto-reject
    const timeout = setTimeout(() => {
      if (isRinging) {
        onReject();
      }
    }, 30000);

    return () => clearTimeout(timeout);
  }, [isRinging, onReject]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-background rounded-2xl p-8 max-w-md w-full text-center space-y-6"
      >
        {/* Caller Avatar */}
        <div className="relative inline-block">
          {caller.avatar ? (
            <img
              src={caller.avatar}
              alt={caller.name}
              className="w-24 h-24 rounded-full object-cover mx-auto animate-pulse"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl font-bold text-white mx-auto animate-pulse">
              {caller.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full">
            {isVideoCall ? <Video className="w-4 h-4" /> : <PhoneOff className="w-4 h-4" />}
          </div>
        </div>

        {/* Caller Info */}
        <div>
          <h2 className="text-2xl font-bold">{caller.name}</h2>
          <p className="text-muted-foreground mt-1">
            {isVideoCall ? 'Görüntülü arama' : 'Sesli arama'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            variant="destructive"
            size="icon"
            className="h-16 w-16 rounded-full"
            onClick={onReject}
          >
            <PhoneOff className="w-6 h-6" />
          </Button>
          <Button
            variant="default"
            size="icon"
            className="h-16 w-16 rounded-full bg-green-500 hover:bg-green-600"
            onClick={onAccept}
          >
            <Video className="w-6 h-6" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Outgoing Call Modal
 */
export function OutgoingCallModal({
  recipient,
  onCancel,
}: {
  recipient: CallParticipant;
  onCancel: () => void | Promise<void>;
}) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-background rounded-2xl p-8 max-w-md w-full text-center space-y-6"
      >
        {/* Recipient Avatar */}
        <div className="relative inline-block">
          {recipient.avatar ? (
            <img
              src={recipient.avatar}
              alt={recipient.name}
              className="w-24 h-24 rounded-full object-cover mx-auto animate-pulse"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl font-bold text-white mx-auto animate-pulse">
              {recipient.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full animate-pulse">
            <Video className="w-4 h-4" />
          </div>
        </div>

        {/* Recipient Info */}
        <div>
          <h2 className="text-2xl font-bold">{recipient.name}</h2>
          <p className="text-muted-foreground mt-1 animate-pulse">Aranıyor...</p>
        </div>

        {/* Cancel Button */}
        <Button
          variant="destructive"
          size="lg"
          className="w-full"
          onClick={onCancel}
        >
          <PhoneOff className="w-5 h-5 mr-2" />
          İptal
        </Button>
      </motion.div>
    </div>
  );
}
