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
import { sessionManager } from "@/lib/utils/session-manager";

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
          if (pathname === '/') {
            router.replace('https://typingspot.online/dashboard');
          } else if (authPaths.some(path => pathname.startsWith(path))) {
            const redirectTo = searchParams.get('redirect') || 'https://typingspot.online/dashboard';
            router.replace(redirectTo.startsWith('http') ? redirectTo : `https://typingspot.online${redirectTo}`);
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (!mounted) return;

      try {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const currentUser = sessionManager.getUser();
        setUser(currentUser);

        if (event === 'SIGNED_IN' && currentUser) {
          const redirectTo = searchParams.get('redirect') || '/dashboard';
          router.replace(redirectTo.startsWith('http') ? redirectTo : `https://typingspot.online${redirectTo}`);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          router.replace('https://typingspot.online/login');
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

      // Wait for session to be established
      await new Promise(resolve => setTimeout(resolve, 100));
      await sessionManager.forceSessionRefresh();
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
          emailRedirectTo: 'https://typingspot.online/auth/callback',
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
      router.replace("https://typingspot.online/login");
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://typingspot.online/auth/reset-password',
      });
      if (error) throw error;
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
          redirectTo: 'https://typingspot.online/auth/callback',
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
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; 