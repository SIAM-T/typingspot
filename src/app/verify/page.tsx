"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase/config';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get the token from the URL
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        if (!token || type !== 'signup') {
          setVerificationStatus('error');
          return;
        }

        // Verify the email
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup',
        });

        if (error) throw error;

        setVerificationStatus('success');
        toast({
          title: 'Email Verified',
          description: 'Your email has been verified successfully. You can now sign in.',
        });

        // Redirect to login after a short delay
        setTimeout(() => {
          router.push('/login');
        }, 2000);

      } catch (error: any) {
        console.error('Verification error:', error);
        setVerificationStatus('error');
        toast({
          title: 'Verification Failed',
          description: error.message || 'Failed to verify email. Please try again.',
          variant: 'destructive',
        });
      }
    };

    verifyEmail();
  }, [searchParams, router, toast]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8 text-center"
      >
        {verificationStatus === 'loading' && (
          <div className="space-y-4">
            <Loader2 className="mx-auto h-16 w-16 animate-spin text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Verifying your email</h1>
            <p className="text-sm text-muted-foreground">
              Please wait while we verify your email address...
            </p>
          </div>
        )}

        {verificationStatus === 'success' && (
          <div className="space-y-4">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
            <h1 className="text-2xl font-bold tracking-tight">Email Verified!</h1>
            <p className="text-sm text-muted-foreground">
              Your email has been verified successfully. Redirecting to login...
            </p>
          </div>
        )}

        {verificationStatus === 'error' && (
          <div className="space-y-4">
            <XCircle className="mx-auto h-16 w-16 text-destructive" />
            <h1 className="text-2xl font-bold tracking-tight">Verification Failed</h1>
            <p className="text-sm text-muted-foreground">
              We couldn't verify your email. The link might be expired or invalid.
            </p>
            <div className="pt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/login')}
              >
                Return to Login
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
} 