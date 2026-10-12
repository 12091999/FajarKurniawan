"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import InterstellarNebula from "@/components/interstellar-nebula"
import { ParticleField } from "@/components/particle-field"
import { MediaDropZone } from "@/components/media-drop-zone"

export default function Portfolio() {
  const [isVisible, setIsVisible] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <InterstellarNebula />
      <ParticleField />

      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen flex flex-col items-center justify-center relative z-10 px-4">
        <div className="text-center space-y-4">
          <h1
            className={`text-6xl md:text-8xl font-bold text-white transition-all duration-1000 border-0 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Fajar Kurniawan
          </h1>
          <p
            className={`text-xl md:text-2xl text-gray-300 transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            The Creator
          </p>

          <div
            className={`flex items-center justify-center gap-6 mt-8 transition-all duration-1000 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
           <a href="https://wa.me/6281234567890" className="text-white hover:text-primary transition-colors">
              <svg
                  className="w-6 h-6 text-white"
                  viewBox="0 0 48 48"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M24,2.5A21.52,21.52,0,0,0,5.15,34.36L2.5,45.5l11.14-2.65A21.5,21.5,0,1,0,24,2.5ZM13.25,12.27h5.86a1,1,0,0,1,1,1,10.4,10.4,0,0,0,.66,3.91,1.93,1.93,0,0,1-.66,2.44l-2.05,2a18.6,18.6,0,0,0,3.52,4.79A18.6,18.6,0,0,0,26.35,30l2-2.05c1-1,1.46-1,2.44-.66a10.4,10.4,0,0,0,3.91.66,1.05,1.05,0,0,1,1,1v5.86a1.05,1.05,0,0,1-1,1,23.68,23.68,0,0,1-15.64-6.84,23.6,23.6,0,0,1-6.84-15.64A1.07,1.07,0,0,1,13.25,12.27Z" />
                </svg>
            </a>
                <a
              href="https://www.tiktok.com/@_fajr666_?lang=en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-primary transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.332V2h-4.05v13.67a2.896 2.896 0 0 1-2.9 2.765 2.896 2.896 0 0 1-2.9-2.9 2.896 2.896 0 0 1 2.9-2.9c.302 0 .592.047.866.133V8.63a6.96 6.96 0 0 0-.866-.055A6.96 6.96 0 0 0 1.91 15.53a6.96 6.96 0 0 0 6.96 6.96 6.96 6.96 0 0 0 6.96-6.96V8.56a8.77 8.77 0 0 0 5.13 1.65V6.16a4.82 4.82 0 0 1-1.371-.204Z" />
              </svg>
            </a>
              <a
                href="https://www.instagram.com/fajr6_66/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-primary transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.25-3.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" />
                </svg>
              </a>
            <a href="https://www.linkedin.com/in/fajar-kurniawan-477472443/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>

        <div
          className={`absolute bottom-8 transition-all duration-1000 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Button
            variant="ghost"
            onClick={() => scrollToSection(mediaRef)}
            className="text-white hover:text-primary animate-bounce"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </Button>
        </div>
      </section>

      <section ref={mediaRef} className="py-16 flex items-center justify-center relative z-10 px-4">
        <div className="max-w-4xl mx-auto w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8 fade-in-up">My Work</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MediaDropZone type="mixed" title="Content 1" description="Image or Video" />
            <MediaDropZone type="mixed" title="Content 2" description="Image or Video" />
            <MediaDropZone type="mixed" title="Content 3" description="Image or Video" />
            <MediaDropZone type="mixed" title="Content 4" description="Image or Video" />
          </div>
        </div>
      </section>

      <section ref={contactRef} className="py-16 flex items-center justify-center relative z-10 px-4">
        <div className="max-w-xl mx-auto w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8 fade-in-up">Contact Me</h2>

          <Card className="bg-card/80 backdrop-blur-sm border-border p-6 opacity-80">
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="Your name"
                    className="bg-input border-border text-white placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    className="bg-input border-border text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <Textarea
                  placeholder="Tell me about your project..."
                  rows={4}
                  className="bg-input border-border text-white placeholder:text-gray-400 resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground pulse-glow"
              >
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </section>
    </div>
  )
}
