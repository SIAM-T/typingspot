-- First, drop the existing constraint
ALTER TABLE code_snippets
DROP CONSTRAINT IF EXISTS valid_language;

-- Then add the new constraint with all supported languages
ALTER TABLE code_snippets
ADD CONSTRAINT valid_language CHECK (
  language IN (
    'javascript',
    'typescript',
    'python',
    'java',
    'cpp',
    'csharp',
    'go',
    'rust',
    'php',
    'ruby',
    'kotlin',
    'swift',
    'scala',
    'r',
    'matlab',
    'sql',
    'perl',
    'haskell'
  )
); 