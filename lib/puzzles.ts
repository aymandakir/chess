"use client";

export interface Puzzle {
  id: string;
  fen: string;
  moves: string[];
  rating: number;
  themes: string[];
  solution: string[];
}

export interface PuzzleStats {
  puzzleRating: number;
  totalSolved: number;
  totalAttempted: number;
  currentStreak: number;
  bestStreak: number;
  themeStats: Record<string, { solved: number; attempted: number }>;
}

const LICHESS_PUZZLE_API = "https://lichess.org/api/puzzle/daily";

// Fallback puzzles in case API fails
const fallbackPuzzles: Puzzle[] = [
  {
    id: "puzzle-1",
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
    moves: ["f3", "g5", "d1", "h5"],
    rating: 1200,
    themes: ["fork", "tactics"],
    solution: ["Nxe5", "Qh5+", "g6", "Qxe5+", "Be7", "Qxh8"],
  },
  // Add more fallback puzzles as needed
];

export async function fetchPuzzleByRating(targetRating: number): Promise<Puzzle | null> {
  try {
    const response = await fetch(LICHESS_PUZZLE_API);
    if (!response.ok) throw new Error("Failed to fetch puzzle");
    
    const data = await response.json();
    
    return {
      id: data.puzzle.id,
      fen: data.game.fen,
      moves: data.puzzle.solution,
      rating: data.puzzle.rating,
      themes: data.puzzle.themes,
      solution: data.puzzle.solution,
    };
  } catch (error) {
    console.error("Error fetching puzzle:", error);
    // Return random fallback puzzle
    return fallbackPuzzles[Math.floor(Math.random() * fallbackPuzzles.length)];
  }
}

export function getThemeIcon(theme: string): string {
  const icons: Record<string, string> = {
    fork: "⚔️",
    pin: "📌",
    skewer: "🔱",
    backRank: "🎯",
    mate: "👑",
    mateIn2: "👑👑",
    sacrifice: "🔥",
    zugzwang: "⚡",
    endgame: "♔",
    middlegame: "⚔️",
    opening: "📖",
    default: "🧩",
  };
  
  return icons[theme] || icons.default;
}

export function getThemeDisplayName(theme: string): string {
  const names: Record<string, string> = {
    fork: "Fork",
    pin: "Pin",
    skewer: "Skewer",
    backRank: "Back Rank",
    mate: "Checkmate",
    mateIn2: "Mate in 2",
    sacrifice: "Sacrifice",
    zugzwang: "Zugzwang",
    endgame: "Endgame",
    middlegame: "Middlegame",
    opening: "Opening",
  };
  
  return names[theme] || theme;
}
