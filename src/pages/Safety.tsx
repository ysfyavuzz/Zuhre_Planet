/**
 * Safety Guide Page
 * 
 * Comprehensive safety information and guidelines for platform users.
 * Provides tips for safe interactions, verification processes, and reporting.
 * 
 * @module pages/Safety
 * @category Pages - Legal
 * 
 * Features:
 * - Personal safety guidelines
 * - Verification process explanation
 * - Report and block features guide
 * - Privacy protection tips
 * - Emergency contact information
 * - FAQ section
 * - Responsive design
 * - SEO optimized
 * 
 * @example
 * ```tsx
 * // Route: /safety
 * <Safety />
 * ```
 */

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Link } from 'wouter';
import { SEO } from '@/pages/SEO';
import { Footer } from '@/components/Footer';
import {
    Shield, Lock, Eye, AlertTriangle,
    UserCheck, MessageSquare, Phone, MapPin, Clock,
    Flag, Ban, HelpCircle, ChevronRight,
    Camera, CreditCard, Sparkles, AlertCircle,
    FileText
} from 'lucide-react';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

export default function Safety() {
    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Güvenlik Rehberi | Escort Platform"
                description="Escort Platform güvenlik rehberi. Güvenli kullanım ipuçları, doğrulama süreci, raporlama ve gizlilik bilgileri."
                keywords="güvenlik rehberi, güvenli kullanım, escort güvenlik, doğrulama, raporlama"
            />

            {/* Hero Section */}
            <section className="relative pt-24 pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(34,197,94,0.15),transparent_50%)]" />
                <div className="container relative z-10">
                    <motion.div
                        className="max-w-4xl mx-auto text-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Badge className="mb-6 px-4 py-1.5 text-xs font-bold bg-green-500/10 text-green-500 border-green-500/20 uppercase tracking-widest">
                            <Shield className="w-3.5 h-3.5 mr-2" />
                            Güvenliğiniz Önceliğimiz
                        </Badge>

                        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                            Güvenlik <span className="text-gradient">Rehberi</span>
                        </h1>

                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Platform'u güvenle kullanmanız için hazırladığımız kapsamlı rehber.
                            Kişisel güvenliğinizi korumak için bu kurallara uymanızı öneririz.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Quick Safety Tips */}
            <section className="py-12 container">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { icon: Lock, title: 'Şifrenizi Paylaşmayın', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                        { icon: MapPin, title: 'Herkese Açık Yerlerde Buluşun', color: 'text-green-500', bg: 'bg-green-500/10' },
                        { icon: Phone, title: 'Yakınlarınızı Bilgilendirin', color: 'text-amber-500', bg: 'bg-amber-500/10' },
                        { icon: Flag, title: 'Şüpheli Durumları Bildirin', color: 'text-red-500', bg: 'bg-red-500/10' },
                    ].map((tip, index) => (
                        <motion.div
                            key={tip.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="glass border-white/10 hover:border-white/20 transition-all">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className={`p-3 rounded-xl ${tip.bg}`}>
                                        <tip.icon className={`w-5 h-5 ${tip.color}`} />
                                    </div>
                                    <p className="font-semibold text-sm">{tip.title}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 container">
                <div className="max-w-4xl mx-auto space-y-12">

                    {/* Section 1: Personal Safety */}
                    <motion.div {...fadeInUp}>
                        <Card className="glass border-white/10 overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b border-white/10">
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-green-500/20">
                                        <Shield className="w-6 h-6 text-green-500" />
                                    </div>
                                    Kişisel Güvenlik Kuralları
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-4">
                                    {[
                                        {
                                            icon: MapPin,
                                            title: 'Buluşma Yeri Seçimi',
                                            description: 'İlk buluşmalarda herkese açık, kalabalık mekanları tercih edin. Özel mekanlara gitmeden önce güven oluşturun.'
                                        },
                                        {
                                            icon: Phone,
                                            title: 'Acil Durum Planı',
                                            description: 'Güvendiğiniz bir kişiye nerede olduğunuzu ve ne zaman döneceğinizi bildirin. Acil durum için bir kod kelime belirleyin.'
                                        },
                                        {
                                            icon: Clock,
                                            title: 'Zamanlama',
                                            description: 'İlk buluşmaları gündüz saatlerinde planlayın. Gece buluşmaları için ekstra önlem alın.'
                                        },
                                        {
                                            icon: CreditCard,
                                            title: 'Finansal Güvenlik',
                                            description: 'Asla ön ödeme yapmayın. Platform dışı ödeme talep edenlere dikkat edin. Şüpheli durumları bildirin.'
                                        },
                                    ].map((item, index) => (
                                        <div key={index} className="flex gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                            <div className="p-2 rounded-lg bg-green-500/10 h-fit">
                                                <item.icon className="w-5 h-5 text-green-500" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold mb-1">{item.title}</h4>
                                                <p className="text-sm text-muted-foreground">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Section 2: Verification Process */}
                    <motion.div {...fadeInUp}>
                        <Card className="glass border-white/10 overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-b border-white/10">
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-500/20">
                                        <UserCheck className="w-6 h-6 text-blue-500" />
                                    </div>
                                    Doğrulama Sistemi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <p className="text-muted-foreground">
                                    Platform'umuzda güvenliğiniz için çok aşamalı doğrulama sistemi kullanılmaktadır.
                                    Doğrulanmış profiller özel rozetlerle işaretlenir.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        {
                                            badge: 'Onaylı',
                                            color: 'bg-green-500',
                                            description: 'Kimlik doğrulaması yapılmış'
                                        },
                                        {
                                            badge: 'VIP',
                                            color: 'bg-amber-500',
                                            description: 'Premium üye, ekstra güvenlik'
                                        },
                                        {
                                            badge: 'Fotoğraf Onaylı',
                                            color: 'bg-blue-500',
                                            description: 'Fotoğraflar gerçekliği doğrulanmış'
                                        },
                                    ].map((item, index) => (
                                        <div key={index} className="text-center p-4 rounded-xl bg-white/5">
                                            <Badge className={`${item.color} text-white mb-3`}>{item.badge}</Badge>
                                            <p className="text-xs text-muted-foreground">{item.description}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
                                    <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-sm mb-1">Önemli</p>
                                        <p className="text-xs text-muted-foreground">
                                            Doğrulanmamış profillerle iletişimde ekstra dikkatli olun.
                                            Doğrulama rozetleri profil sayfasında görüntülenir.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Section 3: Reporting */}
                    <motion.div {...fadeInUp}>
                        <Card className="glass border-white/10 overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-b border-white/10">
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-red-500/20">
                                        <Flag className="w-6 h-6 text-red-500" />
                                    </div>
                                    Raporlama ve Engelleme
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <p className="text-muted-foreground">
                                    Şüpheli veya uygunsuz davranışlarla karşılaşırsanız, lütfen derhal bildirin.
                                    Tüm raporlar 24 saat içinde incelenir.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-white/5 space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Flag className="w-5 h-5 text-red-500" />
                                            <h4 className="font-bold">Nasıl Raporlarım?</h4>
                                        </div>
                                        <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                                            <li>Profil sayfasında "Raporla" butonuna tıklayın</li>
                                            <li>Rapor nedenini seçin</li>
                                            <li>Varsa detayları ekleyin</li>
                                            <li>Gönderin</li>
                                        </ol>
                                    </div>

                                    <div className="p-4 rounded-xl bg-white/5 space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Ban className="w-5 h-5 text-orange-500" />
                                            <h4 className="font-bold">Nasıl Engellerim?</h4>
                                        </div>
                                        <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                                            <li>Profil sayfasına gidin</li>
                                            <li>"Engelle" butonuna tıklayın</li>
                                            <li>Onaylayın</li>
                                            <li>Artık mesaj alamazlar</li>
                                        </ol>
                                    </div>
                                </div>

                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                                    <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-red-500" />
                                        Acil Durumlar İçin
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Fiziksel tehlike altındaysanız lütfen 155 (Polis) veya 112 (Acil Yardım)
                                        numaralarını arayın. Ardından durumu bize bildirin.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Section 4: Privacy */}
                    <motion.div {...fadeInUp}>
                        <Card className="glass border-white/10 overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-white/10">
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-purple-500/20">
                                        <Eye className="w-6 h-6 text-purple-500" />
                                    </div>
                                    Gizlilik Koruması
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-4">
                                    {[
                                        {
                                            icon: Lock,
                                            title: 'Kişisel Bilgilerinizi Koruyun',
                                            description: 'Gerçek adınızı, adresinizi veya iş yerinizi paylaşmadan önce güven oluşturun.'
                                        },
                                        {
                                            icon: Camera,
                                            title: 'Fotoğraf Güvenliği',
                                            description: 'Yüzünüzün net görünmediği veya tanınmayacağınız fotoğraflar kullanabilirsiniz. Konum bilgisi içeren fotoğrafları paylaşmayın.'
                                        },
                                        {
                                            icon: MessageSquare,
                                            title: 'Mesajlaşma Güvenliği',
                                            description: 'Platform içi mesajlaşmayı kullanın. Kişisel telefon numaranızı hemen paylaşmayın.'
                                        },
                                        {
                                            icon: CreditCard,
                                            title: 'Finansal Bilgiler',
                                            description: 'Banka bilgilerinizi, kredi kartı numaranızı asla paylaşmayın. Şüpheli ödeme taleplerini bildirin.'
                                        },
                                    ].map((item, index) => (
                                        <div key={index} className="flex gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                            <div className="p-2 rounded-lg bg-purple-500/10 h-fit">
                                                <item.icon className="w-5 h-5 text-purple-500" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold mb-1">{item.title}</h4>
                                                <p className="text-sm text-muted-foreground">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* FAQ Section */}
                    <motion.div {...fadeInUp}>
                        <Card className="glass border-white/10 overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-b border-white/10">
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-amber-500/20">
                                        <HelpCircle className="w-6 h-6 text-amber-500" />
                                    </div>
                                    Sık Sorulan Sorular
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                {[
                                    {
                                        question: 'Profildeki fotoğraflar gerçek mi?',
                                        answer: '"Fotoğraf Onaylı" rozetine sahip profillerde fotoğraflar doğrulanmıştır. Rozetli profilleri tercih etmenizi öneririz.'
                                    },
                                    {
                                        question: 'Bir sorun yaşarsam ne yapmalıyım?',
                                        answer: 'Önce güvenliğinizi sağlayın. Ardından durumu platforma bildirin. Gerekirse yetkililere başvurun.'
                                    },
                                    {
                                        question: 'Kişisel bilgilerim güvende mi?',
                                        answer: 'Evet, tüm verileriniz şifrelenmiş olarak saklanır. KVKK ve GDPR uyumlu çalışıyoruz.'
                                    },
                                    {
                                        question: 'Engellendiğimi nasıl anlarım?',
                                        answer: 'Engellenirseniz o kişinin profilini görüntüleyemez ve mesaj gönderemezsiniz.'
                                    },
                                ].map((faq, index) => (
                                    <div key={index} className="p-4 rounded-xl bg-white/5">
                                        <h4 className="font-bold mb-2 flex items-center gap-2">
                                            <ChevronRight className="w-4 h-4 text-amber-500" />
                                            {faq.question}
                                        </h4>
                                        <p className="text-sm text-muted-foreground pl-6">{faq.answer}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* CTA Section */}
                    <motion.div {...fadeInUp}>
                        <Card className="glass border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
                            <CardContent className="p-8 text-center">
                                <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                                <h3 className="text-2xl font-black mb-4">Daha Fazla Yardım Mı Gerekiyor?</h3>
                                <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                                    Güvenlikle ilgili sorularınız için destek ekibimizle iletişime geçebilirsiniz.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link href="/contact">
                                        <Button size="lg" className="bg-gradient-to-r from-primary to-accent">
                                            <MessageSquare className="w-4 h-4 mr-2" />
                                            İletişime Geç
                                        </Button>
                                    </Link>
                                    <Link href="/privacy">
                                        <Button size="lg" variant="outline">
                                            <FileText className="w-4 h-4 mr-2" />
                                            Gizlilik Politikası
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export { Safety };
