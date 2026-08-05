import Link from "next/link";
import { type Metadata } from "next";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requestPasswordReset } from "@/lib/actions/auth";

export const metadata: Metadata = {
  title: "Forgot Password | Sevlab",
  description:
    "Request a link to reset the password on your Sevlab account.",
};

export default async function ForgotPasswordPage({
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
          Forgot your password?
        </p>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Enter the email address you signed up with and we will send you a link
          to set a new password.
        </p>

        {error ? (
          <p className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        ) : null}

        <form action={requestPasswordReset} className="mt-8 space-y-4">
          <Input
            type="email"
            name="email"
            placeholder="Email address"
            autoComplete="email"
            required
          />
          <Button className="w-full" type="submit">
            Send reset link
          </Button>
        </form>

        <p className="mt-6 text-sm text-[var(--muted-foreground)]">
          Remembered it?{" "}
          <Link href="/login" className="text-white underline underline-offset-4">
            Back to log in
          </Link>
        </p>
      </div>
    </main>
  );
}
