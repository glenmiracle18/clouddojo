"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isBreak, setIsBreak] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1)
        } else if (minutes > 0) {
          setMinutes(minutes - 1)
          setSeconds(59)
        } else {
          clearInterval(interval!)
          setIsActive(false)
          if (!isBreak) {
            setIsBreak(true)
            setMinutes(5)
            setSeconds(0)
          } else {
            setIsBreak(false)
            setMinutes(25)
            setSeconds(0)
          }
        }
      }, 1000)
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval!)
    }

    return () => clearInterval(interval!)
  }, [isActive, minutes, seconds, isBreak])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setIsBreak(false)
    setMinutes(25)
    setSeconds(0)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-purple-600">{isBreak ? "Break Time" : "Study Time"}</h2>
      <motion.div
        className="text-5xl font-bold text-center mb-6"
        key={`${minutes}${seconds}`}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.3 }}
      >
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </motion.div>
      <div className="flex justify-center space-x-4">
        <Button onClick={toggleTimer} className="bg-green-500 hover:bg-green-600 text-white">
          {isActive ? "Pause" : "Start"}
        </Button>
        <Button onClick={resetTimer} className="bg-red-500 hover:bg-red-600 text-white">
          Reset
        </Button>
      </div>
    </div>
  )
}

