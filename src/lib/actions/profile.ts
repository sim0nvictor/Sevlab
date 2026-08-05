"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

const AVATAR_BUCKET = "avatars";
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

/** Allowed upload types mapped to the extension we store them under. */
const AVATAR_EXTENSIONS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

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

function profileError(message: string): never {
  redirect(`/profile?error=${encodeURIComponent(message)}`);
}

/**
 * Deletes every file in the user's avatar folder except `keepPath`.
 *
 * Each upload uses a fresh timestamped filename so the public URL changes and
 * no CDN cache has to be busted; the cost of that is old files linger, so we
 * sweep them here. Failures are ignored: an orphaned image is not worth
 * failing the user's save over.
 */
async function removeStaleAvatars(
  supabase: SupabaseServerClient,
  userId: string,
  keepPath: string | null,
): Promise<void> {
  const { data } = await supabase.storage.from(AVATAR_BUCKET).list(userId);
  if (!data || data.length === 0) return;

  const stale = data
    .map((file) => `${userId}/${file.name}`)
    .filter((path) => path !== keepPath);

  if (stale.length > 0) {
    await supabase.storage.from(AVATAR_BUCKET).remove(stale);
  }
}

/**
 * Uploads a new avatar, clears the existing one, or leaves it untouched.
 *
 * Returns the partial update to merge into the profiles row: `{}` means "no
 * change", which matters because an empty file input must not wipe a picture
 * the user already has.
 */
async function resolveAvatarUpdate(
  supabase: SupabaseServerClient,
  userId: string,
  formData: FormData,
): Promise<{ avatar_url?: string | null }> {
  const upload = formData.get("avatar");
  const hasUpload = upload instanceof File && upload.size > 0;

  if (hasUpload) {
    const file = upload;
    const extension = AVATAR_EXTENSIONS[file.type] ?? "";
    if (!extension) {
      profileError("Profile picture must be a PNG, JPEG, WebP, or GIF image.");
    }
    if (file.size > MAX_AVATAR_BYTES) {
      profileError("Profile picture must be 2 MB or smaller.");
    }

    // Folder must be the user id: the storage policy checks the first path
    // segment against auth.uid().
    const path = `${userId}/${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: true });

    if (uploadError) {
      profileError(`Could not upload the picture: ${uploadError.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);

    await removeStaleAvatars(supabase, userId, path);
    return { avatar_url: publicUrl };
  }

  if (formData.get("removeAvatar") !== null) {
    await removeStaleAvatars(supabase, userId, null);
    return { avatar_url: null };
  }

  return {};
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/profile");

  const name = text(formData, "name");
  if (!name) {
    profileError("Name is required.");
  }

  const avatarUpdate = await resolveAvatarUpdate(supabase, user.id, formData);

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
      ...avatarUpdate,
    })
    .eq("id", user.id);

  if (error) {
    profileError(error.message);
  }

  // The avatar also renders in the app shell, so revalidate the whole layout
  // rather than just the pages that read the profile directly.
  revalidatePath("/", "layout");
  redirect("/profile?saved=1");
}
