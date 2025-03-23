"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

type CompanyType = "Tech Startup" | "Software Agency" | "Design Agency" | "Freelancer" | 
  "Solopreneur" | "eCommerce Business" | "Consulting Firm" | "VC Firm" | 
  "University" | "Tech Enterprise" | "Pre-Seed Startup" | "Legal Business" | string

type CompanySize = "1-10 people" | "11-50 people" | "51-200 people" | "201-500 people" | "500+ people" | string

type OnboardingGoal = "Learn AWS" | "Prepare for certification" | "Improve cloud skills" | 
  "Career advancement" | "Team training" | "Academic purposes" | string

type CertificationType = "AWS Solutions Architect" | "AWS Developer" | "AWS SysOps" | 
  "AWS DevOps Engineer" | "AWS Security" | "AWS Database" | "AWS Machine Learning" | string

type ExperienceLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert" | string

interface OnboardingData {
  companyType: CompanyType | null
  companySize: CompanySize | null
  goals: OnboardingGoal[]
  preferredCertifications: CertificationType[]
  experience: ExperienceLevel | null
}

interface OnboardingContextType {
  currentStep: number
  totalSteps: number
  onboardingData: OnboardingData
  setCurrentStep: (step: number) => void
  updateOnboardingData: (data: Partial<OnboardingData>) => void
  goToNextStep: () => void
  goToPreviousStep: () => void
}

const defaultOnboardingData: OnboardingData = {
  companyType: null,
  companySize: null,
  goals: [],
  preferredCertifications: [],
  experience: null
}

export const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4 // Total number of steps in the onboarding process
  
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(defaultOnboardingData)
  
  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }))
  }
  
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1)
    }
  }
  
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }
  
  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        totalSteps,
        onboardingData,
        setCurrentStep,
        updateOnboardingData,
        goToNextStep,
        goToPreviousStep
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
} 