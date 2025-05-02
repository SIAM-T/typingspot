-- First drop the trigger and function if they exist
DROP TRIGGER IF EXISTS update_last_active_on_update ON users;
DROP FUNCTION IF EXISTS update_last_active();

-- Add missing columns if they don't exist
DO $$
BEGIN
    -- Add missing columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'average_accuracy') THEN
        ALTER TABLE users ADD COLUMN average_accuracy DOUBLE PRECISION DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'best_wpm') THEN
        ALTER TABLE users ADD COLUMN best_wpm INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'average_wpm') THEN
        ALTER TABLE users ADD COLUMN average_wpm DOUBLE PRECISION DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'tests_completed') THEN
        ALTER TABLE users ADD COLUMN tests_completed INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'rank_points') THEN
        ALTER TABLE users ADD COLUMN rank_points INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'last_active') THEN
        ALTER TABLE users ADD COLUMN last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can create their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;

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

-- Create the last_active function
CREATE OR REPLACE FUNCTION update_last_active()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_active = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER update_last_active_on_update
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_last_active();

DO $$
BEGIN
    RAISE NOTICE 'Users table structure verified and fixed if needed';
END $$; 