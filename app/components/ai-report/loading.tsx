"use client"

import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Brain } from "lucide-react"
import Image from "next/image"

interface LoadingProps {
  progress: number
}

export default function AIAnalysisLoading({ progress }: LoadingProps) {
  return (
    <div className="bg-white flex my-28 flex-col items-center justify-center z-50 p-8">
      <div className="w-64 mb-8">
        <div className="relative">

          <div className="absolute inset-0 flex items-center justify-center animate-pulse">
          <Image src="/images/main-logo.png" alt="dojo-logo" className="w-42 h-42 my-8" width={260} height={260} />
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Analyzing Your AWS Test Results</h2>
      <p className="text-gray-600 mb-6">AI is doing it's magic with your performance data</p>
      <div className="w-80">
        <Progress value={progress} className="h-2" />
      </div>
      <div className="mt-4 text-sm text-gray-500 flex items-center">
        <Brain className="h-4 w-4 mr-1 text-emerald-500" />
        Generating personalized insights
      </div>

     
    </div>
  )
} 