import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { nextCookies } from "better-auth/next-js";
import { users } from "@/lib/db/schema/users";
import { resend } from "@/lib/email/resend";
import EmailVerification from "@/components/email-templates/email-verification";
import EmailResetPassword from "@/components/email-templates/email-reset-password";


export const server = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.NEXT_PUBLIC_URL,

  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...users,
    },
  }),

  plugins: [nextCookies()],

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: env.BETTER_AUTH_REQUIRE_EMAIL_VERIFICATION,

    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: user.email,
        subject: "Reset Password",
        react: EmailResetPassword({
          name: user.name,
          email: user.email,
          resetLink: url,
        }),
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: user.email,
        subject: "Verify your email",
        react: EmailVerification({
          name: user.name,
          email: user.email,
          verificationLink: url,
        }),
      });
    },

    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },

  socialProviders: {
    google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
    }
  },
});
