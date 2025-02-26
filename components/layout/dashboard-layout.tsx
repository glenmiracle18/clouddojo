"use client"

import type React from "react"

import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, BookOpen, Brain, ShoppingBag, User } from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar>
        <SidebarHeader>
          <h2 className="text-2xl font-bold text-blue-600 p-4">AWS Cert Prep</h2>
        </SidebarHeader>
        <SidebarContent>
          <nav className="space-y-2 p-2">
            <Link href="/dashboard" passHref legacyBehavior>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a>
                  <Home className="mr-2 h-4 w-4" /> Dashboard
                </a>
              </Button>
            </Link>
            <Link href="/quizzes" passHref legacyBehavior>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a>
                  <BookOpen className="mr-2 h-4 w-4" /> My Quizzes
                </a>
              </Button>
            </Link>
            <Link href="/practice" passHref legacyBehavior>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a>
                  <Brain className="mr-2 h-4 w-4" /> Practice
                </a>
              </Button>
            </Link>
            <Link href="/marketplace" passHref legacyBehavior>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a>
                  <ShoppingBag className="mr-2 h-4 w-4" /> Marketplace
                </a>
              </Button>
            </Link>
          </nav>
        </SidebarContent>
        <SidebarFooter>
          <Link href="/profile" passHref legacyBehavior>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a>
                <User className="mr-2 h-4 w-4" /> Profile
              </a>
            </Button>
          </Link>
        </SidebarFooter>
      </Sidebar>
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <SidebarTrigger />
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}

