"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Confetti from "react-confetti"
import { useWindowSize } from "react-use"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const questions = [
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

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [quizEnded, setQuizEnded] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const { width, height } = useWindowSize()
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''))

  useEffect(() => {
    if (!quizEnded) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 0) {
            handleNextQuestion()
            return 30
          }
          return prevTime - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [quizEnded])

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answer;
    setAnswers(newAnswers);
  };

  const handlePreviousQuestion = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer?.toString() || '';
    setAnswers(newAnswers);
    
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      const previousAnswer = answers[currentQuestion - 1]
      setSelectedAnswer(Number.parseInt(previousAnswer))
      setTimeLeft(30)
    } else {
      setQuizEnded(true)
    }
  }

  const handleNextQuestion = () => {
    // Save the current answer before moving to the next question
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer?.toString() || '';
    setAnswers(newAnswers);

    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      const nextAnswer = answers[currentQuestion + 1]
      setSelectedAnswer(Number.parseInt(nextAnswer))
    } else {
      setQuizEnded(true)
    }
  }

  const handleRestartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setQuizEnded(false)
    setTimeLeft(30)
  }

  const chartData = {
    labels: ["Correct", "Incorrect"],
    datasets: [
      {
        label: "Quiz Results",
        data: [score, questions.length - score],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
        borderColor: ["rgb(75, 192, 192)", "rgb(255, 99, 132)"],
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Quiz Performance",
      },
    },
  }

  if (quizEnded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Confetti width={width} height={height} />
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-lg shadow-lg text-center max-w-2xl w-full"
        >
          <h2 className="text-4xl font-bold mb-6 text-purple-600">Quiz Completed!</h2>
          <p className="text-2xl mb-4 text-gray-700">
            Your score: {score} out of {questions.length}
          </p>
          <p className="text-xl mb-6 text-gray-600">Performance: {((score / questions.length) * 100).toFixed(2)}%</p>
          <div className="mb-8">
            <Bar data={chartData} options={chartOptions} />
          </div>
          <Button onClick={handleRestartQuiz} size="lg" className="bg-purple-500 hover:bg-purple-600 text-white">
            Restart Quiz
          </Button>
        </motion.div>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="min-h-screen flex flex-col items-center  p-4">
      <div className="w-full bg-white p-8">
        <div className="mb-6">
          <Progress value={((currentQuestion + 1) / questions.length) * 100} className="mb-2" />
          <div className="flex justify-between text-sm text-gray-600">
            <span>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span>Time left: {timeLeft}s</span>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-purple-600">{question.question}</h2>
            <RadioGroup
              value={selectedAnswer?.toString()}
              onValueChange={(value) => setSelectedAnswer(Number.parseInt(value))}
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 mb-4">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="text-lg text-gray-700">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </motion.div>
        </AnimatePresence>
        <div className="mt-6 flex justify-between items-center">
          
          <Button
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            className="bg-green-400 hover:bg-green-500 text-gray-800"
          >
            {currentQuestion < questions.length - 1 ? "Prev" : "Finish Quiz"}
          </Button>
          <Button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-800"
          >
            {currentQuestion < questions.length - 1 ? "Next" : "Finish Quiz"}
          </Button>
        </div>
        <div className="my-8 text-xl font-semibold text-purple-600">Score: {score}</div>
      </div>
    </div>
  )
}

