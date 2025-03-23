"use client"

import React, { ReactNode } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"

interface OnboardingLayoutProps {
  children: ReactNode
  currentStep: number
  totalSteps: number
  logo?: string
}

export default function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
  logo = "/clouddojo-logo.png", // Your app logo
}: OnboardingLayoutProps) {
  const progress = Math.round((currentStep / totalSteps) * 100)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="w-full py-6 px-8 flex justify-center">
        <div className="w-full max-w-screen-xl flex justify-between items-center">
          <Image 
            src={logo} 
            alt="Cloud Dojo Logo" 
            width={40} 
            height={40}
            className="rounded-md"
          />
          <div className="flex items-center space-x-2 w-1/3">
            <Progress value={progress} className="h-2" />
            <span className="text-sm text-muted-foreground">
              {currentStep}/{totalSteps}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8"
        >
          {children}
        </motion.div>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Cloud Dojo. All rights reserved.</p>
      </footer>
    </div>
  )
} 