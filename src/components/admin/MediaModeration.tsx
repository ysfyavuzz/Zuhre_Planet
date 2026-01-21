/**
 * MediaModeration Component
 * 
 * Photo and video moderation interface.
 * Allows reviewing and approving/rejecting media content.
 * 
 * @component
 * @category Admin
 */

import * as React from 'react';
import { Check, X, Eye, Image as ImageIcon, Video, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { mockEscorts } from '@/data/mockData/escorts';

type MediaType = 'all' | 'photos' | 'videos';

export function MediaModeration() {
  const [mediaType, setMediaType] = React.useState<MediaType>('all');

  // Flatten all media from escorts
  const allMedia = React.useMemo(() => {
    const media: Array<{
      id: string;
      type: 'photo' | 'video';
      url: string;
      escortId: string;
      escortName: string;
      status: 'pending' | 'approved' | 'rejected';
    }> = [];

    mockEscorts.forEach((escort) => {
      // Add photos
      escort.photos.forEach((photo, index) => {
        media.push({
          id: `photo-${escort.id}-${index}`,
          type: 'photo',
          url: photo,
          escortId: escort.id,
          escortName: escort.displayName,
          status: 'approved',
        });
      });

      // Add videos
      escort.videos?.forEach((video, index) => {
        media.push({
          id: `video-${escort.id}-${index}`,
          type: 'video',
          url: video,
          escortId: escort.id,
          escortName: escort.displayName,
          status: 'approved',
        });
      });
    });

    // Add some pending items for demo
    media.push(
      {
        id: 'photo-pending-1',
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        escortId: 'esc-001',
        escortName: 'Ayşe',
        status: 'pending',
      },
      {
        id: 'photo-pending-2',
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
        escortId: 'esc-003',
        escortName: 'Elif',
        status: 'pending',
      }
    );

    return media;
  }, []);

  const filteredMedia = React.useMemo(() => {
    if (mediaType === 'all') return allMedia;
    return allMedia.filter(m => m.type === (mediaType === 'photos' ? 'photo' : 'video'));
  }, [allMedia, mediaType]);

  const pendingCount = allMedia.filter(m => m.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Medya Moderasyonu</h1>
        <p className="text-gray-500 mt-1">Fotoğraf ve videoları inceleyin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm text-gray-500">Toplam Medya</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{allMedia.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-500">Bekleyen</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">{pendingCount}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-500">Fotoğraflar</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {allMedia.filter(m => m.type === 'photo').length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-500">Videolar</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {allMedia.filter(m => m.type === 'video').length}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={mediaType === 'all' ? 'default' : 'outline'}
          onClick={() => setMediaType('all')}
        >
          Tümü ({allMedia.length})
        </Button>
        <Button
          variant={mediaType === 'photos' ? 'default' : 'outline'}
          onClick={() => setMediaType('photos')}
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Fotoğraflar
        </Button>
        <Button
          variant={mediaType === 'videos' ? 'default' : 'outline'}
          onClick={() => setMediaType('videos')}
        >
          <Video className="w-4 h-4 mr-2" />
          Videolar
        </Button>
      </div>

      {/* Pending Items First */}
      {pendingCount > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Onay Bekleyen Medya ({pendingCount})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredMedia
              .filter(m => m.status === 'pending')
              .map((media) => (
                <Card key={media.id} className="overflow-hidden">
                  <div className="relative aspect-square bg-gray-100">
                    {media.type === 'photo' ? (
                      <img 
                        src={media.url} 
                        alt="Media"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="bg-white/90">
                        {media.type === 'photo' ? <ImageIcon className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-2 space-y-2">
                    <p className="text-xs text-gray-600 truncate">{media.escortName}</p>
                    <div className="flex gap-1">
                      <Button size="sm" className="flex-1 h-7 text-xs">
                        <Check className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="destructive" className="flex-1 h-7 text-xs">
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* All Media */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Tüm Medya
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredMedia.map((media) => (
            <Card key={media.id} className="overflow-hidden">
              <div className="relative aspect-square bg-gray-100">
                {media.type === 'photo' ? (
                  <img 
                    src={media.url} 
                    alt="Media"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <Badge 
                    variant={media.status === 'approved' ? 'default' : 'secondary'}
                  >
                    {media.status === 'approved' && <Check className="w-3 h-3" />}
                    {media.status === 'pending' && 'Bekliyor'}
                    {media.status === 'rejected' && <X className="w-3 h-3" />}
                  </Badge>
                </div>
                <Button 
                  size="sm" 
                  variant="secondary"
                  className="absolute bottom-2 right-2 h-6 w-6 p-0"
                >
                  <Eye className="w-3 h-3" />
                </Button>
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-600 truncate">{media.escortName}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
