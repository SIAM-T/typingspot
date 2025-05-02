import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";

export const metadata = {
  title: "Leaderboard - TypingSpot",
  description: "Compare your typing skills with others and climb the ranks.",
};

export default function LeaderboardPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">Global Leaderboard</h1>
        <p className="text-muted-foreground text-center mb-8">
          Compare your typing skills with others and climb the ranks
        </p>
        <LeaderboardTable />
      </div>
    </div>
  );
} 