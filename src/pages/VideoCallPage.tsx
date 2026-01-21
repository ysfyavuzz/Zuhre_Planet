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
    console.log('Call ended');
    // Navigate back to messages
    window.location.href = '/messages';
  };

  const handleToggleMute = () => {
    console.log('Toggle mute');
  };

  const handleToggleVideo = () => {
    console.log('Toggle video');
  };

  const handleToggleScreenShare = () => {
    console.log('Toggle screen share');
  };

  const handleToggleChat = () => {
    console.log('Toggle chat');
    window.location.href = '/messages';
  };

  const handleOpenSettings = () => {
    console.log('Open settings');
  };

  const handleToggleFullscreen = () => {
    console.log('Toggle fullscreen');
  };

  const handleTogglePiP = () => {
    console.log('Toggle PiP');
  };

  const handleCopyLink = async () => {
    const link = window.location.href;
    await navigator.clipboard.writeText(link);
    console.log('Link copied:', link);
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
