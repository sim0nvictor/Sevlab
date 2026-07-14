import { redirect } from "next/navigation";
import { type Metadata } from "next";
import { BrandLogo } from "@/components/brand-logo";
import { ProjectCard } from "@/components/project-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { projectFeed } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Profile | Sevlab",
  description: "Manage your Sevlab profile, update your skills, and showcase your projects to the community.",
};

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const name = profile?.name || user.email?.split("@")[0] || "Builder";
  const role = profile?.role || "Add your role";
  const country = profile?.country || "Add your country";
  const bio = profile?.bio || "Tell other builders what you're working on.";
  const skills: string[] = profile?.skills ?? [];
  const goals = profile?.goals || "Set a goal so collaborators know what you need.";
  const openToCollaborate = profile?.open_to_collaborate ?? true;

  return (
    <div className="space-y-5">
      <section className="surface-card p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <BrandLogo showWordmark={false} imageClassName="h-20 w-20 rounded-[28px]" />
            <div>
              <h1 className="font-[var(--font-heading)] text-3xl font-semibold text-white">
                {name}
              </h1>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                {role} · {country}
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/85">
                {bio}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {skills.length ? (
                  skills.map((skill) => <Badge key={skill}>{skill}</Badge>)
                ) : (
                  <span className="text-sm text-[var(--muted-foreground)]">
                    No skills added yet
                  </span>
                )}
              </div>
            </div>
          </div>

          <Button variant="outline">Edit profile</Button>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="rounded-[28px] bg-white/5 p-4">
            <p className="text-sm text-[var(--muted-foreground)]">Goals</p>
            <p className="mt-2 text-sm text-white">{goals}</p>
          </div>
          <div className="rounded-[28px] bg-white/5 p-4">
            <p className="text-sm text-[var(--muted-foreground)]">Country</p>
            <p className="mt-2 text-sm text-white">{country}</p>
          </div>
          <div className="rounded-[28px] bg-white/5 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Open to collaborate
                </p>
                <p className="mt-2 text-sm text-white">
                  Available for focused product work
                </p>
              </div>
              <Switch checked={openToCollaborate} />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-sm text-[var(--muted-foreground)]">
            Recent projects
          </p>
          <h2 className="mt-1 font-[var(--font-heading)] text-2xl font-semibold text-white">
            Public work in progress
          </h2>
        </div>
        {/* Still mock data — wire this to a real `projects` table once you add one */}
        {projectFeed.slice(0, 2).map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </section>
    </div>
  );
}