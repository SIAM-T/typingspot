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
  type: "basic" | "speed" | "accuracy" | "business" | "academic" | "creative" | "communication" | "numbers" | "general" | "medical" | "legal" | "journalism" | "social" | "finance" | "administrative";
}

const lessons: Lesson[] = [
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
    description: "Practice the top row keys (QWERTY UIOP) for faster typing",
    difficulty: "beginner",
    duration: 5,
    type: "basic",
  },
  {
    id: "bottom-row",
    title: "Bottom Row Basics",
    description: "Learn the bottom row keys (ZXCV BNM) to complete your keyboard mastery",
    difficulty: "beginner",
    duration: 5,
    type: "basic",
  },

  // Academic/Student Focus
  {
    id: "essay-writing",
    title: "Essay Writing",
    description: "Practice typing academic essays with proper formatting and citations",
    difficulty: "intermediate",
    duration: 15,
    type: "academic",
  },
  {
    id: "research-notes",
    title: "Research Notes",
    description: "Quick note-taking exercises for lectures and research",
    difficulty: "intermediate",
    duration: 10,
    type: "academic",
  },
  {
    id: "bibliography",
    title: "Bibliography Practice",
    description: "Master typing academic references and citations quickly",
    difficulty: "intermediate",
    duration: 8,
    type: "academic",
  },
  {
    id: "scientific-terms",
    title: "Scientific Terms",
    description: "Practice typing common scientific and technical terminology",
    difficulty: "advanced",
    duration: 12,
    type: "academic",
  },

  // Business Professional
  {
    id: "business-emails",
    title: "Business Emails",
    description: "Professional email composition and formatting",
    difficulty: "intermediate",
    duration: 10,
    type: "business",
  },
  {
    id: "meeting-minutes",
    title: "Meeting Minutes",
    description: "Quick and accurate note-taking for business meetings",
    difficulty: "intermediate",
    duration: 12,
    type: "business",
  },
  {
    id: "financial-data",
    title: "Financial Data Entry",
    description: "Practice typing numbers, currencies, and financial reports",
    difficulty: "intermediate",
    duration: 10,
    type: "numbers",
  },
  {
    id: "business-reports",
    title: "Business Reports",
    description: "Type professional business reports and proposals",
    difficulty: "advanced",
    duration: 15,
    type: "business",
  },

  // Creative Writing
  {
    id: "story-writing",
    title: "Creative Writing",
    description: "Practice typing creative stories and narratives",
    difficulty: "intermediate",
    duration: 15,
    type: "creative",
  },
  {
    id: "dialogue-practice",
    title: "Dialogue Writing",
    description: "Master typing natural dialogue with proper punctuation",
    difficulty: "intermediate",
    duration: 10,
    type: "creative",
  },
  {
    id: "poetry-typing",
    title: "Poetry Format",
    description: "Practice typing poetry with correct formatting",
    difficulty: "intermediate",
    duration: 8,
    type: "creative",
  },

  // Communication
  {
    id: "formal-letters",
    title: "Formal Letters",
    description: "Type professional formal letters and correspondence",
    difficulty: "intermediate",
    duration: 10,
    type: "communication",
  },
  {
    id: "quick-emails",
    title: "Quick Emails",
    description: "Practice typing common email responses quickly",
    difficulty: "beginner",
    duration: 8,
    type: "communication",
  },
  {
    id: "customer-service",
    title: "Customer Service",
    description: "Type professional customer service responses",
    difficulty: "intermediate",
    duration: 10,
    type: "communication",
  },

  // General Professional
  {
    id: "resume-cover",
    title: "Resume & Cover Letters",
    description: "Practice typing professional resumes and cover letters",
    difficulty: "intermediate",
    duration: 12,
    type: "general",
  },
  {
    id: "data-entry",
    title: "Data Entry",
    description: "Quick and accurate data entry practice",
    difficulty: "beginner",
    duration: 10,
    type: "numbers",
  },
  {
    id: "form-filling",
    title: "Form Filling",
    description: "Practice filling out common forms and applications",
    difficulty: "beginner",
    duration: 8,
    type: "general",
  },

  // Speed and Accuracy
  {
    id: "speed-drills",
    title: "Speed Building",
    description: "Progressive exercises to increase typing speed",
    difficulty: "intermediate",
    duration: 10,
    type: "speed",
  },
  {
    id: "accuracy-focus",
    title: "Accuracy Training",
    description: "Exercises focused on 100% accuracy",
    difficulty: "intermediate",
    duration: 10,
    type: "accuracy",
  },
  {
    id: "number-mastery",
    title: "Number Mastery",
    description: "Practice typing numbers and numerical data quickly",
    difficulty: "intermediate",
    duration: 8,
    type: "numbers",
  },
  {
    id: "advanced-speed",
    title: "Advanced Speed",
    description: "High-speed typing drills for experienced typists",
    difficulty: "advanced",
    duration: 15,
    type: "speed",
  },

  // Medical Field
  {
    id: "medical-terms",
    title: "Medical Terminology",
    description: "Practice typing common medical terms and abbreviations",
    difficulty: "advanced",
    duration: 15,
    type: "medical",
  },
  {
    id: "patient-records",
    title: "Patient Records",
    description: "Practice typing patient medical records and histories",
    difficulty: "intermediate",
    duration: 12,
    type: "medical",
  },
  {
    id: "prescription-writing",
    title: "Prescription Writing",
    description: "Learn to type medical prescriptions accurately",
    difficulty: "advanced",
    duration: 10,
    type: "medical",
  },
  {
    id: "medical-reports",
    title: "Medical Reports",
    description: "Type detailed medical reports and diagnoses",
    difficulty: "advanced",
    duration: 15,
    type: "medical",
  },

  // Legal Profession
  {
    id: "legal-terms",
    title: "Legal Terminology",
    description: "Master common legal terms and phrases",
    difficulty: "advanced",
    duration: 12,
    type: "legal",
  },
  {
    id: "legal-documents",
    title: "Legal Documents",
    description: "Practice typing contracts and legal documents",
    difficulty: "advanced",
    duration: 15,
    type: "legal",
  },
  {
    id: "court-transcripts",
    title: "Court Transcripts",
    description: "Quick and accurate court proceeding transcription",
    difficulty: "advanced",
    duration: 20,
    type: "legal",
  },
  {
    id: "case-briefs",
    title: "Case Briefs",
    description: "Practice typing legal case summaries and briefs",
    difficulty: "intermediate",
    duration: 12,
    type: "legal",
  },

  // Journalism
  {
    id: "news-articles",
    title: "News Articles",
    description: "Write news articles with proper formatting",
    difficulty: "intermediate",
    duration: 15,
    type: "journalism",
  },
  {
    id: "interview-transcription",
    title: "Interview Transcription",
    description: "Practice transcribing interview recordings",
    difficulty: "intermediate",
    duration: 12,
    type: "journalism",
  },
  {
    id: "press-releases",
    title: "Press Releases",
    description: "Create professional press releases",
    difficulty: "intermediate",
    duration: 10,
    type: "journalism",
  },
  {
    id: "feature-stories",
    title: "Feature Stories",
    description: "Type engaging feature stories and long-form articles",
    difficulty: "advanced",
    duration: 20,
    type: "journalism",
  },

  // Social Media & Marketing
  {
    id: "social-posts",
    title: "Social Media Posts",
    description: "Create engaging social media content quickly",
    difficulty: "beginner",
    duration: 8,
    type: "social",
  },
  {
    id: "marketing-copy",
    title: "Marketing Copy",
    description: "Write persuasive marketing content",
    difficulty: "intermediate",
    duration: 12,
    type: "social",
  },
  {
    id: "product-descriptions",
    title: "Product Descriptions",
    description: "Create compelling product descriptions",
    difficulty: "intermediate",
    duration: 10,
    type: "social",
  },
  {
    id: "campaign-planning",
    title: "Campaign Planning",
    description: "Type marketing campaign plans and strategies",
    difficulty: "advanced",
    duration: 15,
    type: "social",
  },

  // Financial Sector
  {
    id: "financial-reports",
    title: "Financial Reports",
    description: "Type detailed financial reports and analyses",
    difficulty: "advanced",
    duration: 15,
    type: "finance",
  },
  {
    id: "investment-summaries",
    title: "Investment Summaries",
    description: "Create investment reports and recommendations",
    difficulty: "advanced",
    duration: 12,
    type: "finance",
  },
  {
    id: "banking-documents",
    title: "Banking Documents",
    description: "Practice typing banking forms and documents",
    difficulty: "intermediate",
    duration: 10,
    type: "finance",
  },
  {
    id: "tax-documents",
    title: "Tax Documentation",
    description: "Accurate typing of tax forms and reports",
    difficulty: "advanced",
    duration: 12,
    type: "finance",
  },

  // Administrative
  {
    id: "scheduling",
    title: "Scheduling & Calendar",
    description: "Quick appointment and schedule management",
    difficulty: "beginner",
    duration: 8,
    type: "administrative",
  },
  {
    id: "office-memos",
    title: "Office Memos",
    description: "Create clear and concise office memorandums",
    difficulty: "intermediate",
    duration: 10,
    type: "administrative",
  },
  {
    id: "inventory-lists",
    title: "Inventory Management",
    description: "Practice typing inventory lists and orders",
    difficulty: "beginner",
    duration: 8,
    type: "administrative",
  },
  {
    id: "travel-planning",
    title: "Travel Planning",
    description: "Type travel itineraries and arrangements",
    difficulty: "intermediate",
    duration: 10,
    type: "administrative",
  },

  // Academic Extensions
  {
    id: "thesis-writing",
    title: "Thesis Writing",
    description: "Practice typing academic thesis content",
    difficulty: "advanced",
    duration: 20,
    type: "academic",
  },
  {
    id: "lab-reports",
    title: "Lab Reports",
    description: "Type scientific lab reports and procedures",
    difficulty: "advanced",
    duration: 15,
    type: "academic",
  },
  {
    id: "lecture-notes",
    title: "Lecture Notes",
    description: "Quick and organized lecture note-taking",
    difficulty: "intermediate",
    duration: 12,
    type: "academic",
  },
  {
    id: "academic-proposals",
    title: "Research Proposals",
    description: "Write academic research proposals",
    difficulty: "advanced",
    duration: 15,
    type: "academic",
  },

  // Business Extensions
  {
    id: "project-proposals",
    title: "Project Proposals",
    description: "Create detailed project proposals",
    difficulty: "advanced",
    duration: 15,
    type: "business",
  },
  {
    id: "business-plans",
    title: "Business Plans",
    description: "Type comprehensive business plans",
    difficulty: "advanced",
    duration: 20,
    type: "business",
  },
  {
    id: "sales-reports",
    title: "Sales Reports",
    description: "Create sales performance reports",
    difficulty: "intermediate",
    duration: 12,
    type: "business",
  },
  {
    id: "vendor-communications",
    title: "Vendor Communications",
    description: "Professional vendor emails and documents",
    difficulty: "intermediate",
    duration: 10,
    type: "business",
  }
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
                <span className="capitalize">
                  {lesson.type}
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