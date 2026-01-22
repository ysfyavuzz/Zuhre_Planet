/**
 * Video Call Page
 *
 * Wrapper page for video calling functionality.
 * Uses VideoCall component with mock data for demonstration.
 *
 * @module pages/VideoCallPage
 * @category Pages - Messaging
 *
 * Routes: /messages/video, /video-call
 */

import VideoCall from '@/components/VideoCall';
import ProtectedRoute from '@/components/ProtectedRoute';

/**
 * Mock participant data
 */
const mockParticipant = {
  id: 'escort-1',
  name: 'Ayşe Yılmaz',
  avatar: 'https://images.unsplash.com/photo-1494790108377-e9e60c0c8007?w=150&h=150&fit=crop',
  role: 'escort' as const,
  isOnline: true,
};

/**
 * VideoCallPage Component
 */
export default function VideoCallPage() {
  const callId = 'call-default'; // Mock call ID

  // Mock handlers
  const handleEndCall = () => {
    window.location.href = '/messages';
  };

  const handleToggleMute = () => {
    // TODO: Implement mute toggle
  };

  const handleToggleVideo = () => {
    // TODO: Implement video toggle
  };

  const handleToggleScreenShare = () => {
    // TODO: Implement screen share toggle
  };

  const handleToggleChat = () => {
    window.location.href = '/messages';
  };

  const handleOpenSettings = () => {
    // TODO: Implement settings dialog
  };

  const handleToggleFullscreen = () => {
    // TODO: Implement fullscreen toggle
  };

  const handleTogglePiP = () => {
    // TODO: Implement PiP toggle
  };

  const handleCopyLink = async () => {
    const link = window.location.href;
    await navigator.clipboard.writeText(link);
    return true;
  };

  return (
    <ProtectedRoute accessLevel="customer">
      <VideoCall
        callId={callId}
        participant={mockParticipant}
        callStatus="connected"
        callStartTime={new Date(Date.now() - 5 * 60 * 1000)}
        isRecording={false}
        showChat={true}
        showSettings={true}
        enableScreenShare={true}
        onEndCall={handleEndCall}
        onToggleMute={handleToggleMute}
        onToggleVideo={handleToggleVideo}
        onToggleScreenShare={handleToggleScreenShare}
        onToggleChat={handleToggleChat}
        onOpenSettings={handleOpenSettings}
        onToggleFullscreen={handleToggleFullscreen}
        onTogglePiP={handleTogglePiP}
        onCopyLink={handleCopyLink}
      />
    </ProtectedRoute>
  );
}
