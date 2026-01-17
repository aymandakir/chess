"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LessonProgressState {
  lessonProgress: Record<string, {
    started: number;
    timeSpent: number;
    quizScore?: number;
    interactiveCompleted: number;
    lastVisited: number;
  }>;
  
  startLesson: (lessonId: string) => void;
  addTime: (lessonId: string, seconds: number) => void;
  completeInteractive: (lessonId: string) => void;
  setQuizScore: (lessonId: string, score: number) => void;
  getProgress: (lessonId: string) => any;
}

export const useLessonProgress = create<LessonProgressState>()(
  persist(
    (set, get) => ({
      lessonProgress: {},
      
      startLesson: (lessonId) =>
        set((state) => ({
          lessonProgress: {
            ...state.lessonProgress,
            [lessonId]: {
              started: Date.now(),
              timeSpent: 0,
              interactiveCompleted: 0,
              lastVisited: Date.now(),
            },
          },
        })),
      
      addTime: (lessonId, seconds) =>
        set((state) => {
          const progress = state.lessonProgress[lessonId] || {
            started: Date.now(),
            timeSpent: 0,
            interactiveCompleted: 0,
            lastVisited: Date.now(),
          };
          
          return {
            lessonProgress: {
              ...state.lessonProgress,
              [lessonId]: {
                ...progress,
                timeSpent: progress.timeSpent + seconds,
                lastVisited: Date.now(),
              },
            },
          };
        }),
      
      completeInteractive: (lessonId) =>
        set((state) => {
          const progress = state.lessonProgress[lessonId];
          if (!progress) return state;
          
          return {
            lessonProgress: {
              ...state.lessonProgress,
              [lessonId]: {
                ...progress,
                interactiveCompleted: progress.interactiveCompleted + 1,
              },
            },
          };
        }),
      
      setQuizScore: (lessonId, score) =>
        set((state) => {
          const progress = state.lessonProgress[lessonId];
          if (!progress) return state;
          
          return {
            lessonProgress: {
              ...state.lessonProgress,
              [lessonId]: {
                ...progress,
                quizScore: score,
              },
            },
          };
        }),
      
      getProgress: (lessonId) => {
        return get().lessonProgress[lessonId] || null;
      },
    }),
    {
      name: "chess-lesson-progress",
    }
  )
);
