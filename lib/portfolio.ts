export interface Profile {
  id: number
  full_name: string | null
  headline: string | null
  bio: string | null
  avatar_url: string | null
  location: string | null
  email: string | null
  website: string | null
  updated_at: string | null
}

export interface Project {
  id: string
  title: string
  slug: string | null
  description: string | null
  image_url: string | null
  project_url: string | null
  github_url: string | null
  tech_stack: string[] | null
  featured: boolean | null
  sort_order: number | null
  created_at: string | null
  updated_at: string | null
}

export interface Skill {
  id: string
  name: string
  category: string | null
  proficiency: number | null
  sort_order: number | null
  created_at: string | null
}

export interface Message {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  is_read: boolean | null
  created_at: string | null
}

export interface PortfolioData {
  profile: Profile | null
  projects: Project[]
  skills: Skill[]
}

export function getNextProjectSortOrder(
  projects: readonly Pick<Project, "sort_order">[],
) {
  return projects.reduce(
    (highest, project) => Math.max(highest, project.sort_order ?? -1),
    -1,
  ) + 1
}

export const fallbackProfile: Profile = {
  id: 1,
  full_name: "Fajar Kurniawan",
  headline: "Web developer",
  bio: "Saya membuat website untuk kebutuhan yang berbeda, dari tour guide sampai wedding organizer. Ini beberapa proyek yang bisa kamu lihat langsung.",
  avatar_url: null,
  location: null,
  email: "muhammadfajar12091999@gmail.com",
  website: null,
  updated_at: null,
}

export const fallbackProjects: Project[] = [
  {
    id: "tour-guide",
    title: "Tour Guide",
    slug: null,
    description: "01 · Website",
    image_url: "/Screenshot%20(16).png",
    project_url: "https://tour-guide-rust.vercel.app/id",
    github_url: null,
    tech_stack: [],
    featured: true,
    sort_order: 0,
    created_at: null,
    updated_at: null,
  },
  {
    id: "wedding-organizer",
    title: "Wedding Organizer",
    slug: null,
    description: "02 · Website",
    image_url: "/content-2.png",
    project_url: "https://wedding-organizer-three.vercel.app/",
    github_url: null,
    tech_stack: [],
    featured: false,
    sort_order: 1,
    created_at: null,
    updated_at: null,
  },
  {
    id: "personal-resume",
    title: "Personal Resume",
    slug: null,
    description: "03 · Website",
    image_url: "/Screenshot%20(18).png",
    project_url: "https://personal-resume-hazel.vercel.app/",
    github_url: null,
    tech_stack: [],
    featured: false,
    sort_order: 2,
    created_at: null,
    updated_at: null,
  },
  {
    id: "portfolio-design",
    title: "Portfolio Design",
    slug: null,
    description: "04 · Website",
    image_url: "/content-4.png",
    project_url: "https://portfolio-sage-psi-32qh3imykm.vercel.app/",
    github_url: null,
    tech_stack: [],
    featured: false,
    sort_order: 3,
    created_at: null,
    updated_at: null,
  },
]
