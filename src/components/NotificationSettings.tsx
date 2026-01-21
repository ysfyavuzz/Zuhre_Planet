/**
 * Notification Settings Component
 *
 * Comprehensive notification preferences panel.
 * Allows users to customize notification channels, categories, and quiet hours.
 *
 * @module components/NotificationSettings
 * @category Components - Notification
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Bell,
  BellOff,
  Mail,
  MessageSquare,
  Smartphone,
  Moon,
  Sun,
  Save,
  RotateCcw,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  NotificationPreferences,
  NotificationCategory,
  NOTIFICATION_CATEGORY_INFO,
  DEFAULT_NOTIFICATION_PREFERENCES,
  NOTIFICATION_SOUNDS,
} from '@/types/notification';

interface NotificationSettingsProps {
  preferences: NotificationPreferences;
  pushEnabled: boolean;
  pushPermission: NotificationPermission;
  onUpdate: (preferences: Partial<NotificationPreferences>) => void;
  onRequestPushPermission: () => Promise<boolean>;
  onSendTestNotification?: () => void;
  className?: string;
}

export function NotificationSettings({
  preferences,
  pushEnabled,
  pushPermission,
  onUpdate,
  onRequestPushPermission,
  onSendTestNotification,
  className = '',
}: NotificationSettingsProps) {
  const [localPrefs, setLocalPrefs] = useState<NotificationPreferences>(preferences);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = () => {
    onUpdate(localPrefs);
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalPrefs(DEFAULT_NOTIFICATION_PREFERENCES);
    setHasChanges(true);
  };

  const updateLocalPrefs = (updates: Partial<NotificationPreferences>) => {
    setLocalPrefs(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const updateChannel = (channel: keyof NotificationPreferences['channels'], value: boolean) => {
    updateLocalPrefs({
      channels: {
        ...localPrefs.channels,
        [channel]: value,
      },
    });
  };

  const updateCategory = (category: NotificationCategory, updates: Partial<NotificationPreferences['categories'][NotificationCategory]>) => {
    updateLocalPrefs({
      categories: {
        ...localPrefs.categories,
        [category]: {
          ...localPrefs.categories[category],
          ...updates,
        },
      },
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bildirim Ayarları</h2>
          <p className="text-muted-foreground">
            Size en uygun bildirim tercihlerini seçin
          </p>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Sıfırla
            </Button>
          )}
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="w-4 h-4 mr-2" />
            Kaydet
          </Button>
        </div>
      </div>

      {/* Push Notifications */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              {pushEnabled ? (
                <Wifi className="w-5 h-5 text-blue-500" />
              ) : (
                <WifiOff className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <h3 className="font-bold">Push Bildirimleri</h3>
              <p className="text-sm text-muted-foreground">
                {pushPermission === 'granted'
                  ? 'Tarayıcı bildirimleri aktif'
                  : pushPermission === 'denied'
                  ? 'Tarayıcı bildirimleri engellendi'
                  : 'Tarayıcı bildirimleri kapalı'}
              </p>
            </div>
          </div>

          {pushPermission === 'granted' ? (
            <Badge className="bg-green-500">
              <Bell className="w-3 h-3 mr-1" />
              Aktif
            </Badge>
          ) : pushPermission === 'denied' ? (
            <Badge variant="destructive">
              <BellOff className="w-3 h-3 mr-1" />
              Engellendi
            </Badge>
          ) : (
            <Button onClick={onRequestPushPermission}>
              Aktif Et
            </Button>
          )}
        </div>

        {pushPermission === 'granted' && onSendTestNotification && (
          <Button variant="outline" size="sm" onClick={onSendTestNotification}>
            Test Bildirimi Gönder
          </Button>
        )}
      </Card>

      {/* General Settings */}
      <Card className="p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Genel Ayarlar
        </h3>

        <div className="space-y-4">
          {/* Enable All */}
          <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
            <div>
              <p className="font-medium">Bildirimleri Aktif Et</p>
              <p className="text-sm text-muted-foreground">
                Tüm bildirimleri aç veya kapat
              </p>
            </div>
            <Checkbox
              checked={localPrefs.enabled}
              onCheckedChange={(checked) =>
                updateLocalPrefs({ enabled: checked === true })
              }
            />
          </div>

          {/* Channels */}
          <Separator />

          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Bildirim Kanalları
            </p>

            {/* Push */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Push Bildirimleri</p>
                  <p className="text-sm text-muted-foreground">
                    Tarayıcı bildirimleri
                  </p>
                </div>
              </div>
              <Checkbox
                checked={localPrefs.channels.push}
                onCheckedChange={(checked) => updateChannel('push', checked === true)}
              />
            </div>

            {/* Email */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">E-posta</p>
                  <p className="text-sm text-muted-foreground">
                    E-posta bildirimleri
                  </p>
                </div>
              </div>
              <Checkbox
                checked={localPrefs.channels.email}
                onCheckedChange={(checked) => updateChannel('email', checked === true)}
              />
            </div>

            {/* SMS */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">SMS</p>
                  <p className="text-sm text-muted-foreground">
                    Sms bildirimleri
                  </p>
                </div>
              </div>
              <Checkbox
                checked={localPrefs.channels.sms}
                onCheckedChange={(checked) => updateChannel('sms', checked === true)}
              />
            </div>

            {/* In-App */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Uygulama İçi</p>
                  <p className="text-sm text-muted-foreground">
                    Bildirim merkezi
                  </p>
                </div>
              </div>
              <Checkbox
                checked={localPrefs.channels.inApp}
                onCheckedChange={(checked) => updateChannel('inApp', checked === true)}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Category Settings */}
      <Card className="p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Volume2 className="w-5 h-5" />
          Kategori Bazlı Ayarlar
        </h3>

        <div className="space-y-3">
          {Object.values(NOTIFICATION_CATEGORY_INFO).map((cat) => {
            const categoryPrefs = localPrefs.categories[cat.category];
            const isEnabled = categoryPrefs?.enabled ?? true;

            return (
              <div key={cat.category} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                      <p className="font-medium">{cat.label}</p>
                      <p className="text-sm text-muted-foreground">{cat.description}</p>
                    </div>
                  </div>
                  <Checkbox
                    checked={isEnabled}
                    onCheckedChange={(checked) =>
                      updateCategory(cat.category, { enabled: checked === true })
                    }
                  />
                </div>

                {isEnabled && (
                  <div className="flex gap-2 pl-11">
                    {(['push', 'email', 'sms', 'in_app'] as const).map((channel) => (
                      <Badge
                        key={channel}
                        variant={categoryPrefs?.channels?.includes(channel) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => {
                          const currentChannels = categoryPrefs?.channels || [];
                          const newChannels = currentChannels.includes(channel)
                            ? currentChannels.filter(c => c !== channel)
                            : [...currentChannels, channel];
                          updateCategory(cat.category, { channels: newChannels });
                        }}
                      >
                        {channel === 'push' && <Smartphone className="w-3 h-3 mr-1" />}
                        {channel === 'email' && <Mail className="w-3 h-3 mr-1" />}
                        {channel === 'sms' && <MessageSquare className="w-3 h-3 mr-1" />}
                        {channel === 'in_app' && <Bell className="w-3 h-3 mr-1" />}
                        {channel.charAt(0).toUpperCase() + channel.slice(1)}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Quiet Hours */}
      <Card className="p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Moon className="w-5 h-5" />
          Sessiz Saatler
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
            <div>
              <p className="font-medium">Sessiz Saatleri Aktif Et</p>
              <p className="text-sm text-muted-foreground">
                Belirli saatlerde bildirimleri sessize al
              </p>
            </div>
            <Checkbox
              checked={localPrefs.quietHours.enabled}
              onCheckedChange={(checked) =>
                updateLocalPrefs({
                  quietHours: {
                    ...localPrefs.quietHours,
                    enabled: checked === true,
                  },
                })
              }
            />
          </div>

          {localPrefs.quietHours.enabled && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Başlangıç
                </label>
                <Input
                  type="time"
                  value={localPrefs.quietHours.start}
                  onChange={(e) =>
                    updateLocalPrefs({
                      quietHours: {
                        ...localPrefs.quietHours,
                        start: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Bitiş
                </label>
                <Input
                  type="time"
                  value={localPrefs.quietHours.end}
                  onChange={(e) =>
                    updateLocalPrefs({
                      quietHours: {
                        ...localPrefs.quietHours,
                        end: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </motion.div>
          )}
        </div>
      </Card>

      {/* Digest Settings */}
      <Card className="p-6">
        <h3 className="font-bold mb-4">Bildirim Özeti</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
            <div>
              <p className="font-medium">Bildirim Özeti</p>
              <p className="text-sm text-muted-foreground">
                Bildirimleri özet halinde al
              </p>
            </div>
            <Checkbox
              checked={localPrefs.digest.enabled}
              onCheckedChange={(checked) =>
                updateLocalPrefs({
                  digest: {
                    ...localPrefs.digest,
                    enabled: checked === true,
                  },
                })
              }
            />
          </div>

          {localPrefs.digest.enabled && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
            >
              <Select
                value={localPrefs.digest.frequency}
                onValueChange={(value: any) =>
                  updateLocalPrefs({
                    digest: {
                      ...localPrefs.digest,
                      frequency: value,
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Anında</SelectItem>
                  <SelectItem value="hourly">Saatlik</SelectItem>
                  <SelectItem value="daily">Günlük</SelectItem>
                  <SelectItem value="weekly">Haftalık</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          )}
        </div>
      </Card>

      {/* Sound Settings */}
      <Card className="p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Volume2 className="w-5 h-5" />
          Ses Ayarları
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Bildirim Sesi</p>
            <p className="text-sm text-muted-foreground">
              Yeni bildirim geldiğinde çalacak ses
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="default">
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {NOTIFICATION_SOUNDS.map((sound) => (
                  <SelectItem key={sound.id} value={sound.id}>
                    {sound.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <VolumeX className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export { NotificationSettings as default };
