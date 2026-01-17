"use client";

import { useRouter } from "next/navigation";
import { Home, Lightbulb } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/lib/useTheme";
import { botPersonalities, trainingModes } from "@/lib/botPersonalities";

export default function TrainingPage() {
  const router = useRouter();
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold font-display text-neutral-900 dark:text-white mb-2">
              Advanced Training
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Practice with personality bots and specialized training modes
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
            >
              <Home className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Bot Personalities */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold font-display text-neutral-900 dark:text-white mb-4">
            🎭 Bot Personalities
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Each bot has a unique playing style. Choose your opponent wisely!
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {botPersonalities.map((bot) => (
              <button
                key={bot.id}
                onClick={() => router.push(`/bot?personality=${bot.id}&elo=1600`)}
                className="bg-white dark:bg-neutral-800 rounded-xl p-6 border-2 border-neutral-200 dark:border-neutral-700 hover:border-primary-400 dark:hover:border-primary-600 transition-all duration-200 hover:scale-105 text-left group"
              >
                <div className="text-5xl mb-3">{bot.icon}</div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {bot.name}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  {bot.description}
                </p>
                <div className="space-y-1.5">
                  {bot.characteristics.map((char, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-500">
                      <div className="w-1 h-1 bg-primary-500 rounded-full"></div>
                      <span>{char}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-xs font-semibold text-primary-600 dark:text-primary-400">
                  Style: {bot.style}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Training Modes */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold font-display text-neutral-900 dark:text-white mb-4">
            🎯 Training Modes
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Specialized modes to practice specific skills
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {trainingModes.map((mode) => (
              <div
                key={mode.id}
                className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{mode.icon}</div>
                  <div className="flex flex-wrap gap-2">
                    {mode.settings.hintsAllowed !== undefined && mode.settings.hintsAllowed > 0 && (
                      <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-2 py-1 rounded-full">
                        <Lightbulb className="w-3 h-3 inline mr-1" />
                        {mode.settings.hintsAllowed === 999 ? '∞' : mode.settings.hintsAllowed} hints
                      </span>
                    )}
                    {mode.settings.undoAllowed && (
                      <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                        Undo allowed
                      </span>
                    )}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                  {mode.name}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  {mode.description}
                </p>
                
                <button
                  onClick={() => router.push(`/bot?mode=${mode.id}&elo=1600`)}
                  className="w-full bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Start Training
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Hint System Info */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl p-6 border-2 border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-900 dark:text-amber-300">
                Hint System
              </h3>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Get help when you're stuck
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-4">
              <div className="font-semibold text-neutral-900 dark:text-white mb-2">
                Show Legal Moves
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                Highlights where your selected piece can move
              </p>
              <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                Free (always available)
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-lg p-4">
              <div className="font-semibold text-neutral-900 dark:text-white mb-2">
                Show Best Move
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                Reveals Stockfish's top recommendation
              </p>
              <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                Costs 1 hint
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-lg p-4">
              <div className="font-semibold text-neutral-900 dark:text-white mb-2">
                Explain Position
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                Strategic guidance and key ideas
              </p>
              <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                Costs 1 hint
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
