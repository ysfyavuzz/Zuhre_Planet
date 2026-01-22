/**
 * Payment Utility Functions
 * 
 * Helper functions for payment processing, price formatting,
 * amount conversion, and validation.
 * 
 * @module lib/payment/utils
 * @category Library - Payment
 * 
 * Features:
 * - Currency formatting (TRY, USD, EUR)
 * - Amount conversion (TL to kuruş)
 * - Price validation
 * - Payment method validation
 * - Discount calculation
 * 
 * @example
 * ```typescript
 * import { formatPrice, convertToSmallestUnit } from './utils';
 * 
 * const formatted = formatPrice(50000, 'TRY'); // "500,00 TL"
 * const kurus = convertToSmallestUnit(500); // 50000
 * ```
 */

import type { CurrencyCode, PaymentMethod } from './types';

/**
 * Convert amount to smallest currency unit
 * (e.g., TL to kuruş, USD to cents)
 * 
 * @param amount - Amount in main currency unit
 * @returns Amount in smallest unit
 */
export function convertToSmallestUnit(amount: number): number {
  // Use toFixed to handle floating point precision issues, then convert to number and round
  return Math.round(Number((amount * 100).toFixed(2)));
}

/**
 * Convert from smallest currency unit to main unit
 * (e.g., kuruş to TL, cents to USD)
 * 
 * @param amount - Amount in smallest unit
 * @returns Amount in main currency unit
 */
export function convertFromSmallestUnit(amount: number): number {
  return amount / 100;
}

/**
 * Format price with currency symbol
 * 
 * @param amount - Amount in smallest unit (kuruş, cents)
 * @param currency - Currency code
 * @param locale - Locale for formatting
 * @returns Formatted price string
 */
export function formatPrice(
  amount: number,
  currency: CurrencyCode = 'TRY',
  locale: string = 'tr-TR'
): string {
  const mainAmount = convertFromSmallestUnit(amount);
  
  const symbols: Record<CurrencyCode, string> = {
    TRY: 'TL',
    USD: '$',
    EUR: '€',
  };
  
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(mainAmount);
  
  return `${formatted} ${symbols[currency]}`;
}

/**
 * Validate payment amount
 * 
 * @param amount - Amount to validate
 * @param min - Minimum allowed amount
 * @param max - Maximum allowed amount
 * @returns Validation result
 */
export function validateAmount(
  amount: number,
  min: number = 100,
  max: number = 1000000
): { valid: boolean; error?: string } {
  if (amount < min) {
    return {
      valid: false,
      error: `Minimum amount is ${formatPrice(min)}`,
    };
  }
  
  if (amount > max) {
    return {
      valid: false,
      error: `Maximum amount is ${formatPrice(max)}`,
    };
  }
  
  if (!Number.isInteger(amount)) {
    return {
      valid: false,
      error: 'Amount must be an integer',
    };
  }
  
  return { valid: true };
}

/**
 * Calculate discount amount
 * 
 * @param originalPrice - Original price in smallest unit
 * @param discountPercent - Discount percentage (0-100)
 * @returns Discounted price
 */
export function calculateDiscount(
  originalPrice: number,
  discountPercent: number
): number {
  const discount = Math.round((originalPrice * discountPercent) / 100);
  return originalPrice - discount;
}

/**
 * Calculate discount savings
 * 
 * @param originalPrice - Original price
 * @param discountPercent - Discount percentage
 * @returns Savings amount
 */
export function calculateSavings(
  originalPrice: number,
  discountPercent: number
): number {
  return Math.round((originalPrice * discountPercent) / 100);
}

/**
 * Validate payment method
 * 
 * @param method - Payment method to validate
 * @returns True if valid
 */
export function isValidPaymentMethod(method: string): method is PaymentMethod {
  const validMethods: PaymentMethod[] = [
    'credit_card',
    'debit_card',
    'bank_transfer',
    'wallet',
  ];
  return validMethods.includes(method as PaymentMethod);
}

/**
 * Generate unique conversation ID for payment tracking
 * 
 * @param userId - User ID
 * @param packageId - Package ID
 * @returns Conversation ID
 */
export function generateConversationId(
  userId: number,
  packageId: string
): string {
  const timestamp = Date.now();
  return `${userId}-${packageId}-${timestamp}`;
}

/**
 * Generate payment reference number
 * 
 * @returns Payment reference
 */
export function generatePaymentReference(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `PAY-${timestamp}-${random}`;
}

/**
 * Validate credit card number (basic Luhn algorithm)
 * 
 * @param cardNumber - Card number to validate
 * @returns True if valid
 */
export function validateCardNumber(cardNumber: string): boolean {
  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s-]/g, '');
  
  // Check if only digits
  if (!/^\d+$/.test(cleaned)) {
    return false;
  }
  
  // Check length (13-19 digits)
  if (cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }
  
  // Reject card numbers with all same digit (e.g., 0000000000000000, 1111111111111111)
  if (/^(.)\1+$/.test(cleaned)) {
    return false;
  }
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

/**
 * Mask credit card number
 * 
 * @param cardNumber - Card number to mask
 * @returns Masked card number
 */
export function maskCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/[\s-]/g, '');
  if (cleaned.length < 4) {
    return '****';
  }
  
  const lastFour = cleaned.slice(-4);
  const masked = '*'.repeat(cleaned.length - 4);
  return `${masked}${lastFour}`;
}

/**
 * Get card brand from card number
 * 
 * @param cardNumber - Card number
 * @returns Card brand
 */
export function getCardBrand(cardNumber: string): string {
  const cleaned = cardNumber.replace(/[\s-]/g, '');
  
  if (/^4/.test(cleaned)) return 'Visa';
  if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
  if (/^3[47]/.test(cleaned)) return 'American Express';
  if (/^6(?:011|5)/.test(cleaned)) return 'Discover';
  
  return 'Unknown';
}

/**
 * Calculate VIP plan price with discount
 * 
 * @param basePrice - Base monthly price
 * @param duration - Plan duration
 * @returns Total price with discount
 */
export function calculateVipPrice(
  basePrice: number,
  duration: 'monthly' | 'quarterly' | 'yearly'
): { total: number; discount: number; perMonth: number } {
  const months = duration === 'monthly' ? 1 : duration === 'quarterly' ? 3 : 12;
  const discountPercent = duration === 'monthly' ? 0 : duration === 'quarterly' ? 10 : 20;
  
  const total = calculateDiscount(basePrice * months, discountPercent);
  const perMonth = Math.round(total / months);
  const discount = (basePrice * months) - total;
  
  return { total, discount, perMonth };
}
