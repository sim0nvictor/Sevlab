import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "h-10 w-10 rounded-xl text-xs",
  md: "h-12 w-12 rounded-2xl text-sm",
  lg: "h-14 w-14 rounded-2xl text-lg",
  xl: "h-20 w-20 rounded-3xl text-2xl",
} as const;

export type AvatarSize = keyof typeof sizeClasses;

/** "Ada Lovelace" -> "AL". Falls back to "?" for empty names. */
export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Profile picture with an initials fallback.
 *
 * Uses a plain <img> rather than next/image on purpose: the source is a
 * Supabase Storage URL that would otherwise need to be allowlisted in
 * next.config.ts, and these render at fixed small sizes where the optimizer
 * buys us very little.
 */
export function Avatar({
  name,
  avatarUrl = null,
  size = "md",
  className,
}: {
  name: string;
  avatarUrl?: string | null;
  size?: AvatarSize;
  className?: string;
}) {
  const base = cn(
    "shrink-0 overflow-hidden bg-[var(--accent)]/20 font-semibold text-white",
    sizeClasses[size],
    className,
  );

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        loading="lazy"
        className={cn(base, "object-cover")}
      />
    );
  }

  return (
    <div className={cn(base, "flex items-center justify-center")}>
      {initialsFromName(name)}
    </div>
  );
}
