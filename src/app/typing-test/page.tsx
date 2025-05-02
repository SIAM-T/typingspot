import { Suspense } from "react";
import { TypingTest } from "@/components/typing-test/TypingTest"

function TypingTestLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

export default function TypingTestPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={<TypingTestLoading />}>
          <TypingTest />
        </Suspense>
      </div>
    </main>
  )
} 