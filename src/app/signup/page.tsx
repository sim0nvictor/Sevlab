import Link from "next/link";
import { type Metadata } from "next";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInWithGoogle, signUpWithEmail } from "@/lib/actions/auth";

export const metadata: Metadata = {
  title: "Sign Up | Sevlab",
  description: "Create your Sevlab profile and start sharing what you are building with the African developer community.",
};

export default async function SignupPage({
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
          Join Sevlab
        </p>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Create your profile and start sharing what you are building.
        </p>

        {error ? (
          <p className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        ) : null}

        <form action={signUpWithEmail} className="mt-8 space-y-4">
          <Input type="text" name="name" placeholder="Full name" required />
          <Input type="email" name="email" placeholder="Email address" required />
          <Input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            required
            minLength={6}
          />
          <Button className="w-full" type="submit">
            Create Account
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
          Already have an account?{" "}
          <Link href="/login" className="text-white underline underline-offset-4">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}