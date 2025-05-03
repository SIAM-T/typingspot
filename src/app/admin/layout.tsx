"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/components/providers/AdminProvider';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  Activity,
  LogOut
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, isSuperAdmin, loading } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin && !isSuperAdmin) {
      router.replace('/');
    }
  }, [isAdmin, isSuperAdmin, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!isAdmin && !isSuperAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <nav className="px-4 py-2">
          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <Users className="w-5 h-5" />
            Users
          </Link>
          <Link
            href="/admin/content"
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <FileText className="w-5 h-5" />
            Content
          </Link>
          <Link
            href="/admin/activity"
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <Activity className="w-5 h-5" />
            Activity Logs
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
} 