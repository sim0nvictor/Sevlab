"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function text(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

/**
 * Send a collaboration request to another builder, optionally about a project.
 * sender_id always comes from the session, never the form.
 */
export async function sendPartnershipRequest(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const recipientId = text(formData, "recipientId");
  if (!user) redirect(`/login?next=/discover`);

  if (!recipientId || recipientId === user.id) {
    redirect("/discover?error=Invalid+recipient");
  }

  const message = text(formData, "message");
  if (!message) {
    redirect(`/discover?error=Add+a+short+message+so+they+know+why`);
  }

  const { error } = await supabase.from("partnership_requests").insert({
    sender_id: user.id,
    recipient_id: recipientId,
    project_id: text(formData, "projectId") || null,
    message,
  });

  if (error) {
    // The partial unique index blocks duplicate pending requests.
    const duplicate = error.code === "23505";
    redirect(
      `/discover?error=${encodeURIComponent(
        duplicate ? "You already have a pending request with this builder" : error.message,
      )}`,
    );
  }

  revalidatePath("/discover");
  revalidatePath("/partnerships");
  redirect("/partnerships?sent=1");
}

/** Recipient accepts or declines an incoming request. */
export async function respondToPartnershipRequest(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/partnerships");

  const requestId = text(formData, "requestId");
  const decision = text(formData, "decision");

  if (!requestId || !["accepted", "declined"].includes(decision)) {
    redirect("/partnerships?error=Invalid+response");
  }

  const { error } = await supabase
    .from("partnership_requests")
    .update({ status: decision })
    .eq("id", requestId)
    .eq("recipient_id", user.id);

  if (error) {
    redirect(`/partnerships?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/partnerships");
}

/** Sender withdraws a request they no longer want to be pending. */
export async function withdrawPartnershipRequest(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/partnerships");

  const requestId = text(formData, "requestId");
  if (requestId) {
    await supabase
      .from("partnership_requests")
      .delete()
      .eq("id", requestId)
      .eq("sender_id", user.id)
      .eq("status", "pending");
  }

  revalidatePath("/partnerships");
}
