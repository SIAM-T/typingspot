-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Start transaction
BEGIN;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    total_tests INTEGER DEFAULT 0,
    average_wpm FLOAT DEFAULT 0,
    best_wpm INTEGER DEFAULT 0,
    average_accuracy FLOAT DEFAULT 0,
    daily_streak INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    rank_points INTEGER DEFAULT 0,
    last_active TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT username_length CHECK (length(username) >= 3 AND length(username) <= 30),
    CONSTRAINT email_valid CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    settings JSONB NOT NULL DEFAULT '{
        "soundEnabled": true,
        "theme": "system",
        "keyboardLayout": "standard",
        "showLiveWPM": true,
        "showProgressBar": true
    }'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create typing_tests table
CREATE TABLE IF NOT EXISTS typing_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    wpm INTEGER NOT NULL,
    accuracy FLOAT NOT NULL,
    duration INTEGER NOT NULL,
    character_count INTEGER NOT NULL,
    error_count INTEGER NOT NULL,
    test_type TEXT NOT NULL CHECK (test_type IN ('practice', 'race', 'code')),
    language TEXT,
    code_snippet_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create typing_errors table
CREATE TABLE IF NOT EXISTS typing_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    character TEXT NOT NULL,
    count INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, character)
);

-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    daily_streak INTEGER DEFAULT 0,
    last_test_date DATE,
    total_time_practiced INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create code_snippets table
CREATE TABLE IF NOT EXISTS code_snippets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    language TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    times_completed INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    author_id UUID REFERENCES users(id),
    likes INTEGER DEFAULT 0,
    source_url TEXT,
    CONSTRAINT valid_language CHECK (language IN ('javascript', 'typescript', 'python', 'java', 'cpp', 'csharp', 'go', 'rust', 'php', 'ruby', 'kotlin', 'swift', 'scala', 'r', 'matlab', 'sql', 'perl', 'haskell')),
    CONSTRAINT valid_difficulty CHECK (difficulty IN ('beginner', 'intermediate', 'advanced'))
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    requirement_type TEXT NOT NULL CHECK (requirement_type IN ('wpm', 'accuracy', 'tests_completed', 'code_tests_completed', 'accuracy_streak')),
    requirement_value INTEGER NOT NULL,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Create race_rooms table
CREATE TABLE IF NOT EXISTS race_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'waiting',
    max_players INTEGER NOT NULL DEFAULT 5,
    current_players INTEGER NOT NULL DEFAULT 0,
    text_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    finished_at TIMESTAMPTZ,
    is_private BOOLEAN NOT NULL DEFAULT false,
    access_code TEXT,
    CONSTRAINT valid_status CHECK (status IN ('waiting', 'in_progress', 'completed'))
);

-- Create race_participants table
CREATE TABLE IF NOT EXISTS race_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    race_id UUID REFERENCES race_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'waiting',
    progress INTEGER DEFAULT 0,
    wpm INTEGER DEFAULT 0,
    accuracy NUMERIC(5,2) DEFAULT 0,
    finished_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_status CHECK (status IN ('waiting', 'ready', 'racing', 'finished')),
    UNIQUE(race_id, user_id)
);

-- Create leaderboard_cache table
CREATE TABLE IF NOT EXISTS leaderboard_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    period TEXT NOT NULL,
    category TEXT NOT NULL,
    score NUMERIC NOT NULL,
    rank INTEGER NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_period CHECK (period IN ('daily', 'weekly', 'monthly', 'all_time')),
    CONSTRAINT valid_category CHECK (category IN ('wpm', 'accuracy', 'tests_completed')),
    UNIQUE(user_id, period, category)
);

-- Function to update user stats when a new typing test is added
CREATE OR REPLACE FUNCTION update_user_stats_on_test()
RETURNS TRIGGER AS $$
BEGIN
    -- Update users table
    UPDATE users
    SET 
        total_tests = total_tests + 1,
        average_wpm = ((average_wpm * total_tests) + NEW.wpm) / (total_tests + 1),
        best_wpm = GREATEST(best_wpm, NEW.wpm),
        average_accuracy = ((average_accuracy * total_tests) + NEW.accuracy) / (total_tests + 1),
        rank_points = rank_points + FLOOR(NEW.wpm * (NEW.accuracy / 100))
    WHERE id = NEW.user_id;

    -- Update or insert into user_stats
    INSERT INTO user_stats (user_id, last_test_date, total_time_practiced)
    VALUES (NEW.user_id, CURRENT_DATE, NEW.duration)
    ON CONFLICT (user_id) DO UPDATE
    SET 
        last_test_date = CURRENT_DATE,
        total_time_practiced = user_stats.total_time_practiced + NEW.duration,
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update daily streak
CREATE OR REPLACE FUNCTION update_daily_streak(user_id_param UUID)
RETURNS void AS $$
DECLARE
    last_test_date DATE;
    current_streak INTEGER;
BEGIN
    -- Get the last test date and current streak
    SELECT last_test_date, daily_streak 
    INTO last_test_date, current_streak
    FROM user_stats 
    WHERE user_id = user_id_param;

    -- Update streak based on last test date
    IF last_test_date = CURRENT_DATE - INTERVAL '1 day' THEN
        -- Consecutive day, increment streak
        UPDATE user_stats 
        SET daily_streak = daily_streak + 1,
            last_test_date = CURRENT_DATE,
            updated_at = NOW()
        WHERE user_id = user_id_param;
    ELSIF last_test_date < CURRENT_DATE - INTERVAL '1 day' THEN
        -- Streak broken, reset to 1
        UPDATE user_stats 
        SET daily_streak = 1,
            last_test_date = CURRENT_DATE,
            updated_at = NOW()
        WHERE user_id = user_id_param;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get user rank
CREATE OR REPLACE FUNCTION get_user_rank(target_user_id UUID)
RETURNS TABLE (rank BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT row_number() OVER (ORDER BY rank_points DESC)
    FROM users
    WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update leaderboard cache
CREATE OR REPLACE FUNCTION update_leaderboard_cache()
RETURNS TRIGGER AS $$
DECLARE
    periods text[] := ARRAY['daily', 'weekly', 'monthly', 'all_time'];
    period text;
BEGIN
    FOREACH period IN ARRAY periods
    LOOP
        -- Update WPM rankings
        WITH user_stats AS (
            SELECT
                user_id,
                AVG(wpm) as avg_wpm,
                COUNT(*) as total_tests,
                AVG(accuracy) as avg_accuracy
            FROM typing_tests
            WHERE
                CASE
                    WHEN period = 'daily' THEN created_at >= CURRENT_DATE
                    WHEN period = 'weekly' THEN created_at >= CURRENT_DATE - INTERVAL '7 days'
                    WHEN period = 'monthly' THEN created_at >= CURRENT_DATE - INTERVAL '30 days'
                    ELSE TRUE
                END
            GROUP BY user_id
        ),
        rankings AS (
            SELECT
                user_id,
                avg_wpm as score,
                RANK() OVER (ORDER BY avg_wpm DESC) as rank
            FROM user_stats
        )
        INSERT INTO leaderboard_cache (user_id, period, category, score, rank)
        SELECT
            user_id,
            period,
            'wpm',
            score,
            rank
        FROM rankings
        ON CONFLICT (user_id, period, category)
        DO UPDATE SET
            score = EXCLUDED.score,
            rank = EXCLUDED.rank,
            updated_at = NOW();
    END LOOP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers first
DROP TRIGGER IF EXISTS update_stats_after_test ON typing_tests;
DROP TRIGGER IF EXISTS update_leaderboard_on_new_test ON typing_tests;

-- Create triggers
CREATE TRIGGER update_stats_after_test
    AFTER INSERT ON typing_tests
    FOR EACH ROW
    EXECUTE FUNCTION update_user_stats_on_test();

CREATE TRIGGER update_leaderboard_on_new_test
    AFTER INSERT ON typing_tests
    FOR EACH ROW
    EXECUTE FUNCTION update_leaderboard_cache();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_typing_tests_user_id ON typing_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_typing_tests_timestamp ON typing_tests(timestamp);
CREATE INDEX IF NOT EXISTS idx_typing_tests_test_type ON typing_tests(test_type);
CREATE INDEX IF NOT EXISTS idx_typing_errors_user_id ON typing_errors(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_users_rank_points ON users(rank_points DESC);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_code_snippets_language ON code_snippets(language);
CREATE INDEX IF NOT EXISTS idx_code_snippets_difficulty ON code_snippets(difficulty);
CREATE INDEX IF NOT EXISTS idx_race_participants_race_id ON race_participants(race_id);
CREATE INDEX IF NOT EXISTS idx_race_participants_user_id ON race_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_cache_period_category ON leaderboard_cache(period, category);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE typing_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE typing_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE race_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE race_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_cache ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Enable user registration" ON users;
DROP POLICY IF EXISTS "Public can create users" ON users;

DROP POLICY IF EXISTS "Users can view their own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert their own settings" ON user_settings;
DROP POLICY IF EXISTS "Public can create user settings" ON user_settings;

DROP POLICY IF EXISTS "Users can view their own typing tests" ON typing_tests;
DROP POLICY IF EXISTS "Users can insert their own typing tests" ON typing_tests;

DROP POLICY IF EXISTS "Users can view their own typing errors" ON typing_errors;
DROP POLICY IF EXISTS "Users can insert their own typing errors" ON typing_errors;

DROP POLICY IF EXISTS "Users can view their own stats" ON user_stats;
DROP POLICY IF EXISTS "Users can update their own stats" ON user_stats;
DROP POLICY IF EXISTS "Public can create user stats" ON user_stats;

DROP POLICY IF EXISTS "Anyone can view code snippets" ON code_snippets;
DROP POLICY IF EXISTS "Authenticated users can create code snippets" ON code_snippets;
DROP POLICY IF EXISTS "Users can update their own snippets" ON code_snippets;

DROP POLICY IF EXISTS "Achievements are publicly viewable" ON achievements;

DROP POLICY IF EXISTS "Users can view their own achievements" ON user_achievements;
DROP POLICY IF EXISTS "Users can insert their own achievements" ON user_achievements;

DROP POLICY IF EXISTS "Anyone can view public race rooms" ON race_rooms;
DROP POLICY IF EXISTS "Authenticated users can create race rooms" ON race_rooms;

DROP POLICY IF EXISTS "Anyone can view race participants" ON race_participants;
DROP POLICY IF EXISTS "Users can join races" ON race_participants;
DROP POLICY IF EXISTS "Users can update their own race progress" ON race_participants;

DROP POLICY IF EXISTS "Anyone can view leaderboard" ON leaderboard_cache;

-- Create RLS Policies

-- Users table policies
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Allow public registration
CREATE POLICY "Public can create users" ON users
    FOR INSERT
    WITH CHECK (true);  -- Allow any insert during signup

-- User settings policies
CREATE POLICY "Users can view their own settings" ON user_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON user_settings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Public can create user settings" ON user_settings
    FOR INSERT
    WITH CHECK (true);  -- Allow any insert during signup

-- Typing tests policies
CREATE POLICY "Users can view their own typing tests" ON typing_tests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own typing tests" ON typing_tests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Typing errors policies
CREATE POLICY "Users can view their own typing errors" ON typing_errors
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own typing errors" ON typing_errors
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User stats policies
CREATE POLICY "Users can view their own stats" ON user_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" ON user_stats
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Public can create user stats" ON user_stats
    FOR INSERT
    WITH CHECK (true);  -- Allow any insert during signup

-- Code snippets policies
CREATE POLICY "Anyone can view code snippets" ON code_snippets
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create code snippets" ON code_snippets
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own snippets" ON code_snippets
    FOR UPDATE USING (auth.uid() = author_id);

-- Achievements policies
CREATE POLICY "Achievements are publicly viewable" ON achievements
    FOR SELECT TO PUBLIC USING (true);

-- User achievements policies
CREATE POLICY "Users can view their own achievements" ON user_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" ON user_achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Race rooms policies
CREATE POLICY "Anyone can view public race rooms" ON race_rooms
    FOR SELECT USING (NOT is_private OR auth.uid() = created_by);

CREATE POLICY "Authenticated users can create race rooms" ON race_rooms
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Race participants policies
CREATE POLICY "Anyone can view race participants" ON race_participants
    FOR SELECT USING (true);

CREATE POLICY "Users can join races" ON race_participants
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own race progress" ON race_participants
    FOR UPDATE USING (auth.uid() = user_id);

-- Leaderboard cache policies
CREATE POLICY "Anyone can view leaderboard" ON leaderboard_cache
    FOR SELECT USING (true);

-- Insert default achievements
INSERT INTO achievements (name, description, requirement_type, requirement_value, icon) VALUES
('Speed Demon', 'Achieve 100 WPM in a test', 'wpm', 100, '⚡'),
('Accuracy Master', 'Achieve 98% accuracy in a test', 'accuracy', 98, '🎯'),
('Dedicated Typist', 'Complete 100 typing tests', 'tests_completed', 100, '🎓'),
('Code Warrior', 'Complete 50 code typing tests', 'code_tests_completed', 50, '💻'),
('Precision Streak', 'Maintain 95% accuracy for 5 consecutive tests', 'accuracy_streak', 5, '🎪')
ON CONFLICT DO NOTHING;

-- Create function to ensure email and username are lowercase
CREATE OR REPLACE FUNCTION ensure_lowercase_email_username()
RETURNS TRIGGER AS $$
BEGIN
    NEW.email = lower(NEW.email);
    NEW.username = lower(NEW.username);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for lowercase conversion
DROP TRIGGER IF EXISTS ensure_lowercase_trigger ON users;
CREATE TRIGGER ensure_lowercase_trigger
    BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION ensure_lowercase_email_username();

COMMIT; 