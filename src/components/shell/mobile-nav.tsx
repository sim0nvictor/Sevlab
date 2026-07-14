"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DiscoverIcon,
  FeedIcon,
  FolderIcon,
  HelpIcon,
  ProfileIcon,
} from "@/components/icons";
import { cn } from "@/lib/utils";

const items = [
  { href: "/home", label: "Feed", icon: FeedIcon },
  { href: "/projects/new", label: "Projects", icon: FolderIcon },
  { href: "/help", label: "Help", icon: HelpIcon },
  { href: "/discover", label: "Discover", icon: DiscoverIcon },
  { href: "/profile", label: "Profile", icon: ProfileIcon },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[rgba(7,10,21,0.92)] px-2 py-2 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-screen-sm grid-cols-5 gap-1">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] transition",
                active
                  ? "bg-white/10 text-white"
                  : "text-[var(--muted-foreground)] hover:bg-white/6 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
