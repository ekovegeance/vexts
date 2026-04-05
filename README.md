

# vexts
Production-ready opinionated stater kit with Next.js end to end typesafe

## Setup
### Create Project

```bash
pnpm create next-app --example "https://github.com/ekovegeance/vexts"
```

Setup your environment variables:
```bash
cp .env.example .env
```

Run migrations:
```bash
# Generate and apply migrations:
pnpm db:push

# Or if you prefer to use migrations:
pnpm db:migrate
```

Start the Development Server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

Here’s what this app supports out of the box:

- **[Email & Password](https://www.better-auth.com/docs/basic-usage#email-password)**: Simple and secure authentication.
- **[Social Sign On](https://www.better-auth.com/docs/basic-usage#social-sign-on)**: Authenticate auth with their social accounts like Google, GitHub, etc.
- **[Email Verification](https://www.better-auth.com/docs/concepts/email#email-verification)**: Ensure auth verify their email addresses.
- **[Password Reset](https://www.better-auth.com/docs/concepts/email#password-reset-email)**: Let auth reset their passwords if they forget them.
- **[Session Management](https://www.better-auth.com/docs/concepts/session-management)**: Handle auth sessions seamlessly.
- **[Users & Accounts](https://www.better-auth.com/docs/concepts/users-accounts)** : Manage auth accounts and profiles.

## Tech Stack
We've selected the best-in-class tools to provide a professional, scalable, and high-performance foundation
### Core Framework

- [Next.js Documentation](https://nextjs.org/docs): The React framework for the web, using the App Router for modern features like Server Components and Streaming.
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs): A lightweight, high-performance TypeScript ORM for SQL databases.
- [Better Auth Documentation](https://better-auth.com/docs): A robust and flexible authentication library for Next.js.
- [tRPC](https://trpc.io/): For building end-to-end type-safe APIs without the boilerplate.
- [TanStack Query](https://tanstack.com/query/latest): For powerful data fetching, caching, and state management on the client.
- [Resend](https://resend.com/): For creating beautiful, responsive email templates.
- [React Email](https://react.email/): For creating beautiful, responsive email templates.
- [Shadcn UI Documentation](https://ui.shadcn.com/docs): Beautifully designed components built with Radix UI and Tailwind CSS.
## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
