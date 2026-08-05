import { type Metadata } from "next";
import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { countryOptions, statusOptions, toolOptions } from "@/lib/data";
import { param, type SearchParams } from "@/lib/params";
import { getCommunityStats, getCurrentUser, getProjects } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Home | Sevlab",
  description:
    "See what builders around the world are shipping, what they are stuck on, and where they need a partner.",
};

const primaryAction =
  "inline-flex h-11 items-center rounded-2xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-strong)] px-5 text-sm font-medium text-white transition hover:brightness-110";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const tool = param(sp.tool);
  const country = param(sp.country);
  const status = param(sp.status);
  const isFiltered = Boolean(tool || country || status);

  const [projects, stats, user] = await Promise.all([
    getProjects({ tool, country, status }),
    getCommunityStats(),
    getCurrentUser(),
  ]);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section>
        <div className="surface-card p-5 sm:p-6">
          <p className="text-sm text-[var(--muted-foreground)]">Home</p>
          <h1 className="mt-1 font-[var(--font-heading)] text-3xl font-semibold text-white">
            Builders shipping in public
          </h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Anyone, anywhere, building something hard. Share progress, say where you
            are stuck, and find people to build with.
          </p>

          <form method="get" className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Select name="tool" label="Tool" defaultValue={tool}>
              <option value="">All tools</option>
              {toolOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
            <Select name="country" label="Country" defaultValue={country}>
              <option value="">Anywhere</option>
              {countryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
            <Select name="status" label="Status" defaultValue={status}>
              <option value="">Any status</option>
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
            <div className="flex items-end gap-2">
              <Button type="submit" className="w-full">
                Apply
              </Button>
              {isFiltered ? (
                <Link
                  href="/home"
                  className="inline-flex h-11 shrink-0 items-center rounded-2xl px-3 text-sm text-[var(--muted-foreground)] transition hover:text-white"
                >
                  Clear
                </Link>
              ) : null}
            </div>
          </form>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[var(--muted-foreground)]">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </p>
          <Link href="/projects/new" className={primaryAction}>
            Post a project
          </Link>
        </div>

        <div className="mt-4 space-y-4">
          {projects.length === 0 ? (
            <div className="surface-card p-8 text-center">
              <h2 className="text-lg font-semibold text-white">
                {isFiltered ? "No projects match those filters" : "No projects yet"}
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted-foreground)]">
                {isFiltered
                  ? "Try widening your filters to see more of what people are building."
                  : "Be the first to share what you are building and what you are stuck on."}
              </p>
              <Link href="/projects/new" className={`${primaryAction} mt-5`}>
                Post a project
              </Link>
            </div>
          ) : (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                currentUserId={user?.id ?? null}
              />
            ))
          )}
        </div>
      </section>

      <aside className="space-y-4">
        <div className="surface-card p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            Community
          </p>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-[var(--muted-foreground)]">Projects</dt>
              <dd className="font-semibold text-white">{stats.projects}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-[var(--muted-foreground)]">Builders</dt>
              <dd className="font-semibold text-white">{stats.builders}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-[var(--muted-foreground)]">Open questions</dt>
              <dd className="font-semibold text-white">{stats.openQuestions}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-[var(--muted-foreground)]">Partnerships formed</dt>
              <dd className="font-semibold text-white">{stats.partnerships}</dd>
            </div>
          </dl>
        </div>

        <div className="surface-card p-5">
          <h2 className="text-base font-semibold text-white">Need a partner?</h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Browse builders and creators by skill, then send a request explaining
            what you want to build together.
          </p>
          <Link
            href="/discover"
            className="mt-4 inline-flex h-11 items-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white transition hover:border-white/20"
          >
            Find builders
          </Link>
        </div>

        <div className="surface-card p-5">
          <h2 className="text-base font-semibold text-white">Stuck on something?</h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Ask the community. Someone has probably hit the same wall.
          </p>
          <Link
            href="/help/new"
            className="mt-4 inline-flex h-11 items-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white transition hover:border-white/20"
          >
            Ask for help
          </Link>
        </div>
      </aside>
    </div>
  );
}
