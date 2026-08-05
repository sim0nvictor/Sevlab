import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckboxGroup } from "@/components/ui/checkbox-group";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  addProjectComment,
  deleteProject,
  updateProject,
} from "@/lib/actions/projects";
import { lookingForOptions, statusOptions, toolOptions } from "@/lib/data";
import { formatDate, param, type SearchParams } from "@/lib/params";
import { getCurrentUser, getProject, getProjectComments } from "@/lib/queries";
import type { ProjectStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusTone: Record<ProjectStatus, string> = {
  Building: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  Stuck: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  Launched: "border-sky-400/20 bg-sky-400/10 text-sky-300",
};

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const error = param(sp.error);

  const project = await getProject(id);
  if (!project) notFound();

  const [comments, user] = await Promise.all([
    getProjectComments(id),
    getCurrentUser(),
  ]);
  const isOwner = user?.id === project.authorId;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link
        href="/home"
        className="inline-flex text-sm text-[var(--muted-foreground)] transition hover:text-white"
      >
        Back to feed
      </Link>

      {error ? <Notice>{error}</Notice> : null}

      <article className="surface-card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-[var(--font-heading)] text-2xl font-semibold text-white">
              {project.title}
            </h1>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              <Link href={`/builders/${project.authorId}`} className="hover:underline">
                {project.author?.name ?? "Unknown builder"}
              </Link>
              {project.author?.country ? ` \u00b7 ${project.author.country}` : ""}
              {formatDate(project.createdAt)
                ? ` \u00b7 ${formatDate(project.createdAt)}`
                : ""}
            </p>
          </div>
          <Badge className={cn("border shrink-0", statusTone[project.status])}>
            {project.status}
          </Badge>
        </div>

        <p className="mt-5 whitespace-pre-wrap text-sm text-white/90">
          {project.description}
        </p>

        {project.tags.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
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
          <div className="mt-5">
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

        <div className="mt-6 flex flex-wrap gap-3">
          {project.repoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white transition hover:border-white/20"
            >
              View repo
            </a>
          ) : null}
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white transition hover:border-white/20"
            >
              Visit live site
            </a>
          ) : null}
          {!isOwner ? (
            <Link
              href={`/partnerships/new?recipient=${project.authorId}&project=${project.id}`}
              className="inline-flex h-11 items-center rounded-2xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-strong)] px-5 text-sm font-medium text-white transition hover:brightness-110"
            >
              Ask to collaborate
            </Link>
          ) : null}
        </div>
      </article>

      {isOwner ? (
        <details id="edit" className="surface-card p-5">
          <summary className="cursor-pointer text-base font-semibold text-white">
            Edit this project
          </summary>

          <form action={updateProject} className="mt-5 space-y-5">
            <input type="hidden" name="projectId" value={project.id} />

            <label className="grid gap-2 text-sm text-[var(--muted-foreground)]">
              <span>Project name</span>
              <Input name="title" required defaultValue={project.title} />
            </label>

            <label className="grid gap-2 text-sm text-[var(--muted-foreground)]">
              <span>Description</span>
              <Textarea name="description" required defaultValue={project.description} />
            </label>

            <Select name="status" label="Status" defaultValue={project.status}>
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>

            <label className="grid gap-2 text-sm text-[var(--muted-foreground)]">
              <span>Stuck on</span>
              <Textarea name="stuckOn" defaultValue={project.stuckOn ?? ""} />
            </label>

            <CheckboxGroup
              name="tags"
              options={toolOptions}
              defaultSelected={project.tags}
              label="Tools and stack"
            />

            <CheckboxGroup
              name="lookingFor"
              options={lookingForOptions}
              defaultSelected={project.lookingFor}
              label="Looking for a partner in"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm text-[var(--muted-foreground)]">
                <span>Repo URL</span>
                <Input name="repoUrl" type="url" defaultValue={project.repoUrl ?? ""} />
              </label>
              <label className="grid gap-2 text-sm text-[var(--muted-foreground)]">
                <span>Live URL</span>
                <Input name="liveUrl" type="url" defaultValue={project.liveUrl ?? ""} />
              </label>
            </div>

            <Button type="submit">Save changes</Button>
          </form>

          <form action={deleteProject} className="mt-6 border-t border-white/8 pt-5">
            <input type="hidden" name="projectId" value={project.id} />
            <p className="text-sm text-[var(--muted-foreground)]">
              Deleting removes this project and its comments permanently.
            </p>
            <Button
              type="submit"
              variant="outline"
              className="mt-3 border-red-400/20 text-red-200 hover:border-red-400/40"
            >
              Delete project
            </Button>
          </form>
        </details>
      ) : null}

      <section id="comments" className="space-y-4">
        <h2 className="text-lg font-semibold text-white">
          {comments.length} {comments.length === 1 ? "comment" : "comments"}
        </h2>

        {comments.length === 0 ? (
          <div className="surface-card p-6 text-center text-sm text-[var(--muted-foreground)]">
            No comments yet. Share feedback or offer to help.
          </div>
        ) : (
          comments.map((comment) => (
            <article key={comment.id} className="surface-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-white">
                  <Link href={`/builders/${comment.authorId}`} className="hover:underline">
                    {comment.author?.name ?? "Unknown builder"}
                  </Link>
                </p>
                <span className="text-xs text-[var(--muted-foreground)]">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-white/90">{comment.body}</p>
            </article>
          ))
        )}

        <form action={addProjectComment} className="surface-card space-y-4 p-5">
          <input type="hidden" name="projectId" value={project.id} />
          <label className="grid gap-2 text-sm text-[var(--muted-foreground)]">
            <span>Add a comment</span>
            <Textarea
              name="body"
              required
              placeholder="Feedback, ideas, or an offer to help with the blocker..."
            />
          </label>
          <Button type="submit">Post comment</Button>
        </form>
      </section>
    </div>
  );
}
