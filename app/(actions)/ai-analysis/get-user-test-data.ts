"use server"

import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"

export async function getUserTestData(quizAttemptId?: string) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return { success: false, error: "User not authenticated" }
    }

    // Get user's latest 5 quiz attempts
    const quizAttempts = await prisma.quizAttempt.findMany({
      where: {
        userId,
        completedAt: { not: null }, // Only completed attempts
      },
      orderBy: {
        completedAt: 'desc'
      },
      take: 5, // Get most recent 5 attempts
      include: {
        quiz: {
          include: {
            category: true
          }
        },
        questions: {
          include: {
            question: {
              include: {
                category: true
              }
            }
          }
        },
        user: {
          include: {
            onboarding: true
          }
        }
      }
    })

    if (quizAttempts.length === 0) {
      return { success: false, error: "No completed quiz attempts found" }
    }

    // Use the most recent quiz attempt as the primary one (or the specified one if provided)
    const primaryAttempt = quizAttemptId 
      ? quizAttempts.find((attempt: any) => attempt.id === quizAttemptId) || quizAttempts[0]
      : quizAttempts[0]

    // Get category performance for the primary attempt
    const categoryPerformance = await prisma.$queryRaw`
      SELECT 
        q."categoryId",
        count(*) as "_count__all",
        count(CASE WHEN qa."isCorrect" = true THEN 1 END) as "_count_isCorrect"
      FROM "QuestionAttempt" qa
      JOIN "Question" q ON qa."questionId" = q.id
      WHERE qa."quizAttemptId" = ${primaryAttempt.id}
      GROUP BY q."categoryId"
    `

    // Get service performance for the primary attempt
    const servicePerformance = await prisma.$queryRaw`
      SELECT 
        q."awsService",
        count(*) as "_count__all",
        count(CASE WHEN qa."isCorrect" = true THEN 1 END) as "_count_isCorrect"
      FROM "QuestionAttempt" qa
      JOIN "Question" q ON qa."questionId" = q.id
      WHERE qa."quizAttemptId" = ${primaryAttempt.id}
      GROUP BY q."awsService"
    `

    // Get difficulty performance for the primary attempt
    const difficultyPerformance = await prisma.$queryRaw`
      SELECT 
        q."difficultyLevel",
        count(*) as "_count__all",
        count(CASE WHEN qa."isCorrect" = true THEN 1 END) as "_count_isCorrect"
      FROM "QuestionAttempt" qa
      JOIN "Question" q ON qa."questionId" = q.id
      WHERE qa."quizAttemptId" = ${primaryAttempt.id}
      GROUP BY q."difficultyLevel"
    `

    // Calculate time metrics for the primary attempt
    const timeMetrics = {
      totalTime: primaryAttempt.timeSpentSecs,
      averageTimePerQuestion: primaryAttempt.questions.length > 0 
        ? primaryAttempt.timeSpentSecs / primaryAttempt.questions.length 
        : 0,
      timeByDifficulty: await prisma.$queryRaw`
        SELECT 
          q."difficultyLevel" as level,
          AVG(qa."timeSpentSecs") as "averageTime"
        FROM "QuestionAttempt" qa
        JOIN "Question" q ON qa."questionId" = q.id
        WHERE qa."quizAttemptId" = ${primaryAttempt.id}
        GROUP BY q."difficultyLevel"
      `
    }

    // Return the data
    return {
      success: true,
      data: {
        quizAttempt: primaryAttempt,
        categoryPerformance,
        servicePerformance,
        difficultyPerformance,
        timeMetrics,
        userHistory: quizAttempts // Now includes up to 5 recent attempts
      }
    }
  } catch (error) {
    console.error("Error getting user test data:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }
  }
} 