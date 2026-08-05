import { type Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckboxGroup } from "@/components/ui/checkbox-group";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createHelpPost } from "@/lib/actions/help";
import { topicOptions, toolOptions } from "@/lib/data";
import { param, type SearchParams } from "@/lib/params";

export const metadata: Metadata = {
  title: "Ask for Help | Sevlab",
  description: "Describe what you are stuck on and get help from builders worldwide.",
};

export default async function NewHelpPostPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const error = param(sp.error);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="surface-card p-5 sm:p-6">
        <p className="text-sm text-[var(--muted-foreground)]">Get help</p>
        <h1 className="mt-1 font-[var(--font-heading)] text-3xl font-semibold text-white">
          Ask a question
        </h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          The clearer the problem, the faster someone can help.
        </p>

        {error ? (
          <div className="mt-5">
            <Notice>{error}</Notice>
          </div>
        ) : null}

        <form action={createHelpPost} className="mt-6 space-y-5">
          <label className="grid gap-2 text-sm text-[var(--muted-foreground)]">
            <span>Question</span>
            <Input
              name="title"
              required
              maxLength={160}
              placeholder="Why does my session drop after refresh in production?"
            />
          </label>

          <label className="grid gap-2 text-sm text-[var(--muted-foreground)]">
            <span>Details</span>
            <Textarea
              name="description"
              required
              className="min-h-40"
              placeholder="What did you expect, what happened, and what have you already tried?"
            />
          </label>

          <Select name="topic" label="Topic">
            <option value="">Choose a topic</option>
            {topicOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>

          <CheckboxGroup name="tags" options={toolOptions} label="Tools involved" />

          <div className="flex flex-wrap gap-3">
            <Button type="submit" size="lg">
              Post question
            </Button>
            <Link
              href="/help"
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
