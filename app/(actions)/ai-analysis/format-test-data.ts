import { formatDistanceToNow, formatDuration, intervalToDuration } from "date-fns"

interface FormattedTestData {
  user: {
    id: string
    name: string
    experience: string | null
    preferredCertifications: string[]
    goals: string[]
  }
  currentTest: {
    id: string
    name: string
    category: string | null
    score: number
    timeSpent: {
      seconds: number
      formatted: string
    }
    questionsTotal: number
    questionsCorrect: number
    questionsIncorrect: number
    startedAt: string
    completedAt: string | null
  }
  categoryPerformance: Array<{
    category: string | null
    totalQuestions: number
    correctQuestions: number
    accuracy: number
  }>
  servicePerformance: Array<{
    service: string | null
    totalQuestions: number
    correctQuestions: number
    accuracy: number
  }>
  difficultyBreakdown: Array<{
    level: string | null
    totalQuestions: number
    correctQuestions: number
    accuracy: number
    averageTime: number
  }>
  timeAnalysis: {
    total: {
      seconds: number
      formatted: string
    }
    averagePerQuestion: {
      seconds: number
      formatted: string
    }
    byDifficulty: Array<{
      level: string
      averageSeconds: number
      formatted: string
    }>
  }
  progressHistory: Array<{
    testId: string
    score: number
    date: string
    improvement: number
  }>
  questionDetails: Array<{
    id: string
    content: string
    category: string | null
    service: string | null
    difficulty: string
    isCorrect: boolean
    timeSpent: {
      seconds: number
      formatted: string
    }
    userAnswer: string[]
    correctAnswer: string[]
  }>
}

// Add interfaces for the data parameters
interface QuizQuestion {
  isCorrect: boolean
  questionId: string
  question: {
    content: string
    category?: {
      name: string
    }
    categoryId?: string
    awsService: string
    difficultyLevel?: string
    correctAnswer: string[]
  }
  timeSpentSecs: number
  userAnswer: string
}

interface QuizAttempt {
  id: string
  quiz: {
    title: string
    category?: {
      name: string
      id?: string
      description?: string | null
    } | null
  }
  percentageScore: number
  timeSpentSecs: number
  questions: QuizQuestion[]
  startedAt: Date
  completedAt?: Date
  user?: {
    userId: string
    firstName?: string
    lastName?: string
    onboarding?: {
      experience?: string
      preferredCertifications?: string[]
      goals?: string[]
    }
  }
}

interface CategoryPerformance {
  categoryId: string
  _count: {
    _all: number
    isCorrect: number
  }
}

interface ServicePerformance {
  awsService: string
  _count: {
    _all: number
    isCorrect: number
  }
}

interface DifficultyPerformance {
  difficultyLevel: string
  _count: {
    _all: number
    isCorrect: number
  }
}

interface TimeMetric {
  level: string
  averageTime: number
}

interface TimeMetrics {
  totalTime: number
  averageTimePerQuestion: number
  timeByDifficulty: TimeMetric[]
}

interface AttemptHistory {
  id: string
  percentageScore: number
  completedAt?: Date
  startedAt: Date
}

export interface TestData {
  quizAttempt: QuizAttempt
  categoryPerformance: CategoryPerformance[]
  servicePerformance: ServicePerformance[]
  difficultyPerformance: DifficultyPerformance[]
  timeMetrics: TimeMetrics
  userHistory: AttemptHistory[]
}

// Helper function to safely convert potential BigInt values to numbers
const toNumber = (value: any): number => {
  if (typeof value === 'bigint') {
    return Number(value);
  }
  if (typeof value === 'number') {
    return value;
  }
  return 0;
};

export function formatTestDataForAI(data: TestData): FormattedTestData {
  const {
    quizAttempt,
    categoryPerformance,
    servicePerformance,
    difficultyPerformance,
    timeMetrics,
    userHistory
  } = data

  // Log input data structure for debugging
  console.log("Formatting data from:", {
    quizAttemptId: quizAttempt.id,
    categoryCount: categoryPerformance?.length || 0,
    serviceCount: servicePerformance?.length || 0,
    historyCount: userHistory?.length || 0,
    timeMetricsAvailable: !!timeMetrics
  });

  // Enhanced error logging for deep inspection of the data structure
  console.log("Category Performance sample:", categoryPerformance?.[0]);
  console.log("Service Performance sample:", servicePerformance?.[0]);
  console.log("Time Metrics:", timeMetrics);

  // Format user data
  const user = {
    id: quizAttempt.user?.userId || "",
    name: `${quizAttempt.user?.firstName || ""} ${quizAttempt.user?.lastName || ""}`.trim(),
    experience: quizAttempt.user?.onboarding?.experience || null,
    preferredCertifications: quizAttempt.user?.onboarding?.preferredCertifications || [],
    goals: quizAttempt.user?.onboarding?.goals || []
  }

  // Format current test data
  const currentTest = {
    id: quizAttempt.id,
    name: quizAttempt.quiz.title,
    category: quizAttempt.quiz.category?.name || null,
    score: toNumber(quizAttempt.percentageScore),
    timeSpent: {
      seconds: toNumber(quizAttempt.timeSpentSecs),
      formatted: formatDuration(
        intervalToDuration({ start: 0, end: toNumber(quizAttempt.timeSpentSecs) * 1000 })
      )
    },
    questionsTotal: quizAttempt.questions.length,
    questionsCorrect: quizAttempt.questions.filter((q: QuizQuestion) => q.isCorrect).length,
    questionsIncorrect: quizAttempt.questions.filter((q: QuizQuestion) => !q.isCorrect).length,
    startedAt: quizAttempt.startedAt.toISOString(),
    completedAt: quizAttempt.completedAt?.toISOString() || null
  }

  // Format category performance - handle both raw SQL and Prisma result formats
  const formattedCategoryPerformance = (categoryPerformance || []).map((cat: any) => {
    console.log("Processing category:", cat);
    
    // Try to extract category name
    const category = quizAttempt.questions.find((q: QuizQuestion) => 
      q.question.categoryId === (cat.categoryId || null)
    )?.question.category?.name;
    
    // Handle different possible data structures from raw SQL or Prisma
    let totalQuestions = 0;
    let correctQuestions = 0;
    
    if (cat._count && typeof cat._count === 'object') {
      // Standard Prisma format
      totalQuestions = toNumber(cat._count._all);
      correctQuestions = toNumber(cat._count.isCorrect);
    } else if (cat._count__all !== undefined) {
      // Raw SQL format
      totalQuestions = toNumber(cat._count__all);
      correctQuestions = toNumber(cat._count_isCorrect);
    } else if (cat.count !== undefined) {
      // Another possible format
      totalQuestions = toNumber(cat.count);
      correctQuestions = toNumber(cat.correct);
    }
    
    return {
      category: category || "Unknown",
      totalQuestions,
      correctQuestions,
      accuracy: totalQuestions > 0 ? (correctQuestions / totalQuestions) * 100 : 0
    };
  });

  // Format service performance with similar safe approach
  const formattedServicePerformance = (servicePerformance || []).map((service: any) => {
    console.log("Processing service:", service);
    
    // Handle different possible data structures
    let totalQuestions = 0;
    let correctQuestions = 0;
    
    if (service._count && typeof service._count === 'object') {
      // Standard Prisma format
      totalQuestions = toNumber(service._count._all);
      correctQuestions = toNumber(service._count.isCorrect);
    } else if (service._count__all !== undefined) {
      // Raw SQL format
      totalQuestions = toNumber(service._count__all);
      correctQuestions = toNumber(service._count_isCorrect);
    } else if (service.count !== undefined) {
      // Another possible format
      totalQuestions = toNumber(service.count);
      correctQuestions = toNumber(service.correct);
    }
    
    return {
      service: service.awsService || "Unknown",
      totalQuestions,
      correctQuestions,
      accuracy: totalQuestions > 0 ? (correctQuestions / totalQuestions) * 100 : 0
    };
  });

  // Format difficulty breakdown with similar safe approach
  const formattedDifficultyBreakdown = (difficultyPerformance || []).map((diff: any) => {
    console.log("Processing difficulty:", diff);
    
    // Handle different possible data structures
    let totalQuestions = 0;
    let correctQuestions = 0;
    
    if (diff._count && typeof diff._count === 'object') {
      // Standard Prisma format
      totalQuestions = toNumber(diff._count._all);
      correctQuestions = toNumber(diff._count.isCorrect);
    } else if (diff._count__all !== undefined) {
      // Raw SQL format
      totalQuestions = toNumber(diff._count__all);
      correctQuestions = toNumber(diff._count_isCorrect);
    } else if (diff.count !== undefined) {
      // Another possible format
      totalQuestions = toNumber(diff.count);
      correctQuestions = toNumber(diff.correct);
    }
    
    // Look for difficulty level in various possible properties
    const difficultyLevel = diff.difficultyLevel || diff.level || "Unknown";
    
    // Safe find for time metrics
    const timeMetric = timeMetrics?.timeByDifficulty?.find((t: any) => 
      t.level === difficultyLevel
    );
    
    return {
      level: difficultyLevel,
      totalQuestions,
      correctQuestions,
      accuracy: totalQuestions > 0 ? (correctQuestions / totalQuestions) * 100 : 0,
      averageTime: timeMetric ? toNumber(timeMetric.averageTime) : 0
    };
  });

  // Format time analysis with null checks
  const timeAnalysis = {
    total: {
      seconds: toNumber(timeMetrics?.totalTime || 0),
      formatted: formatDuration(
        intervalToDuration({ start: 0, end: toNumber(timeMetrics?.totalTime || 0) * 1000 })
      )
    },
    averagePerQuestion: {
      seconds: toNumber(timeMetrics?.averageTimePerQuestion || 0),
      formatted: formatDuration(
        intervalToDuration({ start: 0, end: toNumber(timeMetrics?.averageTimePerQuestion || 0) * 1000 })
      )
    },
    byDifficulty: (timeMetrics?.timeByDifficulty || []).map((t: any) => {
      // Handle different possible data structures from raw SQL
      const level = t.level || t.difficultyLevel || "Unknown";
      const averageTime = toNumber(t.averageTime || t.average || 0);
      
      return {
        level,
        averageSeconds: averageTime,
        formatted: formatDuration(
          intervalToDuration({ start: 0, end: averageTime * 1000 })
        )
      };
    })
  }

  // Format progress history with safety checks
  const formattedHistory = (userHistory || [])
    .filter((attempt: any) => attempt && attempt.id !== quizAttempt.id) // Exclude current attempt
    .map((attempt: any, index: number, array: any[]): { testId: string; score: number; date: string; improvement: number } | null => {
      if (!attempt) {
        console.error("Invalid attempt in history");
        return null;
      }
      
      try {
        const prevIndex = index + 1;
        const score = toNumber(attempt.percentageScore || 0);
        const prevScore = (prevIndex < array.length && array[prevIndex]) 
          ? toNumber(array[prevIndex].percentageScore || 0)
          : 0;
        const improvement = score - prevScore;
        
        return {
          testId: attempt.id,
          score,
          date: attempt.completedAt?.toISOString() || attempt.startedAt?.toISOString() || new Date().toISOString(),
          improvement
        };
      } catch (err) {
        console.error("Error processing history item:", err);
        return {
          testId: attempt.id || "unknown",
          score: 0,
          date: new Date().toISOString(),
          improvement: 0
        };
      }
    })
    .filter((item): item is { testId: string; score: number; date: string; improvement: number } => 
      item !== null
    ); // Remove any null entries with proper type guard

  // Format question details with safety checks
  const questionDetails = (quizAttempt.questions || []).map((q: any) => {
    if (!q || !q.question) {
      console.error("Invalid question data:", q);
      return {
        id: "unknown",
        content: "Unknown question",
        category: null,
        service: null,
        difficulty: "Unknown",
        isCorrect: false,
        timeSpent: {
          seconds: 0,
          formatted: "0s"
        },
        userAnswer: [],
        correctAnswer: []
      };
    }
    
    try {
      const timeSpentSecs = toNumber(q.timeSpentSecs || 0);
      
      return {
        id: q.questionId || "unknown",
        content: q.question.content || "Unknown question",
        category: q.question.category?.name || null,
        service: q.question.awsService || null,
        difficulty: q.question.difficultyLevel || "Unknown",
        isCorrect: !!q.isCorrect,
        timeSpent: {
          seconds: timeSpentSecs,
          formatted: formatDuration(
            intervalToDuration({ start: 0, end: timeSpentSecs * 1000 })
          )
        },
        userAnswer: q.userAnswer ? q.userAnswer.split(',') : [],
        correctAnswer: Array.isArray(q.question.correctAnswer) ? q.question.correctAnswer : []
      };
    } catch (err) {
      console.error("Error processing question:", err);
      return {
        id: q.questionId || "unknown",
        content: "Error processing question",
        category: null,
        service: null,
        difficulty: "Unknown",
        isCorrect: false,
        timeSpent: {
          seconds: 0,
          formatted: "0s"
        },
        userAnswer: [],
        correctAnswer: []
      };
    }
  });

  return {
    user,
    currentTest,
    categoryPerformance: formattedCategoryPerformance,
    servicePerformance: formattedServicePerformance,
    difficultyBreakdown: formattedDifficultyBreakdown,
    timeAnalysis,
    progressHistory: formattedHistory,
    questionDetails
  }
} 