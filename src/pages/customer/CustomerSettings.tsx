/**
 * CustomerSettings Page
 * 
 * Customer settings and preferences management.
 * Allows customers to update profile, preferences, and account settings.
 * 
 * @page
 * @category Customer
 */

import * as React from 'react';
import { User, Mail, Phone, MapPin, Bell, Shield, CreditCard, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function CustomerSettings() {
  const [activeTab, setActiveTab] = React.useState<'profile' | 'preferences' | 'notifications' | 'security'>('profile');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hesap Ayarları</h1>
          <p className="text-gray-500 mt-1">Hesabınızı ve tercihlerinizi yönetin</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <nav className="space-y-1">
                {[
                  { id: 'profile', label: 'Profil Bilgileri', icon: User },
                  { id: 'preferences', label: 'Tercihler', icon: MapPin },
                  { id: 'notifications', label: 'Bildirimler', icon: Bell },
                  { id: 'security', label: 'Güvenlik', icon: Shield },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-pink-50 text-pink-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Profil Bilgileri</h2>
                    
                    {/* Profile Photo */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                        A
                      </div>
                      <div>
                        <Button variant="outline" size="sm">Fotoğraf Değiştir</Button>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG veya GIF. Max 5MB</p>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Kullanıcı Adı</Label>
                        <Input id="username" defaultValue="ahmet_k" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="fullname">Ad Soyad</Label>
                        <Input id="fullname" defaultValue="Ahmet Kaya" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">E-posta</Label>
                        <div className="flex gap-2">
                          <Input id="email" type="email" defaultValue="ahmet@example.com" />
                          <Badge variant="secondary">Doğrulanmış</Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefon</Label>
                        <Input id="phone" type="tel" defaultValue="+905551234567" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">Şehir</Label>
                        <select id="city" className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                          <option>İstanbul</option>
                          <option>Ankara</option>
                          <option>İzmir</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="district">İlçe</Label>
                        <select id="district" className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                          <option>Kadıköy</option>
                          <option>Beşiktaş</option>
                          <option>Şişli</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                      <Button className="bg-pink-600 hover:bg-pink-700">Değişiklikleri Kaydet</Button>
                      <Button variant="outline">İptal</Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Tercihler</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Tercih Edilen Şehirler</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {['İstanbul', 'Ankara', 'İzmir'].map((city) => (
                          <Badge key={city} variant="secondary" className="cursor-pointer">
                            {city} <X className="w-3 h-3 ml-1" />
                          </Badge>
                        ))}
                        <Button variant="outline" size="sm">+ Ekle</Button>
                      </div>
                    </div>

                    <div>
                      <Label>Favori Hizmetler</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {['Klasik Masaj', 'Rahatlama'].map((service) => (
                          <Badge key={service} variant="secondary" className="cursor-pointer">
                            {service} <X className="w-3 h-3 ml-1" />
                          </Badge>
                        ))}
                        <Button variant="outline" size="sm">+ Ekle</Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Yaş Aralığı</Label>
                        <div className="flex gap-2 mt-2">
                          <Input type="number" placeholder="Min" defaultValue="22" />
                          <Input type="number" placeholder="Max" defaultValue="35" />
                        </div>
                      </div>

                      <div>
                        <Label>Fiyat Aralığı (₺)</Label>
                        <div className="flex gap-2 mt-2">
                          <Input type="number" placeholder="Min" defaultValue="500" />
                          <Input type="number" placeholder="Max" defaultValue="1500" />
                        </div>
                      </div>
                    </div>

                    <Button className="bg-pink-600 hover:bg-pink-700">Kaydet</Button>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Bildirim Ayarları</h2>
                  
                  <div className="space-y-4">
                    {[
                      { id: 'email', label: 'E-posta Bildirimleri', desc: 'Yeni mesajlar ve randevular için e-posta al' },
                      { id: 'sms', label: 'SMS Bildirimleri', desc: 'Önemli bildirimler için SMS al' },
                      { id: 'push', label: 'Push Bildirimleri', desc: 'Tarayıcı bildirimleri al' },
                      { id: 'marketing', label: 'Pazarlama E-postaları', desc: 'Kampanya ve özel teklifler hakkında bilgi al' },
                    ].map((item) => (
                      <div key={item.id} className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.label}</p>
                          <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                        </div>
                        <input type="checkbox" defaultChecked className="mt-1" />
                      </div>
                    ))}

                    <Button className="bg-pink-600 hover:bg-pink-700">Kaydet</Button>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Güvenlik</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="current-password">Mevcut Şifre</Label>
                      <Input id="current-password" type="password" />
                    </div>

                    <div>
                      <Label htmlFor="new-password">Yeni Şifre</Label>
                      <Input id="new-password" type="password" />
                    </div>

                    <div>
                      <Label htmlFor="confirm-password">Yeni Şifre Tekrar</Label>
                      <Input id="confirm-password" type="password" />
                    </div>

                    <Button className="bg-pink-600 hover:bg-pink-700">Şifreyi Güncelle</Button>
                  </div>

                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Hesap İşlemleri</h3>
                    <Button variant="destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Hesabı Sil
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
