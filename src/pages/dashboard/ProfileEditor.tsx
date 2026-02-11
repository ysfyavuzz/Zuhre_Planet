/**
 * Profile Editor (Dashboard)
 * 
 * Escort kullanıcılarının profil bilgilerini düzenlediği sayfa.
 * KRİTİK: Yapılan değişiklikler anında yayına girmez, 'Pending' (Onay Bekliyor)
 * statüsüne alınır ve Admin onayına sunulur.
 */

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ListingProfile } from '@/types/domain';
import { listingService } from '@/services/listingService';
import { 
  Save, AlertTriangle, CheckCircle2, Clock, 
  User, MapPin, FileText, Info, Camera, Paintbrush, SlidersHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProfileEditor() {
  const [profile, setProfile] = useState<ListingProfile | null>(null);
  const [formData, setFormData] = useState<Partial<ListingProfile>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Veriyi Yükle
  useEffect(() => {
    // Simüle edilmiş veri yükleme (Normalde auth user id ile çekilir)
    const fetchProfile = async () => {
      const data = await listingService.getListingBySlug('elara-moon-vip'); // Mock user
      if (data) {
        setProfile(data);
        // Eğer bekleyen değişiklik varsa onu forma doldur, yoksa mevcut profili doldur
        setFormData(data.pendingChanges || data);
        setHasPendingChanges(!!data.pendingChanges);
      }
      setIsLoading(false);
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (name.startsWith('mediaPrivacySettings.')) {
      const settingName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        mediaPrivacySettings: {
          ...prev.mediaPrivacySettings,
          [settingName]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value),
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name.startsWith('mediaPrivacySettings.')) {
      const settingName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        mediaPrivacySettings: {
          ...prev.mediaPrivacySettings,
          [settingName]: value,
        }
      }));
    }
  };

  const handleSave = async () => {
    // Burada API'ye "Update Request" atılır
    // Simülasyon:
    setHasPendingChanges(true);
    setShowSuccessMessage(true);
    
    // 3 saniye sonra başarı mesajını gizle
    setTimeout(() => setShowSuccessMessage(false), 5000);
    
    console.log("Değişiklikler onaya gönderildi:", formData);
  };

  if (isLoading) return <div className="text-white p-10">Yükleniyor...</div>;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* --- DURUM BİLDİRİMİ --- */}
        {hasPendingChanges && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-4 animate-in slide-in-from-top-4">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h3 className="text-amber-400 font-bold mb-1">Onay Bekleyen Değişiklikler Var</h3>
              <p className="text-amber-200/60 text-sm">
                Profilinizde yaptığınız son düzenlemeler şu an admin onayındadır. 
                Onaylanana kadar profilinizde eski bilgileriniz görüntülenmeye devam edecektir.
              </p>
            </div>
          </div>
        )}

        {showSuccessMessage && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 flex items-center gap-4 fixed top-8 right-8 z-[100] shadow-2xl backdrop-blur-md">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            <div className="text-green-400 font-bold">Değişiklikler başarıyla onaya gönderildi!</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol Kolon: Temel Bilgiler */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Kart 1: Kimlik Bilgileri */}
            <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold font-orbitron mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-purple-400" />
                Kimlik Bilgileri
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Görünen İsim (Sahne Adı)</label>
                  <Input 
                    name="displayName"
                    value={formData.displayName || ''} 
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 text-white focus:border-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Slogan (Kart Üzerinde Görünür)</label>
                  <Input 
                    name="slogan"
                    value={formData.slogan || ''} 
                    onChange={handleChange}
                    placeholder="Örn: Galaksinin en parlak yıldızı..."
                    className="bg-white/5 border-white/10 text-white focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Yaş</label>
                    <Input 
                      name="age"
                      type="number"
                      value={formData.age || ''} 
                      onChange={handleChange}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Şehir</label>
                    <Input 
                      name="city"
                      value={formData.city || ''} 
                      onChange={handleChange}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Kart 2: Biyografi */}
            <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold font-orbitron mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Biyografi & Detaylar
              </h3>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Kendinizi Tanıtın</label>
                <textarea 
                  name="biography"
                  rows={6}
                  value={formData.biography || ''} 
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors placeholder:text-gray-600"
                  placeholder="Müşterilerinize kendinizden bahsedin..."
                />
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Biyografinizde telefon numarası veya dış bağlantı paylaşmak yasaktır.
                </p>
              </div>
            </div>

            {/* Kart 3: AI Destekli Medya Ayarları */}
            <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold font-orbitron mb-6 flex items-center gap-2">
                <Camera className="w-5 h-5 text-green-400" />
                AI Destekli Medya Ayarları
              </h3>
              
              <div className="space-y-4">
                {/* Yüz Maskeleme */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Yüz Maskeleme</label>
                    <p className="text-xs text-gray-500">
                      Görsellerinizdeki yüzler otomatik olarak maskelenir.
                    </p>
                  </div>
                  <button 
                    name="mediaPrivacySettings.faceMaskingEnabled"
                    role="switch"
                    aria-checked={formData.mediaPrivacySettings?.faceMaskingEnabled || false}
                    onClick={() => handleSelectChange('mediaPrivacySettings.faceMaskingEnabled', String(!formData.mediaPrivacySettings?.faceMaskingEnabled))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 ${formData.mediaPrivacySettings?.faceMaskingEnabled ? 'bg-purple-600' : 'bg-gray-700'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.mediaPrivacySettings?.faceMaskingEnabled ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>

                {/* Arka Plan Bulanıklaştırma */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Arka Plan Bulanıklaştırma</label>
                    <p className="text-xs text-gray-500">
                      Görsellerinizin arka planı otomatik olarak bulanıklaştırılır.
                    </p>
                  </div>
                  <button 
                    name="mediaPrivacySettings.blurBackground"
                    role="switch"
                    aria-checked={formData.mediaPrivacySettings?.blurBackground || false}
                    onClick={() => handleSelectChange('mediaPrivacySettings.blurBackground', String(!formData.mediaPrivacySettings?.blurBackground))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 ${formData.mediaPrivacySettings?.blurBackground ? 'bg-purple-600' : 'bg-gray-700'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.mediaPrivacySettings?.blurBackground ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>

                {/* Özel Maske Seçimi */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Özel Maske Seçimi</label>
                  <Select 
                    name="mediaPrivacySettings.customMaskId"
                    value={formData.mediaPrivacySettings?.customMaskId || ''} 
                    onValueChange={(value) => handleSelectChange('mediaPrivacySettings.customMaskId', value)}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-purple-500">
                      <SelectValue placeholder="Maske Seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Maske Yok</SelectItem>
                      <SelectItem value="zuhre-planet-logo">Zuhre Planet Logo</SelectItem>
                      <SelectItem value="galaxy-blur">Galaksi Blur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Parlaklık Ayarı */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-gray-500" /> Parlaklık ({formData.mediaPrivacySettings?.brightnessAdjustment || 0})
                  </label>
                  <Input
                    name="mediaPrivacySettings.brightnessAdjustment"
                    type="range"
                    min="-1"
                    max="1"
                    step="0.1"
                    value={formData.mediaPrivacySettings?.brightnessAdjustment || 0}
                    onChange={handleChange}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>

                {/* Kontrast Ayarı */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-gray-500" /> Kontrast ({formData.mediaPrivacySettings?.contrastAdjustment || 0})
                  </label>
                  <Input
                    name="mediaPrivacySettings.contrastAdjustment"
                    type="range"
                    min="-1"
                    max="1"
                    step="0.1"
                    value={formData.mediaPrivacySettings?.contrastAdjustment || 0}
                    onChange={handleChange}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>

              </div>
            </div>

          </div>

          {/* Sağ Kolon: Fiyat ve Aksiyon */}
          <div className="space-y-6">
            
            <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 shadow-xl sticky top-8">
              <h3 className="text-lg font-bold font-orbitron mb-6 text-green-400">
                Fiyatlandırma
              </h3>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Saatlik Ücret</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₺</span>
                    <Input 
                      name="hourlyRate"
                      type="number"
                      value={formData.rates?.hourly || ''} 
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        rates: { ...prev.rates, hourly: Number(e.target.value), currency: 'TRY' }
                      }))}
                      className="bg-white/5 border-white/10 text-white pl-8 font-bold text-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-white/10">
                <Button 
                  onClick={handleSave}
                  className="w-full py-6 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-900/40"
                >
                  <Save className="w-5 h-5 mr-2" />
                  ONAYA GÖNDER
                </Button>
                <p className="text-xs text-center text-gray-500">
                  Değişiklikler admin onayından sonra yayınlanır.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
