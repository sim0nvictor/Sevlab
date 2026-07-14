-- Profiles table, one row per auth user
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  role text not null default '',
  country text,
  skills text[] not null default '{}',
  goals text,
  bio text,
  open_to_collaborate boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Anyone (including logged-out visitors, if you ever allow that) can read profiles
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

-- A user can only create their own profile row
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- A user can only update their own profile row
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up
-- (works for both email/password and Google sign-in)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Keep updated_at fresh on every update
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_profiles_updated on public.profiles;

create trigger on_profiles_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();