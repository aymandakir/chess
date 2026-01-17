"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RepertoireEntry } from "./openings";

interface RepertoireState {
  entries: RepertoireEntry[];
  addEntry: (entry: Omit<RepertoireEntry, 'id' | 'createdAt'>) => void;
  removeEntry: (id: string) => void;
  updateEntry: (id: string, updates: Partial<RepertoireEntry>) => void;
}

export const useRepertoire = create<RepertoireState>()(
  persist(
    (set) => ({
      entries: [],
      
      addEntry: (entry) =>
        set((state) => ({
          entries: [
            ...state.entries,
            {
              ...entry,
              id: Date.now().toString(),
              createdAt: Date.now(),
            },
          ],
        })),
      
      removeEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        })),
      
      updateEntry: (id, updates) =>
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        })),
    }),
    {
      name: "chess-repertoire",
    }
  )
);
