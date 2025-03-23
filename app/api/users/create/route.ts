import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  // Get authenticated user
  const { userId: authUserId } = await auth();
  if (!authUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get user data from request body
    const { userId, email, firstName, lastName } = await request.json();

    // Ensure userId matches authenticated user
    if (userId !== authUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate required fields
    if (!userId || !email || !firstName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { userId },
    });

    if (existingUser) {
      // Update user
      await prisma.user.update({
        where: { userId },
        data: { email, firstName, lastName: lastName || "" },
      });

      return NextResponse.json({
        success: true,
        message: "User updated successfully",
      });
    } else {
      // Create new user
      await prisma.user.create({
        data: {
          userId,
          email,
          firstName, 
          lastName: lastName || "",
        },
      });

      return NextResponse.json({
        success: true,
        message: "User created successfully",
      });
    }
  } catch (error) {
    console.error("Error creating/updating user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create/update user" },
      { status: 500 }
    );
  }
} 