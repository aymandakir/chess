"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect } from "react";

interface ThemeState {
  isDark: boolean;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: false,
      toggle: () => set((state) => ({ isDark: !state.isDark })),
    }),
    {
      name: "chess-theme",
    }
  )
);

export function useTheme() {
  const { isDark, toggle } = useThemeStore();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return { isDark, toggle };
}
