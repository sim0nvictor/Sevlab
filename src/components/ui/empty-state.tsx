import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
};

export function EmptyState({
  title,
  description,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className="rounded-[28px] border border-dashed border-white/12 bg-white/[0.03] p-6 text-left">
      <p className="text-base font-semibold text-white">{title}</p>
      <p className="mt-2 max-w-md text-sm text-[var(--muted-foreground)]">
        {description}
      </p>
      {actionLabel ? <Button className="mt-4">{actionLabel}</Button> : null}
    </div>
  );
}
