import { type Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { TagSelect } from "@/components/ui/tag-select";
import { Textarea } from "@/components/ui/textarea";
import { statusOptions, toolOptions } from "@/lib/data";

export const metadata: Metadata = {
  title: "Post a Project | Sevlab",
  description: "Share your side project, public build, or progress update with the Sevlab community. Find collaborators for your next project.",
};

export default function CreateProjectPage() {
  return (
    <section className="mx-auto max-w-3xl">
      <div className="surface-card p-5 sm:p-6">
        <p className="text-sm text-[var(--muted-foreground)]">Create project</p>
        <h1 className="mt-1 font-[var(--font-heading)] text-3xl font-semibold text-white">
          Share what you are building
        </h1>
        <p className="mt-3 text-sm text-[var(--muted-foreground)]">
          Keep it short, specific, and easy for collaborators to understand
          quickly on mobile.
        </p>

        <form className="mt-8 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-[var(--muted-foreground)] sm:col-span-2">
              <span>Title</span>
              <Input placeholder="e.g. Creator marketplace for local artisans" />
            </label>

            <label className="grid gap-2 text-sm text-[var(--muted-foreground)] sm:col-span-2">
              <span>Description</span>
              <Textarea placeholder="What are you building and who is it for?" />
            </label>

            <label className="grid gap-2 text-sm text-[var(--muted-foreground)] sm:col-span-2">
              <span>What are you stuck on?</span>
              <Textarea placeholder="Share the blocker so people can help quickly." />
            </label>

            <div className="sm:col-span-2">
              <p className="mb-2 text-sm text-[var(--muted-foreground)]">
                Tool tags
              </p>
              <TagSelect
                options={toolOptions}
                defaultSelected={["Next.js", "Tailwind"]}
              />
            </div>

            <label className="grid gap-2 text-sm text-[var(--muted-foreground)]">
              <span>GitHub link</span>
              <Input placeholder="https://github.com/username/project" />
            </label>

            <Select label="Status" defaultValue="Building">
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>

            <label className="grid gap-2 text-sm text-[var(--muted-foreground)] sm:col-span-2">
              <span>Image upload</span>
              <div className="rounded-[28px] border border-dashed border-white/12 bg-white/[0.03] p-6 text-center">
                <p className="text-sm text-white">
                  Drag an image here or tap to upload
                </p>
                <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                  UI only for MVP. Keep files small for low bandwidth users.
                </p>
              </div>
            </label>
          </div>

          <Button size="lg">Submit Project</Button>
        </form>
      </div>
    </section>
  );
}
