-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create admin_roles table
CREATE TABLE IF NOT EXISTS public.admin_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role_name TEXT NOT NULL CHECK (role_name IN ('super_admin', 'admin', 'moderator')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    UNIQUE(user_id)
);

-- Create admin_audit_logs table
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create admin check function
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_roles
        WHERE user_id = user_id
        AND role_name IN ('super_admin', 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create moderator check function
CREATE OR REPLACE FUNCTION is_moderator(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_roles
        WHERE user_id = user_id
        AND role_name = 'moderator'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin Policies
CREATE POLICY "Admins can view all admin roles"
    ON public.admin_roles
    FOR SELECT
    USING (is_admin(auth.uid()));

CREATE POLICY "Super admins can manage admin roles"
    ON public.admin_roles
    FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.admin_roles
        WHERE user_id = auth.uid()
        AND role_name = 'super_admin'
    ));

-- Audit Log Policies
CREATE POLICY "Admins can view audit logs"
    ON public.admin_audit_logs
    FOR SELECT
    USING (is_admin(auth.uid()));

CREATE POLICY "System can create audit logs"
    ON public.admin_audit_logs
    FOR INSERT
    WITH CHECK (true);

-- Update existing tables with admin policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all users"
    ON public.users
    FOR SELECT
    USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update all users"
    ON public.users
    FOR UPDATE
    USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete users"
    ON public.users
    FOR DELETE
    USING (is_admin(auth.uid()));

-- Create initial super admin (replace 'SUPER_ADMIN_USER_ID' with actual ID after creating the admin user)
-- INSERT INTO public.admin_roles (user_id, role_name)
-- VALUES ('SUPER_ADMIN_USER_ID', 'super_admin'); 