"use client";

import { LessonTypingTest } from "@/components/typing-test/LessonTypingTest";
import { CodeTypingTest } from "./CodeTypingTest";
import type { Lesson } from "../page";
import type { CodeSnippet } from "@/lib/types/code-snippets";

interface Props {
  lesson?: Lesson;
  snippet?: CodeSnippet;
}

export function PracticeContent({ lesson, snippet }: Props) {
  if (lesson) {
    return (
      <div className="container py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">{lesson.title}</h1>
          <p className="text-muted-foreground mb-8">{lesson.description}</p>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 rounded-full text-xs bg-secondary capitalize">
                {lesson.type}
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-secondary capitalize">
                {lesson.difficulty}
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-secondary">
                {lesson.duration} min
              </span>
            </div>
            <LessonTypingTest lesson={lesson} />
          </div>
        </div>
      </div>
    );
  }

  if (snippet) {
    return (
      <div className="container py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">{snippet.title}</h1>
          <p className="text-muted-foreground mb-8">{snippet.description}</p>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 rounded-full text-xs bg-secondary capitalize">
                {snippet.language}
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-secondary capitalize">
                {snippet.difficulty}
              </span>
            </div>
            <CodeTypingTest snippet={snippet} />
          </div>
        </div>
      </div>
    );
  }

  return null;
} 