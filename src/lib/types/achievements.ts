export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'speed' | 'accuracy' | 'consistency' | 'dedication' | 'special';
  requirement: number;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  achievement?: Achievement;
}

export interface AchievementProgress {
  achievement: Achievement;
  progress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
} 