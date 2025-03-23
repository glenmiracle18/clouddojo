import { Suspense } from "react"
import { notFound } from "next/navigation"
import { GetQuizById } from "@/app/(actions)/get-quiz"
import QuizComponent from "../components/QuizComponent"
import { QuizWithRelations } from "../types"
import QuizSkeleton from "../components/QuizSkeleton"

// Loading fallback
function QuizLoading() {
  return <QuizSkeleton />
}

// Error component
function QuizError({ error }: { error: string }) {
  return (
    <div className="container max-w-4xl mx-auto p-4 md:p-6 pt-16 md:pt-6">
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p className="font-medium">Error loading quiz</p>
        <p className="text-sm">{error}</p>
      </div>
    </div>
  )
}

export default async function PracticeTestPage({ params }: { params: { id: string } }) {
  const { data, error } = await GetQuizById(params.id)
  
  if (error) {
    return notFound()
  }

  const quiz = data as QuizWithRelations

  return (
    <Suspense fallback={<QuizLoading />}>
      <QuizComponent quiz={quiz} quizId={params.id} />
    </Suspense>
  )
}

