"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, Book, BarChart2 } from "lucide-react"
import Image from "next/image"

const mockTest = {
  id: 1,
  title: "AWS Solutions Architect - Core Services",
  description: "Test your knowledge of core AWS services and architectures.",
  questions: 50,
  duration: 90,
  image:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-25%20at%2012.28.10%20PM-1BkjxN5NPvC4xPs1t4B7PVXabFcoU1.png",
  topics: ["EC2", "S3", "VPC", "RDS", "Lambda"],
  difficulty: "Intermediate",
}

export default function TestDetailPage({ params }: { params: { id: string } }) {
  const [progress, setProgress] = useState(30)

  return (
    <div className="space-y-6">
      <Card className="border-slate-700 bg-slate-800/50">
        <CardHeader className="p-0">
          <div className="relative aspect-[21/9] overflow-hidden rounded-t-lg">
            <Image src={mockTest.image || "/placeholder.svg"} alt={mockTest.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <img src="/aws-logo.png" alt="AWS Logo" className="h-12" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold text-white">{mockTest.title}</h1>
          <p className="mt-2 text-slate-400">{mockTest.description}</p>
          <div className="mt-4 flex space-x-4">
            <div className="flex items-center text-slate-400">
              <Book className="mr-2 h-5 w-5" />
              <span>{mockTest.questions} Questions</span>
            </div>
            <div className="flex items-center text-slate-400">
              <Clock className="mr-2 h-5 w-5" />
              <span>{mockTest.duration} Minutes</span>
            </div>
            <div className="flex items-center text-slate-400">
              <BarChart2 className="mr-2 h-5 w-5" />
              <span>{mockTest.difficulty}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t border-slate-700 p-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-slate-400">Progress:</span>
            <Progress value={progress} className="w-64" />
            <span className="text-sm font-medium text-slate-400">{progress}%</span>
          </div>
          <Button className="bg-blue-600 text-white hover:bg-blue-700">Continue Test</Button>
        </CardFooter>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="border-slate-700 bg-slate-800/50">
          <CardHeader>
            <h3 className="text-xl font-semibold text-white">Topics Covered</h3>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-2 text-slate-400">
              {mockTest.topics.map((topic, index) => (
                <li key={index}>{topic}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800/50">
          <CardHeader>
            <h3 className="text-xl font-semibold text-white">Test Information</h3>
          </CardHeader>
          <CardContent className="space-y-2 text-slate-400">
            <p>Difficulty: {mockTest.difficulty}</p>
            <p>Total Questions: {mockTest.questions}</p>
            <p>Time Limit: {mockTest.duration} minutes</p>
            <p>Passing Score: 70%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

