import Link from "next/link";
import { type Metadata } from "next";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updatePassword } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Set A New Password | Sevlab",
  description: "Choose a new password for your Sevlab account.",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Following the email link exchanges the code for a session. Landing here
  // without one means the link was already used, expired, or opened directly.
  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="brand-frame surface-card w-full max-w-md p-6 sm:p-8">
          <BrandLogo imageClassName="h-12 w-12" />
          <p className="font-[var(--font-heading)] text-2xl font-semibold text-white">
            This link has expired
          </p>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Password reset links work once and expire after an hour. Request a
            fresh one and it will land in your inbox in a moment.
          </p>

          <Link href="/forgot-password" className="mt-8 block">
            <Button className="w-full">Request a new link</Button>
          </Link>
          <p className="mt-6 text-sm text-[var(--muted-foreground)]">
            <Link
              href="/login"
              className="text-white underline underline-offset-4"
            >
              Back to log in
            </Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="brand-frame surface-card w-full max-w-md p-6 sm:p-8">
        <BrandLogo imageClassName="h-12 w-12" />
        <p className="font-[var(--font-heading)] text-2xl font-semibold text-white">
          Set a new password
        </p>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          You are resetting the password for{" "}
          <span className="text-white">{user.email}</span>.
        </p>

        {error ? (
          <p className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        ) : null}

        <form action={updatePassword} className="mt-8 space-y-4">
          <Input
            type="password"
            name="password"
            placeholder="New password"
            autoComplete="new-password"
            required
            minLength={6}
          />
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            autoComplete="new-password"
            required
            minLength={6}
          />
          <Button className="w-full" type="submit">
            Update password
          </Button>
        </form>

        <p className="mt-6 text-xs text-[var(--muted-foreground)]">
          Use at least 6 characters. You will stay signed in on this device once
          the password is updated.
        </p>
      </div>
    </main>
  );
}
