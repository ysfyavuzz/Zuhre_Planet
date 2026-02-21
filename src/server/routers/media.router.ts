import { router, protectedProcedure } from '../router.core';
import { z } from 'zod';
import { db } from '@/drizzle/db';
import * as schema from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

/**
 * AI İşleme Simülatörü / API Wrapper
 * Gerçekte burada Photoroom, Picsart veya Cloudinary API çağrısı yapılacak.
 */
async function processImageAI(imageUrl: string, action: 'remove_bg' | 'retouch' | 'mask_face') {
    // Simüle edilmiş AI işlem süresi
    await new Promise(resolve => setTimeout(resolve, 1500));

    // İşlem sonrası yeni URL döner (şimdilik orijinali modifiye edilmiş gibi simüle ediyoruz)
    return `${imageUrl}?ai_processed=${action}_${Date.now()}`;
}

export const mediaRouter = router({
    /**
     * Register a newly uploaded photo in the database
     */
    registerPhoto: protectedProcedure
        .input(z.object({
            url: z.string().url(),
            profileId: z.number().optional()
        }))
        .mutation(async ({ ctx, input }) => {
            const [photo] = await db.insert(schema.escortPhotos).values({
                url: input.url,
                // @ts-ignore
                profileId: input.profileId || 1, // Mock profile ID if not provided
                isFaceHidden: false,
                privacyLevel: 'public'
            }).returning();

            return photo;
        }),

    /**
     * Apply AI Retouch / Background Removal
     */
    applyAIEffect: protectedProcedure
        .input(z.object({
            photoId: z.number(),
            effect: z.enum(['remove_bg', 'retouch'])
        }))
        .mutation(async ({ ctx, input }) => {
            const [photo] = await db.select().from(schema.escortPhotos).where(eq(schema.escortPhotos.id, input.photoId));

            if (!photo) throw new TRPCError({ code: 'NOT_FOUND', message: 'Fotoğraf bulunamadı.' });

            // Sadece kendi fotoğrafını düzenleyebilir (profil kontrolü eklenebilir)

            const processedUrl = await processImageAI(photo.url, input.effect);

            await db.update(schema.escortPhotos)
                .set({ url: processedUrl })
                .where(eq(schema.escortPhotos.id, input.photoId));

            return { success: true, newUrl: processedUrl };
        }),

    /**
     * Toggle Face Mask & Privacy
     * Yüzü gizler/açar ve maskelenmiş versiyonu oluşturur
     */
    toggleFacePrivacy: protectedProcedure
        .input(z.object({
            photoId: z.number(),
            isHidden: z.boolean(),
            maskStyle: z.string().optional()
        }))
        .mutation(async ({ ctx, input }) => {
            const [photo] = await db.select().from(schema.escortPhotos).where(eq(schema.escortPhotos.id, input.photoId));

            if (!photo) throw new TRPCError({ code: 'NOT_FOUND' });

            let maskedUrl = photo.maskedUrl;

            if (input.isHidden && !maskedUrl) {
                // Eğer gizleniyorsa ve maskeli url yoksa AI ile oluştur
                maskedUrl = await processImageAI(photo.url, 'mask_face');
            }

            // @ts-ignore
            await db.update(schema.escortPhotos)
                .set({
                    isFaceHidden: input.isHidden,
                    maskedUrl: input.isHidden ? maskedUrl : null
                })
                .where(eq(schema.escortPhotos.id, input.photoId));

            return { success: true, isHidden: input.isHidden, maskedUrl };
        }),

    /**
     * Set Photo Privacy Level
     * Orijinal hali kimlere görünecek?
     */
    setPrivacyLevel: protectedProcedure
        .input(z.object({
            photoId: z.number(),
            level: z.enum(['public', 'members', 'gold'])
        }))
        .mutation(async ({ input }) => {
            // @ts-ignore
            await db.update(schema.escortPhotos)
                .set({ privacyLevel: input.level })
                .where(eq(schema.escortPhotos.id, input.photoId));

            return { success: true };
        })
});
