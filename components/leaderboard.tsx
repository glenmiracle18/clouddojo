"use client"

import { motion } from "framer-motion"

const mockLeaderboard = [
  { name: "Alice", score: 950 },
  { name: "Bob", score: 880 },
  { name: "Charlie", score: 820 },
  { name: "David", score: 780 },
  { name: "Eve", score: 750 },
]

export function Leaderboard() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-purple-600">Leaderboard</h2>
      <div className="space-y-2">
        {mockLeaderboard.map((entry, index) => (
          <motion.div
            key={entry.name}
            className="flex justify-between items-center p-2 bg-gray-100 rounded"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <span className="font-semibold">{entry.name}</span>
            <span className="text-purple-600 font-bold">{entry.score}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

