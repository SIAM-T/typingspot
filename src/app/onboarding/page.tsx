"use client";

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from "@/components/providers/AuthProvider";
import { supabase } from '@/lib/supabase/config'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Suspense } from 'react'
import { OnboardingForm } from '@/components/onboarding/OnboardingForm'

const onboardingSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
})

type OnboardingFormData = z.infer<typeof onboardingSchema>

export default function OnboardingPage() {
  return (
    <Suspense fallback={<OnboardingLoadingFallback />}>
      <OnboardingForm />
    </Suspense>
  )
}

function OnboardingLoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-card p-8 shadow-lg animate-pulse">
        <div className="space-y-2">
          <div className="h-8 w-3/4 bg-muted rounded mx-auto" />
          <div className="h-4 w-2/3 bg-muted rounded mx-auto" />
        </div>
        <div className="space-y-4">
          <div className="h-10 w-full bg-muted rounded" />
          <div className="h-10 w-full bg-muted rounded" />
        </div>
        <div className="h-4 w-full bg-muted rounded" />
      </div>
    </div>
  )
} 