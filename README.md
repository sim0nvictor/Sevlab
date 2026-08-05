# Sevlab

Sevlab is a community platform for builders anywhere in the world. It is a
focused space to share what you are working on, ask for help when you get
stuck, and find partners to build with - designers, frontend and backend
developers, product people, and co-founders.

Live: [sevlabx.xyz](https://sevlabx.xyz)

## Why

Building something alone is hard regardless of where you live. Most
communities are either too broad to get real answers in, or too noisy to find
anyone serious to team up with. Sevlab is built around three things:

1. **Build in public** - post your project, stack, and progress.
2. **Get unstuck** - ask specific questions and get answers from people who
   have hit the same wall.
3. **Find partners** - say what kind of collaborator you need and connect.

## Stack

- [Next.js](https://nextjs.org) App Router + TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase](https://supabase.com) for auth and Postgres
- Deployed on [Vercel](https://vercel.com)

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

### Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `NEXT_PUBLIC_SITE_URL` | Public app URL, no trailing slash. Used to build auth callback links in confirmation emails and OAuth redirects. |

`NEXT_PUBLIC_*` values are inlined at build time, so changing them in Vercel
requires a redeploy before the new value takes effect.

## Auth setup

Auth is Supabase email/password plus Google OAuth, handled by server actions in
`src/lib/actions/auth.ts` with the exchange happening in
`src/app/auth/callback/route.ts`.

In the Supabase dashboard under **Authentication -> URL Configuration**:

- **Site URL**: `https://sevlabx.xyz`
- **Redirect URLs**: `https://sevlabx.xyz/auth/callback`,
  `http://localhost:3000/auth/callback`, and `https://*.vercel.app/auth/callback`
  for preview deploys

If a redirect URL is not allow-listed, Supabase silently falls back to the Site
URL, which is a common cause of confirmation links pointing to the wrong host.

## Database

SQL lives in `supabase/` and is applied in order via the Supabase SQL editor:

| File | Contents |
| --- | --- |
| `001_profiles.sql` | `profiles` table, RLS, and the trigger that creates a profile row on signup |
| `002_platform.sql` | `projects`, `project_comments`, `help_posts`, `help_replies`, `partnership_requests`, plus RLS and indexes |

Every table has row level security enabled. Public content (projects, help
threads, replies) is world-readable but only writable by its author.
Partnership requests are visible only to the sender and recipient.

## Project structure

```
src/
  app/
    (app)/          # authenticated app: home, discover, help, projects, profile
    auth/callback/   # OAuth + email confirmation exchange
    login/, signup/  # auth pages
  components/        # UI primitives, cards, app shell
  lib/
    actions/         # server actions
    supabase/        # browser, server, and middleware clients
    site-url.ts      # canonical URL resolution for redirects
```
