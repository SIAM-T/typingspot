'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton"; // For loading states

// --- Data Interfaces ---
interface UserStats {
  averageWpm: number | null;
  averageAccuracy: number | null;
  totalTests: number | null;
  bestWpm: number | null;
  bestAccuracy: number | null;
  bestStreak: number | null;
}

interface UserProfile {
  xp: number | null;
  level: number | null;
  // Potentially add streak info here
}

interface UserRank {
  rank: number | null;
  percentile: number | null;
}

interface DailyStreak {
  currentStreak: number | null;
  longestStreak: number | null;
}

interface RecentTest {
  id: string;
  wpm: number;
  accuracy: number;
  completed_at: string; // ISO string format
}

// Combined dashboard data
interface DashboardData {
  stats: UserStats;
  profile: UserProfile;
  rank: UserRank;
  streak: DailyStreak;
  recentTests: RecentTest[];
}

// --- Helper Functions ---
// Placeholder: Calculate level based on XP
const calculateLevel = (xp: number): number => {
  // Simple example: 100 XP per level
  return Math.floor(xp / 100) + 1; 
};

const xpForNextLevel = (level: number): number => {
  return (level) * 100;
};

const formatChartData = (tests: RecentTest[]) => {
  return tests
    .map(test => ({
      date: new Date(test.completed_at).toLocaleDateString(), // Group by date for simplicity
      wpm: test.wpm,
      accuracy: test.accuracy,
      timestamp: new Date(test.completed_at).getTime() // For sorting
    }))
    .sort((a, b) => a.timestamp - b.timestamp) // Sort by time
    .slice(-20); // Limit to last 20 tests for chart clarity
};


export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;
      setLoadingData(true);
      setError(null);

      try {
        // --- Fetch Data (Combine promises for efficiency) ---
        const [statsPromise, profilePromise, recentTestsPromise, rankPromise, streakPromise] = await Promise.allSettled([
          // 1. User Stats (Example: from a view or function)
          supabase.from('user_typing_stats_view') // ASSUMPTION: View exists
            .select('average_wpm, average_accuracy, total_tests, best_wpm, best_accuracy, best_streak')
            .eq('user_id', user.id)
            .maybeSingle(),
          // 2. User Profile (XP, etc.)
          supabase.from('user_profiles') // ASSUMPTION: Table exists
            .select('xp') // Fetch only needed fields
            .eq('user_id', user.id)
            .maybeSingle(),
          // 3. Recent Tests
          supabase.from('typing_results') // Use correct table name
            .select('id, wpm, accuracy, completed_at')
            .eq('user_id', user.id)
            .order('completed_at', { ascending: false })
            .limit(100), // Fetch more for chart + table
          // 4. Rank (Placeholder - Needs backend logic)
          Promise.resolve({ data: { rank: 1234, percentile: 85 }, error: null }), // Replace with actual fetch
          // 5. Streak (Placeholder - Needs backend logic - *Ensure actual fetch returns camelCase or map it*)
          Promise.resolve({ data: { currentStreak: 5, longestStreak: 15 }, error: null }) // Changed to camelCase
        ]);

        // --- Process Results ---
        // Define fetched data from Supabase (snake_case expected)
        const fetchedSupabaseStats = (statsPromise.status === 'fulfilled' && statsPromise.value.data) ? statsPromise.value.data : null;
        const fetchedSupabaseProfile = (profilePromise.status === 'fulfilled' && profilePromise.value.data) ? profilePromise.value.data : null;
        const fetchedRecentTests: RecentTest[] = recentTestsPromise.status === 'fulfilled' && recentTestsPromise.value.data ? recentTestsPromise.value.data : [];
        // Assuming placeholders return camelCase or handle mapping if needed
        const fetchedRank: Partial<UserRank> = (rankPromise.status === 'fulfilled' && rankPromise.value.data) ? rankPromise.value.data : {}; 
        const fetchedStreak: Partial<DailyStreak> = (streakPromise.status === 'fulfilled' && streakPromise.value.data) ? streakPromise.value.data : {}; 
        
        // Log errors if promises were rejected
        if (statsPromise.status === 'rejected') console.error("Stats fetch error:", statsPromise.reason);
        if (profilePromise.status === 'rejected') console.error("Profile fetch error:", profilePromise.reason);
        if (recentTestsPromise.status === 'rejected') console.error("Tests fetch error:", recentTestsPromise.reason);
        // Handle errors for rank/streak if they become real fetches

        // Map Supabase data to our camelCase interfaces, checking for null fetches
        const mappedStats: UserStats = {
            averageWpm: fetchedSupabaseStats?.average_wpm ?? null,
            averageAccuracy: fetchedSupabaseStats?.average_accuracy ?? null,
            totalTests: fetchedSupabaseStats?.total_tests ?? null,
            bestWpm: fetchedSupabaseStats?.best_wpm ?? null,
            bestAccuracy: fetchedSupabaseStats?.best_accuracy ?? null,
            bestStreak: fetchedSupabaseStats?.best_streak ?? null,
        };

        const currentXp = fetchedSupabaseProfile?.xp ?? 0;
        const currentLevel = calculateLevel(currentXp);

        setDashboardData({
          stats: mappedStats,
          profile: {
            xp: currentXp,
            level: currentLevel,
          },
          rank: {
            rank: fetchedRank.rank ?? null, 
            percentile: fetchedRank.percentile ?? null,
          },
          streak: {
            currentStreak: fetchedStreak.currentStreak ?? 0,
            longestStreak: fetchedStreak.longestStreak ?? mappedStats.bestStreak ?? 0,
          },
          recentTests: fetchedRecentTests,
        });

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoadingData(false);
      }
    }

    if (user) {
      fetchDashboardData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Supabase client is stable

  // --- Render Logic ---
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Authenticating...</p> {/* More specific loading */}
      </div>
    );
  }

  if (!user) {
    return null; // Redirect happens in useEffect
  }

  // Loading state for data
  if (loadingData) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
         <h1 className="text-3xl font-bold">Your Dashboard</h1>
         <Skeleton className="h-96 w-full" /> {/* Placeholder for loading */}
      </div>
    );
  }
  
  if (error) {
     return (
      <div className="container mx-auto px-4 py-8 text-center text-destructive">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!dashboardData) {
     return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p>Could not load dashboard data.</p>
      </div>
    );
  }

  // Calculate XP progress (with null checks)
  const currentLevel = dashboardData.profile.level ?? 1;
  const currentXp = dashboardData.profile.xp ?? 0;
  const currentLevelXp = (currentLevel - 1) * 100;
  const nextLevelXp = xpForNextLevel(currentLevel);
  const xpProgress = nextLevelXp > currentLevelXp ? 
                     ((currentXp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100 
                     : 0;

  const chartData = formatChartData(dashboardData.recentTests);


  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">Your Dashboard</h1>

      {/* Grid for stats, charts, etc. */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Main Stats & Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Average Speed</CardTitle>
                <CardDescription>Your average words per minute.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{dashboardData.stats.averageWpm?.toFixed(0) ?? 'N/A'}</p>
                <p className="text-sm text-muted-foreground">WPM</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle className="text-lg">Average Accuracy</CardTitle>
                <CardDescription>Your average typing accuracy.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{dashboardData.stats.averageAccuracy?.toFixed(1) ?? 'N/A'}%</p>
                 <p className="text-sm text-muted-foreground">Accuracy</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle className="text-lg">Level & XP</CardTitle>
                <CardDescription>Your current progress.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-2">Level {currentLevel}</p>
                <Progress value={xpProgress} className="mb-1 h-2" />
                <p className="text-xs text-muted-foreground text-right">
                  {currentXp} / {nextLevelXp} XP
                </p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle className="text-lg">Global Rank</CardTitle>
                 <CardDescription>Your position worldwide.</CardDescription>
              </CardHeader>
              <CardContent>
                 <p className="text-4xl font-bold">#{dashboardData.rank.rank ?? 'N/A'}</p>
                 <p className="text-sm text-muted-foreground">
                    {dashboardData.rank.percentile ? `Top ${100 - dashboardData.rank.percentile}%` : 'Ranking unavailable'}
                 </p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Charts */}
          <Card>
             <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
                <CardDescription>Your WPM and Accuracy over recent tests.</CardDescription>
              </CardHeader>
              <CardContent className="h-72">
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                     <CartesianGrid strokeDasharray="3 3" />
                     <XAxis dataKey="date" />
                     <YAxis yAxisId="left" stroke="#8884d8" />
                     <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                     <Tooltip />
                     <Line yAxisId="left" type="monotone" dataKey="wpm" stroke="#8884d8" name="WPM" dot={false} />
                     <Line yAxisId="right" type="monotone" dataKey="accuracy" stroke="#82ca9d" name="Accuracy (%)" dot={false} />
                   </LineChart>
                 </ResponsiveContainer>
              </CardContent>
          </Card>
        </div>

        {/* Column 2: Side Info (Streak, Bests) */}
        <div className="space-y-6">
          <Card>
             <CardHeader>
                <CardTitle>Daily Streak</CardTitle>
                 <CardDescription>Keep practicing daily!</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                 <p className="text-6xl font-bold text-amber-500">{dashboardData.streak.currentStreak ?? 0}</p>
                 <p className="text-sm text-muted-foreground">Day Streak</p>
              </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
               <CardTitle>Personal Bests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
               <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fastest WPM:</span>
                  <span className="font-medium">{dashboardData.stats.bestWpm ?? 'N/A'}</span>
               </div>
               <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Highest Accuracy:</span>
                  <span className="font-medium">{dashboardData.stats.bestAccuracy ? `${dashboardData.stats.bestAccuracy.toFixed(1)}%` : 'N/A'}</span>
               </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Longest Streak:</span>
                  <span className="font-medium">{dashboardData.streak.longestStreak ?? 'N/A'} Days</span>
               </div>
               {/* Add more bests if tracked */}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Typing History Table */}
      <Card>
         <CardHeader>
            <CardTitle>Typing History</CardTitle>
             <CardDescription>Your last {dashboardData.recentTests.slice(0, 10).length} tests.</CardDescription>
         </CardHeader>
         <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">WPM</TableHead>
                  <TableHead className="text-right">Accuracy</TableHead>
                   {/* Add more columns if needed, e.g., Duration, Mode */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData.recentTests.slice(0, 10).map((test) => ( // Limit rows displayed
                  <TableRow key={test.id}>
                    <TableCell>{new Date(test.completed_at).toLocaleString()}</TableCell>
                    <TableCell className="text-right">{test.wpm}</TableCell>
                    <TableCell className="text-right">{test.accuracy.toFixed(1)}%</TableCell>
                  </TableRow>
                ))}
                 {dashboardData.recentTests.length === 0 && (
                    <TableRow>
                       <TableCell colSpan={3} className="text-center text-muted-foreground">No tests recorded yet.</TableCell>
                    </TableRow>
                 )}
              </TableBody>
            </Table>
         </CardContent>
      </Card>

    </div>
  );
} 