"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function text(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function list(formData: FormData, key: string): string[] {
  const values = formData
    .getAll(key)
    .flatMap((value) => String(value).split(","))
    .map((value) => value.trim())
    .filter(Boolean);
  return Array.from(new Set(values));
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/profile");

  const name = text(formData, "name");
  if (!name) {
    redirect("/profile?error=Name+is+required");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      name,
      role: text(formData, "role"),
      country: text(formData, "country") || null,
      skills: list(formData, "skills"),
      looking_for: list(formData, "lookingFor"),
      goals: text(formData, "goals") || null,
      bio: text(formData, "bio") || null,
      timezone: text(formData, "timezone") || null,
      website_url: text(formData, "websiteUrl") || null,
      github_url: text(formData, "githubUrl") || null,
      open_to_collaborate: formData.get("openToCollaborate") !== null,
    })
    .eq("id", user.id);

  if (error) {
    redirect(`/profile?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/profile");
  revalidatePath("/discover");
  redirect("/profile?saved=1");
}
