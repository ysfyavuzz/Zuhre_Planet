import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Calendar, Clock, MapPin, User, Mail, Phone,
  Info, CheckCircle2, AlertTriangle, Heart,
  Sparkles, Shield, Star, ArrowRight
} from 'lucide-react';
import { BOOKING_REMINDERS, MESSAGE_RULES, sanitizeMessage } from '@/types/notifications';

interface BookingFormProps {
  escortId: string;
  escortName: string;
  escortAvatar?: string;
  hourlyRate: number;
  availableHours?: string[];
  location?: string;
  onSubmit: (booking: BookingData) => void;
}

interface BookingData {
  date: string;
  time: string;
  duration: number;
  location: string;
  notes: string;
  acceptRules: boolean;
}

export function BookingForm({
  escortId,
  escortName,
  escortAvatar,
  hourlyRate,
  availableHours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'],
  location = 'Escortun Mekanı',
  onSubmit
}: BookingFormProps) {
  const [step, setStep] = useState<'reminder' | 'form'>('reminder');
  const [bookingData, setBookingData] = useState<BookingData>({
    date: '',
    time: '',
    duration: 1,
    location: location,
    notes: '',
    acceptRules: false
  });
  const [violations, setViolations] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Get tomorrow's date as minimum
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Get date 30 days from now as maximum
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const handleNotesChange = (value: string) => {
    // Sanitize notes in real-time
    const { clean, violations: foundViolations } = sanitizeMessage(value);
    setBookingData({ ...bookingData, notes: clean });
    setViolations(foundViolations);

    // Auto-clear violations after 3 seconds if none are critical
    if (foundViolations.length > 0 && !foundViolations.some(v => v.includes('Küfürlü dil'))) {
      setTimeout(() => setViolations([]), 3000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookingData.acceptRules) {
      alert('Lütfen randevu kurallarını kabul edin.');
      return;
    }

    // Final validation
    const { violations: finalViolations } = sanitizeMessage(bookingData.notes);
    if (finalViolations.some(v => v.includes('Küfürlü dil') || v.includes('Yasak içerik'))) {
      alert('Mesajınız uygunsuz içerik içeriyor. Lütfen düzeltin.');
      return;
    }

    onSubmit(bookingData);
    setShowSuccess(true);
  };

  const calculateTotal = () => {
    return hourlyRate * bookingData.duration;
  };

  if (showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto"
      >
        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Randevu Talebi Oluşturuldu!</h3>
            <p className="text-muted-foreground mb-4">
              {escortName} için randevu talebiniz iletildi.
            </p>
            <div className="bg-background rounded-lg p-4 text-left space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tarih:</span>
                <span className="font-semibold">
                  {new Date(bookingData.date).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Saat:</span>
                <span className="font-semibold">{bookingData.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Süre:</span>
                <span className="font-semibold">{bookingData.duration} saat</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-bold">Toplam:</span>
                <span className="font-bold text-primary">₺{calculateTotal()}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Escort onayladığında bildirim alacaksınız.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Before Booking Reminders */}
      <AnimatePresence mode="wait">
        {step === 'reminder' && (
          <motion.div
            key="reminder"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <Card className="border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  {BOOKING_REMINDERS.beforeBooking.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {BOOKING_REMINDERS.beforeBooking.messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-lg ${
                      msg.variant === 'warning'
                        ? 'bg-amber-500/10 border border-amber-500/20'
                        : 'bg-blue-500/10 border border-blue-500/20'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 mt-0.5 shrink-0" />
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))}

                {/* Politeness Tips */}
                <div className="mt-4 p-4 bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-pink-700 dark:text-pink-400 mb-2">Nazik Olun</h4>
                      <p className="text-sm text-pink-600 dark:text-pink-300">
                        Lütfen randevu talebi oluştururken kibar ve saygılı olun. Escortlar nazik müşterileri tercih eder.
                      </p>
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="p-2 bg-background rounded text-xs">
                          <span className="text-green-600">✓</span> Merhaba, randevu alabilir miyim?
                        </div>
                        <div className="p-2 bg-background rounded text-xs">
                          <span className="text-red-600">✗</span> &gt; Ayıp, acelesi var mı?
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={() => setStep('form')}
              className="w-full"
              size="lg"
            >
              Devam Et
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Form */}
      <AnimatePresence mode="wait">
        {step === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  {escortAvatar ? (
                    <img src={escortAvatar} alt={escortName} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  <div>
                    <CardTitle>{escortName}</CardTitle>
                    <p className="text-sm text-muted-foreground">Randevu Talebi Oluştur</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Date Selection */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      Tarih
                    </label>
                    <Input
                      type="date"
                      min={minDate}
                      max={maxDateStr}
                      value={bookingData.date}
                      onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                      required
                    />
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                      <Clock className="w-4 h-4 text-primary" />
                      Saat
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                      {availableHours.map((hour) => (
                        <button
                          key={hour}
                          type="button"
                          onClick={() => setBookingData({ ...bookingData, time: hour })}
                          className={`p-2 rounded-lg text-sm font-medium transition-all ${
                            bookingData.time === hour
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted hover:bg-muted/70'
                          }`}
                        >
                          {hour}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Duration Selection */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                      <Clock className="w-4 h-4 text-primary" />
                      Süre
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((dur) => (
                        <button
                          key={dur}
                          type="button"
                          onClick={() => setBookingData({ ...bookingData, duration: dur })}
                          className={`p-3 rounded-lg text-center transition-all ${
                            bookingData.duration === dur
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted hover:bg-muted/70'
                          }`}
                        >
                          <div className="text-lg font-bold">{dur}</div>
                          <div className="text-xs">saat</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes Field with Warnings */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                      <Info className="w-4 h-4 text-primary" />
                      Notlar (Opsiyonel)
                    </label>
                    <Textarea
                      value={bookingData.notes}
                      onChange={(e) => handleNotesChange(e.target.value)}
                      placeholder="Randevu hakkında notlarınız... (Kibar olun 😊)"
                      className="min-h-[100px]"
                      maxLength={500}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">
                        {bookingData.notes.length} / 500
                      </p>
                      {violations.length > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          İçerik uyarısı
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Violations Display */}
                  <AnimatePresence>
                    {violations.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                      >
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">
                              Uyarı:
                            </p>
                            <ul className="text-sm text-red-600 dark:text-red-300 space-y-1">
                              {violations.map((v, i) => (
                                <li key={i}>• {v}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Price Summary */}
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Saatlik ücret:</span>
                      <span className="font-semibold">₺{hourlyRate}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Süre:</span>
                      <span className="font-semibold">{bookingData.duration} saat</span>
                    </div>
                    <div className="border-t border-border pt-2 flex items-center justify-between">
                      <span className="font-bold">Toplam:</span>
                      <span className="text-xl font-black text-primary">₺{calculateTotal()}</span>
                    </div>
                  </div>

                  {/* Rules Acceptance */}
                  <div className="space-y-3">
                    <Card className="border-amber-500/30 bg-amber-500/5">
                      <CardContent className="p-4">
                        <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                          <Shield className="w-4 h-4 text-amber-500" />
                          Randevu Kuralları
                        </h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            <span>Randevu saatinde hazır ve temiz olacağım</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            <span>Geç kalacağımı en az 2 saat önce bildireceğim</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            <span>Randevuyu iptal edeceksenim 24 saat önce haber vereceğim</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            <span>Nazik ve saygılı davranacağım</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="acceptRules"
                        checked={bookingData.acceptRules}
                        onCheckedChange={(checked) =>
                          setBookingData({ ...bookingData, acceptRules: checked as boolean })
                        }
                        className="mt-1"
                      />
                      <label
                        htmlFor="acceptRules"
                        className="text-sm leading-tight cursor-pointer select-none"
                      >
                        Yukarıdaki kuralları okudum ve kabul ediyorum. Kural ihlali durumunda platform
                        sorumlu değildir.
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep('reminder')}
                      className="flex-1"
                    >
                      Geri
                    </Button>
                    <Button
                      type="submit"
                      disabled={!bookingData.acceptRules || !bookingData.date || !bookingData.time}
                      className="flex-1"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Randevu Talebi Oluştur
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* After Booking Info */}
      {step === 'form' && (
        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-green-700 dark:text-green-400 mb-2">
                  {BOOKING_REMINDERS.afterBooking.title}
                </h4>
                <ul className="space-y-1 text-sm text-green-600 dark:text-green-300">
                  {BOOKING_REMINDERS.afterBooking.messages.map((msg, i) => (
                    <li key={i}>• {msg.text}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Booking Reminders Display Component
export function BookingReminders({ type, date, time }: { type: '24h' | '2h'; date: string; time: string }) {
  const reminder = BOOKING_REMINDERS.reminders[type];

  return (
    <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold mb-1">{reminder.title}</h4>
            <p className="text-sm text-muted-foreground mb-3">
              {reminder.message.replace('{date}', date).replace('{time}', time)}
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Onayla
              </Button>
              <Button size="sm" variant="ghost">
                İptal et
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
