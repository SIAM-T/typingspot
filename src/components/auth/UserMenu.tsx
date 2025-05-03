"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from "@/components/ui/button";

export function UserMenu() {
  const { user, loading, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (loading) {
    return (
      <div className="h-10 w-10 rounded-full bg-secondary animate-pulse"></div>
    );
  }

  if (!user) {
    return (
      <Button onClick={() => window.location.href = '/login'}>
        Sign In
      </Button>
    );
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-full hover:bg-secondary/80 transition-colors"
      >
        {user.user_metadata.avatar_url ? (
          <img
            src={user.user_metadata.avatar_url}
            alt={user.user_metadata.full_name}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            {user.user_metadata.full_name?.[0] || user.email?.[0]}
          </div>
        )}
        <span className="font-medium">{user.user_metadata.full_name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 py-2 bg-card rounded-lg shadow-lg border border-border">
          <div className="px-4 py-2 border-b border-border">
            <div className="font-medium">{user.user_metadata.full_name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
          <nav className="mt-2">
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm hover:bg-secondary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
            <Link
              href="/achievements"
              className="block px-4 py-2 text-sm hover:bg-secondary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Achievements
            </Link>
            <Link
              href="/settings"
              className="block px-4 py-2 text-sm hover:bg-secondary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Settings
            </Link>
            <button
              onClick={handleSignOut}
              className="block w-full px-4 py-2 text-sm text-destructive hover:bg-secondary transition-colors text-left"
            >
              Sign Out
            </button>
          </nav>
        </div>
      )}
    </div>
  );
} 