"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/config";
import { useAuth } from "@/lib/context/auth-context";
import { motion, AnimatePresence } from "framer-motion";

type Period = "daily" | "weekly" | "monthly" | "all_time";
type Category = "wpm" | "accuracy" | "tests_completed";

interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar_url: string | null;
  score: number;
  user_id: string;
}

export function LeaderboardTable() {
  const [period, setPeriod] = useState<Period>("weekly");
  const [category, setCategory] = useState<Category>("wpm");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        // Fetch leaderboard data
        const { data: leaderboardData, error: leaderboardError } = await supabase
          .from("leaderboard_cache")
          .select(`
            id,
            user_id,
            score,
            rank,
            users:user_id (
              username,
              avatar_url
            )
          `)
          .eq("period", period)
          .eq("category", category)
          .order("rank", { ascending: true })
          .limit(100);

        if (leaderboardError) throw leaderboardError;

        const formattedEntries: LeaderboardEntry[] = leaderboardData.map((entry) => ({
          rank: entry.rank,
          username: entry.users.username,
          avatar_url: entry.users.avatar_url,
          score: entry.score,
          user_id: entry.user_id,
        }));

        setEntries(formattedEntries);

        // If user is logged in, fetch their rank
        if (user) {
          const { data: userData, error: userError } = await supabase
            .from("leaderboard_cache")
            .select(`
              id,
              user_id,
              score,
              rank,
              users:user_id (
                username,
                avatar_url
              )
            `)
            .eq("period", period)
            .eq("category", category)
            .eq("user_id", user.id)
            .single();

          if (!userError && userData) {
            setUserRank({
              rank: userData.rank,
              username: userData.users.username,
              avatar_url: userData.users.avatar_url,
              score: userData.score,
              user_id: userData.user_id,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();

    // Set up real-time subscription for updates
    const subscription = supabase
      .channel("leaderboard_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "leaderboard_cache",
          filter: `period=eq.${period} AND category=eq.${category}`,
        },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [period, category, user]);

  const formatScore = (score: number, category: Category) => {
    switch (category) {
      case "wpm":
        return `${Math.round(score)} WPM`;
      case "accuracy":
        return `${Math.round(score)}%`;
      case "tests_completed":
        return Math.round(score);
      default:
        return score;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <div className="flex gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            className="bg-secondary text-foreground px-4 py-2 rounded-md"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="all_time">All Time</option>
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="bg-secondary text-foreground px-4 py-2 rounded-md"
          >
            <option value="wpm">WPM</option>
            <option value="accuracy">Accuracy</option>
            <option value="tests_completed">Tests Completed</option>
          </select>
        </div>
      </div>

      {/* User's rank if logged in */}
      {user && userRank && (
        <div className="mb-8 p-4 bg-primary/10 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Your Ranking</h3>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold">#{userRank.rank}</span>
            <div className="flex items-center gap-2">
              {userRank.avatar_url && (
                <img
                  src={userRank.avatar_url}
                  alt={userRank.username}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="font-medium">{userRank.username}</span>
            </div>
            <span className="ml-auto font-mono">
              {formatScore(userRank.score, category)}
            </span>
          </div>
        </div>
      )}

      {/* Leaderboard table */}
      <div className="bg-card rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary/50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                  Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/30">
              <AnimatePresence>
                {entries.map((entry, index) => (
                  <motion.tr
                    key={entry.user_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className={`${
                      user && entry.user_id === user.id ? "bg-primary/10" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold">#{entry.rank}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {entry.avatar_url && (
                          <img
                            src={entry.avatar_url}
                            alt={entry.username}
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        <span className="font-medium">{entry.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-mono">
                      {formatScore(entry.score, category)}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </div>
  );
} 