import { Webhooks } from "@polar-sh/nextjs";
import { api } from "@/lib/polar";

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onPayload: async (payload) => {
    console.log("Received webhook payload:", payload);
  },
  onCheckoutCreated: async (checkout) => {
    console.log("New checkout created:", checkout);
  },
  onOrderCreated: async (order) => {
    console.log("New order created:", order);
    // Here you can update your database, send emails, etc.
  },
  onSubscriptionActive: async (subscription) => {
    console.log("Subscription activated:", subscription);
    // Here you can grant access to premium features
  },
  onSubscriptionCanceled: async (subscription) => {
    console.log("Subscription canceled:", subscription);
    // Here you can handle subscription cancellation
  }
}); 