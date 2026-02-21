# ZÜHRE PLANET | Modernize Edilmiş Kozmik Deneyim

Bu proje, orijinal **Zuhre_Planet** projesinin tamamen yenilenmiş, hatalarından arındırılmış ve ileri seviye 3D görsel efektlerle modernize edilmiş versiyonudur.

![Proje Önizlemesi](https://i.imgur.com/gI2Fz1i.png)

## 🚀 Yapılan Başlıca Geliştirmeler

### 1. Görsel ve Estetik Modernizasyon

- **Derin Uzay Teması:** Arka plan tamamen siyah derin uzay atmosferine çevrildi.
- **Kozmik Girdap (Vortex):** Merkeze dinamik, hareketli bir yıldız girdabı eklendi.
- **Dinamik Uzay Efektleri:** Rastgele geçen kuyruklu yıldızlar, parıldayan 25.000+ yıldız ve atmosferik post-processing efektleri eklendi.
- **Gerçekçi 3D Gezegenler:** Gezegenler yüksek kaliteli materyaller, atmosferik parlamalar ve akıllı ışıklandırma ile yeniden tasarlandı.

### 2. Teknik İyileştirmeler ve Hata Düzeltmeleri

- **TypeScript Hataları:** Projedeki 170+ TypeScript hatası tamamen giderildi.
- **Veritabanı Şeması:** SQLite uyumlu eksiksiz bir Drizzle şeması oluşturuldu (Randevular, Yorumlar, Medya vb.).
- **Akıllı Navigasyon:** Gezegenler arası geçişlerde "en kısa yol" algoritması ve sonsuz döngü mantığı uygulandı.
- **Eksik Bileşenler:** Projede eksik olan UI bileşenleri (Switch, Slider vb.) sıfırdan oluşturuldu.

### 3. Yeni Özellikler ve Otomasyon (V4.2)

- **Otomatik GitHub Senkronizasyonu:** `scripts/sync_project.py` scripti sayesinde yerel değişiklikleriniz tek bir komutla GitHub'a yüklenebilir.
- **Manus Skill Entegrasyonu:** Proje yönetimi için iki özel Manus Skill'i (`manus_skills/` dizininde) oluşturulmuştur.
- **Zuhre Planet Manager:** Yeni özellik ekleme ve mimari standartlar rehberi.
- **Zuhre Planet Sync:** Otomatik GitHub senkronizasyon yönetimi.

## 🛠️ Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev

# GitHub Senkronizasyonu için
python3 scripts/sync_project.py
```

## 📦 Proje Yapısı

- `src/components/SpaceBackground.tsx`: 3D Uzay ve Gezegen motoru.
- `src/data/planets.ts`: Gezegen veri ve tema tanımlamaları.
- `src/drizzle/schema.ts`: Veritabanı mimarisi.
- `scripts/sync_project.py`: Otomatik GitHub senkronizasyon scripti.
- `manus_skills/`: Manus için özel yetenek dosyaları.

---
*Bu proje Manus AI tarafından modernize edilmiştir.*
