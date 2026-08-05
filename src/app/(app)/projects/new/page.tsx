import { type Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckboxGroup } from "@/components/ui/checkbox-group";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createProject } from "@/lib/actions/projects";
import { lookingForOptions, statusOptions, toolOptions } from "@/lib/data";
import { param, type SearchParams } from "@/lib/params";

export const metadata: Metadata = {
  title: "Post a Project | Sevlab",
  description:
    "Share what you are building, what you are stuck on, and the kind of partner you need.",
};

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const error = param(sp.error);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="surface-card p-5 sm:p-6">
        <p className="text-sm text-[var(--muted-foreground)]">Post a project</p>
        <h1 className="mt-1 font-[var(--font-heading)] text-3xl font-semibold text-white">
          Share what you are building
        </h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Being specific about where you are stuck is what gets you real help and
          the right partners.
        </p>

        {error ? (
          <div className="mt-5">
            <Notice>{error}</Notice>
          </div>
        ) : null}

        <form action={createProject} className="mt-6 space-y-5">
          <label className="grid gap-2 text-sm text-[var(--muted-foreground)]">
            <span>Project name</span>
            <Input name="title" required maxLength={120} placeholder="What is it called?" />
          </label>

          <label className="grid gap-2 text-sm text-[var(--muted-foreground)]">
            <span>What does it do?</span>
            <Textarea
              name="description"
              required
              placeholder="One or two sentences on the problem it solves and who it is for."
            />
          </label>

          <Select name="status" label="Status" defaultValue="Building">
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>

          <label className="grid gap-2 text-sm text-[var(--muted-foreground)]">
            <span>What are you stuck on? (optional)</span>
            <Textarea
              name="stuckOn"
              placeholder="The specific blocker you would love input on."
            />
          </label>

          <CheckboxGroup name="tags" options={toolOptions} label="Tools and stack" />

          <CheckboxGroup
            name="lookingFor"
            options={lookingForOptions}
            label="Looking for a partner in"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-[var(--muted-foreground)]">
              <span>Repo URL (optional)</span>
              <Input name="repoUrl" type="url" placeholder="https://github.com/..." />
            </label>
            <label className="grid gap-2 text-sm text-[var(--muted-foreground)]">
              <span>Live URL (optional)</span>
              <Input name="liveUrl" type="url" placeholder="https://..." />
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" size="lg">
              Publish project
            </Button>
            <Link
              href="/home"
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
