"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthCallbackUrl } from "@/lib/site-url";

export async function signUpWithEmail(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "");

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      emailRedirectTo: getAuthCallbackUrl(),
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/signup/check-email");
}

export async function signInWithEmail(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/home");
}

export async function signInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getAuthCallbackUrl(),
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  if (data.url) {
    redirect(data.url);
  }
}

/**
 * Sends a password reset email.
 *
 * The link points at /auth/callback?next=/reset-password so it reuses the same
 * code exchange, absolute-URL resolution, and open-redirect guard as every
 * other auth email.
 */
export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    redirect(
      `/forgot-password?error=${encodeURIComponent(
        "Enter the email address you signed up with.",
      )}`,
    );
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: getAuthCallbackUrl("/reset-password"),
  });

  // Only rate limiting is reported back. Every other outcome, including an
  // address that has no account, lands on the same confirmation screen so this
  // form cannot be used to work out who is registered.
  if (error && error.status === 429) {
    redirect(
      `/forgot-password?error=${encodeURIComponent(
        "Too many attempts. Wait a minute and try again.",
      )}`,
    );
  }

  redirect("/forgot-password/check-email");
}

/**
 * Sets a new password for the user in the current recovery session.
 */
export async function updatePassword(formData: FormData) {
  const supabase = await createClient();

  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password.length < 6) {
    redirect(
      `/reset-password?error=${encodeURIComponent(
        "Your new password must be at least 6 characters.",
      )}`,
    );
  }

  if (password !== confirmPassword) {
    redirect(
      `/reset-password?error=${encodeURIComponent(
        "Those two passwords do not match.",
      )}`,
    );
  }

  // Clicking the email link establishes a session. Without one there is nothing
  // to update, which means the link was already used or has expired.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/forgot-password?error=${encodeURIComponent(
        "That reset link has expired. Request a new one below.",
      )}`,
    );
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/reset-password?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/home");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
