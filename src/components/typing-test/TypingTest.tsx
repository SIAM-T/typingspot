"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { generateText, calculateWPM } from "@/lib/utils/text-generator";
import { keyboardSounds } from "@/lib/utils/keyboard-sounds";
import { UserPreferencesManager } from "@/lib/utils/user-preferences";
import { keyboardShortcuts } from "@/lib/utils/keyboard-shortcuts";
import { useAuth } from "@/components/providers/AuthProvider";
import { supabase } from "@/lib/supabase/config";
import { checkAndUpdateAchievements } from "@/lib/utils/achievements";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

type TestDuration = 15 | 30 | 60 | 300;

interface TestResults {
  wpm: number;
  accuracy: number;
  duration: number;
  timeElapsed: number;
  rawWpm: number;
  correctChars: number;
  incorrectChars: number;
  totalKeystrokes: number;
  replayData: KeystrokeData[];
}

interface KeystrokeData {
  key: string;
  timestamp: number;
  correct: boolean;
}

export function TypingTest() {
  const [text, setText] = useState("");
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [lastTickTime, setLastTickTime] = useState<number>(0);
  const [testDuration, setTestDuration] = useState<TestDuration>(() => {
    return UserPreferencesManager.getPreferences().lastTestDuration as TestDuration;
  });
  const [isTestActive, setIsTestActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [results, setResults] = useState<TestResults | null>(null);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return UserPreferencesManager.getPreferences().soundEnabled;
  });
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [visibleTextStart, setVisibleTextStart] = useState(0);
  const [typingData, setTypingData] = useState<Array<{ key: string; timestamp: number; correct: boolean }>>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const lineHeight = 40; // Height of each line in pixels
  const visibleLines = 4; // Changed to show 4 lines
  const { user } = useAuth();
  const { toast } = useToast();

  // Initialize or reset the test
  const initTest = useCallback(() => {
    const newText = generateText(testDuration === 300 ? 200 : 100);
    setText(newText);
    setInput("");
    setTimeLeft(testDuration);
    setIsTestActive(false);
    setIsPaused(false);
    setResults(null);
    setCurrentCharIndex(0);
    startTimeRef.current = 0;
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    inputRef.current?.focus();
  }, [testDuration]);

  // Function to update visible text portion
  const updateVisibleText = useCallback(() => {
    const text = textContainerRef.current?.textContent || '';
    const lines = text.split('\n');
    let currentLine = 0;
    let charCount = 0;
    
    // Find which line contains the current character
    for (let i = 0; i < lines.length; i++) {
      if (charCount + lines[i].length >= currentCharIndex) {
        currentLine = i;
        break;
      }
      charCount += lines[i].length + 1; // +1 for newline
    }

    // Update visible text start if needed
    if (currentLine > 1) {
      setVisibleTextStart(Math.max(0, currentLine - 1));
    }
  }, [currentCharIndex]);

  // Handle input changes
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    // Prevent typing if test is complete
    if (results || !isTestActive) {
      e.preventDefault();
      return;
    }

    if (!isTestActive && !isPaused && value.length === 1) {
      setIsTestActive(true);
      startTimeRef.current = Date.now();
    }

    // Record typing data
    if (value.length > input.length) {
      const newChar = value[value.length - 1];
      const isCorrect = newChar === text[value.length - 1];
      setTypingData(prev => [...prev, {
        key: newChar,
        timestamp: Date.now() - startTimeRef.current,
        correct: isCorrect
      }]);
    }

    // Play sound based on correct/incorrect input
    if (keyboardSounds && soundEnabled && !isPaused) {
      if (value.length > input.length) {
        const lastCharIndex = value.length - 1;
        if (value[lastCharIndex] === text[lastCharIndex]) {
          keyboardSounds.playKeyPress();
        } else {
          keyboardSounds.playError();
        }
      }
    }

    if (!isPaused) {
      setInput(value);
      setCurrentCharIndex(value.length);
      updateVisibleText();

      // Auto-end test if text is completed
      if (value === text) {
        endTest();
      }
    }
  };

  // Handle test completion
  const endTest = useCallback(async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsTestActive(false);
    setIsPaused(false);

    const timeElapsed = testDuration - timeLeft;
    const { wpm, accuracy, rawWpm, correctChars, incorrectChars, totalKeystrokes } = calculateWPM(input, text, timeElapsed);
    
    const testResults = {
      wpm,
      accuracy,
      duration: testDuration,
      timeElapsed,
      rawWpm,
      correctChars,
      incorrectChars,
      totalKeystrokes,
      replayData: typingData
    };
    setResults(testResults);

    // Save results if user is authenticated
    if (user) {
      try {
        await supabase.from("typing_tests").insert({
          user_id: user.id,
          wpm,
          accuracy,
          duration: timeElapsed,
          character_count: input.length,
          error_count: incorrectChars,
          raw_wpm: rawWpm,
          correct_chars: correctChars,
          incorrect_chars: incorrectChars,
          total_keystrokes: totalKeystrokes,
          replay_data: typingData,
          test_type: 'practice',
          timestamp: new Date().toISOString()
        });

        // Check and update achievements
        await checkAndUpdateAchievements(user.id);
      } catch (error) {
        console.error("Failed to save results:", error);
        toast({
          title: "Error",
          description: "Failed to save your results. Please try again.",
          variant: "destructive"
        });
      }
    }
  }, [input, text, timeLeft, testDuration, user, toast, typingData]);

  // Timer effect
  useEffect(() => {
    if (isTestActive && !isPaused && timeLeft > 0) {
      const startTime = performance.now();
      setLastTickTime(startTime);

      const timer = setInterval(() => {
        const currentTime = performance.now();
        const elapsedTime = (currentTime - lastTickTime) / 1000;
        
        setTimeLeft((prev) => {
          const newTime = prev - elapsedTime;
          if (newTime <= 0) {
            clearInterval(timer);
            endTest();
            return 0;
          }
          setLastTickTime(currentTime);
          return newTime;
        });
      }, 100); // Update more frequently for smoother countdown

      return () => clearInterval(timer);
    }
  }, [isTestActive, isPaused, timeLeft, lastTickTime, endTest]);

  // Initialize test on mount and when duration changes
  useEffect(() => {
    initTest();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [testDuration, initTest]);

  // Update preferences when settings change
  useEffect(() => {
    UserPreferencesManager.updatePreferences({
      soundEnabled,
      lastTestDuration: testDuration,
    });
  }, [soundEnabled, testDuration]);

  // Register keyboard shortcuts
  useEffect(() => {
    if (!keyboardShortcuts) return;

    const shortcuts = keyboardShortcuts;

    shortcuts.register('r', () => {
      if (!isTestActive || isPaused) initTest();
    }, 'Restart test');

    shortcuts.register('m', () => {
      const newSoundEnabled = !soundEnabled;
      setSoundEnabled(newSoundEnabled);
      if (keyboardSounds) {
        keyboardSounds.setEnabled(newSoundEnabled);
      }
    }, 'Toggle sound');

    shortcuts.register('?', () => {
      setShowShortcuts(true);
    }, 'Show keyboard shortcuts');

    shortcuts.register('Escape', () => {
      setShowShortcuts(false);
    }, 'Hide keyboard shortcuts');

    return () => {
      shortcuts.unregister('r');
      shortcuts.unregister('m');
      shortcuts.unregister('?');
      shortcuts.unregister('Escape');
    };
  }, [initTest, isTestActive, isPaused, soundEnabled]);

  // Focus input on mount and after each test
  useEffect(() => {
    const focusInput = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    focusInput();
    window.addEventListener('focus', focusInput);
    window.addEventListener('click', focusInput);

    return () => {
      window.removeEventListener('focus', focusInput);
      window.removeEventListener('click', focusInput);
    };
  }, []);

  // Prevent default behavior of certain keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent tab from changing focus
      if (e.key === 'Tab') {
        e.preventDefault();
      }
      // Prevent backspace from navigating back
      if (e.key === 'Backspace' && !isTestActive) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTestActive]);

  // Force end test
  const forceEndTest = () => {
    if (isTestActive && !results) {
      endTest();
    }
  };

  // Replay test with same text
  const replayTest = () => {
    setInput("");
    setTimeLeft(testDuration);
    setIsTestActive(false);
    setIsPaused(false);
    setResults(null);
    setCurrentCharIndex(0);
    startTimeRef.current = 0;
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    inputRef.current?.focus();
  };

  // Generate new test
  const newTest = () => {
    const newText = generateText(testDuration === 300 ? 200 : 100);
    setText(newText);
    replayTest();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-wrap gap-4">
          <Button
            variant={testDuration === 15 ? "default" : "outline"}
            onClick={() => setTestDuration(15)}
          >
            15s
          </Button>
          <Button
            variant={testDuration === 30 ? "default" : "outline"}
            onClick={() => setTestDuration(30)}
          >
            30s
          </Button>
          <Button
            variant={testDuration === 60 ? "default" : "outline"}
            onClick={() => setTestDuration(60)}
          >
            60s
          </Button>
          <Button
            variant={testDuration === 300 ? "default" : "outline"}
            onClick={() => setTestDuration(300)}
          >
            5min
          </Button>
        </div>
        <div className="text-3xl font-bold font-mono">
          {Math.ceil(timeLeft)}s
        </div>
      </div>

      <div className="relative h-[160px] typing-text-container bg-card rounded-lg shadow-sm" ref={textContainerRef}>
        <div
          className="font-mono text-2xl md:text-3xl whitespace-pre-wrap select-none p-8 typing-text-content"
          style={{
            transform: `translateY(-${Math.max(0, visibleTextStart * lineHeight)}px)`,
            transition: 'transform 0.2s ease-out'
          }}
          aria-hidden="true"
        >
          {text.split('').map((char, index) => {
            const isTyped = index < input.length;
            const isCorrect = input[index] === char;
            const isCurrent = index === currentCharIndex;

            return (
              <span
                key={index}
                className={cn(
                  isTyped
                    ? isCorrect
                      ? "text-green-500 dark:text-green-400"
                      : "text-red-500 dark:text-red-400"
                    : "text-foreground",
                  isCurrent ? "bg-primary/20 rounded px-1" : ""
                )}
              >
                {char}
              </span>
            );
          })}
        </div>

        <textarea
          ref={inputRef}
          value={input}
          onChange={handleInput}
          className="absolute inset-0 w-full h-full opacity-30 cursor-text typing-text-container"
          style={{ resize: "none" }}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          aria-label="Type here to start the test"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {results ? (
          <>
            <div className="p-4 rounded-lg bg-card">
              <div className="text-3xl font-bold text-primary">{Math.round(results.wpm)}</div>
              <div className="text-sm text-muted-foreground">WPM</div>
            </div>
            <div className="p-4 rounded-lg bg-card">
              <div className="text-3xl font-bold text-primary">{Math.round(results.rawWpm)}</div>
              <div className="text-sm text-muted-foreground">Raw WPM</div>
            </div>
            <div className="p-4 rounded-lg bg-card">
              <div className="text-3xl font-bold text-primary">{Math.round(results.accuracy)}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
            <div className="p-4 rounded-lg bg-card">
              <div className="text-3xl font-bold text-primary">{results.timeElapsed}s</div>
              <div className="text-sm text-muted-foreground">Time</div>
            </div>
          </>
        ) : (
          isTestActive && (
            <>
              <div className="p-4 rounded-lg bg-card">
                <div className="text-3xl font-bold text-primary">
                  {Math.round((input.length / 5) / ((testDuration - timeLeft) / 60))}
                </div>
                <div className="text-sm text-muted-foreground">Current WPM</div>
              </div>
              <div className="p-4 rounded-lg bg-card">
                <div className="text-3xl font-bold text-primary">
                  {Math.round((input.length) / ((testDuration - timeLeft) / 60))}
                </div>
                <div className="text-sm text-muted-foreground">Current CPM</div>
              </div>
              <div className="p-4 rounded-lg bg-card">
                <div className="text-3xl font-bold text-primary">
                  {input.length > 0
                    ? Math.round((input.split('').filter((char, i) => char === text[i]).length / input.length) * 100)
                    : 100}%
                </div>
                <div className="text-sm text-muted-foreground">Current Accuracy</div>
              </div>
              <div className="p-4 rounded-lg bg-card">
                <div className="text-3xl font-bold text-primary">{Math.round(testDuration - timeLeft)}s</div>
                <div className="text-sm text-muted-foreground">Time Elapsed</div>
              </div>
            </>
          )
        )}
      </div>

      <div className="flex justify-center gap-4">
        {isTestActive && !results && (
          <Button 
            variant="destructive"
            onClick={forceEndTest}
          >
            End Test
          </Button>
        )}
        <Button onClick={newTest}>
          New Test (R)
        </Button>
        <Button
          variant="outline"
          onClick={() => setSoundEnabled(!soundEnabled)}
        >
          {soundEnabled ? "Sound On (M)" : "Sound Off (M)"}
        </Button>
      </div>

      {results && (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-card">
              <div className="text-sm text-muted-foreground">Correct Characters</div>
              <div className="text-2xl font-bold text-primary">{results.correctChars}</div>
            </div>
            <div className="p-4 rounded-lg bg-card">
              <div className="text-sm text-muted-foreground">Incorrect Characters</div>
              <div className="text-2xl font-bold text-primary">{results.incorrectChars}</div>
            </div>
            <div className="p-4 rounded-lg bg-card">
              <div className="text-sm text-muted-foreground">Total Keystrokes</div>
              <div className="text-2xl font-bold text-primary">{results.totalKeystrokes}</div>
            </div>
            <div className="p-4 rounded-lg bg-card">
              <div className="text-sm text-muted-foreground">Characters per Second</div>
              <div className="text-2xl font-bold text-primary">
                {Math.round((results.totalKeystrokes / results.timeElapsed) * 10) / 10}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-4">Replay</h3>
            <div className="h-[100px] overflow-hidden relative">
              <div 
                className="font-mono text-sm whitespace-pre-wrap"
                style={{
                  animation: `typewriter ${results.timeElapsed}s linear forwards`,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all'
                }}
              >
                {text}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={replayTest}
              variant="outline"
              size="lg"
            >
              Retry Same Text
            </Button>
            <Button
              onClick={newTest}
              size="lg"
            >
              Try New Text
            </Button>
          </div>
        </motion.div>
      )}

      {showShortcuts && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Keyboard Shortcuts</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-mono">R</span>
                <span>Restart test</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono">M</span>
                <span>Toggle sound</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono">?</span>
                <span>Show shortcuts</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono">ESC</span>
                <span>Close shortcuts</span>
              </div>
            </div>
            <Button
              onClick={() => setShowShortcuts(false)}
              className="mt-6 w-full"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      <div className="text-center mt-8 text-sm text-muted-foreground">
        Press <kbd className="px-2 py-1 bg-secondary rounded">?</kbd> to view keyboard shortcuts
      </div>
    </div>
  );
} 