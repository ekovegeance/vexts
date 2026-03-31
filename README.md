

# Vexts
Production-ready staterkit

## Tech Stack 
An overview of the modern and powerful technologies used in the Pro Next.js Drizzle starter kit.
### Core Framework
- [Next.js:](https://nextjs.org/) The React framework for the web, using the App Router for modern features like Server Components and Streaming.
- [TypeScript:](https://www.typescriptlang.org/) For end-to-end type safety and an excellent developer experience.

### Database & Authentication
- [Drizzle ORM:](https://orm.drizzle.team/) A lightweight, high-performance TypeScript ORM for SQL databases.
- [PostgreSQL:](https://www.postgresql.org/) The world's most advanced open-source relational database.
- [Better Auth:](https://www.better-auth.com/) A robust and flexible authentication library for Next.js.

### State Management
- [TanStack Query:](https://tanstack.com/query/latest) For powerful data fetching, caching, and state management on the client.

### Styling & UI
- [Tailwind CSS:](https://tailwindcss.com/) A utility-first CSS framework for rapid UI development.
- [shadcn/ui:](https://ui.shadcn.com/) Beautifully designed components built with Radix UI and Tailwind CSS.
- [Lucide React:](https://lucide.dev/) Flexible and beautiful icons.

### Advanced Features
- [React Email:](https://react.email/) For creating beautiful, responsive email templates.


## Setup
Get your Pro Next.js Drizzle project up and running in less than 30 minutes.

```bash
pnpm create next-app --example "https://github.com/ekovegeance/vexts"
```

Set up your environment variables:
```bash
cp .env.example .env
```
Run migrarions:
```bash
# Generate and apply migrations:
pnpm db:push

# Or if you prefer to use migrations:
pnpm db:migrate
```

Start the Development Server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features
Here’s what this app supports out of the box:

- **[Email & Password](https://www.better-auth.com/docs/basic-usage#email-password)**: Simple and secure authentication.
- **[Social Sign On](https://www.better-auth.com/docs/basic-usage#social-sign-on)**: Authenticate users with their social accounts like Google, GitHub, etc.
- **[Email Verification](https://www.better-auth.com/docs/concepts/email#email-verification)**: Ensure users verify their email addresses.
- **[Password Reset](https://www.better-auth.com/docs/concepts/email#password-reset-email)**: Let users reset their passwords if they forget them.
- **[Session Management](https://www.better-auth.com/docs/concepts/session-management)**: Handle user sessions seamlessly.
- **[Users & Accounts](https://www.better-auth.com/docs/concepts/users-accounts)** : Manage user accounts and profiles.

## Learn More
To learn more about Tech Stack used in this project, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Better Auth Documentation](https://better-auth.com/docs) - learn about Better Auth features and API.
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs) - learn about Drizzle ORM features and API.
- [Shadcn UI Documentation](https://ui.shadcn.com/docs) - learn about shadcn UI features and API.
- [Neon DB](https://neon.com/) - learn about Database with Neon
- [Resend](https://resend.com/) - learn about Resend for sending emails

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
