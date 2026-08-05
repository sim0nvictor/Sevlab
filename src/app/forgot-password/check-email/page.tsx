import Link from "next/link";
import { type Metadata } from "next";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Check Your Email | Sevlab",
  description: "A password reset link is on its way to your inbox.",
};

export default function ForgotPasswordCheckEmailPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="brand-frame surface-card w-full max-w-md p-6 sm:p-8">
        <BrandLogo imageClassName="h-12 w-12" />
        <p className="font-[var(--font-heading)] text-2xl font-semibold text-white">
          Check your email
        </p>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          If that address has a Sevlab account, a password reset link is on its
          way. The link works once and expires after an hour.
        </p>

        <div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-[var(--muted-foreground)]">
          Nothing after a few minutes? Check your spam folder, then request
          another link.
        </div>

        <div className="mt-8 space-y-3">
          <Link href="/login" className="block">
            <Button className="w-full">Back to log in</Button>
          </Link>
          <Link href="/forgot-password" className="block">
            <Button variant="outline" className="w-full">
              Send another link
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
