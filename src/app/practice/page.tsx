"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { lessons, type Lesson } from "@/lib/data/lessons";

export default function PracticePage() {
  const [selectedType, setSelectedType] = useState<Lesson["type"] | "all">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Lesson["difficulty"] | "all">("all");

  const filteredLessons = lessons.filter(lesson => {
    if (selectedType !== "all" && lesson.type !== selectedType) return false;
    if (selectedDifficulty !== "all" && lesson.difficulty !== selectedDifficulty) return false;
    return true;
  });

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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredLessons.map((lesson) => (
          <Link
            key={lesson.id}
            href={`/practice/${lesson.id}`}
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
          </Link>
        ))}
      </div>

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