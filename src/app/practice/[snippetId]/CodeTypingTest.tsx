"use client";

import { useState, useEffect } from "react";
import { TypingTest } from "@/components/typing-test/TypingTest";
import type { CodeSnippet } from "@/lib/types/code-snippets";

interface Props {
  snippet: CodeSnippet;
}

export function CodeTypingTest({ snippet }: Props) {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-card">
        <h3 className="text-lg font-semibold mb-2">Instructions</h3>
        <p className="text-muted-foreground">
          Type the code snippet exactly as shown, including all whitespace and special characters.
        </p>
      </div>
      <TypingTest initialText={snippet.content} />
    </div>
  );
} 