"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
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

interface AdminStats {
  total_users: number;
  total_tests: number;
  average_wpm: number;
  active_users_today: number;
}

interface UserData {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string;
  total_tests: number;
  average_wpm: number;
}

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
      return;
    }

    async function checkAdminStatus() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('admin_roles')
          .select('role_name')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setIsAdmin(data?.role_name === 'super_admin');
        
        if (!data || data.role_name !== 'super_admin') {
          router.replace('/dashboard');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        router.replace('/dashboard');
      }
    }

    checkAdminStatus();
  }, [user, loading, router, supabase]);

  useEffect(() => {
    async function fetchAdminData() {
      if (!user || !isAdmin) return;

      try {
        // Fetch overall stats
        const { data: statsData } = await supabase
          .rpc('get_admin_stats');

        if (statsData) {
          setStats(statsData);
        }

        // Fetch user data
        const { data: userData } = await supabase
          .from('auth.users')
          .select(`
            id,
            email,
            created_at,
            last_sign_in_at,
            user_typing_stats!inner(
              total_tests,
              average_wpm
            )
          `)
          .order('user_typing_stats.total_tests', { ascending: false })
          .limit(100);

        if (userData) {
          const formattedUsers = userData.map(user => ({
            id: user.id,
            email: user.email,
            created_at: user.created_at,
            last_sign_in_at: user.last_sign_in_at,
            total_tests: user.user_typing_stats?.[0]?.total_tests || 0,
            average_wpm: user.user_typing_stats?.[0]?.average_wpm || 0
          }));
          setUsers(formattedUsers);
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoadingData(false);
      }
    }

    if (isAdmin) {
      fetchAdminData();
    }
  }, [user, isAdmin, supabase]);

  if (loading || loadingData || !isAdmin) {
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
      <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>
      
      {/* Overall Stats */}
      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-medium">Total Users</h3>
          <p className="mt-2 text-3xl font-bold">{stats?.total_users || 0}</p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-medium">Total Tests</h3>
          <p className="mt-2 text-3xl font-bold">{stats?.total_tests || 0}</p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-medium">Average WPM</h3>
          <p className="mt-2 text-3xl font-bold">{stats?.average_wpm || 0}</p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-medium">Active Users Today</h3>
          <p className="mt-2 text-3xl font-bold">{stats?.active_users_today || 0}</p>
        </div>
      </div>

      {/* User Table */}
      <div className="rounded-lg border bg-card shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold">User Statistics</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-left font-medium">Email</th>
                <th className="p-4 text-left font-medium">Joined</th>
                <th className="p-4 text-left font-medium">Last Active</th>
                <th className="p-4 text-left font-medium">Total Tests</th>
                <th className="p-4 text-left font-medium">Avg WPM</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="p-4">{new Date(user.last_sign_in_at).toLocaleDateString()}</td>
                  <td className="p-4">{user.total_tests}</td>
                  <td className="p-4">{Math.round(user.average_wpm || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 