"use client";

import { useAuth } from "@/lib/context/auth-context";

export function LoginButton() {
  const { user, signInWithGoogle, signOut } = useAuth();

  return (
    <button
      onClick={user ? signOut : signInWithGoogle}
      className="px-6 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
    >
      {user ? "Sign Out" : "Sign In with Google"}
    </button>
  );
} 