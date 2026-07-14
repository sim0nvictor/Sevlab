import { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
};

export function Select({
  className,
  label,
  children,
  ...props
}: SelectProps) {
  return (
    <label className="grid gap-2 text-sm text-[var(--muted-foreground)]">
      {label ? <span>{label}</span> : null}
      <select
        className={cn(
          "h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-[var(--accent)]",
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
