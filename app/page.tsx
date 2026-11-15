"use client"

import type React from "react"
import { ArrowDown, ArrowUpRight, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { MediaDropZone } from "@/components/media-drop-zone"

const contactEmail = "muhammadfajar12091999@gmail.com"

export default function Portfolio() {
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
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-28 flex-col items-center border-r border-white/10 bg-[#10111a] px-4 py-6 lg:flex">
        <a href="#top" aria-label="Fajar Kurniawan — beranda" className="grid h-12 w-12 place-items-center rounded-2xl bg-[#c6f36a] font-display text-xl font-bold text-[#17191d] transition-transform hover:-rotate-6 hover:scale-105">
          FK
        </a>

        <nav aria-label="Navigasi utama" className="my-auto flex w-full flex-col gap-3">
          <a href="#top" className="rounded-xl px-3 py-3 text-xs text-white/55 transition-colors hover:bg-white/5 hover:text-[#c6f36a]">
            <span className="mb-1 block font-mono text-[10px] text-[#c6f36a]">01</span>Awal
          </a>
          <a href="#projects" className="rounded-xl px-3 py-3 text-xs text-white/55 transition-colors hover:bg-white/5 hover:text-[#ff8d76]">
            <span className="mb-1 block font-mono text-[10px] text-[#ff8d76]">02</span>Karya
          </a>
          <a href="#contact" className="rounded-xl px-3 py-3 text-xs text-white/55 transition-colors hover:bg-white/5 hover:text-[#b3a0ff]">
            <span className="mb-1 block font-mono text-[10px] text-[#b3a0ff]">03</span>Kontak
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
          <a href="#top" className="font-display text-lg font-bold tracking-tight">Fajar<span className="text-[#c6f36a]">.</span></a>
          <nav aria-label="Navigasi utama" className="flex items-center gap-5 text-sm text-white/70">
            <a className="transition-colors hover:text-[#c6f36a]" href="#projects">Karya</a>
            <a className="transition-colors hover:text-[#ff8d76]" href="#contact">Kontak</a>
          </nav>
        </header>

        <main id="top" className="mx-auto max-w-7xl px-5 md:px-10">
          <section className="relative grid min-h-[82vh] items-center gap-14 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
            <div className="relative z-10">
              <p className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-white/55">
                <span className="h-2 w-2 rounded-full bg-[#c6f36a] shadow-[0_0_14px_#c6f36a]" />
                Web developer <span className="text-white/25">/</span> Portofolio 2026
              </p>
              <h1 className="font-sans text-6xl font-bold leading-[0.92] tracking-[-0.06em] sm:text-7xl md:text-8xl xl:text-[7.5rem]">
                Fajar
                <span className="mt-2 block font-display font-normal italic tracking-[-0.055em] text-[#b3a0ff]">Kurniawan<span className="text-[#ff8d76]">.</span></span>
              </h1>
              <p className="mt-8 max-w-xl text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
                Saya membuat website untuk kebutuhan yang berbeda, dari tour guide sampai wedding organizer. Ini beberapa proyek yang bisa kamu lihat langsung.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a href="#projects" className="group inline-flex items-center gap-3 rounded-full bg-[#c6f36a] px-6 py-3.5 text-sm font-semibold text-[#17191d] shadow-[0_8px_30px_rgba(198,243,106,0.12)] transition-all duration-200 hover:-translate-y-1 hover:bg-[#d4ff7d] hover:shadow-[0_12px_34px_rgba(198,243,106,0.24)] active:translate-y-0 motion-reduce:transition-none">
                  Lihat karya <ArrowDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-1" />
                </a>
                <a href="#contact" className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-medium text-white/80 transition-all duration-200 hover:-translate-y-1 hover:border-[#ff8d76]/70 hover:text-white active:translate-y-0 motion-reduce:transition-none">
                  Hubungi saya <ArrowUpRight className="h-4 w-4 text-[#ff8d76] transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
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
              <a href="https://tour-guide-rust.vercel.app/id" target="_blank" rel="noopener noreferrer" className="group relative block rotate-[1.5deg] overflow-hidden rounded-2xl border border-white/15 bg-[#202231] p-2 shadow-2xl transition-transform duration-300 hover:rotate-0 motion-reduce:transition-none">
                <img src="/Screenshot%20(16).png" alt="Screenshot proyek Tour Guide" className="aspect-[1.65/1] w-full rounded-xl object-cover object-top transition-transform duration-500 group-hover:scale-[1.025]" />
                <div className="flex items-center justify-between px-3 py-3 sm:px-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#66d9e8]">Website · 2026</p>
                    <p className="mt-1 text-sm font-semibold text-white">Tour Guide</p>
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

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <MediaDropZone type="mixed" accent="violet" title="Tour Guide" description="01 · Website" url="https://tour-guide-rust.vercel.app/id" imageUrl="/Screenshot%20(16).png" />
              <MediaDropZone type="mixed" accent="coral" title="Wedding Organizer" description="02 · Website" url="https://wedding-organizer-three.vercel.app/" imageUrl="/content-2.png" />
              <MediaDropZone type="mixed" accent="cyan" title="Personal Resume" description="03 · Website" url="https://personal-resume-hazel.vercel.app/" imageUrl="/Screenshot%20(18).png" />
              <MediaDropZone type="mixed" accent="lime" title="Portfolio Design" description="04 · Website" url="https://portfolio-sage-psi-32qh3imykm.vercel.app/" imageUrl="/content-4.png" />
            </div>
          </section>

          <section id="contact" className="scroll-mt-24 border-t border-white/10 py-16 md:py-20">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-[#b3a0ff]">03 / Kontak</p>
                <h2 className="max-w-md text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Ada ide yang ingin diwujudkan?</h2>
                <p className="mt-5 max-w-md leading-7 text-white/55">Ceritakan sedikit tentang proyekmu. Pesan akan disiapkan di Gmail agar kamu tinggal mengirimnya.</p>
                <a href="mailto:muhammadfajar12091999@gmail.com" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#66d9e8] transition-colors hover:text-white">
                  <Mail className="h-4 w-4" /> Kirim email langsung
                </a>
              </div>

              <Card className="border border-white/10 bg-[#1b1d2a] p-5 shadow-none sm:p-7">
                <form className="space-y-5" onSubmit={handleContactSubmit}>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <label className="space-y-2 text-sm font-medium text-white/80">
                      Nama
                      <Input name="name" placeholder="Nama kamu" autoComplete="name" required className="mt-2 border-white/10 bg-[#12141d] text-white placeholder:text-white/35 focus-visible:ring-[#b3a0ff]" />
                    </label>
                    <label className="space-y-2 text-sm font-medium text-white/80">
                      Email
                      <Input type="email" name="email" placeholder="nama@email.com" autoComplete="email" required className="mt-2 border-white/10 bg-[#12141d] text-white placeholder:text-white/35 focus-visible:ring-[#66d9e8]" />
                    </label>
                  </div>
                  <label className="block space-y-2 text-sm font-medium text-white/80">
                    Cerita tentang proyekmu
                    <Textarea name="message" placeholder="Apa yang ingin kamu buat?" rows={5} required className="mt-2 resize-y border-white/10 bg-[#12141d] text-white placeholder:text-white/35 focus-visible:ring-[#ff8d76]" />
                  </label>
                  <Button type="submit" className="group rounded-full bg-[#ff8d76] px-5 font-semibold text-[#19151a] transition-all duration-200 hover:-translate-y-1 hover:bg-[#ffa18e] hover:shadow-[0_10px_30px_rgba(255,141,118,0.2)] active:translate-y-0 motion-reduce:transition-none">
                    Kirim lewat Gmail <ArrowUpRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Button>
                </form>
              </Card>
            </div>
          </section>

          <footer className="flex flex-col gap-4 border-t border-white/10 py-7 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Fajar Kurniawan</p>
            <p>Dibuat dengan rasa ingin tahu <span className="text-[#ff8d76]">♥</span></p>
          </footer>
        </main>
      </div>
    </div>
  )
}
