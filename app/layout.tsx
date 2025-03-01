import type React from "react";
import "../styles/globals.css";
import { Inter } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: "AWS Certification Prep",
  description:
    "Prepare for your AWS certification exams with interactive practice questions",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
          <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
