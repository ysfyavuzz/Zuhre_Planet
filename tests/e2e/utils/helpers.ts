/**
 * E2E Test Helpers
 * 
 * Common helper functions for E2E tests including
 * authentication, navigation, and common actions.
 */

import { Page, expect } from '@playwright/test';
import { TEST_USERS } from './fixtures';

/**
 * Login helper
 * 
 * @param page - Playwright page
 * @param userType - Type of user (client, escort, admin)
 */
export async function login(page: Page, userType: keyof typeof TEST_USERS = 'client') {
  const user = TEST_USERS[userType];
  
  await page.goto('/login');
  await page.fill('input[type="email"]', user.email);
  await page.fill('input[type="password"]', user.password);
  await page.click('button[type="submit"]');
  
  // Wait for navigation to complete
  await page.waitForURL(/^(?!.*\/login).*$/);
}

/**
 * Logout helper
 * 
 * @param page - Playwright page
 */
export async function logout(page: Page) {
  // Click user menu
  await page.click('[data-testid="user-menu-button"]');
  
  // Click logout button
  await page.click('[data-testid="logout-button"]');
  
  // Wait for redirect to login
  await page.waitForURL('/login');
}

/**
 * Wait for element to be visible
 * 
 * @param page - Playwright page
 * @param selector - Element selector
 * @param timeout - Timeout in milliseconds
 */
export async function waitForVisible(page: Page, selector: string, timeout = 5000) {
  await page.waitForSelector(selector, { state: 'visible', timeout });
}

/**
 * Scroll to element
 * 
 * @param page - Playwright page
 * @param selector - Element selector
 */
export async function scrollToElement(page: Page, selector: string) {
  await page.locator(selector).scrollIntoViewIfNeeded();
}

/**
 * Take a screenshot
 * 
 * @param page - Playwright page
 * @param name - Screenshot name
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
}

/**
 * Fill form
 * 
 * @param page - Playwright page
 * @param fields - Object with field selectors and values
 */
export async function fillForm(page: Page, fields: Record<string, string>) {
  for (const [selector, value] of Object.entries(fields)) {
    await page.fill(selector, value);
  }
}

/**
 * Select option from dropdown
 * 
 * @param page - Playwright page
 * @param selector - Dropdown selector
 * @param value - Option value
 */
export async function selectOption(page: Page, selector: string, value: string) {
  await page.selectOption(selector, value);
}

/**
 * Check checkbox
 * 
 * @param page - Playwright page
 * @param selector - Checkbox selector
 */
export async function checkCheckbox(page: Page, selector: string) {
  await page.check(selector);
}

/**
 * Uncheck checkbox
 * 
 * @param page - Playwright page
 * @param selector - Checkbox selector
 */
export async function uncheckCheckbox(page: Page, selector: string) {
  await page.uncheck(selector);
}

/**
 * Wait for loading to finish
 * 
 * @param page - Playwright page
 */
export async function waitForLoadingToFinish(page: Page) {
  // Wait for loading spinner to disappear
  await page.waitForSelector('[data-testid="loading-spinner"]', { state: 'hidden', timeout: 10000 }).catch(() => {
    // Ignore if no loading spinner
  });
}

/**
 * Verify toast message
 * 
 * @param page - Playwright page
 * @param message - Expected message
 */
export async function verifyToast(page: Page, message: string) {
  const toast = page.locator('[data-testid="toast"]', { hasText: message });
  await expect(toast).toBeVisible();
}

/**
 * Verify error message
 * 
 * @param page - Playwright page
 * @param message - Expected error message
 */
export async function verifyError(page: Page, message: string) {
  const error = page.locator('[role="alert"]', { hasText: message });
  await expect(error).toBeVisible();
}

/**
 * Navigate to page
 * 
 * @param page - Playwright page
 * @param path - Page path
 */
export async function navigateToPage(page: Page, path: string) {
  await page.goto(path);
  await waitForLoadingToFinish(page);
}

/**
 * Search escorts
 * 
 * @param page - Playwright page
 * @param query - Search query
 */
export async function searchEscorts(page: Page, query: string) {
  await page.fill('[data-testid="search-input"]', query);
  await page.click('[data-testid="search-button"]');
  await waitForLoadingToFinish(page);
}

/**
 * Apply filter
 * 
 * @param page - Playwright page
 * @param filterType - Type of filter
 * @param value - Filter value
 */
export async function applyFilter(page: Page, filterType: string, value: string) {
  // Open filter panel if not open
  const filterPanel = page.locator('[data-testid="filter-panel"]');
  const isVisible = await filterPanel.isVisible();
  
  if (!isVisible) {
    await page.click('[data-testid="filter-toggle"]');
  }
  
  // Apply filter
  await page.selectOption(`[data-testid="filter-${filterType}"]`, value);
  await page.click('[data-testid="apply-filters"]');
  await waitForLoadingToFinish(page);
}

/**
 * Clear all filters
 * 
 * @param page - Playwright page
 */
export async function clearFilters(page: Page) {
  await page.click('[data-testid="clear-filters"]');
  await waitForLoadingToFinish(page);
}

/**
 * Go to page number
 * 
 * @param page - Playwright page
 * @param pageNumber - Page number
 */
export async function goToPage(page: Page, pageNumber: number) {
  await page.click(`[data-testid="page-${pageNumber}"]`);
  await waitForLoadingToFinish(page);
}

/**
 * Verify element count
 * 
 * @param page - Playwright page
 * @param selector - Element selector
 * @param count - Expected count
 */
export async function verifyElementCount(page: Page, selector: string, count: number) {
  await expect(page.locator(selector)).toHaveCount(count);
}

/**
 * Verify URL
 * 
 * @param page - Playwright page
 * @param url - Expected URL pattern
 */
export async function verifyURL(page: Page, url: string | RegExp) {
  await expect(page).toHaveURL(url);
}

/**
 * Verify title
 * 
 * @param page - Playwright page
 * @param title - Expected title
 */
export async function verifyTitle(page: Page, title: string | RegExp) {
  await expect(page).toHaveTitle(title);
}
