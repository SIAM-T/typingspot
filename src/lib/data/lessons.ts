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