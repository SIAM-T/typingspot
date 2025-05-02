-- Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_url TEXT NOT NULL,
    required_score INTEGER NOT NULL,
    achievement_type TEXT NOT NULL CHECK (achievement_type IN ('wpm', 'accuracy', 'tests_completed', 'xp')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    progress INTEGER DEFAULT 0,
    UNIQUE(user_id, achievement_id)
);

-- Add XP column to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;

-- Enable RLS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view achievements"
ON public.achievements FOR SELECT
USING (true);

CREATE POLICY "Users can view their own achievements"
ON public.user_achievements FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements"
ON public.user_achievements FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create function to update user XP
CREATE OR REPLACE FUNCTION update_user_xp()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate XP based on WPM and accuracy
    -- Formula: (WPM * (accuracy/100)) rounded to nearest integer
    UPDATE public.users
    SET xp = xp + ROUND(NEW.wpm * (NEW.accuracy / 100))
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for XP updates
CREATE TRIGGER update_xp_on_typing_result
    AFTER INSERT ON public.typing_results
    FOR EACH ROW
    EXECUTE FUNCTION update_user_xp();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_type ON public.achievements(achievement_type);

-- Insert default achievements
INSERT INTO public.achievements (name, description, icon_url, required_score, achievement_type) VALUES
('Speed Demon', 'Reach 100 WPM', '/badges/speed-demon.svg', 100, 'wpm'),
('Lightning Fingers', 'Reach 120 WPM', '/badges/lightning-fingers.svg', 120, 'wpm'),
('Typing Master', 'Reach 150 WPM', '/badges/typing-master.svg', 150, 'wpm'),
('Precision Perfect', 'Achieve 100% accuracy', '/badges/precision-perfect.svg', 100, 'accuracy'),
('Marathon Runner', 'Complete 100 tests', '/badges/marathon-runner.svg', 100, 'tests_completed'),
('XP Warrior', 'Earn 10000 XP', '/badges/xp-warrior.svg', 10000, 'xp')
ON CONFLICT DO NOTHING; 