"use client";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  color: string;
}

export const badges: Badge[] = [
  {
    id: 'novice',
    name: 'Chess Novice',
    description: 'Completed all beginner lessons',
    icon: '🌱',
    requirement: 'Complete all Chess Basics lessons',
    color: 'from-green-400 to-emerald-500',
  },
  {
    id: 'tactician',
    name: 'Tactician',
    description: 'Mastered tactical patterns',
    icon: '⚔️',
    requirement: 'Complete all Tactical Patterns lessons',
    color: 'from-blue-400 to-cyan-500',
  },
  {
    id: 'strategist',
    name: 'Strategist',
    description: 'Understands positional play',
    icon: '🧠',
    requirement: 'Complete all Strategic Concepts lessons',
    color: 'from-purple-400 to-pink-500',
  },
  {
    id: 'endgame-master',
    name: 'Endgame Master',
    description: 'Expert in endgames',
    icon: '👑',
    requirement: 'Complete all Endgame Mastery lessons',
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: 'opening-expert',
    name: 'Opening Expert',
    description: 'Built solid opening repertoire',
    icon: '📖',
    requirement: 'Complete all Opening Repertoire lessons',
    color: 'from-teal-400 to-cyan-500',
  },
  {
    id: 'pattern-master',
    name: 'Pattern Master',
    description: 'Recognizes all checkmate patterns',
    icon: '🎯',
    requirement: 'Complete all Checkmate Patterns lessons',
    color: 'from-red-400 to-rose-500',
  },
  {
    id: 'puzzle-solver',
    name: 'Puzzle Solver',
    description: 'Solved 100+ puzzles',
    icon: '🧩',
    requirement: 'Solve 100 puzzles',
    color: 'from-indigo-400 to-purple-500',
  },
  {
    id: 'puzzle-streak',
    name: 'Hot Streak',
    description: 'Achieved 10+ puzzle streak',
    icon: '🔥',
    requirement: 'Get a 10+ puzzle streak',
    color: 'from-orange-400 to-red-500',
  },
  {
    id: 'tournament-winner',
    name: 'Tournament Champion',
    description: 'Won a tournament',
    icon: '🏆',
    requirement: 'Win any tournament',
    color: 'from-yellow-400 to-amber-500',
  },
  {
    id: 'grandmaster',
    name: 'Grandmaster',
    description: 'Beat GM bot (2800 ELO)',
    icon: '👑',
    requirement: 'Defeat Grandmaster bot',
    color: 'from-purple-500 to-pink-600',
  },
];

export function checkBadgeEarned(badgeId: string, stats: any): boolean {
  switch (badgeId) {
    case 'novice':
      return stats.completedLessons.filter((l: string) => l.startsWith('basics-')).length >= 4;
    case 'tactician':
      return stats.completedLessons.filter((l: string) => l.startsWith('tactics-')).length >= 4;
    case 'strategist':
      return stats.completedLessons.filter((l: string) => l.startsWith('strategy-')).length >= 3;
    case 'endgame-master':
      return stats.completedLessons.filter((l: string) => l.startsWith('endgame-')).length >= 3;
    case 'opening-expert':
      return stats.completedLessons.filter((l: string) => l.startsWith('opening-')).length >= 2;
    case 'pattern-master':
      return stats.completedLessons.filter((l: string) => l.startsWith('patterns-')).length >= 10;
    case 'puzzle-solver':
      return stats.puzzlesSolved >= 100;
    case 'puzzle-streak':
      return stats.bestStreak >= 10;
    case 'tournament-winner':
      return stats.tournamentsWon >= 1;
    case 'grandmaster':
      return stats.defeatedGM;
    default:
      return false;
  }
}
