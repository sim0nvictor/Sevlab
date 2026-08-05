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

export async function createHelpPost(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/help/new");

  const title = text(formData, "title");
  const description = text(formData, "description");

  if (!title || !description) {
    redirect("/help/new?error=Title+and+details+are+required");
  }

  const { data, error } = await supabase
    .from("help_posts")
    .insert({
      author_id: user.id,
      title,
      description,
      topic: text(formData, "topic") || null,
      tags: list(formData, "tags"),
    })
    .select("id")
    .single();

  if (error) {
    redirect(`/help/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/help");
  redirect(`/help/${data.id}`);
}

export async function addHelpReply(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const helpPostId = text(formData, "helpPostId");
  if (!user) redirect(`/login?next=/help/${helpPostId}`);

  const body = text(formData, "body");
  if (!body) redirect(`/help/${helpPostId}?error=Reply+cannot+be+empty`);

  const { error } = await supabase.from("help_replies").insert({
    help_post_id: helpPostId,
    author_id: user.id,
    body,
  });

  if (error) {
    redirect(`/help/${helpPostId}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/help/${helpPostId}`);
  revalidatePath("/help");
}

/**
 * Mark a reply as the one that unblocked the asker, and resolve the thread.
 * RLS lets either the reply author or the post author update a reply, so we
 * additionally confirm the caller owns the post before accepting.
 */
export async function acceptHelpReply(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const helpPostId = text(formData, "helpPostId");
  const replyId = text(formData, "replyId");
  if (!helpPostId || !replyId) redirect("/help");

  const { data: post } = await supabase
    .from("help_posts")
    .select("author_id")
    .eq("id", helpPostId)
    .maybeSingle();

  if (post?.author_id !== user.id) {
    redirect(`/help/${helpPostId}?error=Only+the+asker+can+accept+an+answer`);
  }

  // Clear any previously accepted reply, then accept this one.
  await supabase
    .from("help_replies")
    .update({ is_accepted: false })
    .eq("help_post_id", helpPostId);

  await supabase
    .from("help_replies")
    .update({ is_accepted: true })
    .eq("id", replyId)
    .eq("help_post_id", helpPostId);

  await supabase
    .from("help_posts")
    .update({ resolved: true })
    .eq("id", helpPostId)
    .eq("author_id", user.id);

  revalidatePath(`/help/${helpPostId}`);
  revalidatePath("/help");
}

export async function toggleHelpResolved(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const helpPostId = text(formData, "helpPostId");
  const resolved = text(formData, "resolved") === "true";

  await supabase
    .from("help_posts")
    .update({ resolved: !resolved })
    .eq("id", helpPostId)
    .eq("author_id", user.id);

  revalidatePath(`/help/${helpPostId}`);
  revalidatePath("/help");
}
