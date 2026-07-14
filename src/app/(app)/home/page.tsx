import Link from "next/link";
import { type Metadata } from "next";
import { ProfileCard } from "@/components/profile-card";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  builders,
  countryOptions,
  projectFeed,
  statusOptions,
  toolOptions,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Home | Sevlab",
  description: "Browse the latest projects and builds from African developers. Discover what builders are shipping and find collaborators.",
};

export default function HomePage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section>
        <div className="surface-card p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">Project feed</p>
              <h1 className="mt-1 font-[var(--font-heading)] text-3xl font-semibold text-white">
                Builders shipping in public
              </h1>
            </div>
            <Link href="/projects/new">
              <Button className="w-full sm:w-auto">Post a project</Button>
            </Link>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Select defaultValue="">
              <option value="">All tools</option>
              {toolOptions.map((tool) => (
                <option key={tool} value={tool}>
                  {tool}
                </option>
              ))}
            </Select>
            <Select defaultValue="">
              <option value="">All countries</option>
              {countryOptions.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </Select>
            <Select defaultValue="">
              <option value="">All status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {projectFeed.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <aside className="space-y-4">
        <div className="surface-card p-5">
          <p className="text-sm font-medium text-white">This week</p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-white/5 p-3">
              <p className="text-2xl font-semibold text-white">86</p>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                New posts
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 p-3">
              <p className="text-2xl font-semibold text-white">41</p>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                Collaborations
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 p-3">
              <p className="text-2xl font-semibold text-white">29</p>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                Problems solved
              </p>
            </div>
          </div>
        </div>

        {builders.slice(0, 2).map((builder) => (
          <ProfileCard key={builder.id} profile={builder} />
        ))}
      </aside>
    </div>
  );
}
