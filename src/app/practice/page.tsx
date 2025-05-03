"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number; // in minutes
  type: "basic" | "speed" | "accuracy" | "business" | "academic" | "creative" | "communication" | "numbers" | "general" | "medical" | "legal" | "journalism" | "social" | "finance" | "administrative";
}

export const lessons: Lesson[] = [
  // Basic Skills
  {
    id: "home-row",
    title: "Home Row Mastery",
    description: "Master the home row keys (ASDF JKL;) - the foundation of touch typing",
    difficulty: "beginner",
    duration: 5,
    type: "basic",
  },
  {
    id: "top-row",
    title: "Top Row Training",
    description: "Practice typing with the top row keys (QWERTY UIOP)",
    difficulty: "beginner",
    duration: 5,
    type: "basic",
  },
  {
    id: "bottom-row",
    title: "Bottom Row Basics",
    description: "Learn to type efficiently with the bottom row keys (ZXCVBNM)",
    difficulty: "beginner",
    duration: 5,
    type: "basic",
  },
  {
    id: "numbers-symbols",
    title: "Numbers & Symbols",
    description: "Master typing numbers and common symbols",
    difficulty: "intermediate",
    duration: 7,
    type: "numbers",
  },

  // Speed Training
  {
    id: "speed-drills",
    title: "Speed Drills",
    description: "Quick exercises to improve your typing speed",
    difficulty: "intermediate",
    duration: 3,
    type: "speed",
  },
  {
    id: "rapid-words",
    title: "Rapid Words Challenge",
    description: "Type common words as quickly as possible",
    difficulty: "intermediate",
    duration: 5,
    type: "speed",
  },

  // Accuracy Training
  {
    id: "precision-practice",
    title: "Precision Practice",
    description: "Focus on accuracy with challenging word combinations",
    difficulty: "intermediate",
    duration: 10,
    type: "accuracy",
  },
  {
    id: "error-reduction",
    title: "Error Reduction",
    description: "Exercises designed to minimize typing mistakes",
    difficulty: "advanced",
    duration: 15,
    type: "accuracy",
  },

  // Business
  {
    id: "business-correspondence",
    title: "Business Correspondence",
    description: "Practice typing professional emails and letters",
    difficulty: "intermediate",
    duration: 10,
    type: "business",
  },
  {
    id: "business-terms",
    title: "Business Terminology",
    description: "Common business terms and phrases",
    difficulty: "intermediate",
    duration: 8,
    type: "business",
  },

  // Academic
  {
    id: "academic-writing",
    title: "Academic Writing",
    description: "Practice typing scholarly content and citations",
    difficulty: "advanced",
    duration: 12,
    type: "academic",
  },
  {
    id: "research-terms",
    title: "Research Terminology",
    description: "Common terms used in academic research",
    difficulty: "advanced",
    duration: 10,
    type: "academic",
  },

  // Medical
  {
    id: "medical-terms",
    title: "Medical Terminology",
    description: "Common medical terms and abbreviations",
    difficulty: "advanced",
    duration: 15,
    type: "medical",
  },
  {
    id: "patient-records",
    title: "Patient Records",
    description: "Practice typing patient information and medical reports",
    difficulty: "advanced",
    duration: 12,
    type: "medical",
  },

  // Legal
  {
    id: "legal-terms",
    title: "Legal Terminology",
    description: "Common legal terms and phrases",
    difficulty: "advanced",
    duration: 12,
    type: "legal",
  },
  {
    id: "legal-documents",
    title: "Legal Documents",
    description: "Practice typing contracts and legal correspondence",
    difficulty: "advanced",
    duration: 15,
    type: "legal",
  },

  // Journalism
  {
    id: "news-writing",
    title: "News Writing",
    description: "Practice typing news articles and headlines",
    difficulty: "intermediate",
    duration: 10,
    type: "journalism",
  },
  {
    id: "interview-transcription",
    title: "Interview Transcription",
    description: "Transcribe interview recordings accurately",
    difficulty: "advanced",
    duration: 15,
    type: "journalism",
  },

  // Social Media
  {
    id: "social-posts",
    title: "Social Media Posts",
    description: "Create engaging social media content quickly",
    difficulty: "beginner",
    duration: 5,
    type: "social",
  },
  {
    id: "hashtag-mastery",
    title: "Hashtag Mastery",
    description: "Practice typing trending hashtags and social media terms",
    difficulty: "beginner",
    duration: 5,
    type: "social",
  },

  // Finance
  {
    id: "financial-terms",
    title: "Financial Terminology",
    description: "Common financial terms and expressions",
    difficulty: "advanced",
    duration: 10,
    type: "finance",
  },
  {
    id: "financial-reports",
    title: "Financial Reports",
    description: "Practice typing financial statements and reports",
    difficulty: "advanced",
    duration: 15,
    type: "finance",
  },

  // Administrative
  {
    id: "data-entry",
    title: "Data Entry",
    description: "Practice accurate and fast data entry",
    difficulty: "intermediate",
    duration: 8,
    type: "administrative",
  },
  {
    id: "office-correspondence",
    title: "Office Correspondence",
    description: "Type common office communications efficiently",
    difficulty: "intermediate",
    duration: 10,
    type: "administrative",
  },

  // Creative Writing
  {
    id: "creative-prompts",
    title: "Creative Writing Prompts",
    description: "Practice typing creative stories and descriptions",
    difficulty: "intermediate",
    duration: 12,
    type: "creative",
  },
  {
    id: "poetry-prose",
    title: "Poetry & Prose",
    description: "Type various forms of creative writing",
    difficulty: "intermediate",
    duration: 10,
    type: "creative",
  },

  // Communication
  {
    id: "email-etiquette",
    title: "Email Etiquette",
    description: "Practice professional email communication",
    difficulty: "intermediate",
    duration: 8,
    type: "communication",
  },
  {
    id: "instant-messaging",
    title: "Instant Messaging",
    description: "Quick and accurate typing for chat communications",
    difficulty: "beginner",
    duration: 5,
    type: "communication",
  },

  // General Professional
  {
    id: "professional-vocab",
    title: "Professional Vocabulary",
    description: "Common professional terms across industries",
    difficulty: "intermediate",
    duration: 10,
    type: "general",
  },
  {
    id: "report-writing",
    title: "Report Writing",
    description: "Practice typing various professional reports",
    difficulty: "advanced",
    duration: 12,
    type: "general",
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

  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Practice</h1>
        <p className="text-muted-foreground">
          Master typing for your profession with our comprehensive collection of exercises
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
            <option value="basic">Basic Skills</option>
            <option value="academic">Academic</option>
            <option value="business">Business</option>
            <option value="medical">Medical</option>
            <option value="legal">Legal</option>
            <option value="journalism">Journalism</option>
            <option value="social">Social Media</option>
            <option value="finance">Financial</option>
            <option value="administrative">Administrative</option>
            <option value="creative">Creative Writing</option>
            <option value="communication">Communication</option>
            <option value="general">General Professional</option>
            <option value="speed">Speed Training</option>
            <option value="accuracy">Accuracy Training</option>
            <option value="numbers">Numbers & Data</option>
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredLessons.map((lesson) => (
          <Link
            key={lesson.id}
            href={`/practice/${lesson.id}`}
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
                <span className="capitalize">
                  {lesson.type}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

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