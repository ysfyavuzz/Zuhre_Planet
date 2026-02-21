import { router, adminProcedure } from '../router.core';
import { z } from 'zod';
import { db } from '@/drizzle/db';
import * as schema from '@/drizzle/schema';
import { eq, sql, count } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export const adminRouter = router({
    /**
     * Get Platform Statistics
     */
    getPlatformStats: adminProcedure.query(async ({ ctx }) => {
        // Toplam kullanıcıları say
        const [{ totalUsers }] = await db.select({ totalUsers: count() }).from(schema.users);

        // Toplam ilanları say
        const [{ totalListings }] = await db.select({ totalListings: count() }).from(schema.escortProfiles);

        // Aktif ilanları (isVerifiedByAdmin = true) say
        const [{ activeListings }] = await db.select({ activeListings: count() })
            .from(schema.escortProfiles)
            .where(eq(schema.escortProfiles.isVerifiedByAdmin, true));

        // Bekleyen ilanları say
        const [{ pendingListings }] = await db.select({ pendingListings: count() })
            .from(schema.escortProfiles)
            .where(eq(schema.escortProfiles.isVerifiedByAdmin, false));

        // Şikayet sayısı vs format için mock/gerçek karma veri döndürüyoruz
        return {
            totalUsers: Number(totalUsers) || 0,
            totalEscorts: Number(totalListings) || 0,
            totalCustomers: (Number(totalUsers) - Number(totalListings)) || 0,
            totalListings: Number(totalListings) || 0,
            activeListings: Number(activeListings) || 0,
            pendingListings: Number(pendingListings) || 0,
            rejectedListings: 0,
            totalReviews: 120, // TODO: bağla
            pendingReviews: 10,
            flaggedReviews: 2,
            totalRevenue: 245000,
            monthlyRevenue: 45000, // TODO: bağla
            weeklyRevenue: 12000,
            dailyRevenue: 2500,
            activeNow: 42,
            reportsCount: 5,
            pendingReports: 3,
            resolvedReports: 2,
            vipMembers: 15,
            boostedListings: 8
        };
    }),

    /**
     * Get all users
     */
    getUsers: adminProcedure
        .input(z.object({
            page: z.number().default(1),
            limit: z.number().default(20),
            search: z.string().optional()
        }))
        .query(async ({ ctx, input }) => {
            const { page, limit } = input;
            const offset = (page - 1) * limit;

            const users = await db.query.users.findMany({
                limit,
                offset,
                with: {
                    escortProfile: true
                }
            });

            const [{ total }] = await db.select({ total: count() }).from(schema.users);

            return {
                items: users.map(u => ({
                    id: String(u.id),
                    name: u.fullName || u.email,
                    email: u.email,
                    role: u.role,
                    status: 'active', // Varsayılan değer
                    isVerified: u.escortProfile?.isVerifiedByAdmin || false,
                    isBoosted: false,
                    profileVisibility: true,
                    phoneVisibility: 'visible',
                    messageAvailability: true,
                    createdAt: u.createdAt?.toISOString() || new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    lastActive: new Date().toISOString(),
                    isOnline: false
                })),
                total: Number(total),
                page,
                limit,
                hasMore: offset + limit < Number(total),
                totalPages: Math.ceil(Number(total) / limit)
            };
        }),

    /**
     * Get Listings (Escort Profiles)
     */
    getListings: adminProcedure
        .input(z.object({
            page: z.number().default(1),
            limit: z.number().default(20),
            status: z.string().optional()
        }))
        .query(async ({ input }) => {
            const { page, limit } = input;
            const offset = (page - 1) * limit;

            const profiles = await db.query.escortProfiles.findMany({
                limit,
                offset,
                with: {
                    user: true
                }
            });

            const [{ total }] = await db.select({ total: count() }).from(schema.escortProfiles);

            return {
                items: profiles.map(p => ({
                    id: String(p.id),
                    title: p.stageName,
                    slug: p.slug || '',
                    escortId: String(p.userId),
                    escortName: p.displayName || p.stageName,
                    category: 'Escort',
                    location: p.city,
                    city: p.city,
                    price: 1500, // mock
                    priceUnit: 'hourly',
                    status: p.isVerifiedByAdmin ? 'active' : 'pending',
                    isVerified: p.isVerifiedByAdmin || false,
                    isFeatured: p.isVip || false,
                    isBoosted: p.isBoosted || false,
                    createdAt: p.lastActive?.toISOString() || new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    views: p.viewCount || 0,
                    favorites: 0,
                    contacts: 0,
                    photos: 0,
                    reviews: 0,
                    rating: 0,
                    tags: [],
                    services: []
                })),
                total: Number(total),
                page,
                limit,
                hasMore: offset + limit < Number(total),
                totalPages: Math.ceil(Number(total) / limit)
            };
        }),

    /**
     * Approve a listing
     */
    approveListing: adminProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input }) => {
            const profileId = parseInt(input.id, 10);

            await db.update(schema.escortProfiles)
                .set({ isVerifiedByAdmin: true })
                .where(eq(schema.escortProfiles.id, profileId));

            return { success: true, message: 'İlan başarıyla onaylandı.' };
        }),

    /**
     * Reject a listing
     */
    rejectListing: adminProcedure
        .input(z.object({ id: z.string(), reason: z.string().optional() }))
        .mutation(async ({ input }) => {
            const profileId = parseInt(input.id, 10);

            await db.update(schema.escortProfiles)
                .set({ isVerifiedByAdmin: false })
                .where(eq(schema.escortProfiles.id, profileId));

            return { success: true, message: 'İlan reddedildi.' };
        }),

    /**
     * Ban User (Mock functionality)
     */
    banUser: adminProcedure
        .input(z.object({ id: z.string(), reason: z.string().optional() }))
        .mutation(async ({ input }) => {
            return { success: true, message: 'Kullanıcı yasaklandı.' };
        })
});

export type AdminRouter = typeof adminRouter;
