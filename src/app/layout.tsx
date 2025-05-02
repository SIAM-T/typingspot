import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Navbar } from "@/components/layout/navbar";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TypingSpot - Type Fast. Type Smart. Rule the Keyboard.",
  description: "The most fun and feature-rich typing platform. Improve your typing speed with games, lessons, and multiplayer challenges.",
  keywords: ["typing test", "typing games", "learn typing", "typing speed", "WPM test", "code typing", "programming practice"],
  authors: [{ name: "TypingSpot" }],
  metadataBase: new URL('https://advanced-typingspot.onrender.com'),
  openGraph: {
    title: "TypingSpot - Type Fast. Type Smart. Rule the Keyboard.",
    description: "The most fun and feature-rich typing platform. Improve your typing speed with games, lessons, and multiplayer challenges.",
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
    description: 'The most fun and feature-rich typing platform. Improve your typing speed with games, lessons, and multiplayer challenges.',
    images: ['/og-image.jpg'],
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
