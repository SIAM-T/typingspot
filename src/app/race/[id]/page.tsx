import { RaceRoom } from "@/components/race/RaceRoom";
import { Suspense } from "react";

interface RaceRoomPageProps {
  params: {
    id: string;
  };
}

export const metadata = {
  title: "Race Room - TypingSpot",
  description: "Join a typing race and compete with others in real-time.",
};

function RaceRoomLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

export default function RaceRoomPage({ params }: RaceRoomPageProps) {
  return (
    <div className="container py-8 md:py-12">
      <Suspense fallback={<RaceRoomLoading />}>
        <RaceRoom roomId={params.id} />
      </Suspense>
    </div>
  );
} 