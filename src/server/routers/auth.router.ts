import { router, publicProcedure, protectedProcedure } from '../router.core';
import { z } from 'zod';
import { db } from '@/drizzle/db';
import * as schema from '@/drizzle/schema';
import { eq, or } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ============================================
// DISPOSABLE / FAKE EMAIL DOMAIN BLOCKLIST
// ============================================
const BLOCKED_EMAIL_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'throwaway.email',
  'yopmail.com', 'sharklasers.com', 'guerrillamailblock.com', 'grr.la',
  'guerrillamail.info', 'guerrillamail.biz', 'guerrillamail.de',
  'guerrillamail.net', 'guerrillamail.org', 'spam4.me', 'trashmail.com',
  'trashmail.me', 'trashmail.io', 'trashmail.net', 'fakeinbox.com',
  'mailnesia.com', 'mailnull.com', 'maildrop.cc', 'spamgourmet.com',
  'spamgourmet.net', 'spamgourmet.org', 'disposableemailaddresses.com',
  'dispostable.com', 'spamfree24.org', 'spamfree24.de', 'spamfree24.eu',
  'spamfree24.info', 'spamfree24.net', 'tempinbox.com', 'temp-mail.org',
  'tempr.email', 'throwam.com', 'throwam.eu', 'throwam.net',
  '10minutemail.com', '10minutemail.net', '20minutemail.com',
  'emailondeck.com', 'getonemail.com', 'mailexpire.com', 'deadaddress.com',
  'spamevader.com', 'deadspam.com', 'spamobox.com', 'disposablemail.es',
  'trbvm.com', 'crazymailing.com', 'fakemail.fr', 'spamgob.com',
]);

function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return true;
  return BLOCKED_EMAIL_DOMAINS.has(domain);
}

function generateJWT(userId: number, role: string): string {
  if (!process.env.JWT_SECRET) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'JWT Secret anahtarı tanımlanmamış.',
    });
  }
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export const authRouter = router({
  /**
   * User Registration (Email/Password with full validation)
   */
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email('Geçersiz e-posta adresi.'),
        password: z.string().min(8, 'Şifre en az 8 karakter olmalıdır.'),
        fullName: z.string().min(2, 'Ad Soyad en az 2 karakter olmalıdır.'),
        phoneNumber: z.string()
          .min(10, 'Geçerli bir telefon numarası girin.')
          .regex(/^[+\d\s()-]{10,}$/, 'Geçerli bir telefon numarası girin.'),
        role: z.enum(['customer', 'escort']),
        hasAcceptedTerms: z.boolean().refine(val => val === true, {
          message: 'Kullanım Koşulları ve Gizlilik Politikasını kabul etmelisiniz.',
        }),
      })
    )
    .mutation(async ({ input }) => {
      const { email, password, fullName, phoneNumber, role, hasAcceptedTerms } = input;

      // Block disposable/fake email providers
      if (isDisposableEmail(email)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Tek kullanımlık veya geçici e-posta adresleri kabul edilmemektedir. Lütfen gerçek e-posta adresinizi kullanın.',
        });
      }

      // Check email uniqueness
      const existingByEmail = await db.query.users.findFirst({
        where: eq(schema.users.email, email),
      });
      if (existingByEmail) {
        throw new TRPCError({ code: 'CONFLICT', message: 'Bu e-posta adresi zaten kullanımda.' });
      }

      // Check phone uniqueness
      const existingByPhone = await db.query.users.findFirst({
        where: eq(schema.users.phoneNumber, phoneNumber),
      });
      if (existingByPhone) {
        throw new TRPCError({ code: 'CONFLICT', message: 'Bu telefon numarası zaten başka bir hesaba kayıtlı.' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const [newUser] = await db.insert(schema.users).values({
        email,
        passwordHash: hashedPassword,
        fullName,
        phoneNumber,
        role,
        provider: 'email',
        hasAcceptedTerms,
        termsAcceptedAt: new Date(),
        isProfileComplete: true,
      }).returning({ id: schema.users.id, email: schema.users.email, role: schema.users.role });

      // For escorts: create empty escort profile
      if (role === 'escort') {
        await db.insert(schema.escortProfiles).values({
          userId: newUser.id,
          stageName: fullName,
          city: 'İstanbul', // Default — can be updated later
          visibilityStatus: 'hidden', // Hidden until verified
        }).catch(() => null); // Ignore if fails (e.g., duplicate)
      }

      const token = generateJWT(newUser.id, newUser.role ?? 'customer');

      return {
        status: 'success',
        token,
        user: newUser,
        requiresProfileSetup: false,
      };
    }),

  /**
   * User Login
   */
  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string(),
    }))
    .mutation(async ({ input }) => {
      const { email, password } = input;

      const user = await db.query.users.findFirst({
        where: eq(schema.users.email, email),
      });

      if (!user) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'E-posta veya şifre hatalı.' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'E-posta veya şifre hatalı.' });
      }

      const token = generateJWT(user.id, user.role ?? 'customer');

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          isProfileComplete: user.isProfileComplete,
          hasAcceptedChatRules: user.hasAcceptedChatRules,
        },
        requiresProfileSetup: !user.isProfileComplete,
      };
    }),

  /**
   * Social Auth (Google / Apple)
   * Receives the decoded user info from the OAuth provider.
   * In production, verify the ID token on the server.
   */
  socialAuth: publicProcedure
    .input(z.object({
      email: z.string().email(),
      fullName: z.string().optional(),
      providerId: z.string(),
      provider: z.enum(['google', 'apple']),
    }))
    .mutation(async ({ input }) => {
      const { email, fullName, providerId, provider } = input;

      // Block disposable emails even for social logins
      if (isDisposableEmail(email)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Bu e-posta adresi platformumuzda kullanılamaz.',
        });
      }

      // Check if user already exists (by email or providerId)
      let user = await db.query.users.findFirst({
        where: eq(schema.users.email, email),
      });

      if (!user) {
        // New user — create with incomplete profile
        const [newUser] = await db.insert(schema.users).values({
          email,
          passwordHash: '', // No password for social logins
          fullName: fullName ?? null,
          provider,
          providerId,
          isProfileComplete: false, // Must fill phone, role, and accept terms
          hasAcceptedTerms: false,
        }).returning();
        user = newUser;
      } else {
        // Update provider info if needed
        await db.update(schema.users)
          .set({ provider, providerId })
          .where(eq(schema.users.id, user.id));
      }

      const token = generateJWT(user.id, user.role ?? 'customer');

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          isProfileComplete: user.isProfileComplete,
          hasAcceptedTerms: user.hasAcceptedTerms,
          hasAcceptedChatRules: user.hasAcceptedChatRules,
        },
        requiresProfileSetup: !user.isProfileComplete,
      };
    }),

  /**
   * Complete Profile — called after social login to fill in missing fields
   */
  completeProfile: protectedProcedure
    .input(z.object({
      phoneNumber: z.string()
        .min(10, 'Geçerli bir telefon numarası girin.')
        .regex(/^[+\d\s()-]{10,}$/, 'Geçerli bir telefon numarası girin.'),
      role: z.enum(['customer', 'escort']),
      fullName: z.string().min(2).optional(),
      hasAcceptedTerms: z.boolean().refine(val => val === true, {
        message: 'Kullanım Koşulları kabul edilmelidir.',
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      const { phoneNumber, role, fullName, hasAcceptedTerms } = input;

      // Check phone uniqueness
      const existingByPhone = await db.query.users.findFirst({
        where: eq(schema.users.phoneNumber, phoneNumber),
      });
      if (existingByPhone && existingByPhone.id !== ctx.user.id) {
        throw new TRPCError({ code: 'CONFLICT', message: 'Bu telefon numarası zaten başka bir hesaba kayıtlı.' });
      }

      const [updated] = await db.update(schema.users)
        .set({
          phoneNumber,
          role,
          ...(fullName ? { fullName } : {}),
          hasAcceptedTerms,
          termsAcceptedAt: new Date(),
          isProfileComplete: true,
        })
        .where(eq(schema.users.id, ctx.user.id))
        .returning();

      // For escorts: create escort profile if not exists
      if (role === 'escort') {
        await db.insert(schema.escortProfiles).values({
          userId: updated.id,
          stageName: updated.fullName ?? 'Escort',
          city: 'İstanbul',
          visibilityStatus: 'hidden',
        }).onConflictDoNothing();
      }

      return { success: true, user: updated };
    }),

  /**
   * Accept Chat Rules — called on first chat attempt
   */
  acceptChatRules: protectedProcedure
    .mutation(async ({ ctx }) => {
      await db.update(schema.users)
        .set({
          hasAcceptedChatRules: true,
          chatRulesAcceptedAt: new Date(),
        })
        .where(eq(schema.users.id, ctx.user.id));

      return { success: true };
    }),

  /**
   * Get current user session info
   */
  me: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await db.query.users.findFirst({
        where: eq(schema.users.id, ctx.user.id),
      });
      if (!user) throw new TRPCError({ code: 'NOT_FOUND' });
      return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phoneNumber: user.phoneNumber,
        isProfileComplete: user.isProfileComplete,
        hasAcceptedTerms: user.hasAcceptedTerms,
        hasAcceptedChatRules: user.hasAcceptedChatRules,
        provider: user.provider,
      };
    }),
});

export type AuthRouter = typeof authRouter;
