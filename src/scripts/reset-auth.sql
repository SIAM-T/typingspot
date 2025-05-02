-- Reset auth system for a specific email
DO $$
DECLARE
    _email TEXT := 'your.email@example.com'; -- Replace with the email you want to clean up
    _user_ids UUID[];
BEGIN
    -- Get all user IDs associated with this email
    SELECT ARRAY_AGG(id::UUID)
    INTO _user_ids
    FROM auth.users
    WHERE email = _email;

    -- Clean up auth tables for this email
    DELETE FROM auth.users WHERE email = _email;
    DELETE FROM auth.identities WHERE email = _email;
    
    -- Clean up related sessions and tokens
    IF _user_ids IS NOT NULL THEN
        -- Clean up sessions
        DELETE FROM auth.sessions 
        WHERE user_id = ANY(_user_ids);
        
        -- Clean up refresh tokens (cast to text for comparison)
        DELETE FROM auth.refresh_tokens 
        WHERE user_id::text = ANY(ARRAY(SELECT id::text FROM auth.users WHERE email = _email));
        
        -- Clean up mfa factors
        DELETE FROM auth.mfa_factors 
        WHERE user_id = ANY(_user_ids);
        
        -- Clean up mfa claims
        DELETE FROM auth.mfa_amr_claims 
        WHERE session_id IN (
            SELECT id FROM auth.sessions WHERE user_id = ANY(_user_ids)
        );
        
        -- Clean up user data
        DELETE FROM users WHERE id = ANY(_user_ids);
        DELETE FROM typing_results WHERE user_id = ANY(_user_ids);
        DELETE FROM user_achievements WHERE user_id = ANY(_user_ids);
    END IF;
    
    RAISE NOTICE 'Auth system reset completed for email: %', _email;
END $$; 