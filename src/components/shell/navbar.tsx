import Link from "next/link";
import { GlobeIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 hidden border-b border-white/8 bg-[rgba(7,10,21,0.82)] px-6 py-4 backdrop-blur md:block">
      <div className="flex items-center justify-between gap-4">
        <div className="w-full max-w-md">
          <Input placeholder="Search builders, tools, projects..." />
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-[var(--muted-foreground)] lg:flex">
            <GlobeIcon className="h-4 w-4" />
            Built for African self-taught developers
          </div>
          <Link href="/projects/new">
            <Button>Create Project</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
