import { RaceRoomsList } from "@/components/race/RaceRoomsList";

export const metadata = {
  title: "Race - TypingSpot",
  description: "Challenge other typists in real-time typing races.",
};

export default function RacePage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">Typing Races</h1>
        <p className="text-muted-foreground text-center mb-8">
          Challenge other typists in real-time typing races
        </p>
        <RaceRoomsList />
      </div>
    </div>
  );
} 