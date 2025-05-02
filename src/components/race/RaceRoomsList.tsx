"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/config";
import { useAuth } from "@/lib/context/auth-context";
import type { RaceRoom } from "@/lib/types/race";
import Link from "next/link";

export function RaceRoomsList() {
  const [rooms, setRooms] = useState<RaceRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("race_rooms")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setRooms(data);
      } catch (error) {
        console.error("Error fetching race rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();

    // Subscribe to race rooms changes
    const subscription = supabase
      .channel("race_rooms")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "race_rooms",
        },
        () => {
          fetchRooms();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const createRoom = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("race_rooms")
        .insert({
          name: `${user.user_metadata.username}'s Room`,
          host_id: user.id,
          status: "waiting",
          max_players: 5,
          current_players: 1,
          text_id: "random", // You'll need to implement text selection
        })
        .select()
        .single();

      if (error) throw error;

      // Create initial participant (host)
      await supabase.from("race_participants").insert({
        room_id: data.id,
        user_id: user.id,
        status: "waiting",
        progress: 0,
        wpm: 0,
        accuracy: 0,
      });

      // Redirect to the new room
      window.location.href = `/race/${data.id}`;
    } catch (error) {
      console.error("Error creating race room:", error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Create room button */}
      <div className="flex justify-end mb-8">
        <button
          onClick={createRoom}
          disabled={!user}
          className="px-6 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Room
        </button>
      </div>

      {/* Rooms grid */}
      <div className="grid gap-4">
        {rooms.map((room) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{room.name}</h3>
              <span
                className={`px-3 py-1 rounded-full text-xs ${
                  room.status === "waiting"
                    ? "bg-green-500/20 text-green-500"
                    : room.status === "in_progress"
                    ? "bg-yellow-500/20 text-yellow-500"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {room.status}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {room.current_players} / {room.max_players} players
              </span>
              <Link
                href={`/race/${room.id}`}
                className="px-4 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                Join
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Empty state */}
      {!loading && rooms.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No active races</h3>
          <p className="text-muted-foreground">
            Create a room to start racing with others!
          </p>
        </div>
      )}
    </div>
  );
} 