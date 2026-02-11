/**
 * Image Editor Page (AI Destekli Görsel Düzenleyici)
 * 
 * Escortların profillerindeki görselleri AI destekli araçlarla düzenlediği sayfa.
 * Yüz maskeleme, arka plan bulanıklaştırma, parlaklık/kontrast ayarları gibi özellikler sunar.
 */

import React, { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider'; // Assuming a Radix UI Slider or similar
import { Switch } from '@/components/ui/switch'; // Assuming a Radix UI Switch component or similar
import {
  Camera, Crop, SlidersHorizontal, Eye, EyeOff, Save, Upload, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import FileUpload from '@/components/FileUpload';
import { uploadMultipleFiles } from '@/services/mockUploadService';

// Mock AI İşleme Fonksiyonu (Gerçek AI backend API'ye bağlanacak)
const mockProcessImage = (
  originalUrl: string, 
  options: {
    faceMaskingEnabled?: boolean;
    blurBackground?: boolean;
    customMaskId?: string;
    brightnessAdjustment?: number;
    contrastAdjustment?: number;
  }
): string => {
  // Basit bir mock: URL'ye parametreler ekleyerek farklı görsel döndürme simülasyonu
  let processed = originalUrl;
  let params = [];

  if (options.faceMaskingEnabled) params.push('mask');
  if (options.blurBackground) params.push('blur');
  if (options.customMaskId && options.customMaskId !== 'none') params.push(`mask=${options.customMaskId}`);
  if (options.brightnessAdjustment) params.push(`bright=${options.brightnessAdjustment.toFixed(1)}`);
  if (options.contrastAdjustment) params.push(`cont=${options.contrastAdjustment.toFixed(1)}`);

  if (params.length > 0) {
    // Mevcut placeholder URL'sini değiştirme mantığı
    if (processed.includes('?')) {
        processed = processed.split('?')[0]; // Eski parametreleri temizle
    }
    processed += `?text=Processed+Image+(${params.join('+')})&${params.join('&')}`;
  } else {
    // Hiçbir işlem yapılmazsa, orijinal URL'ye geri dön
    processed = processed.split('?')[0] + '?text=Original+Image';
  }
  return processed;
};

export default function ImageEditor() {
  const [originalImage, setOriginalImage] = useState<string>('https://via.placeholder.com/600/6A0DAD/FFFFFF?text=Orijinal+Görsel');
  const [processedImage, setProcessedImage] = useState<string>('');
  const [imageProcessingOptions, setImageProcessingOptions] = useState({
    faceMaskingEnabled: false,
    blurBackground: false,
    customMaskId: 'none',
    brightnessAdjustment: 0,
    contrastAdjustment: 0,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Görsel yüklendiğinde otomatik olarak işleme al
  useEffect(() => {
    if (originalImage) {
      applyFilters();
    }
  }, [originalImage]); // Sadece orijinal görsel değiştiğinde

  // Ayarlar her değiştiğinde filtreleri yeniden uygula
  useEffect(() => {
    if (originalImage) {
        applyFilters();
    }
  }, [imageProcessingOptions]); // imageProcessingOptions değiştiğinde

  const applyFilters = () => {
    if (!originalImage) return;
    setIsProcessing(true);
    // Mock işlemeyi simüle et
    setTimeout(() => {
      const result = mockProcessImage(originalImage, imageProcessingOptions);
      setProcessedImage(result);
      setIsProcessing(false);
    }, 500); // Yarım saniye gecikme
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImage(e.target?.result as string);
        // Reset processing options for new image
        setImageProcessingOptions({
          faceMaskingEnabled: false,
          blurBackground: false,
          customMaskId: 'none',
          brightnessAdjustment: 0,
          contrastAdjustment: 0,
        });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleOptionChange = (optionName: keyof typeof imageProcessingOptions, value: any) => {
    setImageProcessingOptions(prev => ({
      ...prev,
      [optionName]: value,
    }));
  };

  const handleSave = () => {
    console.log('Kaydedilen Ayarlar:', imageProcessingOptions);
    console.log('İşlenmiş Görsel URL:', processedImage);
    // Burada API çağrısı ile orijinal görsel, işlenmiş görsel ve ayarlar backend'e gönderilir.
    // Backend, bu veriyi pendingChanges olarak kaydeder.
    alert('Görsel ayarları onaya gönderildi!');
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold font-orbitron text-white flex items-center gap-3">
          <Crop className="w-8 h-8 text-yellow-400" />
          AI Destekli Görsel Düzenleyici
        </h1>
        <p className="text-gray-400">
          Görsellerinize yüz maskeleme, arka plan bulanıklığı ve renk düzeltmeleri uygulayın. 
          Gizliliğinizi korurken profesyonel bir görünüm elde edin.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sol Panel: Kontroller */}
          <div className="md:col-span-1 bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="space-y-2">
              <FileUpload
                onUpload={async (files) => {
                  try {
                    const results = await uploadMultipleFiles(files);
                    // İlk başarılı yüklenen dosyanın URL'sini kullan
                    const firstSuccessfulUpload = results.find(r => r.success);
                    if (firstSuccessfulUpload?.fileUrl) {
                      setOriginalImage(firstSuccessfulUpload.fileUrl);
                      // Reset processing options for new image
                      setImageProcessingOptions({
                        faceMaskingEnabled: false,
                        blurBackground: false,
                        customMaskId: 'none',
                        brightnessAdjustment: 0,
                        contrastAdjustment: 0,
                      });
                    }
                    alert('Dosyalar başarıyla yüklendi!');
                  } catch (error) {
                    alert('Dosya yükleme sırasında hata oluştu.');
                    console.error('Dosya yükleme hatası:', error);
                  }
                }}
                maxFiles={1} // Sadece bir görsel yüklenmesine izin ver
                allowedFileTypes={['image/*']}
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                AI Gizlilik & Düzenleme
              </h3>

              {/* Yüz Maskeleme */}
              <div className="flex items-center justify-between">
                <Label htmlFor="face-masking" className="text-sm text-gray-300">Yüz Maskeleme</Label>
                <Switch
                  id="face-masking"
                  checked={imageProcessingOptions.faceMaskingEnabled}
                  onCheckedChange={(checked) => handleOptionChange('faceMaskingEnabled', checked)}
                />
              </div>

              {/* Arka Plan Bulanıklığı */}
              <div className="flex items-center justify-between">
                <Label htmlFor="blur-background" className="text-sm text-gray-300">Arka Plan Bulanıklığı</Label>
                <Switch
                  id="blur-background"
                  checked={imageProcessingOptions.blurBackground}
                  onCheckedChange={(checked) => handleOptionChange('blurBackground', checked)}
                />
              </div>
              
              {/* Özel Maske Seçimi */}
              <div>
                <Label htmlFor="custom-mask" className="block text-sm text-gray-300 mb-2">Özel Maske</Label>
                <select
                  id="custom-mask"
                  value={imageProcessingOptions.customMaskId}
                  onChange={(e) => handleOptionChange('customMaskId', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="none">Maske Yok</option>
                  <option value="zuhre-planet-logo">Zuhre Planet Logo</option>
                  <option value="galaxy-blur">Galaksi Blur</option>
                </select>
              </div>

              {/* Parlaklık */}
              <div>
                <Label htmlFor="brightness" className="block text-sm text-gray-300 mb-2">
                  Parlaklık ({imageProcessingOptions.brightnessAdjustment.toFixed(1)})
                </Label>
                <Slider
                  id="brightness"
                  min={-1}
                  max={1}
                  step={0.1}
                  value={[imageProcessingOptions.brightnessAdjustment]}
                  onValueChange={(value) => handleOptionChange('brightnessAdjustment', value[0])}
                  className="[&>*]:bg-purple-600 [&>*]:h-2 [&>span]:w-4 [&>span]:h-4"
                />
              </div>

              {/* Kontrast */}
              <div>
                <Label htmlFor="contrast" className="block text-sm text-gray-300 mb-2">
                  Kontrast ({imageProcessingOptions.contrastAdjustment.toFixed(1)})
                </Label>
                <Slider
                  id="contrast"
                  min={-1}
                  max={1}
                  step={0.1}
                  value={[imageProcessingOptions.contrastAdjustment]}
                  onValueChange={(value) => handleOptionChange('contrastAdjustment', value[0])}
                  className="[&>*]:bg-purple-600 [&>*]:h-2 [&>span]:w-4 [&>span]:h-4"
                />
              </div>
            </div>

            <Button onClick={handleSave} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-lg py-3">
              <Save className="w-5 h-5 mr-2" /> Değişiklikleri Onaya Gönder
            </Button>
          </div>

          {/* Sağ Panel: Önizleme */}
          <div className="md:col-span-2 bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center relative min-h-[400px]">
            <h3 className="text-xl font-bold text-white mb-4">Görsel Önizleme</h3>
            {originalImage ? (
              <div className="relative w-full max-w-md h-auto rounded-xl overflow-hidden shadow-2xl border border-white/20">
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-12 h-12 text-purple-400"
                    >
                      <Sparkles className="w-full h-full" />
                    </motion.div>
                  </div>
                )}
                <img 
                  src={processedImage || originalImage} 
                  alt="Processed Preview" 
                  className="w-full h-auto object-contain" 
                  onLoad={() => setIsProcessing(false)}
                />
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <Camera className="w-16 h-16 mx-auto mb-4" />
                <p>Lütfen bir görsel yükleyin.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}