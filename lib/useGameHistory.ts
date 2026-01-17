"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Move } from "chess.js";

export interface GameHistoryEntry {
  id: string;
  date: number;
  opponent: string;
  playerColor: 'w' | 'b';
  result: 'win' | 'loss' | 'draw';
  moves: Move[];
  rating: number;
  ratingChange: number;
  accuracy: number;
  openingName: string;
  timeControl: string;
  brilliant: number;
  great: number;
  good: number;
  inaccuracy: number;
  mistake: number;
  blunder: number;
}

interface GameHistoryState {
  games: GameHistoryEntry[];
  addGame: (game: Omit<GameHistoryEntry, 'id' | 'date'>) => void;
  clearHistory: () => void;
  getStats: () => any;
}

export const useGameHistory = create<GameHistoryState>()(
  persist(
    (set, get) => ({
      games: [],
      
      addGame: (game) =>
        set((state) => ({
          games: [
            {
              ...game,
              id: Date.now().toString(),
              date: Date.now(),
            },
            ...state.games,
          ].slice(0, 100), // Keep last 100 games
        })),
      
      clearHistory: () => set({ games: [] }),
      
      getStats: () => {
        const games = get().games;
        
        if (games.length === 0) {
          return {
            totalGames: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            winRate: 0,
            currentRating: 1200,
            peakRating: 1200,
            avgAccuracy: 0,
            openingStats: {},
            recentGames: [],
          };
        }

        const wins = games.filter(g => g.result === 'win').length;
        const draws = games.filter(g => g.result === 'draw').length;
        const losses = games.filter(g => g.result === 'loss').length;
        
        const winRate = ((wins + draws * 0.5) / games.length) * 100;
        const avgAccuracy = games.reduce((acc, g) => acc + g.accuracy, 0) / games.length;
        
        const currentRating = games[0]?.rating || 1200;
        const peakRating = Math.max(...games.map(g => g.rating));
        
        // Opening statistics
        const openingStats: Record<string, { games: number; wins: number; draws: number; losses: number }> = {};
        games.forEach(game => {
          if (!openingStats[game.openingName]) {
            openingStats[game.openingName] = { games: 0, wins: 0, draws: 0, losses: 0 };
          }
          openingStats[game.openingName].games++;
          if (game.result === 'win') openingStats[game.openingName].wins++;
          if (game.result === 'draw') openingStats[game.openingName].draws++;
          if (game.result === 'loss') openingStats[game.openingName].losses++;
        });
        
        return {
          totalGames: games.length,
          wins,
          draws,
          losses,
          winRate: Math.round(winRate),
          currentRating,
          peakRating,
          avgAccuracy: Math.round(avgAccuracy),
          openingStats,
          recentGames: games.slice(0, 10),
        };
      },
    }),
    {
      name: "chess-game-history",
    }
  )
);
