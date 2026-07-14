import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-[var(--muted-foreground)] transition focus:border-[var(--accent)] focus:bg-white/[0.07]",
        className,
      )}
      {...props}
    />
  );
}
