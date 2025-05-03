"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import confetti from 'canvas-confetti';

interface Word {
  id: number;
  text: string;
  position: number;
  speed: number;
  category: WordCategory;
  isPowerUp?: boolean;
  powerUpType?: PowerUpType;
  color?: string;
  points?: number;
}

type WordCategory = "common" | "animals" | "food" | "countries" | "tech" | "programming" | "science";
type PowerUpType = "slowdown" | "clearScreen" | "doublePoints" | "shield" | "timeFreezer" | "pointsBooster";
type GameMode = "classic" | "zen" | "challenge" | "timeAttack";

const CATEGORIES: Record<WordCategory, string[]> = {
  common: [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
    "it", "for", "not", "on", "with", "he", "as", "you", "do", "at"
  ],
  animals: [
    "dog", "cat", "lion", "tiger", "bear", "wolf", "fox", "deer", "bird", "fish",
    "snake", "eagle", "shark", "whale", "zebra", "panda", "koala", "monkey", "owl"
  ],
  food: [
    "pizza", "pasta", "sushi", "bread", "cake", "apple", "salad", "steak", "rice",
    "soup", "taco", "curry", "fruit", "candy", "chips", "cheese", "eggs", "milk"
  ],
  countries: [
    "usa", "china", "india", "japan", "france", "spain", "italy", "brazil", "canada",
    "russia", "korea", "egypt", "peru", "chile", "cuba", "kenya", "iran", "iraq"
  ],
  tech: [
    "code", "data", "web", "app", "cloud", "file", "link", "site", "blog", "chat",
    "game", "user", "post", "page", "mail", "tech", "byte", "node", "react", "vue"
  ],
  programming: [
    "function", "class", "const", "let", "var", "if", "else", "for", "while", "return",
    "import", "export", "async", "await", "try", "catch", "interface", "type", "enum"
  ],
  science: [
    "atom", "cell", "dna", "energy", "force", "gravity", "mass", "molecule", "neutron",
    "proton", "quantum", "theory", "velocity", "wave", "electron", "photon", "nucleus"
  ]
};

const POWER_UPS: Record<PowerUpType, { color: string; effect: string }> = {
  slowdown: { color: "bg-blue-500", effect: "Slow down words" },
  clearScreen: { color: "bg-red-500", effect: "Clear all words" },
  doublePoints: { color: "bg-yellow-500", effect: "Double points" },
  shield: { color: "bg-green-500", effect: "Temporary shield" },
  timeFreezer: { color: "bg-purple-500", effect: "Freeze time for 5 seconds" },
  pointsBooster: { color: "bg-orange-500", effect: "5x points for next 10 words" }
};

const GAME_MODES: Record<GameMode, { name: string; description: string }> = {
  classic: {
    name: "Classic Mode",
    description: "Type words before they reach the bottom. Game ends when a word hits the bottom."
  },
  zen: {
    name: "Zen Mode",
    description: "No game over, just practice and improve your typing speed."
  },
  challenge: {
    name: "Challenge Mode",
    description: "Words get progressively harder and faster. How long can you survive?"
  },
  timeAttack: {
    name: "Time Attack",
    description: "Type as many words as possible in 60 seconds."
  }
};

export function WordRush() {
  const [words, setWords] = useState<Word[]>([]);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [highestCombo, setHighestCombo] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(1);
  const [difficulty, setDifficulty] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<WordCategory>("common");
  const [selectedMode, setSelectedMode] = useState<GameMode>("classic");
  const [activePowerUps, setActivePowerUps] = useState<Set<PowerUpType>>(new Set());
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [pointsBoosterCount, setPointsBoosterCount] = useState(0);
  const [lastWordPosition, setLastWordPosition] = useState<{ x: number; y: number } | null>(null);
  const [personalBest, setPersonalBest] = useState<Record<GameMode, number>>({
    classic: 0,
    zen: 0,
    challenge: 0,
    timeAttack: 0
  });
  
  const gameLoopRef = useRef<NodeJS.Timeout>();
  const powerUpTimeoutRef = useRef<NodeJS.Timeout>();
  const timeAttackRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const generateWord = (): Word => {
    const wordList = CATEGORIES[selectedCategory];
    const isPowerUp = Math.random() < 0.1; // 10% chance for power-up
    const powerUpType = isPowerUp ? 
      Object.keys(POWER_UPS)[Math.floor(Math.random() * Object.keys(POWER_UPS).length)] as PowerUpType 
      : undefined;

    // Calculate points based on word length and difficulty
    const basePoints = Math.ceil(Math.random() * 5) * 10;
    const lengthBonus = Math.floor(Math.random() * 3) * 5;
    const difficultyBonus = difficulty * 10;

    return {
      id: Math.random(),
      text: wordList[Math.floor(Math.random() * wordList.length)],
      position: Math.random() * 80 + 10,
      speed: Math.random() * 0.5 + 0.5 * difficulty,
      category: selectedCategory,
      isPowerUp,
      powerUpType,
      color: isPowerUp ? POWER_UPS[powerUpType!].color : undefined,
      points: basePoints + lengthBonus + difficultyBonus
    };
  };

  const activatePowerUp = (type: PowerUpType) => {
    setActivePowerUps(prev => new Set([...prev, type]));
    
    // Apply power-up effects
    switch (type) {
      case "slowdown":
        setGameSpeed(0.5);
        break;
      case "clearScreen":
        setWords([]);
        break;
      case "doublePoints":
        setComboMultiplier(2);
        break;
      case "shield":
        // Shield will prevent game over for its duration
        break;
      case "timeFreezer":
        // Pause word movement for 5 seconds
        setGameSpeed(0);
        setTimeout(() => setGameSpeed(1), 5000);
        break;
      case "pointsBooster":
        setPointsBoosterCount(10);
        setComboMultiplier(5);
        break;
    }

    // Show power-up activation effect
    toast({
      title: "Power-up Activated!",
      description: POWER_UPS[type].effect,
      duration: 2000,
    });

    // Clear previous timeout
    if (powerUpTimeoutRef.current) {
      clearTimeout(powerUpTimeoutRef.current);
    }

    // Deactivate power-up after 10 seconds
    powerUpTimeoutRef.current = setTimeout(() => {
      setActivePowerUps(prev => {
        const next = new Set(prev);
        next.delete(type);
        return next;
      });

      // Reset effects
      switch (type) {
        case "slowdown":
        case "timeFreezer":
          setGameSpeed(1);
          break;
        case "doublePoints":
          setComboMultiplier(1);
          break;
      }
    }, 10000);
  };

  const startGame = () => {
    setWords([]);
    setScore(0);
    setCombo(0);
    setHighestCombo(0);
    setIsGameActive(true);
    setGameSpeed(1);
    setDifficulty(1);
    setComboMultiplier(1);
    setActivePowerUps(new Set());
    setPointsBoosterCount(0);
    inputRef.current?.focus();

    if (selectedMode === "timeAttack") {
      setTimeLeft(60);
      timeAttackRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Start game loop
    gameLoopRef.current = setInterval(() => {
      setWords(prevWords => {
        // Move existing words down
        const movedWords = prevWords.map(word => ({
          ...word,
          speed: word.speed + (0.001 * difficulty * gameSpeed) // Affected by game speed
        }));

        // Add new word occasionally
        if (Math.random() < 0.05 * difficulty) {
          return [...movedWords, generateWord()];
        }

        return movedWords;
      });

      // Increase difficulty in challenge mode
      if (selectedMode === "challenge") {
        setDifficulty(prev => prev + 0.001);
      }
    }, 50);
  };

  const endGame = () => {
    // Don't end game if shield is active or in zen mode
    if (activePowerUps.has("shield") || selectedMode === "zen") return;

    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    if (powerUpTimeoutRef.current) {
      clearTimeout(powerUpTimeoutRef.current);
    }
    if (timeAttackRef.current) {
      clearInterval(timeAttackRef.current);
    }
    
    setIsGameActive(false);

    // Update personal best if score is higher
    if (score > personalBest[selectedMode]) {
      setPersonalBest(prev => ({
        ...prev,
        [selectedMode]: score
      }));

      // Trigger confetti for new personal best
      void confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF4500']
      });
    } else if (score > 500) {
      // Trigger regular confetti for good score
      void confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff0000', '#00ff00', '#0000ff']
      });
    }

    toast({
      title: "Game Over!",
      description: `Final score: ${score} | Highest combo: ${highestCombo}x | Mode: ${GAME_MODES[selectedMode].name}`,
    });
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);

    // Check if input matches any word
    const matchedWordIndex = words.findIndex(word => word.text === e.target.value);
    if (matchedWordIndex !== -1) {
      const matchedWord = words[matchedWordIndex];
      setLastWordPosition({ 
        x: matchedWord.position, 
        y: matchedWord.speed 
      });

      // Handle power-up if matched word is a power-up
      if (matchedWord.isPowerUp && matchedWord.powerUpType) {
        activatePowerUp(matchedWord.powerUpType);
      }

      // Remove matched word and update score
      setWords(prevWords => prevWords.filter((_, index) => index !== matchedWordIndex));
      const basePoints = 10;
      const comboBonus = Math.floor(basePoints * (1 + combo * 0.1));
      const finalPoints = comboBonus * comboMultiplier;
      setScore(prev => prev + finalPoints);
      
      // Update combo
      setCombo(prev => {
        const newCombo = prev + 1;
        setHighestCombo(current => Math.max(current, newCombo));
        return newCombo;
      });
      setInput("");
      
      // Show combo effect
      if (combo > 0 && combo % 5 === 0) {
        void confetti({
          particleCount: 50,
          spread: 45,
          origin: { x: matchedWord.position / 100, y: matchedWord.speed / 100 },
          colors: ['#ff0000', '#00ff00', '#0000ff']
        });
      }

      // Increase difficulty every 100 points
      if (score > 0 && score % 100 === 0) {
        setDifficulty(prev => Math.min(prev + 0.1, 2));
      }
    }
  };

  // Check for game over condition
  useEffect(() => {
    if (isGameActive && words.some(word => word.speed > 100)) {
      endGame();
    }
  }, [words, isGameActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
      if (powerUpTimeoutRef.current) {
        clearTimeout(powerUpTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative min-h-[600px] bg-card rounded-lg p-4 overflow-hidden">
      <div className="absolute top-4 right-4 flex gap-4">
        <div className="text-xl font-bold">Score: {score}</div>
        <div className="text-xl font-bold">
          Combo: <span className={cn(
            "transition-colors",
            combo >= 10 ? "text-red-500" :
            combo >= 5 ? "text-yellow-500" :
            "text-foreground"
          )}>{combo}x</span>
        </div>
      </div>

      {!isGameActive ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold">Select Category</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {(Object.keys(CATEGORIES) as WordCategory[]).map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          <Button size="lg" onClick={startGame}>
            Start Game
          </Button>
        </div>
      ) : (
        <>
          <div className="relative h-[500px] mb-4">
            <AnimatePresence>
              {words.map((word) => (
                <motion.div
                  key={word.id}
                  className={cn(
                    "absolute text-lg font-medium px-3 py-1 rounded-full",
                    word.isPowerUp && word.powerUpType && POWER_UPS[word.powerUpType].color,
                    !word.isPowerUp && "bg-primary/10"
                  )}
                  style={{
                    left: `${word.position}%`,
                    top: `${word.speed}%`,
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  {word.text}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Combo effect */}
            <AnimatePresence>
              {lastWordPosition && combo > 1 && (
                <motion.div
                  className="absolute text-2xl font-bold text-primary"
                  style={{
                    left: `${lastWordPosition.x}%`,
                    top: `${lastWordPosition.y}%`,
                  }}
                  initial={{ opacity: 1, scale: 1, y: 0 }}
                  animate={{ opacity: 0, scale: 2, y: -50 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  +{combo}x
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInput}
              className={cn(
                "w-full px-4 py-2 text-lg rounded-lg bg-background",
                "border border-input focus:outline-none focus:ring-2 focus:ring-primary"
              )}
              placeholder="Type the words..."
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          </div>

          {/* Active power-ups display */}
          <div className="absolute top-16 left-4 flex gap-2">
            {Array.from(activePowerUps).map((powerUp) => (
              <div
                key={powerUp}
                className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium text-white",
                  POWER_UPS[powerUp].color
                )}
              >
                {powerUp}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
} 