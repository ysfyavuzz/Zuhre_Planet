import { router, adminProcedure } from '../router.core';
import { z } from 'zod';
import { db } from '@/drizzle/db';
import * as schema from '@/drizzle/schema';
import { eq, sql } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

/**
 * Audit Logger Helper
 * Veritabanına yönetici aksiyonlarını kaydeder
 */
async function logAdminAction(ctx: any, input: {
    action: string,
    targetType: string,
    targetId?: number,
    previousData?: any,
    newData?: any
}) {
    try {
        // @ts-ignore - Drizzle types might not be updated in the IDE yet
        await db.insert(schema.auditLogs).values({
            adminId: ctx.user.id,
            action: input.action,
            targetType: input.targetType,
            targetId: input.targetId,
            previousData: input.previousData ? JSON.stringify(input.previousData) : null,
            newData: input.newData ? JSON.stringify(input.newData) : null,
            ipAddress: 'internal', // Gelecekte ctx üzerinden IP alınabilir
        });
    } catch (error) {
        console.error('Audit log failed:', error);
    }
}

export const adminActionsRouter = router({
    /**
     * Shadowban a user
     * Kullanıcı banlandığını anlamaz ama içerikleri filtrelenir
     */
    setShadowBan: adminProcedure
        .input(z.object({
            userId: z.number(),
            status: z.boolean()
        }))
        .mutation(async ({ ctx, input }) => {
            const [user] = await db.select().from(schema.users).where(eq(schema.users.id, input.userId));

            if (!user) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Kullanıcı bulunamadı.' });
            }

            // @ts-ignore
            await db.update(schema.users)
                .set({ isShadowBanned: input.status })
                .where(eq(schema.users.id, input.userId));

            await logAdminAction(ctx, {
                action: input.status ? 'SHADOWBAN_ENABLE' : 'SHADOWBAN_DISABLE',
                targetType: 'USER',
                targetId: input.userId,
                previousData: { isShadowBanned: user.isShadowBanned },
                newData: { isShadowBanned: input.status }
            });

            return { success: true, message: `Shadowban durumu ${input.status ? 'aktif' : 'pasif'} edildi.` };
        }),

    /**
     * Get Audit Logs
     * Kim ne yapmış listesi
     */
    getAuditLogs: adminProcedure
        .input(z.object({
            limit: z.number().default(50),
            offset: z.number().default(0)
        }))
        .query(async ({ input }) => {
            const logs = await db.query.auditLogs.findMany({
                limit: input.limit,
                offset: input.offset,
                orderBy: (logs, { desc }) => [desc(logs.createdAt)],
                with: {
                    admin: true
                }
            });

            return logs;
        }),

    /**
     * Set User Rank & Points (Manual Intervention)
     */
    adjustLoyalty: adminProcedure
        .input(z.object({
            userId: z.number(),
            points: z.number(),
            reason: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            const [user] = await db.select().from(schema.users).where(eq(schema.users.id, input.userId));

            if (!user) throw new TRPCError({ code: 'NOT_FOUND' });

            await db.transaction(async (tx) => {
                // @ts-ignore
                await tx.update(schema.users)
                    .set({ loyaltyPoints: (user.loyaltyPoints || 0) + input.points })
                    .where(eq(schema.users.id, input.userId));

                // @ts-ignore
                await tx.insert(schema.loyaltyTransactions).values({
                    userId: input.userId,
                    amount: input.points,
                    type: input.points >= 0 ? 'earn' : 'spend',
                    description: `Admin Müdahalesi: ${input.reason}`
                });
            });

            await logAdminAction(ctx, {
                action: 'ADJUST_LOYALTY',
                targetType: 'USER',
                targetId: input.userId,
                newData: { adjustAmount: input.points, reason: input.reason }
            });

            return { success: true };
        }),

    /**
     * Approve Escort Verification & Start Free Trial
     */
    approveEscort: adminProcedure
        .input(z.object({
            profileId: z.number(),
        }))
        .mutation(async ({ ctx, input }) => {
            const [profile] = await db.select().from(schema.escortProfiles).where(eq(schema.escortProfiles.id, input.profileId));
            if (!profile) throw new TRPCError({ code: 'NOT_FOUND' });

            const freeTrialEndDate = new Date();
            freeTrialEndDate.setDate(freeTrialEndDate.getDate() + 7); // +7 Gün Ücretsiz

            return await db.transaction(async (tx) => {
                // 1. Profili Onayla ve Yayına Al
                // @ts-ignore
                await tx.update(schema.escortProfiles)
                    .set({
                        verificationStatus: 'approved',
                        visibilityStatus: 'public',
                        isVerifiedByAdmin: true,
                        verifiedAt: new Date(),
                        freeTrialEndsAt: freeTrialEndDate,
                        hasVerifiedBadge: true
                    })
                    .where(eq(schema.escortProfiles.id, input.profileId));

                // 2. Audit Log Kaydet
                await logAdminAction(ctx, {
                    action: 'APPROVE_ESCORT_VERIFICATION',
                    targetType: 'escort_profile',
                    targetId: input.profileId,
                    newData: { verificationStatus: 'approved', freeTrialEndsAt: freeTrialEndDate }
                });

                // 3. Kullanıcıya XP ve Sadakat Puanı Ver (Hoş Geldin Hediyesi)
                await tx.update(schema.users)
                    .set({
                        // @ts-ignore
                        experiencePoints: sql`${schema.users.experiencePoints} + 100`,
                        // @ts-ignore
                        loyaltyPoints: sql`${schema.users.loyaltyPoints} + 20`
                    })
                    .where(eq(schema.users.id, profile.userId!));

                return { success: true, freeTrialEndsAt: freeTrialEndDate };
            });
        }),
    /**
     * Get Pending Profile Updates
     * hasPendingUpdate = true olan profilleri listeler
     */
    getPendingProfileUpdates: adminProcedure
        .input(z.object({
            limit: z.number().default(20),
            offset: z.number().default(0),
        }))
        .query(async ({ input }) => {
            // @ts-ignore
            const profiles = await db.query.escortProfiles.findMany({
                where: (p: any, { eq }: any) => eq(p.hasPendingUpdate, true),
                limit: input.limit,
                offset: input.offset,
                orderBy: (p: any, { desc }: any) => [desc(p.lastActive)],
                with: {
                    user: { columns: { id: true, email: true, fullName: true } }
                }
            });

            return profiles.map((p: any) => ({
                ...p,
                pendingDataParsed: p.pendingData ? (() => {
                    try { return JSON.parse(p.pendingData); } catch { return null; }
                })() : null,
            }));
        }),

    /**
     * Approve Profile Update
     * pendingData'daki değişiklikleri ana kolonlara uygular
     */
    approveProfileUpdate: adminProcedure
        .input(z.object({ profileId: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const [profile] = await db.select()
                .from(schema.escortProfiles)
                .where(eq(schema.escortProfiles.id, input.profileId));

            if (!profile) throw new TRPCError({ code: 'NOT_FOUND', message: 'Profil bulunamadı.' });
            // @ts-ignore
            if (!profile.hasPendingUpdate || !profile.pendingData) {
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Bu profilde bekleyen güncelleme yok.' });
            }

            let pendingChanges: Record<string, any>;
            try {
                // @ts-ignore
                pendingChanges = JSON.parse(profile.pendingData);
            } catch {
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Güncelleme verisi okunamadı.' });
            }

            // Güvenli alan whitelist — sadece izin verilen alanlar uygulanır
            const allowedFields = ['displayName', 'bio', 'biography', 'slogan', 'city', 'district', 'age'];
            const safeChanges: Record<string, any> = {};
            for (const key of allowedFields) {
                if (pendingChanges[key] !== undefined) {
                    safeChanges[key] = pendingChanges[key];
                }
            }

            // @ts-ignore
            await db.update(schema.escortProfiles)
                .set({
                    ...safeChanges,
                    // @ts-ignore
                    pendingData: null,
                    // @ts-ignore
                    hasPendingUpdate: false,
                })
                .where(eq(schema.escortProfiles.id, input.profileId));

            await logAdminAction(ctx, {
                action: 'APPROVE_PROFILE_UPDATE',
                targetType: 'escort_profile',
                targetId: input.profileId,
                previousData: { pendingData: profile.pendingData },
                newData: safeChanges,
            });

            return { success: true, message: 'Profil güncellemesi onaylandı ve yayına alındı.' };
        }),

    /**
     * Reject Profile Update
     * pendingData'yı siler, escortu bilgilendir
     */
    rejectProfileUpdate: adminProcedure
        .input(z.object({
            profileId: z.number(),
            reason: z.string().min(5, 'Red nedeni en az 5 karakter olmalıdır.'),
        }))
        .mutation(async ({ ctx, input }) => {
            const [profile] = await db.select()
                .from(schema.escortProfiles)
                .where(eq(schema.escortProfiles.id, input.profileId));

            if (!profile) throw new TRPCError({ code: 'NOT_FOUND', message: 'Profil bulunamadı.' });

            // @ts-ignore
            await db.update(schema.escortProfiles)
                .set({
                    // @ts-ignore
                    pendingData: null,
                    // @ts-ignore
                    hasPendingUpdate: false,
                })
                .where(eq(schema.escortProfiles.id, input.profileId));

            await logAdminAction(ctx, {
                action: 'REJECT_PROFILE_UPDATE',
                targetType: 'escort_profile',
                targetId: input.profileId,
                newData: { reason: input.reason },
            });

            // TODO: Escort'a sistem bildirimi gönderilebilir (notification tablosu eklendiğinde)
            return { success: true, message: 'Profil güncellemesi reddedildi.' };
        }),
});

