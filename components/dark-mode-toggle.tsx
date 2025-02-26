"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { motion } from "framer-motion"

export function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const isDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(isDarkMode)
    document.documentElement.classList.toggle("dark", isDarkMode)
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem("darkMode", String(newDarkMode))
    document.documentElement.classList.toggle("dark", newDarkMode)
  }

  return (
    <motion.button
      className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800"
      onClick={toggleDarkMode}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-purple-600" />}
    </motion.button>
  )
}

