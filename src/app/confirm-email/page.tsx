"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase/config';
import { Loader2, Mail, CheckCircle2, XCircle } from 'lucide-react';

export default function ConfirmEmailPage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    const email = searchParams.get('email');
    if (email) {
      setEmail(email);
    }
  }, [searchParams]);

  const handleResendEmail = async () => {
    if (!email) return;

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;

      toast({
        title: 'Email Sent',
        description: 'Verification email has been resent. Please check your inbox.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to resend verification email.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8 text-center"
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <Mail className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Check your email</h1>
          {email && (
            <p className="text-sm text-muted-foreground">
              We've sent a verification link to <span className="font-medium">{email}</span>
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Click the link in the email to verify your account and complete the signup process.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleResendEmail}
          >
            Resend verification email
          </Button>

          <p className="text-sm text-muted-foreground">
            Already verified?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Make sure to:</p>
          <ul className="mt-2 space-y-1">
            <li>• Check your spam folder</li>
            <li>• Use the resend button if you haven't received the email</li>
            <li>• Contact support if you're still having issues</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
} 