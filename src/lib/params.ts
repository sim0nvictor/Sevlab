export type SearchParams = Record<string, string | string[] | undefined>;

/** Normalize a Next.js searchParams value to a single trimmed string. */
export function param(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return (value[0] ?? "").trim();
  return (value ?? "").trim();
}

/** Format a timestamp for display without pulling in a date library. */
export function formatDate(value: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
