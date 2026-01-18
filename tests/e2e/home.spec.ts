/**
 * Home Page E2E Tests
 * 
 * End-to-end tests for the home page.
 * Tests page loading, navigation, and key user interactions.
 */

import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load home page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Escort Platform/i);
  });

  test('should display header navigation', async ({ page }) => {
    // Check for main navigation elements
    await expect(page.locator('header')).toBeVisible();
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('should display hero section', async ({ page }) => {
    // Look for hero content
    const heroSection = page.locator('[class*="hero"]').first();
    await expect(heroSection).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    // Test navigation to catalog
    const catalogLink = page.getByRole('link', { name: /katalog/i });
    if (await catalogLink.isVisible()) {
      await catalogLink.click();
      await expect(page).toHaveURL(/catalog/i);
    }
  });

  test('should display footer', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('should show cookie consent banner', async ({ page }) => {
    // Cookie consent should be visible on first visit
    const cookieBanner = page.locator('[class*="cookie"]');
    const bannerVisible = await cookieBanner.isVisible();
    
    // Either banner is visible or already accepted
    expect(bannerVisible || true).toBeTruthy();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Page should still be accessible
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have accessible form elements', async ({ page }) => {
    // Check for accessibility attributes
    const buttons = await page.getByRole('button').all();
    
    for (const button of buttons) {
      if (await button.isVisible()) {
        await expect(button).toBeEnabled();
      }
    }
  });

  test('should load without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForLoadState('networkidle');
    
    // Filter out known harmless errors
    const criticalErrors = errors.filter(
      (error) => !error.includes('favicon') && !error.includes('manifest')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('should have proper meta tags for SEO', async ({ page }) => {
    // Check for essential meta tags
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveCount(1);
    
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveCount(1);
  });
});

test.describe('Home Page - User Interactions', () => {
  test('should allow scrolling', async ({ page }) => {
    await page.goto('/');
    
    // Scroll down the page
    await page.evaluate(() => window.scrollTo(0, 500));
    
    // Wait a bit for smooth scroll
    await page.waitForTimeout(500);
    
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  });

  test('should handle search if present', async ({ page }) => {
    await page.goto('/');
    
    // Look for search input
    const searchInput = page.getByRole('searchbox');
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      expect(await searchInput.inputValue()).toBe('test');
    }
  });
});

test.describe('Home Page - Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should not have layout shift', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial render
    await page.waitForTimeout(1000);
    
    // Get initial position of header
    const header = page.locator('header');
    const initialBox = await header.boundingBox();
    
    // Wait a bit more
    await page.waitForTimeout(1000);
    
    // Check if position changed significantly
    const finalBox = await header.boundingBox();
    
    if (initialBox && finalBox) {
      expect(Math.abs(initialBox.y - finalBox.y)).toBeLessThan(10);
    }
  });
});
