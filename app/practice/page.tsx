"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal, MoreVertical } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import Image from "next/image"

const practiceTests = [
  {
    id: 1,
    title: "AWS Solutions Architect - Core Services",
    questions: 50,
    status: "Attend",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-25%20at%2012.28.10%20PM-1BkjxN5NPvC4xPs1t4B7PVXabFcoU1.png",
  },
  {
    id: 2,
    title: "AWS Solutions Architect - Security",
    questions: 50,
    status: "Attend",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-25%20at%2012.28.10%20PM-1BkjxN5NPvC4xPs1t4B7PVXabFcoU1.png",
  },
  {
    id: 3,
    title: "AWS Solutions Architect - Networking",
    questions: 50,
    status: "Attend",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-25%20at%2012.28.10%20PM-1BkjxN5NPvC4xPs1t4B7PVXabFcoU1.png",
  },
  {
    id: 4,
    title: "AWS Solutions Architect - Database",
    questions: 50,
    status: "Attend",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-25%20at%2012.28.10%20PM-1BkjxN5NPvC4xPs1t4B7PVXabFcoU1.png",
  },
  {
    id: 5,
    title: "AWS Solutions Architect - Storage",
    questions: 50,
    status: "Attend",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-25%20at%2012.28.10%20PM-1BkjxN5NPvC4xPs1t4B7PVXabFcoU1.png",
  },
  {
    id: 6,
    title: "AWS Solutions Architect - Compute",
    questions: 50,
    status: "Attend",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-25%20at%2012.28.10%20PM-1BkjxN5NPvC4xPs1t4B7PVXabFcoU1.png",
  },
]

export default function PracticePage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Practice Questions</h1>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            placeholder="Search Practice Questions"
            className="pl-9 text-slate-400 placeholder:text-slate-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="text-slate-400">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {practiceTests.map((test) => (
          <Card key={test.id} className="group overflow-hidden border-slate-800 bg-slate-900/50">
            <CardHeader className="p-0">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={test.image || "/placeholder.svg"}
                  alt={test.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <img src="/aws-logo.png" alt="AWS Logo" className="h-8" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{test.title}</h3>
                  <p className="text-sm text-slate-400">{test.questions} questions</p>
                </div>
                <Button variant="ghost" size="icon" className="text-slate-400">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
            <CardFooter className="border-t border-slate-800 p-4">
              <div className="flex w-full items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400">
                  {test.status}
                </span>
                <Button variant="secondary" className="bg-white/5 text-white hover:bg-white/10">
                  Start Practice
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

