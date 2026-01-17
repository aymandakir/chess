"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BadgesState {
  earnedBadges: string[];
  earnBadge: (badgeId: string) => void;
  hasBadge: (badgeId: string) => boolean;
}

export const useBadges = create<BadgesState>()(
  persist(
    (set, get) => ({
      earnedBadges: [],
      
      earnBadge: (badgeId) =>
        set((state) => ({
          earnedBadges: state.earnedBadges.includes(badgeId)
            ? state.earnedBadges
            : [...state.earnedBadges, badgeId],
        })),
      
      hasBadge: (badgeId) => {
        return get().earnedBadges.includes(badgeId);
      },
    }),
    {
      name: "chess-badges",
    }
  )
);
