"use client";

export type TournamentType = 'swiss' | 'round-robin' | 'elimination' | 'arena';
export type TournamentStatus = 'upcoming' | 'in-progress' | 'completed';

export interface Tournament {
  id: string;
  name: string;
  type: TournamentType;
  status: TournamentStatus;
  timeControl: string;
  maxPlayers: number;
  minRating?: number;
  maxRating?: number;
  startTime: number;
  currentRound: number;
  totalRounds: number;
  players: TournamentPlayer[];
  pairings: TournamentPairing[];
  standings: TournamentStanding[];
  prize?: TournamentPrize;
}

export interface TournamentPlayer {
  id: string;
  username: string;
  rating: number;
  score: number;
  joined: number;
}

export interface TournamentPairing {
  round: number;
  white: string;
  black: string;
  result?: 'white' | 'black' | 'draw';
  gameId?: string;
}

export interface TournamentStanding {
  playerId: string;
  username: string;
  score: number;
  wins: number;
  draws: number;
  losses: number;
  performance: number;
  rank: number;
}

export interface TournamentPrize {
  title?: string;
  badge?: string;
  ratingBoost?: number;
}

export const tournamentTypes = [
  {
    id: 'swiss',
    name: 'Swiss System',
    description: 'Players with similar scores are paired each round. Best for large groups.',
    icon: '🏔️',
    rounds: 'Variable',
  },
  {
    id: 'round-robin',
    name: 'Round Robin',
    description: 'Everyone plays everyone once. Fair but time-consuming.',
    icon: '⭕',
    rounds: 'N-1 (where N = players)',
  },
  {
    id: 'elimination',
    name: 'Elimination',
    description: 'Single or double elimination bracket. Fast and exciting.',
    icon: '🏆',
    rounds: 'Log₂(N)',
  },
  {
    id: 'arena',
    name: 'Arena',
    description: 'Continuous games for points. Play as many as you can.',
    icon: '⚔️',
    rounds: 'Unlimited',
  },
];

export const timeControls = [
  { id: 'bullet', name: 'Bullet', time: '1+0', minutes: 1, increment: 0 },
  { id: 'bullet-plus', name: 'Bullet', time: '1+1', minutes: 1, increment: 1 },
  { id: 'blitz-3', name: 'Blitz', time: '3+0', minutes: 3, increment: 0 },
  { id: 'blitz-3-2', name: 'Blitz', time: '3+2', minutes: 3, increment: 2 },
  { id: 'blitz-5', name: 'Blitz', time: '5+0', minutes: 5, increment: 0 },
  { id: 'rapid-10', name: 'Rapid', time: '10+0', minutes: 10, increment: 0 },
  { id: 'rapid-15', name: 'Rapid', time: '15+10', minutes: 15, increment: 10 },
];

export const dailyTournaments: Omit<Tournament, 'id' | 'players' | 'pairings' | 'standings'>[] = [
  {
    name: 'Daily Blitz Arena',
    type: 'arena',
    status: 'upcoming',
    timeControl: '3+2',
    maxPlayers: 50,
    startTime: Date.now() + 3600000, // 1 hour from now
    currentRound: 0,
    totalRounds: 0,
    prize: {
      title: '🥇 Daily Champion',
      ratingBoost: 25,
    },
  },
  {
    name: 'Beginner Tournament',
    type: 'swiss',
    status: 'upcoming',
    timeControl: '10+0',
    maxPlayers: 16,
    maxRating: 1400,
    startTime: Date.now() + 7200000, // 2 hours from now
    currentRound: 0,
    totalRounds: 4,
    prize: {
      badge: '🌟 Rising Star',
    },
  },
  {
    name: 'Master Swiss',
    type: 'swiss',
    status: 'upcoming',
    timeControl: '15+10',
    maxPlayers: 32,
    minRating: 2000,
    startTime: Date.now() + 10800000, // 3 hours from now
    currentRound: 0,
    totalRounds: 6,
    prize: {
      title: '👑 Master Champion',
      ratingBoost: 50,
    },
  },
];

export function calculateSwissPairings(standings: TournamentStanding[]): TournamentPairing[] {
  // Simple Swiss pairing algorithm
  const sorted = [...standings].sort((a, b) => b.score - a.score);
  const pairings: TournamentPairing[] = [];
  const paired = new Set<string>();

  for (let i = 0; i < sorted.length; i++) {
    if (paired.has(sorted[i].playerId)) continue;

    // Find opponent with similar score
    for (let j = i + 1; j < sorted.length; j++) {
      if (paired.has(sorted[j].playerId)) continue;

      pairings.push({
        round: 0,
        white: sorted[i].playerId,
        black: sorted[j].playerId,
      });

      paired.add(sorted[i].playerId);
      paired.add(sorted[j].playerId);
      break;
    }
  }

  return pairings;
}

export function formatTimeControl(timeControl: string): string {
  const control = timeControls.find(tc => tc.time === timeControl);
  return control ? `${control.name} ${control.time}` : timeControl;
}
