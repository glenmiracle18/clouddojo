import DashboardLayout from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const mockQuizzes = [
  { id: 1, title: "AWS EC2 Basics", questions: 20, lastAttempted: "2023-05-15" },
  { id: 2, title: "S3 and Storage Services", questions: 15, lastAttempted: "2023-05-10" },
  { id: 3, title: "VPC Fundamentals", questions: 25, lastAttempted: "2023-05-05" },
]

export default function MyQuizzes() {
  return (
    <DashboardLayout>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">My Quizzes</h2>
          <Button asChild>
            <Link href="/quizzes/create">Create New Quiz</Link>
          </Button>
        </div>
        <div className="grid gap-4">
          {mockQuizzes.map((quiz) => (
            <div key={quiz.id} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{quiz.title}</h3>
                <p className="text-sm text-gray-500">
                  {quiz.questions} questions • Last attempted: {quiz.lastAttempted}
                </p>
              </div>
              <Button asChild>
                <Link href={`/quizzes/${quiz.id}`}>Start Quiz</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

