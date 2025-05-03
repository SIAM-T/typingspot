"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthProvider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';

interface AdminContextType {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isModerator: boolean;
  loading: boolean;
  users: any[];
  fetchUsers: () => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  updateUserRole: (userId: string, role: string) => Promise<void>;
  getAuditLogs: () => Promise<any[]>;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  isSuperAdmin: false,
  isModerator: false,
  loading: true,
  users: [],
  fetchUsers: async () => {},
  deleteUser: async () => {},
  updateUserRole: async () => {},
  getAuditLogs: async () => [],
});

export function useAdmin() {
  return useContext(AdminContext);
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data: adminRole } = await supabase
        .from('admin_roles')
        .select('role_name')
        .eq('user_id', user.id)
        .single();

      if (adminRole) {
        setIsAdmin(adminRole.role_name === 'admin' || adminRole.role_name === 'super_admin');
        setIsSuperAdmin(adminRole.role_name === 'super_admin');
        setIsModerator(adminRole.role_name === 'moderator');
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
    }

    setLoading(false);
  };

  const fetchUsers = async () => {
    if (!isAdmin && !isSuperAdmin && !isModerator) return;

    try {
      const { data: users, error } = await supabase
        .from('users')
        .select(`
          *,
          admin_roles (
            role_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!isAdmin && !isSuperAdmin) return;

    try {
      // Log the action first
      await supabase.from('admin_audit_logs').insert({
        admin_id: user?.id,
        action: 'DELETE_USER',
        entity_type: 'USER',
        entity_id: userId,
        details: { deleted_by: user?.id }
      });

      // Delete the user
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  const updateUserRole = async (userId: string, role: string) => {
    if (!isSuperAdmin) return;

    try {
      // Log the action
      await supabase.from('admin_audit_logs').insert({
        admin_id: user?.id,
        action: 'UPDATE_USER_ROLE',
        entity_type: 'USER',
        entity_id: userId,
        details: { new_role: role }
      });

      // Update or insert the role
      const { error } = await supabase
        .from('admin_roles')
        .upsert({
          user_id: userId,
          role_name: role,
          created_by: user?.id
        });

      if (error) throw error;
      await fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  };

  const getAuditLogs = async () => {
    if (!isAdmin && !isSuperAdmin) return [];

    try {
      const { data: logs, error } = await supabase
        .from('admin_audit_logs')
        .select(`
          *,
          admin:admin_id (
            email,
            user_metadata->>full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return logs || [];
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      return [];
    }
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        isSuperAdmin,
        isModerator,
        loading,
        users,
        fetchUsers,
        deleteUser,
        updateUserRole,
        getAuditLogs,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
} 