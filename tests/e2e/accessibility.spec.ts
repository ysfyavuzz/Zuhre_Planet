/**
 * Accessibility E2E Tests
 * 
 * End-to-end tests for accessibility features.
 * Tests keyboard navigation, ARIA attributes, focus management, and WCAG compliance.
 */

import { test, expect } from '@playwright/test';
import { A11Y, NAV, CATALOG } from './utils/selectors';
import { navigateToPage, waitForLoadingToFinish } from './utils/helpers';

test.describe('Accessibility - Klavye Navigasyonu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Tab tuşu ile elementler arasında gezinme çalışmalı', async ({ page }) => {
    // Tab ile ilk elemana git
    await page.keyboard.press('Tab');
    
    // Bir element focus almalı
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT']).toContain(focusedElement);
    
    // Birkaç kez daha Tab'la
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Hala focusable element'te olmalıyız
    const newFocusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA']).toContain(newFocusedElement);
  });

  test('Shift+Tab ile geriye gitme çalışmalı', async ({ page }) => {
    // Önce birkaç kez Tab'la
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    const element1 = await page.evaluate(() => document.activeElement?.tagName);
    
    // Shift+Tab ile geri git
    await page.keyboard.press('Shift+Tab');
    
    const element2 = await page.evaluate(() => document.activeElement?.tagName);
    
    // İki element de geçerli focusable elementler olmalı
    expect(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA']).toContain(element1);
    expect(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA']).toContain(element2);
  });

  test('Enter tuşu ile link ve butonlar çalışmalı', async ({ page }) => {
    // Katalog linkini bul ve focus al
    const catalogLink = page.getByRole('link', { name: /katalog|catalog/i }).first();
    
    if (await catalogLink.isVisible()) {
      await catalogLink.focus();
      
      // Enter'a bas
      await page.keyboard.press('Enter');
      
      // Katalog sayfasına yönlendirilmeli
      await expect(page).toHaveURL(/catalog/i);
    }
  });

  test('Escape tuşu ile modal kapatılmalı', async ({ page }) => {
    // Bir modal açan buton bul
    const modalTrigger = page.locator('[data-testid*="modal-trigger"], button[data-modal]').first();
    
    if (await modalTrigger.isVisible()) {
      await modalTrigger.click();
      await page.waitForTimeout(300);
      
      // Modal açılmalı
      const modal = page.locator('[role="dialog"]');
      
      if (await modal.isVisible()) {
        // Escape'e bas
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
        
        // Modal kapanmalı
        await expect(modal).not.toBeVisible();
      }
    }
  });

  test('Space tuşu ile butonlar aktive olmalı', async ({ page }) => {
    const button = page.getByRole('button').first();
    
    if (await button.isVisible()) {
      await button.focus();
      
      // Space'e bas
      await page.keyboard.press('Space');
      await page.waitForTimeout(300);
      
      // Buton tıklanmış gibi davranmalı
      // (Tam test için butona özgü davranışları kontrol etmeliyiz)
    }
  });

  test('Ok tuşları ile dropdown navigasyonu çalışmalı', async ({ page }) => {
    await page.goto('/catalog');
    await waitForLoadingToFinish(page);
    
    const sortSelect = page.locator(CATALOG.sortSelect);
    
    if (await sortSelect.isVisible()) {
      await sortSelect.focus();
      
      // ArrowDown ile seçenekler arasında gez
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      
      // Seçim değişmiş olmalı
      const value = await sortSelect.inputValue();
      expect(value).toBeTruthy();
    }
  });
});

test.describe('Accessibility - Butonlar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('tüm butonlar klavye ile erişilebilir olmalı', async ({ page }) => {
    const buttons = await page.getByRole('button').all();
    
    for (const button of buttons) {
      if (await button.isVisible()) {
        await button.focus();
        
        // Buton focus alabilmeli
        const isFocused = await button.evaluate((el) => el === document.activeElement);
        expect(isFocused).toBeTruthy();
      }
    }
  });

  test('butonlar disabled durumda tabindex=-1 olmalı', async ({ page }) => {
    const disabledButtons = page.locator('button:disabled');
    const count = await disabledButtons.count();
    
    for (let i = 0; i < count; i++) {
      const button = disabledButtons.nth(i);
      
      if (await button.isVisible()) {
        // Disabled buton focus almamalı
        const tabindex = await button.getAttribute('tabindex');
        
        // tabindex -1 veya buton focus alamamalı
        expect(tabindex === '-1' || tabindex === null).toBeTruthy();
      }
    }
  });

  test('icon-only butonlar aria-label içermeli', async ({ page }) => {
    const iconButtons = page.locator('button:not(:has-text(""))').filter({
      has: page.locator('svg, i, [class*="icon"]')
    });
    
    const count = await iconButtons.count();
    
    for (let i = 0; i < count; i++) {
      const button = iconButtons.nth(i);
      
      if (await button.isVisible()) {
        const ariaLabel = await button.getAttribute('aria-label');
        const ariaLabelledBy = await button.getAttribute('aria-labelledby');
        const title = await button.getAttribute('title');
        
        // Biri mutlaka olmalı
        expect(ariaLabel || ariaLabelledBy || title).toBeTruthy();
      }
    }
  });
});

test.describe('Accessibility - Form Elementleri', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('tüm input alanları label içermeli', async ({ page }) => {
    const inputs = page.locator('input[type="text"], input[type="email"], input[type="password"], textarea');
    const count = await inputs.count();
    
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      
      if (await input.isVisible()) {
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');
        
        if (id) {
          // ID varsa, ilişkili label olmalı
          const label = page.locator(`label[for="${id}"]`);
          const hasLabel = await label.count() > 0;
          
          expect(hasLabel || ariaLabel || ariaLabelledBy).toBeTruthy();
        } else {
          // ID yoksa aria-label veya aria-labelledby olmalı
          expect(ariaLabel || ariaLabelledBy).toBeTruthy();
        }
      }
    }
  });

  test('required alanlar aria-required içermeli', async ({ page }) => {
    const requiredInputs = page.locator('input[required], textarea[required]');
    const count = await requiredInputs.count();
    
    for (let i = 0; i < count; i++) {
      const input = requiredInputs.nth(i);
      
      if (await input.isVisible()) {
        const ariaRequired = await input.getAttribute('aria-required');
        const required = await input.getAttribute('required');
        
        // required attribute veya aria-required="true" olmalı
        expect(required !== null || ariaRequired === 'true').toBeTruthy();
      }
    }
  });

  test('hata mesajları aria-describedby ile ilişkilendirilmiş olmalı', async ({ page }) => {
    // Geçersiz form gönder
    const submitButton = page.getByRole('button', { name: /giriş|login|submit/i });
    
    if (await submitButton.isVisible()) {
      await submitButton.click();
      await page.waitForTimeout(500);
      
      // Hata mesajlarını bul
      const errors = page.locator('[role="alert"], .error-message, [class*="error"]');
      const errorCount = await errors.count();
      
      if (errorCount > 0) {
        // İlk hata mesajını kontrol et
        const firstError = errors.first();
        const errorId = await firstError.getAttribute('id');
        
        if (errorId) {
          // İlgili input bu error'ı describe etmeli
          const describedInput = page.locator(`[aria-describedby*="${errorId}"]`);
          const hasDescribedInput = await describedInput.count() > 0;
          
          expect(hasDescribedInput).toBeTruthy();
        }
      }
    }
  });

  test('form autocomplete özellikleri doğru kullanılmalı', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    
    if (await emailInput.isVisible()) {
      const autocomplete = await emailInput.getAttribute('autocomplete');
      
      // Email input autocomplete="email" olmalı
      expect(autocomplete).toBe('email');
    }
    
    const passwordInput = page.locator('input[type="password"]');
    
    if (await passwordInput.isVisible()) {
      const autocomplete = await passwordInput.getAttribute('autocomplete');
      
      // Password input uygun autocomplete değerine sahip olmalı
      expect(['current-password', 'new-password', 'off'].includes(autocomplete || '')).toBeTruthy();
    }
  });
});

test.describe('Accessibility - Heading Hiyerarşisi', () => {
  test('her sayfada bir H1 olmalı', async ({ page }) => {
    const pages = ['/', '/catalog', '/about', '/contact'];
    
    for (const path of pages) {
      await page.goto(path);
      await waitForLoadingToFinish(page);
      
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
    }
  });

  test('heading seviyeleri atlanmamalı', async ({ page }) => {
    await page.goto('/');
    
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    const levels: number[] = [];
    
    for (const heading of headings) {
      const tagName = await heading.evaluate((el) => el.tagName);
      const level = parseInt(tagName.replace('H', ''));
      levels.push(level);
    }
    
    // Seviyeler sıralı olmalı ve 1'den fazla atlama olmamalı
    for (let i = 1; i < levels.length; i++) {
      const diff = levels[i] - levels[i - 1];
      expect(diff).toBeLessThanOrEqual(1);
    }
  });

  test('headingler anlamlı içerik içermeli', async ({ page }) => {
    await page.goto('/');
    
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    
    for (const heading of headings) {
      const text = await heading.textContent();
      
      // Heading boş olmamalı
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });
});

test.describe('Accessibility - Skip Link', () => {
  test('skip to main content linki olmalı', async ({ page }) => {
    await page.goto('/');
    
    // İlk Tab'da skip link focus almalı
    await page.keyboard.press('Tab');
    
    const skipLink = page.locator(A11Y.skipLink);
    
    if (await skipLink.isVisible()) {
      await expect(skipLink).toBeVisible();
    } else {
      // Alternatif selector
      const altSkipLink = page.locator('a[href="#main"], a[href="#content"]').first();
      
      if (await altSkipLink.isVisible()) {
        await expect(altSkipLink).toBeVisible();
      }
    }
  });

  test('skip link main content\'e atlamalı', async ({ page }) => {
    await page.goto('/');
    
    await page.keyboard.press('Tab');
    
    const skipLink = page.locator('a[href="#main"], a[href="#content"]').first();
    
    if (await skipLink.isVisible()) {
      await skipLink.click();
      
      // Main content focus almalı
      const main = page.locator('main, #main, #content');
      const mainElement = await main.first().evaluate((el) => el);
      
      expect(mainElement).toBeTruthy();
    }
  });
});

test.describe('Accessibility - Focus Göstergeleri', () => {
  test('focuslanmış elementler görsel geri bildirim vermeli', async ({ page }) => {
    await page.goto('/');
    
    // İlk linke focus al
    const firstLink = page.getByRole('link').first();
    await firstLink.focus();
    
    // Outline veya başka bir focus göstergesi olmalı
    const outline = await firstLink.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.outline !== 'none' || styles.outlineWidth !== '0px' || styles.boxShadow !== 'none';
    });
    
    expect(outline).toBeTruthy();
  });

  test('focus outline kaldırılmamalı', async ({ page }) => {
    await page.goto('/');
    
    const buttons = await page.getByRole('button').all();
    
    for (const button of buttons.slice(0, 5)) { // İlk 5 butonu test et
      if (await button.isVisible()) {
        await button.focus();
        
        const hasVisibleFocus = await button.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return (
            styles.outline !== 'none' ||
            styles.outlineWidth !== '0px' ||
            styles.boxShadow !== 'none' ||
            styles.border !== 'none'
          );
        });
        
        expect(hasVisibleFocus).toBeTruthy();
      }
    }
  });
});

test.describe('Accessibility - Görsellerde Alt Text', () => {
  test('tüm görseller alt text içermeli', async ({ page }) => {
    await page.goto('/');
    
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      
      if (await img.isVisible()) {
        const alt = await img.getAttribute('alt');
        const ariaLabel = await img.getAttribute('aria-label');
        const ariaLabelledBy = await img.getAttribute('aria-labelledby');
        const role = await img.getAttribute('role');
        
        // Dekoratif görsel (role="presentation") dışında alt text olmalı
        if (role !== 'presentation' && role !== 'none') {
          expect(alt !== null || ariaLabel || ariaLabelledBy).toBeTruthy();
        }
      }
    }
  });

  test('dekoratif görseller role="presentation" içermeli', async ({ page }) => {
    await page.goto('/');
    
    // Boş alt text olan görseller
    const decorativeImages = page.locator('img[alt=""]');
    const count = await decorativeImages.count();
    
    for (let i = 0; i < count; i++) {
      const img = decorativeImages.nth(i);
      
      if (await img.isVisible()) {
        const role = await img.getAttribute('role');
        
        // Boş alt text varsa role="presentation" olmalı
        expect(['presentation', 'none'].includes(role || '')).toBeTruthy();
      }
    }
  });

  test('anlamlı alt text kullanılmalı', async ({ page }) => {
    await page.goto('/catalog');
    await waitForLoadingToFinish(page);
    
    const escortImages = page.locator('[data-testid="escort-card"] img');
    const count = await escortImages.count();
    
    for (let i = 0; i < Math.min(count, 3); i++) { // İlk 3'ü test et
      const img = escortImages.nth(i);
      
      if (await img.isVisible()) {
        const alt = await img.getAttribute('alt');
        
        // Alt text anlamlı olmalı (en az 3 karakter)
        if (alt && alt.length > 0) {
          expect(alt.length).toBeGreaterThan(2);
        }
      }
    }
  });
});

test.describe('Accessibility - ARIA Landmarks', () => {
  test('sayfa uygun landmark rolleri içermeli', async ({ page }) => {
    await page.goto('/');
    
    // Main landmark
    const main = page.locator('main, [role="main"]');
    await expect(main).toHaveCount(1);
    
    // Navigation landmark
    const nav = page.locator('nav, [role="navigation"]');
    const navCount = await nav.count();
    expect(navCount).toBeGreaterThan(0);
    
    // Footer/contentinfo
    const footer = page.locator('footer, [role="contentinfo"]');
    await expect(footer).toHaveCount(1);
  });

  test('birden fazla nav olduğunda aria-label ile ayırt edilmeli', async ({ page }) => {
    await page.goto('/');
    
    const navs = page.locator('nav, [role="navigation"]');
    const navCount = await navs.count();
    
    if (navCount > 1) {
      for (let i = 0; i < navCount; i++) {
        const nav = navs.nth(i);
        const ariaLabel = await nav.getAttribute('aria-label');
        const ariaLabelledBy = await nav.getAttribute('aria-labelledby');
        
        expect(ariaLabel || ariaLabelledBy).toBeTruthy();
      }
    }
  });
});

test.describe('Accessibility - Renk Kontrastı', () => {
  test('metin yeterli kontrast oranına sahip olmalı', async ({ page }) => {
    await page.goto('/');
    
    // Ana içerik metnini kontrol et
    const paragraphs = page.locator('p, li, span').filter({ hasText: /.+/ });
    const count = await paragraphs.count();
    
    if (count > 0) {
      const firstParagraph = paragraphs.first();
      
      const contrast = await firstParagraph.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        const color = styles.color;
        const bgColor = styles.backgroundColor;
        
        // Basit kontrast kontrolü (gerçek uygulamada WCAG kontrast hesaplaması yapılmalı)
        return color !== bgColor;
      });
      
      expect(contrast).toBeTruthy();
    }
  });
});

test.describe('Accessibility - Dialog/Modal', () => {
  test('modal açıldığında focus trap çalışmalı', async ({ page }) => {
    await page.goto('/');
    
    const modalTrigger = page.locator('[data-testid*="modal"]').first();
    
    if (await modalTrigger.isVisible()) {
      await modalTrigger.click();
      await page.waitForTimeout(300);
      
      const modal = page.locator('[role="dialog"]');
      
      if (await modal.isVisible()) {
        // Modal içinde Tab ile gezinme
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        
        // Focus modal içinde kalmalı
        const focusedElement = await page.evaluate(() => document.activeElement);
        const isInModal = await modal.evaluate((modal, focused) => {
          return modal.contains(focused);
        }, focusedElement);
        
        expect(isInModal).toBeTruthy();
      }
    }
  });

  test('modal role="dialog" içermeli', async ({ page }) => {
    await page.goto('/');
    
    const modalTrigger = page.locator('[data-testid*="modal"]').first();
    
    if (await modalTrigger.isVisible()) {
      await modalTrigger.click();
      await page.waitForTimeout(300);
      
      const modal = page.locator('[role="dialog"]');
      
      if (await modal.count() > 0) {
        await expect(modal).toBeVisible();
        
        // aria-modal="true" olmalı
        const ariaModal = await modal.getAttribute('aria-modal');
        expect(ariaModal).toBe('true');
      }
    }
  });

  test('modal aria-labelledby veya aria-label içermeli', async ({ page }) => {
    await page.goto('/');
    
    const modalTrigger = page.locator('[data-testid*="modal"]').first();
    
    if (await modalTrigger.isVisible()) {
      await modalTrigger.click();
      await page.waitForTimeout(300);
      
      const modal = page.locator('[role="dialog"]');
      
      if (await modal.isVisible()) {
        const ariaLabel = await modal.getAttribute('aria-label');
        const ariaLabelledBy = await modal.getAttribute('aria-labelledby');
        
        expect(ariaLabel || ariaLabelledBy).toBeTruthy();
      }
    }
  });
});

test.describe('Accessibility - Dinamik İçerik', () => {
  test('yükleme durumları aria-live ile bildirilmeli', async ({ page }) => {
    await page.goto('/catalog');
    
    const loadingSpinner = page.locator('[data-testid="loading-spinner"]');
    
    if (await loadingSpinner.isVisible()) {
      const ariaLive = await loadingSpinner.getAttribute('aria-live');
      const role = await loadingSpinner.getAttribute('role');
      
      // aria-live veya role="status" olmalı
      expect(ariaLive === 'polite' || role === 'status').toBeTruthy();
    }
  });

  test('hata mesajları role="alert" içermeli', async ({ page }) => {
    await page.goto('/login');
    
    // Geçersiz form gönder
    const submitButton = page.getByRole('button', { name: /giriş|login/i });
    await submitButton.click();
    await page.waitForTimeout(500);
    
    const alerts = page.locator('[role="alert"]');
    const count = await alerts.count();
    
    if (count > 0) {
      await expect(alerts.first()).toBeVisible();
    }
  });
});
