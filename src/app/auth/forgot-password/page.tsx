import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { Suspense } from 'react';

function ForgotPasswordLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={<ForgotPasswordLoading />}>
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
} 