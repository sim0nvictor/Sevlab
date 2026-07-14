import Link from "next/link";
import { type Metadata } from "next";
import { BrandLogo } from "@/components/brand-logo";

export const metadata: Metadata = {
  title: "Sign-in Error | Sevlab",
  description: "The sign-in link expired or was invalid. Please try logging in again.",
};

export default function AuthCodeErrorPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="brand-frame surface-card w-full max-w-md p-6 text-center sm:p-8">
        <div className="flex justify-center">
          <BrandLogo showWordmark={false} imageClassName="h-12 w-12" />
        </div>
        <p className="mt-4 font-[var(--font-heading)] text-2xl font-semibold text-white">
          Sign-in link expired or invalid
        </p>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          That link didn&apos;t work. Please try logging in again.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block text-sm text-white underline underline-offset-4"
        >
          Back to log in
        </Link>
      </div>
    </main>
  );
}