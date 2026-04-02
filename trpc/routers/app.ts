import { createTRPCRouter, publicProcedure } from '../init';
import {userRouter} from "@/trpc/routers/user";
import {postRouter} from "@/trpc/routers/post";

export const appRouter = createTRPCRouter({

    healthCheck: publicProcedure.query(() => {
        return { status: 'ok', time: new Date() };
    }),

    user: userRouter,
    post: postRouter
});

export type AppRouter = typeof appRouter;