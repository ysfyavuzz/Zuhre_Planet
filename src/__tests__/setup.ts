/**
 * Test Setup for __tests__ directory
 * 
 * Extends Vitest matchers with jest-dom for testing React components
 */

import { expect } from 'vitest';
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Declare TypeScript types for custom matchers
declare module 'vitest' {
  interface Assertion<T = any> extends jest.Matchers<void, T>, TestingLibraryMatchers<T, void> {}
}
