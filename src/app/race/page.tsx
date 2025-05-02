import { RaceRoomsList } from "@/components/race/RaceRoomsList";
import { Suspense } from "react";

export const metadata = {
  title: "Race - TypingSpot",
  description: "Challenge other typists in real-time typing races.",
};

function RaceRoomsLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

export default function RacePage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">Typing Races</h1>
        <p className="text-muted-foreground text-center mb-8">
          Challenge other typists in real-time typing races
        </p>
        <Suspense fallback={<RaceRoomsLoading />}>
          <RaceRoomsList />
        </Suspense>
      </div>
    </div>
  );
} 