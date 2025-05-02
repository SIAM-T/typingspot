"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase/config";
import type { User } from "@supabase/supabase-js";
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useToast } from "@/components/ui/use-toast";
import { sessionManager } from "@/lib/auth/session-manager";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  signInWithGoogle: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { toast } = useToast();

  // Auth paths that should redirect to dashboard when logged in
  const authPaths = ['/login', '/signup', '/auth/reset-password'];

  const createUserRecord = async (user: User) => {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!existingUser) {
        // Create username from email or Google name
        const baseUsername = user.user_metadata.full_name?.toLowerCase().replace(/\s+/g, '_') || 
                           user.email?.split('@')[0] || 
                           'user';
        let username = baseUsername;
        let counter = 1;

        // Check username availability
        while (true) {
          const { data: checkUser } = await supabase
            .from('users')
            .select('username')
            .eq('username', username)
            .single();

          if (!checkUser) break;
          username = `${baseUsername}${counter}`;
          counter++;
        }

        // Create user record
        await supabase.from('users').insert({
          id: user.id,
          username,
          email: user.email,
          display_name: user.user_metadata.full_name || username,
          avatar_url: user.user_metadata.avatar_url || null,
          created_at: new Date().toISOString(),
          last_active: new Date().toISOString(),
          total_tests: 0,
          rank_points: 0
        });

        // Create default user settings
        await supabase.from('user_settings').insert({
          user_id: user.id,
          settings: {
            soundEnabled: true,
            theme: 'system',
            keyboardLayout: 'standard',
            showLiveWPM: true,
            showProgressBar: true
          }
        });

        // Initialize achievements
        await supabase.from('user_achievements').insert({
          user_id: user.id,
          achievements: [],
          progress: {}
        });
      }
    } catch (error) {
      console.error('Error creating user record:', error);
      toast({
        title: 'Error',
        description: 'Failed to create user profile. Please try again.',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        await sessionManager.waitForInitialization();

        if (!mounted) return;

        const currentUser = sessionManager.getUser();
        setUser(currentUser);

        if (currentUser) {
          await createUserRecord(currentUser);
          
          if (pathname === '/') {
            router.replace('/dashboard');
          } else if (authPaths.some(path => pathname.startsWith(path))) {
            const redirectTo = searchParams.get('redirect') || '/dashboard';
            router.replace(redirectTo);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      try {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          await createUserRecord(session.user);
          const redirectTo = searchParams.get('redirect') || '/dashboard';
          router.replace(redirectTo);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          router.replace('/login');
        }
      } catch (error) {
        console.error("Error handling auth state change:", error);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router, searchParams, pathname]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      if (error) throw error;

      toast({
        title: "Verification email sent",
        description: "Please check your email to verify your account.",
      });
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace('/login');
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;

      toast({
        title: "Reset email sent",
        description: "Please check your email to reset your password.",
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    signInWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 