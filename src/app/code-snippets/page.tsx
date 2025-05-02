import { Suspense } from "react";
import { CodeSnippetsGrid } from "@/components/code-snippets/CodeSnippetsGrid";

export const metadata = {
  title: "Code Snippets - TypingSpot",
  description: "Practice typing with real code snippets in various programming languages.",
};

function CodeSnippetsLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-32 rounded-lg border border-border bg-card animate-pulse"
        />
      ))}
    </div>
  );
}

export default function CodeSnippetsPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">Code Snippets</h1>
        <p className="text-muted-foreground text-center mb-8">
          Practice typing with real code snippets in various programming languages
        </p>
        <Suspense fallback={<CodeSnippetsLoading />}>
          <CodeSnippetsGrid />
        </Suspense>
      </div>
    </div>
  );
} 