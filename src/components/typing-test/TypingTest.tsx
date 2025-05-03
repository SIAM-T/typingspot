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

interface TypingData {
  key: string;
  timestamp: number;
  correct: boolean;
}

interface TestResults {
  wpm: number;
  accuracy: number;
  duration: number;
  timeElapsed: number;
  rawWpm: number;
  correctChars: number;
  incorrectChars: number;
  totalKeystrokes: number;
  replayData: TypingData[];
}

type TestDuration = 15 | 30 | 60 | 300;

interface Props {
  initialText?: string;
}

export function TypingTest({ initialText }: Props) {
  const [input, setInput] = useState("");
  const [isTestActive, setIsTestActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [text, setText] = useState(initialText || "");
  const [results, setResults] = useState<TestResults | null>(null);
  const [typingData, setTypingData] = useState<TypingData[]>([]);
  const [testDuration, setTestDuration] = useState<TestDuration>(60);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [stats, setStats] = useState({
    wpm: 0,
    accuracy: 0,
    correctChars: 0,
    incorrectChars: 0
  });
  const { user } = useAuth();

  // Save result to database
  const saveResult = async (results: TestResults) => {
    try {
      await supabase.from("typing_results").insert({
        user_id: user!.id,
        wpm: results.wpm,
        accuracy: results.accuracy,
        duration: results.duration,
        text_type: "practice",
        correct_chars: results.correctChars,
        incorrect_chars: results.incorrectChars,
        total_keystrokes: results.totalKeystrokes,
        time_elapsed: results.timeElapsed
      });

      // Check and update achievements
      await checkAndUpdateAchievements(user!.id);
    } catch (error) {
      console.error("Error saving result:", error);
      toast({
        title: "Error",
        description: "Failed to save your test results.",
        variant: "destructive"
      });
    }
  };

  // Initialize preferences and text on client-side only
  useEffect(() => {
    const prefs = UserPreferencesManager.getPreferences();
    setTestDuration(prefs.lastTestDuration as TestDuration);
    setSoundEnabled(prefs.soundEnabled);
    if (initialText) {
      setText(initialText);
    } else {
      setText(generateText(testDuration === 300 ? 200 : 100));
    }
    setTimeLeft(testDuration);
  }, [initialText]);

  // End test function
  const endTest = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setIsTestActive(false);
    
    const testResults: TestResults = {
      wpm: stats.wpm,
      rawWpm: Math.round((input.length / 5) / ((testDuration - timeLeft) / 60)),
      accuracy: stats.accuracy,
      correctChars: stats.correctChars,
      incorrectChars: stats.incorrectChars,
      totalKeystrokes: stats.correctChars + stats.incorrectChars,
      duration: testDuration,
      timeElapsed: testDuration - timeLeft,
      replayData: typingData
    };
    
    setResults(testResults);

    toast({
      title: "Test Complete!",
      description: `WPM: ${testResults.wpm} | Accuracy: ${testResults.accuracy}%`,
    });

    // Save result if user is logged in
    if (user) {
      saveResult(testResults);
    }
  }, [stats, input, timeLeft, testDuration, typingData, user]);

  // Update stats based on current input
  const updateStats = useCallback(() => {
    // Don't update stats if test hasn't started
    if (!isTestActive || !startTimeRef.current) {
      setStats({
        wpm: 0,
        accuracy: 0,
        correctChars: 0,
        incorrectChars: 0
      });
      return;
    }

    let correctChars = 0;
    let incorrectChars = 0;

    // Count correct and incorrect characters
    for (let i = 0; i < input.length; i++) {
      if (i < text.length) {
        if (input[i] === text[i]) {
          correctChars++;
        } else {
          incorrectChars++;
        }
      } else {
        incorrectChars++;
      }
    }

    // Calculate elapsed time in minutes (ensure minimum of 1 second to avoid division by zero)
    const elapsedSeconds = Math.max((Date.now() - startTimeRef.current) / 1000, 1);
    const elapsedMinutes = elapsedSeconds / 60;

    // Calculate WPM and accuracy
    const wpm = Math.round((correctChars / 5) / elapsedMinutes);
    const accuracy = input.length > 0 ? Math.round((correctChars / input.length) * 100) : 0;

    // Update stats immediately
    setStats({
      wpm,
      accuracy,
      correctChars,
      incorrectChars
    });
  }, [input, text, isTestActive]);

  // Handle input changes
  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const value = e.target.value;
      
      // Start test on first input
      if (!isTestActive && value.length === 1) {
        setIsTestActive(true);
        startTimeRef.current = Date.now();
        setStats({
          wpm: 0,
          accuracy: 0,
          correctChars: 0,
          incorrectChars: 0
        });

        // Start timer
        timerIntervalRef.current = setInterval(() => {
          const elapsed = (Date.now() - startTimeRef.current) / 1000;
          const remaining = Math.max(0, testDuration - elapsed);
          setTimeLeft(remaining);

          if (remaining <= 0) {
            endTest();
          }
        }, 100);
      }

      setInput(value);
      
      // Update stats immediately after input change
      updateStats();

      // Auto-scroll text
      if (scrollRef.current && textContainerRef.current) {
        const lineHeight = 40;
        const currentLine = Math.floor(value.length / 50);
        const scrollTop = currentLine * lineHeight;
        scrollRef.current.scrollTop = Math.max(0, scrollTop - lineHeight);
      }

      // Play sound if enabled
      if (value.length > input.length && keyboardSounds && soundEnabled) {
        const newChar = value[value.length - 1];
        const isCorrect = newChar === text[value.length - 1];
        
        if (isCorrect) {
          keyboardSounds.playKeyPress();
        } else {
          keyboardSounds.playError();
        }
      }

      // Auto-end test if text is completed
      if (value === text) {
        endTest();
      }
    } catch (error) {
      console.error("Error handling input:", error);
      toast({
        title: "Error",
        description: "Something went wrong while typing. Please try again.",
        variant: "destructive"
      });
    }
  }, [isTestActive, input, text, soundEnabled, endTest, testDuration, updateStats, toast]);

  // Initialize test
  const initTest = useCallback(() => {
    const newText = generateText(testDuration === 300 ? 200 : 100);
    setText(newText);
    setInput("");
    setTimeLeft(testDuration);
    setIsTestActive(false);
    setResults(null);
    setTypingData([]);
    startTimeRef.current = 0;
    setStats({
      wpm: 0,
      accuracy: 0,
      correctChars: 0,
      incorrectChars: 0
    });
    
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }

    inputRef.current?.focus();
  }, [testDuration]);

  // Initialize test on mount and when duration changes
  useEffect(() => {
    initTest();
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
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
      if (!isTestActive) initTest();
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
  }, [initTest, isTestActive]);

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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-wrap gap-4">
          {[15, 30, 60, 300].map((duration) => (
            <Button
              key={duration}
              variant={testDuration === duration ? "default" : "outline"}
              onClick={() => setTestDuration(duration as TestDuration)}
              disabled={isTestActive}
            >
              {duration === 300 ? "5min" : `${duration}s`}
            </Button>
          ))}
        </div>
        <div className="text-3xl font-bold font-mono">
          {Math.ceil(timeLeft)}s
        </div>
      </div>

      <div className="relative h-[160px] overflow-hidden bg-card rounded-lg">
        <div
          ref={scrollRef}
          className="absolute inset-0 overflow-auto scrollbar-hide"
        >
          <div
            ref={textContainerRef}
            className="font-mono text-2xl md:text-3xl whitespace-pre-wrap select-none p-8"
          >
            {text.split('').map((char, index) => {
              const isTyped = index < input.length;
              const isCorrect = input[index] === char;
              const isCurrent = index === input.length; // Current character position

              return (
                <span
                  key={index}
                  className={cn(
                    isTyped
                      ? isCorrect
                        ? "text-green-500 dark:text-green-400"
                        : "text-red-500 dark:text-red-400"
                      : "text-foreground",
                    isCurrent && isTestActive ? "bg-primary/20 rounded-sm px-1 animate-pulse" : "" // Highlight current character
                  )}
                >
                  {char}
                </span>
              );
            })}
            {/* Add cursor at the end if we've typed all characters */}
            {input.length >= text.length && isTestActive && (
              <span className="bg-primary/20 rounded-sm px-1 animate-pulse">&nbsp;</span>
            )}
          </div>
        </div>

        <textarea
          ref={inputRef}
          value={input}
          onChange={handleInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-text resize-none p-8 font-mono text-2xl md:text-3xl"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          aria-label="Type here to start the test"
          disabled={!isTestActive && input.length > 0}
        />
      </div>

      {/* Stats display - show both during test and after completion */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-card">
          <div className="text-3xl font-bold text-primary">
            {stats.wpm}
          </div>
          <div className="text-sm text-muted-foreground">WPM</div>
        </div>
        <div className="p-4 rounded-lg bg-card">
          <div className="text-3xl font-bold text-primary">
            {stats.accuracy}%
          </div>
          <div className="text-sm text-muted-foreground">Accuracy</div>
        </div>
        <div className="p-4 rounded-lg bg-card">
          <div className="text-3xl font-bold text-primary">
            {stats.correctChars}
          </div>
          <div className="text-sm text-muted-foreground">Correct Characters</div>
        </div>
        <div className="p-4 rounded-lg bg-card">
          <div className="text-3xl font-bold text-primary">
            {stats.incorrectChars}
          </div>
          <div className="text-sm text-muted-foreground">Incorrect Characters</div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button onClick={initTest}>
          New Test
        </Button>
        <Button
          variant="outline"
          onClick={() => setSoundEnabled(!soundEnabled)}
        >
          {soundEnabled ? "Sound On" : "Sound Off"}
        </Button>
      </div>

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