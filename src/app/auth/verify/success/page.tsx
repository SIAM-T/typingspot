'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function VerificationSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to login after 5 seconds
    const timeout = setTimeout(() => {
      router.push('/login');
    }, 5000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Email Verified!</h1>
          <p className="text-muted-foreground">
            Your email has been successfully verified. You can now log in to your account.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You will be automatically redirected to the login page in 5 seconds...
          </p>
          
          <Button
            onClick={() => router.push('/login')}
            className="w-full"
          >
            Go to Login
          </Button>
        </div>
      </div>
    </div>
  );
} 