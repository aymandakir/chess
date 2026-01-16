"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProgressState {
  completedLessons: string[];
  currentElo: number;
  completeLesson: (lessonId: string) => void;
  resetProgress: () => void;
}

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      completedLessons: [],
      currentElo: 0,
      
      completeLesson: (lessonId: string) =>
        set((state) => ({
          completedLessons: [...state.completedLessons, lessonId],
          currentElo: state.currentElo + 50, // Gain ELO for completing lessons
        })),
      
      resetProgress: () =>
        set({
          completedLessons: [],
          currentElo: 0,
        }),
    }),
    {
      name: "chess-progress",
    }
  )
);
