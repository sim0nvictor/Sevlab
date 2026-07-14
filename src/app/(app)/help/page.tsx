import { type Metadata } from "next";
import { HelpCard } from "@/components/help-card";
import { EmptyState } from "@/components/ui/empty-state";
import { helpPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Get Help | Sevlab",
  description: "Ask focused questions and get help from builders who understand your context. African developers helping each other get unstuck.",
};

export default function HelpPage() {
  return (
    <section className="space-y-5">
      <div className="surface-card p-5 sm:p-6">
        <p className="text-sm text-[var(--muted-foreground)]">Help section</p>
        <h1 className="mt-1 font-[var(--font-heading)] text-3xl font-semibold text-white">
          Questions from builders who are stuck
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[var(--muted-foreground)]">
          Keep replies actionable: explain the fix, share a pattern, or point
          to the likely root cause.
        </p>
      </div>

      <div className="space-y-4">
        {helpPosts.map((post) => (
          <HelpCard key={post.id} post={post} />
        ))}
      </div>

      <EmptyState
        title="No unresolved design questions right now"
        description="Once new UX or product help requests come in, they will appear here for fast replies."
      />
    </section>
  );
}
