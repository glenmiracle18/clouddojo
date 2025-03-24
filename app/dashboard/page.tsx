"use client"

import { useUser } from "@clerk/nextjs"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import PerformanceSection from "@/components/dashboard/performance-section"
import RecentActivitySection from "@/components/dashboard/recent-activity-section"
import CategoriesSection from "@/components/dashboard/categories-section"
import { useDashboardQueries } from "./hooks/useDashboardQueries"

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const { 
    performanceStats, 
    activityHistory, 
    categories,
    hasAttempts,
    isLoadingPerformance,
    isLoadingActivity,
    isLoadingCategories
  } = useDashboardQueries(isLoaded && !!user)
  
  return (
    <div className="py-6 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {isLoaded ? user?.firstName || 'there' : 'there'}! Here's an overview of your learning progress.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3 space-y-6">
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <PerformanceSection 
              hasAttempts={hasAttempts}
              stats={performanceStats || {}} 
              isLoading={isLoadingPerformance} 
            />
          </Suspense>
          
          <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
            <RecentActivitySection 
              activity={activityHistory || []}
              isLoading={isLoadingActivity}
            />
          </Suspense>
        </div>
        
        <div className="lg:col-span-1">
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <CategoriesSection 
              categories={categories || []}
              isLoading={isLoadingCategories}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

