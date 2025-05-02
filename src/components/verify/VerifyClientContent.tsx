"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase/config';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export function VerifyClientContent() {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md space-y-8 text-center"
    >
      {verificationStatus === 'loading' && (
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Verifying your email...</p>
        </div>
      )}

      {verificationStatus === 'success' && (
        <div className="flex flex-col items-center space-y-4">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
          <h1 className="text-2xl font-bold">Email Verified!</h1>
          <p className="text-muted-foreground">
            Your email has been verified successfully. Redirecting to login...
          </p>
        </div>
      )}

      {verificationStatus === 'error' && (
        <div className="flex flex-col items-center space-y-4">
          <XCircle className="h-12 w-12 text-destructive" />
          <h1 className="text-2xl font-bold text-destructive">Verification Failed</h1>
          <p className="text-muted-foreground">
            We couldn't verify your email. The link may be invalid or expired.
          </p>
          <Button asChild>
            <Link href="/login">Return to Login</Link>
          </Button>
        </div>
      )}
    </motion.div>
  );
} 