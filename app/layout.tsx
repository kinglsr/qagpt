/* eslint-disable camelcase */
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";
import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Space_Grotesk } from "next/font/google";
import type { Metadata } from "next";
import { ThemeProvider } from "@/context/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-spaceGrotesk",
});

export const metadata: Metadata = {
  title: "QA GPT | Success Begins Here",
  description: "Home Page for QAGPT.CO",
  icons: {
    icon: "/assets/images/site-logo1.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="mHDYPt0QEBGBQ7cZodwlBJTSFGeYPwMYXlGHJ4QOq2Y"
        />
      </head>
      <body className={`${inter.variable}  ${spaceGrotesk.variable}`}>
        <ClerkProvider
          appearance={{
            layout: {
              termsPageUrl: "/terms",
              privacyPageUrl: "/privacy",
            },
            variables: { colorPrimary: "red" },
          }}
        >
          <ThemeProvider>{children}</ThemeProvider>
        </ClerkProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
