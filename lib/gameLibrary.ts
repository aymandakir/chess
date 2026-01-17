"use client";

import { Move } from "chess.js";

export type GameTag = 'good' | 'bad' | 'study-later' | 'brilliant' | 'blunder-fest' | 'favorite';

export interface SavedGame {
  id: string;
  date: number;
  opponent: string;
  playerColor: 'w' | 'b';
  result: 'win' | 'loss' | 'draw';
  moves: Move[];
  fen: string;
  opening: string;
  rating: number;
  accuracy: number;
  tags: GameTag[];
  folder?: string;
  notes?: string;
  annotations?: GameAnnotation[];
  studied: boolean;
}

export interface GameAnnotation {
  moveIndex: number;
  type: 'text' | 'arrow' | 'highlight';
  content?: string;
  from?: string;
  to?: string;
  color?: string;
}

export interface GameFolder {
  id: string;
  name: string;
  description?: string;
  gameIds: string[];
  createdAt: number;
}

export interface BlunderCard {
  id: string;
  gameId: string;
  fen: string;
  correctMove: string;
  yourMove: string;
  explanation: string;
  reviewCount: number;
  lastReviewed?: number;
  nextReview: number;
  mastered: boolean;
}

export interface MasterGame {
  id: string;
  white: string;
  black: string;
  whiteElo: number;
  blackElo: number;
  result: string;
  date: string;
  event: string;
  opening: string;
  eco: string;
  moves: string[];
  pgn: string;
}

// Spaced repetition intervals (in days)
export const reviewIntervals = [1, 3, 7, 14, 30, 60];

export function calculateNextReview(reviewCount: number, wasCorrect: boolean): number {
  if (!wasCorrect) {
    // Reset to first interval if wrong
    return Date.now() + (1 * 24 * 60 * 60 * 1000);
  }
  
  const intervalIndex = Math.min(reviewCount, reviewIntervals.length - 1);
  const days = reviewIntervals[intervalIndex];
  return Date.now() + (days * 24 * 60 * 60 * 1000);
}

export function isReviewDue(nextReview: number): boolean {
  return Date.now() >= nextReview;
}

// Mock master games (in production, fetch from API)
export const sampleMasterGames: MasterGame[] = [
  {
    id: 'master-1',
    white: 'Magnus Carlsen',
    black: 'Hikaru Nakamura',
    whiteElo: 2882,
    blackElo: 2816,
    result: '1-0',
    date: '2023-10-15',
    event: 'World Rapid Championship',
    opening: 'Ruy Lopez',
    eco: 'C90',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6'],
    pgn: '[Event "World Rapid"]\n[White "Carlsen, M"]\n[Black "Nakamura, H"]\n1. e4 e5 2. Nf3 Nc6 3. Bb5 a6...',
  },
  {
    id: 'master-2',
    white: 'Fabiano Caruana',
    black: 'Ding Liren',
    whiteElo: 2805,
    blackElo: 2799,
    result: '1/2-1/2',
    date: '2023-09-20',
    event: 'Grand Swiss',
    opening: 'Queen\'s Gambit Declined',
    eco: 'D37',
    moves: ['d4', 'd5', 'c4', 'e6', 'Nf3', 'Nf6'],
    pgn: '[Event "Grand Swiss"]\n[White "Caruana, F"]\n[Black "Ding, L"]\n1. d4 d5 2. c4 e6...',
  },
];

export function searchGamesByOpening(games: SavedGame[], opening: string): SavedGame[] {
  return games.filter(game => 
    game.opening.toLowerCase().includes(opening.toLowerCase())
  );
}

export function filterGamesByResult(games: SavedGame[], result: 'win' | 'loss' | 'draw'): SavedGame[] {
  return games.filter(game => game.result === result);
}

export function filterGamesByTag(games: SavedGame[], tag: GameTag): SavedGame[] {
  return games.filter(game => game.tags.includes(tag));
}

export function sortGamesByDate(games: SavedGame[], ascending: boolean = false): SavedGame[] {
  return [...games].sort((a, b) => 
    ascending ? a.date - b.date : b.date - a.date
  );
}
