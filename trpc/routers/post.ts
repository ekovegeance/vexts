import {protectedProcedure, publicProcedure, router} from "@/trpc/init";
import z from "zod";
import {db} from "@/lib/db";
import {TRPCError} from "@trpc/server";
import {posts} from "@/lib/db/schema/auth";
import {eq} from "drizzle-orm";

export const postRouter = router({
    list: publicProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).default(10),
                offset: z.number().min(0).default(0),
            })
        )
        .query(async ({ input }) => {
            return await db.query.posts.findMany({
                limit: input.limit,
                offset: input.offset,
                orderBy: (post, { desc }) => [desc(post.createdAt)],
            })
        }),
    getById: publicProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query( async ({ input}) => {
            const post = await db.query.posts.findFirst({
                where: {
                    id: input.id
                }
            });
            if (!post) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'post not found'
                })
            }
            return post;
        }),
    create: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                title: z.string().min(1).max(255),
                content: z.string().min(1).max(255),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const [post] =  await db
                .insert(posts)
                .values({
                    title: input.title,
                    content: input.content,
                    authorId: ctx.user.id,
                })
                .returning();
            return post;
        }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                title: z.string().min(1).max(255).optional(),
                content: z.string().min(1).optional()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const existingPost = await db.query.posts.findFirst({
                where: {
                    id: input.id
                }
            });

            if (!existingPost) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }

            if (existingPost.authorId !== ctx.session.user.id) {
                throw new TRPCError({ code: 'FORBIDDEN' });
            }

            const [updatedPost] = await db
                .update(posts)
                .set({
                    title: input.title,
                    content: input.content,
                    updatedAt: new Date()
                })
                .where(eq(posts.id, input.id))
                .returning();

            return updatedPost;
        }),
    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const existingPost = await db.query.posts.findFirst({
                where: {
                    id: input.id
                }
            });

            if (!existingPost) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }

            if (existingPost.authorId !== ctx.session.user.id) {
                throw new TRPCError({ code: 'FORBIDDEN' });
            }

            await db.delete(posts).where(eq(posts.id, input.id));

            return { success: true };
        })

})