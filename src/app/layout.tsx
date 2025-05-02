import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Navbar } from "@/components/layout/navbar";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TypingSpot - Type Fast. Type Smart. Rule the Keyboard.",
  description: "Master typing with TypingSpot's interactive lessons, real-time typing tests, code practice, and multiplayer challenges. Track your WPM, accuracy, and compete with others.",
  keywords: [
    "typing test",
    "typing speed test",
    "WPM calculator",
    "typing practice",
    "code typing practice",
    "programming typing practice",
    "touch typing",
    "typing games",
    "learn typing",
    "improve typing speed",
    "online typing test",
    "multiplayer typing",
    "typing competition"
  ],
  authors: [{ name: "TypingSpot" }],
  metadataBase: new URL('https://advanced-typingspot.onrender.com'),
  alternates: {
    canonical: 'https://advanced-typingspot.onrender.com'
  },
  openGraph: {
    title: "TypingSpot - Type Fast. Type Smart. Rule the Keyboard.",
    description: "Master typing with TypingSpot's interactive lessons, real-time typing tests, code practice, and multiplayer challenges. Track your WPM, accuracy, and compete with others.",
    url: 'https://advanced-typingspot.onrender.com',
    type: "website",
    locale: "en_US",
    siteName: "TypingSpot",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TypingSpot - Improve your typing speed'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TypingSpot - Type Fast. Type Smart. Rule the Keyboard.',
    description: 'Master typing with TypingSpot\'s interactive lessons, real-time typing tests, code practice, and multiplayer challenges.',
    images: ['/og-image.jpg'],
    creator: '@typingspot'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification_token',
  },
  category: 'Education',
};

function AuthLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <Script id="schema-org" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "TypingSpot",
              "url": "https://advanced-typingspot.onrender.com",
              "description": "Master typing with TypingSpot's interactive lessons, real-time typing tests, code practice, and multiplayer challenges.",
              "applicationCategory": "Education",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0"
              },
              "featureList": [
                "Real-time typing tests",
                "Code typing practice",
                "Multiplayer challenges",
                "Progress tracking",
                "Achievement system",
                "Customizable settings"
              ]
            }
          `}
        </Script>
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<AuthLoading />}>
            <AuthProvider>
              <Navbar />
              <main className="min-h-screen bg-background">
                {children}
              </main>
            </AuthProvider>
          </Suspense>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
