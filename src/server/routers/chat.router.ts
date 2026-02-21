import { router, protectedProcedure } from '../router.core';
import { z } from 'zod';
import { db } from '@/drizzle/db';
import * as schema from '@/drizzle/schema';
import { eq, and, lt, sql } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { filterChatMessage } from '@/lib/chatFilter';

// Disappearing message timer options (hours)
export const DISAPPEAR_OPTIONS = [
    { label: 'Kapalı', value: null },
    { label: '1 Saat', value: 1 },
    { label: '24 Saat', value: 24 },
    { label: '7 Gün', value: 168 },
] as const;

function computeExpiresAt(hours: number | null | undefined): Date | null {
    if (!hours) return null;
    const d = new Date();
    d.setHours(d.getHours() + hours);
    return d;
}

export const chatRouter = router({
    /**
     * Get or create a conversation between two users
     */
    getOrCreateConversation: protectedProcedure
        .input(z.object({ otherUserId: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const myId = ctx.user.id;
            const ids = [myId, input.otherUserId].sort((a, b) => a - b);
            const idsJson = JSON.stringify(ids);

            // Check if conversation already exists
            const existing = await db.query.chatConversations.findFirst({
                where: eq(schema.chatConversations.participantIds, idsJson),
            });
            if (existing) return existing;

            // Create new conversation
            const [conv] = await db.insert(schema.chatConversations)
                .values({ participantIds: idsJson })
                .returning();
            return conv;
        }),

    /**
     * Get Messages in a conversation (excludes expired + deleted)
     */
    getMessages: protectedProcedure
        .input(z.object({
            conversationId: z.number(),
            limit: z.number().default(50),
            beforeId: z.number().optional(), // cursor for pagination
        }))
        .query(async ({ ctx, input }) => {
            const myId = ctx.user.id;

            // Verify the user is a participant
            const conv = await db.query.chatConversations.findFirst({
                where: eq(schema.chatConversations.id, input.conversationId),
            });
            if (!conv) throw new TRPCError({ code: 'NOT_FOUND' });

            const participants = JSON.parse(conv.participantIds) as number[];
            if (!participants.includes(myId)) {
                throw new TRPCError({ code: 'FORBIDDEN', message: 'Bu konuşmaya erişim yetkiniz yok.' });
            }

            const now = new Date();

            // Clean up expired messages (fire-and-forget)
            db.update(schema.chatMessages)
                .set({ isDeleted: true, deletedAt: now })
                // @ts-ignore
                .where(and(
                    eq(schema.chatMessages.conversationId, input.conversationId),
                    eq(schema.chatMessages.isDeleted, false),
                    lt(schema.chatMessages.expiresAt, now)
                ))
                .execute()
                .catch(console.error);

            // Fetch messages
            const messages = await db.query.chatMessages.findMany({
                where: and(
                    eq(schema.chatMessages.conversationId, input.conversationId),
                    eq(schema.chatMessages.isDeleted, false),
                ),
                limit: input.limit,
                orderBy: (m, { asc }) => [asc(m.createdAt)],
            });

            return messages;
        }),

    /**
     * Send Message with AI filter + disappearing messages support
     */
    sendMessage: protectedProcedure
        .input(z.object({
            conversationId: z.number(),
            content: z.string().min(1).max(2000),
            type: z.enum(['text', 'image', 'audio', 'video', 'location']).default('text'),
            mediaUrl: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const myId = ctx.user.id;

            // Verify participation
            const conv = await db.query.chatConversations.findFirst({
                where: eq(schema.chatConversations.id, input.conversationId),
            });
            if (!conv) throw new TRPCError({ code: 'NOT_FOUND' });

            const participants = JSON.parse(conv.participantIds) as number[];
            if (!participants.includes(myId)) {
                throw new TRPCError({ code: 'FORBIDDEN' });
            }

            // Run AI content filter
            const filterResult = filterChatMessage(input.content);
            if (filterResult.status === 'BLOCKED') {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: filterResult.reason,
                });
            }

            const isWarned = filterResult.status === 'WARN';
            const expiresAt = computeExpiresAt(conv.disappearAfterHours);

            const [message] = await db.insert(schema.chatMessages).values({
                conversationId: input.conversationId,
                senderId: myId,
                content: input.content,
                type: input.type,
                mediaUrl: input.mediaUrl ?? null,
                expiresAt,
                isAiFlagged: isWarned,
                aiFlagReason: isWarned && filterResult.status === 'WARN' ? filterResult.reason : null,
            }).returning();

            // Update conversation lastMessageAt
            await db.update(schema.chatConversations)
                .set({ lastMessageAt: new Date() })
                .where(eq(schema.chatConversations.id, input.conversationId));

            // Award 1 XP for sending a message
            await db.update(schema.users)
                .set({
                    // @ts-ignore
                    experiencePoints: sql`${schema.users.experiencePoints} + 1`,
                })
                .where(eq(schema.users.id, myId));

            return { success: true, message, isWarned };
        }),

    /**
     * Set Disappearing Messages timer for a conversation
     */
    setDisappearTimer: protectedProcedure
        .input(z.object({
            conversationId: z.number(),
            hours: z.number().nullable(), // null = off
        }))
        .mutation(async ({ ctx, input }) => {
            const myId = ctx.user.id;

            const conv = await db.query.chatConversations.findFirst({
                where: eq(schema.chatConversations.id, input.conversationId),
            });
            if (!conv) throw new TRPCError({ code: 'NOT_FOUND' });

            const participants = JSON.parse(conv.participantIds) as number[];
            if (!participants.includes(myId)) {
                throw new TRPCError({ code: 'FORBIDDEN' });
            }

            await db.update(schema.chatConversations)
                .set({ disappearAfterHours: input.hours })
                .where(eq(schema.chatConversations.id, input.conversationId));

            const label = input.hours
                ? `${input.hours} saat sonra`
                : 'kapalı';

            return { success: true, message: `Kaybolan mesajlar: ${label}` };
        }),

    /**
     * Mark messages as read
     */
    markAsRead: protectedProcedure
        .input(z.object({ conversationId: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const now = new Date();
            await db.update(schema.chatMessages)
                .set({ isRead: true, readAt: now })
                .where(and(
                    eq(schema.chatMessages.conversationId, input.conversationId),
                    eq(schema.chatMessages.isRead, false),
                ));
            return { success: true };
        }),

    /**
     * Delete own message (soft delete)
     */
    deleteMessage: protectedProcedure
        .input(z.object({ messageId: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const myId = ctx.user.id;
            const msg = await db.query.chatMessages.findFirst({
                where: eq(schema.chatMessages.id, input.messageId),
            });
            if (!msg) throw new TRPCError({ code: 'NOT_FOUND' });
            if (msg.senderId !== myId) throw new TRPCError({ code: 'FORBIDDEN', message: 'Sadece kendi mesajlarınızı silebilirsiniz.' });

            await db.update(schema.chatMessages)
                .set({ isDeleted: true, deletedAt: new Date() })
                .where(eq(schema.chatMessages.id, input.messageId));

            return { success: true };
        }),

    /**
     * Get user's conversations list
     */
    getConversations: protectedProcedure
        .query(async ({ ctx }) => {
            const myId = ctx.user.id;
            // Get all conversations where user is a participant
            const all = await db.query.chatConversations.findMany({
                orderBy: (c, { desc }) => [desc(c.lastMessageAt)],
            });
            return all.filter(c => {
                const ids = JSON.parse(c.participantIds) as number[];
                return ids.includes(myId);
            });
        }),
});
