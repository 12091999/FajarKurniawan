"use client"

import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react"
import { ArrowUpRight, ImagePlus, Mail, Pencil, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import {
  uploadPortfolioImage,
  removePortfolioImage,
  validatePortfolioImage,
} from "@/lib/storage"
import {
  getNextProjectSortOrder,
  type Message,
  type PortfolioData,
  type Profile,
  type Project,
  type Skill,
} from "@/lib/portfolio"
import LogoutButton from "./logout-button"

type DashboardTab = "profile" | "projects" | "skills" | "messages"
type Notice = { kind: "success" | "error"; text: string } | null

const emptyProfile: Profile = {
  id: 1,
  full_name: "",
  headline: "",
  bio: "",
  avatar_url: "",
  location: "",
  email: "",
  website: "",
  updated_at: null,
}

const emptyProject = (
  sortOrder = 0,
): Omit<Project, "id" | "created_at" | "updated_at"> => ({
  title: "",
  slug: "",
  description: "",
  image_url: "",
  project_url: "",
  github_url: "",
  tech_stack: [],
  featured: false,
  sort_order: sortOrder,
})

const emptySkill = (): Omit<Skill, "id" | "created_at"> => ({
  name: "",
  category: "",
  proficiency: null,
  sort_order: 0,
})

const inputClass =
  "mt-2 w-full rounded-lg border border-white/10 bg-[#12141d] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#b3a0ff]/70 focus:ring-2 focus:ring-[#b3a0ff]/20"
const labelClass = "block text-sm font-medium text-white/75"
const panelClass = "rounded-2xl border border-white/10 bg-[#1b1d2a] p-5 sm:p-7"

interface DashboardClientProps {
  initialData: PortfolioData & { messages: Message[] }
  adminEmail: string
  loadError: boolean
}

export default function DashboardClient({
  initialData,
  adminEmail,
  loadError,
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("profile")
  const [data, setData] = useState(initialData)
  const [notice, setNotice] = useState<Notice>(
    loadError
      ? { kind: "error", text: "Sebagian data gagal dimuat. Periksa koneksi Supabase dan policy tabel." }
      : null,
  )
  const [saving, setSaving] = useState(false)
  const [profileDraft, setProfileDraft] = useState<Profile>(
    initialData.profile ?? emptyProfile,
  )
  const [profileFile, setProfileFile] = useState<File | null>(null)
  const [profilePreviewUrl, setProfilePreviewUrl] = useState<string | null>(null)
  const [projectDraft, setProjectDraft] = useState(() =>
    emptyProject(getNextProjectSortOrder(initialData.projects)),
  )
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [projectFile, setProjectFile] = useState<File | null>(null)
  const [projectPreviewUrl, setProjectPreviewUrl] = useState<string | null>(null)
  const [skillDraft, setSkillDraft] = useState(emptySkill())
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  useEffect(() => {
    return () => {
      if (profilePreviewUrl) URL.revokeObjectURL(profilePreviewUrl)
      if (projectPreviewUrl) URL.revokeObjectURL(projectPreviewUrl)
    }
  }, [profilePreviewUrl, projectPreviewUrl])

  function reportError(action: string, error: unknown) {
    console.error(`${action} failed:`, error)
    setNotice({
      kind: "error",
      text: error instanceof Error ? error.message : "Terjadi kesalahan. Silakan coba kembali.",
    })
  }

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void,
    setPreviewUrl: (url: string | null) => void,
  ) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      validatePortfolioImage(file)
      setPreviewUrl(URL.createObjectURL(file))
      setFile(file)
      setNotice(null)
    } catch (error) {
      reportError("Image validation", error)
      event.target.value = ""
    }
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setNotice(null)
    let uploadedImage: { path: string; url: string } | null = null

    try {
      const supabase = getSupabaseBrowserClient()
      if (profileFile) {
        uploadedImage = await uploadPortfolioImage(supabase, profileFile, "profiles")
      }

      const nextProfile = {
        id: 1,
        full_name: profileDraft.full_name?.trim() || null,
        headline: profileDraft.headline?.trim() || null,
        bio: profileDraft.bio?.trim() || null,
        avatar_url: uploadedImage?.url || profileDraft.avatar_url?.trim() || null,
        location: profileDraft.location?.trim() || null,
        email: profileDraft.email?.trim() || null,
        website: profileDraft.website?.trim() || null,
        updated_at: new Date().toISOString(),
      }
      const { data: savedProfile, error } = await supabase
        .from("profiles")
        .upsert(nextProfile, { onConflict: "id" })
        .select("*")
        .single()

      if (error) {
        if (uploadedImage) {
          const { error: cleanupError } = await supabase.storage
            .from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "portfolio-media")
            .remove([uploadedImage.path])
          if (cleanupError) console.error("Could not clean up an unused profile image:", cleanupError)
        }
        throw error
      }

      const oldImage = data.profile?.avatar_url
      setData((current) => ({ ...current, profile: savedProfile as Profile }))
      setProfileDraft(savedProfile as Profile)
      setProfileFile(null)
      setProfilePreviewUrl(null)
      setNotice({ kind: "success", text: "Profil berhasil disimpan." })

      if (oldImage && oldImage !== (savedProfile as Profile).avatar_url) {
        await removePortfolioImage(supabase, oldImage)
      }
    } catch (error) {
      reportError("Saving profile", error)
    } finally {
      setSaving(false)
    }
  }

  async function deleteProfile() {
    if (!window.confirm("Hapus profil dari portfolio publik?")) return
    setSaving(true)
    setNotice(null)

    try {
      const supabase = getSupabaseBrowserClient()
      const imageUrl = data.profile?.avatar_url
      const { error } = await supabase.from("profiles").delete().eq("id", 1)
      if (error) throw error

      setData((current) => ({ ...current, profile: null }))
      setProfileDraft(emptyProfile)
      setProfileFile(null)
      setProfilePreviewUrl(null)
      setNotice({ kind: "success", text: "Profil berhasil dihapus." })
      if (imageUrl) await removePortfolioImage(supabase, imageUrl)
    } catch (error) {
      reportError("Deleting profile", error)
    } finally {
      setSaving(false)
    }
  }

  async function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!projectDraft.title.trim()) {
      setNotice({ kind: "error", text: "Judul project wajib diisi." })
      return
    }

    setSaving(true)
    setNotice(null)
    let uploadedImage: { path: string; url: string } | null = null

    try {
      const supabase = getSupabaseBrowserClient()
      if (projectFile) {
        uploadedImage = await uploadPortfolioImage(supabase, projectFile, "projects")
      }

      const payload = {
        ...projectDraft,
        title: projectDraft.title.trim(),
        slug: projectDraft.slug?.trim() || null,
        description: projectDraft.description?.trim() || null,
        image_url: uploadedImage?.url || projectDraft.image_url?.trim() || null,
        project_url: projectDraft.project_url?.trim() || null,
        github_url: projectDraft.github_url?.trim() || null,
        tech_stack: projectDraft.tech_stack ?? [],
        updated_at: new Date().toISOString(),
      }
      const result = editingProject
        ? await supabase.from("projects").update(payload).eq("id", editingProject.id).select("*").single()
        : await supabase.from("projects").insert(payload).select("*").single()

      if (result.error) {
        if (uploadedImage) {
          const { error: cleanupError } = await supabase.storage
            .from(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "portfolio-media")
            .remove([uploadedImage.path])
          if (cleanupError) console.error("Could not clean up an unused project image:", cleanupError)
        }
        throw result.error
      }

      const savedProject = result.data as Project
      const oldImage = editingProject?.image_url
      const nextProjects = editingProject
        ? data.projects.map((project) =>
            project.id === savedProject.id ? savedProject : project,
          )
        : [...data.projects, savedProject]
      setData((current) => ({
        ...current,
        projects: editingProject
          ? current.projects.map((project) =>
              project.id === savedProject.id ? savedProject : project,
            )
          : [...current.projects, savedProject],
      }))
      setEditingProject(null)
      setProjectDraft(emptyProject(getNextProjectSortOrder(nextProjects)))
      setProjectFile(null)
      setProjectPreviewUrl(null)
      setNotice({ kind: "success", text: editingProject ? "Project berhasil diperbarui." : "Project berhasil ditambahkan." })

      if (oldImage && oldImage !== savedProject.image_url) {
        await removePortfolioImage(supabase, oldImage)
      }
    } catch (error) {
      reportError("Saving project", error)
    } finally {
      setSaving(false)
    }
  }

  function editProject(project: Project) {
    setEditingProject(project)
    setProjectDraft({
      title: project.title,
      slug: project.slug,
      description: project.description,
      image_url: project.image_url,
      project_url: project.project_url,
      github_url: project.github_url,
      tech_stack: project.tech_stack ?? [],
      featured: project.featured ?? false,
      sort_order: project.sort_order ?? 0,
    })
    setProjectFile(null)
    setProjectPreviewUrl(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function deleteProject(project: Project) {
    if (!window.confirm(`Hapus project “${project.title}”?`)) return
    setSaving(true)
    setNotice(null)

    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase.from("projects").delete().eq("id", project.id)
      if (error) throw error

      setData((current) => ({
        ...current,
        projects: current.projects.filter((item) => item.id !== project.id),
      }))
      setNotice({ kind: "success", text: "Project berhasil dihapus." })
      if (project.image_url) await removePortfolioImage(supabase, project.image_url)
    } catch (error) {
      reportError("Deleting project", error)
    } finally {
      setSaving(false)
    }
  }

  async function saveSkill(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!skillDraft.name.trim()) {
      setNotice({ kind: "error", text: "Nama skill wajib diisi." })
      return
    }
    if (skillDraft.proficiency !== null && (skillDraft.proficiency < 0 || skillDraft.proficiency > 100)) {
      setNotice({ kind: "error", text: "Proficiency harus berada di antara 0 dan 100." })
      return
    }

    setSaving(true)
    setNotice(null)

    try {
      const supabase = getSupabaseBrowserClient()
      const payload = {
        name: skillDraft.name.trim(),
        category: skillDraft.category?.trim() || null,
        proficiency: skillDraft.proficiency,
        sort_order: skillDraft.sort_order ?? 0,
      }
      const result = editingSkill
        ? await supabase.from("skills").update(payload).eq("id", editingSkill.id).select("*").single()
        : await supabase.from("skills").insert(payload).select("*").single()

      if (result.error) throw result.error
      const savedSkill = result.data as Skill
      setData((current) => ({
        ...current,
        skills: editingSkill
          ? current.skills.map((skill) => skill.id === savedSkill.id ? savedSkill : skill)
          : [...current.skills, savedSkill],
      }))
      setEditingSkill(null)
      setSkillDraft(emptySkill())
      setNotice({ kind: "success", text: editingSkill ? "Skill berhasil diperbarui." : "Skill berhasil ditambahkan." })
    } catch (error) {
      reportError("Saving skill", error)
    } finally {
      setSaving(false)
    }
  }

  function editSkill(skill: Skill) {
    setEditingSkill(skill)
    setSkillDraft({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      sort_order: skill.sort_order ?? 0,
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function deleteSkill(skill: Skill) {
    if (!window.confirm(`Hapus skill “${skill.name}”?`)) return
    setSaving(true)
    setNotice(null)

    try {
      const { error } = await getSupabaseBrowserClient().from("skills").delete().eq("id", skill.id)
      if (error) throw error
      setData((current) => ({
        ...current,
        skills: current.skills.filter((item) => item.id !== skill.id),
      }))
      setNotice({ kind: "success", text: "Skill berhasil dihapus." })
    } catch (error) {
      reportError("Deleting skill", error)
    } finally {
      setSaving(false)
    }
  }

  async function toggleMessageRead(message: Message) {
    setSaving(true)
    setNotice(null)

    try {
      const { data: updatedMessage, error } = await getSupabaseBrowserClient()
        .from("messages")
        .update({ is_read: !(message.is_read ?? false) })
        .eq("id", message.id)
        .select("*")
        .single()
      if (error) throw error

      setData((current) => ({
        ...current,
        messages: current.messages.map((item) => item.id === message.id ? updatedMessage as Message : item),
      }))
      setSelectedMessage(updatedMessage as Message)
      setNotice({ kind: "success", text: "Status pesan diperbarui." })
    } catch (error) {
      reportError("Updating message status", error)
    } finally {
      setSaving(false)
    }
  }

  async function deleteMessage(message: Message) {
    if (!window.confirm("Hapus pesan ini secara permanen?")) return
    setSaving(true)
    setNotice(null)

    try {
      const { error } = await getSupabaseBrowserClient().from("messages").delete().eq("id", message.id)
      if (error) throw error
      setData((current) => ({
        ...current,
        messages: current.messages.filter((item) => item.id !== message.id),
      }))
      setSelectedMessage(null)
      setNotice({ kind: "success", text: "Pesan berhasil dihapus." })
    } catch (error) {
      reportError("Deleting message", error)
    } finally {
      setSaving(false)
    }
  }

  const tabs: { id: DashboardTab; label: string; count: number }[] = [
    { id: "profile", label: "Profil", count: data.profile ? 1 : 0 },
    { id: "projects", label: "Projects", count: data.projects.length },
    { id: "skills", label: "Skills", count: data.skills.length },
    { id: "messages", label: "Pesan", count: data.messages.length },
  ]

  return (
    <div className="min-h-screen bg-[#14151f] text-white">
      <header className="border-b border-white/10 bg-[#10111a]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 md:px-8">
          <div>
            <Link href="/" className="font-mono text-xs uppercase tracking-[0.18em] text-[#c6f36a]">FAJARKURNIAWAN</Link>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-white/50">{adminEmail} · akses administrator terverifikasi</p>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/75 transition hover:border-[#c6f36a]/60 hover:text-white">
            Lihat website <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">
        <div className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Profil" value={data.profile ? "Aktif" : "Belum diisi"} />
          <StatCard label="Projects" value={String(data.projects.length)} />
          <StatCard label="Skills" value={String(data.skills.length)} />
          <StatCard label="Pesan belum dibaca" value={String(data.messages.filter((message) => !message.is_read).length)} />
        </div>

        <nav aria-label="Bagian dashboard" className="mb-6 flex gap-2 overflow-x-auto border-b border-white/10 pb-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => { setActiveTab(tab.id); setNotice(null) }}
              aria-current={activeTab === tab.id ? "page" : undefined}
              className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${activeTab === tab.id ? "bg-[#c6f36a] font-semibold text-[#17191d]" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
            >
              {tab.label}<span className="ml-2 font-mono text-xs opacity-70">{tab.count}</span>
            </button>
          ))}
        </nav>

        {notice && (
          <p
            role={notice.kind === "error" ? "alert" : "status"}
            className={`mb-5 rounded-xl border p-4 text-sm ${notice.kind === "error" ? "border-red-400/20 bg-red-950/50 text-red-200" : "border-[#c6f36a]/20 bg-[#c6f36a]/10 text-[#d9f9a0]"}`}
          >
            {notice.text}
          </p>
        )}

        {activeTab === "profile" && (
          <form onSubmit={saveProfile} className={panelClass}>
            <SectionHeading title="Informasi pribadi" description="Profil publik portfolio. ID profil mengikuti record tunggal dengan ID 1." />
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <TextField label="Nama lengkap" value={profileDraft.full_name ?? ""} onChange={(value) => setProfileDraft({ ...profileDraft, full_name: value })} maxLength={120} />
              <TextField label="Headline" value={profileDraft.headline ?? ""} onChange={(value) => setProfileDraft({ ...profileDraft, headline: value })} maxLength={160} />
              <TextField label="Email kontak" type="email" value={profileDraft.email ?? ""} onChange={(value) => setProfileDraft({ ...profileDraft, email: value })} maxLength={254} />
              <TextField label="Lokasi" value={profileDraft.location ?? ""} onChange={(value) => setProfileDraft({ ...profileDraft, location: value })} maxLength={160} />
              <TextField label="Website" type="url" value={profileDraft.website ?? ""} onChange={(value) => setProfileDraft({ ...profileDraft, website: value })} maxLength={2048} />
              <ImageField label="Foto profil" currentUrl={profileDraft.avatar_url} previewUrl={profilePreviewUrl} file={profileFile} onFileChange={(event) => handleImageChange(event, setProfileFile, setProfilePreviewUrl)} onRemove={() => { setProfileFile(null); setProfilePreviewUrl(null); setProfileDraft({ ...profileDraft, avatar_url: "" }) }} />
              <div className="md:col-span-2">
                <TextField label="Bio" value={profileDraft.bio ?? ""} onChange={(value) => setProfileDraft({ ...profileDraft, bio: value })} multiline maxLength={2000} />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <PrimaryButton disabled={saving}>{saving ? "Menyimpan..." : "Simpan profil"}</PrimaryButton>
              {data.profile && <DangerButton onClick={deleteProfile} disabled={saving}>Hapus profil</DangerButton>}
            </div>
          </form>
        )}

        {activeTab === "projects" && (
          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <form onSubmit={saveProject} className={panelClass}>
              <SectionHeading title={editingProject ? "Edit project" : "Tambah project"} description="Kolom mengikuti skema projects: featured dan urutan digunakan, status/kategori tidak tersedia." />
              <div className="mt-6 grid gap-4">
                <TextField label="Judul *" value={projectDraft.title} onChange={(value) => setProjectDraft({ ...projectDraft, title: value })} required maxLength={180} />
                <TextField label="Slug" value={projectDraft.slug ?? ""} onChange={(value) => setProjectDraft({ ...projectDraft, slug: value })} maxLength={180} />
                <TextField label="Deskripsi" value={projectDraft.description ?? ""} onChange={(value) => setProjectDraft({ ...projectDraft, description: value })} multiline maxLength={5000} />
                <ImageField label="Gambar project" currentUrl={projectDraft.image_url} previewUrl={projectPreviewUrl} file={projectFile} onFileChange={(event) => handleImageChange(event, setProjectFile, setProjectPreviewUrl)} onRemove={() => { setProjectFile(null); setProjectPreviewUrl(null); setProjectDraft({ ...projectDraft, image_url: "" }) }} />
                <TextField label="URL project" type="url" value={projectDraft.project_url ?? ""} onChange={(value) => setProjectDraft({ ...projectDraft, project_url: value })} maxLength={2048} />
                <TextField label="URL GitHub" type="url" value={projectDraft.github_url ?? ""} onChange={(value) => setProjectDraft({ ...projectDraft, github_url: value })} maxLength={2048} />
                <TextField label="Teknologi (pisahkan dengan koma)" value={(projectDraft.tech_stack ?? []).join(", ")} onChange={(value) => setProjectDraft({ ...projectDraft, tech_stack: value.split(",").map((item) => item.trim()).filter(Boolean) })} maxLength={500} />
                <TextField label="Urutan tampil" type="number" value={String(projectDraft.sort_order ?? 0)} onChange={(value) => setProjectDraft({ ...projectDraft, sort_order: Number(value) || 0 })} min={0} step={1} />
                <label className="flex items-center gap-3 text-sm text-white/75">
                  <input type="checkbox" checked={projectDraft.featured ?? false} onChange={(event) => setProjectDraft({ ...projectDraft, featured: event.target.checked })} className="h-4 w-4 accent-[#c6f36a]" />
                  Tampilkan sebagai project pilihan
                </label>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <PrimaryButton disabled={saving}>{saving ? "Menyimpan..." : editingProject ? "Simpan perubahan" : "Tambah project"}</PrimaryButton>
                {editingProject && <SecondaryButton onClick={() => { setEditingProject(null); setProjectDraft(emptyProject(getNextProjectSortOrder(data.projects))); setProjectFile(null); setProjectPreviewUrl(null) }} disabled={saving}>Batal</SecondaryButton>}
              </div>
            </form>

            <section className="space-y-3" aria-label="Daftar project">
              {data.projects.length === 0 ? <EmptyState title="Belum ada project" description="Tambahkan project untuk menampilkannya di portfolio publik." /> : data.projects.map((project) => (
                <article key={project.id} className="flex gap-4 rounded-xl border border-white/10 bg-[#1b1d2a] p-4">
                  {project.image_url ? <Image src={project.image_url} alt="" width={96} height={80} unoptimized className="h-20 w-24 shrink-0 rounded-lg bg-[#12141d] object-cover" /> : <div className="grid h-20 w-24 shrink-0 place-items-center rounded-lg bg-[#12141d] text-white/30"><ImagePlus className="h-6 w-6" /></div>}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{project.title}</h3>
                      {project.featured && <span className="rounded-full bg-[#c6f36a]/15 px-2 py-0.5 text-[10px] font-medium text-[#c6f36a]">Pilihan</span>}
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-white/50">{project.description || (project.tech_stack ?? []).join(" · ") || "Tidak ada deskripsi."}</p>
                    <div className="mt-3 flex gap-2">
                      <IconButton label={`Edit ${project.title}`} onClick={() => editProject(project)}><Pencil className="h-4 w-4" /></IconButton>
                      <IconButton label={`Hapus ${project.title}`} onClick={() => deleteProject(project)} danger disabled={saving}><Trash2 className="h-4 w-4" /></IconButton>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </div>
        )}

        {activeTab === "skills" && (
          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <form onSubmit={saveSkill} className={panelClass}>
              <SectionHeading title={editingSkill ? "Edit skill" : "Tambah skill"} description="Skill dapat dikelompokkan dan menampilkan tingkat proficiency 0–100." />
              <div className="mt-6 grid gap-4">
                <TextField label="Nama skill *" value={skillDraft.name} onChange={(value) => setSkillDraft({ ...skillDraft, name: value })} required maxLength={120} />
                <TextField label="Kategori" value={skillDraft.category ?? ""} onChange={(value) => setSkillDraft({ ...skillDraft, category: value })} maxLength={120} />
                <TextField label="Proficiency (0–100)" type="number" value={skillDraft.proficiency === null ? "" : String(skillDraft.proficiency)} onChange={(value) => setSkillDraft({ ...skillDraft, proficiency: value === "" ? null : Number(value) })} min={0} max={100} step={1} />
                <TextField label="Urutan tampil" type="number" value={String(skillDraft.sort_order ?? 0)} onChange={(value) => setSkillDraft({ ...skillDraft, sort_order: Number(value) || 0 })} min={0} step={1} />
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <PrimaryButton disabled={saving}>{saving ? "Menyimpan..." : editingSkill ? "Simpan perubahan" : "Tambah skill"}</PrimaryButton>
                {editingSkill && <SecondaryButton onClick={() => { setEditingSkill(null); setSkillDraft(emptySkill()) }} disabled={saving}>Batal</SecondaryButton>}
              </div>
            </form>

            <section className="grid gap-3 sm:grid-cols-2" aria-label="Daftar skills">
              {data.skills.length === 0 ? <div className="sm:col-span-2"><EmptyState title="Belum ada skill" description="Skill yang ditambahkan akan muncul di portfolio publik." /></div> : data.skills.map((skill) => (
                <article key={skill.id} className="rounded-xl border border-white/10 bg-[#1b1d2a] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{skill.name}</h3>
                      {skill.category && <p className="mt-1 text-xs text-[#b3a0ff]">{skill.category}</p>}
                    </div>
                    <div className="flex gap-1">
                      <IconButton label={`Edit ${skill.name}`} onClick={() => editSkill(skill)}><Pencil className="h-4 w-4" /></IconButton>
                      <IconButton label={`Hapus ${skill.name}`} onClick={() => deleteSkill(skill)} danger disabled={saving}><Trash2 className="h-4 w-4" /></IconButton>
                    </div>
                  </div>
                  {skill.proficiency !== null && <div className="mt-4"><div className="mb-1 flex justify-between text-xs text-white/45"><span>Proficiency</span><span>{skill.proficiency}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#66d9e8]" style={{ width: `${Math.min(100, Math.max(0, skill.proficiency))}%` }} /></div></div>}
                </article>
              ))}
            </section>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <section className="space-y-3" aria-label="Daftar pesan">
              {data.messages.length === 0 ? <EmptyState title="Belum ada pesan" description="Pesan dari formulir kontak akan muncul di sini." /> : data.messages.map((message) => (
                <button key={message.id} type="button" onClick={() => setSelectedMessage(message)} className={`w-full rounded-xl border p-4 text-left transition ${selectedMessage?.id === message.id ? "border-[#b3a0ff]/60 bg-[#b3a0ff]/10" : "border-white/10 bg-[#1b1d2a] hover:border-white/20"}`}>
                  <span className="flex items-center justify-between gap-3">
                    <span className="truncate font-medium">{message.name}</span>
                    {!message.is_read && <span className="h-2 w-2 shrink-0 rounded-full bg-[#c6f36a]" aria-label="Belum dibaca" />}
                  </span>
                  <span className="mt-1 block truncate text-sm text-white/45">{message.subject || message.email}</span>
                  <span className="mt-2 block text-xs text-white/35">{formatDate(message.created_at)}</span>
                </button>
              ))}
            </section>

            {selectedMessage ? (
              <article className={panelClass}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#66d9e8]">Pesan masuk</p>
                    <h2 className="mt-2 text-xl font-semibold">{selectedMessage.subject || "Tanpa subjek"}</h2>
                    <p className="mt-1 text-sm text-white/55">{selectedMessage.name} · <a href={`mailto:${selectedMessage.email}`} className="text-[#66d9e8] hover:underline">{selectedMessage.email}</a></p>
                    <p className="mt-1 text-xs text-white/35">{formatDate(selectedMessage.created_at)}</p>
                  </div>
                  <Mail className="h-5 w-5 text-[#b3a0ff]" />
                </div>
                <p className="mt-6 whitespace-pre-wrap break-words rounded-xl bg-[#12141d] p-4 text-sm leading-7 text-white/75">{selectedMessage.message}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <SecondaryButton onClick={() => toggleMessageRead(selectedMessage)} disabled={saving}>{selectedMessage.is_read ? "Tandai belum dibaca" : "Tandai sudah dibaca"}</SecondaryButton>
                  <DangerButton onClick={() => deleteMessage(selectedMessage)} disabled={saving}>Hapus pesan</DangerButton>
                </div>
              </article>
            ) : <EmptyState title="Pilih pesan" description="Pilih pesan untuk melihat detail dan mengubah statusnya." />}
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <LogoutButton />
        </div>
      </main>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-white/10 bg-[#1b1d2a] p-4 sm:p-5"><p className="text-xs text-white/45">{label}</p><p className="mt-2 text-xl font-semibold">{value}</p></div>
}

function SectionHeading({ title, description }: { title: string; description: string }) {
  return <div><h2 className="text-xl font-semibold">{title}</h2><p className="mt-1 text-sm leading-6 text-white/45">{description}</p></div>
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  multiline = false,
  required = false,
  maxLength,
  min,
  max,
  step,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  multiline?: boolean
  required?: boolean
  maxLength?: number
  min?: number
  max?: number
  step?: number
}) {
  return <label className={labelClass}>{label}{multiline ? <textarea value={value} onChange={(event) => onChange(event.target.value)} required={required} maxLength={maxLength} rows={5} className={`${inputClass} resize-y`} /> : <input type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} maxLength={maxLength} min={min} max={max} step={step} className={inputClass} />}</label>
}

function ImageField({
  label,
  currentUrl,
  previewUrl,
  file,
  onFileChange,
  onRemove,
}: {
  label: string
  currentUrl: string | null
  previewUrl: string | null
  file: File | null
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  onRemove: () => void
}) {
  return (
    <div className={labelClass}>
      <span>{label}</span>
      <div className="mt-2 flex flex-wrap items-center gap-4">
        {(previewUrl || currentUrl) ? <Image src={previewUrl || currentUrl || ""} alt="Pratinjau gambar" width={112} height={80} unoptimized className="h-20 w-28 rounded-lg bg-[#12141d] object-cover" /> : <div className="grid h-20 w-28 place-items-center rounded-lg border border-dashed border-white/15 bg-[#12141d] text-white/30"><ImagePlus className="h-6 w-6" /></div>}
        <div className="flex flex-wrap items-center gap-2">
          <label className="cursor-pointer rounded-lg border border-white/15 px-3 py-2 text-xs text-white/75 transition hover:border-[#b3a0ff]/60">
            Pilih JPG, PNG, WebP
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onFileChange} className="sr-only" />
          </label>
          {(currentUrl || file) && <button type="button" onClick={onRemove} className="rounded-lg px-3 py-2 text-xs text-red-300 hover:bg-red-400/10">Hapus gambar</button>}
        </div>
      </div>
      <p className="mt-2 text-xs font-normal text-white/35">Maksimal 5 MB. Preview ditampilkan sebelum gambar diunggah saat disimpan.</p>
    </div>
  )
}

function PrimaryButton({ children, disabled }: { children: ReactNode; disabled?: boolean }) {
  return <button type="submit" disabled={disabled} className="rounded-full bg-[#c6f36a] px-5 py-2.5 text-sm font-semibold text-[#17191d] transition hover:bg-[#d4ff7d] disabled:cursor-not-allowed disabled:opacity-50">{children}</button>
}

function SecondaryButton({ children, onClick, disabled }: { children: ReactNode; onClick: () => void; disabled?: boolean }) {
  return <button type="button" onClick={onClick} disabled={disabled} className="rounded-full border border-white/15 px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/5 hover:text-white disabled:opacity-50">{children}</button>
}

function DangerButton({ children, onClick, disabled }: { children: ReactNode; onClick: () => void; disabled?: boolean }) {
  return <button type="button" onClick={onClick} disabled={disabled} className="rounded-full border border-red-400/25 px-4 py-2.5 text-sm text-red-300 transition hover:bg-red-400/10 disabled:opacity-50">{children}</button>
}

function IconButton({ children, label, onClick, danger = false, disabled = false }: { children: ReactNode; label: string; onClick: () => void; danger?: boolean; disabled?: boolean }) {
  return <button type="button" aria-label={label} title={label} onClick={onClick} disabled={disabled} className={`grid h-8 w-8 place-items-center rounded-lg transition disabled:opacity-40 ${danger ? "text-red-300 hover:bg-red-400/10" : "text-white/60 hover:bg-white/10 hover:text-white"}`}>{children}</button>
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="rounded-xl border border-dashed border-white/15 bg-[#1b1d2a]/70 p-8 text-center"><h2 className="font-medium">{title}</h2><p className="mt-2 text-sm text-white/45">{description}</p></div>
}

function formatDate(value: string | null) {
  if (!value) return "Tanggal tidak tersedia"
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
}

