/**
 * Admin Settings Page
 *
 * Sistem ayarlarının yönetildiği sayfa.
 *
 * @module pages/AdminSettings
 * @category Pages - Admin
 *
 * Features:
 * - Genel ayarlar (bildirimler, güvenlik)
 * - Site ayarları (isim, URL, meta)
 * - E-posta ayarları (SMTP)
 * - Dil tercihi
 * - Tema seçenekleri
 * - Veritabanı yedekleme
 *
 * Settings:
 * - notifications: E-posta bildirimleri
 * - security: İki faktörlü doğrulama
 * - theme: Koyu mod
 * - language: Varsayılan dil (tr/en/de)
 * - database: Otomatik yedekleme
 *
 * @example
 * ```tsx
 * // Route: /admin/settings
 * <AdminSettings />
 * ```
 */

import * as React from 'react';
import { AdminSidebar } from '@/components/admin';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Bell, Lock, Palette, Globe, Database } from 'lucide-react';

interface Setting {
  icon: React.ReactNode;
  title: string;
  description: string;
  value: string | boolean;
}

export default function AdminSettings() {
  const [settings, setSettings] = React.useState<Setting[]>([
    {
      icon: <Bell className="w-5 h-5" />,
      title: 'Bildirimler',
      description: 'E-posta bildirimleri',
      value: true
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: 'Güvenlik',
      description: 'İki faktörlü doğrulama',
      value: true
    },
    {
      icon: <Palette className="w-5 h-5" />,
      title: 'Tema',
      description: 'Koyu mod',
      value: false
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: 'Dil',
      description: 'Varsayılan dil',
      value: 'tr'
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: 'Veritabanı',
      description: 'Otomatik yedekleme',
      value: true
    }
  ]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ayarlar</h1>
              <p className="text-gray-500 mt-1">Sistem ayarlarını yönetin</p>
            </div>
            <Button>
              <Settings className="w-4 h-4 mr-2" />
              Kaydet
            </Button>
          </div>

          {/* General Settings */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Genel Ayarlar</h3>
            <div className="space-y-4">
              {settings.map((setting, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-4 border-b last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                      {setting.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{setting.title}</h4>
                      <p className="text-sm text-gray-500">{setting.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {typeof setting.value === 'boolean' ? (
                      <button
                        className={`w-12 h-6 rounded-full transition-colors ${
                          setting.value ? 'bg-pink-600' : 'bg-gray-300'
                        }`}
                        onClick={() => {
                          const newSettings = [...settings];
                          newSettings[index].value = !setting.value as boolean;
                          setSettings(newSettings);
                        }}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                            setting.value ? 'translate-x-6' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    ) : (
                      <select
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                        value={setting.value as string}
                        onChange={(e) => {
                          const newSettings = [...settings];
                          newSettings[index].value = e.target.value;
                          setSettings(newSettings);
                        }}
                      >
                        <option value="tr">Türkçe</option>
                        <option value="en">English</option>
                        <option value="de">Deutsch</option>
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Site Settings */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Site Ayarları</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Adı
                </label>
                <input
                  type="text"
                  defaultValue="Escilan Escort"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site URL
                </label>
                <input
                  type="url"
                  defaultValue="https://zuhreplanet.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  defaultValue="Türkiye'nin en iyi escort ilan platformu"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </Card>

          {/* Email Settings */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">E-posta Ayarları</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Host
                </label>
                <input
                  type="text"
                  placeholder="smtp.example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Port
                </label>
                <input
                  type="number"
                  placeholder="587"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gönderen E-posta
                </label>
                <input
                  type="email"
                  placeholder="noreply@zuhreplanet.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline">İptal</Button>
            <Button>Değişiklikleri Kaydet</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
