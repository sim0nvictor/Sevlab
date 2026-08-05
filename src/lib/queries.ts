import { createClient } from "@/lib/supabase/server";
import {
  mapHelpPost,
  mapHelpReply,
  mapPartnershipRequest,
  mapProfile,
  mapProject,
  mapProjectComment,
  type BuilderProfile,
  type HelpPost,
  type HelpReply,
  type PartnershipRequest,
  type Project,
  type ProjectComment,
} from "@/lib/types";

const PROFILE_FIELDS =
  "id, name, role, country, skills, goals, bio, open_to_collaborate, looking_for, timezone, website_url, github_url";

/** The signed-in auth user, or null. Never throws. */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** The signed-in user's profile row, or null when logged out. */
export async function getCurrentProfile(): Promise<BuilderProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select(PROFILE_FIELDS)
    .eq("id", user.id)
    .maybeSingle();

  return mapProfile(data ?? undefined);
}

export type ProjectFilters = {
  tool?: string;
  country?: string;
  status?: string;
  authorId?: string;
};

export async function getProjects(filters: ProjectFilters = {}): Promise<Project[]> {
  const supabase = await createClient();

  let query = supabase
    .from("projects")
    .select(
      `*, author:profiles!projects_author_id_fkey(${PROFILE_FIELDS}), project_comments(count)`,
    )
    .order("created_at", { ascending: false })
    .limit(50);

  if (filters.tool) query = query.contains("tags", [filters.tool]);
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.authorId) query = query.eq("author_id", filters.authorId);

  const { data, error } = await query;
  if (error || !data) return [];

  const projects = data.map(mapProject);

  // Country lives on the author profile, so filter after the join.
  if (filters.country) {
    return projects.filter((project) => project.author?.country === filters.country);
  }
  return projects;
}

export async function getProject(id: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select(
      `*, author:profiles!projects_author_id_fkey(${PROFILE_FIELDS}), project_comments(count)`,
    )
    .eq("id", id)
    .maybeSingle();

  return data ? mapProject(data) : null;
}

export async function getProjectComments(projectId: string): Promise<ProjectComment[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("project_comments")
    .select(`*, author:profiles!project_comments_author_id_fkey(${PROFILE_FIELDS})`)
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  return (data ?? []).map(mapProjectComment);
}

export type HelpFilters = {
  topic?: string;
  unresolvedOnly?: boolean;
  search?: string;
};

export async function getHelpPosts(filters: HelpFilters = {}): Promise<HelpPost[]> {
  const supabase = await createClient();

  let query = supabase
    .from("help_posts")
    .select(
      `*, author:profiles!help_posts_author_id_fkey(${PROFILE_FIELDS}), help_replies(count)`,
    )
    .order("created_at", { ascending: false })
    .limit(50);

  if (filters.topic) query = query.eq("topic", filters.topic);
  if (filters.unresolvedOnly) query = query.eq("resolved", false);
  if (filters.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`,
    );
  }

  const { data } = await query;
  return (data ?? []).map(mapHelpPost);
}

export async function getHelpPost(id: string): Promise<HelpPost | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("help_posts")
    .select(
      `*, author:profiles!help_posts_author_id_fkey(${PROFILE_FIELDS}), help_replies(count)`,
    )
    .eq("id", id)
    .maybeSingle();

  return data ? mapHelpPost(data) : null;
}

export async function getHelpReplies(helpPostId: string): Promise<HelpReply[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("help_replies")
    .select(`*, author:profiles!help_replies_author_id_fkey(${PROFILE_FIELDS})`)
    .eq("help_post_id", helpPostId)
    .order("is_accepted", { ascending: false })
    .order("created_at", { ascending: true });

  return (data ?? []).map(mapHelpReply);
}

export type BuilderFilters = {
  search?: string;
  skill?: string;
  country?: string;
  openOnly?: boolean;
};

export async function getBuilders(filters: BuilderFilters = {}): Promise<BuilderProfile[]> {
  const supabase = await createClient();

  let query = supabase
    .from("profiles")
    .select(PROFILE_FIELDS)
    .order("created_at", { ascending: false })
    .limit(60);

  if (filters.skill) query = query.contains("skills", [filters.skill]);
  if (filters.country) query = query.eq("country", filters.country);
  if (filters.openOnly) query = query.eq("open_to_collaborate", true);
  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,role.ilike.%${filters.search}%,bio.ilike.%${filters.search}%`,
    );
  }

  const { data } = await query;
  return (data ?? [])
    .map((row) => mapProfile(row))
    .filter((profile): profile is BuilderProfile => profile !== null);
}

export async function getBuilder(id: string): Promise<BuilderProfile | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select(PROFILE_FIELDS)
    .eq("id", id)
    .maybeSingle();

  return mapProfile(data ?? undefined);
}

/** Partnership requests where the current user is sender or recipient. */
export async function getPartnershipRequests(): Promise<{
  incoming: PartnershipRequest[];
  outgoing: PartnershipRequest[];
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { incoming: [], outgoing: [] };

  const { data } = await supabase
    .from("partnership_requests")
    .select(
      `*, sender:profiles!partnership_requests_sender_id_fkey(${PROFILE_FIELDS}), recipient:profiles!partnership_requests_recipient_id_fkey(${PROFILE_FIELDS})`,
    )
    .order("created_at", { ascending: false });

  const requests = (data ?? []).map(mapPartnershipRequest);
  return {
    incoming: requests.filter((request) => request.recipientId === user.id),
    outgoing: requests.filter((request) => request.senderId === user.id),
  };
}

/** Lightweight community stats for dashboard cards. Real counts, no fakes. */
export async function getCommunityStats(): Promise<{
  projects: number;
  builders: number;
  openQuestions: number;
  partnerships: number;
}> {
  const supabase = await createClient();

  const [projects, builders, openQuestions, partnerships] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase
      .from("help_posts")
      .select("id", { count: "exact", head: true })
      .eq("resolved", false),
    supabase
      .from("partnership_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "accepted"),
  ]);

  return {
    projects: projects.count ?? 0,
    builders: builders.count ?? 0,
    openQuestions: openQuestions.count ?? 0,
    partnerships: partnerships.count ?? 0,
  };
}
