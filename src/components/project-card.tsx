import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CommentIcon, SparkIcon } from "@/components/icons";
import { formatDate } from "@/lib/params";
import type { Project, ProjectStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusTone: Record<ProjectStatus, string> = {
  Building: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  Stuck: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  Launched: "border-sky-400/20 bg-sky-400/10 text-sky-300",
};

const actionClass =
  "inline-flex h-10 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white transition hover:border-white/20 hover:bg-white/10";

export function ProjectCard({
  project,
  currentUserId = null,
}: {
  project: Project;
  currentUserId?: string | null;
}) {
  const isOwner = currentUserId !== null && currentUserId === project.authorId;
  const authorName = project.author?.name ?? "Unknown builder";

  return (
    <article className="surface-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-white">
            <Link href={`/projects/${project.id}`} className="hover:underline">
              {project.title}
            </Link>
          </h3>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            {project.description}
          </p>
        </div>
        <Badge className={cn("border shrink-0", statusTone[project.status])}>
          {project.status}
        </Badge>
      </div>

      {project.tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      ) : null}

      {project.stuckOn ? (
        <div className="mt-5 rounded-2xl border border-white/8 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            Stuck on
          </p>
          <p className="mt-2 text-sm text-white/90">{project.stuckOn}</p>
        </div>
      ) : null}

      {project.lookingFor.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            Looking for
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {project.lookingFor.map((role) => (
              <Badge key={role}>{role}</Badge>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-white">
            <Link href={`/builders/${project.authorId}`} className="hover:underline">
              {authorName}
            </Link>
          </p>
          <p className="text-xs text-[var(--muted-foreground)]">
            {[project.author?.country, formatDate(project.createdAt)]
              .filter(Boolean)
              .join(" \u00b7 ")}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href={`/projects/${project.id}#comments`} className={actionClass}>
            <CommentIcon className="h-4 w-4" />
            {project.commentCount}
          </Link>

          {isOwner ? (
            <Link href={`/projects/${project.id}#edit`} className={actionClass}>
              Edit
            </Link>
          ) : (
            <Link
              href={`/partnerships/new?recipient=${project.authorId}&project=${project.id}`}
              className={actionClass}
            >
              <SparkIcon className="h-4 w-4" />
              Collaborate
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
