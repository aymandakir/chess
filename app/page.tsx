"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { Users, Sparkles, Cpu, X, GraduationCap, Puzzle, BookOpen, BarChart3, Trophy } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/lib/useTheme";

export default function Home() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [showBotMenu, setShowBotMenu] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [gameCode, setGameCode] = useState("");

  const createGame = () => {
    const gameId = nanoid(10);
    router.push(`/game/${gameId}`);
  };

  const joinGame = () => {
    if (gameCode.trim()) {
      router.push(`/game/${gameCode.trim()}`);
    }
  };

  const playVsBot = (elo: number) => {
    router.push(`/bot?elo=${elo}`);
  };

  const botLevels = [
    { name: "Beginner", elo: 800, description: "Learning the game" },
    { name: "Casual", elo: 1200, description: "Knows the basics" },
    { name: "Intermediate", elo: 1600, description: "Club player" },
    { name: "Advanced", elo: 2000, description: "Strong player" },
    { name: "Master", elo: 2400, description: "Chess master" },
    { name: "Grandmaster", elo: 2800, description: "World-class" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 relative">
      {/* Top Right Controls */}
      <div className="absolute top-6 right-6 flex items-center gap-3">
        <a
          href="/stats"
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-primary-400 dark:hover:border-primary-600 transition-colors text-neutral-900 dark:text-white font-medium"
        >
          <BarChart3 className="w-5 h-5" />
          <span className="hidden sm:inline">Stats</span>
        </a>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-8 text-center">
        {/* Logo/Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500 dark:bg-primary-600 rounded-2xl mb-4 shadow-lg shadow-primary-500/20 dark:shadow-primary-600/30">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold font-display text-neutral-900 dark:text-white">
            Chess
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 font-medium">
            Play online with friends or computer
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-8">
          <button
            onClick={() => router.push('/learn')}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-500/30"
          >
            <div className="flex items-center justify-center gap-2">
              <GraduationCap className="w-5 h-5" />
              <span>Learn Chess</span>
            </div>
          </button>

          <button
            onClick={() => router.push('/puzzles')}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/30"
          >
            <div className="flex items-center justify-center gap-2">
              <Puzzle className="w-5 h-5" />
              <span>Solve Puzzles</span>
            </div>
          </button>

          <button
            onClick={() => router.push('/openings')}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/30"
          >
            <div className="flex items-center justify-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span>Opening Explorer</span>
            </div>
          </button>

          <button
            onClick={() => router.push('/tournaments')}
            className="w-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-500/30"
          >
            <div className="flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5" />
              <span>Tournaments</span>
            </div>
          </button>

          <button
            onClick={createGame}
            className="w-full bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary-500/30"
          >
            <div className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              <span>Play with Friend</span>
            </div>
          </button>

          <button
            onClick={() => setShowBotMenu(!showBotMenu)}
            className="w-full bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] border-2 border-neutral-200 dark:border-neutral-700"
          >
            <div className="flex items-center justify-center gap-2">
              <Cpu className="w-5 h-5" />
              <span>Play vs Computer</span>
            </div>
          </button>

          <button
            onClick={() => setShowJoinModal(true)}
            className="w-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium py-3 px-6 rounded-xl transition-all duration-200"
          >
            Join with Code
          </button>
        </div>

        {/* Join Game Modal */}
        {showJoinModal && (
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold font-display text-neutral-900 dark:text-white">
                  Join Game
                </h2>
                <button
                  onClick={() => {
                    setShowJoinModal(false);
                    setGameCode("");
                  }}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                </button>
              </div>
              
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Enter the game code shared by your friend
              </p>
              
              <input
                type="text"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    joinGame();
                  }
                }}
                placeholder="Enter game code"
                className="w-full px-4 py-3 border-2 border-neutral-200 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-lg focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none font-mono text-lg text-center"
                autoFocus
              />
              
              <button
                onClick={joinGame}
                disabled={!gameCode.trim()}
                className="w-full mt-4 bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 disabled:bg-neutral-200 dark:disabled:bg-neutral-700 disabled:text-neutral-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
              >
                Join Game
              </button>
            </div>
          </div>
        )}

        {/* Bot Level Selection */}
        {showBotMenu && (
          <div className="pt-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
              Choose Difficulty
            </h3>
            {botLevels.map((level) => (
              <button
                key={level.elo}
                onClick={() => playVsBot(level.elo)}
                className="w-full bg-white dark:bg-neutral-800 hover:bg-primary-50 dark:hover:bg-neutral-700 border-2 border-neutral-200 dark:border-neutral-700 hover:border-primary-200 dark:hover:border-primary-600 text-left py-3 px-4 rounded-lg transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-neutral-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400">
                      {level.name}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      {level.description}
                    </div>
                  </div>
                  <div className="text-sm font-mono font-semibold text-neutral-400 dark:text-neutral-500 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                    {level.elo}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
