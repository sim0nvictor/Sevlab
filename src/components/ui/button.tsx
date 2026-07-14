import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
};

const variants = {
  default:
    "bg-gradient-to-r from-[var(--accent)] to-[var(--accent-strong)] text-white shadow-[0_18px_40px_rgba(75,125,255,0.26)] hover:brightness-110",
  secondary: "bg-white/10 text-white hover:bg-white/14",
  ghost:
    "bg-transparent text-[var(--muted-foreground)] hover:bg-white/6 hover:text-white",
  outline:
    "border border-white/10 bg-white/5 text-white hover:border-white/20 hover:bg-white/10",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-sm",
};

export function Button({
  className,
  variant = "default",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-60",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
