import { Suspense } from 'react';
import { VerificationSuccessContent } from '@/components/auth/VerificationSuccessContent';

function VerificationSuccessLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

export default function VerificationSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={<VerificationSuccessLoading />}>
        <VerificationSuccessContent />
      </Suspense>
    </div>
  );
} 