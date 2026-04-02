import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { db } from '@/lib/db';
import { server as  auth } from '@/lib/auth/server';
import { headers } from 'next/headers';


export const createContext = async () => {

    const session = await auth.api.getSession({
        headers: await headers()
    });

    return {
        db,
        session,
        user: session?.user,
    };
};

const t = initTRPC.context<typeof createContext>().create({
    transformer: superjson,
});

export const router = t.router;
export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
    if (!ctx.session || !ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Anda belum login' });
    }

    return next({
        ctx: {
            ...ctx,
            session: ctx.session,
            user: ctx.user,
        },
    });
});