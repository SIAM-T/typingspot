-- Drop existing tables if they exist
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS leaderboard_cache CASCADE;
DROP TABLE IF EXISTS race_participants CASCADE;
DROP TABLE IF EXISTS race_rooms CASCADE;
DROP TABLE IF EXISTS typing_results CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS code_snippets CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_active TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    avatar_url TEXT,
    total_tests INTEGER DEFAULT 0,
    rank_points INTEGER DEFAULT 0,
    CONSTRAINT users_username_key UNIQUE (username),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT username_lowercase CHECK (username = LOWER(username)),
    CONSTRAINT email_lowercase CHECK (email = LOWER(email))
);

-- Create indexes for faster lookups
CREATE INDEX idx_users_username ON users (username);
CREATE INDEX idx_users_email ON users (email);

-- User settings table
CREATE TABLE user_settings (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    sound_enabled BOOLEAN DEFAULT true,
    theme TEXT DEFAULT 'system',
    keyboard_layout TEXT DEFAULT 'standard',
    show_live_wpm BOOLEAN DEFAULT true,
    show_progress_bar BOOLEAN DEFAULT true,
    font_size TEXT DEFAULT 'medium'
);

-- Typing results table
CREATE TABLE typing_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    wpm INTEGER NOT NULL,
    accuracy NUMERIC(5,2) NOT NULL,
    duration INTEGER NOT NULL,
    test_type TEXT NOT NULL,
    language TEXT DEFAULT 'english'
);

-- Code snippets table
CREATE TABLE code_snippets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    language TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Race rooms table
CREATE TABLE race_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'waiting',
    max_players INTEGER NOT NULL DEFAULT 5,
    current_players INTEGER NOT NULL DEFAULT 0,
    test_id TEXT NOT NULL
);

-- Race participants table
CREATE TABLE race_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    race_id UUID REFERENCES race_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'waiting',
    progress INTEGER DEFAULT 0,
    wpm INTEGER DEFAULT 0,
    accuracy NUMERIC(5,2) DEFAULT 0,
    finished_at TIMESTAMPTZ,
    UNIQUE(race_id, user_id)
);

-- Achievements table
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    requirement TEXT NOT NULL,
    points INTEGER NOT NULL DEFAULT 0
);

-- User achievements table
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Leaderboard cache table
CREATE TABLE leaderboard_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    period TEXT NOT NULL,
    category TEXT NOT NULL,
    score NUMERIC NOT NULL,
    rank INTEGER NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, period, category)
);

-- Create indexes for better performance
CREATE INDEX idx_typing_results_user_id ON typing_results(user_id);
CREATE INDEX idx_race_participants_race_id ON race_participants(race_id);
CREATE INDEX idx_race_participants_user_id ON race_participants(user_id);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_leaderboard_cache_user_id ON leaderboard_cache(user_id);

-- Add RLS (Row Level Security) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE typing_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE race_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE race_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Public can read username and email for login" ON users
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for signup" ON users
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE
    USING (auth.uid() = id);

-- Create policies for user_settings table
CREATE POLICY "Enable insert for settings during signup" ON user_settings
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can read their own settings" ON user_settings
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON user_settings
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Create policies for typing_results table
CREATE POLICY "Users can read all typing results" ON typing_results
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can create their own typing results" ON typing_results
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Create policies for race_rooms table
CREATE POLICY "Anyone can read race rooms" ON race_rooms
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can create race rooms" ON race_rooms
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by);

-- Create policies for race_participants table
CREATE POLICY "Anyone can read race participants" ON race_participants
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can join races" ON race_participants
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Create policies for user_achievements table
CREATE POLICY "Users can read their achievements" ON user_achievements
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can earn achievements" ON user_achievements
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Insert some default achievements
INSERT INTO achievements (title, description, icon, requirement, points) VALUES
    ('Speed Demon', 'Achieve 100+ WPM in a single test', '🏃', 'wpm >= 100', 100),
    ('Accuracy Master', 'Complete a test with 100% accuracy', '🎯', 'accuracy = 100', 100),
    ('Marathon Runner', 'Complete 100 typing tests', '🏃‍♂️', 'tests_completed >= 100', 200),
    ('Early Bird', 'Join within the first month of launch', '🐦', 'joined_early = true', 50),
    ('Perfect Streak', 'Complete 10 tests with 98%+ accuracy', '🔥', 'high_accuracy_streak >= 10', 150); 