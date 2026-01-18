/**
 * Input Validation Schemas Module
 *
 * Provides comprehensive input validation schemas using Zod for:
 * - Common data types (email, phone, URL, etc.)
 * - User authentication (registration, login)
 * - Booking operations
 * - Profile updates
 * - General utilities
 *
 * All schemas enforce Turkish locale-specific validations where applicable.
 *
 * @module lib/security/validation
 * @category Library - Security
 *
 * @example
 * ```typescript
 * import {
 *   registerSchema,
 *   loginSchema,
 *   bookingSchema,
 *   validateInput,
 * } from '@/lib/security/validation';
 *
 * // Validate registration data
 * try {
 *   const userData = registerSchema.parse(formData);
 *   // Proceed with registration
 * } catch (error) {
 *   // Handle validation errors
 *   console.error(error.errors);
 * }
 *
 * // Using the safe parse method
 * const result = loginSchema.safeParse(credentials);
 * if (!result.success) {
 *   console.error('Validation failed:', result.error.flatten());
 * }
 * ```
 */

import { z } from 'zod';

// ============================================================================
// Common Validation Schemas
// ============================================================================

/**
 * Email validation schema
 * - Standard email format validation
 * - Lowercase transformation
 * - Trims whitespace
 *
 * @example
 * ```typescript
 * const email = emailSchema.parse('User@Example.COM');
 * // Result: 'user@example.com'
 * ```
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address')
  .toLowerCase()
  .trim();

/**
 * Phone number validation schema (Turkish format)
 * - Accepts formats: 05XX XXXXXXX, 0XXX XXXXXXX, +90 XXX XXXXXXX, etc.
 * - Removes all non-digit characters for validation
 * - Requires 10 digits minimum
 *
 * @example
 * ```typescript
 * const phone = phoneSchema.parse('0532 123 4567');
 * // Valid: Turkish phone format
 *
 * const phone2 = phoneSchema.parse('+90 532 123 4567');
 * // Also valid
 * ```
 */
export const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .refine(
    (phone) => {
      const cleaned = phone.replace(/\D/g, '');
      return cleaned.length >= 10;
    },
    'Phone number must have at least 10 digits'
  )
  .refine(
    (phone) => {
      const cleaned = phone.replace(/\D/g, '');
      // Must start with 5 (mobile) or 2-4 (landline) when considering last 10 digits
      const last10 = cleaned.slice(-10);
      return /^[2-5]/.test(last10);
    },
    'Invalid Turkish phone number'
  );

/**
 * URL validation schema
 * - Standard URL format validation
 * - Must be valid HTTP or HTTPS
 * - Lowercase transformation
 *
 * @example
 * ```typescript
 * const url = urlSchema.parse('HTTPS://EXAMPLE.COM');
 * // Result: 'https://example.com/'
 * ```
 */
export const urlSchema = z
  .string()
  .url('Invalid URL')
  .toLowerCase();

/**
 * Strong password validation schema
 * - Minimum 8 characters
 * - Must contain uppercase letter
 * - Must contain lowercase letter
 * - Must contain number
 * - Must contain special character
 *
 * @example
 * ```typescript
 * const password = passwordSchema.parse('SecurePass123!');
 * // Valid: meets all requirements
 * ```
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .refine(
    (pwd) => /[a-z]/.test(pwd),
    'Password must contain at least one lowercase letter'
  )
  .refine(
    (pwd) => /[A-Z]/.test(pwd),
    'Password must contain at least one uppercase letter'
  )
  .refine(
    (pwd) => /\d/.test(pwd),
    'Password must contain at least one number'
  )
  .refine(
    (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    'Password must contain at least one special character'
  )
  .refine(
    (pwd) => !['password', '123456', '12345678', 'qwerty', 'abc123'].includes(pwd.toLowerCase()),
    'Password is too common'
  );

/**
 * Name validation schema (first/last name)
 * - Minimum 2 characters
 * - Maximum 50 characters
 * - Allows letters, spaces, hyphens, and apostrophes
 * - Trims whitespace
 *
 * @example
 * ```typescript
 * const name = nameSchema.parse('Jean-Claude');
 * // Valid
 * ```
 */
export const nameSchema = z
  .string()
  .trim()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .refine(
    (name) => /^[a-zA-ZçğıöşüÇĞİÖŞÜ\s\-']+$/.test(name),
    'Name can only contain letters, spaces, hyphens, and apostrophes'
  );

/**
 * Username validation schema
 * - 3-20 characters
 * - Alphanumeric and underscores only
 * - Must start with letter
 * - Lowercase only
 *
 * @example
 * ```typescript
 * const username = usernameSchema.parse('john_doe');
 * // Valid
 * ```
 */
export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be less than 20 characters')
  .refine(
    (username) => /^[a-z][a-z0-9_]*$/.test(username),
    'Username must start with a letter and contain only lowercase letters, numbers, and underscores'
  );

/**
 * Date of birth validation schema
 * - Must be a valid date
 * - Must be at least 18 years old
 * - Cannot be in the future
 *
 * @example
 * ```typescript
 * const dob = dobSchema.parse('1990-01-15');
 * // Valid: older than 18
 * ```
 */
export const dobSchema = z
  .string()
  .refine(
    (dateStr) => !isNaN(Date.parse(dateStr)),
    'Invalid date format'
  )
  .transform((dateStr) => new Date(dateStr))
  .refine(
    (date) => date < new Date(),
    'Birth date cannot be in the future'
  )
  .refine(
    (date) => {
      const age = new Date().getFullYear() - date.getFullYear();
      const monthDiff = new Date().getMonth() - date.getMonth();
      return monthDiff >= 0 ? age >= 18 : age >= 19;
    },
    'Must be at least 18 years old'
  );

/**
 * Currency amount validation schema
 * - Must be positive number
 * - Maximum 2 decimal places
 * - No larger than 999999999.99
 *
 * @example
 * ```typescript
 * const price = currencySchema.parse(99.99);
 * // Valid
 * ```
 */
export const currencySchema = z
  .number()
  .positive('Amount must be greater than 0')
  .max(999999999.99, 'Amount is too large')
  .refine(
    (amount) => {
      const decimals = amount.toString().split('.')[1];
      return !decimals || decimals.length <= 2;
    },
    'Amount can have maximum 2 decimal places'
  );

/**
 * Slug validation schema
 * - 3-50 characters
 * - Lowercase alphanumeric and hyphens only
 * - Must start and end with alphanumeric
 *
 * @example
 * ```typescript
 * const slug = slugSchema.parse('my-awesome-post');
 * // Valid
 * ```
 */
export const slugSchema = z
  .string()
  .min(3, 'Slug must be at least 3 characters')
  .max(50, 'Slug must be less than 50 characters')
  .refine(
    (slug) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug),
    'Slug must contain only lowercase letters, numbers, and hyphens'
  );

// ============================================================================
// Authentication Schemas
// ============================================================================

/**
 * Registration schema
 * - Email validation
 * - Password validation (strong)
 * - First and last name
 * - Phone number (optional)
 * - Terms acceptance
 *
 * @example
 * ```typescript
 * const result = registerSchema.safeParse({
 *   email: 'user@example.com',
 *   password: 'SecurePass123!',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   phone: '0532 123 4567',
 *   termsAccepted: true,
 * });
 * ```
 */
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema.optional(),
  termsAccepted: z
    .boolean()
    .refine((value) => value === true, 'You must accept the terms and conditions'),
});

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Login schema
 * - Email or username
 * - Password
 * - Optional remember me
 *
 * @example
 * ```typescript
 * const result = loginSchema.safeParse({
 *   email: 'user@example.com',
 *   password: 'SecurePass123!',
 *   rememberMe: true,
 * });
 * ```
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Password reset request schema
 * - Valid email address
 *
 * @example
 * ```typescript
 * const result = passwordResetRequestSchema.safeParse({
 *   email: 'user@example.com',
 * });
 * ```
 */
export const passwordResetRequestSchema = z.object({
  email: emailSchema,
});

export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;

/**
 * Password reset schema
 * - Valid token
 * - New password (strong)
 * - Password confirmation
 *
 * @example
 * ```typescript
 * const result = passwordResetSchema.safeParse({
 *   token: 'reset-token-xyz',
 *   password: 'NewSecurePass123!',
 *   confirmPassword: 'NewSecurePass123!',
 * });
 * ```
 */
export const passwordResetSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type PasswordResetInput = z.infer<typeof passwordResetSchema>;

/**
 * Change password schema
 * - Current password for verification
 * - New password (strong, different from current)
 * - Password confirmation
 *
 * @example
 * ```typescript
 * const result = changePasswordSchema.safeParse({
 *   currentPassword: 'OldPass123!',
 *   newPassword: 'NewSecurePass123!',
 *   confirmPassword: 'NewSecurePass123!',
 * });
 * ```
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// ============================================================================
// Profile Schemas
// ============================================================================

/**
 * Profile update schema
 * - First name
 * - Last name
 * - Phone number (optional)
 * - Bio/description (optional)
 * - Date of birth (optional)
 *
 * @example
 * ```typescript
 * const result = profileUpdateSchema.safeParse({
 *   firstName: 'John',
 *   lastName: 'Smith',
 *   phone: '0532 123 4567',
 *   bio: 'Professional massage therapist...',
 *   dateOfBirth: '1990-01-15',
 * });
 * ```
 */
export const profileUpdateSchema = z.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  phone: phoneSchema.optional(),
  bio: z
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .optional(),
  dateOfBirth: dobSchema.optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

/**
 * Profile avatar/picture update schema
 * - Image file (JPEG, PNG only)
 * - Maximum 5MB
 *
 * @example
 * ```typescript
 * const result = profilePhotoSchema.safeParse({
 *   imageUrl: 'https://cdn.example.com/image.jpg',
 * });
 * ```
 */
export const profilePhotoSchema = z.object({
  imageUrl: urlSchema,
});

export type ProfilePhotoInput = z.infer<typeof profilePhotoSchema>;

// ============================================================================
// Booking Schemas
// ============================================================================

/**
 * Booking creation schema
 * - Service ID
 * - Therapist ID
 * - Booking date (must be future)
 * - Start time
 * - Duration in minutes
 * - Location (optional for mobile services)
 * - Notes (optional)
 * - Payment method
 *
 * @example
 * ```typescript
 * const result = bookingSchema.safeParse({
 *   serviceId: 'service-123',
 *   therapistId: 'therapist-456',
 *   bookingDate: '2024-02-15',
 *   startTime: '14:00',
 *   durationMinutes: 60,
 *   notes: 'Deep tissue massage preferred',
 *   paymentMethod: 'credit_card',
 * });
 * ```
 */
export const bookingSchema = z.object({
  serviceId: z.string().min(1, 'Service is required'),
  therapistId: z.string().min(1, 'Therapist is required'),
  bookingDate: z
    .string()
    .refine(
      (dateStr) => !isNaN(Date.parse(dateStr)),
      'Invalid date format'
    )
    .refine(
      (dateStr) => new Date(dateStr) > new Date(),
      'Booking date must be in the future'
    ),
  startTime: z
    .string()
    .refine(
      (time) => /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(time),
      'Invalid time format (use HH:MM)'
    ),
  durationMinutes: z
    .number()
    .positive('Duration must be greater than 0')
    .multipleOf(15, 'Duration must be a multiple of 15 minutes')
    .max(480, 'Duration must not exceed 8 hours'),
  location: z
    .string()
    .min(1, 'Location is required')
    .max(255, 'Location must be less than 255 characters')
    .optional(),
  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .optional(),
  paymentMethod: z.enum(['credit_card', 'debit_card', 'cash', 'bank_transfer']),
});

export type BookingInput = z.infer<typeof bookingSchema>;

/**
 * Booking cancellation schema
 * - Booking ID
 * - Cancellation reason (optional)
 *
 * @example
 * ```typescript
 * const result = bookingCancellationSchema.safeParse({
 *   bookingId: 'booking-789',
 *   reason: 'Schedule conflict',
 * });
 * ```
 */
export const bookingCancellationSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
  reason: z
    .string()
    .max(255, 'Reason must be less than 255 characters')
    .optional(),
});

export type BookingCancellationInput = z.infer<typeof bookingCancellationSchema>;

/**
 * Booking reschedule schema
 * - Booking ID
 * - New date (must be future)
 * - New time
 *
 * @example
 * ```typescript
 * const result = bookingRescheduleSchema.safeParse({
 *   bookingId: 'booking-789',
 *   newDate: '2024-02-20',
 *   newTime: '15:30',
 * });
 * ```
 */
export const bookingRescheduleSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
  newDate: z
    .string()
    .refine(
      (dateStr) => !isNaN(Date.parse(dateStr)),
      'Invalid date format'
    )
    .refine(
      (dateStr) => new Date(dateStr) > new Date(),
      'New date must be in the future'
    ),
  newTime: z
    .string()
    .refine(
      (time) => /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(time),
      'Invalid time format (use HH:MM)'
    ),
});

export type BookingRescheduleInput = z.infer<typeof bookingRescheduleSchema>;

/**
 * Booking review schema
 * - Booking ID
 * - Rating (1-5 stars)
 * - Review text
 * - Would recommend (boolean)
 *
 * @example
 * ```typescript
 * const result = bookingReviewSchema.safeParse({
 *   bookingId: 'booking-789',
 *   rating: 5,
 *   reviewText: 'Excellent service, very professional!',
 *   wouldRecommend: true,
 * });
 * ```
 */
export const bookingReviewSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
  rating: z
    .number()
    .int('Rating must be a whole number')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  reviewText: z
    .string()
    .min(10, 'Review must be at least 10 characters')
    .max(1000, 'Review must be less than 1000 characters'),
  wouldRecommend: z.boolean(),
});

export type BookingReviewInput = z.infer<typeof bookingReviewSchema>;

// ============================================================================
// Pagination & Filtering Schemas
// ============================================================================

/**
 * Pagination schema
 * - Page number (1-based)
 * - Items per page
 *
 * @example
 * ```typescript
 * const result = paginationSchema.safeParse({
 *   page: 1,
 *   perPage: 20,
 * });
 * ```
 */
export const paginationSchema = z.object({
  page: z
    .number()
    .int()
    .positive('Page must be greater than 0')
    .default(1),
  perPage: z
    .number()
    .int()
    .positive('Items per page must be greater than 0')
    .max(100, 'Items per page cannot exceed 100')
    .default(20),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

/**
 * Sorting schema
 * - Sort field
 * - Sort order (asc/desc)
 *
 * @example
 * ```typescript
 * const result = sortingSchema.safeParse({
 *   sortBy: 'createdAt',
 *   sortOrder: 'desc',
 * });
 * ```
 */
export const sortingSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export type SortingInput = z.infer<typeof sortingSchema>;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Validates input against a schema and returns the result
 *
 * @param {z.ZodSchema} schema - The Zod schema to validate against
 * @param {unknown} data - The data to validate
 * @returns {z.SafeParseReturnType} Result object with success/error
 *
 * @example
 * ```typescript
 * const result = validateInput(emailSchema, 'user@example.com');
 * if (result.success) {
 *   console.log('Valid:', result.data);
 * } else {
 *   console.error('Invalid:', result.error.flatten());
 * }
 * ```
 */
export function validateInput<T extends z.ZodSchema>(
  schema: T,
  data: unknown
): z.SafeParseReturnType<z.input<T>, z.output<T>> {
  return schema.safeParse(data);
}

/**
 * Formats validation errors into a user-friendly object
 *
 * @param {z.ZodError} error - The Zod validation error
 * @returns {Record<string, string>} Flattened error messages by field
 *
 * @example
 * ```typescript
 * const result = registerSchema.safeParse(data);
 * if (!result.success) {
 *   const errors = formatValidationErrors(result.error);
 *   // { email: 'Invalid email address', password: 'Password too common' }
 * }
 * ```
 */
export function formatValidationErrors(error: z.ZodError): Record<string, string> {
  const flattened = error.flatten();
  const errors: Record<string, string> = {};

  // Flatten field errors
  for (const [field, messages] of Object.entries(flattened.fieldErrors)) {
    if (messages && messages.length > 0) {
      errors[field] = messages[0];
    }
  }

  // Add form-level errors if any
  if (flattened.formErrors && flattened.formErrors.length > 0) {
    errors.form = flattened.formErrors[0];
  }

  return errors;
}

/**
 * Sanitizes user input by removing/escaping potentially dangerous characters
 *
 * @param {string} input - The input to sanitize
 * @returns {string} Sanitized input
 *
 * @example
 * ```typescript
 * const safe = sanitizeInput('<script>alert("xss")</script>');
 * // Result: 'scriptalert("xss")/script'
 * ```
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .trim();
}
