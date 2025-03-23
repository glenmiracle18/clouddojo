"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useOnboarding } from "./OnboardingContext"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CompanyOption {
  id: string
  label: string
}

const companyOptions: CompanyOption[] = [
  { id: "Tech Startup", label: "Tech Startup" },
  { id: "Software Agency", label: "Software Agency" },
  { id: "Design Agency", label: "Design Agency" },
  { id: "Freelancer", label: "Freelancer" },
  { id: "Solopreneur", label: "Solopreneur" },
  { id: "eCommerce Business", label: "eCommerce Business" },
  { id: "Consulting Firm", label: "Consulting Firm" },
  { id: "VC Firm", label: "VC Firm" },
  { id: "University", label: "University" },
  { id: "Tech Enterprise", label: "Tech Enterprise" },
  { id: "Pre-Seed Startup", label: "Pre-Seed Startup" },
  { id: "Legal Business", label: "Legal Business" },
]

export default function CompanyTypeStep() {
  const { onboardingData, updateOnboardingData, goToNextStep } = useOnboarding()
  const [selectedType, setSelectedType] = useState<string | null>(onboardingData.companyType)

  const handleSelect = (type: string) => {
    setSelectedType(type)
    updateOnboardingData({ companyType: type })
  }

  const handleContinue = () => {
    if (selectedType) {
      goToNextStep()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Can you tell us about your company?</h1>
        <p className="text-muted-foreground mt-2">
          We've worked with small startups and Fortune 500 companies.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium">What kind of company are you?</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {companyOptions.map((option) => (
            <button
              key={option.id}
              className={cn(
                "py-3 px-4 rounded-lg border text-sm font-medium transition-colors",
                selectedType === option.id
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                  : "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
              )}
              onClick={() => handleSelect(option.id)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleContinue} 
          disabled={!selectedType}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Continue
        </Button>
      </div>
    </div>
  )
} 