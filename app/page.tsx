import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { BarChart, BookOpen, Trophy } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const features = [
  {
    icon: BookOpen,
    title: "Comprehensive Study Material",
    description: "Access a vast library of AWS certification resources.",
  },
  {
    icon: BarChart,
    title: "Progress Tracking",
    description: "Monitor your learning journey with detailed analytics.",
  },
  {
    icon: Trophy,
    title: "Practice Exams",
    description: "Test your knowledge with realistic AWS certification exams.",
  },
]

const recentTests = [
  {
    id: 1,
    title: "AWS Solutions Architect - Core Services",
    questions: 50,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-25%20at%2012.28.10%20PM-1BkjxN5NPvC4xPs1t4B7PVXabFcoU1.png",
  },
  {
    id: 2,
    title: "AWS Solutions Architect - Security",
    questions: 50,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-25%20at%2012.28.10%20PM-1BkjxN5NPvC4xPs1t4B7PVXabFcoU1.png",
  },
  {
    id: 3,
    title: "AWS Solutions Architect - Networking",
    questions: 50,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-25%20at%2012.28.10%20PM-1BkjxN5NPvC4xPs1t4B7PVXabFcoU1.png",
  },
]

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-white">Welcome to AWS Cert Prep</h2>
        <p className="text-xl text-slate-400">Your journey to AWS certification starts here.</p>
        <div className="flex space-x-4">
          <Button asChild>
            <Link href="/practice">Start Practicing</Link>
          </Button>
          <Button variant="outline">Learn More</Button>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-2xl font-semibold text-white">Key Features</h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <feature.icon className="h-10 w-10 text-blue-500" />
              </CardHeader>
              <CardContent>
                <h4 className="text-lg font-semibold text-white">{feature.title}</h4>
                <p className="text-slate-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-2xl font-semibold text-white">Recent Practice Tests</h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recentTests.map((test) => (
            <Card key={test.id} className="group overflow-hidden border-slate-700 bg-slate-800/50">
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
                <h4 className="text-lg font-semibold text-white">{test.title}</h4>
                <p className="text-sm text-slate-400">{test.questions} questions</p>
              </CardContent>
              <CardFooter className="border-t border-slate-700 p-4">
                <Button asChild variant="secondary" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                  <Link href={`/practice/${test.id}`}>Start Test</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

