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

export function calculateWPM(
  typedText: string,
  originalText: string,
  timeInSeconds: number
): { 
  wpm: number; 
  accuracy: number;
  rawWpm: number;
  correctChars: number;
  incorrectChars: number;
  totalKeystrokes: number;
} {
  // Count correct characters and errors
  let correctChars = 0;
  let incorrectChars = 0;
  const minLength = Math.min(typedText.length, originalText.length);
  
  for (let i = 0; i < minLength; i++) {
    if (typedText[i] === originalText[i]) {
      correctChars++;
    } else {
      incorrectChars++;
    }
  }

  // Add remaining characters as errors if typed text is longer
  incorrectChars += Math.abs(typedText.length - originalText.length);

  // Calculate total keystrokes
  const totalKeystrokes = typedText.length;

  // Calculate accuracy based on total characters typed
  const accuracy = totalKeystrokes > 0 ? (correctChars / totalKeystrokes) * 100 : 0;

  // Calculate minutes
  const minutes = timeInSeconds / 60;

  // Calculate Raw WPM (all keystrokes)
  const rawWpm = Math.round((totalKeystrokes / 5) / minutes);

  // Calculate Net WPM (correct characters only)
  const netWpm = Math.max(0, Math.round((correctChars / 5) / minutes));

  return {
    wpm: netWpm,
    rawWpm,
    accuracy: Math.round(accuracy * 100) / 100,
    correctChars,
    incorrectChars,
    totalKeystrokes
  };
} 