import { type Metadata } from "next";
import { ProfileCard } from "@/components/profile-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { TagSelect } from "@/components/ui/tag-select";
import { builders, toolOptions } from "@/lib/data";

export const metadata: Metadata = {
  title: "Discover Builders | Sevlab",
  description: "Find designers, frontend engineers, and backend builders across African tech communities. Discover collaborators for your next project.",
};

export default function DiscoverPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section>
        <div className="surface-card p-5 sm:p-6">
          <p className="text-sm text-[var(--muted-foreground)]">
            Discover builders
          </p>
          <h1 className="mt-1 font-[var(--font-heading)] text-3xl font-semibold text-white">
            Find people with matching skills
          </h1>
          <div className="mt-5 space-y-4">
            <Input placeholder="Search by name, country, or skill" />
            <TagSelect options={toolOptions} defaultSelected={["Next.js"]} />
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {builders.map((builder) => (
            <ProfileCard key={builder.id} profile={builder} />
          ))}
        </div>
      </section>

      <aside className="space-y-4">
        <EmptyState
          title="No exact match yet"
          description="Try broader skills or country filters to discover more builders open to collaboration."
          actionLabel="Invite builders"
        />
      </aside>
    </div>
  );
}
