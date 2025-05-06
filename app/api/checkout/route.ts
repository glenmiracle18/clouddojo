import { Checkout } from "@polar-sh/nextjs";
import { NextResponse } from "next/server";

// This handler creates a Polar checkout session and returns the URL
export const GET = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/confirmation?checkout_id={CHECKOUT_ID}`,
  mode: "subscription"
});

// Error handling middleware
export const runtime = "edge";

export async function POST() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}