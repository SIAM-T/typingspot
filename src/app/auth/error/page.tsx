"use client";

import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Suspense } from 'react'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') || 'An error occurred during authentication'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md space-y-8 text-center"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-destructive">Authentication Error</h1>
        <p className="text-muted-foreground">
          {error}
        </p>
      </div>

      <div className="space-y-4">
        <Button asChild className="w-full">
          <Link href="/login">
            Try Again
          </Link>
        </Button>
        <Button variant="outline" asChild className="w-full">
          <Link href="/">
            Go Home
          </Link>
        </Button>
      </div>
    </motion.div>
  )
}

function AuthErrorLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={<AuthErrorLoading />}>
        <AuthErrorContent />
      </Suspense>
    </div>
  )
} 