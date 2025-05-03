-- First, let's verify if the user exists
DO $$ 
DECLARE
    user_exists BOOLEAN;
BEGIN
    -- Check if user exists
    SELECT EXISTS (
        SELECT 1 
        FROM auth.users 
        WHERE id = '89c8e3ca-b587-4315-af37-1f8a002104a8'
    ) INTO user_exists;

    IF NOT user_exists THEN
        RAISE EXCEPTION 'User does not exist';
    END IF;

    -- Insert the user directly into admin_roles as super_admin
    -- Note: We're doing a direct insert since this is a one-time setup
    INSERT INTO public.admin_roles (user_id, role_name, created_at)
    VALUES (
        '89c8e3ca-b587-4315-af37-1f8a002104a8', 
        'super_admin',
        NOW()
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET role_name = 'super_admin';

    -- Log the action
    INSERT INTO public.admin_audit_logs (
        admin_id,
        action,
        entity_type,
        entity_id,
        details
    ) VALUES (
        '89c8e3ca-b587-4315-af37-1f8a002104a8', -- self-referential for initial setup
        'DIRECT_SUPER_ADMIN_PROMOTION',
        'USER',
        '89c8e3ca-b587-4315-af37-1f8a002104a8',
        jsonb_build_object(
            'reason', 'Initial super admin setup',
            'promoted_by', 'SYSTEM'
        )
    );
END $$; 