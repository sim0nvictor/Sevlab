import { type Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckboxGroup } from "@/components/ui/checkbox-group";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { updateProfile } from "@/lib/actions/profile";
import { countryOptions, lookingForOptions, toolOptions } from "@/lib/data";
import { param, type SearchParams } from "@/lib/params";
import { getCurrentProfile, getProjects } from "@/lib/queries";

export const metadata: Metadata = {
  title: "My Profile | Sevlab",
  description: "Update your skills, goals, and what kind of partner you are looking for.",
};

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const error = param(sp.error);
  const saved = param(sp.saved) === "1";

  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?next=/profile");

  const myProjects = await getProjects({ authorId: profile.id });

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {saved ? <Notice tone="success">Profile saved.</Notice> : null}
      {error ? <Notice>{error}</Notice> : null}

      <div className="surface-card p-5 sm:p-6">
        <p className="text-sm text-[var(--muted-foreground)]">My profile</p>
        <h1 className="mt-1 font-[var(--font-heading)] text-3xl font-semibold text-white">
          How others find you
        </h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          This is what shows up in Discover when someone is looking for a partner.
        </p>

        <form action={updateProfile} className="mt-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-[var(--muted-foreground)]">
              <span>Name</span>
              <Input name="name" required defaultValue={profile.name} />
            </label>
            <label className="grid gap-2 text-sm text-[var(--muted-foreground)]">
              <span>Role</span>
              <Input
                name="role"
                defaultValue={profile.role}
                placeholder="Frontend builder, designer, indie hacker..."
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Select name="country" label="Country" defaultValue={profile.country ?? ""}>
              <option value="">Prefer not to say</option>
              {countryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
            <label className="grid gap-2 text-sm text-[var(--muted-foreground)]">
              <span>Timezone (optional)</span>
              <Input
                name="timezone"
                defaultValue={profile.timezone ?? ""}
                placeholder="GMT+1, PST, CET..."
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm text-[var(--muted-foreground)]">
            <span>Bio</span>
            <Textarea
              name="bio"
              defaultValue={profile.bio ?? ""}
              placeholder="What do you build, and what are you working toward?"
            />
          </label>

          <label className="grid gap-2 text-sm text-[var(--muted-foreground)]">
            <span>Current goals</span>
            <Textarea
              name="goals"
              defaultValue={profile.goals ?? ""}
              placeholder="Ship my first paid product, find a design partner..."
            />
          </label>

          <CheckboxGroup
            name="skills"
            options={toolOptions}
            defaultSelected={profile.skills}
            label="Skills"
          />

          <CheckboxGroup
            name="lookingFor"
            options={lookingForOptions}
            defaultSelected={profile.lookingFor}
            label="Looking for a partner in"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-[var(--muted-foreground)]">
              <span>Website (optional)</span>
              <Input name="websiteUrl" type="url" defaultValue={profile.websiteUrl ?? ""} />
            </label>
            <label className="grid gap-2 text-sm text-[var(--muted-foreground)]">
              <span>GitHub (optional)</span>
              <Input name="githubUrl" type="url" defaultValue={profile.githubUrl ?? ""} />
            </label>
          </div>

          <label className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
            <input
              type="checkbox"
              name="openToCollaborate"
              value="1"
              defaultChecked={profile.openToCollaborate}
              className="h-4 w-4 rounded border-white/20 bg-white/5"
            />
            I am open to collaborate
          </label>

          <Button type="submit" size="lg">
            Save profile
          </Button>
        </form>
      </div>

      <div className="surface-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-white">My projects</h2>
          <Link
            href="/projects/new"
            className="inline-flex h-10 items-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white transition hover:border-white/20"
          >
            Post a project
          </Link>
        </div>

        {myProjects.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--muted-foreground)]">
            You have not posted a project yet.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {myProjects.map((project) => (
              <li key={project.id} className="flex items-center justify-between gap-3">
                <Link href={`/projects/${project.id}`} className="text-sm text-white hover:underline">
                  {project.title}
                </Link>
                <span className="text-xs text-[var(--muted-foreground)]">{project.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
