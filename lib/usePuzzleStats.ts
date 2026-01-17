"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PuzzleStats } from "./puzzles";

interface PuzzleStatsState extends PuzzleStats {
  recordAttempt: (success: boolean, theme: string, rating: number) => void;
  resetStats: () => void;
}

export const usePuzzleStats = create<PuzzleStatsState>()(
  persist(
    (set) => ({
      puzzleRating: 1200,
      totalSolved: 0,
      totalAttempted: 0,
      currentStreak: 0,
      bestStreak: 0,
      themeStats: {},

      recordAttempt: (success: boolean, theme: string, rating: number) =>
        set((state) => {
          const newStreak = success ? state.currentStreak + 1 : 0;
          const newBestStreak = Math.max(newStreak, state.bestStreak);
          
          // Update puzzle rating (simple K-factor)
          const K = 32;
          const expectedScore = 1 / (1 + Math.pow(10, (rating - state.puzzleRating) / 400));
          const actualScore = success ? 1 : 0;
          const newRating = Math.round(state.puzzleRating + K * (actualScore - expectedScore));
          
          // Update theme stats
          const themeStats = { ...state.themeStats };
          if (!themeStats[theme]) {
            themeStats[theme] = { solved: 0, attempted: 0 };
          }
          themeStats[theme].attempted++;
          if (success) {
            themeStats[theme].solved++;
          }

          return {
            puzzleRating: Math.max(400, Math.min(2800, newRating)),
            totalSolved: success ? state.totalSolved + 1 : state.totalSolved,
            totalAttempted: state.totalAttempted + 1,
            currentStreak: newStreak,
            bestStreak: newBestStreak,
            themeStats,
          };
        }),

      resetStats: () =>
        set({
          puzzleRating: 1200,
          totalSolved: 0,
          totalAttempted: 0,
          currentStreak: 0,
          bestStreak: 0,
          themeStats: {},
        }),
    }),
    {
      name: "chess-puzzle-stats",
    }
  )
);
