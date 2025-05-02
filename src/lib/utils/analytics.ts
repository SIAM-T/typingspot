import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/types/supabase';

export interface TypingStats {
  wpm: number;
  accuracy: number;
  timestamp: Date;
  duration: number;
  characterCount: number;
  errorCount: number;
  testType: 'practice' | 'race' | 'code';
}

export interface UserStats {
  averageWPM: number;
  averageAccuracy: number;
  totalTests: number;
  totalTimePracticed: number;
  bestWPM: number;
  recentProgress: {
    date: string;
    wpm: number;
    accuracy: number;
  }[];
  testDistribution: {
    practice: number;
    race: number;
    code: number;
  };
  accuracyOverTime: {
    date: string;
    accuracy: number;
  }[];
  commonErrors: {
    character: string;
    count: number;
  }[];
  dailyStreak: number;
  rank: number;
  level: number;
}

export class AnalyticsManager {
  private supabase = createClientComponentClient<Database>();

  async saveTypingTest(stats: TypingStats): Promise<void> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await this.supabase
        .from('typing_tests')
        .insert({
          user_id: user.id,
          wpm: stats.wpm,
          accuracy: stats.accuracy,
          duration: stats.duration,
          character_count: stats.characterCount,
          error_count: stats.errorCount,
          test_type: stats.testType,
          timestamp: stats.timestamp.toISOString(),
        });

      if (error) throw error;

      // Update user's daily streak
      await this.updateDailyStreak();
      
      // Update user's level based on new test
      await this.updateUserLevel(stats);

    } catch (error) {
      console.error('Error saving typing test:', error);
      throw error;
    }
  }

  async getUserStats(userId?: string): Promise<UserStats> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      const targetUserId = userId || user?.id;
      if (!targetUserId) throw new Error('User ID not provided');

      // Get all user's typing tests
      const { data: tests, error } = await this.supabase
        .from('typing_tests')
        .select('*')
        .eq('user_id', targetUserId)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      if (!tests) return this.getEmptyStats();

      // Calculate average WPM and accuracy
      const averageWPM = tests.reduce((acc, test) => acc + test.wpm, 0) / (tests.length || 1);
      const averageAccuracy = tests.reduce((acc, test) => acc + test.accuracy, 0) / (tests.length || 1);
      const bestWPM = Math.max(...tests.map(test => test.wpm));
      const totalTimePracticed = tests.reduce((acc, test) => acc + test.duration, 0);

      // Calculate test distribution
      const testDistribution = {
        practice: tests.filter(t => t.test_type === 'practice').length,
        race: tests.filter(t => t.test_type === 'race').length,
        code: tests.filter(t => t.test_type === 'code').length,
      };

      // Get recent progress (last 7 days)
      const recentProgress = this.calculateRecentProgress(tests);

      // Calculate accuracy over time
      const accuracyOverTime = this.calculateAccuracyOverTime(tests);

      // Get common errors
      const commonErrors = await this.getCommonErrors(targetUserId);

      // Get user's rank and streak
      const { rank, dailyStreak } = await this.getUserRankAndStreak(targetUserId);

      // Get user's level
      const level = this.calculateUserLevel(tests);

      return {
        averageWPM,
        averageAccuracy,
        totalTests: tests.length,
        totalTimePracticed,
        bestWPM,
        recentProgress,
        testDistribution,
        accuracyOverTime,
        commonErrors,
        dailyStreak,
        rank,
        level,
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return this.getEmptyStats();
    }
  }

  private getEmptyStats(): UserStats {
    return {
      averageWPM: 0,
      averageAccuracy: 0,
      totalTests: 0,
      totalTimePracticed: 0,
      bestWPM: 0,
      recentProgress: [],
      testDistribution: { practice: 0, race: 0, code: 0 },
      accuracyOverTime: [],
      commonErrors: [],
      dailyStreak: 0,
      rank: 0,
      level: 1,
    };
  }

  private calculateRecentProgress(tests: any[]): { date: string; wpm: number; accuracy: number; }[] {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayTests = tests.filter(t => t.timestamp.startsWith(date));
      return {
        date,
        wpm: dayTests.reduce((acc, t) => acc + t.wpm, 0) / (dayTests.length || 1),
        accuracy: dayTests.reduce((acc, t) => acc + t.accuracy, 0) / (dayTests.length || 1),
      };
    });
  }

  private calculateAccuracyOverTime(tests: any[]): { date: string; accuracy: number; }[] {
    const sortedTests = [...tests].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    return sortedTests.map(test => ({
      date: test.timestamp.split('T')[0],
      accuracy: test.accuracy,
    }));
  }

  private async getCommonErrors(userId: string): Promise<{ character: string; count: number; }[]> {
    try {
      const { data, error } = await this.supabase
        .from('typing_errors')
        .select('character, count')
        .eq('user_id', userId)
        .order('count', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting common errors:', error);
      return [];
    }
  }

  private async getUserRankAndStreak(userId: string): Promise<{ rank: number; dailyStreak: number; }> {
    try {
      // Get user's rank based on average WPM
      const { data: rankings } = await this.supabase
        .rpc('get_user_rank', { target_user_id: userId });

      // Get user's daily streak
      const { data: streakData } = await this.supabase
        .from('user_stats')
        .select('daily_streak')
        .eq('user_id', userId)
        .single();

      return {
        rank: rankings?.[0]?.rank || 0,
        dailyStreak: streakData?.daily_streak || 0,
      };
    } catch (error) {
      console.error('Error getting rank and streak:', error);
      return { rank: 0, dailyStreak: 0 };
    }
  }

  private async updateDailyStreak(): Promise<void> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) return;

      await this.supabase.rpc('update_daily_streak', { user_id: user.id });
    } catch (error) {
      console.error('Error updating daily streak:', error);
    }
  }

  private calculateUserLevel(tests: any[]): number {
    // Base level calculation on total tests and average performance
    const baseLevel = Math.floor(tests.length / 10) + 1;
    const averageWPM = tests.reduce((acc, test) => acc + test.wpm, 0) / (tests.length || 1);
    const wpmBonus = Math.floor(averageWPM / 20);
    
    return Math.min(100, baseLevel + wpmBonus); // Cap at level 100
  }

  private async updateUserLevel(stats: TypingStats): Promise<void> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) return;

      // Get user's current stats
      const userStats = await this.getUserStats(user.id);
      
      // Update level in database if changed
      if (userStats.level !== this.calculateUserLevel([...userStats.recentProgress, stats])) {
        await this.supabase
          .from('user_stats')
          .update({ level: userStats.level })
          .eq('user_id', user.id);
      }
    } catch (error) {
      console.error('Error updating user level:', error);
    }
  }
}

export const analyticsManager = new AnalyticsManager(); 