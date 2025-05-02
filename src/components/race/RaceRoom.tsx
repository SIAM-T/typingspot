"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/providers/AuthProvider";
import socket, { raceEvents } from "@/lib/socket";
import type { RaceState, RaceParticipant } from "@/lib/types/race";
import { useToast } from "@/components/ui/use-toast";

interface RaceRoomProps {
  roomId: string;
}

export function RaceRoom({ roomId }: RaceRoomProps) {
  const [raceState, setRaceState] = useState<RaceState | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<Array<{ playerId: string; message: string; timestamp: Date }>>([]);
  const [messageInput, setMessageInput] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    // Connect to Socket.IO server
    socket.auth = { token: user.id };
    socket.connect();

    // Join race room
    socket.emit(raceEvents.JOIN_ROOM, roomId);

    // Listen for room updates
    socket.on(raceEvents.ROOM_UPDATE, (update: any) => {
      switch (update.type) {
        case 'player_joined':
          toast({
            title: 'Player joined',
            description: 'A new player has joined the race.',
          });
          break;
        case 'player_left':
          toast({
            title: 'Player left',
            description: 'A player has left the race.',
          });
          break;
        case 'player_ready':
          toast({
            title: 'Player ready',
            description: 'A player is ready to race!',
          });
          break;
        case 'player_finished':
          toast({
            title: 'Player finished',
            description: 'A player has finished the race!',
          });
          break;
      }
    });

    // Listen for progress updates
    socket.on(raceEvents.PROGRESS_UPDATE, (data: { playerId: string; progress: number; wpm: number }) => {
      setRaceState((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          participants: prev.participants.map((p) =>
            p.user_id === data.playerId
              ? { ...p, progress: data.progress, wpm: data.wpm }
              : p
          ),
        };
      });
    });

    // Listen for chat messages
    socket.on(raceEvents.RECEIVE_MESSAGE, (message) => {
      setChatMessages((prev) => [...prev, message]);
    });

    // Cleanup on unmount
    return () => {
      socket.emit(raceEvents.LEAVE_ROOM, roomId);
      socket.disconnect();
    };
  }, [user, roomId, toast]);

  const sendMessage = () => {
    if (!messageInput.trim()) return;
    socket.emit(raceEvents.SEND_MESSAGE, {
      roomId,
      message: messageInput.trim(),
    });
    setMessageInput("");
  };

  const toggleReady = () => {
    if (!user || !raceState) return;
    socket.emit(raceEvents.PLAYER_READY, roomId);
  };

  const updateProgress = (progress: number, wpm: number) => {
    socket.emit(raceEvents.PROGRESS_UPDATE, {
      roomId,
      progress,
      wpm,
    });
  };

  const finishRace = () => {
    socket.emit(raceEvents.PLAYER_FINISHED, roomId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!raceState) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold">Race room not found</h2>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 space-y-8">
      {/* Room header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">{raceState.room.name}</h2>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            {raceState.participants.length} / {raceState.room.max_players} players
          </span>
          <span className="capitalize">Status: {raceState.room.status}</span>
        </div>
      </div>

      {/* Participants list */}
      <div className="grid gap-4">
        {raceState.participants.map((participant) => (
          <motion.div
            key={participant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-card"
          >
            <div className="flex items-center gap-4">
              {participant.user?.avatar_url && (
                <img
                  src={participant.user.avatar_url}
                  alt={participant.user?.username}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div>
                <div className="font-medium">{participant.user?.username}</div>
                <div className="text-sm text-muted-foreground capitalize">
                  {participant.status}
                </div>
              </div>
              <div className="ml-auto text-right">
                <div className="font-mono">{Math.round(participant.wpm)} WPM</div>
                <div className="text-sm text-muted-foreground">
                  {Math.round(participant.accuracy)}% accuracy
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${participant.progress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chat section */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="h-48 overflow-y-auto space-y-2">
          {chatMessages.map((msg, i) => (
            <div key={i} className="flex gap-2">
              <span className="font-medium">
                {raceState.participants.find((p) => p.user_id === msg.playerId)?.user?.username}:
              </span>
              <span>{msg.message}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 rounded-md bg-secondary"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
          >
            Send
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={toggleReady}
          disabled={raceState.room.status !== "waiting"}
          className="px-6 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {raceState.participants.find((p) => p.user_id === user?.id)?.status === "ready"
            ? "Not Ready"
            : "Ready"}
        </button>
      </div>
    </div>
  );
} 