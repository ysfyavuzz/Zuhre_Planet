/**
 * Application Router Module (routers.ts)
 * 
 * Main tRPC router that combines all API routers and procedures for the application.
 * Includes authentication, catalog browsing, admin management, appointments, profiles, and VIP features.
 * 
 * @module lib/routers
 * @category Library - API
 * 
 * Features:
 * - Authentication and session management (auth router)
 * - System health checks (system router)
 * - Payment and credit management (payments router)
 * - Escort catalog browsing and search (catalog router)
 * - Admin panel and user management (admin router)
 * - Appointment scheduling and management (appointments router)
 * - Escort profile CRUD operations (profile router)
 * - VIP membership features (vip router)
 * 
 * Permission Levels:
 * - Public: Available to unauthenticated users
 * - Protected: Requires authentication
 * - Escort-only: Requires escort or admin role
 * - Admin-only: Requires admin role
 * 
 * Key Routers:
 * - system: Health checks and version info
 * - payments: Credit and VIP purchases
 * - auth: Authentication and logout
 * - catalog: Browse and search escorts
 * - admin: Administration and moderation
 * - appointments: Booking management
 * - profile: Escort profile management
 * - vip: VIP features and featured listings
 * 
 * @example
 * ```typescript
 * import { trpc } from '@/lib/trpc';
 * import type { AppRouter } from '@/routers';
 * 
 * // Browse catalog
 * const { data: escorts } = trpc.catalog.list.useQuery();
 * 
 * // Search with filters
 * const searchResults = trpc.catalog.search.useQuery({
 *   city: 'İstanbul',
 *   minPrice: 1000,
 *   maxPrice: 3000
 * });
 * 
 * // Admin: Get pending profiles
 * const pendingProfiles = trpc.admin.getPendingProfiles.useQuery();
 * ```
 * 
 * @typedef {import('./routers').AppRouter} AppRouter
 */

import { COOKIE_NAME } from "./_core/cookies";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { paymentRouter } from "./paymentRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";
import { users, conversations } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { storagePut } from "./storage";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

// Escort-only procedure
const escortProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'escort' && ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Escort access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  payments: paymentRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Katalog ve genel görüntüleme
  catalog: router({
    // Tüm onaylı masörleri listele
    list: publicProcedure
      .input(z.object({
        limit: z.number().optional().default(50),
        offset: z.number().optional().default(0),
      }))
      .query(async ({ input }) => {
        const profiles = await db.getAllApprovedEscorts(input.limit, input.offset);
        return profiles;
      }),

    // Gelişmiş masör arama ve filtreleme
    search: publicProcedure
      .input(z.object({
        city: z.string().optional(),
        district: z.string().optional(),
        category: z.string().optional(),
        minAge: z.number().optional(),
        maxAge: z.number().optional(),
        minHeight: z.number().optional(),
        maxHeight: z.number().optional(),
        minWeight: z.number().optional(),
        maxWeight: z.number().optional(),
        hairColor: z.string().optional(),
        eyeColor: z.string().optional(),
        skinTone: z.string().optional(),
        breastSize: z.string().optional(),
        bodyType: z.string().optional(),
        ethnicity: z.string().optional(),
        nationality: z.string().optional(),
        isVip: z.boolean().optional(),
        isVerified: z.boolean().optional(),
        isActiveOnly: z.boolean().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        limit: z.number().optional().default(50),
        offset: z.number().optional().default(0),
      }))
      .query(async ({ input }) => {
        const profiles = await db.searchEscortsAdvanced(input);
        return profiles;
      }),

    // Tek bir masör profilini getir
    getProfile: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const profile = await db.getEscortProfileById(input.id);
        if (!profile) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Profile not found' });
        }
        
        // Görüntülenme sayısını artır
        await db.incrementViewCount(input.id);
        
        // Fotoğrafları getir
        const photos = await db.getEscortPhotos(input.id);
        
        return {
          ...profile,
          photos,
        };
      }),

    // Şehirleri getir
    getCities: publicProcedure.query(async () => {
      return await db.getCities();
    }),

    // Favorileri listele
    listFavorites: protectedProcedure
      .input(z.object({
        limit: z.number().optional().default(50),
        offset: z.number().optional().default(0),
      }))
      .query(async ({ ctx, input }) => {
        return await db.getUserFavorites(ctx.user.id, input.limit, input.offset);
      }),

    // Favori ekle
    addFavorite: protectedProcedure
      .input(z.object({ escortId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return await db.addFavorite(ctx.user.id, input.escortId);
      }),

    // Favoriden çıkar
    removeFavorite: protectedProcedure
      .input(z.object({ escortId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return await db.removeFavorite(ctx.user.id, input.escortId);
      }),

    // Favorileri kontrol et
    isFavorite: protectedProcedure
      .input(z.object({ escortId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await db.isFavorite(ctx.user.id, input.escortId);
      }),
  }),

  admin: router({
    // Bekleyen başvuruları listele
    getPendingProfiles: adminProcedure.query(async () => {
      const profiles = await db.getPendingEscorts();
      return profiles;
    }),

    // Tüm masörleri listele (duruma göre)
    getProfilesByStatus: adminProcedure
      .input(z.object({
        status: z.enum(['pending', 'approved', 'rejected', 'suspended']),
      }))
      .query(async ({ input }) => {
        const profiles = await db.getAllEscortsByStatus(input.status);
        return profiles;
      }),

    // Profil durumunu güncelle (onayla/reddet)
    updateProfileStatus: adminProcedure
      .input(z.object({
        profileId: z.number(),
        status: z.enum(['approved', 'rejected', 'suspended']),
      }))
      .mutation(async ({ input }) => {
        await db.updateEscortStatus(input.profileId, input.status);
        return { success: true };
      }),

    // Profil detaylarını getir
    getProfileDetail: adminProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        const profile = await db.getEscortProfileById(input.profileId);
        if (!profile) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Profile not found' });
        }

        const photos = await db.getEscortPhotos(input.profileId);
        const user = await db.getUserById(profile.userId);

        return {
          ...profile,
          photos,
          user,
        };
      }),

    // Admin rozet yönetimi
    toggleVerifiedBadge: adminProcedure
      .input(z.object({
        profileId: z.number(),
        isVerified: z.boolean(),
      }))
      .mutation(async ({ input }) => {
        await db.updateEscortVerifiedBadge(input.profileId, input.isVerified);
        return { success: true };
      }),

    // VIP yönetimi
    activateVip: adminProcedure
      .input(z.object({
        profileId: z.number(),
        plan: z.enum(['monthly', 'quarterly', 'yearly']),
      }))
      .mutation(async ({ input }) => {
        const result = await db.activateVip(input.profileId, input.plan);
        return result;
      }),

    deactivateVip: adminProcedure
      .input(z.object({ profileId: z.number() }))
      .mutation(async ({ input }) => {
        await db.deactivateVip(input.profileId);
        return { success: true };
      }),

    // Değerlendirme yönetimi
    getPendingReviews: adminProcedure.query(async () => {
      return await db.getPendingReviews();
    }),

    approveReview: adminProcedure
      .input(z.object({ reviewId: z.number() }))
      .mutation(async ({ input }) => {
        return await db.updateReviewVerification(input.reviewId, true);
      }),

    rejectReview: adminProcedure
      .input(z.object({ reviewId: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteReview(input.reviewId);
      }),

    editReview: adminProcedure
      .input(z.object({
        reviewId: z.number(),
        rating: z.number().min(1).max(5).optional(),
        comment: z.string().optional(),
        selectedTemplates: z.array(z.number()).optional(),
      }))
      .mutation(async ({ input }) => {
        const { reviewId, ...data } = input;
        return await db.updateReview(reviewId, data);
      }),

    // Kapsamlı Admin Kontrol Paneli
    // Dashboard İstatistikleri
    getDashboardStats: adminProcedure.query(async () => {
      const totalUsers = await db.getTotalUsersCount();
      const totalEscorts = await db.getTotalEscortsCount();
      const pendingApprovals = await db.getPendingEscorts();
      
      return {
        totalUsers,
        totalEscorts,
        pendingApprovalsCount: pendingApprovals.length,
      };
    }),

    // Kullanıcı Yönetimi
    getAllUsers: adminProcedure
      .input(z.object({
        limit: z.number().optional().default(50),
        offset: z.number().optional().default(0),
      }))
      .query(async ({ input }) => {
        return await db.getAllUsers(input.limit, input.offset);
      }),

    blockUser: adminProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ input }) => {
        return await db.blockUser(input.userId);
      }),

    unblockUser: adminProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ input }) => {
        return await db.unblockUser(input.userId);
      }),

    deleteUser: adminProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteUser(input.userId);
      }),

    // Escort/Escort Yönetimi
    getAllEscorts: adminProcedure
      .input(z.object({
        limit: z.number().optional().default(50),
        offset: z.number().optional().default(0),
        status: z.enum(['pending', 'approved', 'rejected', 'suspended']).optional(),
      }))
      .query(async ({ input }) => {
        if (input.status) {
          return await db.getAllEscortsByStatus(input.status);
        }
        return await db.getAllEscorts(input.limit, input.offset);
      }),

    editEscort: adminProcedure
      .input(z.object({
        profileId: z.number(),
        displayName: z.string().optional(),
        age: z.number().optional(),
        city: z.string().optional(),
        hourlyRate: z.number().optional(),
        bio: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { profileId, ...data } = input;
        return await db.updateEscortProfile(profileId, data);
      }),

    deleteEscort: adminProcedure
      .input(z.object({ profileId: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteEscort(input.profileId);
      }),

    toggleEscortVisibility: adminProcedure
      .input(z.object({
        profileId: z.number(),
        isVisible: z.boolean(),
      }))
      .mutation(async ({ input }) => {
        return await db.updateEscortVisibility(input.profileId, input.isVisible);
      }),

    suspendEscort: adminProcedure
      .input(z.object({ profileId: z.number() }))
      .mutation(async ({ input }) => {
        return await db.updateEscortStatus(input.profileId, 'suspended');
      }),

    // Yorum Yönetimi
    getAllReviews: adminProcedure
      .input(z.object({
        limit: z.number().optional().default(50),
        offset: z.number().optional().default(0),
      }))
      .query(async ({ input }) => {
        return await db.getAllReviews(input.limit, input.offset);
      }),

    editReviewAdmin: adminProcedure
      .input(z.object({
        reviewId: z.number(),
        rating: z.number().min(1).max(5).optional(),
        comment: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { reviewId, ...data } = input;
        return await db.updateReview(reviewId, data);
      }),

    deleteReviewAdmin: adminProcedure
      .input(z.object({ reviewId: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteReview(input.reviewId);
      }),
  }),

  // Randevu sistemi
  appointments: router({
    // Randevu oluştur
    create: protectedProcedure
      .input(z.object({
        profileId: z.number(),
        appointmentDate: z.date(),
        duration: z.number().default(60),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const profile = await db.getEscortProfileById(input.profileId);
        if (!profile) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Profile not found' });
        }

        return await db.createAppointment({
          userId: ctx.user.id,
          profileId: input.profileId,
          appointmentDate: input.appointmentDate,
          duration: input.duration,
          notes: input.notes,
        });
      }),

    // Kullanıcının randevularını getir
    getUserAppointments: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserAppointments(ctx.user.id);
    }),

    // Masörlerin randevularını getir
    getEscortAppointments: escortProcedure.query(async ({ ctx }) => {
      const profile = await db.getEscortProfileByUserId(ctx.user.id);
      if (!profile) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Profile not found' });
      }
      return await db.getEscortAppointments(profile.id);
    }),
  }),

  // Escort Profil Yönetimi
  profile: router({
    // Profil oluştur
    create: escortProcedure
      .input(z.object({
        displayName: z.string(),
        age: z.number(),
        city: z.string(),
        district: z.string().optional(),
        hourlyRate: z.number(),
        bio: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const existingProfile = await db.getEscortProfileByUserId(ctx.user.id);
        if (existingProfile) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Profile already exists' });
        }

        return await db.createEscortProfile({
          userId: ctx.user.id,
          ...input,
        });
      }),

    // Profili güncelle
    update: escortProcedure
      .input(z.object({
        displayName: z.string().optional(),
        age: z.number().optional(),
        city: z.string().optional(),
        district: z.string().optional(),
        hourlyRate: z.number().optional(),
        bio: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const profile = await db.getEscortProfileByUserId(ctx.user.id);
        if (!profile) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Profile not found' });
        }

        return await db.updateEscortProfile(profile.id, input);
      }),

    // Profili getir
    get: escortProcedure.query(async ({ ctx }) => {
      return await db.getEscortProfileByUserId(ctx.user.id);
    }),

    // Fotoğraf yükle
    uploadPhoto: escortProcedure
      .input(z.object({
        photoData: z.string(), // base64
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const profile = await db.getEscortProfileByUserId(ctx.user.id);
        if (!profile) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Profile not found' });
        }

        // Convert base64 to buffer
        const buffer = Buffer.from(input.photoData, 'base64');
        const fileName = `escort-${profile.id}-${Date.now()}.jpg`;
        
        const { url } = await storagePut(fileName, buffer, 'image/jpeg');

        return await db.addEscortPhoto({
          profileId: profile.id,
          photoUrl: url,
          displayOrder: input.displayOrder || 0,
        });
      }),

    // Fotoğrafları getir
    getPhotos: publicProcedure
      .input(z.object({ profileId: z.number() }))
      .query(async ({ input }) => {
        return await db.getEscortPhotos(input.profileId);
      }),

    // Son aktif zamanını güncelle
    updateLastActive: protectedProcedure.mutation(async ({ ctx }) => {
      return await db.updateLastActive(ctx.user.id);
    }),
  }),

  // VIP sistemi
  vip: router({
    // VIP masörleri getir
    getFeatured: publicProcedure
      .input(z.object({ limit: z.number().optional().default(10) }))
      .query(async ({ input }) => {
        return await db.getVipEscorts(input.limit);
      }),

    // Masör VIP satın alma
    purchase: escortProcedure
      .input(z.object({
        plan: z.enum(['monthly', 'quarterly', 'yearly']),
      }))
      .mutation(async ({ ctx, input }) => {
        const profile = await db.getEscortProfileByUserId(ctx.user.id);
        if (!profile) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Profil bulunamadı' });
        }

        // TODO: Ödeme işlemi entegrasyonu
        // Şimdilik direkt aktive ediyoruz
        return await db.activateVip(profile.id, input.plan);
      }),
  }),
});

export type AppRouter = typeof appRouter;
