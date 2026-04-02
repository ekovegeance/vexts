import { createTRPCRouter, publicProcedure, protectedProcedure } from '@/trpc/init';
import { db } from '@/lib/db';
import { user } from '@/lib/db/schema';

export const userRouter = createTRPCRouter({
    // Endpoint publik: Siapa saja bisa melihat daftar user
    getAll: publicProcedure.query(async () => {
        // Memanggil Drizzle ORM untuk melakukan "SELECT * FROM user"
        const allUsers = await db.select().from(user);
        return allUsers;
    }),

    // Endpoint terproteksi: Hanya bisa diakses kalau sudah login
    getProfile: protectedProcedure.query(({ ctx }) => {
        // Data user otomatis tersedia dari context Better Auth
        return ctx.user;
    }),
});