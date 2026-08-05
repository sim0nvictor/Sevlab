import { type Metadata } from "next";
import Link from "next/link";
import { HelpCard } from "@/components/help-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { Select } from "@/components/ui/select";
import { topicOptions } from "@/lib/data";
import { param, type SearchParams } from "@/lib/params";
import { getHelpPosts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Get Help | Sevlab",
  description:
    "Ask the Sevlab community when you are blocked. Real answers from builders who have hit the same wall.",
};

const primaryAction =
  "inline-flex h-11 items-center rounded-2xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-strong)] px-5 text-sm font-medium text-white transition hover:brightness-110";

export default async function HelpPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const q = param(sp.q);
  const topic = param(sp.topic);
  const unresolved = param(sp.unresolved) === "1";
  const error = param(sp.error);
  const isFiltered = Boolean(q || topic || unresolved);

  const posts = await getHelpPosts({
    search: q,
    topic,
    unresolvedOnly: unresolved,
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section>
        {error ? (
          <div className="mb-4">
            <Notice>{error}</Notice>
          </div>
        ) : null}

        <div className="surface-card p-5 sm:p-6">
          <p className="text-sm text-[var(--muted-foreground)]">Get help</p>
          <h1 className="mt-1 font-[var(--font-heading)] text-3xl font-semibold text-white">
            Stuck? Ask the community
          </h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Every builder gets blocked. Describe the problem clearly and someone who
            has solved it can help.
          </p>

          <form method="get" className="mt-5 space-y-4">
            <Input name="q" defaultValue={q} placeholder="Search questions" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Select name="topic" label="Topic" defaultValue={topic}>
                <option value="">All topics</option>
                {topicOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
              <label className="flex items-end gap-3 pb-3 text-sm text-[var(--muted-foreground)]">
                <input
                  type="checkbox"
                  name="unresolved"
                  value="1"
                  defaultChecked={unresolved}
                  className="h-4 w-4 rounded border-white/20 bg-white/5"
                />
                Unanswered only
              </label>
            </div>
            <div className="flex gap-2">
              <Button type="submit">Search</Button>
              {isFiltered ? (
                <Link
                  href="/help"
                  className="inline-flex h-11 items-center rounded-2xl px-3 text-sm text-[var(--muted-foreground)] transition hover:text-white"
                >
                  Clear
                </Link>
              ) : null}
            </div>
          </form>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[var(--muted-foreground)]">
            {posts.length} {posts.length === 1 ? "question" : "questions"}
          </p>
          <Link href="/help/new" className={primaryAction}>
            Ask for help
          </Link>
        </div>

        <div className="mt-4 space-y-4">
          {posts.length === 0 ? (
            <div className="surface-card p-8 text-center">
              <h2 className="text-lg font-semibold text-white">
                {isFiltered ? "No questions match" : "No questions yet"}
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted-foreground)]">
                {isFiltered
                  ? "Try a different topic or clear your filters."
                  : "Ask the first question and start the board off."}
              </p>
              <Link href="/help/new" className={`${primaryAction} mt-5`}>
                Ask for help
              </Link>
            </div>
          ) : (
            posts.map((post) => <HelpCard key={post.id} post={post} />)
          )}
        </div>
      </section>

      <aside className="space-y-4">
        <div className="surface-card p-5">
          <h2 className="text-base font-semibold text-white">How to ask well</h2>
          <ul className="mt-3 space-y-3 text-sm text-[var(--muted-foreground)]">
            <li>Say what you expected and what happened instead.</li>
            <li>Include the tools involved so the right people see it.</li>
            <li>Mention what you already tried.</li>
            <li>Mark an answer as accepted once you are unblocked.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
