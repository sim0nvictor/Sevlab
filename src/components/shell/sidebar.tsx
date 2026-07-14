"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import {
  DiscoverIcon,
  FeedIcon,
  FolderIcon,
  HelpIcon,
  ProfileIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const items = [
  { href: "/home", label: "Feed", icon: FeedIcon },
  { href: "/projects/new", label: "Projects", icon: FolderIcon },
  { href: "/help", label: "Help", icon: HelpIcon },
  { href: "/discover", label: "Discover", icon: DiscoverIcon },
  { href: "/profile", label: "Profile", icon: ProfileIcon },
];

type SidebarProps = {
  userName?: string;
  userRole?: string;
  onSignOut?: () => void | Promise<void>;
};

export function Sidebar({ userName, userRole, onSignOut }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen border-r border-white/8 bg-black/20 px-5 py-6 md:flex md:flex-col">
      <Link href="/">
        <BrandLogo />
      </Link>

      {userName ? (
        <div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
          <p className="text-sm font-medium text-white">{userName}</p>
          {userRole ? (
            <p className="text-xs text-[var(--muted-foreground)]">{userRole}</p>
          ) : null}
        </div>
      ) : null}

      <nav className="mt-6 space-y-2">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                active
                  ? "bg-white/10 text-white"
                  : "text-[var(--muted-foreground)] hover:bg-white/6 hover:text-white",
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-5">
        <p className="text-sm font-medium text-white">Keep momentum</p>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Share what you are building before you get stuck for too long.
        </p>
        <Link href="/projects/new" className="mt-4 block">
          <Button className="w-full">Create Project</Button>
        </Link>
      </div>

      <div className="mt-auto space-y-4">
        <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            Community
          </p>
          <div className="mt-3 space-y-3 text-sm text-white">
            <div className="flex items-center justify-between">
              <span>Builders active</span>
              <span>1.2k</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Help posts solved</span>
              <span>342</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Countries represented</span>
              <span>19</span>
            </div>
          </div>
        </div>

        {onSignOut ? (
          <form action={onSignOut}>
            <Button variant="ghost" className="w-full justify-center" type="submit">
              Sign out
            </Button>
          </form>
        ) : null}
      </div>
    </aside>
  );
}