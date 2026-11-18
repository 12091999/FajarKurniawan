"use client"

import { useEffect, useState, type FormEvent } from "react"
import { ArrowDown, ArrowUpRight, Mail } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { AdminSiteActions } from "@/components/admin-site-actions"
import { MediaDropZone } from "@/components/media-drop-zone"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import {
  fallbackProfile,
  fallbackProjects,
  type PortfolioData,
} from "@/lib/portfolio"

const initialPortfolio: PortfolioData = { profile: null, projects: [], skills: [] }

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState(initialPortfolio)
  const [loadingPortfolio, setLoadingPortfolio] = useState(true)
  const [portfolioError, setPortfolioError] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [contactStatus, setContactStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

  useEffect(() => {
    let active = true

    async function loadPortfolio() {
      try {
        const supabase = getSupabaseBrowserClient()
        const [profileResult, projectsResult, skillsResult] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", 1).maybeSingle(),
          supabase.from("projects").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false }),
          supabase.from("skills").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: true }),
        ])
        const queryError = profileResult.error || projectsResult.error || skillsResult.error

        if (queryError) throw queryError
        if (active) {
          setPortfolio({
            profile: profileResult.data,
            projects: projectsResult.data ?? [],
            skills: skillsResult.data ?? [],
          })
        }
      } catch (error) {
        console.error("Could not load public portfolio content:", error)
        if (active) setPortfolioError(true)
      } finally {
        if (active) setLoadingPortfolio(false)
      }
    }

    void loadPortfolio()
    return () => { active = false }
  }, [])

  async function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setContactStatus(null)

    const form = event.currentTarget
    const formData = new FormData(form)
    const name = String(formData.get("name") ?? "").trim()
    const senderEmail = String(formData.get("email") ?? "").trim()
    const subject = String(formData.get("subject") ?? "").trim()
    const message = String(formData.get("message") ?? "").trim()

    if (!name || !senderEmail || !message || name.length > 120 || senderEmail.length > 254 || subject.length > 200 || message.length > 5000) {
      setContactStatus({ type: "error", message: "Periksa kembali formulir. Batas pesan adalah 5.000 karakter." })
      return
    }

    setSendingMessage(true)
    try {
      const { error } = await getSupabaseBrowserClient()
        .from("messages")
        .insert({ name, email: senderEmail, subject: subject || null, message })

      if (error) throw error
      form.reset()
      setContactStatus({ type: "success", message: "Terima kasih! Pesan kamu sudah terkirim." })
    } catch (error) {
      console.error("Contact message could not be submitted:", error)
      setContactStatus({
        type: "error",
        message: "Pesan belum dapat dikirim. Silakan coba lagi atau kirim email langsung.",
      })
    } finally {
      setSendingMessage(false)
    }
  }

  const profile = portfolio.profile ?? fallbackProfile
  const displayName = profile.full_name?.trim() || fallbackProfile.full_name || "Fajar Kurniawan"
  const [firstName, ...remainingName] = displayName.split(/\s+/)
  const lastName = remainingName.join(" ")
  const contactEmail = profile.email?.trim() || fallbackProfile.email || ""
  const visibleProjects = portfolioError || loadingPortfolio ? fallbackProjects : portfolio.projects
  const featuredProject = visibleProjects.find((project) => project.featured) ?? visibleProjects[0] ?? fallbackProjects[0]
  const hasLoadedProjects = !loadingPortfolio && !portfolioError
  const hasSkillsSection = hasLoadedProjects || portfolio.skills.length > 0

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-28 flex-col items-center border-r border-white/10 bg-[#10111a] px-4 py-6 lg:flex">
        <a href="#top" aria-label={`${displayName} — beranda`} className="grid h-12 w-12 place-items-center rounded-2xl bg-[#c6f36a] font-display text-xl font-bold text-[#17191d] transition-transform hover:-rotate-6 hover:scale-105">
          FK
        </a>

        <nav aria-label="Navigasi utama" className="my-auto flex w-full flex-col gap-3">
          <a href="#top" className="rounded-xl px-3 py-3 text-xs text-white/55 transition-colors hover:bg-white/5 hover:text-[#c6f36a]">
            <span className="mb-1 block font-mono text-[10px] text-[#c6f36a]">01</span>Awal
          </a>
          <a href="#projects" className="rounded-xl px-3 py-3 text-xs text-white/55 transition-colors hover:bg-white/5 hover:text-[#ff8d76]">
            <span className="mb-1 block font-mono text-[10px] text-[#ff8d76]">02</span>Karya
          </a>
          {hasSkillsSection && <a href="#skills" className="rounded-xl px-3 py-3 text-xs text-white/55 transition-colors hover:bg-white/5 hover:text-[#66d9e8]">
            <span className="mb-1 block font-mono text-[10px] text-[#66d9e8]">03</span>Skill
          </a>}
          <a href="#contact" className="rounded-xl px-3 py-3 text-xs text-white/55 transition-colors hover:bg-white/5 hover:text-[#b3a0ff]">
            <span className="mb-1 block font-mono text-[10px] text-[#b3a0ff]">{hasSkillsSection ? "04" : "03"}</span>Kontak
          </a>
        </nav>

        <div className="flex flex-col items-center gap-4 text-[10px] font-medium uppercase tracking-[0.12em] text-white/45">
          <a className="transition-colors hover:text-[#b3a0ff]" href="https://www.linkedin.com/in/fajar-kurniawan-477472443/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a>
          <a className="transition-colors hover:text-[#ff8d76]" href="https://www.instagram.com/fajr6_66/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">ig</a>
          <a className="transition-colors hover:text-[#66d9e8]" href="https://www.tiktok.com/@_fajr666_?lang=en" target="_blank" rel="noopener noreferrer" aria-label="TikTok">tk</a>
        </div>
      </aside>

      <div className="lg:pl-28">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#14151f]/90 px-5 py-4 backdrop-blur-md lg:hidden">
          <a href="#top" className="font-display text-lg font-bold tracking-tight">{firstName}<span className="text-[#c6f36a]">.</span></a>
          <nav aria-label="Navigasi utama" className="flex items-center gap-5 text-sm text-white/70">
            <a className="transition-colors hover:text-[#c6f36a]" href="#projects">Karya</a>
            <a className="transition-colors hover:text-[#ff8d76]" href="#contact">Kontak</a>
          </nav>
        </header>

        {portfolioError && (
          <p role="status" className="border-b border-amber-300/15 bg-amber-950/30 px-5 py-3 text-center text-xs text-amber-100/80">
            Konten Supabase belum dapat dimuat; sementara ditampilkan konten portfolio yang sudah tersedia.
          </p>
        )}
        {loadingPortfolio && <p role="status" className="border-b border-white/10 px-5 py-2 text-center text-xs text-white/45">Memuat konten portfolio...</p>}

        <main id="top" className="mx-auto max-w-7xl px-5 md:px-10">
          <section className="relative grid min-h-[82vh] items-center gap-14 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
            <div className="relative z-10">
              <p className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-white/55">
                <span className="h-2 w-2 rounded-full bg-[#c6f36a] shadow-[0_0_14px_#c6f36a]" />
                {profile.headline || "Web developer"} <span className="text-white/25">/</span> Portofolio 2026
              </p>
              <h1 className="font-sans text-6xl font-bold leading-[0.92] tracking-[-0.06em] sm:text-7xl md:text-8xl xl:text-[7.5rem]">
                {firstName}
                <span className="mt-2 block font-display font-normal italic tracking-[-0.055em] text-[#b3a0ff]">{lastName}<span className="text-[#ff8d76]">.</span></span>
              </h1>
              {profile.avatar_url && <Image src={profile.avatar_url} alt={`Foto ${displayName}`} width={56} height={56} unoptimized className="mt-6 h-14 w-14 rounded-full border border-white/20 object-cover" />}
              <p className="mt-8 max-w-xl text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
                {profile.bio || fallbackProfile.bio}
              </p>
              {profile.location && <p className="mt-3 font-mono text-xs text-white/40">{profile.location}</p>}
              {profile.website && <a href={profile.website} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm text-[#66d9e8] transition hover:text-white">Website pribadi <ArrowUpRight className="h-3.5 w-3.5" /></a>}

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a href="#projects" className="group inline-flex items-center gap-3 rounded-full bg-[#c6f36a] px-6 py-3.5 text-sm font-semibold text-[#17191d] shadow-[0_8px_30px_rgba(198,243,106,0.12)] transition-all duration-200 hover:-translate-y-1 hover:bg-[#d4ff7d] hover:shadow-[0_12px_34px_rgba(198,243,106,0.24)] active:translate-y-0 motion-reduce:transition-none">
                  Lihat karya <ArrowDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-1" />
                </a>
                <a href="#contact" className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-medium text-white/80 transition-all duration-200 hover:-translate-y-1 hover:border-[#ff8d76]/70 hover:text-white active:translate-y-0 motion-reduce:transition-none">
                  Hubungi saya <ArrowUpRight className="h-4 w-4 text-[#ff8d76] transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
                <AdminSiteActions />
              </div>

              <div className="mt-12 flex items-center gap-3 text-xs text-white/45">
                <span className="h-px w-10 bg-[#66d9e8]" />
                Jelajahi proyek pilihan di bawah
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
              <div aria-hidden="true" className="absolute -right-3 top-8 h-28 w-28 rounded-full bg-[#b3a0ff]/20 blur-2xl sm:-right-7" />
              <div aria-hidden="true" className="absolute -bottom-5 -left-4 h-28 w-36 rotate-[-8deg] rounded-3xl bg-[#ff8d76] sm:-left-8" />
              <div className="absolute -right-2 -top-5 z-10 rotate-3 rounded-xl bg-[#66d9e8] px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#14151f] sm:-right-5">
                Project 01 · Live
              </div>
              <a href={featuredProject.project_url || undefined} target={featuredProject.project_url ? "_blank" : undefined} rel={featuredProject.project_url ? "noopener noreferrer" : undefined} className="group relative block rotate-[1.5deg] overflow-hidden rounded-2xl border border-white/15 bg-[#202231] p-2 shadow-2xl transition-transform duration-300 hover:rotate-0 motion-reduce:transition-none">
                <div className="relative aspect-[1.65/1] w-full overflow-hidden rounded-xl">
                  <Image src={featuredProject.image_url || "/placeholder.svg"} alt={`Screenshot proyek ${featuredProject.title}`} fill unoptimized sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.025]" />
                </div>
                <div className="flex items-center justify-between px-3 py-3 sm:px-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#66d9e8]">{(featuredProject.tech_stack ?? []).slice(0, 3).join(" · ") || "Website"}</p>
                    <p className="mt-1 text-sm font-semibold text-white">{featuredProject.title}</p>
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white transition-colors group-hover:border-[#c6f36a] group-hover:bg-[#c6f36a] group-hover:text-[#17191d]">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </a>
              <div className="absolute -bottom-10 right-2 rotate-[-4deg] rounded-lg bg-[#b3a0ff] px-3 py-2 font-display text-sm italic text-[#17191d] sm:right-0">
                built with care
              </div>
            </div>
          </section>

          <section id="projects" className="scroll-mt-24 border-t border-white/10 py-16 md:py-20">
            <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-2 font-mono text-xs uppercase tracking-[0.16em] text-[#ff8d76]">02 / Karya</p>
                <h2 className="font-display text-4xl italic tracking-tight sm:text-5xl">Yang pernah saya buat<span className="text-[#c6f36a]">.</span></h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-white/50">Pilih gambar untuk membuka website proyeknya.</p>
            </div>

            {hasLoadedProjects && visibleProjects.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-12 text-center">
                <p className="font-medium text-white/75">Belum ada project yang ditambahkan.</p>
                <p className="mt-2 text-sm text-white/45">Project yang dikelola melalui dashboard akan tampil di sini.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {visibleProjects.map((project, index) => (
                  <div key={project.id}>
                    <MediaDropZone
                      type="mixed"
                      accent={(["violet", "coral", "cyan", "lime"] as const)[index % 4]}
                      title={project.title}
                      description={(project.tech_stack ?? []).slice(0, 3).join(" · ") || `${String(index + 1).padStart(2, "0")} · Website`}
                      url={project.project_url || undefined}
                      imageUrl={project.image_url || "/placeholder.svg"}
                    />
                    {project.description && <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/55">{project.description}</p>}
                    {project.github_url && <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-white/45 transition hover:text-[#66d9e8]">Lihat source <ArrowUpRight className="h-3 w-3" /></a>}
                  </div>
                ))}
              </div>
            )}
          </section>

          {hasSkillsSection && (
            <section id="skills" className="scroll-mt-24 border-t border-white/10 py-16 md:py-20">
              <div className="mb-9">
                <p className="mb-2 font-mono text-xs uppercase tracking-[0.16em] text-[#66d9e8]">03 / Keahlian</p>
                <h2 className="font-display text-4xl italic tracking-tight sm:text-5xl">Teknologi yang saya gunakan<span className="text-[#c6f36a]">.</span></h2>
              </div>
              {portfolio.skills.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-10 text-center text-sm text-white/45">
                  Belum ada skill yang ditambahkan.
                </div>
              ) : <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {portfolio.skills.map((skill) => (
                  <article key={skill.id} className="rounded-xl border border-white/10 bg-[#1b1d2a] p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-medium">{skill.name}</h3>
                      {skill.proficiency !== null && <span className="font-mono text-xs text-[#66d9e8]">{skill.proficiency}%</span>}
                    </div>
                    {skill.category && <p className="mt-1 text-xs text-white/45">{skill.category}</p>}
                    {skill.proficiency !== null && <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#66d9e8]" style={{ width: `${Math.min(100, Math.max(0, skill.proficiency))}%` }} /></div>}
                  </article>
                ))}
              </div>}
            </section>
          )}

          <section id="contact" className="scroll-mt-24 border-t border-white/10 py-16 md:py-20">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-[#b3a0ff]">{hasSkillsSection ? "04" : "03"} / Kontak</p>
                <h2 className="max-w-md text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Ada ide yang ingin diwujudkan?</h2>
                <p className="mt-5 max-w-md leading-7 text-white/55">Ceritakan sedikit tentang proyekmu. Pesan akan tersimpan dan bisa dibaca melalui dashboard.</p>
                {contactEmail && <a href={`mailto:${contactEmail}`} className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#66d9e8] transition-colors hover:text-white">
                  <Mail className="h-4 w-4" /> Kirim email langsung
                </a>}
              </div>

              <Card className="border border-white/10 bg-[#1b1d2a] p-5 shadow-none sm:p-7">
                <form className="space-y-5" onSubmit={handleContactSubmit}>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <label className="space-y-2 text-sm font-medium text-white/80">
                      Nama
                      <Input name="name" placeholder="Nama kamu" autoComplete="name" required maxLength={120} className="mt-2 border-white/10 bg-[#12141d] text-white placeholder:text-white/35 focus-visible:ring-[#b3a0ff]" />
                    </label>
                    <label className="space-y-2 text-sm font-medium text-white/80">
                      Email
                      <Input type="email" name="email" placeholder="nama@email.com" autoComplete="email" required maxLength={254} className="mt-2 border-white/10 bg-[#12141d] text-white placeholder:text-white/35 focus-visible:ring-[#66d9e8]" />
                    </label>
                  </div>
                  <label className="block space-y-2 text-sm font-medium text-white/80">
                    Subjek (opsional)
                    <Input name="subject" placeholder="Topik pesan" maxLength={200} className="mt-2 border-white/10 bg-[#12141d] text-white placeholder:text-white/35 focus-visible:ring-[#b3a0ff]" />
                  </label>
                  <label className="block space-y-2 text-sm font-medium text-white/80">
                    Cerita tentang proyekmu
                    <Textarea name="message" placeholder="Apa yang ingin kamu buat?" rows={5} required maxLength={5000} className="mt-2 resize-y border-white/10 bg-[#12141d] text-white placeholder:text-white/35 focus-visible:ring-[#ff8d76]" />
                  </label>
                  {contactStatus && <p role={contactStatus.type === "error" ? "alert" : "status"} className={`rounded-lg px-4 py-3 text-sm ${contactStatus.type === "error" ? "bg-red-950 text-red-200" : "bg-emerald-950 text-emerald-200"}`}>{contactStatus.message}</p>}
                  <Button type="submit" disabled={sendingMessage} className="group rounded-full bg-[#ff8d76] px-5 font-semibold text-[#19151a] transition-all duration-200 hover:-translate-y-1 hover:bg-[#ffa18e] hover:shadow-[0_10px_30px_rgba(255,141,118,0.2)] active:translate-y-0 motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-60">
                    {sendingMessage ? "Mengirim..." : "Kirim pesan"} <ArrowUpRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Button>
                </form>
              </Card>
            </div>
          </section>

          <footer className="flex flex-col gap-4 border-t border-white/10 py-7 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} {displayName}</p>
            <p>Dibuat dengan rasa ingin tahu <span className="text-[#ff8d76]">♥</span></p>
          </footer>
        </main>
      </div>
    </div>
  )
}
