import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HelpPost } from "@/lib/data";

export function HelpCard({ post }: { post: HelpPost }) {
  return (
    <article className="surface-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{post.title}</h3>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            {post.description}
          </p>
        </div>
        <Badge>{post.topic}</Badge>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="text-[var(--muted-foreground)]">
          {post.author} · {post.country}
        </div>
        <div className="font-medium text-white">{post.replies} replies</div>
      </div>

      <div className="mt-5 flex gap-3">
        <Input placeholder="Write a quick reply..." />
        <Button>Reply</Button>
      </div>
    </article>
  );
}
