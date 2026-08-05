import Link from "next/link";
import { type Metadata } from "next";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInWithEmail, signInWithGoogle } from "@/lib/actions/auth";

export const metadata: Metadata = {
  title: "Log In | Sevlab",
  description:
    "Log in to your Sevlab account and keep building with builders and creators worldwide.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="brand-frame surface-card w-full max-w-md p-6 sm:p-8">
        <BrandLogo imageClassName="h-12 w-12" />
        <p className="font-[var(--font-heading)] text-2xl font-semibold text-white">
          Welcome back
        </p>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Log in and continue building with the Sevlab community.
        </p>

        {error ? (
          <p className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        ) : null}

        <form action={signInWithEmail} className="mt-8 space-y-4">
          <Input
            type="email"
            name="email"
            placeholder="Email address"
            autoComplete="email"
            required
          />
          <div className="space-y-2">
            <Input
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="current-password"
              required
              minLength={6}
            />
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs text-[var(--muted-foreground)] underline underline-offset-4 transition hover:text-white"
              >
                Forgot your password?
              </Link>
            </div>
          </div>
          <Button className="w-full" type="submit">
            Log In
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
          <span className="h-px flex-1 bg-white/10" />
          or
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <form action={signInWithGoogle}>
          <Button variant="outline" className="w-full" type="submit">
            Continue with Google
          </Button>
        </form>

        <p className="mt-6 text-sm text-[var(--muted-foreground)]">
          New here?{" "}
          <Link href="/signup" className="text-white underline underline-offset-4">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
