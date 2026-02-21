import { router, protectedProcedure } from '../router.core';
import { z } from 'zod';
import { db } from '@/drizzle/db';
import * as schema from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

/**
 * AI Doğrulama Simülatörü
 * Yüklenen fotoğrafın profil resimleriyle eşleşip eşleşmediğini kontrol eder.
 */
async function simulateAIVerification(photoUrl: string) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    // %90 başarı oranı ile AI onayı simüle edelim
    return Math.random() < 0.9;
}

export const verificationRouter = router({
    /**
     * Submit live captured photo for verification
     */
    submitVerification: protectedProcedure
        .input(z.object({
            photoUrl: z.string().url(),
        }))
        .mutation(async ({ ctx, input }) => {
            // 1. Kullanıcının escort profilini bul
            const [profile] = await db.select()
                .from(schema.escortProfiles)
                .where(eq(schema.escortProfiles.userId, ctx.user.id));
                
            if (!profile) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Escort profili bulunamadı.'
                });
            }

            // 2. Durumu 'pending_ai' yap ve fotoğrafı kaydet
            // @ts-ignore
            await db.update(schema.escortProfiles)
                .set({
                    verificationStatus: 'pending_ai',
                    verificationPhotoUrl: input.photoUrl,
                    visibilityStatus: 'hidden' // Onaylanana kadar gizli kalmalı
                })
                .where(eq(schema.escortProfiles.id, profile.id));

            // 3. AI Kontrolünü arka planda tetikle (Simüle)
            const isAiPassed = await simulateAIVerification(input.photoUrl);

            if (isAiPassed) {
                // AI geçtiyse admin onayına gönder
                // @ts-ignore
                await db.update(schema.escortProfiles)
                    .set({
                        verificationStatus: 'pending_admin'
                    })
                    .where(eq(schema.escortProfiles.id, profile.id));

                return {
                    status: 'pending_admin',
                    message: 'AI kontrolü tamamlandı, yöneticilerimiz son kontrolü yapacak.'
                };
            } else {
                // AI başarısız olduysa reddet
                // @ts-ignore
                await db.update(schema.escortProfiles)
                    .set({
                        verificationStatus: 'rejected'
                    })
                    .where(eq(schema.escortProfiles.id, profile.id));

                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Canlı doğrulama AI tarafından reddedildi. Lütfen tekrar deneyin.'
                });
            }
        }),

    /**
     * Get current verification status
     */
    getStatus: protectedProcedure
        .query(async ({ ctx }) => {
            const [profile] = await db.select()
                .from(schema.escortProfiles)
                .where(eq(schema.escortProfiles.userId, ctx.user.id));
                
            if (!profile) return { status: 'none' };

            return {
                // @ts-ignore
                status: profile.verificationStatus,
                // @ts-ignore
                visibility: profile.visibilityStatus,
                // @ts-ignore
                freeTrialEndsAt: profile.freeTrialEndsAt
            };
        })
});
