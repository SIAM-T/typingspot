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
}

export function TypingTest() {
  const [text, setText] = useState("");
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState<number>(0);
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
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>(0);
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

  // Start the test when user starts typing
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    if (!isTestActive && !isPaused && value.length === 1) {
      setIsTestActive(true);
      startTimeRef.current = Date.now();
    }

    // Play sound based on correct/incorrect input
    if (keyboardSounds && soundEnabled && !isPaused) {
      if (value.length > input.length) { // New character typed
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
    }
    setIsTestActive(false);
    setIsPaused(false);

    const timeElapsed = testDuration - timeLeft;
    const results = calculateWPM(input, text, timeElapsed);
    
    const testResults = {
      wpm: results.wpm,
      accuracy: results.accuracy,
      duration: testDuration,
      timeElapsed
    };
    setResults(testResults);

    // Save results if user is authenticated
    if (user) {
      try {
        await supabase.from("typing_results").insert({
          user_id: user.id,
          wpm: results.wpm,
          accuracy: results.accuracy,
          duration: timeElapsed,
          text_type: "random"
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
  }, [input, text, timeLeft, testDuration, user, toast]);

  // Timer effect
  useEffect(() => {
    if (isTestActive && !isPaused && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            endTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTestActive, isPaused, timeLeft, endTest]);

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

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4 justify-center">
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

      <div className="relative">
        <div
          className="font-mono text-lg leading-relaxed whitespace-pre-wrap mb-8 select-none"
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
                  isCurrent && "bg-primary/20 rounded"
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
          className="absolute inset-0 opacity-0 cursor-default"
          style={{ resize: "none" }}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          aria-label="Type here to start the test"
        />
      </div>

      <div className="flex justify-center gap-8 text-lg">
        <div>Time: {timeLeft}s</div>
        {results && (
          <>
            <div>WPM: {Math.round(results.wpm)}</div>
            <div>Accuracy: {Math.round(results.accuracy)}%</div>
          </>
        )}
      </div>

      <div className="flex justify-center gap-4">
        <Button onClick={initTest}>
          Restart Test (R)
        </Button>
        <Button
          variant="outline"
          onClick={() => setSoundEnabled(!soundEnabled)}
        >
          {soundEnabled ? "Sound On (M)" : "Sound Off (M)"}
        </Button>
      </div>

      {/* Results */}
      {results && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold mb-4">Test Results</h2>
          <div className="grid grid-cols-3 gap-8 mb-6">
            <div>
              <div className="text-3xl font-bold text-primary">{results.wpm}</div>
              <div className="text-sm text-muted-foreground">WPM</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">
                {results.accuracy}%
              </div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">
                {results.timeElapsed}s
              </div>
              <div className="text-sm text-muted-foreground">Time</div>
            </div>
          </div>
          <Button
            onClick={initTest}
            size="lg"
            className="w-full max-w-sm"
          >
            Try Again
          </Button>
        </motion.div>
      )}

      {/* Keyboard shortcuts modal */}
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

      {/* Keyboard shortcuts hint */}
      <div className="text-center mt-8 text-sm text-muted-foreground">
        Press <kbd className="px-2 py-1 bg-secondary rounded">?</kbd> to view keyboard shortcuts
      </div>
    </div>
  );
} 