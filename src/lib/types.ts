export type ProjectStatus = "Building" | "Stuck" | "Launched";
export type PartnershipStatus = "pending" | "accepted" | "declined";

export type BuilderProfile = {
  id: string;
  name: string;
  role: string;
  country: string | null;
  skills: string[];
  goals: string | null;
  bio: string | null;
  openToCollaborate: boolean;
  lookingFor: string[];
  timezone: string | null;
  websiteUrl: string | null;
  githubUrl: string | null;
  avatarUrl: string | null;
};

export type Project = {
  id: string;
  authorId: string;
  title: string;
  description: string;
  tags: string[];
  status: ProjectStatus;
  stuckOn: string | null;
  lookingFor: string[];
  repoUrl: string | null;
  liveUrl: string | null;
  createdAt: string;
  author: BuilderProfile | null;
  commentCount: number;
};

export type ProjectComment = {
  id: string;
  projectId: string;
  authorId: string;
  body: string;
  createdAt: string;
  author: BuilderProfile | null;
};

export type HelpPost = {
  id: string;
  authorId: string;
  title: string;
  description: string;
  topic: string | null;
  tags: string[];
  resolved: boolean;
  createdAt: string;
  author: BuilderProfile | null;
  replyCount: number;
};

export type HelpReply = {
  id: string;
  helpPostId: string;
  authorId: string;
  body: string;
  isAccepted: boolean;
  createdAt: string;
  author: BuilderProfile | null;
};

export type PartnershipRequest = {
  id: string;
  senderId: string;
  recipientId: string;
  projectId: string | null;
  message: string;
  status: PartnershipStatus;
  createdAt: string;
  sender: BuilderProfile | null;
  recipient: BuilderProfile | null;
};

/* -------------------------------------------------------------------------- */
/* Row mappers: snake_case from Postgres -> camelCase for the UI              */
/* -------------------------------------------------------------------------- */

type Row = Record<string, unknown>;

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function nullableStr(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function strArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

/**
 * PostgREST returns nested aggregates as either `[{ count: n }]` or `{ count: n }`
 * depending on the relationship, so normalize both shapes.
 */
function nestedCount(value: unknown): number {
  if (Array.isArray(value)) {
    const first = value[0] as Row | undefined;
    return typeof first?.count === "number" ? first.count : value.length;
  }
  if (value && typeof value === "object") {
    const count = (value as Row).count;
    if (typeof count === "number") return count;
  }
  return 0;
}

/** Nested to-one relations can come back as an object or a single-item array. */
function nestedOne(value: unknown): Row | null {
  if (Array.isArray(value)) return (value[0] as Row | undefined) ?? null;
  if (value && typeof value === "object") return value as Row;
  return null;
}

export function mapProfile(row: Row | null | undefined): BuilderProfile | null {
  if (!row) return null;
  return {
    id: str(row.id),
    name: str(row.name) || "Unnamed builder",
    role: str(row.role),
    country: nullableStr(row.country),
    skills: strArray(row.skills),
    goals: nullableStr(row.goals),
    bio: nullableStr(row.bio),
    openToCollaborate: row.open_to_collaborate !== false,
    lookingFor: strArray(row.looking_for),
    timezone: nullableStr(row.timezone),
    websiteUrl: nullableStr(row.website_url),
    githubUrl: nullableStr(row.github_url),
    avatarUrl: nullableStr(row.avatar_url),
  };
}

export function mapProject(row: Row): Project {
  const status = str(row.status);
  return {
    id: str(row.id),
    authorId: str(row.author_id),
    title: str(row.title),
    description: str(row.description),
    tags: strArray(row.tags),
    status: (status === "Stuck" || status === "Launched" ? status : "Building") as ProjectStatus,
    stuckOn: nullableStr(row.stuck_on),
    lookingFor: strArray(row.looking_for),
    repoUrl: nullableStr(row.repo_url),
    liveUrl: nullableStr(row.live_url),
    createdAt: str(row.created_at),
    author: mapProfile(nestedOne(row.author)),
    commentCount: nestedCount(row.project_comments),
  };
}

export function mapProjectComment(row: Row): ProjectComment {
  return {
    id: str(row.id),
    projectId: str(row.project_id),
    authorId: str(row.author_id),
    body: str(row.body),
    createdAt: str(row.created_at),
    author: mapProfile(nestedOne(row.author)),
  };
}

export function mapHelpPost(row: Row): HelpPost {
  return {
    id: str(row.id),
    authorId: str(row.author_id),
    title: str(row.title),
    description: str(row.description),
    topic: nullableStr(row.topic),
    tags: strArray(row.tags),
    resolved: row.resolved === true,
    createdAt: str(row.created_at),
    author: mapProfile(nestedOne(row.author)),
    replyCount: nestedCount(row.help_replies),
  };
}

export function mapHelpReply(row: Row): HelpReply {
  return {
    id: str(row.id),
    helpPostId: str(row.help_post_id),
    authorId: str(row.author_id),
    body: str(row.body),
    isAccepted: row.is_accepted === true,
    createdAt: str(row.created_at),
    author: mapProfile(nestedOne(row.author)),
  };
}

export function mapPartnershipRequest(row: Row): PartnershipRequest {
  const status = str(row.status);
  return {
    id: str(row.id),
    senderId: str(row.sender_id),
    recipientId: str(row.recipient_id),
    projectId: nullableStr(row.project_id),
    message: str(row.message),
    status: (status === "accepted" || status === "declined" ? status : "pending") as PartnershipStatus,
    createdAt: str(row.created_at),
    sender: mapProfile(nestedOne(row.sender)),
    recipient: mapProfile(nestedOne(row.recipient)),
  };
}
