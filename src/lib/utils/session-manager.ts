import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AuthError, Session, User } from '@supabase/supabase-js';

interface SessionState {
  session: Session | null;
  user: User | null;
  isActive: boolean;
}

class SessionManager {
  private static instance: SessionManager;
  private supabase = createClientComponentClient();
  private sessionState: SessionState = {
    session: null,
    user: null,
    isActive: false,
  };
  private readonly REFRESH_INTERVAL = 10 * 60 * 1000; // Refresh every 10 minutes
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 second
  private refreshTimer: NodeJS.Timeout | null = null;
  private readonly LOCAL_STORAGE_KEY = 'typingspot_session_state';
  private isInitializing = true;
  private initializationPromise: Promise<void> | null = null;

  private constructor() {
    if (typeof window !== 'undefined') {
      // Initialize immediately and store the promise
      this.initializationPromise = this.initializeSessionMonitoring();
      
      // Set up auth state change listener right away
      this.supabase.auth.onAuthStateChange((event, session) => {
        this.handleAuthStateChange(event, session);
      });
    }
  }

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async retryOperation<T>(
    operation: () => Promise<T>,
    retries: number = this.MAX_RETRIES
  ): Promise<T> {
    let lastError: any;
    
    for (let i = 0; i < retries; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        console.error(`Attempt ${i + 1} failed:`, error);
        if (i < retries - 1) {
          await this.delay(this.RETRY_DELAY * (i + 1));
        }
      }
    }
    
    throw lastError;
  }

  private async initializeSessionMonitoring(): Promise<void> {
    try {
      // Try to restore session from local storage first
      await this.restoreSession();

      // Get fresh session from Supabase with retries
      const { data: { session }, error } = await this.retryOperation(
        () => this.supabase.auth.getSession()
      );
      
      if (error) {
        console.error('Error getting session:', error);
        return;
      }

      // Initialize the session state
      if (session) {
        await this.validateAndUpdateSession(session);
      }

    } catch (error) {
      console.error('Error initializing session:', error);
      this.handleInitializationError();
    } finally {
      this.isInitializing = false;
    }
  }

  private async validateAndUpdateSession(session: Session | null): Promise<void> {
    if (!session) {
      this.updateSessionState(null);
      return;
    }

    try {
      // Update state first to ensure we have a session
      this.updateSessionState(session);
      
      // Start refresh timer
      this.startRefreshTimer();

      // Then verify the session in the background
      this.retryOperation(async () => {
        const { data: { user }, error: userError } = await this.supabase.auth.getUser();
        
        if (userError) {
          console.error('Error validating user:', userError);
        } else if (!user) {
          console.warn('No valid user found in session');
        }

        return Promise.resolve();
      }).catch(error => {
        console.error('Background session validation error:', error);
      });

    } catch (error) {
      console.error('Error in validateAndUpdateSession:', error);
      // Keep the session active even if validation fails
    }
  }

  private handleInitializationError(): void {
    this.updateSessionState(null);
    this.clearRefreshTimer();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.LOCAL_STORAGE_KEY);
    }
  }

  private async restoreSession(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const savedState = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      if (savedState) {
        const { isActive } = JSON.parse(savedState);
        if (isActive) {
          await this.retryOperation(() => this.refreshSession());
        }
      }
    } catch (error) {
      console.error('Error restoring session:', error);
      localStorage.removeItem(this.LOCAL_STORAGE_KEY);
    }
  }

  private updateSessionState(session: Session | null): void {
    const wasActive = this.sessionState.isActive;
    const newIsActive = !!session;

    this.sessionState = {
      session,
      user: session?.user ?? null,
      isActive: newIsActive,
    };

    if (typeof window !== 'undefined') {
      if (newIsActive) {
        localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify({
          isActive: true,
        }));
      } else {
        localStorage.removeItem(this.LOCAL_STORAGE_KEY);
      }
    }

    if (newIsActive && !wasActive) {
      this.startRefreshTimer();
    } else if (!newIsActive && wasActive) {
      this.clearRefreshTimer();
    }
  }

  private async handleAuthStateChange(event: string, session: Session | null): Promise<void> {
    try {
      console.log('Auth state change:', event, !!session);
      
      switch (event) {
        case 'INITIAL_SESSION':
        case 'SIGNED_IN':
          if (session) {
            // Immediately update state
            this.updateSessionState(session);
            // Start refresh timer
            this.startRefreshTimer();
            // Update last active in background
            this.updateUserLastActive().catch(console.error);
          }
          break;
          
        case 'SIGNED_OUT':
          this.clearRefreshTimer();
          this.updateSessionState(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem(this.LOCAL_STORAGE_KEY);
          }
          break;
          
        case 'TOKEN_REFRESHED':
          if (session) {
            this.updateSessionState(session);
          }
          break;
          
        default:
          if (session) {
            this.updateSessionState(session);
          }
      }
    } catch (error) {
      console.error('Error handling auth state change:', error);
    }
  }

  private async updateUserLastActive(): Promise<void> {
    if (this.sessionState.user) {
      try {
        await this.retryOperation(async () => {
          const { error } = await this.supabase
            .from('users')
            .update({ last_active: new Date().toISOString() })
            .eq('id', this.sessionState.user!.id);
          
          if (error) throw error;
          return Promise.resolve();
        });
      } catch (error) {
        console.error('Error updating last active timestamp:', error);
      }
    }
  }

  private startRefreshTimer(): void {
    this.clearRefreshTimer();
    this.refreshTimer = setInterval(() => this.refreshSession(), this.REFRESH_INTERVAL);
    // Initial refresh
    this.refreshSession().catch(console.error);
  }

  private clearRefreshTimer(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  private async refreshSession(): Promise<void> {
    try {
      const { data: { session }, error } = await this.retryOperation(
        () => this.supabase.auth.refreshSession()
      );
      
      if (error) {
        console.error('Error refreshing session:', error);
        return;
      }

      if (session) {
        this.updateSessionState(session);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  }

  public async waitForInitialization(): Promise<void> {
    if (this.initializationPromise) {
      await this.initializationPromise;
    }
  }

  public getSession(): Session | null {
    return this.sessionState.session;
  }

  public getUser(): User | null {
    return this.sessionState.user;
  }

  public isSessionActive(): boolean {
    return this.sessionState.isActive;
  }

  public async forceSessionRefresh(): Promise<void> {
    try {
      const { data: { session }, error } = await this.retryOperation(
        () => this.supabase.auth.refreshSession()
      );
      
      if (error) {
        console.error('Error in force refresh:', error);
        return;
      }

      if (session) {
        await this.validateAndUpdateSession(session);
      }
    } catch (error) {
      console.error('Error in force refresh:', error);
    }
  }
}

export const sessionManager = SessionManager.getInstance(); 