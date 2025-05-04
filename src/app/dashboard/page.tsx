'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    // Although redirection happens in useEffect, this prevents rendering sensitive content briefly
    return null; 
  }

  // Dashboard content will go here
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">Your Dashboard</h1>

      {/* Grid for stats, charts, etc. */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Main Stats & Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Placeholder: Average WPM Card */}
            <div className="p-4 border rounded-lg bg-card">Avg WPM Placeholder</div>
            {/* Placeholder: Average Accuracy Card */}
            <div className="p-4 border rounded-lg bg-card">Avg Accuracy Placeholder</div>
            {/* Placeholder: XP/Level Card */}
            <div className="p-4 border rounded-lg bg-card">XP/Level Placeholder</div>
            {/* Placeholder: Rank Card */}
            <div className="p-4 border rounded-lg bg-card">Rank Placeholder</div>
          </div>

          {/* Progress Charts */}
          <div className="p-4 border rounded-lg bg-card h-72">
            Progress Chart Placeholder (WPM/Accuracy)
          </div>
        </div>

        {/* Column 2: Side Info (Streak, Bests, History Link) */}
        <div className="space-y-6">
          {/* Daily Streak */}
          <div className="p-4 border rounded-lg bg-card">Daily Streak Placeholder</div>
          
          {/* Personal Bests */}
          <div className="p-4 border rounded-lg bg-card">
            <h2 className="text-lg font-semibold mb-2">Personal Bests</h2>
            {/* Placeholder: Best WPM */}
            <p>Best WPM: Placeholder</p>
            {/* Placeholder: Best Accuracy */}
            <p>Best Accuracy: Placeholder</p>
            {/* Placeholder: Longest Streak */}
            <p>Longest Streak: Placeholder</p>
          </div>
        </div>
      </div>

      {/* Typing History Table */}
      <div className="p-4 border rounded-lg bg-card">
        <h2 className="text-xl font-semibold mb-4">Typing History</h2>
        Typing History Table Placeholder
      </div>

    </div>
  );
} 