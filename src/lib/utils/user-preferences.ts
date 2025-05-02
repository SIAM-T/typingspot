import Cookies from 'js-cookie';

interface UserPreferences {
  soundEnabled: boolean;
  lastTestDuration: number;
  theme: string;
  keyboardLayout: string;
  showLiveWpm: boolean;
  showProgressBar: boolean;
  fontSize: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  soundEnabled: true,
  lastTestDuration: 60,
  theme: 'system',
  keyboardLayout: 'standard',
  showLiveWpm: true,
  showProgressBar: true,
  fontSize: 'medium'
};

export class UserPreferencesManager {
  private static readonly COOKIE_KEY = 'typing_spot_preferences';
  private static readonly COOKIE_EXPIRY = 365; // days

  static getPreferences(): UserPreferences {
    try {
      const stored = Cookies.get(this.COOKIE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_PREFERENCES,
          ...parsed
        };
      }
    } catch (error) {
      console.error('Error reading preferences:', error);
    }
    return DEFAULT_PREFERENCES;
  }

  static updatePreferences(updates: Partial<UserPreferences>): void {
    try {
      const current = this.getPreferences();
      const updated = {
        ...current,
        ...updates
      };
      
      Cookies.set(this.COOKIE_KEY, JSON.stringify(updated), {
        expires: this.COOKIE_EXPIRY,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  }

  static clearPreferences(): void {
    try {
      Cookies.remove(this.COOKIE_KEY);
    } catch (error) {
      console.error('Error clearing preferences:', error);
    }
  }
} 