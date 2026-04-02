import {publicProcedure, router} from "@/trpc/init";
import { desc, eq } from 'drizzle-orm';
import z from "zod";
import {db} from "@/lib/db";

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
        })
})