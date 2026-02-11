/**
 * Contact Page
 * 
 * Allows users to contact site administration through a comprehensive form.
 * Features contact information, map placeholder, social media links, and form validation.
 * Provides multiple communication channels for user support and inquiries.
 * 
 * @module pages/Contact
 * @category Pages - Public
 * 
 * Features:
 * - Contact form with validation UI
 * - Name, email, phone, subject, and message fields
 * - Form validation with error messages
 * - Contact information display (address, phone, email)
 * - Map placeholder for location
 * - Social media links (Twitter, Facebook, Instagram, LinkedIn)
 * - Business hours display
 * - FAQ section with common questions
 * - Responsive design for mobile and desktop
 * - Framer Motion animations for smooth interactions
 * - Success/error feedback after form submission
 * - Email sending integration ready
 * 
 * Contact Methods:
 * - Contact form (primary method)
 * - Email address
 * - Phone number
 * - Social media channels
 * - Physical address
 * 
 * @example
 * ```tsx
 * // Route: /contact
 * <Contact />
 * ```
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TextAreaInput } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  fadeInUp, 
  staggerContainer, 
  staggerItem, 
  pageTransition 
} from '@/lib/animations';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  HelpCircle,
} from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'İsim gereklidir';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'İsim en az 2 karakter olmalıdır';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-posta gereklidir';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
    }

    if (formData.phone && !/^[0-9\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Geçerli bir telefon numarası giriniz';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Konu gereklidir';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Mesaj gereklidir';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Mesaj en az 10 karakter olmalıdır';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Lütfen tüm alanları doğru şekilde doldurun');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API endpoint for contact form submission
      // Simulate API call - replace with actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Success
      setIsSubmitted(true);
      toast.success('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setErrors({});

      // Reset submitted state after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      toast.error('Mesaj gönderilemedi. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Adres',
      content: 'Marmara Bölgesi, İstanbul, Türkiye',
      color: 'text-blue-500',
    },
    {
      icon: Mail,
      title: 'E-posta',
      content: 'info@zuhreplanet.com',
      color: 'text-green-500',
    },
    {
      icon: Phone,
      title: 'Telefon',
      content: '+90 (555) 123-4567',
      color: 'text-blue-500',
    },
    {
      icon: Clock,
      title: 'Çalışma Saatleri',
      content: '7/24 Aktif Destek',
      color: 'text-orange-500',
    },
  ];

  const faqs = [
    {
      question: 'Mesajıma ne kadar sürede yanıt alırım?',
      answer: 'Genellikle 24 saat içerisinde tüm mesajlara yanıt veriyoruz.',
    },
    {
      question: 'Hangi konularda destek alabilirim?',
      answer: 'Üyelik, ödeme, teknik sorunlar ve genel sorularınız için bizimle iletişime geçebilirsiniz.',
    },
    {
      question: 'Telefon desteği var mı?',
      answer: 'Evet, acil durumlar için telefon desteği sağlıyoruz. Lütfen önce e-posta ile iletişime geçin.',
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-600' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-sky-500' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-600' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-700' },
  ];

  return (
    <motion.div
      {...pageTransition}
      className="min-h-screen bg-background py-20"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="text-center mb-16"
        >
          <Badge className="mb-4 px-4 py-1.5 bg-primary/10 text-primary border-primary/20">
            <MessageSquare className="w-4 h-4 mr-2" />
            Bize Ulaşın
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">İletişime Geçin</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Sorularınız, önerileriniz veya destek talepleriniz için bizimle iletişime geçmekten çekinmeyin.
            Size yardımcı olmaktan mutluluk duyarız.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Form - Larger on desktop */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Mesaj Gönderin
                </CardTitle>
                <CardDescription>
                  Formu doldurun, en kısa sürede size dönüş yapalım
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Email */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        name="name"
                        label="Ad Soyad"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        placeholder="Adınız ve soyadınız"
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        name="email"
                        type="email"
                        label="E-posta"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        placeholder="ornek@email.com"
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </div>

                  {/* Phone and Subject */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        name="phone"
                        type="tel"
                        label="Telefon (Opsiyonel)"
                        value={formData.phone}
                        onChange={handleChange}
                        error={errors.phone}
                        placeholder="+90 555 123 4567"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <Input
                        name="subject"
                        label="Konu"
                        value={formData.subject}
                        onChange={handleChange}
                        error={errors.subject}
                        placeholder="Mesajınızın konusu"
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <TextAreaInput
                      name="message"
                      label="Mesajınız"
                      value={formData.message}
                      onChange={handleChange}
                      error={errors.message}
                      placeholder="Mesajınızı buraya yazın..."
                      rows={6}
                      maxLength={1000}
                      showCount
                      disabled={isSubmitting}
                      autoResize
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting || isSubmitted}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="mr-2"
                        >
                          <Send className="w-5 h-5" />
                        </motion.div>
                        Gönderiliyor...
                      </>
                    ) : isSubmitted ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Gönderildi
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Mesajı Gönder
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info Sidebar */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {contactInfo.map((info, index) => (
              <motion.div key={index} variants={staggerItem}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-primary/10 ${info.color}`}>
                        <info.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{info.title}</h3>
                        <p className="text-sm text-muted-foreground">{info.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Social Media Links */}
            <motion.div variants={staggerItem}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sosyal Medya</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className={`p-3 rounded-xl bg-muted hover:bg-primary/10 transition-colors ${social.color}`}
                      >
                        <social.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* Map Placeholder */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <Card>
            <CardContent className="p-0">
              <div className="relative h-[400px] bg-muted rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg font-medium">
                      Harita Entegrasyonu
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Konumunuzu görmek için Google Maps entegrasyonu eklenecek
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
        >
          <div className="text-center mb-8">
            <Badge className="mb-4 px-4 py-1.5 bg-primary/10 text-primary border-primary/20">
              <HelpCircle className="w-4 h-4 mr-2" />
              Sıkça Sorulan Sorular
            </Badge>
            <h2 className="text-3xl font-bold">Aklınıza Takılanlar</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
