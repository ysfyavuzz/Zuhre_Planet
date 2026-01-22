# 🧪 Testing (Test) Rehberi

Bu dokümantasyon, Escort Platform projesinde test yazma, çalıştırma ve best practices'leri içerir.

---

## 📋 İçindekiler

- [Test Stack](#-test-stack)
- [Unit Tests (Vitest)](#-unit-tests-vitest)
- [E2E Tests (Playwright)](#-e2e-tests-playwright)
- [Writing New Tests](#-writing-new-tests)
- [Test Conventions](#-test-conventions)
- [CI/CD Integration](#-cicd-integration)
- [Test Coverage](#-test-coverage)
- [Debugging Tests](#-debugging-tests)
- [Mock Data & Fixtures](#-mock-data--fixtures)

---

## 🛠️ Test Stack

| Kategori | Tool | Versiyon | Kullanım |
|----------|------|----------|----------|
| **Unit Testing** | Vitest | 1.2.0 | Component ve function testleri |
| **UI Testing** | React Testing Library | 14.1.2 | React component testleri |
| **E2E Testing** | Playwright | 1.40.0 | End-to-end browser testleri |
| **Mocking** | Vitest Mocks | Built-in | API ve function mocking |
| **Coverage** | c8/istanbul | Built-in | Code coverage reporting |
| **Assertions** | Vitest/Chai | Built-in | Test assertions |

### Test Architecture

```
tests/
├── unit/                      # Unit testler
│   ├── components/            # Component testleri
│   │   ├── Button.test.tsx
│   │   ├── Card.test.tsx
│   │   └── Header.test.tsx
│   │
│   ├── hooks/                 # Custom hook testleri
│   │   ├── useAuth.test.ts
│   │   └── useEscorts.test.ts
│   │
│   ├── utils/                 # Utility function testleri
│   │   ├── validation.test.ts
│   │   └── security.test.ts
│   │
│   └── services/              # Service testleri
│       ├── authService.test.ts
│       └── escortService.test.ts
│
├── e2e/                       # E2E testler
│   ├── auth.spec.ts
│   ├── booking.spec.ts
│   ├── escort-profile.spec.ts
│   └── payment.spec.ts
│
├── fixtures/                  # Test fixtures
│   ├── escorts.ts
│   ├── users.ts
│   └── bookings.ts
│
├── setup.ts                   # Test setup & polyfills
└── helpers.ts                 # Test helper functions
```

---

## ⚡ Unit Tests (Vitest)

### Kurulum ve Konfigürasyon

Vitest zaten kurulu. Konfigürasyon `vitest.config.ts` dosyasında:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.js',
        '**/*.config.ts',
        '**/mockData.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Test Komutları

```bash
# Tüm testleri çalıştır
npm test

# Watch mode (değişiklikleri izle)
npm run test:watch

# Coverage raporu
npm run test:coverage

# Specific file
npm test Button.test.tsx

# Specific test suite
npm test -- -t "Button component"

# UI mode (interaktif)
npm run test:ui
```

### Component Testing

```typescript
// tests/unit/components/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button Component', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });

  it('should render with correct variant class', () => {
    const { container } = render(<Button variant="primary">Primary</Button>);
    expect(container.firstChild).toHaveClass('bg-primary');
  });

  it('should render loading state', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('status')).toBeInTheDocument(); // Spinner
  });
});
```

### Hook Testing

```typescript
// tests/unit/hooks/useAuth.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

// Test wrapper
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

describe('useAuth Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with no user', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toBeDefined();
    });
  });

  it('should handle login error', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await expect(
      act(async () => {
        await result.current.login('wrong@example.com', 'wrongpassword');
      })
    ).rejects.toThrow();

    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should logout successfully', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    // Login first
    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    // Then logout
    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
```

### Utility Function Testing

```typescript
// tests/unit/utils/validation.test.ts
import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validatePhone,
  sanitizeInput,
} from '@/utils/validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should validate correct emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user+tag@domain.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      expect(validatePassword('StrongPass123!')).toBe(true);
      expect(validatePassword('MyP@ssw0rd')).toBe(true);
    });

    it('should reject weak passwords', () => {
      expect(validatePassword('weak')).toBe(false);
      expect(validatePassword('12345678')).toBe(false);
      expect(validatePassword('password')).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should remove XSS attempts', () => {
      const malicious = '<script>alert("XSS")</script>';
      expect(sanitizeInput(malicious)).toBe('');
    });

    it('should preserve safe HTML', () => {
      const safe = '<p>Hello <strong>World</strong></p>';
      expect(sanitizeInput(safe)).toBe('<p>Hello <strong>World</strong></p>');
    });
  });
});
```

### Service Testing (with Mocks)

```typescript
// tests/unit/services/escortService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { escortService } from '@/lib/services/escortService';
import { api } from '@/lib/api/client';

// Mock API client
vi.mock('@/lib/api/client', () => ({
  api: {
    escorts: {
      list: { query: vi.fn() },
      getById: { query: vi.fn() },
      create: { mutate: vi.fn() },
      update: { mutate: vi.fn() },
      delete: { mutate: vi.fn() },
    },
  },
}));

describe('escortService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getEscorts', () => {
    it('should fetch escorts with filters', async () => {
      const mockEscorts = [
        { id: '1', name: 'Test Escort', city: 'Istanbul' },
      ];
      
      vi.mocked(api.escorts.list.query).mockResolvedValue(mockEscorts);

      const result = await escortService.getEscorts({ city: 'Istanbul' });

      expect(result).toEqual(mockEscorts);
      expect(api.escorts.list.query).toHaveBeenCalledWith({ city: 'Istanbul' });
    });

    it('should handle errors gracefully', async () => {
      vi.mocked(api.escorts.list.query).mockRejectedValue(
        new Error('Network error')
      );

      await expect(escortService.getEscorts()).rejects.toThrow('Network error');
    });
  });

  describe('createEscort', () => {
    it('should create escort successfully', async () => {
      const newEscort = {
        name: 'New Escort',
        age: 25,
        city: 'Istanbul',
      };
      
      const createdEscort = { id: '123', ...newEscort };
      vi.mocked(api.escorts.create.mutate).mockResolvedValue(createdEscort);

      const result = await escortService.createEscort(newEscort);

      expect(result).toEqual(createdEscort);
      expect(api.escorts.create.mutate).toHaveBeenCalledWith(newEscort);
    });
  });
});
```

---

## 🎭 E2E Tests (Playwright)

### Kurulum ve Konfigürasyon

Playwright zaten kurulu. Konfigürasyon `playwright.config.ts` dosyasında:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Komutları

```bash
# Tüm E2E testleri çalıştır
npm run test:e2e

# Headed mode (browser görünür)
npm run test:e2e -- --headed

# Specific browser
npm run test:e2e -- --project=chromium

# Debug mode
npm run test:e2e -- --debug

# UI mode (interaktif)
npm run test:e2e -- --ui

# Test report
npx playwright show-report
```

### Authentication Test

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should login successfully', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Fill form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');

    // Submit
    await page.click('button[type="submit"]');

    // Verify redirect
    await expect(page).toHaveURL('/dashboard');

    // Verify user menu
    await expect(page.locator('text=Hoşgeldiniz')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Error message should appear
    await expect(page.locator('text=Geçersiz email veya şifre')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    // Logout
    await page.click('[aria-label="User menu"]');
    await page.click('text=Çıkış Yap');

    // Verify redirect to home
    await expect(page).toHaveURL('/');
  });

  test('should register new user', async ({ page }) => {
    await page.goto('/register');

    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', `test-${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'StrongPass123!');
    await page.fill('input[name="confirmPassword"]', 'StrongPass123!');
    await page.check('input[name="agreeTerms"]');

    await page.click('button[type="submit"]');

    // Success message
    await expect(page.locator('text=Kayıt başarılı')).toBeVisible();
  });
});
```

### Escort Profile Test

```typescript
// tests/e2e/escort-profile.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Escort Profile', () => {
  test('should display escort details', async ({ page }) => {
    await page.goto('/escort/test-escort-id');

    // Verify profile elements
    await expect(page.locator('h1')).toContainText('Test Escort');
    await expect(page.locator('text=25 yaşında')).toBeVisible();
    await expect(page.locator('text=Istanbul')).toBeVisible();

    // Verify photo gallery
    const images = page.locator('.gallery img');
    await expect(images).toHaveCount(4);
  });

  test('should open booking modal', async ({ page }) => {
    await page.goto('/escort/test-escort-id');

    // Click booking button
    await page.click('text=Randevu Oluştur');

    // Modal should open
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('text=Randevu Detayları')).toBeVisible();
  });

  test('should add to favorites', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Go to profile
    await page.goto('/escort/test-escort-id');

    // Click favorite button
    await page.click('[aria-label="Favorilere ekle"]');

    // Success toast
    await expect(page.locator('text=Favorilere eklendi')).toBeVisible();

    // Verify in favorites page
    await page.goto('/favorites');
    await expect(page.locator('text=Test Escort')).toBeVisible();
  });
});
```

### Booking Flow Test

```typescript
// tests/e2e/booking.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should create booking successfully', async ({ page }) => {
    // Go to escort profile
    await page.goto('/escort/test-escort-id');

    // Open booking modal
    await page.click('text=Randevu Oluştur');

    // Fill booking form
    await page.fill('input[name="date"]', '2026-02-01');
    await page.fill('input[name="time"]', '19:00');
    await page.selectOption('select[name="duration"]', '2');
    await page.fill('textarea[name="notes"]', 'Test booking note');

    // Submit
    await page.click('button:has-text("Rezervasyon Yap")');

    // Success message
    await expect(page.locator('text=Randevu oluşturuldu')).toBeVisible();

    // Verify in appointments page
    await page.goto('/appointments');
    await expect(page.locator('text=Test Escort')).toBeVisible();
    await expect(page.locator('text=01 Şubat 2026')).toBeVisible();
  });

  test('should cancel booking', async ({ page }) => {
    await page.goto('/appointments');

    // Click cancel button
    await page.click('[aria-label="Randevuyu iptal et"]');

    // Confirm dialog
    await page.click('button:has-text("Evet, İptal Et")');

    // Success message
    await expect(page.locator('text=Randevu iptal edildi')).toBeVisible();
  });
});
```

### Payment Flow Test

```typescript
// tests/e2e/payment.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Payment Flow', () => {
  test('should complete VIP membership payment', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Go to pricing page
    await page.goto('/pricing');

    // Select VIP package
    await page.click('text=VIP Üyelik');
    await page.click('button:has-text("Satın Al")');

    // Fill payment form
    await page.fill('input[name="cardNumber"]', '5528790000000008');
    await page.fill('input[name="cardHolder"]', 'TEST USER');
    await page.fill('input[name="expiry"]', '12/30');
    await page.fill('input[name="cvv"]', '123');

    // Submit payment
    await page.click('button:has-text("Ödemeyi Tamamla")');

    // Wait for 3D Secure (if sandbox)
    // In test environment, auto-redirect might happen

    // Verify success
    await expect(page.locator('text=Ödeme başarılı')).toBeVisible({
      timeout: 10000,
    });

    // Verify VIP badge
    await page.goto('/dashboard');
    await expect(page.locator('text=VIP')).toBeVisible();
  });
});
```

---

## ✍️ Writing New Tests

### Test Yazma Checklist

- [ ] Test dosyası adı `*.test.ts(x)` veya `*.spec.ts` şeklinde
- [ ] `describe` bloğu ile test suite oluştur
- [ ] Her test case için `it` veya `test` kullan
- [ ] Clear ve descriptive test isimleri
- [ ] Arrange-Act-Assert pattern kullan
- [ ] Cleanup (afterEach) gerekirse ekle
- [ ] Edge cases test et
- [ ] Happy path ve error cases

### Arrange-Act-Assert Pattern

```typescript
it('should update user profile', async () => {
  // Arrange: Setup
  const user = { id: '1', name: 'Old Name' };
  const newName = 'New Name';
  
  // Act: Execute
  const result = await updateUserProfile(user.id, { name: newName });
  
  // Assert: Verify
  expect(result.name).toBe(newName);
  expect(result.id).toBe(user.id);
});
```

### Test Organization

```typescript
describe('Feature: User Management', () => {
  describe('Create User', () => {
    it('should create user with valid data', () => {});
    it('should reject invalid email', () => {});
    it('should reject duplicate email', () => {});
  });

  describe('Update User', () => {
    it('should update user profile', () => {});
    it('should not allow updating other users', () => {});
  });

  describe('Delete User', () => {
    it('should soft delete user', () => {});
    it('should prevent deletion of admin', () => {});
  });
});
```

---

## 📏 Test Conventions

### Naming Conventions

```typescript
// ✅ Good: Descriptive names
it('should validate email format correctly', () => {});
it('should redirect to login when token expires', () => {});
it('should display error message for invalid input', () => {});

// ❌ Bad: Vague names
it('test email', () => {});
it('should work', () => {});
it('test', () => {});
```

### File Organization

```
# Component tests
tests/unit/components/Button.test.tsx

# Hook tests
tests/unit/hooks/useAuth.test.ts

# Util tests
tests/unit/utils/validation.test.ts

# E2E tests
tests/e2e/auth.spec.ts
```

### Test Data

```typescript
// Use factories for test data
function createMockUser(overrides = {}) {
  return {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    ...overrides,
  };
}

// Use fixtures
import { mockEscorts } from '../fixtures/escorts';

// Don't hardcode
// ❌ Bad
const user = { id: '1', name: 'John' };

// ✅ Good
const user = createMockUser({ name: 'John' });
```

### Async Testing

```typescript
// ✅ Use async/await
it('should fetch data', async () => {
  const data = await fetchData();
  expect(data).toBeDefined();
});

// ✅ Use waitFor for React Testing Library
it('should display data after fetch', async () => {
  render(<MyComponent />);
  
  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument();
  });
});

// ❌ Don't use setTimeout
it('should display data', (done) => {
  setTimeout(() => {
    expect(data).toBeDefined();
    done();
  }, 1000);
});
```

---

## 🔄 CI/CD Integration

### GitHub Actions Workflow

`.github/workflows/test.yml`:

```yaml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  e2e-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

### Pre-commit Hook

`.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run tests before commit
npm test -- --run
```

---

## 📊 Test Coverage

### Coverage Raporu Görüntüleme

```bash
# Coverage raporu oluştur
npm run test:coverage

# HTML raporu aç (browser'da açılır)
open coverage/index.html
```

### Coverage Goals

| Kategori | Hedef | Mevcut |
|----------|-------|--------|
| **Statements** | >80% | 92.7% |
| **Branches** | >75% | 85.3% |
| **Functions** | >80% | 88.1% |
| **Lines** | >80% | 91.5% |

### Coverage Configuration

`vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
      
      // Minimum coverage thresholds
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
      
      // Exclude files
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.js',
        '**/*.config.ts',
        '**/mockData.ts',
        '**/*.d.ts',
      ],
    },
  },
});
```

---

## 🐛 Debugging Tests

### Vitest Debug

```bash
# Debug mode
npm test -- --inspect

# Browser mode
npm test -- --browser

# UI mode
npm test -- --ui
```

### Playwright Debug

```bash
# Debug mode (steps through tests)
npm run test:e2e -- --debug

# Headed mode (see browser)
npm run test:e2e -- --headed

# Trace viewer
npx playwright show-trace trace.zip
```

### VSCode Debug Configuration

`.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Vitest Tests",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["test", "--", "--run"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    },
    {
      "name": "Debug Playwright Tests",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npx",
      "runtimeArgs": ["playwright", "test", "--debug"],
      "console": "integratedTerminal"
    }
  ]
}
```

### Console Output

```typescript
// Use console.log for debugging
it('should do something', () => {
  console.log('Debug:', variable);
  expect(variable).toBe(expected);
});

// Use screen.debug() for React Testing Library
it('should render component', () => {
  render(<MyComponent />);
  screen.debug(); // Prints DOM tree
});
```

---

## 🎭 Mock Data & Fixtures

### Mock Data Structure

```typescript
// tests/fixtures/escorts.ts
export const mockEscorts = [
  {
    id: '1',
    name: 'Test Escort 1',
    age: 25,
    city: 'Istanbul',
    district: 'Beşiktaş',
    description: 'Test description',
    photos: ['/test1.jpg'],
    verified: true,
    vipMember: true,
  },
  {
    id: '2',
    name: 'Test Escort 2',
    age: 28,
    city: 'Ankara',
    district: 'Çankaya',
    description: 'Test description 2',
    photos: ['/test2.jpg'],
    verified: false,
    vipMember: false,
  },
];

export const mockUsers = [
  {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
  },
  {
    id: '2',
    email: 'escort@example.com',
    name: 'Test Escort',
    role: 'escort',
  },
  {
    id: '3',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
  },
];
```

### Factory Functions

```typescript
// tests/helpers/factories.ts
import { faker } from '@faker-js/faker';

export function createMockEscort(overrides = {}) {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    age: faker.number.int({ min: 21, max: 35 }),
    city: faker.location.city(),
    description: faker.lorem.paragraph(),
    photos: [faker.image.avatar()],
    verified: faker.datatype.boolean(),
    vipMember: faker.datatype.boolean(),
    ...overrides,
  };
}

export function createMockUser(overrides = {}) {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    role: 'user',
    ...overrides,
  };
}

// Usage
const escort = createMockEscort({ city: 'Istanbul' });
const admin = createMockUser({ role: 'admin' });
```

### API Mocking (MSW)

```typescript
// tests/mocks/handlers.ts
import { rest } from 'msw';
import { mockEscorts } from '../fixtures/escorts';

export const handlers = [
  // GET /api/escorts
  rest.get('/api/escorts', (req, res, ctx) => {
    return res(ctx.json(mockEscorts));
  }),

  // GET /api/escorts/:id
  rest.get('/api/escorts/:id', (req, res, ctx) => {
    const { id } = req.params;
    const escort = mockEscorts.find((e) => e.id === id);
    
    if (!escort) {
      return res(ctx.status(404), ctx.json({ message: 'Not found' }));
    }
    
    return res(ctx.json(escort));
  }),

  // POST /api/escorts
  rest.post('/api/escorts', async (req, res, ctx) => {
    const data = await req.json();
    const newEscort = { id: '123', ...data };
    return res(ctx.status(201), ctx.json(newEscort));
  }),
];

// tests/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// tests/setup.ts
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## 🎯 Best Practices

### 1. Test Independence

```typescript
// ✅ Each test should be independent
describe('Escort Service', () => {
  beforeEach(() => {
    // Fresh state for each test
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('test 1', () => {});
  it('test 2', () => {}); // Doesn't depend on test 1
});
```

### 2. Don't Test Implementation Details

```typescript
// ❌ Bad: Testing internal state
it('should set loading to true', () => {
  const { result } = renderHook(() => useData());
  expect(result.current.loading).toBe(true);
});

// ✅ Good: Testing behavior
it('should show loading spinner', () => {
  render(<MyComponent />);
  expect(screen.getByRole('status')).toBeInTheDocument();
});
```

### 3. Use Test IDs Sparingly

```typescript
// ❌ Avoid test IDs
<button data-testid="submit-button">Submit</button>
screen.getByTestId('submit-button');

// ✅ Use semantic queries
<button type="submit">Submit</button>
screen.getByRole('button', { name: /submit/i });
```

### 4. Keep Tests Simple

```typescript
// ✅ One assertion per test (when possible)
it('should validate email', () => {
  expect(validateEmail('test@example.com')).toBe(true);
});

it('should reject invalid email', () => {
  expect(validateEmail('invalid')).toBe(false);
});

// ❌ Multiple unrelated assertions
it('should handle everything', () => {
  expect(validateEmail('test@example.com')).toBe(true);
  expect(validatePassword('pass')).toBe(false);
  expect(validatePhone('123')).toBe(false);
});
```

### 5. Test User Behavior, Not Code

```typescript
// ✅ Good: Test from user perspective
it('should allow user to login', async () => {
  render(<LoginForm />);
  
  await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
  await userEvent.type(screen.getByLabelText(/password/i), 'password123');
  await userEvent.click(screen.getByRole('button', { name: /login/i }));
  
  expect(screen.getByText(/welcome/i)).toBeInTheDocument();
});
```

---

## 📞 Support

Test yazma konusunda yardıma ihtiyacınız varsa:
- **Bu doküman**: Test examples ve best practices
- **Vitest Docs**: [vitest.dev](https://vitest.dev)
- **Playwright Docs**: [playwright.dev](https://playwright.dev)
- **Testing Library**: [testing-library.com](https://testing-library.com)

---

**Dokümantasyon Versiyonu:** v1.0.0
**Son Güncelleme:** Ocak 2026
**Proje Versiyonu:** v4.1.0
