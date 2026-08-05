import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { BuilderProfile } from "@/lib/types";

const actionClass =
  "inline-flex h-10 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white transition hover:border-white/20 hover:bg-white/10";

export function ProfileCard({
  profile,
  currentUserId = null,
}: {
  profile: BuilderProfile;
  currentUserId?: string | null;
}) {
  const isSelf = currentUserId !== null && currentUserId === profile.id;
  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="surface-card p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent)]/20 text-lg font-semibold text-white">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-white">
                <Link href={`/builders/${profile.id}`} className="hover:underline">
                  {profile.name}
                </Link>
              </h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                {[profile.role, profile.country].filter(Boolean).join(" \u00b7 ")}
              </p>
            </div>
            <Badge
              className={
                profile.openToCollaborate
                  ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 shrink-0"
                  : "shrink-0"
              }
            >
              {profile.openToCollaborate ? "Open to collaborate" : "Focused"}
            </Badge>
          </div>

          {profile.bio ? (
            <p className="mt-3 text-sm text-white/85">{profile.bio}</p>
          ) : null}

          {profile.skills.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <Badge key={skill}>{skill}</Badge>
              ))}
            </div>
          ) : null}

          {profile.lookingFor.length > 0 ? (
            <p className="mt-4 text-sm text-[var(--muted-foreground)]">
              Looking for: {profile.lookingFor.join(", ")}
            </p>
          ) : null}

          {profile.goals ? (
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">{profile.goals}</p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={`/builders/${profile.id}`} className={actionClass}>
              View profile
            </Link>
            {isSelf ? (
              <Link href="/profile" className={actionClass}>
                Edit profile
              </Link>
            ) : (
              <Link href={`/partnerships/new?recipient=${profile.id}`} className={actionClass}>
                Request partnership
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
