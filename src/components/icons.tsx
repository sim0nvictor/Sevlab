import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type IconProps = {
  className?: string;
};

function IconFrame({
  className,
  children,
}: PropsWithChildren<IconProps>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-5 w-5", className)}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function FeedIcon({ className }: IconProps) {
  return (
    <IconFrame className={className}>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h10" />
    </IconFrame>
  );
}

export function FolderIcon({ className }: IconProps) {
  return (
    <IconFrame className={className}>
      <path d="M3 8.5a2.5 2.5 0 0 1 2.5-2.5H10l2 2h6.5A2.5 2.5 0 0 1 21 10.5v7A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5z" />
    </IconFrame>
  );
}

export function HelpIcon({ className }: IconProps) {
  return (
    <IconFrame className={className}>
      <path d="M12 18h.01" />
      <path d="M9.5 9a2.5 2.5 0 1 1 4.1 2c-.85.7-1.6 1.25-1.6 2.5" />
      <circle cx="12" cy="12" r="9" />
    </IconFrame>
  );
}

export function DiscoverIcon({ className }: IconProps) {
  return (
    <IconFrame className={className}>
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-3.5-3.5" />
    </IconFrame>
  );
}

export function ProfileIcon({ className }: IconProps) {
  return (
    <IconFrame className={className}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19c1.6-3 4-4.5 7-4.5s5.4 1.5 7 4.5" />
    </IconFrame>
  );
}

export function CommentIcon({ className }: IconProps) {
  return (
    <IconFrame className={className}>
      <path d="M5 7.5A2.5 2.5 0 0 1 7.5 5h9A2.5 2.5 0 0 1 19 7.5v5A2.5 2.5 0 0 1 16.5 15H10l-4 4v-4.5A2.5 2.5 0 0 1 5 12z" />
    </IconFrame>
  );
}

export function SparkIcon({ className }: IconProps) {
  return (
    <IconFrame className={className}>
      <path d="M12 2v5" />
      <path d="m15 7 4-1-1 4" />
      <path d="M7 15 2 16l1-4" />
      <path d="m8 8 8 8" />
      <path d="M12 17v5" />
    </IconFrame>
  );
}

export function GlobeIcon({ className }: IconProps) {
  return (
    <IconFrame className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18" />
      <path d="M12 3a15 15 0 0 0 0 18" />
    </IconFrame>
  );
}
