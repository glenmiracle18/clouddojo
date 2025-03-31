"use client"

import { useState, useEffect, useRef, ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  CheckCircle,
  AlertCircle,
  BookOpen,
  LineChart,
  ChevronDown,
  ChevronUp,
  Clock,
  Target,
  Download,
  Share2,
  Info,
  ArrowUpRight,
  Zap,
  BookMarked,
  BarChart2,
  TrendingUp,
  Lightbulb,
  Layers,
  Shield,
} from "lucide-react"
import { ReportData, ReportSummary, CategoryScore, TimeDistribution, PerformanceHistory, MissedTopic, ExpandedSections, ReadinessCardProps, StudyPlanCardProps, MarkdownRendererProps } from "./types"



// Sample data for demonstration
const sampleReport: ReportData = {
  summary: {
    score: 78,
    totalQuestions: 65,
    correctAnswers: 51,
    incorrectAnswers: 14,
    timeSpent: "1h 45m",
    testDate: "2025-03-25",
    improvement: 12,
    testName: "AWS Solutions Architect Associate - Practice Test 3",
  },
  categoryScores: [
    { name: "Compute", score: 85, questions: 15 },
    { name: "Storage", score: 92, questions: 12 },
    { name: "Database", score: 75, questions: 10 },
    { name: "Networking", score: 65, questions: 14 },
    { name: "Security", score: 80, questions: 8 },
    { name: "Serverless", score: 70, questions: 6 },
  ],
  strengths: [
    "Strong understanding of EC2 instance types and use cases",
    "Excellent grasp of S3 storage classes and lifecycle policies",
    "Good knowledge of IAM roles and permissions",
  ],
  weaknesses: [
    "Need improvement in VPC networking concepts",
    "Limited understanding of AWS Lambda configuration options",
    "Confusion between different database services (RDS, DynamoDB, Aurora)",
  ],
  recommendations: [
    "Review VPC peering and subnet configuration documentation",
    "Practice more Lambda-based scenarios, especially with environment variables and permissions",
    "Complete the AWS database specialization module",
    "Focus on the AWS Well-Architected Framework principles",
  ],
  detailedAnalysis: `
    ## EC2 and Compute Services
    
    You demonstrated strong knowledge in EC2 instance selection, with 90% accuracy in questions related to instance types and their use cases. For example:
    
    > "When asked about memory-optimized instances for in-memory databases, you correctly identified R5 instances as the appropriate choice."
    
    However, there was some confusion regarding Auto Scaling policies and EC2 placement groups.
    
    ## Storage Solutions
    
    Your understanding of S3 storage classes is excellent, correctly answering all questions about:
    
    \`\`\`
    S3 Standard
    S3 Intelligent-Tiering
    S3 Glacier Deep Archive
    \`\`\`
    
    Areas for improvement include understanding the differences between EBS volume types and their performance characteristics.
    
    ## Networking
    
    This is your weakest area, with only 65% accuracy. Key concepts to review:
    
    1. VPC peering limitations
    2. Transit Gateway configurations
    3. Route table configurations
    4. Network ACLs vs Security Groups
  `,
  timeDistribution: [
    { category: "Easy Questions", time: 35, count: 30 },
    { category: "Medium Questions", time: 45, count: 25 },
    { category: "Hard Questions", time: 25, count: 10 },
  ],
  performanceHistory: [
    { test: "Test 1", score: 65 },
    { test: "Test 2", score: 72 },
    { test: "Test 3", score: 78 },
  ],
  certificationReadiness: 75,
  topMissedTopics: [
    { topic: "VPC Networking", count: 5, importance: "High" },
    { topic: "Lambda Configuration", count: 3, importance: "Medium" },
    { topic: "EBS Volume Types", count: 2, importance: "Medium" },
    { topic: "DynamoDB Indexes", count: 2, importance: "High" },
  ],
}

export default function PremiumAIAnalysisDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeInsightTab, setActiveInsightTab] = useState("overview")
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    strengths: true,
    weaknesses: true,
    recommendations: true,
    detailed: false,
  })
  const [progress, setProgress] = useState(0)
  const chartRef = useRef<HTMLDivElement>(null)

  const toggleSection = (section: keyof ExpandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    })
  }

  useEffect(() => {
    // Simulated loading effect
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    // Animated progress bar
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 50)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  // Draw charts after component mounts
  useEffect(() => {
    if (!isLoading && chartRef.current) {
      drawCategoryChart()
    }
  }, [isLoading])

  // Function to draw category performance chart
  const drawCategoryChart = () => {
    if (typeof window !== "undefined" && chartRef.current) {
      // This would be implemented with a real chart library like Chart.js or D3
      // For now, we'll use a placeholder
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white flex flex-col items-center justify-center z-50 ">
        <div className="w-64 mb-8">
          <svg viewBox="0 0 100 100" className="animate-pulse-subtle">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#10b981"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="251.2"
              strokeDashoffset="125.6"
              className="animate-dash"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Analyzing Your AWS Test Results</h2>
        <p className="text-gray-600 mb-6">Our AI is processing your performance data</p>
        <div className="w-80">
          <Progress value={progress} className="h-2" />
        </div>
        <div className="mt-4 text-sm text-gray-500 flex items-center">
          <Zap className="h-4 w-4 mr-1 text-emerald-500" />
          Generating personalized insights
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header with logo and actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="mr-3">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="8" fill="#10b981" fillOpacity="0.1" />
              <path
                d="M20 10C14.477 10 10 14.477 10 20C10 25.523 14.477 30 20 30C25.523 30 30 25.523 30 20C30 14.477 25.523 10 20 10ZM20 28C15.582 28 12 24.418 12 20C12 15.582 15.582 12 20 12C24.418 12 28 15.582 28 20C28 24.418 24.418 28 20 28Z"
                fill="#10b981"
              />
              <path d="M21 15H19V21H25V19H21V15Z" fill="#10b981" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">AWS Certification AI Coach</h1>
            <div className="flex items-center">
              <p className="text-gray-500 text-sm">{sampleReport.summary.testName}</p>
              <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                Premium Analysis
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Share2 className="h-4 w-4 mr-2" />
            Share Results
          </Button>
        </div>
      </div>

      {/* Score overview and certification readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-1 border-none shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white pb-0">
            <CardTitle className="flex justify-between items-center">
              <span>Overall Score</span>
              <span className="text-3xl">{sampleReport.summary.score}%</span>
            </CardTitle>
            <CardDescription className="text-emerald-100">
              {sampleReport.summary.correctAnswers} of {sampleReport.summary.totalQuestions} questions correct
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-emerald-500 mr-2" />
                <span className="text-gray-700">Improvement</span>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                +{sampleReport.summary.improvement}% from last test
              </Badge>
            </div>
            <Separator className="my-4" />
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Time Efficiency</span>
                  <span className="text-sm text-gray-500">{sampleReport.summary.timeSpent}</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Accuracy</span>
                  <span className="text-sm text-gray-500">
                    {Math.round((sampleReport.summary.correctAnswers / sampleReport.summary.totalQuestions) * 100)}%
                  </span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2 border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle>Certification Readiness</CardTitle>
            <CardDescription>Based on your performance across all practice tests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative pt-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Overall Readiness</span>
                <span className="text-sm font-medium text-gray-700">{sampleReport.certificationReadiness}%</span>
              </div>
              <div className="h-3 relative max-w-xl rounded-full overflow-hidden">
                <div className="w-full h-full bg-gray-200 absolute"></div>
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 via-emerald-500 to-emerald-600 absolute"
                  style={{ width: `${sampleReport.certificationReadiness}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Not Ready</span>
                <span>Needs Practice</span>
                <span>Almost Ready</span>
                <span>Ready</span>
              </div>

              {/* Certification readiness gauge markers */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                <ReadinessCard
                  icon={<BookMarked className="h-5 w-5 text-blue-500" />}
                  title="Knowledge Areas"
                  value="4/5"
                  description="Strong in most areas"
                />
                <ReadinessCard
                  icon={<Clock className="h-5 w-5 text-emerald-500" />}
                  title="Time Management"
                  value="Good"
                  description="Completing within time limits"
                />
                <ReadinessCard
                  icon={<Target className="h-5 w-5 text-blue-500" />}
                  title="Exam Simulation"
                  value="3 Tests"
                  description="More practice recommended"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance by category */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-1 lg:col-span-2 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-emerald-600" />
              Performance by Category
            </CardTitle>
            <CardDescription>Your score breakdown across AWS service categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sampleReport.categoryScores.map((category) => (
                <div key={category.name}>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700">{category.name}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-gray-400 ml-1 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Based on {category.questions} questions</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <span className="text-sm text-gray-500">{category.score}%</span>
                  </div>
                  <div className="h-2 relative max-w-xl rounded-full overflow-hidden">
                    <div className="w-full h-full bg-gray-200 absolute"></div>
                    <div
                      className={`h-full absolute ${getCategoryColorClass(category.score)}`}
                      style={{ width: `${category.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
              Top Missed Topics
            </CardTitle>
            <CardDescription>Focus on these areas to improve your score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sampleReport.topMissedTopics.map((topic, index) => (
                <div key={index} className="flex items-center p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div
                    className={`w-2 h-10 rounded-full mr-3 ${topic.importance === "High" ? "bg-red-500" : "bg-yellow-500"}`}
                  ></div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{topic.topic}</div>
                    <div className="text-sm text-gray-500">Missed {topic.count} questions</div>
                  </div>
                  <Badge
                    className={
                      topic.importance === "High" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {topic.importance}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="link" className="text-blue-600 hover:text-blue-800 p-0">
              View detailed topic analysis
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Insights Tabs */}
      <Card className="border-none shadow-lg mb-8">
        <CardHeader className="pb-0">
          <CardTitle className="flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-emerald-600" />
            AI-Generated Insights
          </CardTitle>
          <CardDescription>Personalized analysis and recommendations based on your test performance</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Tabs value={activeInsightTab} onValueChange={setActiveInsightTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                <Layers className="mr-2 h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="strengths"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Strengths
              </TabsTrigger>
              <TabsTrigger
                value="weaknesses"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Weaknesses
              </TabsTrigger>
              <TabsTrigger
                value="recommendations"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Recommendations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0 space-y-4">
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-4">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-1">AI Analysis Summary</h3>
                    <p className="text-gray-600">
                      You're showing good progress in your AWS certification journey. Your strengths lie in EC2 and S3
                      services, while networking concepts need more attention. With focused study on your weak areas,
                      you should be ready for certification within 3-4 weeks.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-emerald-500" />
                    Performance Trend
                  </h3>
                  <div className="h-40 flex items-end justify-between">
                    {sampleReport.performanceHistory.map((item, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className="text-sm text-gray-500 mb-2">{item.score}%</div>
                        <div
                          className="w-12 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-md"
                          style={{ height: `${item.score * 0.35}%` }}
                        ></div>
                        <div className="text-sm text-gray-500 mt-2">{item.test}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-blue-500" />
                    Time Distribution
                  </h3>
                  <div className="space-y-4 mt-4">
                    {sampleReport.timeDistribution.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">
                            {item.category} ({item.count})
                          </span>
                          <span className="text-sm text-gray-500">{item.time} min</span>
                        </div>
                        <div className="h-2 relative rounded-full overflow-hidden">
                          <div className="w-full h-full bg-gray-200 absolute"></div>
                          <div
                            className={`h-full absolute ${index === 0 ? "bg-emerald-500" : index === 1 ? "bg-blue-500" : "bg-purple-500"}`}
                            style={{
                              width: `${(item.time / sampleReport.timeDistribution.reduce((acc, curr) => acc + curr.time, 0)) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="strengths" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sampleReport.strengths.map((strength, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg border border-emerald-200 p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start">
                      <div className="bg-emerald-100 rounded-full p-2 mr-3 flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                      </div>
                      <p className="text-gray-700">{strength}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="weaknesses" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sampleReport.weaknesses.map((weakness, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg border border-blue-200 p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start">
                      <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-blue-600" />
                      </div>
                      <p className="text-gray-700">{weakness}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="mt-0">
              <div className="space-y-4">
                {sampleReport.recommendations.map((recommendation, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start">
                      <div className="bg-emerald-100 rounded-full p-2 mr-4 flex-shrink-0">
                        <BookOpen className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-gray-700">{recommendation}</p>
                        <Button variant="link" className="text-emerald-600 hover:text-emerald-800 p-0 mt-2 h-auto">
                          View related resources
                          <ArrowUpRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Detailed Analysis Section */}
      <Card className="border-none shadow-lg mb-8">
        <CardHeader
          className="flex flex-row items-center justify-between cursor-pointer"
          onClick={() => toggleSection("detailed")}
        >
          <div className="flex items-center">
            <LineChart className="h-5 w-5 mr-2 text-blue-600" />
            <div>
              <CardTitle>Detailed Analysis</CardTitle>
              <CardDescription>In-depth review of your performance by topic area</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-transparent p-1">
            {expandedSections.detailed ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
        </CardHeader>
        {expandedSections.detailed && (
          <CardContent>
            <div className="prose max-w-none bg-white p-6 rounded-lg border border-gray-100">
              <MarkdownRenderer content={sampleReport.detailedAnalysis} />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Study Plan and Next Steps */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookMarked className="h-5 w-5 mr-2 text-emerald-600" />
            Personalized Study Plan
          </CardTitle>
          <CardDescription>Based on your performance, we recommend the following study plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StudyPlanCard
              title="Week 1: Networking Focus"
              description="Concentrate on VPC concepts, subnets, and routing"
              resources={["AWS Networking Fundamentals", "VPC Deep Dive Workshop", "Practice Lab: VPC Peering"]}
              priority="High"
            />
            <StudyPlanCard
              title="Week 2: Serverless Applications"
              description="Improve your understanding of Lambda and API Gateway"
              resources={[
                "Lambda Configuration Guide",
                "Serverless Architecture Patterns",
                "Practice Lab: Event-Driven Design",
              ]}
              priority="Medium"
            />
            <StudyPlanCard
              title="Week 3: Database Services"
              description="Focus on RDS, DynamoDB, and Aurora differences"
              resources={[
                "Database Selection Guide",
                "DynamoDB Indexing Strategies",
                "Practice Lab: Multi-AZ Deployments",
              ]}
              priority="Medium"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Generate Full Study Plan</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

// Helper component for readiness cards
function ReadinessCard({ icon, title, value, description }: ReadinessCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col items-center text-center">
      <div className="mb-2">{icon}</div>
      <div className="font-medium text-gray-800">{title}</div>
      <div className="text-xl font-bold text-gray-900 my-1">{value}</div>
      <div className="text-sm text-gray-500">{description}</div>
    </div>
  )
}

// Helper function to get color class based on score
function getCategoryColorClass(score: number): string {
  if (score >= 85) return "bg-emerald-500"
  if (score >= 70) return "bg-blue-500"
  if (score >= 60) return "bg-yellow-500"
  return "bg-red-500"
}

// Component to render markdown content with proper formatting
function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Process the content to handle markdown elements
  const processedContent = content
    .replace(/## (.*)/g, '<h2 class="text-xl font-bold mt-6 mb-3 text-blue-700">$1</h2>')
    .replace(
      /> "(.*?)"/g,
      '<blockquote class="border-l-4 border-emerald-500 pl-4 italic my-4 py-2 text-gray-700 bg-emerald-50 rounded-r-md">$1</blockquote>',
    )
    .replace(
      /```([\s\S]*?)```/g,
      '<pre class="bg-gray-100 p-4 rounded-md my-4 overflow-x-auto font-mono text-sm border border-gray-200">$1</pre>',
    )
    .replace(/\n\n/g, "<br/><br/>")
    .replace(
      /\n([0-9]+)\. (.*)/g,
      '<div class="ml-6 my-2 flex"><span class="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mr-3">$1</span> <span>$2</span></div>',
    )

  return <div dangerouslySetInnerHTML={{ __html: processedContent }} />
}

// Study plan card component
function StudyPlanCard({ title, description, resources, priority }: StudyPlanCardProps) {
  const priorityColor =
    priority === "High"
      ? "bg-red-100 text-red-800 border-red-200"
      : priority === "Medium"
        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
        : "bg-blue-100 text-blue-800 border-blue-200"

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <Badge className={`mb-3 ${priorityColor}`}>{priority} Priority</Badge>
        <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <Separator className="my-3" />
        <h4 className="text-sm font-medium text-gray-700 mb-2">Recommended Resources:</h4>
        <ul className="space-y-2">
          {resources.map((resource: string, index: number) => (
            <li key={index} className="flex items-start">
              <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-2 mt-0.5" />
              <span className="text-sm text-gray-600">{resource}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <Button variant="link" className="text-emerald-600 hover:text-emerald-800 p-0 h-auto text-sm">
          View detailed curriculum
        </Button>
      </div>
    </div>
  )
}

