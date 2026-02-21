import { router, publicProcedure, protectedProcedure } from '../router.core';
import { z } from 'zod';
import { db } from '@/drizzle/db';
import * as schema from '@/drizzle/schema';
import { eq, and, or, gte, lte, sql, desc, asc, ilike } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export const escortRouter = router({
  /**
   * List Escort Profiles with filtering and pagination
   */
  list: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
        city: z.string().optional(),
        tier: z.enum(schema.subscriptionTierEnum).optional(),
        isBoosted: z.boolean().optional(),
        search: z.string().optional(),
        sortBy: z.enum(['rating', 'createdAt', 'hourlyRate']).default('rating'),
        sortOrder: z.enum(['asc', 'desc']).default('desc'),
      })
    )
    .query(async ({ input }) => {
      const { page, limit, city, tier, isBoosted, search, sortBy, sortOrder } = input;

      const whereConditions = [];
      if (city) whereConditions.push(eq(schema.escortProfiles.city, city));
      if (tier) whereConditions.push(eq(schema.escortProfiles.tier, tier));
      if (isBoosted !== undefined) whereConditions.push(eq(schema.escortProfiles.isBoosted, isBoosted));
      if (search) {
        whereConditions.push(
          or(
            ilike(schema.escortProfiles.displayName, `%${search}%`),
            ilike(schema.escortProfiles.bio, `%${search}%`)
          )
        );
      }

      const orderBy = sortOrder === 'asc'
        ? asc(schema.escortProfiles[sortBy])
        : desc(schema.escortProfiles[sortBy]);

      const [profiles, total] = await Promise.all([
        db.query.escortProfiles.findMany({
          where: and(...whereConditions),
          limit: limit,
          offset: (page - 1) * limit,
          orderBy: [desc(schema.escortProfiles.isBoosted), orderBy],
        }),
        db.select({ count: sql<number>`count(*)` }).from(schema.escortProfiles).where(and(...whereConditions)),
      ]);

      return {
        profiles,
        pagination: {
          page,
          limit,
          total: total[0].count,
          totalPages: Math.ceil(total[0].count / limit),
        },
      };
    }),

  /**
   * Get Escort Profile by Slug
   */
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const profile = await db.query.escortProfiles.findFirst({
        where: eq(schema.escortProfiles.slug, input.slug),
        with: {
          media: true, // Assuming a relation 'media' is defined for mediaItems
          reviews: { // Assuming a 'reviews' relation
            limit: 10,
            orderBy: [desc(schema.reviews.createdAt)],
          }
        },
      });

      if (!profile) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Profil bulunamadı.' });
      }

      // Fire-and-forget view count increment
      //@ts-ignore - Drizzle type inference mismatch
      db.update(schema.escortProfiles)
        //@ts-ignore
        .set({ viewCount: sql`${schema.escortProfiles.viewCount} + 1` })
        .where(eq(schema.escortProfiles.id, profile.id))
        .execute()
        .catch(console.error);

      return profile;
    }),

  /**
   * Update own escort profile (Queue for admin approval)
   */
  updateProfile: protectedProcedure
    .input(
      z.object({
        displayName: z.string().optional(),
        bio: z.string().optional(),
        biography: z.string().optional(),
        slogan: z.string().optional(),
        city: z.string().optional(),
        district: z.string().optional(),
        age: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== 'escort') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Sadece escortlar profillerini güncelleyebilir.' });
      }

      // Save the update request to pendingData instead of updating the profile directly
      const [updatedProfile] = await db.update(schema.escortProfiles)
        .set({
          pendingData: JSON.stringify(input),
          hasPendingUpdate: true,
          // We keep the old data as-is on the main columns
        })
        .where(eq(schema.escortProfiles.userId, ctx.user.id))
        .returning();

      if (!updatedProfile) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Güncellenecek escort profili bulunamadı.' });
      }

      return {
        message: 'Profil güncellemeleriniz alındı ve admin onayına sunuldu. Onaylandığında yayına girecektir.',
        profile: updatedProfile
      };
    })
});

export type EscortRouter = typeof escortRouter;
