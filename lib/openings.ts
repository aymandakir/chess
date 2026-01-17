"use client";

export interface OpeningMove {
  uci: string;
  san: string;
  averageRating: number;
  white: number;
  draws: number;
  black: number;
  games: number;
}

export interface OpeningData {
  white: number;
  draws: number;
  black: number;
  moves: OpeningMove[];
  opening?: {
    eco: string;
    name: string;
  };
}

export interface RepertoireEntry {
  id: string;
  color: 'white' | 'black';
  name: string;
  moves: string[];
  fen: string;
  notes?: string;
  createdAt: number;
}

const LICHESS_OPENING_API = "https://explorer.lichess.ovh/lichess";
const LICHESS_MASTERS_API = "https://explorer.lichess.ovh/masters";

export async function fetchOpeningData(
  fen: string,
  master: boolean = false
): Promise<OpeningData | null> {
  try {
    const apiUrl = master ? LICHESS_MASTERS_API : LICHESS_OPENING_API;
    const params = new URLSearchParams({
      fen: fen,
      ratings: master ? "2200,2500" : "1600,1800,2000,2200,2500",
      speeds: "blitz,rapid,classical",
    });

    const response = await fetch(`${apiUrl}?${params}`);
    if (!response.ok) throw new Error("Failed to fetch opening data");

    const data = await response.json();
    
    return {
      white: data.white || 0,
      draws: data.draws || 0,
      black: data.black || 0,
      moves: data.moves?.map((m: any) => ({
        uci: m.uci,
        san: m.san,
        averageRating: m.averageRating || 0,
        white: m.white || 0,
        draws: m.draws || 0,
        black: m.black || 0,
        games: (m.white || 0) + (m.draws || 0) + (m.black || 0),
      })) || [],
      opening: data.opening,
    };
  } catch (error) {
    console.error("Error fetching opening data:", error);
    return null;
  }
}

export function getOpeningName(moves: string[]): string {
  const openingNames: Record<string, string> = {
    "e4": "King's Pawn Opening",
    "e4 e5": "Open Game",
    "e4 e5 Nf3": "King's Knight Opening",
    "e4 e5 Nf3 Nc6": "Three Knights Opening",
    "e4 e5 Nf3 Nc6 Bb5": "Ruy Lopez (Spanish Opening)",
    "e4 e5 Nf3 Nc6 Bc4": "Italian Game",
    "e4 c5": "Sicilian Defense",
    "e4 e6": "French Defense",
    "e4 c6": "Caro-Kann Defense",
    "d4": "Queen's Pawn Opening",
    "d4 d5": "Closed Game",
    "d4 d5 c4": "Queen's Gambit",
    "d4 Nf6": "Indian Defense",
    "d4 Nf6 c4": "Indian Game",
    "d4 Nf6 c4 e6": "Queen's Indian Defense",
    "d4 Nf6 c4 g6": "King's Indian Defense",
    "Nf3": "Reti Opening",
    "c4": "English Opening",
  };

  const movesKey = moves.join(" ");
  return openingNames[movesKey] || "Custom Position";
}

export function calculateWinPercentages(white: number, draws: number, black: number) {
  const total = white + draws + black;
  if (total === 0) return { white: 0, draws: 0, black: 0 };

  return {
    white: Math.round((white / total) * 100),
    draws: Math.round((draws / total) * 100),
    black: Math.round((black / total) * 100),
  };
}
