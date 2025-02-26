"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { AIExplanation } from "@/components/ai-explanation"
import { motion } from "framer-motion"

const mockQuestions = [
  {
    id: 1,
    question: "What is Amazon EC2?",
    options: ["Elastic Compute Cloud", "Elastic Container Cloud", "Elastic Computer Cloud", "Elastic Cloud Compute"],
    correctAnswer: 0,
  },
  {
    id: 2,
    question: "Which AWS service is used for object storage?",
    options: ["Amazon EBS", "Amazon S3", "Amazon EFS", "Amazon Glacier"],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: "What is the purpose of Amazon VPC?",
    options: [
      "Virtual Private Cloud for networking",
      "Virtual Payment Center for billing",
      "Visual Processing Center for image analysis",
      "Vertical Platform Computing for scaling",
    ],
    correctAnswer: 0,
  },
  {
    id: 4,
    question: "Which AWS service is used for managed relational databases?",
    options: ["DynamoDB", "Redshift", "RDS", "ElastiCache"],
    correctAnswer: 2,
  },
  {
    id: 5,
    question: "What is AWS Lambda used for?",
    options: ["Load balancing", "Serverless computing", "Content delivery", "Virtual machine management"],
    correctAnswer: 1,
  },
]

export default function QuizPage({ params }: { params: { id: string } }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleNextQuestion = () => {
    if (selectedAnswer === mockQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }

    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
      setTimeLeft(60)
    } else {
      // End of quiz
      router.push("/quizzes")
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
      setTimeLeft(60)
    }
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer !== null) {
      setShowExplanation(true)
    }
  }

  const question = mockQuestions[currentQuestion]

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Quiz: AWS Fundamentals</h2>
          <Progress value={((currentQuestion + 1) / mockQuestions.length) * 100} className="mb-4" />
          <div className="mb-4 flex justify-between items-center">
            <span>
              Question {currentQuestion + 1} of {mockQuestions.length}
            </span>
            <span className="text-blue-600 font-semibold">Time left: {timeLeft}s</span>
          </div>
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">{question.question}</h3>
              <RadioGroup
                value={selectedAnswer?.toString()}
                onValueChange={(value) => setSelectedAnswer(Number.parseInt(value))}
              >
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </motion.div>
          <div className="mt-6 flex justify-between">
            <Button onClick={handlePreviousQuestion} disabled={currentQuestion === 0}>
              Previous
            </Button>
            <Button onClick={handleSubmitAnswer} disabled={selectedAnswer === null}>
              Submit Answer
            </Button>
            <Button onClick={handleNextQuestion}>
              {currentQuestion < mockQuestions.length - 1 ? "Next" : "Finish Quiz"}
            </Button>
          </div>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 p-4 bg-blue-50 rounded-lg"
            >
              <h4 className="font-semibold mb-2">
                {selectedAnswer === question.correctAnswer ? "Correct!" : "Incorrect"}
              </h4>
              <p>The correct answer is: {question.options[question.correctAnswer]}</p>
              {selectedAnswer !== question.correctAnswer && (
                <AIExplanation
                  question={question.question}
                  correctAnswer={question.options[question.correctAnswer]}
                  userAnswer={question.options[selectedAnswer!]}
                />
              )}
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

