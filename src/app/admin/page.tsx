"use client";

import { useEffect, useState } from 'react';
import { useAdmin } from '@/components/providers/AdminProvider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card } from '@/components/ui/card';
import {
  Users,
  Activity,
  Trophy,
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  activeToday: number;
  averageWPM: number;
  totalTests: number;
  recentSignups: number;
  pendingReports: number;
}

export default function AdminDashboard() {
  const { isAdmin, isSuperAdmin } = useAdmin();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeToday: 0,
    averageWPM: 0,
    totalTests: 0,
    recentSignups: 0,
    pendingReports: 0,
  });
  const [loading, setLoading] = useState(true);

  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Get active users today
      const { count: activeToday } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('last_active', new Date(new Date().setHours(0, 0, 0, 0)).toISOString());

      // Get average WPM
      const { data: wpmData } = await supabase
        .from('users')
        .select('average_wpm')
        .not('average_wpm', 'eq', 0);
      
      const averageWPM = wpmData
        ? wpmData.reduce((acc, curr) => acc + curr.average_wpm, 0) / wpmData.length
        : 0;

      // Get total tests
      const { count: totalTests } = await supabase
        .from('typing_tests')
        .select('*', { count: 'exact', head: true });

      // Get recent signups (last 24 hours)
      const { count: recentSignups } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      // Get pending reports (if you have a reports feature)
      const { count: pendingReports } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      setStats({
        totalUsers: totalUsers || 0,
        activeToday: activeToday || 0,
        averageWPM: Math.round(averageWPM) || 0,
        totalTests: totalTests || 0,
        recentSignups: recentSignups || 0,
        pendingReports: pendingReports || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Users */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
            </div>
          </div>
        </Card>

        {/* Active Today */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-green-500/10 rounded-full">
              <Activity className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Today</p>
              <h3 className="text-2xl font-bold">{stats.activeToday}</h3>
            </div>
          </div>
        </Card>

        {/* Average WPM */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-500/10 rounded-full">
              <TrendingUp className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average WPM</p>
              <h3 className="text-2xl font-bold">{stats.averageWPM}</h3>
            </div>
          </div>
        </Card>

        {/* Total Tests */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-purple-500/10 rounded-full">
              <Trophy className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Tests</p>
              <h3 className="text-2xl font-bold">{stats.totalTests}</h3>
            </div>
          </div>
        </Card>

        {/* Recent Signups */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-orange-500/10 rounded-full">
              <Clock className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">New Users (24h)</p>
              <h3 className="text-2xl font-bold">{stats.recentSignups}</h3>
            </div>
          </div>
        </Card>

        {/* Pending Reports */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-red-500/10 rounded-full">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Reports</p>
              <h3 className="text-2xl font-bold">{stats.pendingReports}</h3>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 