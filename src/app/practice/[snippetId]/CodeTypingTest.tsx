"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from '@/components/providers/AuthProvider';
import { supabase } from "@/lib/supabase/config";
import type { CodeSnippet } from "@/lib/types/code-snippets";
import { calculateWPM } from "@/lib/utils/text-generator";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Props {
  snippet: CodeSnippet;
}

export function CodeTypingTest({ snippet }: Props) {
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newInput = e.target.value;
    setInput(newInput);

    if (!startTime) {
      setStartTime(Date.now());
    }

    if (newInput === snippet.content) {
      const endTime = Date.now();
      setEndTime(endTime);
      const timeInSeconds = (endTime - startTime!) / 1000;
      const { wpm, accuracy } = calculateWPM(newInput, snippet.content, timeInSeconds);
      setWpm(wpm);
      setAccuracy(accuracy);
      setIsComplete(true);

      // Save result if user is logged in
      if (user) {
        saveResult(wpm, accuracy, timeInSeconds);
      }
    }
  };

  const saveResult = async (wpm: number, accuracy: number, duration: number) => {
    try {
      await supabase.from("typing_results").insert({
        user_id: user!.id,
        wpm,
        accuracy,
        duration,
        text_type: "code",
        language: snippet.language,
        code_snippet_id: snippet.id,
      });

      // Update snippet completion count
      await supabase
        .from("code_snippets")
        .update({ times_completed: snippet.times_completed + 1 })
        .eq("id", snippet.id);

      router.refresh();
    } catch (error) {
      console.error("Error saving result:", error);
    }
  };

  const handleRetry = () => {
    setInput("");
    setStartTime(null);
    setEndTime(null);
    setWpm(0);
    setAccuracy(0);
    setIsComplete(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <pre className="p-4 rounded-lg bg-card font-mono text-sm whitespace-pre-wrap break-all">
          <code>{snippet.content}</code>
        </pre>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          className="absolute inset-0 w-full h-full p-4 font-mono text-sm bg-transparent resize-none focus:outline-none"
          style={{
            caretColor: "currentColor",
            color: input === snippet.content.slice(0, input.length) ? "green" : "red",
          }}
          disabled={isComplete}
        />
      </div>

      {isComplete && (
        <div className="p-4 rounded-lg bg-card">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-muted-foreground">WPM</p>
              <p className="text-2xl font-bold">{wpm}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Accuracy</p>
              <p className="text-2xl font-bold">{accuracy}%</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button onClick={handleRetry} className="flex-1">
              Try Again
            </Button>
            <Button onClick={() => router.back()} variant="outline" className="flex-1">
              Back to Snippets
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 