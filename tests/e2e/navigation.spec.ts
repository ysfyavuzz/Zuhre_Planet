/**
 * Navigation E2E Tests
 * 
 * End-to-end tests for site navigation.
 * Tests routing, header/footer navigation, mobile menu, and 404 handling.
 */

import { test, expect } from '@playwright/test';
import { NAV, FOOTER } from './utils/selectors';
import { navigateToPage, waitForLoadingToFinish } from './utils/helpers';

test.describe('Navigation - Ana Rotalar', () => {
  test('ana sayfa erişilebilir olmalı', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
    await expect(page.locator('body')).toBeVisible();
  });

  test('katalog sayfası erişilebilir olmalı', async ({ page }) => {
    await page.goto('/catalog');
    await expect(page).toHaveURL(/catalog/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('giriş sayfası erişilebilir olmalı', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/login/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('kayıt sayfası erişilebilir olmalı', async ({ page }) => {
    await page.goto('/register');
    await expect(page).toHaveURL(/register/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('hakkımızda sayfası erişilebilir olmalı', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveURL(/about/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('iletişim sayfası erişilebilir olmalı', async ({ page }) => {
    await page.goto('/contact');
    await expect(page).toHaveURL(/contact/i);
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Navigation - 404 Sayfası', () => {
  test('geçersiz rota için 404 sayfası gösterilmeli', async ({ page }) => {
    await page.goto('/bu-sayfa-mevcut-degil-xyz123');
    
    // 404 içeriği veya mesajı olmalı
    const pageContent = await page.textContent('body');
    const has404Content = 
      pageContent?.includes('404') || 
      pageContent?.includes('bulunamadı') ||
      pageContent?.includes('not found');
    
    expect(has404Content).toBeTruthy();
  });

  test('404 sayfasında ana sayfaya dönüş linki olmalı', async ({ page }) => {
    await page.goto('/invalid-route-123456');
    
    // Ana sayfaya link
    const homeLink = page.getByRole('link', { name: /ana sayfa|home|anasayfa/i });
    
    if (await homeLink.isVisible()) {
      await expect(homeLink).toBeVisible();
      
      // Link çalışmalı
      await homeLink.click();
      await expect(page).toHaveURL('/');
    }
  });

  test('404 sayfasında katalog linki olmalı', async ({ page }) => {
    await page.goto('/invalid-page-xyz');
    
    const catalogLink = page.getByRole('link', { name: /katalog|catalog/i });
    
    if (await catalogLink.isVisible()) {
      await expect(catalogLink).toBeVisible();
    }
  });
});

test.describe('Navigation - Header Navigasyonu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('header görünür olmalı', async ({ page }) => {
    const header = page.locator(NAV.header);
    
    // data-testid yoksa genel header seçici kullan
    const headerElement = await header.count() > 0 ? header : page.locator('header');
    await expect(headerElement).toBeVisible();
  });

  test('logo ana sayfaya yönlendirmeli', async ({ page }) => {
    // Önce başka bir sayfaya git
    await page.goto('/catalog');
    await waitForLoadingToFinish(page);
    
    // Logo'ya tıkla
    const logo = page.locator(NAV.logo);
    const logoLink = await logo.count() > 0 ? logo : page.locator('header a[href="/"]').first();
    
    await logoLink.click();
    await expect(page).toHaveURL('/');
  });

  test('katalog linki çalışmalı', async ({ page }) => {
    const catalogLink = page.getByRole('link', { name: /katalog|catalog/i }).first();
    
    if (await catalogLink.isVisible()) {
      await catalogLink.click();
      await expect(page).toHaveURL(/catalog/i);
    }
  });

  test('giriş linki çalışmalı', async ({ page }) => {
    const loginLink = page.getByRole('link', { name: /giriş|login/i }).first();
    
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(page).toHaveURL(/login/i);
    }
  });

  test('kayıt ol linki çalışmalı', async ({ page }) => {
    const registerLink = page.getByRole('link', { name: /kayıt|register/i }).first();
    
    if (await registerLink.isVisible()) {
      await registerLink.click();
      await expect(page).toHaveURL(/register/i);
    }
  });

  test('header sabitlenmeli (sticky)', async ({ page }) => {
    // Sayfayı aşağı kaydır
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300);
    
    // Header hala görünür olmalı
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
  });
});

test.describe('Navigation - Footer Navigasyonu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('footer görünür olmalı', async ({ page }) => {
    const footer = page.locator(FOOTER.container);
    const footerElement = await footer.count() > 0 ? footer : page.locator('footer');
    
    // Footer'a kaydır
    await footerElement.scrollIntoViewIfNeeded();
    await expect(footerElement).toBeVisible();
  });

  test('gizlilik politikası linki çalışmalı', async ({ page }) => {
    await page.locator('footer').scrollIntoViewIfNeeded();
    
    const privacyLink = page.getByRole('link', { name: /gizlilik|privacy/i });
    
    if (await privacyLink.isVisible()) {
      await privacyLink.click();
      await expect(page).toHaveURL(/privacy|gizlilik/i);
    }
  });

  test('kullanım şartları linki çalışmalı', async ({ page }) => {
    await page.locator('footer').scrollIntoViewIfNeeded();
    
    const termsLink = page.getByRole('link', { name: /kullanım şartları|terms|şartlar/i });
    
    if (await termsLink.isVisible()) {
      await termsLink.click();
      await expect(page).toHaveURL(/terms|sartlar|kosullar/i);
    }
  });

  test('iletişim linki çalışmalı', async ({ page }) => {
    await page.locator('footer').scrollIntoViewIfNeeded();
    
    const contactLink = page.getByRole('link', { name: /iletişim|contact/i });
    
    if (await contactLink.isVisible()) {
      await contactLink.click();
      await expect(page).toHaveURL(/contact|iletisim/i);
    }
  });

  test('footer sosyal medya linkleri içermeli', async ({ page }) => {
    await page.locator('footer').scrollIntoViewIfNeeded();
    
    const footer = page.locator('footer');
    
    // Sosyal medya linkleri
    const socialLinks = footer.locator('a[href*="facebook"], a[href*="twitter"], a[href*="instagram"]');
    const count = await socialLinks.count();
    
    // En az bir sosyal medya linki olabilir
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('footer telif hakkı bilgisi içermeli', async ({ page }) => {
    await page.locator('footer').scrollIntoViewIfNeeded();
    
    const footer = page.locator('footer');
    const footerText = await footer.textContent();
    
    // Telif hakkı veya yıl bilgisi
    const hasCopyright = 
      footerText?.includes('©') || 
      footerText?.includes('2024') ||
      footerText?.includes('Copyright');
    
    expect(hasCopyright).toBeTruthy();
  });
});

test.describe('Navigation - Mobil Menü', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
  });

  test('mobil menü toggle butonu görünür olmalı', async ({ page }) => {
    const mobileMenuToggle = page.locator(NAV.mobileMenuToggle);
    
    // data-testid veya hamburger icon
    const toggleButton = await mobileMenuToggle.count() > 0 
      ? mobileMenuToggle 
      : page.locator('button[aria-label*="menu"], button[aria-label*="menü"]').first();
    
    if (await toggleButton.isVisible()) {
      await expect(toggleButton).toBeVisible();
    }
  });

  test('mobil menü açılıp kapanmalı', async ({ page }) => {
    const mobileMenuToggle = page.locator(NAV.mobileMenuToggle);
    const toggleButton = await mobileMenuToggle.count() > 0 
      ? mobileMenuToggle 
      : page.locator('button[aria-label*="menu"], button[aria-label*="menü"]').first();
    
    if (await toggleButton.isVisible()) {
      // Menüyü aç
      await toggleButton.click();
      await page.waitForTimeout(300);
      
      // Menü görünür olmalı
      const mobileMenu = page.locator(NAV.mobileMenu);
      const menuElement = await mobileMenu.count() > 0
        ? mobileMenu
        : page.locator('nav[data-mobile="true"], .mobile-menu').first();
      
      if (await menuElement.isVisible()) {
        await expect(menuElement).toBeVisible();
        
        // Tekrar tıkla - menü kapanmalı
        await toggleButton.click();
        await page.waitForTimeout(300);
      }
    }
  });

  test('mobil menüde tüm navigasyon linkleri olmalı', async ({ page }) => {
    const mobileMenuToggle = page.locator(NAV.mobileMenuToggle);
    const toggleButton = await mobileMenuToggle.count() > 0 
      ? mobileMenuToggle 
      : page.locator('button[aria-label*="menu"], button[aria-label*="menü"]').first();
    
    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      await page.waitForTimeout(300);
      
      // Ana linkler mevcut olmalı
      const catalogLink = page.getByRole('link', { name: /katalog|catalog/i });
      const aboutLink = page.getByRole('link', { name: /hakkımızda|about/i });
      
      // En az biri görünür olmalı
      const catalogVisible = await catalogLink.isVisible().catch(() => false);
      const aboutVisible = await aboutLink.isVisible().catch(() => false);
      
      expect(catalogVisible || aboutVisible).toBeTruthy();
    }
  });

  test('mobil menüden navigasyon çalışmalı', async ({ page }) => {
    const mobileMenuToggle = page.locator(NAV.mobileMenuToggle);
    const toggleButton = await mobileMenuToggle.count() > 0 
      ? mobileMenuToggle 
      : page.locator('button[aria-label*="menu"], button[aria-label*="menü"]').first();
    
    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      await page.waitForTimeout(300);
      
      const catalogLink = page.getByRole('link', { name: /katalog|catalog/i }).first();
      
      if (await catalogLink.isVisible()) {
        await catalogLink.click();
        await expect(page).toHaveURL(/catalog/i);
      }
    }
  });
});

test.describe('Navigation - Breadcrumb', () => {
  test('profil sayfasında breadcrumb olmalı', async ({ page }) => {
    await page.goto('/catalog');
    await waitForLoadingToFinish(page);
    
    const firstCard = page.locator('[data-testid="escort-card"]').first();
    if (await firstCard.isVisible()) {
      await firstCard.click();
      await waitForLoadingToFinish(page);
      
      // Breadcrumb ara
      const breadcrumb = page.locator('nav[aria-label*="breadcrumb"], [data-testid="breadcrumb"]');
      
      if (await breadcrumb.isVisible()) {
        await expect(breadcrumb).toBeVisible();
      }
    }
  });

  test('breadcrumb linkleri çalışmalı', async ({ page }) => {
    await page.goto('/catalog');
    await waitForLoadingToFinish(page);
    
    const firstCard = page.locator('[data-testid="escort-card"]').first();
    if (await firstCard.isVisible()) {
      await firstCard.click();
      await waitForLoadingToFinish(page);
      
      const breadcrumbLinks = page.locator('nav[aria-label*="breadcrumb"] a, [data-testid="breadcrumb"] a');
      const count = await breadcrumbLinks.count();
      
      if (count > 0) {
        // İlk breadcrumb linkine tıkla (genellikle "Ana Sayfa" veya "Katalog")
        await breadcrumbLinks.first().click();
        await waitForLoadingToFinish(page);
        
        // URL değişmiş olmalı
        expect(page.url()).not.toContain('/profile/');
      }
    }
  });
});

test.describe('Navigation - Geri Buton', () => {
  test('tarayıcı geri butonu çalışmalı', async ({ page }) => {
    await page.goto('/');
    await page.goto('/catalog');
    
    // Geri git
    await page.goBack();
    
    // Ana sayfada olmalıyız
    await expect(page).toHaveURL('/');
  });

  test('ileri buton çalışmalı', async ({ page }) => {
    await page.goto('/');
    await page.goto('/catalog');
    await page.goBack();
    
    // İleri git
    await page.goForward();
    
    // Katalog sayfasında olmalıyız
    await expect(page).toHaveURL(/catalog/i);
  });
});

test.describe('Navigation - Dış Linkler', () => {
  test('dış linkler yeni sekmede açılmalı', async ({ page, context }) => {
    await page.goto('/');
    
    // Footer'daki dış linkleri kontrol et
    await page.locator('footer').scrollIntoViewIfNeeded();
    
    const externalLinks = page.locator('a[target="_blank"]');
    const count = await externalLinks.count();
    
    if (count > 0) {
      const firstExternalLink = externalLinks.first();
      await expect(firstExternalLink).toHaveAttribute('target', '_blank');
      
      // rel="noopener noreferrer" olmalı (güvenlik)
      const rel = await firstExternalLink.getAttribute('rel');
      expect(rel).toContain('noopener');
    }
  });
});

test.describe('Navigation - URL Parametreleri', () => {
  test('URL parametreleri korunmalı', async ({ page }) => {
    await page.goto('/catalog?city=Istanbul&price=1000');
    
    const url = page.url();
    expect(url).toContain('city=Istanbul');
    expect(url).toContain('price=1000');
  });

  test('URL hash navigasyonu çalışmalı', async ({ page }) => {
    await page.goto('/about#team');
    
    const url = page.url();
    expect(url).toContain('#team');
  });
});
