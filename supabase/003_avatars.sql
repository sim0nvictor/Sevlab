-- 003_avatars.sql
-- Profile pictures. Run this in the Supabase SQL editor.
--
-- Safe to re-run: every statement is idempotent.

/* -------------------------------------------------------------------------- */
/* 1. Column                                                                  */
/* -------------------------------------------------------------------------- */

alter table public.profiles
  add column if not exists avatar_url text;

/* -------------------------------------------------------------------------- */
/* 2. Storage bucket                                                          */
/* -------------------------------------------------------------------------- */

-- Public bucket: avatars are shown to signed-out visitors on builder profiles,
-- so reads must not require a token. Writes are locked down by policy below.
-- The size limit is enforced by storage itself as a second line of defence
-- behind the check in the server action.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  2097152,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update
  set public = true,
      file_size_limit = 2097152,
      allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

/* -------------------------------------------------------------------------- */
/* 3. Storage policies                                                        */
/* -------------------------------------------------------------------------- */

-- Files live at <user-id>/<filename>, so the first path segment is the owner.
-- storage.foldername(name) splits the object path into a text[] of segments.

drop policy if exists "Avatar images are publicly readable" on storage.objects;
create policy "Avatar images are publicly readable"
  on storage.objects
  for select
  using (bucket_id = 'avatars');

drop policy if exists "Users can upload their own avatar" on storage.objects;
create policy "Users can upload their own avatar"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can update their own avatar" on storage.objects;
create policy "Users can update their own avatar"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete their own avatar" on storage.objects;
create policy "Users can delete their own avatar"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
