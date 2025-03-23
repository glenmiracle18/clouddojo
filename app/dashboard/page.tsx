"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Bell, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import SearchBar from "@/components/dashboard/search-bar"
import FilterComponent from "@/components/dashboard/filter-component"
import PerformanceSection from "@/components/dashboard/performance-section"
import { DateRangePicker } from "@/components/dashboard/date-range-picker"
import ViewToggle from "@/components/dashboard/view-toggle"
import { useUserStatus } from "./hooks/useUserStatus"

export default function DashboardPage() {
  const router = useRouter()
  const { isLoaded } = useUser()
  const [view, setView] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(false)
  const { 
    isCheckingStatus, 
    redirectToOnboardingIfNeeded,
    isUserInitialized
  } = useUserStatus()

  // Check if the user has completed onboarding
  useEffect(() => {
    if (isUserInitialized) {
      redirectToOnboardingIfNeeded()
    }
  }, [isUserInitialized, redirectToOnboardingIfNeeded])

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  // Show loading state while checking status
  if (!isLoaded || isCheckingStatus) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto p-4 md:p-6 max-w-full">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                      3
                    </Badge>
                    <span className="sr-only">Notifications</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>New quiz available: AWS Lambda</DropdownMenuItem>
                  <DropdownMenuItem>Your score improved by 15%</DropdownMenuItem>
                  <DropdownMenuItem>New certification path unlocked</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                <span className="sr-only">Refresh</span>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <TabsList className="w-full md:w-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                <SearchBar onSearch={(query) => console.log("Searching for:", query)} />
                <FilterComponent />
              </div>
            </div>

            <TabsContent value="overview" className="mt-0">
              <div className="flex flex-col gap-6">
                {/* Performance Section with animated graph and stats */}
                <PerformanceSection />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <DateRangePicker onDateRangeChange={(range) => console.log("Date range:", range)}  />
                  <div className="flex justify-end md:justify-start">
                    <ViewToggle onChange={setView} />
                  </div>
                </div>

                <div
                  className={
                    view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-4"
                  }
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className={`border rounded-lg p-4 ${view === "grid" ? "h-[200px]" : "h-[100px]"} 
                        flex items-center justify-center bg-card`}
                    >
                      {view === "grid" ? (
                        <div className="text-center">
                          <div className="text-lg font-medium">Quiz Module {i + 1}</div>
                          <div className="text-sm text-muted-foreground">Cloud Computing Fundamentals</div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center w-full px-4">
                          <div>
                            <div className="font-medium">Quiz Module {i + 1}</div>
                            <div className="text-sm text-muted-foreground">Cloud Computing Fundamentals</div>
                          </div>
                          <Button variant="outline" size="sm">
                            Start Quiz
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="h-[400px] flex items-center justify-center border rounded-lg">
                Analytics content would go here
              </div>
            </TabsContent>

            <TabsContent value="reports">
              <div className="h-[100vh] flex items-center justify-center border rounded-lg">
                Reports content would go here
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

