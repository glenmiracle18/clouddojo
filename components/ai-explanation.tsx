"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface AIExplanationProps {
  question: string
  correctAnswer: string
  userAnswer: string
}

export function AIExplanation({ question, correctAnswer, userAnswer }: AIExplanationProps) {
  const [explanation, setExplanation] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const generateExplanation = async () => {
    setLoading(true)
    try {
      // TODO: Replace this with an actual API call to an AI service
      const response = await fetch("/api/generate-explanation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, correctAnswer, userAnswer }),
      })
      const data = await response.json()
      setExplanation(data.explanation)
    } catch (error) {
      console.error("Error generating explanation:", error)
      setExplanation("Sorry, we couldn't generate an explanation at this time.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4">
      {explanation ? (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">AI-Generated Explanation:</h4>
          <p>{explanation}</p>
        </div>
      ) : (
        <Button onClick={generateExplanation} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Explanation...
            </>
          ) : (
            "Get AI Explanation"
          )}
        </Button>
      )}
    </div>
  )
}

