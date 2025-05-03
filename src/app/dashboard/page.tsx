'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface TypingStats {
  total_tests: number;
  average_wpm: number;
  average_accuracy: number;
  best_wpm: number;
}

interface RecentTest {
  id: string;
  wpm: number;
  accuracy: number;
  completed_at: string;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<TypingStats | null>(null);
  const [recentTests, setRecentTests] = useState<RecentTest[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;

      try {
        // Fetch user stats
        const { data: statsData } = await supabase
          .from('user_typing_stats')
          .select('*')
          .eq('user_id', user.id)
          .single();

        // Fetch recent tests
        const { data: recentData } = await supabase
          .from('typing_test_results')
          .select('id, wpm, accuracy, completed_at')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false })
          .limit(10);

        if (statsData) setStats(statsData);
        if (recentData) setRecentTests(recentData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoadingData(false);
      }
    }

    if (user) {
      fetchDashboardData();
    }
  }, [user, supabase]);

  if (loading || loadingData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Welcome to Your Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Start Card */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Quick Start</h2>
          <button
            onClick={() => router.push('/typing-test')}
            className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Start Typing Test
          </button>
        </div>

        {/* Stats Card */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Your Stats</h2>
          <div className="space-y-2">
            <p>Total Tests: {stats?.total_tests || 0}</p>
            <p>Average WPM: {stats?.average_wpm || 0}</p>
            <p>Average Accuracy: {stats?.average_accuracy || 0}%</p>
            <p>Best WPM: {stats?.best_wpm || 0}</p>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
          {recentTests.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={recentTests}>
                  <XAxis 
                    dataKey="completed_at" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                    formatter={(value, name) => [value, name === 'wpm' ? 'WPM' : 'Accuracy (%)']}
                  />
                  <Line type="monotone" dataKey="wpm" stroke="#8884d8" />
                  <Line type="monotone" dataKey="accuracy" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-muted-foreground">No recent activity</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <button
          onClick={() => router.push('/practice')}
          className="rounded-md bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/90"
        >
          Practice Mode
        </button>
        <button
          onClick={() => router.push('/race')}
          className="rounded-md bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/90"
        >
          Race Mode
        </button>
        <button
          onClick={() => router.push('/code-snippets')}
          className="rounded-md bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/90"
        >
          Code Snippets
        </button>
        <button
          onClick={() => router.push('/leaderboard')}
          className="rounded-md bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/90"
        >
          Leaderboard
        </button>
      </div>
    </div>
  );
} 