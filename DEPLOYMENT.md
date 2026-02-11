# Projeyi Canlıya Alma Rehberi (A'dan Z'ye)

Bu rehber, Zuhre Planet projesini sıfırdan bir VPS (Sanal Özel Sunucu) üzerinde canlıya almak için gereken sunucu seçimi, maliyet analizi ve teknik kurulum adımlarını detaylı bir şekilde açıklamaktadır.

## Bölüm 1: Sunucu Seçimi ve Satın Alma

### 1.1. Neden Standart Hosting Değil, VPS?

Projemiz, basit bir web sitesi değildir. İçerisinde Node.js tabanlı bir API, canlı sohbet (WebSocket) ve bir veritabanı barındıran tam yığın (full-stack) bir uygulamadır. Bu nedenle, sadece PHP ve statik dosyaları destekleyen **Paylaşımlı Hosting paketleri kesinlikle yetersizdir.** İhtiyacımız olan, üzerinde tam kontrol sahibi olacağımız bir **VPS**'tir.

### 1.2. Sağlayıcı ve Paket Tavsiyesi

- **Tavsiye Edilen Sağlayıcı:** **ViceTemple (`vicetemple.com`)**
  - **Sebep:** "Offshore" ve "DMCA Ignore" politikaları, projenizin içerik esnekliği ve yasal güvencesi için kritik öneme sahiptir.

- **Satın Alınacak Paket:** **KVM VPS**
  - **Minimum Özellikler (Sağlıklı Başlangıç):**
    - **RAM:** 4 GB
    - **CPU:** 2 vCPU
    - **Disk:** ~60 GB NVMe SSD
    - **İşletim Sistemi:** **Ubuntu 22.04 LTS** (Satın alırken bunu seçin)

- **Tahmini Aylık Maliyet:** **~40 USD**

---

## Bölüm 2: Sunucu Kurulumu (Adım Adım)

Aşağıdaki adımlar, yukarıda belirtilen paketi satın aldıktan sonra, size verilen `root` şifresi ile sunucuya SSH üzerinden bağlandığınız varsayılarak hazırlanmıştır.

### Adım 2.1: Temel Sunucu Hazırlığı

İlk olarak sunucumuzu güncelleyip gerekli altyapı araçlarını (Docker, Git, Nginx, Certbot) kuruyoruz.

```bash
# Paket listesini güncelle ve mevcut paketleri yükselt
sudo apt update && sudo apt upgrade -y

# Docker, Docker Compose, Git ve Certbot (SSL için) kurulumu
sudo apt install -y docker.io docker-compose git certbot python3-certbot-nginx

# Docker servisini sistem başlangıcına ekle ve başlat
sudo systemctl enable docker
sudo systemctl start docker
```

### Adım 2.2: Proje Kodunu Sunucuya Çekme

Projenin en güncel halini GitHub'dan sunucunuza klonlayın. Kodları genellikle `/var/www/` altında tutmak iyi bir pratiktir.

```bash
# Projeyi klonla ve dizine gir
git clone [PROJE_GITHUB_URL] /var/www/escilan-project
cd /var/www/escilan-project
```
_Not: `[PROJE_GITHUB_URL]` kısmını kendi projenizin Git URL'si ile değiştirin._

### Adım 2.3: Ortam Değişkenlerini (.env) Yapılandırma

Projenin hassas bilgilerini içeren `.env` dosyasını oluşturup düzenleyin.

```bash
# .env.example dosyasını kopyalayarak .env dosyasını oluştur
cp .env.example .env

# Nano metin editörü ile dosyayı düzenle
nano .env
```
`nano` editöründe aşağıdaki değişkenleri **mutlaka** kendi güvenli değerlerinizle güncelleyin:
- `DB_PASSWORD`: Tahmin edilmesi zor, güçlü bir veritabanı şifresi belirleyin.
- `JWT_SECRET`: Çok güçlü ve uzun bir anahtar girin (Online JWT secret generator kullanabilirsiniz).
- `DOMAIN_NAME`: Domain adınızı girin (örn: `escilan.com`).

Düzenlemeyi bitirdikten sonra `CTRL+X`, ardından `Y` ve `Enter` tuşlarına basarak dosyayı kaydedin.

### Adım 2.4: Nginx Konfigürasyonunu Ayarlama

Nginx'in gelen istekleri doğru yönlendirebilmesi için domain adınızı bilmesi gerekir.

```bash
# nginx.conf dosyasını düzenle
nano nginx.conf
```
Dosya içinde `server_name localhost;` satırını bulun ve kendi domain adınızla değiştirin:
```nginx
server_name yourdomain.com www.yourdomain.com;
```
_Not: `yourdomain.com` yerine kendi domaininizi yazın._

### Adım 2.5: Uygulamayı Docker Compose ile Başlatma

Artık tüm yapılandırma hazır. Tek bir komutla tüm sistemi (Veritabanı, API, Web Sunucusu) ayağa kaldırabiliriz.

```bash
# Proje dizininde olduğunuzdan emin olun: /var/www/escilan-project
docker-compose up -d --build
```
- `--build`: Projenizi (özellikle backend'i) Docker içinde yeniden derler.
- `-d`: Tüm servisleri arka planda başlatır.

İlk çalıştırma birkaç dakika sürebilir. `docker ps` komutu ile konteynerlerin durumunu kontrol edebilirsiniz. `escilan_db`, `escilan_api` ve `escilan_nginx` isimli üç konteynerin de "Up" (Çalışıyor) durumda olması gerekir.

### Adım 2.6: SSL Sertifikası (HTTPS) Kurulumu

Sitenizi güvenli hale getirmek için Let's Encrypt'ten ücretsiz SSL sertifikası alacağız. **Bu komutu çalıştırmadan önce domaininizin DNS A kaydının sunucu IP adresinize yönlendirildiğinden emin olun.**

```bash
# Certbot'u Nginx eklentisi ile çalıştır
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
Certbot size e-posta ve hizmet şartları onayı gibi birkaç soru soracaktır. Onayladıktan sonra Nginx konfigürasyonunuzu otomatik olarak güncelleyecek ve sitenizi `https://` üzerinden erişilebilir hale getirecektir.

---

### Tebrikler! 🎉

Tüm adımları başarıyla tamamladıysanız, projeniz artık `https://yourdomain.com` adresinde canlı yayında!

### Yönetim ve Bakım

- **Logları Görüntüleme:** `docker-compose logs -f [servis_adi]` (örn: `docker-compose logs -f api`)
- **Uygulamayı Durdurma:** `docker-compose down`
- **Uygulamayı Güncelleme (GitHub'dan çekip):**
  ```bash
  cd /var/www/escilan-project
  git pull
  docker-compose up -d --build
  ```