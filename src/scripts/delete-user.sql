-- Function to delete a user and all their related data
CREATE OR REPLACE FUNCTION delete_user(_user_id UUID)
RETURNS void AS $$
BEGIN
    -- Due to CASCADE DELETE in our table definitions, we only need to delete from users and auth.users
    -- The rest will be handled automatically
    
    -- Delete user's profile first
    DELETE FROM users WHERE id = _user_id;
    
    -- Delete auth.users entry (this will cascade to all related data)
    DELETE FROM auth.users WHERE id = _user_id;
END;
$$ LANGUAGE plpgsql;

-- To delete a specific user, run:
SELECT delete_user('13304986-d286-471b-9b3e-9bcf0f663027');

-- Example usage (replace with actual user ID):
-- SELECT delete_user('your-user-id-here'); 