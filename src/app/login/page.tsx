import { Suspense } from "react";
import { LoginContent } from "@/components/auth/LoginContent";

export const metadata = {
  title: "Login - TypingSpot",
  description: "Sign in to your TypingSpot account",
};

function LoginLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={<LoginLoading />}>
        <LoginContent />
      </Suspense>
    </div>
  );
} 