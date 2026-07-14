import Link from "next/link";
import { type Metadata } from "next";
import { BrandLogo } from "@/components/brand-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { builders } from "@/lib/data";

export const metadata: Metadata = {
  title: "Build. Share. Get Help. | Sevlab",
  description: "Sevlab is a focused space for African builders to show what they are creating, ask for help when blocked, and find people to collaborate with.",
};

const features = [
  {
    title: "Share real work",
    description:
      "Post side projects, public builds, and progress updates without the noise of bloated communities.",
  },
  {
    title: "Get unstuck faster",
    description:
      "Ask focused questions, show what you tried, and get help from builders who understand your context.",
  },
  {
    title: "Find collaborators",
    description:
      "Discover designers, frontend engineers, and backend builders across African tech communities.",
  },
];

export default function LandingPage() {
  return (
    <main className="px-4 pb-10 pt-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="brand-frame flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 backdrop-blur sm:px-6">
          <BrandLogo showWordmark={false} imageClassName="h-14 w-14 rounded-lg" />
          <div className="flex items-center">
            <Link href="/signup">
              <Button className="h-10 rounded-lg px-5 text-sm font-medium">
                Get Started
              </Button>
            </Link>
          </div>
        </header>

        <section className="brand-frame relative mt-6 overflow-hidden rounded-[36px] border border-white/8 px-5 py-14 shadow-[0_30px_80px_rgba(4,8,20,0.45)] sm:px-8 sm:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(75,125,255,0.3),transparent_30%),radial-gradient(circle_at_top_right,rgba(195,108,255,0.26),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="max-w-2xl">
              <Badge className="border-[var(--accent)]/30 bg-[var(--accent)]/15 text-white">
                Builders across Africa
              </Badge>
              <h1 className="mt-5 font-[var(--font-heading)] text-4xl font-bold text-white sm:text-6xl">
                Build. Share. Get Help.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-[var(--muted-foreground)] sm:text-lg">
                Sevlab is a focused space for African builders to show what they
                are creating, ask for help when blocked, and find people to
                collaborate with.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
                <Link href="/home">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Explore Feed
                  </Button>
                </Link>
              </div>
            </div>

            <div className="surface-card p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Today on Sevlab
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-white">
                    128 active builders
                  </p>
                </div>
                <Badge className="border-[var(--accent-secondary)]/30 bg-[var(--accent-strong)]/15">
                  Mobile first
                </Badge>
              </div>
              <div className="mt-5 space-y-3">
                {builders.map((builder) => (
                  <div
                    key={builder.id}
                    className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/20 px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-white">{builder.name}</p>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {builder.skills.slice(0, 2).join(" · ")}
                      </p>
                    </div>
                    <span className="text-xs text-[var(--muted-foreground)]">
                      {builder.country}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="surface-card p-6">
              <h2 className="font-[var(--font-heading)] text-xl font-semibold text-white">
                {feature.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                {feature.description}
              </p>
            </article>
          ))}
        </section>

        <footer className="mt-10 flex flex-col items-start justify-between gap-4 rounded-[28px] border border-white/8 bg-white/[0.03] px-5 py-5 text-sm text-[var(--muted-foreground)] sm:flex-row sm:items-center sm:px-6">
          <p>
            Built for self-taught developers solving local problems with global
            ambition.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://x.com/Sevlabx?s=20"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
              aria-label="Follow us on X"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="mailto:sevmediax@gmail.com"
              className="hover:text-white"
              aria-label="Email us"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
