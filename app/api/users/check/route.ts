import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  // Get authenticated user
  const { userId: authUserId } = await auth();
  if (!authUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get userId from query params
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");

  // Ensure userId matches authenticated user
  if (userId !== authUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if user exists in our database
    const user = await prisma.user.findUnique({
      where: { userId },
    });

    // Check if onboarding data exists
    let hasCompletedOnboarding = false;
    
    if (user) {
      const onboarding = await prisma.userOnboarding.findUnique({
        where: { userId },
      });
      
      hasCompletedOnboarding = user.hasCompletedOnboarding || false;
    }

    return NextResponse.json({ 
      exists: !!user,
      hasCompletedOnboarding
    });
  } catch (error) {
    console.error("Error checking user:", error);
    return NextResponse.json(
      { error: "Failed to check user" },
      { status: 500 }
    );
  }
} 