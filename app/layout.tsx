import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import RootLayout from "@/components/layout/root-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AWS Certification Prep",
  description: "Prepare for your AWS certification exams with interactive practice questions",
    generator: 'v0.dev'
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  )
}



import './globals.css'