"use client";

import { Home, Award, Trophy, Target, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/lib/useTheme";
import { useProgress } from "@/lib/useProgress";
import { usePuzzleStats } from "@/lib/usePuzzleStats";
import { useGameHistory } from "@/lib/useGameHistory";
import { useBadges } from "@/lib/useBadges";
import { badges, checkBadgeEarned } from "@/lib/badges";

export default function ProfilePage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const learningProgress = useProgress();
  const puzzleStats = usePuzzleStats();
  const gameHistory = useGameHistory();
  const badgeSystem = useBadges();
  
  const stats = gameHistory.getStats();

  // Check and award badges
  const allStats = {
    completedLessons: learningProgress.completedLessons,
    puzzlesSolved: puzzleStats.totalSolved,
    bestStreak: puzzleStats.bestStreak,
    tournamentsWon: 0,
    defeatedGM: false,
  };

  badges.forEach(badge => {
    if (checkBadgeEarned(badge.id, allStats) && !badgeSystem.hasBadge(badge.id)) {
      badgeSystem.earnBadge(badge.id);
    }
  });

  const earnedBadges = badges.filter(b => badgeSystem.hasBadge(b.id));
  const unlockedBadges = badges.filter(b => !badgeSystem.hasBadge(b.id));

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold font-display text-neutral-900 dark:text-white">
            Your Profile
          </h1>
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

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 text-center">
            <Award className="w-8 h-8 mx-auto mb-2 text-primary-600 dark:text-primary-400" />
            <div className="text-3xl font-bold text-neutral-900 dark:text-white">{stats.currentRating}</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Game Rating</div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
            <div className="text-3xl font-bold text-neutral-900 dark:text-white">{puzzleStats.puzzleRating}</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Puzzle Rating</div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-amber-600 dark:text-amber-400" />
            <div className="text-3xl font-bold text-neutral-900 dark:text-white">{learningProgress.currentElo}</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Learning ELO</div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-red-600 dark:text-red-400" />
            <div className="text-3xl font-bold text-neutral-900 dark:text-white">{earnedBadges.length}</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Badges Earned</div>
          </div>
        </div>

        {/* Earned Badges */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold font-display text-neutral-900 dark:text-white mb-4">
            🏆 Your Badges
          </h2>
          {earnedBadges.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-4">
              {earnedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={`bg-gradient-to-br ${badge.color} rounded-xl p-6 text-white shadow-lg`}
                >
                  <div className="text-5xl mb-3">{badge.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{badge.name}</h3>
                  <p className="text-sm opacity-90">{badge.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-12 border border-neutral-200 dark:border-neutral-700 text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-neutral-300 dark:text-neutral-600" />
              <p className="text-neutral-500 dark:text-neutral-400">
                Complete lessons and challenges to earn badges!
              </p>
            </div>
          )}
        </div>

        {/* Locked Badges */}
        <div>
          <h2 className="text-2xl font-bold font-display text-neutral-900 dark:text-white mb-4">
            🔒 Locked Badges
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {unlockedBadges.map((badge) => (
              <div
                key={badge.id}
                className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 opacity-60"
              >
                <div className="text-4xl mb-3 grayscale">{badge.icon}</div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                  {badge.name}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                  {badge.description}
                </p>
                <div className="text-xs text-neutral-500 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-700 px-3 py-2 rounded-lg">
                  {badge.requirement}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
