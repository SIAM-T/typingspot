export type ProgrammingLanguage =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "cpp"
  | "csharp"
  | "go"
  | "rust"
  | "php"
  | "ruby"
  | "kotlin"
  | "swift"
  | "scala"
  | "r"
  | "matlab"
  | "sql"
  | "perl"
  | "haskell";

export interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  content: string;
  language: ProgrammingLanguage;
  difficulty: "beginner" | "intermediate" | "advanced";
  created_at: string;
  author_id: string;
  likes: number;
  times_completed: number;
}

export interface UserCodeSnippetProgress {
  id: string;
  user_id: string;
  snippet_id: string;
  best_wpm: number;
  best_accuracy: number;
  completed_count: number;
  last_attempted_at: string;
  code_snippet?: CodeSnippet;
} 