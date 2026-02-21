import { router, publicProcedure, protectedProcedure } from '../router.core';
import { z } from 'zod';
import { db } from '@/drizzle/db';
import * as schema from '@/drizzle/schema';
import { eq, sql, desc } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export const forumRouter = router({
    /**
     * Get all categories
     */
    getCategories: publicProcedure.query(async () => {
        return await db.query.forumCategories.findMany({
            orderBy: (cats, { asc }) => [asc(cats.displayOrder)]
        });
    }),

    /**
     * Get Topics by Category
     */
    getTopics: publicProcedure
        .input(z.object({
            categorySlug: z.string(),
            limit: z.number().default(20),
            offset: z.number().default(0)
        }))
        .query(async ({ input }) => {
            const category = await db.query.forumCategories.findFirst({
                where: eq(schema.forumCategories.slug, input.categorySlug)
            });

            if (!category) throw new TRPCError({ code: 'NOT_FOUND', message: 'Kategori bulunamadı.' });

            const topics = await db.query.forumTopics.findMany({
                where: eq(schema.forumTopics.categoryId, category.id),
                limit: input.limit,
                offset: input.offset,
                orderBy: [desc(schema.forumTopics.isSticky), desc(schema.forumTopics.createdAt)],
                with: {
                    author: true
                }
            });

            return { category, topics };
        }),

    /**
     * Create a new Topic
     */
    createTopic: protectedProcedure
        .input(z.object({
            categoryId: z.number(),
            title: z.string().min(5).max(100),
            content: z.string().min(10)
        }))
        .mutation(async ({ ctx, input }) => {
            const slug = input.title.toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '') + '-' + Math.random().toString(36).substring(2, 7);

            return await db.transaction(async (tx) => {
                const [topic] = await tx.insert(schema.forumTopics).values({
                    categoryId: input.categoryId,
                    authorId: ctx.user.id,
                    title: input.title,
                    slug: slug
                }).returning();

                await tx.insert(schema.forumPosts).values({
                    topicId: topic.id,
                    authorId: ctx.user.id,
                    content: input.content
                });

                // XP Kazandır
                await tx.update(schema.users)
                    .set({
                        // @ts-ignore
                        experiencePoints: sql`${schema.users.experiencePoints} + 10`,
                        // @ts-ignore
                        loyaltyPoints: sql`${schema.users.loyaltyPoints} + 2`
                    })
                    .where(eq(schema.users.id, ctx.user.id));

                return topic;
            });
        }),

    /**
     * Get Topic Details & Posts
     */
    getTopicDetails: publicProcedure
        .input(z.object({ slug: z.string() }))
        .query(async ({ input }) => {
            const topic = await db.query.forumTopics.findFirst({
                where: eq(schema.forumTopics.slug, input.slug),
                with: {
                    author: true,
                    category: true
                }
            });

            if (!topic) throw new TRPCError({ code: 'NOT_FOUND' });

            // View count artır
            await db.update(schema.forumTopics)
                .set({ viewCount: (topic.viewCount || 0) + 1 })
                .where(eq(schema.forumTopics.id, topic.id));

            const posts = await db.query.forumPosts.findMany({
                where: eq(schema.forumPosts.topicId, topic.id),
                orderBy: (posts, { asc }) => [asc(posts.createdAt)],
                with: {
                    author: true
                }
            });

            return { topic, posts };
        }),

    /**
     * Add Post (Reply) to Topic
     */
    addPost: protectedProcedure
        .input(z.object({
            topicId: z.number(),
            content: z.string().min(2)
        }))
        .mutation(async ({ ctx, input }) => {
            const [post] = await db.insert(schema.forumPosts).values({
                topicId: input.topicId,
                authorId: ctx.user.id,
                content: input.content
            }).returning();

            // XP Kazandır
            await db.update(schema.users)
                .set({
                    // @ts-ignore
                    experiencePoints: sql`${schema.users.experiencePoints} + 5`
                })
                .where(eq(schema.users.id, ctx.user.id));

            return post;
        })
});
