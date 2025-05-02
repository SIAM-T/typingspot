import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/lib/context/auth-context";
import { Navbar } from "@/components/layout/navbar";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TypingSpot - Type Fast. Type Smart. Rule the Keyboard.",
  description: "The most fun and feature-rich typing platform. Improve your typing speed with games, lessons, and multiplayer challenges.",
  keywords: ["typing test", "typing games", "learn typing", "typing speed", "WPM test"],
  authors: [{ name: "TypingSpot" }],
  openGraph: {
    title: "TypingSpot - Type Fast. Type Smart. Rule the Keyboard.",
    description: "The most fun and feature-rich typing platform. Improve your typing speed with games, lessons, and multiplayer challenges.",
    type: "website",
    locale: "en_US",
    siteName: "TypingSpot",
  },
};

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
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen bg-background">
              {children}
            </main>
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
