"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number; // in minutes
  type: "basic" | "speed" | "accuracy" | "code";
}

const lessons: Lesson[] = [
  {
    id: "home-row",
    title: "Home Row Mastery",
    description: "Master the home row keys (ASDF JKL;)",
    difficulty: "beginner",
    duration: 5,
    type: "basic",
  },
  {
    id: "top-row",
    title: "Top Row Training",
    description: "Practice the top row keys (QWERTY UIOP)",
    difficulty: "beginner",
    duration: 5,
    type: "basic",
  },
  {
    id: "bottom-row",
    title: "Bottom Row Basics",
    description: "Learn the bottom row keys (ZXCV BNM)",
    difficulty: "beginner",
    duration: 5,
    type: "basic",
  },
  {
    id: "speed-drills",
    title: "Speed Drills",
    description: "Increase your typing speed with targeted exercises",
    difficulty: "intermediate",
    duration: 10,
    type: "speed",
  },
  {
    id: "accuracy-focus",
    title: "Accuracy Focus",
    description: "Improve typing accuracy with precision exercises",
    difficulty: "intermediate",
    duration: 10,
    type: "accuracy",
  },
  {
    id: "code-syntax",
    title: "Code Syntax",
    description: "Practice typing common programming syntax",
    difficulty: "advanced",
    duration: 15,
    type: "code",
  },
];

export default function PracticePage() {
  const [selectedType, setSelectedType] = useState<Lesson["type"] | "all">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Lesson["difficulty"] | "all">("all");

  const filteredLessons = lessons.filter(lesson => {
    if (selectedType !== "all" && lesson.type !== selectedType) return false;
    if (selectedDifficulty !== "all" && lesson.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Practice</h1>
        <p className="text-muted-foreground">
          Improve your typing skills with structured lessons and exercises
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Type</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as Lesson["type"] | "all")}
            className="rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="all">All Types</option>
            <option value="basic">Basic</option>
            <option value="speed">Speed</option>
            <option value="accuracy">Accuracy</option>
            <option value="code">Code</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Difficulty</label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as Lesson["difficulty"] | "all")}
            className="rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Lessons Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {filteredLessons.map((lesson) => (
          <motion.div
            key={lesson.id}
            variants={item}
            className="group relative rounded-lg border border-border p-6 hover:border-primary transition-colors"
          >
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{lesson.title}</h3>
              <p className="text-muted-foreground">{lesson.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  {lesson.duration} min
                </span>
                <span className="capitalize">
                  {lesson.difficulty}
                </span>
              </div>
            </div>
            <Link
              href={`/practice/${lesson.id}`}
              className="absolute inset-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <span className="sr-only">Start lesson</span>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No lessons found matching your filters. Try adjusting your selection.
          </p>
        </div>
      )}
    </div>
  );
} 