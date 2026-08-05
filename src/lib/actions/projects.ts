"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function text(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

/** Multi-value fields (checkbox groups) plus comma-separated fallback. */
function list(formData: FormData, key: string): string[] {
  const values = formData
    .getAll(key)
    .flatMap((value) => String(value).split(","))
    .map((value) => value.trim())
    .filter(Boolean);
  return Array.from(new Set(values));
}

export async function createProject(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/projects/new");

  const title = text(formData, "title");
  const description = text(formData, "description");

  if (!title || !description) {
    redirect("/projects/new?error=Title+and+description+are+required");
  }

  const status = text(formData, "status") || "Building";

  const { error } = await supabase.from("projects").insert({
    author_id: user.id,
    title,
    description,
    tags: list(formData, "tags"),
    status: ["Building", "Stuck", "Launched"].includes(status) ? status : "Building",
    stuck_on: text(formData, "stuckOn") || null,
    looking_for: list(formData, "lookingFor"),
    repo_url: text(formData, "repoUrl") || null,
    live_url: text(formData, "liveUrl") || null,
  });

  if (error) {
    redirect(`/projects/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/home");
  revalidatePath("/projects");
  redirect("/home");
}

export async function updateProject(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const id = text(formData, "projectId");
  if (!id) redirect("/home");

  const status = text(formData, "status") || "Building";

  // RLS also enforces ownership; eq(author_id) makes the intent explicit.
  const { error } = await supabase
    .from("projects")
    .update({
      title: text(formData, "title"),
      description: text(formData, "description"),
      tags: list(formData, "tags"),
      status: ["Building", "Stuck", "Launched"].includes(status) ? status : "Building",
      stuck_on: text(formData, "stuckOn") || null,
      looking_for: list(formData, "lookingFor"),
      repo_url: text(formData, "repoUrl") || null,
      live_url: text(formData, "liveUrl") || null,
    })
    .eq("id", id)
    .eq("author_id", user.id);

  if (error) {
    redirect(`/projects/${id}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/home");
  revalidatePath(`/projects/${id}`);
  redirect(`/projects/${id}`);
}

export async function deleteProject(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const id = text(formData, "projectId");
  if (id) {
    await supabase.from("projects").delete().eq("id", id).eq("author_id", user.id);
  }

  revalidatePath("/home");
  redirect("/home");
}

export async function addProjectComment(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const projectId = text(formData, "projectId");
  if (!user) redirect(`/login?next=/projects/${projectId}`);

  const body = text(formData, "body");
  if (!body) redirect(`/projects/${projectId}?error=Comment+cannot+be+empty`);

  const { error } = await supabase.from("project_comments").insert({
    project_id: projectId,
    author_id: user.id,
    body,
  });

  if (error) {
    redirect(`/projects/${projectId}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/home");
}
