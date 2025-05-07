/**
 * Constants used throughout the application
 */

/**
 * Subscription plan names as they appear in the database
 */
export const SUBSCRIPTION_PLANS = {
  FREE: "Free Plan",
  BASIC: "Basic Plan", 
  PRO: "Pro Plan",
  PREMIUM: "Premium Plan",
} as const;

// Create a type from the values
export type SubscriptionPlanType = typeof SUBSCRIPTION_PLANS[keyof typeof SUBSCRIPTION_PLANS];

/**
 * Feature flags for different parts of the application
 */
export const FEATURES = {
  AI_ANALYSIS: "ai_analysis",
  FLASHCARDS: "flashcards",
  LEADERBOARD: "leaderboard",
} as const;

/**
 * Application-wide time constants (in milliseconds)
 */
export const TIME = {
  ONE_MINUTE: 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
  ONE_WEEK: 7 * 24 * 60 * 60 * 1000,
} as const;