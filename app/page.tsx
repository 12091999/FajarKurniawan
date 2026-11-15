"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { MediaDropZone } from "@/components/media-drop-zone"

export default function Portfolio() {
  const contactEmail = "muhammadfajar12091999@gmail.com"

  const handleContactSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const name = String(formData.get("name") ?? "").trim()
    const senderEmail = String(formData.get("email") ?? "").trim()
    const message = String(formData.get("message") ?? "").trim()
    const subject = "Permintaan jasa dari " + name
    const body = "Nama: " + name + "\nEmail: " + senderEmail + "\n\nDetail proyek:\n" + message
    const composeUrl = new URL("https://mail.google.com/mail/")

    composeUrl.searchParams.set("view", "cm")
    composeUrl.searchParams.set("fs", "1")
    composeUrl.searchParams.set("to", contactEmail)
    composeUrl.searchParams.set("su", subject)
    composeUrl.searchParams.set("body", body)

    window.location.href = composeUrl.toString()
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between border-b border-border px-5 py-5 md:px-8">
        <a href="#top" className="font-semibold tracking-tight text-foreground">Fajar Kurniawan</a>
        <nav aria-label="Navigasi utama" className="flex items-center gap-6 text-sm text-muted-foreground">
          <a className="transition-colors hover:text-foreground" href="#projects">Proyek</a>
          <a className="transition-colors hover:text-foreground" href="#contact">Kontak</a>
        </nav>
      </header>

      <main id="top" className="mx-auto max-w-6xl px-5 md:px-8">
        <section className="flex min-h-[68vh] flex-col justify-center py-20 md:py-28">
          <p className="mb-5 text-sm font-medium uppercase tracking-[0.16em] text-primary">Portofolio · Web developer</p>
          <h1 className="max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Halo, saya Fajar.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">
            Dari website tour guide sampai wedding organizer, saya membuat proyek dengan kebutuhan yang berbeda-beda. Di sini saya kumpulkan beberapa hasil kerja yang bisa kamu lihat langsung.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-5">
            <a href="#projects" className="inline-flex items-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              Lihat proyek <span aria-hidden="true" className="ml-2">↓</span>
            </a>
            <a href="#contact" className="text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-primary">
              Hubungi saya
            </a>
          </div>
        </section>

        <section id="projects" className="scroll-mt-8 border-t border-border py-16 md:py-20">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.14em] text-primary">Pilihan karya</p>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">Proyek yang pernah saya kerjakan</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">Pilih gambar untuk melihat website secara langsung.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <MediaDropZone type="mixed" title="Tour Guide" description="Website" url="https://tour-guide-rust.vercel.app/id" imageUrl="/Screenshot%20(16).png" />
            <MediaDropZone type="mixed" title="Wedding Organizer" description="Website" url="https://wedding-organizer-three.vercel.app/" imageUrl="/content-2.png" />
            <MediaDropZone type="mixed" title="Personal Resume" description="Website" url="https://personal-resume-hazel.vercel.app/" imageUrl="/Screenshot%20(18).png" />
            <MediaDropZone type="mixed" title="Portfolio Design" description="Website" url="https://portfolio-sage-psi-32qh3imykm.vercel.app/" imageUrl="/content-4.png" />
          </div>
        </section>

        <section id="contact" className="scroll-mt-8 border-t border-border py-16 md:py-20">
          <div className="mx-auto max-w-2xl">
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.14em] text-primary">Kontak</p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Ada proyek yang ingin dibahas?</h2>
            <p className="mt-4 max-w-xl leading-7 text-muted-foreground">Ceritakan sedikit tentang kebutuhanmu. Saya akan membalas lewat email.</p>

            <Card className="mt-8 border-border bg-card p-6 shadow-sm sm:p-8">
              <form className="space-y-5" onSubmit={handleContactSubmit}>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-foreground">
                    Nama
                    <Input name="name" placeholder="Nama kamu" autoComplete="name" required className="mt-2 border-border bg-background text-foreground placeholder:text-muted-foreground" />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-foreground">
                    Email
                    <Input type="email" name="email" placeholder="nama@email.com" autoComplete="email" required className="mt-2 border-border bg-background text-foreground placeholder:text-muted-foreground" />
                  </label>
                </div>

                <label className="block space-y-2 text-sm font-medium text-foreground">
                  Cerita tentang proyekmu
                  <Textarea name="message" placeholder="Apa yang ingin kamu buat?" rows={5} required className="mt-2 resize-y border-border bg-background text-foreground placeholder:text-muted-foreground" />
                </label>

                <Button type="submit" className="rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary/90">
                  Kirim lewat Gmail
                </Button>
              </form>
            </Card>
          </div>
        </section>

        <footer className="flex flex-col gap-4 border-t border-border py-7 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Fajar Kurniawan</p>
          <div className="flex gap-5">
            <a className="transition-colors hover:text-foreground" href="https://www.linkedin.com/in/fajar-kurniawan-477472443/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a className="transition-colors hover:text-foreground" href="https://www.instagram.com/fajr6_66/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a className="transition-colors hover:text-foreground" href="https://www.tiktok.com/@_fajr666_?lang=en" target="_blank" rel="noopener noreferrer">TikTok</a>
          </div>
        </footer>
      </main>
    </div>
  )
}
