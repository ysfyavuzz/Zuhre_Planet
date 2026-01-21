/**
 * FAQ (Sıkça Sorulan Sorular) Page
 * 
 * Frequently Asked Questions page with categorized Q&A.
 * Helps users find answers to common questions about the platform.
 * 
 * @page
 * @category General
 */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ChevronDown, HelpCircle, Search, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SEO } from '@/pages/SEO';

interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'customer' | 'escort' | 'payment' | 'safety';
}

const faqData: FAQItem[] = [
  {
    category: 'general',
    question: 'Platform nasıl çalışır?',
    answer: 'Platformumuz, müşteriler ve escortlar arasında güvenli bir köprü görevi görür. Müşteriler profilleri inceleyebilir, favori escortlarını ekleyebilir ve randevu talepleri oluşturabilir. Escortlar ise profillerini yönetebilir, randevu taleplerini onaylayabilir ve müşterilerle güvenli bir şekilde iletişim kurabilir.'
  },
  {
    category: 'general',
    question: 'Kayıt olmak ücretsiz mi?',
    answer: 'Evet, hem müşteri hem de escort olarak platforma kayıt olmak tamamen ücretsizdir. Ancak premium özelliklere erişim için ücretli üyelik seçenekleri mevcuttur.'
  },
  {
    category: 'general',
    question: 'Gizliliğim korunuyor mu?',
    answer: 'Evet, kullanıcı gizliliği bizim için en önemli önceliktir. Tüm kişisel bilgileriniz şifrelenmiş olarak saklanır ve üçüncü taraflarla paylaşılmaz. Detaylı bilgi için Gizlilik Politikamızı inceleyebilirsiniz.'
  },
  {
    category: 'customer',
    question: 'Nasıl randevu alabilirim?',
    answer: 'Bir escort profilini inceledikten sonra, profil sayfasındaki "Randevu Al" butonuna tıklayarak randevu talebi oluşturabilirsiniz. Tarih, saat ve hizmet seçeneklerini belirledikten sonra talebiniz escort\'a iletilir. Escort talebinizi onayladığında size bildirim gelir.'
  },
  {
    category: 'customer',
    question: 'İletişim bilgileri nasıl görünüyor?',
    answer: 'Temel üyelerde sadece mesajlaşma özelliği aktiftir. Premium ve VIP üyelerde telefon numarası ve WhatsApp gibi doğrudan iletişim bilgileri görüntülenebilir.'
  },
  {
    category: 'customer',
    question: 'Favorilerime nasıl eklerim?',
    answer: 'Beğendiğiniz bir escort profilinde kalp ikonuna tıklayarak favorilerinize ekleyebilirsiniz. Favorilerinize "Favorilerim" sayfasından ulaşabilirsiniz.'
  },
  {
    category: 'customer',
    question: 'VIP üyelik ne sağlar?',
    answer: 'VIP üyelik ile sınırsız fotoğraf ve video görüntüleme, doğrudan iletişim bilgileri erişimi, öncelikli destek ve özel indirimler gibi avantajlardan yararlanabilirsiniz.'
  },
  {
    category: 'escort',
    question: 'Nasıl profil oluştururum?',
    answer: 'Escort olarak kayıt olduktan sonra, dashboard\'dan "Profil Düzenle" bölümüne giderek profilinizi oluşturabilirsiniz. Fotoğraflar, hizmetler, fiyatlar ve çalışma saatlerinizi ekleyebilirsiniz.'
  },
  {
    category: 'escort',
    question: 'Fotoğraflarım onaylanır mı?',
    answer: 'Evet, yüklediğiniz tüm fotoğraflar ve videolar kalite ve içerik kontrolünden geçer. Uygun bulunmayan içerikler reddedilir. Onay süreci genellikle 24 saat içinde tamamlanır.'
  },
  {
    category: 'escort',
    question: 'Komisyon oranı nedir?',
    answer: 'Platform üzerinden gerçekleşen ödemelerde %15 komisyon uygulanır. Standart üyelerde bu oran %20\'dir. VIP escort üyelerde ise %10\'a düşer.'
  },
  {
    category: 'escort',
    question: 'Randevu taleplerini nasıl yönetirim?',
    answer: 'Dashboard\'dan "Randevular" bölümüne giderek tüm gelen talepleri görüntüleyebilir, onaylayabilir veya reddedebilirsiniz. Onayladığınız randevular takviminizde otomatik olarak işaretlenir.'
  },
  {
    category: 'payment',
    question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
    answer: 'Kredi kartı, banka kartı ve güvenli online ödeme sistemleri üzerinden ödeme yapabilirsiniz. Tüm ödemeler SSL ile şifrelenmiştir.'
  },
  {
    category: 'payment',
    question: 'Ödeme güvenli mi?',
    answer: 'Evet, tüm ödemeler 256-bit SSL şifreleme ile korunmaktadır. Kredi kartı bilgileriniz saklanmaz ve güvenli ödeme gateway\'leri kullanılır.'
  },
  {
    category: 'payment',
    question: 'İade politikanız nedir?',
    answer: 'Hizmet alınmadan önce iptal edilen randevularda %100 iade yapılır. Hizmet başladıktan sonra iade yapılmaz. Detaylı bilgi için Kullanım Koşullarını inceleyebilirsiniz.'
  },
  {
    category: 'safety',
    question: 'Platform güvenli mi?',
    answer: 'Evet, platformumuz SSL şifreleme, güvenli veri saklama ve düzenli güvenlik denetimleri ile korunmaktadır. Tüm kullanıcılar doğrulama sürecinden geçer.'
  },
  {
    category: 'safety',
    question: 'Şüpheli bir profil bildirmek için ne yapmalıyım?',
    answer: 'Her profil sayfasında "Bildir" butonu bulunmaktadır. Şüpheli gördüğünüz profilleri buradan bildirebilirsiniz. Ekibimiz 24 saat içinde inceleme yapar.'
  },
  {
    category: 'safety',
    question: 'Verilerim güvende mi?',
    answer: 'Evet, tüm kişisel verileriniz KVKK ve GDPR standartlarına uygun olarak saklanır. Verileriniz hiçbir şekilde üçüncü taraflarla paylaşılmaz.'
  },
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [expandedId, setExpandedId] = React.useState<number | null>(null);
  const [activeCategory, setActiveCategory] = React.useState<string>('general');

  const filteredFAQs = React.useMemo(() => {
    return faqData.filter(faq => {
      const matchesSearch = searchQuery === '' || 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const categories = [
    { id: 'all', label: 'Tümü', icon: HelpCircle },
    { id: 'general', label: 'Genel', icon: HelpCircle },
    { id: 'customer', label: 'Müşteri', icon: MessageCircle },
    { id: 'escort', label: 'Escort', icon: MessageCircle },
    { id: 'payment', label: 'Ödeme', icon: MessageCircle },
    { id: 'safety', label: 'Güvenlik', icon: MessageCircle },
  ];

  return (
    <>
      <SEO 
        title="Sıkça Sorulan Sorular"
        description="Platformumuz hakkında sıkça sorulan soruların cevaplarını bulun"
      />
      
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Sıkça Sorulan Sorular
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Aradığınız sorunun cevabını bulamadınız mı? Destek ekibimize ulaşın.
            </p>
            
            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Soru ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-6 text-lg"
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2 bg-transparent h-auto">
              {categories.map((cat) => (
                <TabsTrigger 
                  key={cat.id} 
                  value={cat.id}
                  className="data-[state=active]:bg-pink-600 data-[state=active]:text-white"
                >
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* FAQ Items */}
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredFAQs.length === 0 ? (
              <Card className="p-12 text-center">
                <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-500">
                  Aradığınız kriterlere uygun soru bulunamadı.
                </p>
              </Card>
            ) : (
              filteredFAQs.map((faq, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader 
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedId(expandedId === index ? null : index)}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {faq.question}
                      </CardTitle>
                      <motion.div
                        animate={{ rotate: expandedId === index ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      </motion.div>
                    </div>
                  </CardHeader>
                  
                  <AnimatePresence>
                    {expandedId === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CardContent className="pt-0">
                          <p className="text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              ))
            )}
          </div>

          {/* Contact Support */}
          <div className="mt-12 text-center">
            <Card className="max-w-2xl mx-auto p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Hala sorunuz mu var?
              </h3>
              <p className="text-gray-600 mb-6">
                Destek ekibimiz size yardımcı olmak için burada.
              </p>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Destek Ekibiyle İletişime Geç
              </Button>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}
