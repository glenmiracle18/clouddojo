"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { useOnboarding } from "./OnboardingContext"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const goalOptions = [
  { id: "Learn AWS", label: "Learn AWS fundamentals" },
  { id: "Prepare for certification", label: "Prepare for AWS certification" },
  { id: "Improve cloud skills", label: "Improve existing cloud skills" },
  { id: "Career advancement", label: "Advance my career" },
  { id: "Team training", label: "Train my team on AWS" },
  { id: "Academic purposes", label: "Educational/Academic purposes" },
]

const certificationOptions = [
  { id: "AWS Solutions Architect", label: "AWS Solutions Architect", icon: "🏗️" },
  { id: "AWS Developer", label: "AWS Developer", icon: "👨‍💻" },
  { id: "AWS SysOps", label: "AWS SysOps Administrator", icon: "🛠️" },
  { id: "AWS DevOps Engineer", label: "AWS DevOps Engineer", icon: "⚙️" },
  { id: "AWS Security", label: "AWS Security Specialty", icon: "🔒" },
  { id: "AWS Database", label: "AWS Database Specialty", icon: "💾" },
  { id: "AWS Machine Learning", label: "AWS Machine Learning", icon: "🤖" },
]

export default function GoalsStep() {
  const { onboardingData, updateOnboardingData, goToNextStep, goToPreviousStep } = useOnboarding()
  const [selectedGoals, setSelectedGoals] = useState<string[]>(onboardingData.goals)
  const [selectedCerts, setSelectedCerts] = useState<string[]>(onboardingData.preferredCertifications)

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => {
      const newGoals = prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
      
      updateOnboardingData({ goals: newGoals })
      return newGoals
    })
  }

  const toggleCertification = (certId: string) => {
    setSelectedCerts(prev => {
      const newCerts = prev.includes(certId)
        ? prev.filter(id => id !== certId)
        : [...prev, certId]
      
      updateOnboardingData({ preferredCertifications: newCerts })
      return newCerts
    })
  }

  const handleContinue = () => {
    if (selectedGoals.length > 0) {
      goToNextStep()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">What do you need help with?</h1>
        <p className="text-muted-foreground mt-2">
          We're a full service agency with experts ready to help.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium">Select your goals (choose all that apply)</h2>
        <div className="grid grid-cols-1 gap-3">
          {goalOptions.map((option) => (
            <div
              key={option.id}
              className={cn(
                "relative flex items-center rounded-lg border p-4 cursor-pointer transition-colors",
                selectedGoals.includes(option.id)
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                  : "border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
              )}
              onClick={() => toggleGoal(option.id)}
            >
              <Checkbox
                id={`goal-${option.id}`}
                checked={selectedGoals.includes(option.id)}
                onCheckedChange={() => toggleGoal(option.id)}
                className="text-emerald-500 border-gray-300"
              />
              <Label htmlFor={`goal-${option.id}`} className="flex-1 ml-3 cursor-pointer">
                {option.label}
              </Label>
              {selectedGoals.includes(option.id) && (
                <Check className="h-4 w-4 text-emerald-500 absolute right-4" />
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedGoals.includes("Prepare for certification") && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Which AWS certifications interest you?</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {certificationOptions.map((cert) => (
              <div
                key={cert.id}
                className={cn(
                  "relative flex flex-col items-center justify-center rounded-lg border p-4 text-center cursor-pointer transition-colors h-24",
                  selectedCerts.includes(cert.id)
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                    : "border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
                )}
                onClick={() => toggleCertification(cert.id)}
              >
                <div className="text-2xl mb-1">{cert.icon}</div>
                <Label className="text-sm cursor-pointer">{cert.label}</Label>
                {selectedCerts.includes(cert.id) && (
                  <Check className="h-4 w-4 text-emerald-500 absolute top-2 right-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
        >
          Go back
        </Button>
        <Button 
          onClick={handleContinue}
          disabled={selectedGoals.length === 0}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Continue
        </Button>
      </div>
    </div>
  )
} 