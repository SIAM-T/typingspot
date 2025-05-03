"use client";

import Link from "next/link";
import { useAuth } from '@/components/providers/AuthProvider';
import { UserMenu } from "@/components/auth/UserMenu";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const getNavigation = (isLoggedIn: boolean, isAdmin: boolean) => {
  const baseNav = [
    { name: "Home", href: "/" },
    { name: "Typing Test", href: "/typing-test" },
    { name: "Practice", href: "/practice" },
    { name: "Race", href: "/race" },
    { name: "Code Snippets", href: "/code-snippets" },
    { name: "Leaderboard", href: "/leaderboard" },
  ];

  if (isLoggedIn) {
    const userNav = [...baseNav, { name: "Dashboard", href: "/dashboard" }];
    return isAdmin ? [...userNav, { name: "Admin", href: "/admin" }] : userNav;
  }

  return baseNav;
};

export function Navbar() {
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) return;

      try {
        const { data } = await supabase
          .from('admin_roles')
          .select('role_name')
          .eq('user_id', user.id)
          .single();

        setIsAdmin(data?.role_name === 'super_admin');
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    }

    checkAdminStatus();
  }, [user, supabase]);

  const navigation = getNavigation(!!user, isAdmin);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="text-xl font-bold">TypingSpot</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            {user ? (
              <UserMenu />
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={() => router.push('/login')}>
                  Login
                </Button>
                <Button variant="outline" onClick={() => router.push('/signup')}>
                  Sign Up
                </Button>
                <Button onClick={handleGoogleSignIn}>
                  Sign in with Google
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
} 