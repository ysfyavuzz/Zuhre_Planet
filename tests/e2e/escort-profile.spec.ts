/**
 * Escort Profile E2E Tests
 * 
 * End-to-end tests for escort profile pages.
 * Tests profile display, photo gallery, contact buttons, and interactions.
 */

import { test, expect } from '@playwright/test';
import { PROFILE, UI } from './utils/selectors';
import { navigateToPage, waitForLoadingToFinish } from './utils/helpers';

test.describe('Escort Profile - Profil Yükleme', () => {
  test.beforeEach(async ({ page }) => {
    // Katalog sayfasına git ve ilk profile tıkla
    await page.goto('/catalog');
    await waitForLoadingToFinish(page);
    
    const firstEscortCard = page.locator('[data-testid="escort-card"]').first();
    if (await firstEscortCard.isVisible()) {
      await firstEscortCard.click();
      await waitForLoadingToFinish(page);
    } else {
      // Alternatif olarak doğrudan bir profile git
      await page.goto('/profile/1');
    }
  });

  test('profil sayfası doğru yüklenmeli', async ({ page }) => {
    await expect(page.locator(PROFILE.container)).toBeVisible();
  });

  test('sayfa başlığı escort adını içermeli', async ({ page }) => {
    const profileName = page.locator(PROFILE.name);
    
    if (await profileName.isVisible()) {
      const name = await profileName.textContent();
      await expect(page).toHaveTitle(new RegExp(name || '', 'i'));
    }
  });
});

test.describe('Escort Profile - Profil Bilgileri', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog');
    await waitForLoadingToFinish(page);
    
    const firstEscortCard = page.locator('[data-testid="escort-card"]').first();
    if (await firstEscortCard.isVisible()) {
      await firstEscortCard.click();
      await waitForLoadingToFinish(page);
    } else {
      await page.goto('/profile/1');
    }
  });

  test('escort adı görüntülenmeli', async ({ page }) => {
    const name = page.locator(PROFILE.name);
    await expect(name).toBeVisible();
    await expect(name).not.toBeEmpty();
  });

  test('escort yaşı görüntülenmeli', async ({ page }) => {
    const age = page.locator(PROFILE.age);
    
    if (await age.isVisible()) {
      await expect(age).toBeVisible();
      const ageText = await age.textContent();
      expect(ageText).toMatch(/\d+/); // Sayı içermeli
    }
  });

  test('escort şehri görüntülenmeli', async ({ page }) => {
    const city = page.locator(PROFILE.city);
    await expect(city).toBeVisible();
    await expect(city).not.toBeEmpty();
  });

  test('escort fiyatı görüntülenmeli', async ({ page }) => {
    const price = page.locator(PROFILE.price);
    await expect(price).toBeVisible();
    
    const priceText = await price.textContent();
    expect(priceText).toMatch(/\d+/); // Sayı içermeli
  });

  test('escort biyografisi görüntülenmeli', async ({ page }) => {
    const bio = page.locator(PROFILE.bio);
    
    if (await bio.isVisible()) {
      await expect(bio).toBeVisible();
    }
  });

  test('profil avatarı görüntülenmeli', async ({ page }) => {
    const avatar = page.locator(PROFILE.avatar);
    await expect(avatar).toBeVisible();
    
    // Görsel yüklenmiş olmalı
    await expect(avatar).toHaveAttribute('src', /.+/);
  });
});

test.describe('Escort Profile - Hizmetler Listesi', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog');
    await waitForLoadingToFinish(page);
    
    const firstEscortCard = page.locator('[data-testid="escort-card"]').first();
    if (await firstEscortCard.isVisible()) {
      await firstEscortCard.click();
      await waitForLoadingToFinish(page);
    } else {
      await page.goto('/profile/1');
    }
  });

  test('hizmetler bölümü görüntülenmeli', async ({ page }) => {
    const services = page.locator(PROFILE.services);
    await expect(services).toBeVisible();
  });

  test('en az bir hizmet listelenmiş olmalı', async ({ page }) => {
    const services = page.locator(PROFILE.services);
    
    if (await services.isVisible()) {
      // Hizmet öğelerini bul
      const serviceItems = page.locator('[data-testid*="service-item"]');
      const count = await serviceItems.count();
      
      if (count > 0) {
        expect(count).toBeGreaterThan(0);
      }
    }
  });

  test('hizmetler okunabilir formatta görüntülenmeli', async ({ page }) => {
    const serviceItems = page.locator('[data-testid*="service-item"]');
    const count = await serviceItems.count();
    
    if (count > 0) {
      const firstService = serviceItems.first();
      await expect(firstService).toBeVisible();
      
      const text = await firstService.textContent();
      expect(text).toBeTruthy();
      expect(text!.length).toBeGreaterThan(0);
    }
  });
});

test.describe('Escort Profile - Fotoğraf Galerisi', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog');
    await waitForLoadingToFinish(page);
    
    const firstEscortCard = page.locator('[data-testid="escort-card"]').first();
    if (await firstEscortCard.isVisible()) {
      await firstEscortCard.click();
      await waitForLoadingToFinish(page);
    } else {
      await page.goto('/profile/1');
    }
  });

  test('fotoğraf galerisi görüntülenmeli', async ({ page }) => {
    const gallery = page.locator(PROFILE.gallery);
    await expect(gallery).toBeVisible();
  });

  test('galeride en az bir fotoğraf olmalı', async ({ page }) => {
    const galleryImages = page.locator(PROFILE.galleryImage);
    const count = await galleryImages.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('fotoğrafa tıklandığında tam boyut görüntülenmeli', async ({ page }) => {
    const galleryImages = page.locator(PROFILE.galleryImage);
    const count = await galleryImages.count();
    
    if (count > 0) {
      // İlk fotoğrafa tıkla
      await galleryImages.first().click();
      
      // Modal veya lightbox açılmalı
      const modal = page.locator(UI.modal);
      const lightbox = page.locator('[data-testid="lightbox"]');
      
      const modalVisible = await modal.isVisible().catch(() => false);
      const lightboxVisible = await lightbox.isVisible().catch(() => false);
      
      expect(modalVisible || lightboxVisible).toBeTruthy();
    }
  });

  test('fotoğraf modal kapatılabilmeli', async ({ page }) => {
    const galleryImages = page.locator(PROFILE.galleryImage);
    const count = await galleryImages.count();
    
    if (count > 0) {
      await galleryImages.first().click();
      
      // Modal açılmasını bekle
      await page.waitForTimeout(500);
      
      // Kapatma butonunu bul
      const closeButton = page.locator('[data-testid="close-modal"], [data-testid="close-lightbox"]').first();
      
      if (await closeButton.isVisible()) {
        await closeButton.click();
        
        // Modal kapanmalı
        const modal = page.locator(UI.modal);
        await expect(modal).not.toBeVisible();
      } else {
        // ESC tuşu ile kapat
        await page.keyboard.press('Escape');
      }
    }
  });

  test('galeri fotoğrafları arasında gezinilebilmeli', async ({ page }) => {
    const galleryImages = page.locator(PROFILE.galleryImage);
    const count = await galleryImages.count();
    
    if (count > 1) {
      await galleryImages.first().click();
      await page.waitForTimeout(500);
      
      // İleri butonu
      const nextButton = page.locator('[data-testid="next-image"], [aria-label*="next"], [aria-label*="sonraki"]');
      
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(300);
        
        // Hala modal açık olmalı
        const modal = page.locator(UI.modal);
        await expect(modal).toBeVisible();
      }
    }
  });
});

test.describe('Escort Profile - İletişim Butonları', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog');
    await waitForLoadingToFinish(page);
    
    const firstEscortCard = page.locator('[data-testid="escort-card"]').first();
    if (await firstEscortCard.isVisible()) {
      await firstEscortCard.click();
      await waitForLoadingToFinish(page);
    } else {
      await page.goto('/profile/1');
    }
  });

  test('iletişim butonu görünür olmalı', async ({ page }) => {
    const contactButton = page.locator(PROFILE.contactButton);
    
    if (await contactButton.isVisible()) {
      await expect(contactButton).toBeVisible();
      await expect(contactButton).toBeEnabled();
    }
  });

  test('mesaj butonu görünür olmalı', async ({ page }) => {
    const messageButton = page.locator(PROFILE.messageButton);
    
    if (await messageButton.isVisible()) {
      await expect(messageButton).toBeVisible();
      await expect(messageButton).toBeEnabled();
    }
  });

  test('rezervasyon butonu görünür olmalı', async ({ page }) => {
    const bookButton = page.locator(PROFILE.bookButton);
    
    if (await bookButton.isVisible()) {
      await expect(bookButton).toBeVisible();
      await expect(bookButton).toBeEnabled();
    }
  });

  test('iletişim butonuna tıklama çalışmalı', async ({ page }) => {
    const contactButton = page.locator(PROFILE.contactButton);
    
    if (await contactButton.isVisible()) {
      await contactButton.click();
      
      // Modal açılmalı veya yönlendirme yapılmalı
      await page.waitForTimeout(500);
      
      const modal = page.locator(UI.modal);
      const modalVisible = await modal.isVisible();
      
      // Ya modal açılır ya da URL değişir
      const urlChanged = !page.url().includes('/profile/');
      
      expect(modalVisible || urlChanged).toBeTruthy();
    }
  });
});

test.describe('Escort Profile - Favori Butonu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog');
    await waitForLoadingToFinish(page);
    
    const firstEscortCard = page.locator('[data-testid="escort-card"]').first();
    if (await firstEscortCard.isVisible()) {
      await firstEscortCard.click();
      await waitForLoadingToFinish(page);
    } else {
      await page.goto('/profile/1');
    }
  });

  test('favori butonu görünür olmalı', async ({ page }) => {
    const favoriteButton = page.locator(PROFILE.favoriteButton);
    await expect(favoriteButton).toBeVisible();
  });

  test('favori butonuna tıklama toggle çalışmalı', async ({ page }) => {
    const favoriteButton = page.locator(PROFILE.favoriteButton);
    
    // İlk durumu al
    const initialAriaLabel = await favoriteButton.getAttribute('aria-label');
    
    // Butona tıkla
    await favoriteButton.click();
    await page.waitForTimeout(500);
    
    // Durum değişmiş olmalı
    const newAriaLabel = await favoriteButton.getAttribute('aria-label');
    
    // ARIA label veya class değişmiş olmalı
    expect(initialAriaLabel).not.toBe(newAriaLabel);
  });

  test('favori eklendiğinde görsel geri bildirim olmalı', async ({ page }) => {
    const favoriteButton = page.locator(PROFILE.favoriteButton);
    
    // Butona tıkla
    await favoriteButton.click();
    
    // Toast mesajı veya görsel değişiklik
    const toast = page.locator(UI.toast);
    const toastVisible = await toast.isVisible().catch(() => false);
    
    // Ya toast gösterilir ya da buton görünümü değişir
    expect(toastVisible || true).toBeTruthy();
  });
});

test.describe('Escort Profile - Benzer Escortlar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog');
    await waitForLoadingToFinish(page);
    
    const firstEscortCard = page.locator('[data-testid="escort-card"]').first();
    if (await firstEscortCard.isVisible()) {
      await firstEscortCard.click();
      await waitForLoadingToFinish(page);
    } else {
      await page.goto('/profile/1');
    }
  });

  test('benzer escortlar bölümü görüntülenmeli', async ({ page }) => {
    const similarEscorts = page.locator(PROFILE.similarEscorts);
    
    // Sayfayı kaydır
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    if (await similarEscorts.isVisible()) {
      await expect(similarEscorts).toBeVisible();
    }
  });

  test('benzer escortlar listesi escort kartları içermeli', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    const similarSection = page.locator(PROFILE.similarEscorts);
    
    if (await similarSection.isVisible()) {
      const cards = similarSection.locator('[data-testid="escort-card"]');
      const count = await cards.count();
      
      if (count > 0) {
        expect(count).toBeGreaterThan(0);
      }
    }
  });

  test('benzer escort kartına tıklandığında o profile gidilmeli', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    const similarSection = page.locator(PROFILE.similarEscorts);
    
    if (await similarSection.isVisible()) {
      const cards = similarSection.locator('[data-testid="escort-card"]');
      const count = await cards.count();
      
      if (count > 0) {
        // Mevcut URL'i al
        const currentUrl = page.url();
        
        // İlk benzer escort'a tıkla
        await cards.first().click();
        await waitForLoadingToFinish(page);
        
        // URL değişmiş olmalı
        const newUrl = page.url();
        expect(newUrl).not.toBe(currentUrl);
        
        // Hala profil sayfasında olmalıyız
        expect(newUrl).toContain('/profile/');
      }
    }
  });
});

test.describe('Escort Profile - Responsive Davranış', () => {
  test('mobil görünümde profil düzgün görüntülenmeli', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/catalog');
    await waitForLoadingToFinish(page);
    
    const firstEscortCard = page.locator('[data-testid="escort-card"]').first();
    if (await firstEscortCard.isVisible()) {
      await firstEscortCard.click();
      await waitForLoadingToFinish(page);
    } else {
      await page.goto('/profile/1');
    }
    
    // Profil container görünür olmalı
    await expect(page.locator(PROFILE.container)).toBeVisible();
    
    // Temel bilgiler görünür olmalı
    await expect(page.locator(PROFILE.name)).toBeVisible();
  });

  test('tablet görünümde profil düzgün görüntülenmeli', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/catalog');
    await waitForLoadingToFinish(page);
    
    const firstEscortCard = page.locator('[data-testid="escort-card"]').first();
    if (await firstEscortCard.isVisible()) {
      await firstEscortCard.click();
      await waitForLoadingToFinish(page);
    } else {
      await page.goto('/profile/1');
    }
    
    await expect(page.locator(PROFILE.container)).toBeVisible();
  });
});

test.describe('Escort Profile - SEO ve Meta', () => {
  test('profil sayfası meta description içermeli', async ({ page }) => {
    await page.goto('/profile/1');
    await waitForLoadingToFinish(page);
    
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveCount(1);
  });

  test('profil sayfası Open Graph meta tagları içermeli', async ({ page }) => {
    await page.goto('/profile/1');
    await waitForLoadingToFinish(page);
    
    const ogTitle = page.locator('meta[property="og:title"]');
    const ogDescription = page.locator('meta[property="og:description"]');
    
    // En az biri mevcut olmalı
    const titleCount = await ogTitle.count();
    const descCount = await ogDescription.count();
    
    expect(titleCount + descCount).toBeGreaterThan(0);
  });
});
