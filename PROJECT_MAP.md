# 🗺️ Zühre Planet — Proje Haritası ve Dokümantasyon Takibi

> **⚠️ ZORUNLU:** Her geliştirici (insan veya AI) yaptığı değişikliği bu dosyada işaretlemeli ve **JOURNAL.md** dosyasına kayıt eklemelidir.

---

## 📈 Genel İstatistik (21 Şubat 2026)

| Katman | Toplam Dosya | ✅ Dokümante | 🟦 Bekliyor | İlerleme |
|--------|-------------|----------------|------------|----------|
| **src/lib/** | 33 | 6 | 27 | %18 |
| **src/drizzle/** | 2 | 2 | 0 | %100 |
| **src/server/** | 13 | 8 | 5 | %61 |
| **src/types/** | 13 | 13 | 0 | %100 |
| **src/contexts/** | 5 | 5 | 0 | %100 |
| **src/hooks/** | 15 | 4 | 11 | %26 |
| **src/pages/** | 79 | 5 | 74 | %6 |
| **src/components/** | 138 | 10 | 128 | %7 |
| **TOPLAM** | **298** | **53 (%18)** | **245** | **%18** |

*Not: İstatistikler sadece TS/TSX dosyalarını baz alır. Dokümante edilenler sütunu docs/ altındaki md karşılıklarını ifade eder.*

---

## 🚀 Katman Detayları

### 📂 [Veri ve Tipler (src/types)](./docs/types/domain.md) ✅ TAMAM
Tüm temel modeller, roller ve protokoller dökümante edildi.

### 📂 [Sunucu ve Mantık (src/server)](./docs/server/admin.router.md) ⚠️ KISMİ
Kritik router'lar tamamlandı, ancak orum.router gibi bazı parçalar bekliyor.

### 📂 [Durum Yönetimi (src/contexts)](./docs/contexts/WebSocketContext.md) ✅ TAMAM
Auth, Theme, WebSocket ve Notification context'leri dökümante edildi.

### 📂 [Altyapı (infrastructure)](./docs/infrastructure/README.md) ✅ TAMAM
Docker, PostgreSQL ve Nginx yapılandırması güncellendi.

---

## 🛠️ Açık Buglar ve Geliştirme Notları (Radar)
- **[media.router.ts](./docs/server/media.router.md):** 🔴 registerPhoto güvenlik açığı.
- **[admin.router.ts](./docs/server/admin.router.md):** ⚠️ Hardcoded istatistikler.
- **[verification.router.ts](./docs/server/verification.router.md):** ✅ Şema uyumsuzluğu düzeltildi.
- **[build]:** ⚠️ Bazı Drizzle tip hataları bypass edildi, uygulama çalışır durumda.

---
*Son güncelleme: 2026-02-21 | Güncelleyen: Gemini CLI*
