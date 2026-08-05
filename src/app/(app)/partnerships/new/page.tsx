import { type Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { Textarea } from "@/components/ui/textarea";
import { sendPartnershipRequest } from "@/lib/actions/partnerships";
import { param, type SearchParams } from "@/lib/params";
import { getBuilder, getCurrentUser, getProject } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Request a Partnership | Sevlab",
  description: "Send a collaboration request explaining what you want to build together.",
};

export default async function NewPartnershipPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const recipientId = param(sp.recipient);
  const projectId = param(sp.project);
  const error = param(sp.error);

  if (!recipientId) redirect("/discover");

  const [recipient, user] = await Promise.all([
    getBuilder(recipientId),
    getCurrentUser(),
  ]);

  if (!recipient) notFound();
  if (user?.id === recipient.id) redirect("/profile");

  const project = projectId ? await getProject(projectId) : null;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link
        href={`/builders/${recipient.id}`}
        className="inline-flex text-sm text-[var(--muted-foreground)] transition hover:text-white"
      >
        Back to profile
      </Link>

      {error ? <Notice>{error}</Notice> : null}

      <div className="surface-card p-5 sm:p-6">
        <p className="text-sm text-[var(--muted-foreground)]">Request a partnership</p>
        <h1 className="mt-1 font-[var(--font-heading)] text-3xl font-semibold text-white">
          Reach out to {recipient.name}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          {[recipient.role, recipient.country].filter(Boolean).join(" \u00b7 ")}
        </p>

        {recipient.lookingFor.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {recipient.lookingFor.map((role) => (
              <Badge key={role}>{role}</Badge>
            ))}
          </div>
        ) : null}

        {project ? (
          <div className="mt-5 rounded-2xl border border-white/8 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              About this project
            </p>
            <p className="mt-2 text-sm text-white/90">{project.title}</p>
          </div>
        ) : null}

        <form action={sendPartnershipRequest} className="mt-6 space-y-5">
          <input type="hidden" name="recipientId" value={recipient.id} />
          {project ? <input type="hidden" name="projectId" value={project.id} /> : null}

          <label className="grid gap-2 text-sm text-[var(--muted-foreground)]">
            <span>Your message</span>
            <Textarea
              name="message"
              required
              className="min-h-40"
              placeholder="What are you building, why them, and what would you want them to own?"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" size="lg">
              Send request
            </Button>
            <Link
              href="/discover"
              className="inline-flex h-12 items-center rounded-2xl border border-white/10 bg-white/5 px-5 text-sm text-white transition hover:border-white/20"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
