import { type Metadata } from "next";
import Link from "next/link";
import { ProfileCard } from "@/components/profile-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { Select } from "@/components/ui/select";
import { countryOptions, toolOptions } from "@/lib/data";
import { param, type SearchParams } from "@/lib/params";
import { getBuilders, getCurrentUser } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Discover Builders | Sevlab",
  description:
    "Find designers, engineers and creators anywhere in the world. Discover partners for your next project.",
};

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const q = param(sp.q);
  const skill = param(sp.skill);
  const country = param(sp.country);
  const openOnly = param(sp.open) === "1";
  const error = param(sp.error);
  const isFiltered = Boolean(q || skill || country || openOnly);

  const [builders, user] = await Promise.all([
    getBuilders({ search: q, skill, country, openOnly }),
    getCurrentUser(),
  ]);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section>
        {error ? (
          <div className="mb-4">
            <Notice>{error}</Notice>
          </div>
        ) : null}

        <div className="surface-card p-5 sm:p-6">
          <p className="text-sm text-[var(--muted-foreground)]">Discover builders</p>
          <h1 className="mt-1 font-[var(--font-heading)] text-3xl font-semibold text-white">
            Find people to build with
          </h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Search by name, role, skill or country, then send a partnership request.
          </p>

          <form method="get" className="mt-5 space-y-4">
            <Input
              name="q"
              defaultValue={q}
              placeholder="Search by name, role, or bio"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Select name="skill" label="Skill" defaultValue={skill}>
                <option value="">Any skill</option>
                {toolOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
              <Select name="country" label="Country" defaultValue={country}>
                <option value="">Anywhere</option>
                {countryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </div>
            <label className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
              <input
                type="checkbox"
                name="open"
                value="1"
                defaultChecked={openOnly}
                className="h-4 w-4 rounded border-white/20 bg-white/5"
              />
              Only show builders open to collaborate
            </label>
            <div className="flex gap-2">
              <Button type="submit">Search</Button>
              {isFiltered ? (
                <Link
                  href="/discover"
                  className="inline-flex h-11 items-center rounded-2xl px-3 text-sm text-[var(--muted-foreground)] transition hover:text-white"
                >
                  Clear
                </Link>
              ) : null}
            </div>
          </form>
        </div>

        <p className="mt-5 text-sm text-[var(--muted-foreground)]">
          {builders.length} {builders.length === 1 ? "builder" : "builders"}
        </p>

        <div className="mt-4 space-y-4">
          {builders.length === 0 ? (
            <div className="surface-card p-8 text-center">
              <h2 className="text-lg font-semibold text-white">No builders found</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted-foreground)]">
                {isFiltered
                  ? "Try broader skills or clear the country filter."
                  : "As people join Sevlab and fill in their profiles, they will show up here."}
              </p>
            </div>
          ) : (
            builders.map((builder) => (
              <ProfileCard
                key={builder.id}
                profile={builder}
                currentUserId={user?.id ?? null}
              />
            ))
          )}
        </div>
      </section>

      <aside className="space-y-4">
        <div className="surface-card p-5">
          <h2 className="text-base font-semibold text-white">How partnerships work</h2>
          <ol className="mt-3 space-y-3 text-sm text-[var(--muted-foreground)]">
            <li>1. Find someone whose skills complement yours.</li>
            <li>2. Send a request with a short note about the idea.</li>
            <li>3. If they accept, you both see it in Partnerships.</li>
          </ol>
          <Link
            href="/partnerships"
            className="mt-4 inline-flex h-11 items-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white transition hover:border-white/20"
          >
            View my partnerships
          </Link>
        </div>

        <div className="surface-card p-5">
          <h2 className="text-base font-semibold text-white">Be discoverable</h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Add your skills and what you are looking for so others can find you.
          </p>
          <Link
            href="/profile"
            className="mt-4 inline-flex h-11 items-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white transition hover:border-white/20"
          >
            Update my profile
          </Link>
        </div>
      </aside>
    </div>
  );
}
