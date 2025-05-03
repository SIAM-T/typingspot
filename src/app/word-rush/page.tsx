import { Suspense } from "react";
import { WordRush } from "@/components/word-rush/WordRush";

function WordRushLoading() {
  return (
    <div className="flex items-center justify-center min-h-[600px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

export default function WordRushPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Word Rush</h1>
          <p className="text-muted-foreground">
            Type the falling words before they hit the bottom! Build combos for bonus points!
          </p>
        </div>
        
        <Suspense fallback={<WordRushLoading />}>
          <WordRush />
        </Suspense>
      </div>
    </main>
  );
} 