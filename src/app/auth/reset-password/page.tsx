import { Suspense } from 'react';
import { ResetPassword } from '@/components/auth/ResetPassword';

function ResetPasswordLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="container flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Suspense fallback={<ResetPasswordLoading />}>
          <ResetPassword />
        </Suspense>
      </div>
    </div>
  );
}