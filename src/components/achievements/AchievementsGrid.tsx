"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/config";
import { useAuth } from '@/components/providers/AuthProvider';
import type { Achievement, UserAchievement } from "@/lib/types/achievements";

export function AchievementsGrid() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Achievement["category"] | "all">("all");

  useEffect(() => {
    const fetchAchievements = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        // First, fetch all achievements
        const { data: allAchievements, error: achievementsError } = await supabase
          .from('achievements')
          .select('*');

        if (achievementsError) {
          throw new Error(`Error fetching achievements: ${achievementsError.message}`);
        }

        // Then fetch user's achievement progress
        const { data: userAchievements, error: userAchievementsError } = await supabase
          .from('user_achievements')
          .select(`
            id,
            achievement_id,
            unlocked_at,
            progress
          `)
          .eq('user_id', user.id);

        if (userAchievementsError) {
          throw new Error(`Error fetching user achievements: ${userAchievementsError.message}`);
        }

        // Combine the data
        const achievementsProgress = allAchievements.map(achievement => {
          const userProgress = userAchievements?.find(
            ua => ua.achievement_id === achievement.id
          );

          return {
            id: achievement.id,
            achievement: achievement,
            unlocked_at: userProgress?.unlocked_at || null,
            progress: userProgress?.progress || 0,
          };
        });

        setAchievements(achievementsProgress);
      } catch (error) {
        console.error("Error fetching achievements:", error);
        setError(error instanceof Error ? error.message : "Failed to load achievements");
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [user]);

  const filteredAchievements = achievements.filter(
    (a) => selectedCategory === "all" || a.achievement.category === selectedCategory
  );

  const categories: Achievement["category"][] = [
    "speed",
    "accuracy",
    "consistency",
    "dedication",
    "special",
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-lg border border-border bg-card animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-full ${
            selectedCategory === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary hover:bg-secondary/80"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full capitalize ${
              selectedCategory === category
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Achievements grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredAchievements.map(({ id, achievement, unlocked_at }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-lg ${
              unlocked_at ? "bg-primary/10" : "bg-secondary/50"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  unlocked_at ? "bg-primary" : "bg-secondary"
                }`}
              >
                {achievement.icon_url ? (
                  <img
                    src={achievement.icon_url}
                    alt=""
                    className="h-full w-full"
                  />
                ) : (
                  <div className="h-full w-full rounded-full bg-primary/20" />
                )}
              </div>
              <div>
                <h3 className="font-semibold">{achievement.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {achievement.description}
                </p>
              </div>
            </div>
            {unlocked_at && (
              <div className="text-xs text-muted-foreground mt-2">
                Unlocked {new Date(unlocked_at).toLocaleDateString()}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
} 