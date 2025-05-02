-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

BEGIN;

-- Create users table with all required fields
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY,
    email TEXT,
    username TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    tests_completed INTEGER DEFAULT 0,
    average_wpm DOUBLE PRECISION DEFAULT 0,
    best_wpm INTEGER DEFAULT 0,
    average_accuracy DOUBLE PRECISION DEFAULT 0,
    rank_points INTEGER DEFAULT 0,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT users_email_key UNIQUE(email),
    CONSTRAINT users_username_key UNIQUE(username)
);

-- Create typing_results table
CREATE TABLE IF NOT EXISTS public.typing_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    wpm INTEGER NOT NULL,
    accuracy DOUBLE PRECISION NOT NULL,
    text_content TEXT NOT NULL,
    mistakes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed BOOLEAN DEFAULT true,
    CONSTRAINT typing_results_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.typing_results ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view their own results" ON public.typing_results;
DROP POLICY IF EXISTS "Users can create their own results" ON public.typing_results;
DROP POLICY IF EXISTS "Users can update their own results" ON public.typing_results;

-- Create RLS Policies for users table
CREATE POLICY "Users can view their own profile"
ON public.users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can create their own profile"
ON public.users FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.users FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create RLS Policies for typing_results table
CREATE POLICY "Users can view their own results"
ON public.typing_results FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own results"
ON public.typing_results FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own results"
ON public.typing_results FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Drop existing triggers and functions if they exist
DROP TRIGGER IF EXISTS update_last_active_on_update ON public.users;
DROP TRIGGER IF EXISTS update_user_stats_on_result ON public.typing_results;
DROP FUNCTION IF EXISTS update_last_active();
DROP FUNCTION IF EXISTS update_user_stats();

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
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_last_active();

-- Create function to update user stats when a new typing result is added
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user statistics
    UPDATE public.users
    SET 
        tests_completed = tests_completed + 1,
        average_wpm = (average_wpm * tests_completed + NEW.wpm) / (tests_completed + 1),
        average_accuracy = (average_accuracy * tests_completed + NEW.accuracy) / (tests_completed + 1),
        best_wpm = GREATEST(best_wpm, NEW.wpm),
        rank_points = rank_points + FLOOR(NEW.wpm * (NEW.accuracy / 100))
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update user stats
CREATE TRIGGER update_user_stats_on_result
    AFTER INSERT ON public.typing_results
    FOR EACH ROW
    EXECUTE FUNCTION update_user_stats();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_typing_results_user_id ON public.typing_results(user_id);
CREATE INDEX IF NOT EXISTS idx_typing_results_created_at ON public.typing_results(created_at);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_rank_points ON public.users(rank_points DESC);

COMMIT;

DO $$
BEGIN
    RAISE NOTICE 'Database initialization completed successfully';
END $$; 