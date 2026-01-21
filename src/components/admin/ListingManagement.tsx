/**
 * ListingManagement Component
 * 
 * Listing approval and management interface.
 * Allows reviewing, approving, or rejecting escort listings.
 * 
 * @component
 * @category Admin
 */

import * as React from 'react';
import { Check, X, Eye, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { mockEscorts } from '@/data/mockData/escorts';

export function ListingManagement() {
  const [filter, setFilter] = React.useState<'all' | 'pending' | 'verified' | 'rejected'>('pending');

  const filteredListings = React.useMemo(() => {
    if (filter === 'all') return mockEscorts;
    return mockEscorts.filter(e => e.verificationStatus === filter);
  }, [filter]);

  const pendingCount = mockEscorts.filter(e => e.verificationStatus === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">İlan Yönetimi</h1>
        <p className="text-gray-500 mt-1">İlanları inceleyin ve onaylayın</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm text-gray-500">Toplam İlan</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{mockEscorts.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-500">Bekleyen Onaylar</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">{pendingCount}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-500">Onaylanmış</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {mockEscorts.filter(e => e.verificationStatus === 'verified').length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-500">Reddedilmiş</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {mockEscorts.filter(e => e.verificationStatus === 'rejected').length}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'pending', 'verified', 'rejected'] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            onClick={() => setFilter(f)}
          >
            {f === 'all' && 'Tümü'}
            {f === 'pending' && `Bekleyen (${pendingCount})`}
            {f === 'verified' && 'Onaylı'}
            {f === 'rejected' && 'Reddedilmiş'}
          </Button>
        ))}
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((escort) => (
          <Card key={escort.id} className="overflow-hidden">
            <div className="relative">
              <img 
                src={escort.profilePhoto} 
                alt={escort.displayName}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge 
                  variant={
                    escort.verificationStatus === 'verified' 
                      ? 'default' 
                      : escort.verificationStatus === 'pending'
                      ? 'secondary'
                      : 'destructive'
                  }
                >
                  {escort.verificationStatus === 'verified' && 'Onaylı'}
                  {escort.verificationStatus === 'pending' && 'Beklemede'}
                  {escort.verificationStatus === 'rejected' && 'Reddedildi'}
                </Badge>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900">{escort.displayName}</h3>
                <p className="text-sm text-gray-500">{escort.city}, {escort.district}</p>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">{escort.age} yaşında</span>
                <span>•</span>
                <span className="text-gray-600">{escort.height} cm</span>
                <span>•</span>
                <span className="font-semibold text-pink-600">{escort.hourlyRate} ₺/saat</span>
              </div>

              <p className="text-sm text-gray-600 line-clamp-2">{escort.about}</p>

              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-1" />
                  İncele
                </Button>
                {escort.verificationStatus === 'pending' && (
                  <>
                    <Button size="sm" variant="outline" className="text-green-600">
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600">
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Bu kategoride ilan bulunamadı</p>
        </div>
      )}
    </div>
  );
}
