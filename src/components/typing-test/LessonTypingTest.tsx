"use client";

import { useState, useEffect } from "react";
import { TypingTest } from "./TypingTest";
import type { Lesson } from "@/app/practice/page";
import { generateTextForLesson } from "@/lib/utils/text-generator";

interface Props {
  lesson: Lesson;
}

export function LessonTypingTest({ lesson }: Props) {
  const [text, setText] = useState("");

  useEffect(() => {
    // Generate appropriate text based on lesson type
    const lessonText = generateTextForLesson(lesson);
    setText(lessonText);
  }, [lesson]);

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-card">
        <h3 className="text-lg font-semibold mb-2">Instructions</h3>
        <p className="text-muted-foreground">
          Type the text exactly as shown, including all punctuation and capitalization.
        </p>
      </div>
      <TypingTest initialText={text} />
    </div>
  );
} 