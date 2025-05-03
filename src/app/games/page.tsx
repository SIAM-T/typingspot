"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const games = [
  {
    title: "Word Rush",
    description: "Type falling words before they hit the bottom! Build combos for bonus points.",
    href: "/word-rush",
    icon: "🎯"
  },
  {
    title: "Code Practice",
    description: "Practice typing code snippets in various programming languages.",
    href: "/practice",
    icon: "💻"
  },
  {
    title: "Speed Test",
    description: "Test your typing speed and accuracy with random text.",
    href: "/typing-test",
    icon: "⚡"
  }
];

export default function GamesPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Games</h1>
          <p className="text-muted-foreground">
            Choose a game to improve your typing skills while having fun!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Link key={game.href} href={game.href} className="block">
              <div className="group relative overflow-hidden rounded-lg border bg-card p-6 hover:border-primary transition-colors">
                <div className="mb-2 text-4xl">{game.icon}</div>
                <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {game.title}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {game.description}
                </p>
                <div className="mt-4">
                  <Button className="w-full">Play Now</Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
} 