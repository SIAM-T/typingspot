import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { AdminProvider } from "@/components/providers/AdminProvider";
import { Navbar } from "@/components/layout/navbar";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

const title = 'TypingSpot - Free Online Typing Test and Practice';
const description = 'Improve your typing speed with TypingSpot\'s free online typing tests, games, and practice exercises. Track your WPM, accuracy, and progress over time.';

export const metadata: Metadata = {
  metadataBase: new URL('https://typingspot.online'),
  title: {
    template: '%s | TypingSpot - Improve Your Typing Speed',
    default: 'TypingSpot - Free Online Typing Test and Practice'
  },
  description,
  keywords: [
    'typing test',
    'typing speed',
    'wpm calculator',
    'typing practice',
    'typing games',
    'touch typing',
    'typing tutor',
    'online typing test',
    'free typing test',
    'typing speed test',
    'typing skills',
    'improve typing speed',
    'typing speed calculator',
    'typing test certificate',
    'professional typing test',
    'typing speed checker'
  ],
  authors: [{ name: 'TypingSpot' }],
  creator: 'TypingSpot',
  publisher: 'TypingSpot',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://typingspot.online',
    siteName: 'TypingSpot',
    title: 'TypingSpot - Free Online Typing Test and Practice',
    description: 'Improve your typing speed with TypingSpot\'s free online typing tests, games, and practice exercises. Track your WPM, accuracy, and progress over time.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TypingSpot - Free Online Typing Test and Practice'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TypingSpot - Free Online Typing Test and Practice',
    description: 'Improve your typing speed with TypingSpot\'s free online typing tests, games, and practice exercises. Track your WPM, accuracy, and progress over time.',
    images: ['/twitter-image.png'],
    creator: '@typingspot',
    site: '@typingspot'
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || '',
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || ''
    }
  },
  alternates: {
    canonical: 'https://typingspot.online',
    languages: {
      'en-US': 'https://typingspot.online',
      'en-GB': 'https://typingspot.online',
      'en-CA': 'https://typingspot.online',
      'en-AU': 'https://typingspot.online'
    }
  },
  other: {
    category: 'Education',
    classification: 'Typing Test, Educational Tool'
  }
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
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        
        {/* Preconnect to important origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL} />
        
        {/* Structured data for rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "TypingSpot",
                "url": "https://typingspot.online",
                "description": description,
                "applicationCategory": "EducationalApplication",
                "operatingSystem": "Any",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.8",
                  "ratingCount": "1250"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "url": "https://typingspot.online",
                "name": "TypingSpot",
                "description": description,
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://typingspot.online/search?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "url": "https://typingspot.online",
                "name": "TypingSpot",
                "logo": "https://typingspot.online/logo.png",
                "sameAs": [
                  "https://twitter.com/typingspot",
                  "https://www.facebook.com/typingspot",
                  "https://www.linkedin.com/company/typingspot"
                ]
              }
            ])
          }}
        />
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
              <AdminProvider>
                <Navbar />
                <main className="min-h-screen bg-background">
                  {children}
                </main>
              </AdminProvider>
            </AuthProvider>
          </Suspense>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
