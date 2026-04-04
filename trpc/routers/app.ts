import { router } from "@/trpc/init";
import { postRouter } from "@/trpc/routers/post";


/**
 * Add your routers here
 *
 * user: userRouter,
 */
export const appRouter = router( {

    posts: postRouter

});

export type AppRouter = typeof appRouter;