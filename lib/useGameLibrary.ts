"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SavedGame, GameFolder, BlunderCard, GameTag, calculateNextReview } from "./gameLibrary";

interface GameLibraryState {
  games: SavedGame[];
  folders: GameFolder[];
  blunderCards: BlunderCard[];
  
  saveGame: (game: Omit<SavedGame, 'id' | 'studied'>) => void;
  updateGame: (gameId: string, updates: Partial<SavedGame>) => void;
  deleteGame: (gameId: string) => void;
  addTag: (gameId: string, tag: GameTag) => void;
  removeTag: (gameId: string, tag: GameTag) => void;
  
  createFolder: (name: string, description?: string) => void;
  addToFolder: (gameId: string, folderId: string) => void;
  removeFromFolder: (gameId: string, folderId: string) => void;
  deleteFolder: (folderId: string) => void;
  
  createBlunderCard: (card: Omit<BlunderCard, 'id' | 'reviewCount' | 'nextReview' | 'mastered'>) => void;
  reviewBlunderCard: (cardId: string, wasCorrect: boolean) => void;
  getDueCards: () => BlunderCard[];
}

export const useGameLibrary = create<GameLibraryState>()(
  persist(
    (set, get) => ({
      games: [],
      folders: [],
      blunderCards: [],

      saveGame: (game) =>
        set((state) => ({
          games: [
            {
              ...game,
              id: `game-${Date.now()}`,
              studied: false,
            },
            ...state.games,
          ].slice(0, 500), // Keep last 500 games
        })),

      updateGame: (gameId, updates) =>
        set((state) => ({
          games: state.games.map(g =>
            g.id === gameId ? { ...g, ...updates } : g
          ),
        })),

      deleteGame: (gameId) =>
        set((state) => ({
          games: state.games.filter(g => g.id !== gameId),
        })),

      addTag: (gameId, tag) =>
        set((state) => ({
          games: state.games.map(g =>
            g.id === gameId && !g.tags.includes(tag)
              ? { ...g, tags: [...g.tags, tag] }
              : g
          ),
        })),

      removeTag: (gameId, tag) =>
        set((state) => ({
          games: state.games.map(g =>
            g.id === gameId
              ? { ...g, tags: g.tags.filter(t => t !== tag) }
              : g
          ),
        })),

      createFolder: (name, description) =>
        set((state) => ({
          folders: [
            ...state.folders,
            {
              id: `folder-${Date.now()}`,
              name,
              description,
              gameIds: [],
              createdAt: Date.now(),
            },
          ],
        })),

      addToFolder: (gameId, folderId) =>
        set((state) => ({
          folders: state.folders.map(f =>
            f.id === folderId && !f.gameIds.includes(gameId)
              ? { ...f, gameIds: [...f.gameIds, gameId] }
              : f
          ),
        })),

      removeFromFolder: (gameId, folderId) =>
        set((state) => ({
          folders: state.folders.map(f =>
            f.id === folderId
              ? { ...f, gameIds: f.gameIds.filter(id => id !== gameId) }
              : f
          ),
        })),

      deleteFolder: (folderId) =>
        set((state) => ({
          folders: state.folders.filter(f => f.id !== folderId),
        })),

      createBlunderCard: (card) =>
        set((state) => ({
          blunderCards: [
            ...state.blunderCards,
            {
              ...card,
              id: `card-${Date.now()}`,
              reviewCount: 0,
              nextReview: Date.now() + (1 * 24 * 60 * 60 * 1000), // Tomorrow
              mastered: false,
            },
          ],
        })),

      reviewBlunderCard: (cardId, wasCorrect) =>
        set((state) => ({
          blunderCards: state.blunderCards.map(card => {
            if (card.id !== cardId) return card;

            const newReviewCount = wasCorrect ? card.reviewCount + 1 : 0;
            const mastered = newReviewCount >= 3;

            return {
              ...card,
              reviewCount: newReviewCount,
              lastReviewed: Date.now(),
              nextReview: calculateNextReview(newReviewCount, wasCorrect),
              mastered,
            };
          }),
        })),

      getDueCards: () => {
        return get().blunderCards.filter(card =>
          !card.mastered && Date.now() >= card.nextReview
        );
      },
    }),
    {
      name: "chess-game-library",
    }
  )
);
