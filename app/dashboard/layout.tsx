
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import type React from "react"
import { Inter } from "next/font/google"
import DashboardLayout from "@/components/layout/dashboard/dashboard-layout"

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
    <DashboardLayout>
        {children}
    </DashboardLayout>
  )
}



