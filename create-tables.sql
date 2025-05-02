-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the code_snippets table
CREATE TABLE IF NOT EXISTS code_snippets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    language VARCHAR(50) NOT NULL CHECK (language IN ('javascript', 'python', 'typescript', 'rust', 'go', 'sql', 'css', 'html', 'bash', 'docker', 'cpp')),
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    likes INTEGER DEFAULT 0,
    times_completed INTEGER DEFAULT 0
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_snippets_language ON code_snippets(language);
CREATE INDEX IF NOT EXISTS idx_snippets_difficulty ON code_snippets(difficulty);
CREATE INDEX IF NOT EXISTS idx_snippets_created_at ON code_snippets(created_at);

-- Function to generate UUID (if not using uuid-ossp extension)
CREATE OR REPLACE FUNCTION generate_uuid() RETURNS uuid AS $$
BEGIN
    RETURN uuid_generate_v4();
END;
$$ LANGUAGE plpgsql; 