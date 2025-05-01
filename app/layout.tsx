import type React from "react";
import "../styles/globals.css";
import { Inter } from "next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Providers from "@/components/providers";
import { Spotlight } from "@/components/spotlight";
import Script from 'next/script';
import * as seline from '@seline-analytics/web';
import { Analytics } from "@vercel/analytics/react"

const selineToken = process.env.ELINE_TOKEN;
seline.init({
  // Token is *required* when tracking subdomains or multiple domains.
  token: selineToken,
  // By default, we track all page views automatically.
  // But if you want manual tracking with seline.page(), you can set autoPageView to false.
  autoPageView: false,
  // Skip tracking of provided pages, wildcard * is supported
  skipPatterns: ['/about', '/blog/*'],
  // Mask parts of pages that match provided patterns, wildcard * is supported
  maskPatterns: ['/customer/*/order/*'],
  // Set to true to automatically set an ID to visitor's browser as a first-party cookie when you identify them.
  cookieOnIdentify: true,
});

const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: "AWS Certification Prep",
  description:
    "Prepare for your AWS certification exams with interactive practice questions",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <html lang="en" className="dark:dark">
      <head>
        <Script async src="https://cdn.seline.com/seline.js" data-token="9b13f9d446740a0"></Script>
      </head>
      <body className={`${inter.className} dark:bg-gray-900`}>
        <Providers>
          <Spotlight
            className="-top-40 left-0 md:-top-20 md:left-60"
            fill="white"
          />
          <Analytics />
          {children}
        </Providers>
      </body>
    </html>
  );
}
