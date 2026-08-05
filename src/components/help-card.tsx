import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addHelpReply } from "@/lib/actions/help";
import { formatDate } from "@/lib/params";
import type { HelpPost } from "@/lib/types";

export function HelpCard({ post }: { post: HelpPost }) {
  return (
    <article className="surface-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-white">
            <Link href={`/help/${post.id}`} className="hover:underline">
              {post.title}
            </Link>
          </h3>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            {post.description}
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

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
        <div className="text-[var(--muted-foreground)]">
          <Link href={`/builders/${post.authorId}`} className="hover:underline">
            {post.author?.name ?? "Unknown builder"}
          </Link>
          {post.author?.country ? ` \u00b7 ${post.author.country}` : ""}
          {formatDate(post.createdAt) ? ` \u00b7 ${formatDate(post.createdAt)}` : ""}
        </div>
        <Link href={`/help/${post.id}`} className="font-medium text-white hover:underline">
          {post.replyCount} {post.replyCount === 1 ? "reply" : "replies"}
        </Link>
      </div>

      <form action={addHelpReply} className="mt-5 flex gap-3">
        <input type="hidden" name="helpPostId" value={post.id} />
        <Input name="body" placeholder="Write a quick reply..." required />
        <Button type="submit">Reply</Button>
      </form>
    </article>
  );
}
