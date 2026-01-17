"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home, Zap, Timer, Heart } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/lib/useTheme";
import { usePuzzleStats } from "@/lib/usePuzzleStats";

export default function PuzzlesPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const stats = usePuzzleStats();

  const modes = [
    {
      id: 'practice',
      name: 'Practice',
      description: 'Unlimited time to solve puzzles at your level',
      icon: Zap,
      color: 'from-blue-500 to-blue-600',
      path: '/puzzles/practice',
    },
    {
      id: 'rush',
      name: 'Puzzle Rush',
      description: 'Solve as many as possible in 3 minutes',
      icon: Timer,
      color: 'from-orange-500 to-red-500',
      path: '/puzzles/rush',
    },
    {
      id: 'survival',
      name: 'Survival',
      description: 'Keep going with 3 lives. How far can you go?',
      icon: Heart,
      color: 'from-purple-500 to-pink-500',
      path: '/puzzles/survival',
    },
  ];

  const successRate = stats.totalAttempted > 0 
    ? Math.round((stats.totalSolved / stats.totalAttempted) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold font-display text-neutral-900 dark:text-white mb-2">
              Chess Puzzles
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Sharpen your tactical skills with daily puzzles
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium hidden sm:inline">Home</span>
            </a>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
            <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Puzzle Rating</div>
            <div className="text-3xl font-bold text-neutral-900 dark:text-white">
              {stats.puzzleRating}
            </div>
          </div>
          
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
            <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Solved</div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.totalSolved}
            </div>
          </div>
          
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
            <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Success Rate</div>
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {successRate}%
            </div>
          </div>
          
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
            <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Best Streak</div>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              {stats.bestStreak}
            </div>
          </div>
        </div>

        {/* Game Modes */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => router.push(mode.path)}
                className="group relative bg-white dark:bg-neutral-800 rounded-2xl p-8 border-2 border-neutral-200 dark:border-neutral-700 hover:border-primary-400 dark:hover:border-primary-600 transition-all duration-200 hover:scale-105 active:scale-95 text-left overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${mode.color} opacity-10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-300`} />
                
                <div className="relative">
                  <div className={`w-14 h-14 bg-gradient-to-br ${mode.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold font-display text-neutral-900 dark:text-white mb-2">
                    {mode.name}
                  </h3>
                  
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {mode.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Current Streak Banner */}
        {stats.currentStreak > 0 && (
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-6 text-white mb-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🔥</div>
                <div>
                  <div className="text-sm opacity-90">Current Streak</div>
                  <div className="text-3xl font-bold">{stats.currentStreak}</div>
                </div>
              </div>
              <div className="text-right opacity-90">
                <div className="text-sm">Keep it going!</div>
                <div className="text-lg font-semibold">
                  {stats.currentStreak === stats.bestStreak ? "🏆 Personal Best!" : `Best: ${stats.bestStreak}`}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
          <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-3">
            🧩 About Puzzles
          </h3>
          <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2">
            <li>• Puzzles help you recognize patterns and tactics quickly</li>
            <li>• Each correct answer increases your puzzle rating</li>
            <li>• Practice mode is perfect for learning without pressure</li>
            <li>• Puzzle Rush tests your speed and pattern recognition</li>
            <li>• Survival mode challenges your consistency</li>
            <li>• Your puzzle rating is independent from your game rating</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
