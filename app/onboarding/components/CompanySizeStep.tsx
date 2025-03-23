"use client"

import { useState } from "react"
import { useOnboarding } from "./OnboardingContext"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"

const sizeOptions = [
  "1-10 people",
  "11-50 people",
  "51-200 people",
  "201-500 people",
  "500+ people",
]

export default function CompanySizeStep() {
  const { onboardingData, updateOnboardingData, goToNextStep, goToPreviousStep } = useOnboarding()
  const [companySize, setCompanySize] = useState<string | null>(onboardingData.companySize)
  
  // Map slider value to company size options
  const [sliderValue, setSliderValue] = useState(
    companySize ? sizeOptions.indexOf(companySize) : 0
  )

  const handleSliderChange = (value: number[]) => {
    const index = value[0]
    setSliderValue(index)
    const size = sizeOptions[index]
    setCompanySize(size)
    updateOnboardingData({ companySize: size })
  }

  const handleContinue = () => {
    if (companySize) {
      goToNextStep()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">How large is your company?</h1>
        <p className="text-muted-foreground mt-2">
          This helps us recommend the right resources for your team.
        </p>
      </div>

      <div className="space-y-8 py-4">
        <div className="text-center font-medium text-lg">
          {companySize || sizeOptions[sliderValue]}
        </div>
        
        <div className="px-4">
          <Slider
            defaultValue={[sliderValue]}
            max={sizeOptions.length - 1}
            step={1}
            onValueChange={handleSliderChange}
            className="py-4"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Small</span>
            <span>Medium</span>
            <span>Large</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
        >
          Go back
        </Button>
        <Button 
          onClick={handleContinue} 
          disabled={!companySize}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Continue
        </Button>
      </div>
    </div>
  )
} 