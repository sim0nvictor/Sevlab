export type ProjectStatus = "Building" | "Stuck" | "Launched";

export type Project = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  status: ProjectStatus;
  stuckOn: string;
  author: string;
  country: string;
  comments: number;
};

export type HelpPost = {
  id: number;
  title: string;
  description: string;
  replies: number;
  author: string;
  country: string;
  topic: string;
};

export type BuilderProfile = {
  id: number;
  name: string;
  role: string;
  country: string;
  skills: string[];
  goals: string;
  bio?: string;
  openToCollaborate?: boolean;
};

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

export const projectFeed: Project[] = [
  {
    id: 1,
    title: "CampusPay",
    description: "A lightweight tuition and dues tracker for university communities.",
    tags: ["Next.js", "TypeScript", "Supabase"],
    status: "Building",
    stuckOn: "I need a better way to model recurring student payment reminders.",
    author: "Ada N.",
    country: "Nigeria",
    comments: 18,
  },
  {
    id: 2,
    title: "FarmLink Voice",
    description: "Voice-based crop tips and weather alerts for rural farmers using low-end phones.",
    tags: ["Node.js", "Python", "Firebase"],
    status: "Stuck",
    stuckOn: "Audio compression is too heavy for weak connections in field tests.",
    author: "Kojo A.",
    country: "Ghana",
    comments: 9,
  },
  {
    id: 3,
    title: "Talanta CV",
    description: "An AI-assisted portfolio generator for junior developers.",
    tags: ["Next.js", "Tailwind", "TypeScript"],
    status: "Launched",
    stuckOn: "Looking for collaborators to improve onboarding and portfolio templates.",
    author: "Miriam K.",
    country: "Kenya",
    comments: 24,
  },
];

export const helpPosts: HelpPost[] = [
  {
    id: 1,
    title: "Why does my Supabase auth session disappear after refresh?",
    description: "I can log in correctly, but the session drops on page reload in production only.",
    replies: 14,
    author: "Sello M.",
    country: "South Africa",
    topic: "Auth",
  },
  {
    id: 2,
    title: "Best way to upload images on poor mobile networks?",
    description: "I need a simple retry-safe upload pattern for Android users with unstable data.",
    replies: 7,
    author: "Amina H.",
    country: "Uganda",
    topic: "Uploads",
  },
  {
    id: 3,
    title: "React Native list performance on cheap devices",
    description: "My marketplace feed lags badly with image cards and local search filtering.",
    replies: 21,
    author: "Jean P.",
    country: "Rwanda",
    topic: "Performance",
  },
];

export const builders: BuilderProfile[] = [
  {
    id: 1,
    name: "Tosin Alabi",
    role: "Frontend Builder",
    country: "Nigeria",
    skills: ["Next.js", "Tailwind", "TypeScript"],
    goals: "Ship more public side projects and mentor first-time builders.",
    bio: "Building developer tools for students and indie makers.",
    openToCollaborate: true,
  },
  {
    id: 2,
    name: "Aisha Kamau",
    role: "Mobile Developer",
    country: "Kenya",
    skills: ["React Native", "Firebase", "UI Design"],
    goals: "Find product-minded collaborators for education apps.",
    bio: "Focused on practical apps that work well on low bandwidth.",
    openToCollaborate: true,
  },
  {
    id: 3,
    name: "Yaw Mensah",
    role: "Full-Stack Builder",
    country: "Ghana",
    skills: ["Node.js", "Supabase", "Python"],
    goals: "Meet more backend-focused builders solving local problems.",
    bio: "I enjoy shipping APIs, bots, and small community products.",
    openToCollaborate: false,
  },
];

export const currentProfile: BuilderProfile = {
  id: 99,
  name: "Seun Adeyemi",
  role: "Product Engineer",
  country: "Nigeria",
  skills: ["Next.js", "TypeScript", "Supabase", "Tailwind"],
  goals: "Launch two community products and collaborate with stronger backend engineers.",
  bio: "Self-taught developer building useful tools for creators and student founders.",
  openToCollaborate: true,
};
