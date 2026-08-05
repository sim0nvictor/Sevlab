import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/project-card";
import { Badge } from "@/components/ui/badge";
import { getBuilder, getCurrentUser, getProjects } from "@/lib/queries";

export default async function BuilderProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const profile = await getBuilder(id);
  if (!profile) notFound();

  const [projects, user] = await Promise.all([
    getProjects({ authorId: id }),
    getCurrentUser(),
  ]);
  const isSelf = user?.id === profile.id;

  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link
        href="/discover"
        className="inline-flex text-sm text-[var(--muted-foreground)] transition hover:text-white"
      >
        Back to discover
      </Link>

      <div className="surface-card p-5 sm:p-6">
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent)]/20 text-xl font-semibold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-[var(--font-heading)] text-2xl font-semibold text-white">
              {profile.name}
            </h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {[profile.role, profile.country, profile.timezone]
                .filter(Boolean)
                .join(" \u00b7 ")}
            </p>
          </div>
          <Badge
            className={
              profile.openToCollaborate
                ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                : ""
            }
          >
            {profile.openToCollaborate ? "Open to collaborate" : "Focused"}
          </Badge>
        </div>

        {profile.bio ? (
          <p className="mt-5 whitespace-pre-wrap text-sm text-white/90">{profile.bio}</p>
        ) : null}

        {profile.goals ? (
          <div className="mt-5 rounded-2xl border border-white/8 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Current goals
            </p>
            <p className="mt-2 text-sm text-white/90">{profile.goals}</p>
          </div>
        ) : null}

        {profile.skills.length > 0 ? (
          <div className="mt-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Skills
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <Badge key={skill}>{skill}</Badge>
              ))}
            </div>
          </div>
        ) : null}

        {profile.lookingFor.length > 0 ? (
          <div className="mt-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Looking for
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {profile.lookingFor.map((role) => (
                <Badge key={role}>{role}</Badge>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          {profile.websiteUrl ? (
            <a
              href={profile.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white transition hover:border-white/20"
            >
              Website
            </a>
          ) : null}
          {profile.githubUrl ? (
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white transition hover:border-white/20"
            >
              GitHub
            </a>
          ) : null}
          {isSelf ? (
            <Link
              href="/profile"
              className="inline-flex h-11 items-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white transition hover:border-white/20"
            >
              Edit my profile
            </Link>
          ) : (
            <Link
              href={`/partnerships/new?recipient=${profile.id}`}
              className="inline-flex h-11 items-center rounded-2xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-strong)] px-5 text-sm font-medium text-white transition hover:brightness-110"
            >
              Request partnership
            </Link>
          )}
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">
          Projects ({projects.length})
        </h2>
        {projects.length === 0 ? (
          <div className="surface-card p-6 text-center text-sm text-[var(--muted-foreground)]">
            No projects posted yet.
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
      </section>
    </div>
  );
}
