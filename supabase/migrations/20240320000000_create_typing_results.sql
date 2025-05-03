-- Create typing_test_results table
CREATE TABLE IF NOT EXISTS public.typing_test_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    wpm INTEGER NOT NULL,
    accuracy DECIMAL(5,2) NOT NULL,
    errors INTEGER NOT NULL,
    test_duration INTEGER NOT NULL,
    text_content TEXT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    test_type VARCHAR(50) DEFAULT 'standard',
    CONSTRAINT wpm_check CHECK (wpm >= 0),
    CONSTRAINT accuracy_check CHECK (accuracy >= 0 AND accuracy <= 100)
);

-- Add RLS policies
ALTER TABLE public.typing_test_results ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own results
CREATE POLICY "Users can view their own results"
    ON public.typing_test_results
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to insert their own results
CREATE POLICY "Users can insert their own results"
    ON public.typing_test_results
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_typing_results_user_id ON public.typing_test_results(user_id);
CREATE INDEX idx_typing_results_completed_at ON public.typing_test_results(completed_at);

-- Create view for user statistics
CREATE OR REPLACE VIEW public.user_typing_stats AS
SELECT 
    user_id,
    COUNT(*) as total_tests,
    ROUND(AVG(wpm)::numeric, 2) as average_wpm,
    ROUND(AVG(accuracy)::numeric, 2) as average_accuracy,
    MAX(wpm) as best_wpm,
    MIN(completed_at) as first_test,
    MAX(completed_at) as last_test
FROM public.typing_test_results
GROUP BY user_id; 