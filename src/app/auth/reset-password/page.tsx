import { Suspense } from 'react';
import { ResetPassword } from '@/components/auth/ResetPassword';

function ResetPasswordLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="container flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <div className="w-full max-w-md">
        <Suspense fallback={<ResetPasswordLoading />}>
          <ResetPassword />
        </Suspense>
      </div>
    </main>
  );
}