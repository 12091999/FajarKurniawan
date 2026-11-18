"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LayoutDashboard, LogIn, LogOut } from "lucide-react"
import type { Session } from "@supabase/supabase-js"
import { getSupabaseBrowserClient } from "@/lib/supabase"

type AdminAccess = "checking" | "admin" | "guest" | "error"

export function AdminSiteActions() {
  const router = useRouter()
  const [adminAccess, setAdminAccess] = useState<AdminAccess>("checking")
  const [loggingOut, setLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState("")

  useEffect(() => {
    let active = true
    let authEventVersion = 0
    let unsubscribe: (() => void) | undefined

    async function verifyAdminAccess(
      session: Session | null,
      version: number,
      supabase: ReturnType<typeof getSupabaseBrowserClient>,
    ) {
      try {
        if (!session) {
          if (active && version === authEventVersion) setAdminAccess("guest")
          return
        }

        const { data, error } = await supabase.rpc("is_admin")
        if (error) throw error
        if (active && version === authEventVersion) {
          setAdminAccess(data === true ? "admin" : "guest")
        }
      } catch (error) {
        console.error("Could not verify admin access on portfolio:", error)
        if (active && version === authEventVersion) setAdminAccess("error")
      }
    }

    void Promise.resolve()
      .then(async () => {
        const supabase = getSupabaseBrowserClient()
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
          const version = ++authEventVersion
          queueMicrotask(() => {
            void verifyAdminAccess(session, version, supabase)
          })
        })
        unsubscribe = () => data.subscription.unsubscribe()

        const { data: sessionData, error } = await supabase.auth.getSession()
        if (error) throw error
        if (authEventVersion === 0) {
          await verifyAdminAccess(sessionData.session, 0, supabase)
        }
      })
      .catch((error: unknown) => {
        console.error("Could not initialize portfolio admin controls:", error)
        authEventVersion += 1
        if (active) setAdminAccess("error")
      })

    return () => {
      active = false
      unsubscribe?.()
    }
  }, [])

  async function handleLogout() {
    setLoggingOut(true)
    setLogoutError("")

    try {
      const { error } = await getSupabaseBrowserClient().auth.signOut()
      if (error) throw error
      setAdminAccess("guest")
      router.replace("/")
      router.refresh()
    } catch (error) {
      console.error("Admin sign-out failed from portfolio:", error)
      setLogoutError(
        error instanceof Error ? error.message : "Logout gagal. Silakan coba kembali.",
      )
    } finally {
      setLoggingOut(false)
    }
  }

  if (adminAccess === "checking") {
    return <span aria-live="polite" className="sr-only">Memeriksa akses admin</span>
  }

  if (adminAccess !== "admin") {
    return (
      <div className="flex flex-col items-start gap-1">
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3.5 text-sm font-medium text-white/80 transition hover:-translate-y-1 hover:border-[#b3a0ff]/70 hover:text-white"
        >
          <LogIn className="h-4 w-4 text-[#b3a0ff]" />
          Login as Admin
        </Link>
        {adminAccess === "error" && (
          <span role="status" className="text-xs text-amber-200/80">
            Status admin tidak dapat diverifikasi.
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 rounded-full border border-[#c6f36a]/50 px-5 py-3.5 text-sm font-medium text-[#c6f36a] transition hover:-translate-y-1 hover:bg-[#c6f36a]/10"
      >
        <LayoutDashboard className="h-4 w-4" />
        Kembali ke Dashboard
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3.5 text-sm font-medium text-white/75 transition hover:-translate-y-1 hover:border-red-300/50 hover:text-red-200 disabled:cursor-wait disabled:opacity-50"
      >
        <LogOut className="h-4 w-4" />
        {loggingOut ? "Keluar..." : "Logout"}
      </button>
      {logoutError && (
        <span role="alert" className="w-full text-xs text-red-300">
          {logoutError}
        </span>
      )}
    </div>
  )
}
