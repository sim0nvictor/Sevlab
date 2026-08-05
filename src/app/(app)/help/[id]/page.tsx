import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { Textarea } from "@/components/ui/textarea";
import { acceptHelpReply, addHelpReply, toggleHelpResolved } from "@/lib/actions/help";
import { formatDate, param, type SearchParams } from "@/lib/params";
import { getCurrentUser, getHelpPost, getHelpReplies } from "@/lib/queries";

export default async function HelpThreadPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const error = param(sp.error);

  const post = await getHelpPost(id);
  if (!post) notFound();

  const [replies, user] = await Promise.all([getHelpReplies(id), getCurrentUser()]);
  const isAsker = user?.id === post.authorId;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link
        href="/help"
        className="inline-flex text-sm text-[var(--muted-foreground)] transition hover:text-white"
      >
        Back to all questions
      </Link>

      {error ? <Notice>{error}</Notice> : null}

      <article className="surface-card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-[var(--font-heading)] text-2xl font-semibold text-white">
              {post.title}
            </h1>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              <Link href={`/builders/${post.authorId}`} className="hover:underline">
                {post.author?.name ?? "Unknown builder"}
              </Link>
              {post.author?.country ? ` \u00b7 ${post.author.country}` : ""}
              {formatDate(post.createdAt) ? ` \u00b7 ${formatDate(post.createdAt)}` : ""}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            {post.topic ? <Badge>{post.topic}</Badge> : null}
            {post.resolved ? (
              <Badge className="border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                Resolved
              </Badge>
            ) : null}
          </div>
        </div>

        <p className="mt-5 whitespace-pre-wrap text-sm text-white/90">
          {post.description}
        </p>

        {post.tags.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        ) : null}

        {isAsker ? (
          <form action={toggleHelpResolved} className="mt-5">
            <input type="hidden" name="helpPostId" value={post.id} />
            <input type="hidden" name="resolved" value={String(post.resolved)} />
            <Button type="submit" variant="outline">
              {post.resolved ? "Reopen question" : "Mark as resolved"}
            </Button>
          </form>
        ) : null}
      </article>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">
          {replies.length} {replies.length === 1 ? "reply" : "replies"}
        </h2>

        {replies.length === 0 ? (
          <div className="surface-card p-6 text-center text-sm text-[var(--muted-foreground)]">
            No replies yet. If you know this one, you can be the first.
          </div>
        ) : (
          replies.map((reply) => (
            <article
              key={reply.id}
              className={
                reply.isAccepted
                  ? "surface-card border border-emerald-400/20 p-5"
                  : "surface-card p-5"
              }
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-white">
                  <Link href={`/builders/${reply.authorId}`} className="hover:underline">
                    {reply.author?.name ?? "Unknown builder"}
                  </Link>
                </p>
                <div className="flex items-center gap-3">
                  {reply.isAccepted ? (
                    <Badge className="border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                      Accepted answer
                    </Badge>
                  ) : null}
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {formatDate(reply.createdAt)}
                  </span>
                </div>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-sm text-white/90">{reply.body}</p>

              {isAsker && !reply.isAccepted ? (
                <form action={acceptHelpReply} className="mt-4">
                  <input type="hidden" name="helpPostId" value={post.id} />
                  <input type="hidden" name="replyId" value={reply.id} />
                  <Button type="submit" variant="outline" size="sm">
                    Accept this answer
                  </Button>
                </form>
              ) : null}
            </article>
          ))
        )}
      </section>

      <form action={addHelpReply} className="surface-card space-y-4 p-5">
        <input type="hidden" name="helpPostId" value={post.id} />
        <label className="grid gap-2 text-sm text-[var(--muted-foreground)]">
          <span>Your reply</span>
          <Textarea name="body" required placeholder="Share what worked for you..." />
        </label>
        <Button type="submit">Post reply</Button>
      </form>
    </div>
  );
}
