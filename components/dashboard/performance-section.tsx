"use client"

import { Card } from "@/components/ui/card"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  TooltipProps
} from "recharts"
import { format } from "date-fns"
import { InfoIcon } from "lucide-react"

import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface PerformanceSectionProps {
  hasAttempts: boolean
  stats: any // Replace with proper type
  isLoading: boolean
}

export default function PerformanceSection({ 
  hasAttempts, 
  stats, 
  isLoading 
}: PerformanceSectionProps) {
  
  // If there are no attempts, show the empty state
  if (!hasAttempts && !isLoading) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
          <div className="rounded-full bg-primary/10 p-3">
            <InfoIcon className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">No quiz attempts yet</h3>
          <p className="text-muted-foreground max-w-md">
            Take your first practice test to see your performance metrics and track your progress over time.
          </p>
        </div>
      </Card>
    )
  }
  
  // Loading state
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-24 bg-muted rounded"></div>
            <div className="h-24 bg-muted rounded"></div>
            <div className="h-24 bg-muted rounded"></div>
          </div>
          <div className="h-[200px] bg-muted rounded"></div>
        </div>
      </Card>
    )
  }
  
  // Format the chart data with proper labels
  const chartData = stats.scoreHistory.map((item: any) => ({
    ...item,
    formattedDate: format(new Date(item.date), "MMM d")
  }))
  
  // Custom tooltip component for the chart
  const CustomTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded shadow-sm p-2 text-xs">
          <p className="font-medium">{label}</p>
          <p>Score: {payload[0].value}%</p>
        </div>
      )
    }
    return null
  }
  
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Performance</h2>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Track your quiz performance over time. Your scores are shown as percentages.
                </p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">Total Attempts</p>
            <p className="text-3xl font-bold">{stats.totalAttempts}</p>
            <p className="text-xs text-muted-foreground">Quiz attempts</p>
          </Card>
          
          <Card className="p-4 flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">Average Score</p>
            <p className="text-3xl font-bold">{Math.round(stats.averageScore)}%</p>
            <p className="text-xs text-muted-foreground">Across all attempts</p>
          </Card>
          
          <Card className="p-4 flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">Highest Score</p>
            <p className="text-3xl font-bold">{Math.round(stats.highestScore)}%</p>
            <p className="text-xs text-muted-foreground">Best performance</p>
          </Card>
        </div>

        <div className="h-[250px] mt-2">
          {chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis 
                  dataKey="formattedDate" 
                  tick={{ fontSize: 12 }} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, stroke: "#059669" }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">Take more quizzes to see your score history</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

