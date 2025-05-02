export interface RaceRoom {
  id: string;
  name: string;
  host_id: string;
  status: "waiting" | "starting" | "in_progress" | "finished";
  max_players: number;
  current_players: number;
  text_id: string;
  created_at: string;
  starts_at?: string;
  ends_at?: string;
}

export interface RaceParticipant {
  id: string;
  room_id: string;
  user_id: string;
  status: "waiting" | "ready" | "racing" | "finished" | "disconnected";
  progress: number;
  wpm: number;
  accuracy: number;
  position?: number;
  finished_at?: string;
  user?: {
    username: string;
    avatar_url: string | null;
  };
}

export interface RaceState {
  room: RaceRoom;
  participants: RaceParticipant[];
  countdown?: number;
} 