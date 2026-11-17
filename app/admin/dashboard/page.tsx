import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import type { Message, PortfolioData, Profile, Project, Skill } from "@/lib/portfolio"
import DashboardClient from "./dashboard-client"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/admin/login")
  }

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin")
  if (adminError || isAdmin !== true) {
    redirect("/admin/login?error=unauthorized")
  }

  const [profileResult, projectsResult, skillsResult, messagesResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", 1).maybeSingle(),
    supabase.from("projects").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false }),
    supabase.from("skills").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: true }),
    supabase.from("messages").select("*").order("created_at", { ascending: false }),
  ])
  const queryErrors = [profileResult.error, projectsResult.error, skillsResult.error, messagesResult.error]
    .filter((error) => error !== null)

  if (queryErrors.length > 0) {
    console.error("Admin dashboard data load failed:", queryErrors)
  }

  const initialData: PortfolioData & { messages: Message[] } = {
    profile: profileResult.data as Profile | null,
    projects: (projectsResult.data ?? []) as Project[],
    skills: (skillsResult.data ?? []) as Skill[],
    messages: (messagesResult.data ?? []) as Message[],
  }

  return (
    <DashboardClient
      initialData={initialData}
      adminEmail={user.email ?? "Admin"}
      loadError={queryErrors.length > 0}
    />
  )
}
