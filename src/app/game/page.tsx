"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Game {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  players: "single" | "multi";
  imageUrl: string;
  modes?: string[];
  features?: string[];
  comingSoon?: boolean;
}

const games: Game[] = [
  {
    id: "word-rush",
    title: "Word Rush",
    description: "Type words as they fall from the top of the screen. Multiple game modes and power-ups!",
    difficulty: "easy",
    players: "single",
    imageUrl: "/images/games/word-rush.png",
    modes: [
      "Classic Mode - Type before words hit bottom",
      "Zen Mode - Practice without pressure",
      "Challenge Mode - Progressive difficulty",
      "Time Attack - 60 seconds to score"
    ],
    features: [
      "7 Word Categories",
      "6 Different Power-ups",
      "Personal Best Tracking",
      "Combo System"
    ]
  },
  {
    id: "code-race",
    title: "Code Race",
    description: "Race against time typing code snippets. Perfect for programmers!",
    difficulty: "hard",
    players: "single",
    imageUrl: "/images/games/code-race.png",
    modes: [
      "Language-specific Challenges",
      "Algorithm Practice",
      "Code Review Mode"
    ],
    features: [
      "Syntax Highlighting",
      "Multiple Languages",
      "Real Code Samples"
    ]
  },
  {
    id: "type-battle",
    title: "Type Battle",
    description: "Challenge other players in real-time typing battles!",
    difficulty: "medium",
    players: "multi",
    imageUrl: "/images/games/type-battle.png",
    modes: [
      "1v1 Duels",
      "Battle Royale",
      "Team Matches"
    ],
    features: [
      "Live Rankings",
      "Chat System",
      "Custom Rooms"
    ]
  },
  {
    id: "word-blast",
    title: "Word Blast",
    description: "Clear words by typing them before they explode!",
    difficulty: "medium",
    players: "single",
    imageUrl: "/images/games/word-blast.png",
    modes: [
      "Arcade Mode",
      "Survival Mode",
      "Speed Run"
    ],
    features: [
      "Chain Reactions",
      "Special Words",
      "Power-ups"
    ],
    comingSoon: true
  },
  {
    id: "typing-defense",
    title: "Typing Defense",
    description: "Defend your base by typing words to destroy incoming enemies",
    difficulty: "hard",
    players: "single",
    imageUrl: "/images/games/typing-defense.png",
    modes: [
      "Campaign Mode",
      "Endless Mode",
      "Boss Battles"
    ],
    features: [
      "Tower Defense",
      "Upgrades System",
      "Different Enemy Types"
    ],
    comingSoon: true
  },
];

export default function GamePage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Game["difficulty"] | "all">("all");
  const [selectedPlayers, setSelectedPlayers] = useState<Game["players"] | "all">("all");

  const filteredGames = games.filter(game => {
    if (selectedDifficulty !== "all" && game.difficulty !== selectedDifficulty) return false;
    if (selectedPlayers !== "all" && game.players !== selectedPlayers) return false;
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
        <h1 className="text-3xl font-bold">Typing Games</h1>
        <p className="text-muted-foreground">
          Have fun while improving your typing skills with our collection of games
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Difficulty</label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as Game["difficulty"] | "all")}
            className="rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Players</label>
          <select
            value={selectedPlayers}
            onChange={(e) => setSelectedPlayers(e.target.value as Game["players"] | "all")}
            className="rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="all">All Types</option>
            <option value="single">Single Player</option>
            <option value="multi">Multiplayer</option>
          </select>
        </div>
      </div>

      {/* Games Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {filteredGames.map((game) => (
          <motion.div
            key={game.id}
            variants={item}
            className="group relative rounded-lg border border-border overflow-hidden"
          >
            <div className="aspect-video relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-2xl font-bold text-center">{game.title}</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-muted-foreground">{game.description}</p>
              
              {/* Game Modes */}
              {game.modes && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Game Modes:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {game.modes.map((mode, index) => (
                      <li key={index}>{mode}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Features */}
              {game.features && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Features:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {game.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center gap-4 text-sm">
                <span className="capitalize text-muted-foreground">
                  {game.difficulty}
                </span>
                <span className="capitalize text-muted-foreground">
                  {game.players === "multi" ? "Multiplayer" : "Single Player"}
                </span>
              </div>
              
              {game.comingSoon ? (
                <div className="mt-4">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    Coming Soon
                  </span>
                </div>
              ) : (
                <Link
                  href={`/${game.id}`}
                  className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Play Now
                </Link>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredGames.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No games found matching your filters. Try adjusting your selection.
          </p>
        </div>
      )}
    </div>
  );
} 