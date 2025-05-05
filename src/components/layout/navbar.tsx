"use client";

import Link from "next/link";
import { useAuth } from '@/components/providers/AuthProvider';
import { UserMenu } from "@/components/auth/UserMenu";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

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
            <span className="font-bold">TypingSpot</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
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
        <div className="flex flex-1 items-center justify-end space-x-2 md:space-x-4">
          <ThemeToggle />
          <div className="hidden sm:flex items-center space-x-2">
            {user ? (
              <UserMenu />
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => router.push('/login')}>
                  Login
                </Button>
                <Button variant="outline" size="sm" onClick={() => router.push('/signup')}>
                  Sign Up
                </Button>
                <Button size="sm" onClick={handleGoogleSignIn}>
                  Sign in with Google
                </Button>
              </>
            )}
          </div>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 pt-6">
                  {navigation.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className="text-lg font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                      >
                        {item.name}
                      </Link>
                    </SheetClose>
                  ))}
                  <div className="border-t border-border pt-4">
                    {user ? (
                      <UserMenu />
                    ) : (
                      <div className="flex flex-col space-y-2">
                        <SheetClose asChild>
                          <Button variant="outline" onClick={() => router.push('/login')}>Login</Button>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button variant="outline" onClick={() => router.push('/signup')}>Sign Up</Button>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button onClick={handleGoogleSignIn}>Sign in with Google</Button>
                        </SheetClose>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
} 