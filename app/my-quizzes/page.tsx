import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const myQuizzes = [
  { id: 1, title: "AWS Fundamentals", progress: 75 },
  { id: 2, title: "EC2 Deep Dive", progress: 50 },
  { id: 3, title: "S3 Mastery", progress: 30 },
]

export default function MyQuizzesPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Quizzes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myQuizzes.map((quiz) => (
          <Card key={quiz.id}>
            <CardHeader>
              <CardTitle>{quiz.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Progress: {quiz.progress}%</p>
            </CardContent>
            <CardFooter>
              <Button>Continue</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

