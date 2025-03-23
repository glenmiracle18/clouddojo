import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

export async function POST(req: Request) {
  try {
    // Verify authentication
    const user = await currentUser()
    
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    
    const userId = user.id
    
    // Parse request data
    const data = await req.json()
    
    // Validate request data
    if (!data.companyType || !data.companySize || !data.goals?.length) {
      return new NextResponse("Missing required fields", { status: 400 })
    }
    
    // Check if the user exists in our database
    const dbUser = await prisma.user.findUnique({
      where: { userId },
    })
    
    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 })
    }
    
    // Check if onboarding record exists
    const existingOnboarding = await prisma.userOnboarding.findUnique({
      where: { userId }
    })
    
    if (existingOnboarding) {
      // Update existing onboarding
      await prisma.userOnboarding.update({
        where: { userId },
        data: {
          companyType: data.companyType,
          companySize: data.companySize,
          goals: data.goals,
          preferredCertifications: data.preferredCertifications || [],
          experience: data.experience,
          completedAt: new Date()
        }
      })
    } else {
      // Create new onboarding
      await prisma.userOnboarding.create({
        data: {
          userId,
          companyType: data.companyType,
          companySize: data.companySize,
          goals: data.goals,
          preferredCertifications: data.preferredCertifications || [],
          experience: data.experience,
          completedAt: new Date()
        }
      })
    }
    
    // Update the user's hasCompletedOnboarding flag
    await prisma.user.update({
      where: { userId },
      data: { hasCompletedOnboarding: true }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing onboarding data:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}

// Endpoint to get onboarding data
export async function GET(req: Request) {
  try {
    // Verify authentication
    const user = await currentUser()
    
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    
    const userId = user.id
    
    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { userId },
    })
    
    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 })
    }
    
    // Get onboarding data
    const onboarding = await prisma.userOnboarding.findUnique({
      where: { userId }
    })
    
    return NextResponse.json({
      hasCompletedOnboarding: dbUser.hasCompletedOnboarding,
      onboardingData: onboarding
    })
  } catch (error) {
    console.error("Error fetching onboarding data:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
} 