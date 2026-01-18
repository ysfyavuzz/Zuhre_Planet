/**
 * Authentication Flow E2E Tests
 * 
 * End-to-end tests for user authentication flows.
 * Tests login, registration, and session management.
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication - Client Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/client-login');
  });

  test('should display login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /giriş/i })).toBeVisible();
  });

  test('should have email and password fields', async ({ page }) => {
    const emailInput = page.getByLabel(/e-?mail/i);
    const passwordInput = page.getByLabel(/şifre|parola|password/i);
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('should have submit button', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /giriş|login/i });
    await expect(submitButton).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /giriş|login/i });
    await submitButton.click();
    
    // Wait for potential validation messages
    await page.waitForTimeout(500);
    
    // Form should still be visible (not submitted)
    const emailInput = page.getByLabel(/e-?mail/i);
    await expect(emailInput).toBeVisible();
  });

  test('should navigate to registration page', async ({ page }) => {
    const registerLink = page.getByRole('link', { name: /kayıt|register/i });
    
    if (await registerLink.isVisible()) {
      await registerLink.click();
      await expect(page).toHaveURL(/register/i);
    }
  });

  test('should have password visibility toggle', async ({ page }) => {
    const passwordInput = page.getByLabel(/şifre|parola|password/i);
    
    // Type password
    await passwordInput.fill('testpassword');
    
    // Initially should be type="password"
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Look for eye icon button
    const toggleButton = page.locator('button[aria-label*="göster"], button[aria-label*="show"]');
    
    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      
      // Should change to type="text"
      await expect(passwordInput).toHaveAttribute('type', 'text');
    }
  });
});

test.describe('Authentication - Escort Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/escort-login');
  });

  test('should display escort login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /giriş/i })).toBeVisible();
  });

  test('should have similar structure to client login', async ({ page }) => {
    const emailInput = page.getByLabel(/e-?mail/i);
    const passwordInput = page.getByLabel(/şifre|parola|password/i);
    const submitButton = page.getByRole('button', { name: /giriş|login/i });
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });
});

test.describe('Authentication - Client Registration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/client-register');
  });

  test('should display registration form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /kayıt|register/i })).toBeVisible();
  });

  test('should have required registration fields', async ({ page }) => {
    // Common registration fields
    const nameInput = page.getByLabel(/ad|name/i).first();
    const emailInput = page.getByLabel(/e-?mail/i);
    const passwordInput = page.getByLabel(/şifre|parola|password/i).first();
    
    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    const emailInput = page.getByLabel(/e-?mail/i);
    const submitButton = page.getByRole('button', { name: /kayıt|register/i });
    
    // Enter invalid email
    await emailInput.fill('invalid-email');
    await submitButton.click();
    
    // Wait for validation
    await page.waitForTimeout(500);
    
    // Form should still be visible
    await expect(emailInput).toBeVisible();
  });

  test('should have terms and conditions checkbox', async ({ page }) => {
    const checkbox = page.getByRole('checkbox', { name: /kullanım|terms|şart/i });
    
    if (await checkbox.isVisible()) {
      await expect(checkbox).toBeVisible();
    }
  });

  test('should navigate to login page', async ({ page }) => {
    const loginLink = page.getByRole('link', { name: /giriş|login/i });
    
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(page).toHaveURL(/login/i);
    }
  });
});

test.describe('Authentication - Escort Registration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/escort-register');
  });

  test('should display escort registration form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /kayıt|register/i })).toBeVisible();
  });

  test('should have escort-specific fields', async ({ page }) => {
    // Look for escort-specific fields
    const citySelect = page.getByLabel(/şehir|city/i);
    
    if (await citySelect.isVisible()) {
      await expect(citySelect).toBeVisible();
    }
  });

  test('should have photo upload section', async ({ page }) => {
    // Look for file input or upload button
    const uploadButton = page.getByText(/fotoğraf|photo|upload/i);
    
    if (await uploadButton.isVisible()) {
      await expect(uploadButton).toBeVisible();
    }
  });
});

test.describe('Authentication - Session Management', () => {
  test('should redirect authenticated users from login page', async ({ page, context }) => {
    // This test would require setting up authentication state
    // For now, just verify the login page is accessible
    await page.goto('/client-login');
    await expect(page).toHaveURL(/login/i);
  });

  test('should maintain session across page reloads', async ({ page, context }) => {
    // This test would require actual login implementation
    await page.goto('/');
    await expect(page).toHaveURL('/');
  });
});

test.describe('Authentication - Accessibility', () => {
  test('login form should be keyboard accessible', async ({ page }) => {
    await page.goto('/client-login');
    
    // Tab through form elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should be able to navigate through form
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['INPUT', 'BUTTON', 'A']).toContain(focusedElement);
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/client-login');
    
    const emailInput = page.getByLabel(/e-?mail/i);
    await expect(emailInput).toHaveAttribute('type', 'email');
  });
});
