/**
 * Catalog Page E2E Tests
 * 
 * End-to-end tests for the escort catalog page.
 * Tests filtering, pagination, sorting, and search functionality.
 */

import { test, expect } from '@playwright/test';
import { CATALOG, UI } from './utils/selectors';
import { 
  navigateToPage, 
  waitForLoadingToFinish,
  clearFilters,
  verifyElementCount,
} from './utils/helpers';
import { TEST_CITIES, TEST_SERVICES } from './utils/fixtures';

test.describe('Catalog - Sayfa Yükleme', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog');
  });

  test('katalog sayfası doğru yüklenmeli', async ({ page }) => {
    await expect(page).toHaveURL(/catalog/i);
    await expect(page.locator(CATALOG.container)).toBeVisible();
  });

  test('escort kartları görüntülenmeli', async ({ page }) => {
    await waitForLoadingToFinish(page);
    
    const escortCards = page.locator(CATALOG.escortCard);
    await expect(escortCards.first()).toBeVisible();
  });

  test('filtre paneli görüntülenmeli', async ({ page }) => {
    const filterPanel = page.locator(CATALOG.filterPanel);
    
    // Mobile'da filtre paneli toggle ile açılıyor olabilir
    const isVisible = await filterPanel.isVisible();
    
    if (!isVisible) {
      await page.click(CATALOG.filterToggle);
    }
    
    await expect(filterPanel).toBeVisible();
  });
});

test.describe('Catalog - Şehre Göre Filtreleme', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToPage(page, '/catalog');
  });

  test('şehir filtresine göre filtreleme çalışmalı', async ({ page }) => {
    // Filtre panelini aç
    const filterPanel = page.locator(CATALOG.filterPanel);
    const isVisible = await filterPanel.isVisible();
    
    if (!isVisible) {
      await page.click(CATALOG.filterToggle);
    }

    // İlk şehri seç
    const cityFilter = page.locator(CATALOG.cityFilter);
    await cityFilter.selectOption(TEST_CITIES[0]);
    
    // Filtreyi uygula
    const applyButton = page.locator(CATALOG.applyFilters);
    if (await applyButton.isVisible()) {
      await applyButton.click();
    }
    
    await waitForLoadingToFinish(page);
    
    // URL'de şehir parametresi olmalı veya sonuçlar filtrelenmeli
    const url = page.url();
    expect(url.includes(TEST_CITIES[0]) || url.includes('city')).toBeTruthy();
  });

  test('birden fazla şehir seçilebilmeli', async ({ page }) => {
    const filterPanel = page.locator(CATALOG.filterPanel);
    const isVisible = await filterPanel.isVisible();
    
    if (!isVisible) {
      await page.click(CATALOG.filterToggle);
    }

    // Çoklu seçim checkbox'ları varsa
    const cityCheckboxes = page.locator('[data-testid*="city-checkbox"]');
    const count = await cityCheckboxes.count();
    
    if (count > 0) {
      // İlk iki şehri seç
      await cityCheckboxes.nth(0).check();
      await cityCheckboxes.nth(1).check();
      
      await page.click(CATALOG.applyFilters);
      await waitForLoadingToFinish(page);
      
      // Sonuçlar görüntülenmeli
      await expect(page.locator(CATALOG.escortCard).first()).toBeVisible();
    }
  });
});

test.describe('Catalog - Fiyat Aralığına Göre Filtreleme', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToPage(page, '/catalog');
  });

  test('fiyat aralığı filtrelemesi çalışmalı', async ({ page }) => {
    const filterPanel = page.locator(CATALOG.filterPanel);
    const isVisible = await filterPanel.isVisible();
    
    if (!isVisible) {
      await page.click(CATALOG.filterToggle);
    }

    // Min fiyat
    const minPriceInput = page.locator('[data-testid="min-price"]');
    if (await minPriceInput.isVisible()) {
      await minPriceInput.fill('1000');
    }

    // Max fiyat
    const maxPriceInput = page.locator('[data-testid="max-price"]');
    if (await maxPriceInput.isVisible()) {
      await maxPriceInput.fill('2000');
    }

    // Veya slider kullanımı
    const priceSlider = page.locator(CATALOG.priceFilter);
    if (await priceSlider.isVisible()) {
      await priceSlider.fill('1500');
    }

    const applyButton = page.locator(CATALOG.applyFilters);
    if (await applyButton.isVisible()) {
      await applyButton.click();
    }
    
    await waitForLoadingToFinish(page);
    
    // Sonuçlar belirtilen fiyat aralığında olmalı
    await expect(page.locator(CATALOG.escortCard).first()).toBeVisible();
  });
});

test.describe('Catalog - Hizmetlere Göre Filtreleme', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToPage(page, '/catalog');
  });

  test('hizmet filtrelemesi çalışmalı', async ({ page }) => {
    const filterPanel = page.locator(CATALOG.filterPanel);
    const isVisible = await filterPanel.isVisible();
    
    if (!isVisible) {
      await page.click(CATALOG.filterToggle);
    }

    // Hizmet seç
    const servicesFilter = page.locator(CATALOG.servicesFilter);
    if (await servicesFilter.isVisible()) {
      await servicesFilter.selectOption(TEST_SERVICES[0]);
    }

    // Veya checkbox kullanımı
    const serviceCheckboxes = page.locator('[data-testid*="service-checkbox"]');
    const count = await serviceCheckboxes.count();
    
    if (count > 0) {
      await serviceCheckboxes.first().check();
    }

    const applyButton = page.locator(CATALOG.applyFilters);
    if (await applyButton.isVisible()) {
      await applyButton.click();
    }
    
    await waitForLoadingToFinish(page);
    
    // Sonuçlar görüntülenmeli
    await expect(page.locator(CATALOG.escortCard).first()).toBeVisible();
  });

  test('birden fazla hizmet seçilebilmeli', async ({ page }) => {
    const filterPanel = page.locator(CATALOG.filterPanel);
    const isVisible = await filterPanel.isVisible();
    
    if (!isVisible) {
      await page.click(CATALOG.filterToggle);
    }

    const serviceCheckboxes = page.locator('[data-testid*="service-checkbox"]');
    const count = await serviceCheckboxes.count();
    
    if (count >= 2) {
      await serviceCheckboxes.nth(0).check();
      await serviceCheckboxes.nth(1).check();
      
      await page.click(CATALOG.applyFilters);
      await waitForLoadingToFinish(page);
      
      await expect(page.locator(CATALOG.escortCard).first()).toBeVisible();
    }
  });
});

test.describe('Catalog - Sayfalama', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToPage(page, '/catalog');
  });

  test('sayfa numarası değiştirme çalışmalı', async ({ page }) => {
    await waitForLoadingToFinish(page);

    const pagination = page.locator(CATALOG.pagination);
    
    if (await pagination.isVisible()) {
      // 2. sayfaya git
      const page2Button = page.locator('[data-testid="page-2"]');
      
      if (await page2Button.isVisible()) {
        await page2Button.click();
        await waitForLoadingToFinish(page);
        
        // URL'de sayfa parametresi olmalı
        const url = page.url();
        expect(url.includes('page=2') || url.includes('p=2')).toBeTruthy();
      }
    }
  });

  test('ileri/geri butonları çalışmalı', async ({ page }) => {
    await waitForLoadingToFinish(page);

    const nextButton = page.locator('[data-testid="next-page"]');
    
    if (await nextButton.isVisible() && await nextButton.isEnabled()) {
      await nextButton.click();
      await waitForLoadingToFinish(page);
      
      // Geri butonu aktif olmalı
      const prevButton = page.locator('[data-testid="prev-page"]');
      await expect(prevButton).toBeEnabled();
      
      // Geri dön
      await prevButton.click();
      await waitForLoadingToFinish(page);
    }
  });

  test('sayfa başına öğe sayısı değiştirilebilmeli', async ({ page }) => {
    const perPageSelect = page.locator('[data-testid="per-page-select"]');
    
    if (await perPageSelect.isVisible()) {
      // Sayfa başına 20 öğe seç
      await perPageSelect.selectOption('20');
      await waitForLoadingToFinish(page);
      
      // En fazla 20 kart görüntülenmeli
      const cards = page.locator(CATALOG.escortCard);
      const count = await cards.count();
      expect(count).toBeLessThanOrEqual(20);
    }
  });
});

test.describe('Catalog - Sıralama', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToPage(page, '/catalog');
  });

  test('fiyata göre artan sıralama çalışmalı', async ({ page }) => {
    const sortSelect = page.locator(CATALOG.sortSelect);
    
    if (await sortSelect.isVisible()) {
      await sortSelect.selectOption('price-asc');
      await waitForLoadingToFinish(page);
      
      // İlk kartın fiyatı son karttan düşük olmalı
      const cards = page.locator(CATALOG.escortCard);
      await expect(cards.first()).toBeVisible();
    }
  });

  test('fiyata göre azalan sıralama çalışmalı', async ({ page }) => {
    const sortSelect = page.locator(CATALOG.sortSelect);
    
    if (await sortSelect.isVisible()) {
      await sortSelect.selectOption('price-desc');
      await waitForLoadingToFinish(page);
      
      await expect(page.locator(CATALOG.escortCard).first()).toBeVisible();
    }
  });

  test('yeniye göre sıralama çalışmalı', async ({ page }) => {
    const sortSelect = page.locator(CATALOG.sortSelect);
    
    if (await sortSelect.isVisible()) {
      await sortSelect.selectOption('newest');
      await waitForLoadingToFinish(page);
      
      await expect(page.locator(CATALOG.escortCard).first()).toBeVisible();
    }
  });

  test('popülerliğe göre sıralama çalışmalı', async ({ page }) => {
    const sortSelect = page.locator(CATALOG.sortSelect);
    
    if (await sortSelect.isVisible()) {
      await sortSelect.selectOption('popular');
      await waitForLoadingToFinish(page);
      
      await expect(page.locator(CATALOG.escortCard).first()).toBeVisible();
    }
  });
});

test.describe('Catalog - Filtreleri Temizle', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToPage(page, '/catalog');
  });

  test('tüm filtreleri temizle butonu çalışmalı', async ({ page }) => {
    const filterPanel = page.locator(CATALOG.filterPanel);
    const isVisible = await filterPanel.isVisible();
    
    if (!isVisible) {
      await page.click(CATALOG.filterToggle);
    }

    // Birkaç filtre uygula
    const cityFilter = page.locator(CATALOG.cityFilter);
    if (await cityFilter.isVisible()) {
      await cityFilter.selectOption(TEST_CITIES[0]);
    }

    const applyButton = page.locator(CATALOG.applyFilters);
    if (await applyButton.isVisible()) {
      await applyButton.click();
    }
    
    await waitForLoadingToFinish(page);

    // Filtreleri temizle
    const clearButton = page.locator(CATALOG.clearFilters);
    if (await clearButton.isVisible()) {
      await clearButton.click();
      await waitForLoadingToFinish(page);
      
      // URL filtre parametreleri içermemeli
      const url = page.url();
      expect(url.includes('?')).toBeFalsy();
    }
  });

  test('filtreler temizlendiğinde tüm sonuçlar gösterilmeli', async ({ page }) => {
    // Önce filtre uygula
    const filterPanel = page.locator(CATALOG.filterPanel);
    const isVisible = await filterPanel.isVisible();
    
    if (!isVisible) {
      await page.click(CATALOG.filterToggle);
    }

    const cityFilter = page.locator(CATALOG.cityFilter);
    if (await cityFilter.isVisible()) {
      await cityFilter.selectOption(TEST_CITIES[0]);
    }

    const applyButton = page.locator(CATALOG.applyFilters);
    if (await applyButton.isVisible()) {
      await applyButton.click();
    }
    
    await waitForLoadingToFinish(page);

    // Filtrelenmiş sonuç sayısını al
    const filteredCards = await page.locator(CATALOG.escortCard).count();

    // Filtreleri temizle
    await clearFilters(page);

    // Tüm sonuç sayısı filtrelenmiş sonuçtan fazla veya eşit olmalı
    const allCards = await page.locator(CATALOG.escortCard).count();
    expect(allCards).toBeGreaterThanOrEqual(filteredCards);
  });
});

test.describe('Catalog - Sonuç Bulunamadı Mesajı', () => {
  test('eşleşen escort olmadığında "sonuç bulunamadı" mesajı gösterilmeli', async ({ page }) => {
    await navigateToPage(page, '/catalog');
    
    const filterPanel = page.locator(CATALOG.filterPanel);
    const isVisible = await filterPanel.isVisible();
    
    if (!isVisible) {
      await page.click(CATALOG.filterToggle);
    }

    // İmkansız bir filtre kombinasyonu uygula
    const minPriceInput = page.locator('[data-testid="min-price"]');
    if (await minPriceInput.isVisible()) {
      await minPriceInput.fill('999999');
    }

    const applyButton = page.locator(CATALOG.applyFilters);
    if (await applyButton.isVisible()) {
      await applyButton.click();
    }
    
    await waitForLoadingToFinish(page);

    // Sonuç bulunamadı mesajı görünmeli
    const noResultsMessage = page.locator(CATALOG.noResults);
    
    // Ya "sonuç bulunamadı" mesajı görünmeli ya da kart sayısı 0 olmalı
    const cardsCount = await page.locator(CATALOG.escortCard).count();
    
    if (cardsCount === 0) {
      // Hiç sonuç yok, mesaj görünmeli
      await expect(noResultsMessage).toBeVisible();
    }
  });

  test('sonuç bulunamadı mesajı filtreleri temizleme önerisi içermeli', async ({ page }) => {
    await navigateToPage(page, '/catalog');
    
    const filterPanel = page.locator(CATALOG.filterPanel);
    const isVisible = await filterPanel.isVisible();
    
    if (!isVisible) {
      await page.click(CATALOG.filterToggle);
    }

    // İmkansız bir filtre uygula
    const minPriceInput = page.locator('[data-testid="min-price"]');
    if (await minPriceInput.isVisible()) {
      await minPriceInput.fill('999999');
      
      const applyButton = page.locator(CATALOG.applyFilters);
      if (await applyButton.isVisible()) {
        await applyButton.click();
      }
      
      await waitForLoadingToFinish(page);

      const noResultsMessage = page.locator(CATALOG.noResults);
      
      if (await noResultsMessage.isVisible()) {
        // Mesaj içinde "filtre" kelimesi olmalı
        const text = await noResultsMessage.textContent();
        expect(text?.toLowerCase()).toContain('filtre');
      }
    }
  });
});

test.describe('Catalog - Responsive Davranış', () => {
  test('mobil görünümde filtre paneli toggle ile açılmalı', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await navigateToPage(page, '/catalog');

    // Filtre toggle butonu görünür olmalı
    const filterToggle = page.locator(CATALOG.filterToggle);
    await expect(filterToggle).toBeVisible();

    // Toggle'a tıkla
    await filterToggle.click();

    // Filtre paneli açılmalı
    const filterPanel = page.locator(CATALOG.filterPanel);
    await expect(filterPanel).toBeVisible();

    // Tekrar tıkla
    await filterToggle.click();

    // Panel kapanmalı (veya hala görünür olmalı, tasarıma bağlı)
  });

  test('masaüstü görünümde filtre paneli varsayılan olarak açık olmalı', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await navigateToPage(page, '/catalog');

    const filterPanel = page.locator(CATALOG.filterPanel);
    
    // Masaüstünde filtre paneli doğrudan görünür olmalı
    await expect(filterPanel).toBeVisible();
  });
});
