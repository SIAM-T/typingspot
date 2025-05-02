import { CodeSnippetsGrid } from "@/components/code-snippets/CodeSnippetsGrid";

export const metadata = {
  title: "Code Snippets - TypingSpot",
  description: "Practice typing with real code snippets in various programming languages.",
};

export default function CodeSnippetsPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">Code Snippets</h1>
        <p className="text-muted-foreground text-center mb-8">
          Practice typing with real code snippets in various programming languages
        </p>
        <CodeSnippetsGrid />
      </div>
    </div>
  );
} 