import type { ProjectStatus } from "@/lib/types";

/**
 * Static option lists only.
 *
 * All people, projects and questions now come from Supabase via
 * `src/lib/queries.ts`. There is deliberately no mock/demo data in this file.
 */

export type {
  BuilderProfile,
  HelpPost,
  HelpReply,
  PartnershipRequest,
  PartnershipStatus,
  Project,
  ProjectComment,
  ProjectStatus,
} from "@/lib/types";

export const toolOptions = [
  "Next.js",
  "React",
  "React Native",
  "Vue",
  "Svelte",
  "Flutter",
  "Swift",
  "Kotlin",
  "Node.js",
  "Django",
  "Laravel",
  "Rails",
  "Go",
  "Rust",
  "TypeScript",
  "Python",
  "Supabase",
  "Firebase",
  "PostgreSQL",
  "Tailwind",
  "Figma",
  "AI / LLMs",
];

/**
 * What kind of partner a builder or project is looking for.
 * Used for partnership matching in Discover.
 */
export const lookingForOptions = [
  "Frontend",
  "Backend",
  "Full-Stack",
  "Mobile",
  "Design / UI",
  "Product",
  "Data / ML",
  "DevOps",
  "Marketing / Growth",
  "Technical Writing",
  "Co-founder",
];

/** Topics for the help board. */
export const topicOptions = [
  "Auth",
  "Database",
  "Performance",
  "Deployment",
  "Payments",
  "Mobile",
  "Design",
  "Debugging",
  "Architecture",
  "Career",
  "Other",
];

/**
 * Sevlab is open to builders anywhere, so this list is global rather than
 * region-specific. "Other" keeps it usable for anyone not listed.
 */
export const countryOptions = [
  "Argentina",
  "Australia",
  "Bangladesh",
  "Brazil",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "Egypt",
  "Ethiopia",
  "France",
  "Germany",
  "Ghana",
  "India",
  "Indonesia",
  "Ireland",
  "Israel",
  "Italy",
  "Japan",
  "Kenya",
  "Malaysia",
  "Mexico",
  "Morocco",
  "Netherlands",
  "New Zealand",
  "Nigeria",
  "Pakistan",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Romania",
  "Rwanda",
  "Saudi Arabia",
  "Singapore",
  "South Africa",
  "South Korea",
  "Spain",
  "Sweden",
  "Switzerland",
  "Tanzania",
  "Thailand",
  "Turkey",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Vietnam",
  "Other",
];

export const statusOptions: ProjectStatus[] = ["Building", "Stuck", "Launched"];
