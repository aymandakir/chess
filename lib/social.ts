"use client";

export interface UserProfile {
  id: string;
  username: string;
  avatar?: string;
  bio?: string;
  gameRating: number;
  puzzleRating: number;
  learningElo: number;
  joinedDate: number;
  badges: string[];
  totalGames: number;
  followers: string[];
  following: string[];
  isOnline: boolean;
  lastSeen: number;
}

export interface Friend {
  id: string;
  username: string;
  rating: number;
  isOnline: boolean;
  lastPlayed?: number;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  icon: string;
  members: string[];
  admins: string[];
  rating: number;
  createdAt: number;
  tournaments: string[];
}

export interface ActivityItem {
  id: string;
  type: 'puzzle' | 'tournament' | 'badge' | 'rating' | 'game' | 'lesson';
  userId: string;
  username: string;
  content: string;
  timestamp: number;
  icon: string;
}

export interface Challenge {
  id: string;
  from: string;
  to: string;
  timeControl: string;
  color?: 'white' | 'black' | 'random';
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: number;
}

// Mock data generators
export function generateMockFriends(count: number = 10): Friend[] {
  const usernames = [
    'ChessMaster99', 'TacticalNinja', 'QueenGambit', 'KnightRider',
    'BishopBoss', 'RookRuler', 'PawnStorm', 'CheckmateKing',
    'StrategicSage', 'BlitzWarrior', 'EndgameExpert', 'OpeningGuru',
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `friend-${i}`,
    username: usernames[i % usernames.length],
    rating: 1000 + Math.floor(Math.random() * 1500),
    isOnline: Math.random() > 0.5,
    lastPlayed: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000),
  }));
}

export function generateActivityFeed(count: number = 20): ActivityItem[] {
  const activities: ActivityItem[] = [];
  const usernames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
  const activityTemplates = [
    { type: 'puzzle' as const, content: 'solved a {rating} rated puzzle', icon: '🧩' },
    { type: 'tournament' as const, content: 'won the Daily Blitz Tournament', icon: '🏆' },
    { type: 'badge' as const, content: 'earned the {badge} badge', icon: '🏅' },
    { type: 'rating' as const, content: 'reached {rating} rating!', icon: '📈' },
    { type: 'game' as const, content: 'won against {opponent}', icon: '♟️' },
    { type: 'lesson' as const, content: 'completed {lesson}', icon: '📚' },
  ];

  for (let i = 0; i < count; i++) {
    const template = activityTemplates[Math.floor(Math.random() * activityTemplates.length)];
    const username = usernames[Math.floor(Math.random() * usernames.length)];
    
    let content = template.content;
    content = content.replace('{rating}', (1200 + Math.floor(Math.random() * 1000)).toString());
    content = content.replace('{badge}', 'Tactician');
    content = content.replace('{opponent}', 'Stockfish');
    content = content.replace('{lesson}', 'Advanced Tactics');

    activities.push({
      id: `activity-${i}`,
      type: template.type,
      userId: `user-${i}`,
      username,
      content,
      timestamp: Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000),
      icon: template.icon,
    });
  }

  return activities.sort((a, b) => b.timestamp - a.timestamp);
}

export const popularClubs: Omit<Club, 'members' | 'admins' | 'tournaments'>[] = [
  {
    id: 'club-1',
    name: 'Beginner Club',
    description: 'Friendly community for players starting their chess journey',
    icon: '🌱',
    rating: 1000,
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'club-2',
    name: 'Tactical Masters',
    description: 'For players who love combinations and tactics',
    icon: '⚔️',
    rating: 1600,
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'club-3',
    name: 'Endgame Specialists',
    description: 'Master the art of converting advantages',
    icon: '👑',
    rating: 1800,
    createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'club-4',
    name: 'Blitz Legends',
    description: 'Fast chess enthusiasts',
    icon: '⚡',
    rating: 1500,
    createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
  },
];
