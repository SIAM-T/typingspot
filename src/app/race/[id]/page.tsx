import { RaceRoom } from "@/components/race/RaceRoom";

interface RaceRoomPageProps {
  params: {
    id: string;
  };
}

export const metadata = {
  title: "Race Room - TypingSpot",
  description: "Join a typing race and compete with others in real-time.",
};

export default function RaceRoomPage({ params }: RaceRoomPageProps) {
  return (
    <div className="container py-8 md:py-12">
      <RaceRoom roomId={params.id} />
    </div>
  );
} 