import { supabase } from "@/lib/supabase/config";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement_type: string;
  requirement_value: number;
}

interface UserStats {
  total_tests: number;
  best_wpm: number;
  average_accuracy: number;
  code_tests_completed: number;
  accuracy_streak: number;
}

export async function checkAndUpdateAchievements(userId: string) {
  try {
    // Get all achievements
    const { data: achievements, error: achievementsError } = await supabase
      .from("achievements")
      .select("*");

    if (achievementsError) throw achievementsError;

    // Get user's current achievements
    const { data: userAchievements, error: userAchievementsError } = await supabase
      .from("user_achievements")
      .select("achievement_id")
      .eq("user_id", userId);

    if (userAchievementsError) throw userAchievementsError;

    const unlockedAchievementIds = new Set(userAchievements?.map(ua => ua.achievement_id) || []);

    // Get user's typing results
    const { data: results, error: resultsError } = await supabase
      .from("typing_results")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (resultsError) throw resultsError;

    // Only proceed if there are actual results
    if (!results || results.length === 0) {
      return [];
    }

    // Calculate user stats
    const stats: UserStats = {
      total_tests: results.length,
      best_wpm: Math.max(...results.map(r => r.wpm), 0),
      average_accuracy: results.reduce((acc, r) => acc + r.accuracy, 0) / results.length,
      code_tests_completed: results.filter(r => r.text_type === "code").length,
      accuracy_streak: calculateAccuracyStreak(results)
    };

    // Check each achievement
    const newAchievements: Achievement[] = [];
    for (const achievement of achievements || []) {
      if (unlockedAchievementIds.has(achievement.id)) continue;

      // Only check achievements if minimum requirements are met
      if (stats.total_tests >= 1 && hasMetRequirement(achievement, stats)) {
        newAchievements.push(achievement);
        
        // Insert new achievement
        const { error: insertError } = await supabase
          .from("user_achievements")
          .insert({
            user_id: userId,
            achievement_id: achievement.id
          });

        if (insertError) throw insertError;
      }
    }

    return newAchievements;
  } catch (error) {
    console.error("Error checking achievements:", error);
    return [];
  }
}

function hasMetRequirement(achievement: Achievement, stats: UserStats): boolean {
  // Add minimum test requirements for each achievement type
  switch (achievement.requirement_type) {
    case "wpm":
      return stats.total_tests >= 3 && stats.best_wpm >= achievement.requirement_value;
    case "accuracy":
      return stats.total_tests >= 3 && stats.average_accuracy >= achievement.requirement_value;
    case "tests_completed":
      return stats.total_tests >= achievement.requirement_value;
    case "code_tests_completed":
      return stats.code_tests_completed >= achievement.requirement_value;
    case "accuracy_streak":
      return stats.accuracy_streak >= achievement.requirement_value;
    default:
      return false;
  }
}

function calculateAccuracyStreak(results: any[]): number {
  if (!results || results.length === 0) return 0;
  
  let streak = 0;
  let maxStreak = 0;
  let currentStreak = 0;

  // Sort results by date to ensure proper streak calculation
  const sortedResults = [...results].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  for (const result of sortedResults) {
    if (result.accuracy >= 95) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return maxStreak;
} 