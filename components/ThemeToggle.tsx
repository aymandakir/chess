"use client";

import { useTheme } from "@/lib/useTheme";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="relative w-14 h-14 rounded-2xl bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all duration-300 shadow-sm hover:shadow-md group overflow-hidden"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Background gradient animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-orange-300 dark:from-indigo-500 dark:to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Icons */}
      <div className="relative flex items-center justify-center h-full">
        <Sun
          className={`absolute w-6 h-6 text-amber-500 transition-all duration-300 ${
            isDark
              ? "opacity-0 rotate-90 scale-0"
              : "opacity-100 rotate-0 scale-100"
          }`}
        />
        <Moon
          className={`absolute w-6 h-6 text-indigo-600 dark:text-indigo-300 transition-all duration-300 ${
            isDark
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-90 scale-0"
          }`}
        />
      </div>
    </button>
  );
}
