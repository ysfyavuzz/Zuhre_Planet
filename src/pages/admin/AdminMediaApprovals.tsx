/**
 * Admin Media Approvals Page
 * 
 * Yönetim panelinde bekleyen medya öğelerini (resim, video) gözden geçirme,
 * orijinal ve AI ile işlenmiş hallerini karşılaştırma ve onaylama/reddetme
 * işlemleri için kullanılır.
 */

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MediaItem, ApprovalStatus } from '@/types/domain';
import { 
  CheckCircle, XCircle, Eye, EyeOff, Camera,
  AlertTriangle, Slash, Sparkles, Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch'; // Assuming we have a Radix UI Switch component or similar
import { Label } from '@/components/ui/label';

// Mock Listing Service'den medya item'larını çekmek için (şimdilik simüle edelim)
const mockFetchPendingMedia = (): Promise<MediaItem[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const pendingItems: MediaItem[] = [
        {
          id: 'media1',
          originalUrl: 'https://via.placeholder.com/300/FF0000/FFFFFF?text=Original+Image+1',
          processedUrl: 'https://via.placeholder.com/300/00FF00/FFFFFF?text=Processed+Image+1',
          type: 'image',
          status: 'pending',
          imageProcessingOptions: {
            faceMaskingEnabled: true,
            blurBackground: true,
            customMaskId: 'zuhre-planet-logo',
            brightnessAdjustment: 0.2,
            contrastAdjustment: 0.1,
          }
        },
        {
          id: 'media2',
          originalUrl: 'https://via.placeholder.com/300/0000FF/FFFFFF?text=Original+Image+2',
          processedUrl: 'https://via.placeholder.com/300/FFFF00/000000?text=Processed+Image+2',
          type: 'image',
          status: 'pending',
          imageProcessingOptions: {
            faceMaskingEnabled: false,
            blurBackground: true,
          }
        },
        {
            id: 'media3',
            originalUrl: 'https://via.placeholder.com/300/FFA500/FFFFFF?text=Original+Image+3',
            processedUrl: 'https://via.placeholder.com/300/800080/FFFFFF?text=Processed+Image+3',
            type: 'image',
            status: 'pending',
            imageProcessingOptions: {
              faceMaskingEnabled: true,
              blurBackground: false,
              customMaskId: 'galaxy-blur',
              brightnessAdjustment: -0.1,
            }
          },
          {
            id: 'media4',
            originalUrl: 'https://via.placeholder.com/300/40E0D0/FFFFFF?text=Original+Image+4',
            type: 'image',
            status: 'pending',
            // İşlenmemiş görsel, AI ayarları henüz uygulanmamış olabilir
          }
      ];
      resolve(pendingItems);
    }, 1000);
  });
};

export default function AdminMediaApprovals() {
  const [pendingMedia, setPendingMedia] = useState<MediaItem[]>([]);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);

  useEffect(() => {
    mockFetchPendingMedia().then(setPendingMedia);
  }, []);

  const handleApprove = (id: string) => {
    // API çağrısı: Medyayı onayla
    console.log(`Medya ${id} onaylandı.`);
    setPendingMedia(prev => prev.filter(item => item.id !== id));
    setSelectedMediaId(null);
    setRejectionReason('');
  };

  const handleReject = (id: string) => {
    if (!rejectionReason.trim()) {
      alert('Reddetme nedeni belirtmelisiniz.');
      return;
    }
    // API çağrısı: Medyayı reddet
    console.log(`Medya ${id} reddedildi. Neden: ${rejectionReason}`);
    setPendingMedia(prev => prev.filter(item => item.id !== id));
    setSelectedMediaId(null);
    setRejectionReason('');
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold font-orbitron text-white flex items-center gap-3 mb-8">
          <Camera className="w-8 h-8 text-yellow-400" />
          Medya Onayları
        </h1>

        {pendingMedia.length === 0 ? (
          <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-8 text-center">
            <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Bekleyen Medya Yok</h3>
            <p className="text-gray-400">Şu anda onay bekleyen herhangi bir görsel veya video bulunmamaktadır.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingMedia.map(item => (
              <div 
                key={item.id} 
                className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-lg text-white mb-3 flex items-center gap-2">
                    Medya ID: <span className="font-mono text-sm text-gray-400">{item.id}</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="relative group">
                      <img src={item.originalUrl} alt="Original" className="w-full h-auto rounded-lg object-cover border border-white/5 opacity-80 group-hover:opacity-100 transition-opacity" />
                      <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">Orijinal</span>
                    </div>
                    <div className="relative group">
                      {item.processedUrl ? (
                        <img src={item.processedUrl} alt="Processed" className="w-full h-auto rounded-lg object-cover border border-purple-500/30 opacity-80 group-hover:opacity-100 transition-opacity" />
                      ) : (
                        <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 text-sm border border-white/5">
                            İşlenmemiş
                        </div>
                      )}
                      <span className="absolute bottom-2 left-2 bg-purple-700/70 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> İşlenmiş
                      </span>
                    </div>
                  </div>

                  {item.imageProcessingOptions && (
                    <div className="space-y-2 bg-white/5 p-3 rounded-xl border border-white/10 mb-4">
                        <h4 className="text-sm font-bold text-gray-300 flex items-center gap-2">
                            <SlidersHorizontal className="w-4 h-4 text-gray-500" /> AI Ayarları
                        </h4>
                        <div className="text-xs text-gray-400 grid grid-cols-2 gap-x-4 gap-y-1">
                            <span>Yüz Maskeleme:</span>
                            <span className={item.imageProcessingOptions.faceMaskingEnabled ? 'text-green-400' : 'text-red-400'}>
                                {item.imageProcessingOptions.faceMaskingEnabled ? 'Aktif' : 'Pasif'}
                            </span>

                            <span>Arka Plan Bulanıklığı:</span>
                            <span className={item.imageProcessingOptions.blurBackground ? 'text-green-400' : 'text-red-400'}>
                                {item.imageProcessingOptions.blurBackground ? 'Aktif' : 'Pasif'}
                            </span>
                            
                            {item.imageProcessingOptions.customMaskId && (
                                <>
                                    <span>Özel Maske:</span>
                                    <span className="text-blue-400">{item.imageProcessingOptions.customMaskId}</span>
                                </>
                            )}
                            {item.imageProcessingOptions.brightnessAdjustment !== undefined && (
                                <>
                                    <span>Parlaklık:</span>
                                    <span className="text-yellow-400">{item.imageProcessingOptions.brightnessAdjustment}</span>
                                </>
                            )}
                            {item.imageProcessingOptions.contrastAdjustment !== undefined && (
                                <>
                                    <span>Kontrast:</span>
                                    <span className="text-yellow-400">{item.imageProcessingOptions.contrastAdjustment}</span>
                                </>
                            )}
                        </div>
                    </div>
                  )}

                  {selectedMediaId === item.id && (
                    <div className="mt-4">
                      <Label htmlFor={`rejection-${item.id}`} className="text-gray-400 text-sm mb-2 block">Reddetme Nedeni:</Label>
                      <Textarea
                        id={`rejection-${item.id}`}
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Medyayı neden reddettiğinizi belirtin..."
                        className="bg-white/5 border-white/10 text-white mb-3"
                      />
                      <Button 
                        onClick={() => handleReject(item.id)} 
                        className="w-full bg-red-600 hover:bg-red-500 text-white"
                      >
                        <XCircle className="w-4 h-4 mr-2" /> Reddet
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  {selectedMediaId !== item.id && (
                    <Button 
                      onClick={() => handleApprove(item.id)} 
                      className="flex-1 bg-green-600 hover:bg-green-500 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" /> Onayla
                    </Button>
                  )}
                  <Button 
                    onClick={() => setSelectedMediaId(selectedMediaId === item.id ? null : item.id)} 
                    variant={selectedMediaId === item.id ? 'default' : 'outline'}
                    className={`flex-1 ${selectedMediaId === item.id ? 'bg-red-600 hover:bg-red-500' : 'border-red-500/50 text-red-400 hover:bg-red-500/10'}`}
                  >
                    {selectedMediaId === item.id ? (
                        <>
                            <Slash className="w-4 h-4 mr-2" /> Vazgeç
                        </>
                    ) : (
                        <>
                            <XCircle className="w-4 h-4 mr-2" /> Reddet
                        </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// SlidersHorizontal ikonunu lucide-react'tan import ettiğimizden emin olalım
import { SlidersHorizontal } from 'lucide-react';
