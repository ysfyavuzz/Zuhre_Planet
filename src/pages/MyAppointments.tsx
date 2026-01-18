import { useState } from 'react';
import { Link } from 'wouter';
import { trpc } from '../lib/trpc';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { 
  Calendar, Clock, MapPin, Phone, MessageCircle, Star,
  CheckCircle2, XCircle, AlertCircle, ArrowLeft, Eye,
  User, DollarSign, FileText, MoreVertical
} from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

type AppointmentStatus = 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';

const statusConfig: Record<AppointmentStatus, { 
  label: string; 
  color: string; 
  icon: any;
  bgColor: string;
}> = {
  pending: {
    label: 'Onay Bekliyor',
    color: 'text-amber-600',
    icon: AlertCircle,
    bgColor: 'bg-amber-500/10 border-amber-500/20',
  },
  confirmed: {
    label: 'Onaylandı',
    color: 'text-green-600',
    icon: CheckCircle2,
    bgColor: 'bg-green-500/10 border-green-500/20',
  },
  rejected: {
    label: 'Reddedildi',
    color: 'text-red-600',
    icon: XCircle,
    bgColor: 'bg-red-500/10 border-red-500/20',
  },
  completed: {
    label: 'Tamamlandı',
    color: 'text-blue-600',
    icon: CheckCircle2,
    bgColor: 'bg-blue-500/10 border-blue-500/20',
  },
  cancelled: {
    label: 'İptal Edildi',
    color: 'text-gray-600',
    icon: XCircle,
    bgColor: 'bg-gray-500/10 border-gray-500/20',
  },
};

function AppointmentCard({ appointment, onCancel }: { appointment: any; onCancel: (id: number) => void }) {
  const config = statusConfig[appointment.status as AppointmentStatus];
  const StatusIcon = config.icon;
  const isUpcoming = appointment.status === 'confirmed' || appointment.status === 'pending';
  const canCancel = appointment.status === 'pending' || appointment.status === 'confirmed';

  return (
    <Card className="card-premium hover-lift">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            {/* Escort Avatar */}
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-bold text-xl overflow-hidden">
              {appointment.escort?.profilePhoto ? (
                <img 
                  src={appointment.escort.profilePhoto} 
                  alt={appointment.escort.displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{appointment.escort?.displayName?.[0] || 'E'}</span>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg">
                  {appointment.escort?.displayName || 'Escort'}
                </h3>
                {appointment.escort?.isVerifiedByAdmin && (
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {appointment.escort?.city}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  5.0
                </div>
              </div>
            </div>
          </div>

          <Badge className={`${config.bgColor} ${config.color} border px-3 py-1`}>
            <StatusIcon className="w-3.5 h-3.5 mr-1" />
            {config.label}
          </Badge>
        </div>

        <Separator className="my-4" />

        {/* Appointment Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Calendar className="w-5 h-5 text-primary" />
            <div>
              <div className="text-xs text-muted-foreground">Tarih</div>
              <div className="font-semibold">
                {format(new Date(appointment.appointmentDate), 'dd MMMM yyyy', { locale: tr })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <div className="text-xs text-muted-foreground">Saat</div>
              <div className="font-semibold">
                {format(new Date(appointment.appointmentDate), 'HH:mm')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <div className="text-xs text-muted-foreground">Süre</div>
              <div className="font-semibold">{appointment.duration} saat</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <DollarSign className="w-5 h-5 text-primary" />
            <div>
              <div className="text-xs text-muted-foreground">Ücret</div>
              <div className="font-semibold">₺{appointment.totalPrice}</div>
            </div>
          </div>
        </div>

        {appointment.notes && (
          <>
            <Separator className="my-4" />
            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
              <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <div className="text-xs text-muted-foreground mb-1">Notlar</div>
                <p className="text-sm">{appointment.notes}</p>
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4">
          <Link href={`/escort/${appointment.escortId}`}>
            <Button variant="outline" className="flex-1">
              <Eye className="w-4 h-4 mr-2" />
              Profili Görüntüle
            </Button>
          </Link>
          
          <Link href="/messages">
            <Button variant="outline" className="flex-1">
              <MessageCircle className="w-4 h-4 mr-2" />
              Mesaj Gönder
            </Button>
          </Link>

          {canCancel && (
            <Button 
              variant="destructive" 
              onClick={() => onCancel(appointment.id)}
              className="flex-1"
            >
              <XCircle className="w-4 h-4 mr-2" />
              İptal Et
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function MyAppointments() {
  const [activeTab, setActiveTab] = useState('upcoming');

  const { data: user } = trpc.auth.me.useQuery();
  const { data: appointments = [], refetch } = trpc.appointments.listCustomerAppointments.useQuery(
    undefined,
    { enabled: !!user }
  );

  const cancelMutation = trpc.appointments.cancel.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleCancel = (appointmentId: number) => {
    if (confirm('Randevuyu iptal etmek istediğinizden emin misiniz?')) {
      cancelMutation.mutate({ appointmentId });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="card-premium p-12 text-center max-w-md">
          <Calendar className="w-20 h-20 mx-auto mb-6 text-muted-foreground/30" />
          <h3 className="text-2xl font-bold mb-3">Giriş Yapın</h3>
          <p className="text-muted-foreground mb-6">
            Randevularınızı görüntülemek için giriş yapmalısınız.
          </p>
          <Button className="w-full bg-gradient-to-r from-primary to-accent">
            Giriş Yap
          </Button>
        </Card>
      </div>
    );
  }

  const upcomingAppointments = appointments.filter(
    a => a.status === 'pending' || a.status === 'confirmed'
  );
  const pastAppointments = appointments.filter(
    a => a.status === 'completed' || a.status === 'rejected' || a.status === 'cancelled'
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Randevularım
                </h1>
                <p className="text-sm text-muted-foreground">
                  Tüm randevularınızı buradan yönetin
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="max-w-5xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="card-premium">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Yaklaşan</p>
                    <p className="text-3xl font-bold">{upcomingAppointments.length}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/10">
                    <AlertCircle className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-premium">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tamamlanan</p>
                    <p className="text-3xl font-bold">
                      {appointments.filter(a => a.status === 'completed').length}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-green-500/10">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-premium">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Toplam</p>
                    <p className="text-3xl font-bold">{appointments.length}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Appointments List */}
          <Card className="card-premium">
            <CardHeader>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upcoming">
                    Yaklaşan ({upcomingAppointments.length})
                  </TabsTrigger>
                  <TabsTrigger value="past">
                    Geçmiş ({pastAppointments.length})
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>

            <CardContent className="p-6">
              <Tabs value={activeTab} className="w-full">
                <TabsContent value="upcoming" className="space-y-4 mt-0">
                  {upcomingAppointments.length > 0 ? (
                    upcomingAppointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        onCancel={handleCancel}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                      <h3 className="text-xl font-bold mb-2">Yaklaşan Randevu Yok</h3>
                      <p className="text-muted-foreground mb-6">
                        Henüz yaklaşan randevunuz bulunmuyor.
                      </p>
                      <Link href="/escorts">
                        <Button className="bg-gradient-to-r from-primary to-accent">
                          Escort Ara
                        </Button>
                      </Link>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="past" className="space-y-4 mt-0">
                  {pastAppointments.length > 0 ? (
                    pastAppointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        onCancel={handleCancel}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                      <h3 className="text-xl font-bold mb-2">Geçmiş Randevu Yok</h3>
                      <p className="text-muted-foreground">
                        Henüz tamamlanmış randevunuz bulunmuyor.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
