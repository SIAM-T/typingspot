-- First, drop existing objects to ensure clean creation
DROP TRIGGER IF EXISTS update_last_active_on_update ON users;
DROP FUNCTION IF EXISTS update_last_active();
DROP TABLE IF EXISTS users;

-- Create users table with all required fields
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    username TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    tests_completed INTEGER DEFAULT 0,
    average_wpm DOUBLE PRECISION DEFAULT 0,
    best_wpm INTEGER DEFAULT 0,
    average_accuracy DOUBLE PRECISION DEFAULT 0,
    rank_points INTEGER DEFAULT 0,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(email),
    UNIQUE(username)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
ON users FOR SELECT TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can create their own profile"
ON users FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON users FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create function to update last_active
CREATE OR REPLACE FUNCTION update_last_active()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_active = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for last_active
CREATE TRIGGER update_last_active_on_update
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_last_active(); 