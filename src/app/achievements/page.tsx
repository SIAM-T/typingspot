import { Suspense } from "react";
import { AchievementsGrid } from "@/components/achievements/AchievementsGrid";

export const metadata = {
  title: "Achievements - TypingSpot",
  description: "Track your typing milestones and unlock achievements as you improve.",
};

export default function AchievementsPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">Achievements</h1>
        <p className="text-muted-foreground text-center mb-8">
          Track your typing milestones and unlock achievements as you improve
        </p>
        <Suspense fallback={<AchievementsLoadingFallback />}>
          <AchievementsGrid />
        </Suspense>
      </div>
    </div>
  );
}

function AchievementsLoadingFallback() {
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