import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Fajar Kurniawan — Web Developer",
  description: "Portfolio dan proyek website Fajar Kurniawan.",
  verification: {
    google: "aQFRaHUn7DvHooJL3tm2h7ZQJK8oQA3TBY5QRpSL0SI",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
