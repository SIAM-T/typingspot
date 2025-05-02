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
        <AchievementsGrid />
      </div>
    </div>
  );
} 