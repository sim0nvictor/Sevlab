-- Sevlab platform schema: projects, help threads, and partnerships.
-- Depends on 001_profiles.sql (public.profiles, public.handle_updated_at).

-- ---------------------------------------------------------------------------
-- Profile additions
-- ---------------------------------------------------------------------------
-- Global-first fields, plus what kind of partner this builder is looking for.
alter table public.profiles
  add column if not exists timezone text,
  add column if not exists website_url text,
  add column if not exists github_url text,
  add column if not exists looking_for text[] not null default '{}';

-- ---------------------------------------------------------------------------
-- Projects
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  tags text[] not null default '{}',
  status text not null default 'Building'
    check (status in ('Building', 'Stuck', 'Launched')),
  -- What the builder is currently blocked on (optional).
  stuck_on text,
  -- Roles/skills this project needs help with, e.g. {Backend,Design}.
  looking_for text[] not null default '{}',
  repo_url text,
  live_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_author_id_idx
  on public.projects (author_id);
create index if not exists projects_created_at_idx
  on public.projects (created_at desc);
create index if not exists projects_status_idx
  on public.projects (status);
create index if not exists projects_tags_idx
  on public.projects using gin (tags);

alter table public.projects enable row level security;

drop policy if exists "Projects are viewable by everyone" on public.projects;
create policy "Projects are viewable by everyone"
  on public.projects for select
  using (true);

drop policy if exists "Users can insert their own projects" on public.projects;
create policy "Users can insert their own projects"
  on public.projects for insert
  with check (auth.uid() = author_id);

drop policy if exists "Users can update their own projects" on public.projects;
create policy "Users can update their own projects"
  on public.projects for update
  using (auth.uid() = author_id);

drop policy if exists "Users can delete their own projects" on public.projects;
create policy "Users can delete their own projects"
  on public.projects for delete
  using (auth.uid() = author_id);

drop trigger if exists on_projects_updated on public.projects;
create trigger on_projects_updated
  before update on public.projects
  for each row execute procedure public.handle_updated_at();

-- ---------------------------------------------------------------------------
-- Project comments
-- ---------------------------------------------------------------------------
create table if not exists public.project_comments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists project_comments_project_id_idx
  on public.project_comments (project_id, created_at);

alter table public.project_comments enable row level security;

drop policy if exists "Comments are viewable by everyone" on public.project_comments;
create policy "Comments are viewable by everyone"
  on public.project_comments for select
  using (true);

drop policy if exists "Users can insert their own comments" on public.project_comments;
create policy "Users can insert their own comments"
  on public.project_comments for insert
  with check (auth.uid() = author_id);

drop policy if exists "Users can delete their own comments" on public.project_comments;
create policy "Users can delete their own comments"
  on public.project_comments for delete
  using (auth.uid() = author_id);

-- ---------------------------------------------------------------------------
-- Help posts ("I'm stuck" threads)
-- ---------------------------------------------------------------------------
create table if not exists public.help_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  topic text,
  tags text[] not null default '{}',
  resolved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists help_posts_created_at_idx
  on public.help_posts (created_at desc);
create index if not exists help_posts_author_id_idx
  on public.help_posts (author_id);
create index if not exists help_posts_resolved_idx
  on public.help_posts (resolved);

alter table public.help_posts enable row level security;

drop policy if exists "Help posts are viewable by everyone" on public.help_posts;
create policy "Help posts are viewable by everyone"
  on public.help_posts for select
  using (true);

drop policy if exists "Users can insert their own help posts" on public.help_posts;
create policy "Users can insert their own help posts"
  on public.help_posts for insert
  with check (auth.uid() = author_id);

drop policy if exists "Users can update their own help posts" on public.help_posts;
create policy "Users can update their own help posts"
  on public.help_posts for update
  using (auth.uid() = author_id);

drop policy if exists "Users can delete their own help posts" on public.help_posts;
create policy "Users can delete their own help posts"
  on public.help_posts for delete
  using (auth.uid() = author_id);

drop trigger if exists on_help_posts_updated on public.help_posts;
create trigger on_help_posts_updated
  before update on public.help_posts
  for each row execute procedure public.handle_updated_at();

-- ---------------------------------------------------------------------------
-- Help replies
-- ---------------------------------------------------------------------------
create table if not exists public.help_replies (
  id uuid primary key default gen_random_uuid(),
  help_post_id uuid not null references public.help_posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  -- The post author can mark one reply as the answer that unblocked them.
  is_accepted boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists help_replies_help_post_id_idx
  on public.help_replies (help_post_id, created_at);

alter table public.help_replies enable row level security;

drop policy if exists "Replies are viewable by everyone" on public.help_replies;
create policy "Replies are viewable by everyone"
  on public.help_replies for select
  using (true);

drop policy if exists "Users can insert their own replies" on public.help_replies;
create policy "Users can insert their own replies"
  on public.help_replies for insert
  with check (auth.uid() = author_id);

-- Reply author can edit their text; post author can accept a reply.
drop policy if exists "Reply or post author can update a reply" on public.help_replies;
create policy "Reply or post author can update a reply"
  on public.help_replies for update
  using (
    auth.uid() = author_id
    or auth.uid() = (
      select author_id from public.help_posts
      where id = help_replies.help_post_id
    )
  );

drop policy if exists "Users can delete their own replies" on public.help_replies;
create policy "Users can delete their own replies"
  on public.help_replies for delete
  using (auth.uid() = author_id);

-- ---------------------------------------------------------------------------
-- Partnership requests
-- ---------------------------------------------------------------------------
-- One builder asking another to collaborate, optionally about a project.
create table if not exists public.partnership_requests (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  message text not null,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint partnership_requests_no_self
    check (sender_id <> recipient_id)
);

-- Prevent duplicate pending spam for the same pair + project.
create unique index if not exists partnership_requests_unique_pending_idx
  on public.partnership_requests (
    sender_id, recipient_id, coalesce(project_id, '00000000-0000-0000-0000-000000000000'::uuid)
  )
  where status = 'pending';

create index if not exists partnership_requests_recipient_idx
  on public.partnership_requests (recipient_id, created_at desc);
create index if not exists partnership_requests_sender_idx
  on public.partnership_requests (sender_id, created_at desc);

alter table public.partnership_requests enable row level security;

-- Unlike the public tables above, requests are private to the two parties.
drop policy if exists "Participants can view their requests" on public.partnership_requests;
create policy "Participants can view their requests"
  on public.partnership_requests for select
  using (auth.uid() = sender_id or auth.uid() = recipient_id);

drop policy if exists "Users can send requests as themselves" on public.partnership_requests;
create policy "Users can send requests as themselves"
  on public.partnership_requests for insert
  with check (auth.uid() = sender_id);

-- Recipient accepts/declines; sender may withdraw by updating their own row.
drop policy if exists "Participants can update their requests" on public.partnership_requests;
create policy "Participants can update their requests"
  on public.partnership_requests for update
  using (auth.uid() = recipient_id or auth.uid() = sender_id);

drop trigger if exists on_partnership_requests_updated on public.partnership_requests;
create trigger on_partnership_requests_updated
  before update on public.partnership_requests
  for each row execute procedure public.handle_updated_at();
