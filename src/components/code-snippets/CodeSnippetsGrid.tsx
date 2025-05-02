"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase/config";
import { useAuth } from "@/lib/context/auth-context";
import type { CodeSnippet, ProgrammingLanguage } from "@/lib/types/code-snippets";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { allCodeSnippets } from "@/lib/data/default-snippets";

export function CodeSnippetsGrid() {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage | "all">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<CodeSnippet["difficulty"] | "all">("all");
  const { user } = useAuth();
  const router = useRouter();

  const handlePractice = (snippetId: string) => {
    router.push(`/practice/${snippetId}`);
  };

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const query = supabase
          .from("code_snippets")
          .select("*")
          .order("created_at", { ascending: false });

        if (selectedLanguage !== "all") {
          query.eq("language", selectedLanguage);
        }
        if (selectedDifficulty !== "all") {
          query.eq("difficulty", selectedDifficulty);
        }

        const { data, error } = await query;
        if (error) throw error;
        
        if (!data || data.length === 0) {
          if (selectedLanguage === "all" && selectedDifficulty === "all") {
            try {
              await createDefaultSnippets();
              const { data: newData, error: newError } = await supabase
                .from("code_snippets")
                .select("*")
                .order("created_at", { ascending: false });
              
              if (newError) throw newError;
              setSnippets(newData || []);
            } catch (error) {
              console.error("Error creating default snippets:", error);
              setError("Failed to create default snippets. Please try again later.");
            }
          } else {
            setSnippets([]);
          }
        } else {
          setSnippets(data);
        }
      } catch (error) {
        console.error("Error fetching code snippets:", error);
        setError("Failed to load code snippets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSnippets();
  }, [selectedLanguage, selectedDifficulty]);

  const languages: ProgrammingLanguage[] = [
    "javascript",
    "typescript",
    "python",
    "java",
    "cpp",
    "csharp",
    "go",
    "rust",
    "php",
    "ruby",
    "kotlin",
    "swift",
    "scala",
    "r",
    "matlab",
    "sql",
    "perl",
    "haskell"
  ];

  const difficulties: CodeSnippet["difficulty"][] = [
    "beginner",
    "intermediate",
    "advanced",
  ];

  async function createDefaultSnippets() {
    try {
      const { error } = await supabase.from("code_snippets").insert(allCodeSnippets);
      if (error) throw error;
    } catch (error) {
      console.error("Error creating default snippets:", error);
      throw error;
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setSelectedLanguage("all")}
            variant={selectedLanguage === "all" ? "default" : "secondary"}
            size="sm"
          >
            All Languages
          </Button>
          {languages.map((language) => (
            <Button
              key={language}
              onClick={() => setSelectedLanguage(language)}
              variant={selectedLanguage === language ? "default" : "secondary"}
              size="sm"
              className="capitalize"
            >
              {language}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setSelectedDifficulty("all")}
            variant={selectedDifficulty === "all" ? "default" : "secondary"}
            size="sm"
          >
            All Difficulties
          </Button>
          {difficulties.map((difficulty) => (
            <Button
              key={difficulty}
              onClick={() => setSelectedDifficulty(difficulty)}
              variant={selectedDifficulty === difficulty ? "default" : "secondary"}
              size="sm"
              className="capitalize"
            >
              {difficulty}
            </Button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && snippets.length === 0 && (
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold mb-2">No snippets found</h3>
          <p className="text-muted-foreground mb-4">
            {selectedLanguage === "all" && selectedDifficulty === "all"
              ? "No code snippets available. Please try again later."
              : "Try changing your filters to find more snippets."}
          </p>
          <Button
            onClick={() => {
              setSelectedLanguage("all");
              setSelectedDifficulty("all");
            }}
            variant="outline"
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Snippets grid */}
      <AnimatePresence>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {snippets.map((snippet) => (
            <motion.div
              key={snippet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{snippet.title}</h3>
                <span className="px-3 py-1 rounded-full text-xs bg-secondary capitalize">
                  {snippet.language}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {snippet.description}
              </p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="capitalize">{snippet.difficulty}</span>
                <div className="flex items-center gap-4">
                  <span>{snippet.times_completed} completions</span>
                  <span>{snippet.likes} likes</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <Button
                  onClick={() => handlePractice(snippet.id)}
                  className="w-full"
                  variant="default"
                >
                  Practice Now
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
} 