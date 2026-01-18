/**
 * Utility Functions Tests
 * 
 * Unit tests for utility functions in the application.
 * Tests formatting, validation, and helper functions.
 */

import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';
import {
  formatPrice,
  convertToSmallestUnit,
  convertFromSmallestUnit,
  validateAmount,
  calculateDiscount,
  validateCardNumber,
  maskCardNumber,
  getCardBrand,
} from '@/lib/payment/utils';

describe('Utils - cn (className merger)', () => {
  it('should merge class names correctly', () => {
    const result = cn('text-base', 'text-red-500');
    expect(result).toBeTruthy();
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const result = cn('base-class', isActive && 'active-class');
    expect(result).toContain('base-class');
    expect(result).toContain('active-class');
  });

  it('should filter out falsy values', () => {
    const result = cn('valid', false, null, undefined, 'also-valid');
    expect(result).toContain('valid');
    expect(result).toContain('also-valid');
  });
});

describe('Payment Utils - Price Formatting', () => {
  it('should format price in TRY correctly', () => {
    expect(formatPrice(50000, 'TRY')).toBe('500,00 TL');
    expect(formatPrice(100, 'TRY')).toBe('1,00 TL');
    expect(formatPrice(99999, 'TRY')).toBe('999,99 TL');
  });

  it('should format price in USD correctly', () => {
    const result = formatPrice(10000, 'USD');
    expect(result).toContain('100');
    expect(result).toContain('$');
  });

  it('should handle zero amount', () => {
    expect(formatPrice(0, 'TRY')).toBe('0,00 TL');
  });
});

describe('Payment Utils - Currency Conversion', () => {
  it('should convert to smallest unit correctly', () => {
    expect(convertToSmallestUnit(500)).toBe(50000);
    expect(convertToSmallestUnit(1)).toBe(100);
    expect(convertToSmallestUnit(0.5)).toBe(50);
  });

  it('should convert from smallest unit correctly', () => {
    expect(convertFromSmallestUnit(50000)).toBe(500);
    expect(convertFromSmallestUnit(100)).toBe(1);
    expect(convertFromSmallestUnit(50)).toBe(0.5);
  });

  it('should handle rounding correctly', () => {
    expect(convertToSmallestUnit(1.005)).toBe(101);
    expect(convertToSmallestUnit(1.004)).toBe(100);
  });
});

describe('Payment Utils - Amount Validation', () => {
  it('should validate valid amounts', () => {
    const result = validateAmount(50000, 100, 1000000);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should reject amounts below minimum', () => {
    const result = validateAmount(50, 100, 1000000);
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('should reject amounts above maximum', () => {
    const result = validateAmount(2000000, 100, 1000000);
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('should reject non-integer amounts', () => {
    const result = validateAmount(100.5, 100, 1000000);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('integer');
  });
});

describe('Payment Utils - Discount Calculation', () => {
  it('should calculate discount correctly', () => {
    expect(calculateDiscount(100000, 10)).toBe(90000);
    expect(calculateDiscount(100000, 20)).toBe(80000);
    expect(calculateDiscount(100000, 50)).toBe(50000);
  });

  it('should handle 0% discount', () => {
    expect(calculateDiscount(100000, 0)).toBe(100000);
  });

  it('should handle 100% discount', () => {
    expect(calculateDiscount(100000, 100)).toBe(0);
  });
});

describe('Payment Utils - Card Validation', () => {
  it('should validate valid card numbers', () => {
    expect(validateCardNumber('4242424242424242')).toBe(true);
    expect(validateCardNumber('5555555555554444')).toBe(true);
  });

  it('should reject invalid card numbers', () => {
    expect(validateCardNumber('1234567890123456')).toBe(false);
    expect(validateCardNumber('0000000000000000')).toBe(false);
  });

  it('should handle card numbers with spaces', () => {
    expect(validateCardNumber('4242 4242 4242 4242')).toBe(true);
  });

  it('should handle card numbers with dashes', () => {
    expect(validateCardNumber('4242-4242-4242-4242')).toBe(true);
  });

  it('should reject cards with invalid length', () => {
    expect(validateCardNumber('424242')).toBe(false);
    expect(validateCardNumber('42424242424242424242')).toBe(false);
  });

  it('should reject cards with letters', () => {
    expect(validateCardNumber('424242424242424A')).toBe(false);
  });
});

describe('Payment Utils - Card Masking', () => {
  it('should mask card number correctly', () => {
    expect(maskCardNumber('4242424242424242')).toBe('************4242');
  });

  it('should handle short numbers', () => {
    expect(maskCardNumber('123')).toBe('****');
  });

  it('should handle card numbers with spaces', () => {
    const result = maskCardNumber('4242 4242 4242 4242');
    expect(result).toContain('4242');
    expect(result).toContain('*');
  });
});

describe('Payment Utils - Card Brand Detection', () => {
  it('should detect Visa cards', () => {
    expect(getCardBrand('4242424242424242')).toBe('Visa');
  });

  it('should detect Mastercard', () => {
    expect(getCardBrand('5555555555554444')).toBe('Mastercard');
  });

  it('should detect American Express', () => {
    expect(getCardBrand('378282246310005')).toBe('American Express');
  });

  it('should return Unknown for unrecognized cards', () => {
    expect(getCardBrand('0000000000000000')).toBe('Unknown');
  });
});
