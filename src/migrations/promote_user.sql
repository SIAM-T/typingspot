-- Function to promote a user to super admin
CREATE OR REPLACE FUNCTION promote_to_super_admin(
    target_user_id UUID,
    admin_user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    is_admin_super BOOLEAN;
BEGIN
    -- Check if the admin making the change is a super admin
    SELECT EXISTS (
        SELECT 1 
        FROM admin_roles 
        WHERE user_id = admin_user_id 
        AND role_name = 'super_admin'
    ) INTO is_admin_super;

    -- Only proceed if the admin is a super admin
    IF NOT is_admin_super THEN
        RAISE EXCEPTION 'Only super admins can promote users to super admin';
    END IF;

    -- Insert or update the role
    INSERT INTO admin_roles (user_id, role_name, created_by)
    VALUES (target_user_id, 'super_admin', admin_user_id)
    ON CONFLICT (user_id) 
    DO UPDATE SET role_name = 'super_admin', created_by = admin_user_id;

    -- Log the action
    INSERT INTO admin_audit_logs (
        admin_id,
        action,
        entity_type,
        entity_id,
        details
    ) VALUES (
        admin_user_id,
        'PROMOTE_TO_SUPER_ADMIN',
        'USER',
        target_user_id,
        jsonb_build_object(
            'promoted_by', admin_user_id,
            'previous_role', (SELECT role_name FROM admin_roles WHERE user_id = target_user_id)
        )
    );

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 