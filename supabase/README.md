# Sevlab — Supabase Auth Integration

This bundle wires up Supabase for email/password + Google sign-in, session
handling, and a `profiles` table synced to `auth.users`. Each file below is
named flatly to avoid collisions — copy it into your project at the **target
path** listed.

## 0. Install packages

```bash
npm install @supabase/ssr @supabase/supabase-js
```

## 1. Environment variables

Create `.env.local` in your project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Get the URL and anon key from Supabase Dashboard → Project Settings → API.
When you deploy, set `NEXT_PUBLIC_SITE_URL` to your real domain in your host's
env vars too.

## 2. Run the database migration

Supabase Dashboard → SQL Editor → paste and run `001_profiles.sql`. This creates:
- `public.profiles` table (id, name, role, country, skills, goals, bio, open_to_collaborate)
- Row Level Security policies (anyone can read profiles, only the owner can insert/update their own)
- A trigger that auto-creates a profile row whenever someone signs up

## 3. Enable Google sign-in

1. In Google Cloud Console, create an OAuth 2.0 Client ID (Web application).
2. Add this Authorized redirect URI (from Supabase Dashboard → Authentication → Providers → Google, it shows you the exact callback URL):
   `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
3. Copy the Google Client ID and Secret into Supabase Dashboard → Authentication → Providers → Google, and enable it.
4. In Supabase Dashboard → Authentication → URL Configuration, set:
   - Site URL: `http://localhost:3000` (dev) / your real domain (prod)
   - Redirect URLs: add `http://localhost:3000/auth/callback` (and the prod equivalent)

## 4. Copy these files into your project

| File in this bundle              | Target path in your project                     |
|-----------------------------------|--------------------------------------------------|
| `supabase-client.ts`               | `src/lib/supabase/client.ts`                     |
| `supabase-server.ts`               | `src/lib/supabase/server.ts`                     |
| `supabase-middleware-helper.ts`    | `src/lib/supabase/middleware.ts`                 |
| `root-middleware.ts`               | `middleware.ts` (project root, next to `package.json`) |
| `auth-actions.ts`                  | `src/lib/actions/auth.ts`                        |
| `callback-route.ts`                | `src/app/auth/callback/route.ts`                 |
| `login-page.tsx`                   | `src/app/login/page.tsx` (replace existing)      |
| `signup-page.tsx`                  | `src/app/signup/page.tsx` (replace existing)     |
| `check-email-page.tsx`             | `src/app/signup/check-email/page.tsx` (new)      |
| `auth-code-error-page.tsx`         | `src/app/auth/auth-code-error/page.tsx` (new)    |
| `app-layout.tsx`                   | `src/app/(app)/layout.tsx` (replace existing)     |
| `sidebar-with-signout.tsx`         | `src/components/shell/sidebar.tsx` (replace existing) |
| `profile-page.tsx`                 | `src/app/(app)/profile/page.tsx` (replace existing) |

Adjust the `src/` prefix if your project doesn't use a `src` directory
(your `tsconfig.json` paths map `@/*` to `./src/*`, so it should).

## 5. What's not included yet (next steps)

- Editing your profile (the form UI exists on the profile page as a stub —
  wire it to an `updateProfile` server action when you're ready)
- Real projects/help-posts tables (still mock data in `lib/data.ts`)
- Password reset flow

## Notes

- Middleware protects `/home`, `/projects`, `/help`, `/discover`, `/profile` —
  unauthenticated visitors get redirected to `/login`.
- The landing page (`/`), `/login`, and `/signup` stay public.
- `signOut` is a Server Action wired to a button in the sidebar.