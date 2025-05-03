import type { Lesson } from "@/app/practice/page";

const commonWords = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
  "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
  "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  "thing", "long", "those", "little", "man", "life", "great", "where", "through", "too",
  "mean", "old", "same", "tell", "does", "set", "three", "feel", "high", "right",
  "still", "might", "place", "while", "found", "every", "under", "last", "ask", "need",
  "school", "never", "start", "big", "off", "house", "world", "area", "small", "end",
  "keep", "put", "home", "read", "hand", "port", "large", "spell", "add", "land",
  "here", "must", "such", "follow", "act", "why", "many", "has", "more", "write",
  "number", "water", "been", "call", "oil", "find", "down", "did", "made", "may",
  "part", "city", "soon", "boat"
];

const basicTexts = {
  "home-row": "asdf jkl; asdf jkl; asdf jkl; asdf jkl; asdf jkl; asdf jkl; asdf jkl; asdf jkl; asdf jkl; asdf jkl;",
  "top-row": "qwerty uiop qwerty uiop qwerty uiop qwerty uiop qwerty uiop qwerty uiop qwerty uiop qwerty uiop",
  "bottom-row": "zxcv bnm zxcv bnm zxcv bnm zxcv bnm zxcv bnm zxcv bnm zxcv bnm zxcv bnm zxcv bnm zxcv bnm",
  "numbers-symbols": "1234567890 !@#$%^&*() 1234567890 !@#$%^&*() 1234567890 !@#$%^&*()",
};

const businessTexts = {
  "business-correspondence": `Dear Mr. Johnson,

I hope this email finds you well. I am writing to follow up on our meeting from last week regarding the Q3 sales projections. I have reviewed the numbers and prepared a detailed analysis for your consideration.

Best regards,
Sarah Smith`,
  "business-terms": "Revenue growth, market share, stakeholder value, return on investment (ROI), quarterly earnings, profit margins, business development, strategic planning, competitive advantage, market analysis.",
};

const academicTexts = {
  "academic-writing": "The study's findings suggest a strong correlation between the variables (p < 0.05). Furthermore, the data indicates that the hypothesis was supported by empirical evidence. However, further research is needed to validate these preliminary results.",
  "research-terms": "Methodology, hypothesis testing, statistical significance, peer review, literature review, qualitative analysis, quantitative research, empirical evidence, theoretical framework, data collection.",
};

const medicalTexts = {
  "medical-terms": "Myocardial infarction, hypertension, tachycardia, bronchitis, osteoarthritis, gastrointestinal, hematology, oncology, neurological, cardiovascular.",
  "patient-records": "Patient presents with acute abdominal pain, fever (38.5°C), and nausea. Medical history includes hypertension and type 2 diabetes. Current medications: Metformin 500mg BID, Lisinopril 10mg QD.",
};

const legalTexts = {
  "legal-terms": "Whereas, heretofore, jurisdiction, plaintiff, defendant, affidavit, stipulation, pursuant to, hereinafter, tort law, statutory compliance.",
  "legal-documents": "This Agreement (\"Agreement\") is made and entered into as of the date of execution by and between the parties hereto, for the purpose of establishing the terms and conditions of the proposed business relationship.",
};

const journalismTexts = {
  "news-writing": "BREAKING NEWS: City Council Approves New Development Project\n\nThe City Council voted 7-2 today to approve a controversial $50 million development project in the downtown district. The project is expected to create 500 new jobs.",
  "interview-transcription": "Interviewer: What inspired you to start this company?\nInterviewee: Well, I saw a gap in the market back in 2015. There was a real need for innovative solutions in this space, and I believed we could make a difference.",
};

const socialTexts = {
  "social-posts": "Just launched our new product! 🚀 Check out these amazing features that will revolutionize your workflow. #Innovation #ProductLaunch #TechNews",
  "hashtag-mastery": "#ThrowbackThursday #NoFilter #InstaGood #PhotoOfTheDay #TrendingNow #FollowFriday #MotivationMonday #WednesdayWisdom",
};

const financeTexts = {
  "financial-terms": "Assets, liabilities, equity, depreciation, amortization, cash flow, balance sheet, income statement, accounts receivable, accounts payable.",
  "financial-reports": "Q3 Financial Summary:\nRevenue: $2.5M (+15% YoY)\nGross Margin: 65%\nEBITDA: $750K\nOperating Expenses: $1.2M\nNet Profit: $450K",
};

const administrativeTexts = {
  "data-entry": "Employee ID: 12345\nName: John Smith\nDepartment: Sales\nHire Date: 2023-01-15\nSalary: $65,000\nEmail: john.smith@company.com",
  "office-correspondence": "MEMO\nTo: All Staff\nFrom: HR Department\nRe: Updated Office Policies\nDate: 2024-05-01\n\nPlease review the attached document for important updates to our company policies.",
};

const creativeTexts = {
  "creative-prompts": "The old clock on the wall ticked steadily as shadows danced across the room. Through the window, a gentle breeze carried the scent of blooming jasmine. Time seemed to stand still in this moment.",
  "poetry-prose": "Autumn leaves falling gently,\nDancing on the morning breeze.\nGolden sunlight filters through,\nPainting shadows on the trees.",
};

const communicationTexts = {
  "email-etiquette": "Subject: Meeting Follow-up\n\nDear Team,\n\nThank you for your participation in today's project review meeting. I've attached the meeting minutes and action items for your reference.\n\nBest regards,\nJane",
  "instant-messaging": "Hi! Are you available for a quick chat about the project? I have a few questions about the timeline. Let me know what works best for you. Thanks!",
};

const generalTexts = {
  "professional-vocab": "Professional development, project management, team collaboration, strategic planning, client relations, quality assurance, time management, resource allocation.",
  "report-writing": "Executive Summary:\nThis report analyzes the current market trends and provides recommendations for strategic growth opportunities. Key findings indicate a 25% increase in market demand.",
};

const speedTexts = {
  "speed-drills": "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!",
  "rapid-words": "time life work day home world school family friend business company market system group number problem case point government place year story fact question",
};

const accuracyTexts = {
  "precision-practice": "Carefully type each word: meticulous, precision, accuracy, diligence, thoroughness, exactitude, fastidious, scrupulous, punctilious, conscientious.",
  "error-reduction": "Their there they're, your you're, its it's, affect effect, principle principal, weather whether, accept except, advice advise, loose lose, than then.",
};

export function generateText(wordCount: number = 50): string {
  const text: string[] = [];
  
  for (let i = 0; i < wordCount; i++) {
    // Get a random word
    const word = commonWords[Math.floor(Math.random() * commonWords.length)];
    
    // Capitalize first word of sentence and add period every 8-12 words
    if (i === 0 || text[text.length - 1].endsWith(".")) {
      text.push(word.charAt(0).toUpperCase() + word.slice(1));
    } else if (i > 0 && (i + 1) % Math.floor(Math.random() * 5 + 8) === 0) {
      text.push(word + ".");
    } else {
      text.push(word);
    }
  }

  return text.join(" ");
}

export function generateTextForLesson(lesson: Lesson): string {
  const texts: { [key: string]: { [key: string]: string } } = {
    basic: basicTexts,
    business: businessTexts,
    academic: academicTexts,
    medical: medicalTexts,
    legal: legalTexts,
    journalism: journalismTexts,
    social: socialTexts,
    finance: financeTexts,
    administrative: administrativeTexts,
    creative: creativeTexts,
    communication: communicationTexts,
    general: generalTexts,
    speed: speedTexts,
    accuracy: accuracyTexts,
  };

  // For numbers type, use the numbers-symbols text from basicTexts
  if (lesson.type === "numbers") {
    return basicTexts["numbers-symbols"];
  }

  const typeTexts = texts[lesson.type];
  if (!typeTexts || !typeTexts[lesson.id]) {
    // Fallback text if no specific text is found
    return "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!";
  }

  return typeTexts[lesson.id];
}

export function calculateWPM(input: string, text: string, timeInSeconds: number): { wpm: number; accuracy: number } {
  const words = input.trim().split(/\s+/).length;
  const wpm = Math.round((words / timeInSeconds) * 60);

  let correctChars = 0;
  const minLength = Math.min(input.length, text.length);
  
  for (let i = 0; i < minLength; i++) {
    if (input[i] === text[i]) {
      correctChars++;
    }
  }

  const accuracy = Math.round((correctChars / text.length) * 100);

  return { wpm, accuracy };
} 