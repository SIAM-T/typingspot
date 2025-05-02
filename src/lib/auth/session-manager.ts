import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/config';

class SessionManager {
  private initialized: boolean = false;
  private currentUser: User | null = null;
  private initPromise: Promise<void>;

  constructor() {
    this.initPromise = this.initialize();
  }

  private async initialize() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      this.currentUser = session?.user || null;
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing session:', error);
      this.initialized = true;
    }
  }

  async waitForInitialization() {
    await this.initPromise;
  }

  getUser(): User | null {
    return this.currentUser;
  }

  async forceSessionRefresh() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      this.currentUser = session?.user || null;
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  }
}

export const sessionManager = new SessionManager(); 