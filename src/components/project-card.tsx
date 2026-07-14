import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CommentIcon, SparkIcon } from "@/components/icons";
import { Project } from "@/lib/data";
import { cn } from "@/lib/utils";

const statusTone: Record<Project["status"], string> = {
  Building: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  Stuck: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  Launched: "border-sky-400/20 bg-sky-400/10 text-sky-300",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="surface-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{project.title}</h3>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            {project.description}
          </p>
        </div>
        <Badge className={cn("border", statusTone[project.status])}>
          {project.status}
        </Badge>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-white/8 bg-black/20 p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
          What I&apos;m stuck on
        </p>
        <p className="mt-2 text-sm text-white/90">{project.stuckOn}</p>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-white">{project.author}</p>
          <p className="text-xs text-[var(--muted-foreground)]">
            {project.country}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" className="h-10 px-3 text-white">
            <CommentIcon className="h-4 w-4" />
            {project.comments}
          </Button>
          <Button variant="outline" className="h-10 px-4">
            <SparkIcon className="h-4 w-4" />
            Collaborate
          </Button>
        </div>
      </div>
    </article>
  );
}
