import { Suspense } from 'react';
import { VerifyClientContent } from '@/components/verify/VerifyClientContent';

function VerifyLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={<VerifyLoading />}>
        <VerifyClientContent />
      </Suspense>
    </div>
  );
} 