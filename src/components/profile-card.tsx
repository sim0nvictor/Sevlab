import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BuilderProfile } from "@/lib/data";

export function ProfileCard({ profile }: { profile: BuilderProfile }) {
  return (
    <article className="surface-card p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent)]/20 text-lg font-semibold text-white">
          {profile.name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-white">{profile.name}</h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                {profile.role} · {profile.country}
              </p>
            </div>
            <Badge
              className={
                profile.openToCollaborate
                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                  : ""
              }
            >
              {profile.openToCollaborate ? "Open to collaborate" : "Focused"}
            </Badge>
          </div>
          {profile.bio ? (
            <p className="mt-3 text-sm text-white/85">{profile.bio}</p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <Badge key={skill}>{skill}</Badge>
            ))}
          </div>
          <p className="mt-4 text-sm text-[var(--muted-foreground)]">
            {profile.goals}
          </p>
          <Button variant="outline" className="mt-4">
            View profile
          </Button>
        </div>
      </div>
    </article>
  );
}
