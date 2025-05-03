-- Create function to get admin dashboard stats
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS TABLE (
    total_users bigint,
    total_tests bigint,
    average_wpm numeric,
    active_users_today bigint
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH stats AS (
        SELECT 
            COUNT(DISTINCT au.id) as total_users,
            COUNT(DISTINCT tr.id) as total_tests,
            ROUND(AVG(tr.wpm)::numeric, 2) as average_wpm,
            COUNT(DISTINCT CASE 
                WHEN au.last_sign_in_at >= CURRENT_DATE 
                THEN au.id 
                END
            ) as active_users_today
        FROM auth.users au
        LEFT JOIN public.typing_test_results tr ON au.id = tr.user_id
    )
    SELECT * FROM stats;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_admin_stats() TO authenticated;

-- Create policy to restrict access to admin users only
CREATE POLICY "Only super admins can execute get_admin_stats"
    ON public.admin_roles
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 
            FROM public.admin_roles ar 
            WHERE ar.user_id = auth.uid() 
            AND ar.role_name = 'super_admin'
        )
    ); 