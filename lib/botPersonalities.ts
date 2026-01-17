"use client";

export interface BotPersonality {
  id: string;
  name: string;
  description: string;
  icon: string;
  style: string;
  characteristics: string[];
  stockfishConfig: {
    skillLevel: number;
    aggressiveness?: number;
    contempt?: number;
  };
}

export const botPersonalities: BotPersonality[] = [
  {
    id: 'aggressive',
    name: 'The Attacker',
    description: 'Relentless aggression. Always looking to attack your king.',
    icon: '🔥',
    style: 'Aggressive',
    characteristics: [
      'Sacrifices pieces for attack',
      'Ignores defense for offense',
      'Targets your king',
      'Tactical and sharp',
    ],
    stockfishConfig: {
      skillLevel: 15,
      aggressiveness: 200,
      contempt: 100,
    },
  },
  {
    id: 'defensive',
    name: 'The Wall',
    description: 'Solid defensive play. Hard to break down, waits for your mistakes.',
    icon: '🛡️',
    style: 'Defensive',
    characteristics: [
      'Solid pawn structure',
      'Rarely takes risks',
      'Waits for mistakes',
      'Hard to attack',
    ],
    stockfishConfig: {
      skillLevel: 15,
      aggressiveness: -100,
      contempt: -50,
    },
  },
  {
    id: 'positional',
    name: 'The Strategist',
    description: 'Long-term planning. Slowly improves position and squeezes you.',
    icon: '🧠',
    style: 'Positional',
    characteristics: [
      'Strategic planning',
      'Pawn structure focus',
      'Piece coordination',
      'Patient play',
    ],
    stockfishConfig: {
      skillLevel: 18,
      aggressiveness: 0,
      contempt: 0,
    },
  },
  {
    id: 'tactical',
    name: 'The Trickster',
    description: 'Sets traps and tricks. Full of tactical surprises.',
    icon: '🎭',
    style: 'Tactical',
    characteristics: [
      'Sets tactical traps',
      'Unexpected moves',
      'Combination player',
      'Punishes mistakes',
    ],
    stockfishConfig: {
      skillLevel: 16,
      aggressiveness: 50,
      contempt: 50,
    },
  },
  {
    id: 'beginner-human',
    name: 'The Learner',
    description: 'Makes human-like beginner mistakes. Perfect for practicing.',
    icon: '🌱',
    style: 'Beginner',
    characteristics: [
      'Human-like mistakes',
      'Misses tactics occasionally',
      'Inconsistent play',
      'Educational opponent',
    ],
    stockfishConfig: {
      skillLevel: 3,
      aggressiveness: 0,
      contempt: 0,
    },
  },
];

export type TrainingMode = 'standard' | 'opening-practice' | 'endgame-practice' | 'play-until-win' | 'handicap';

export interface TrainingModeConfig {
  id: TrainingMode;
  name: string;
  description: string;
  icon: string;
  settings: {
    hintsAllowed?: number;
    undoAllowed?: boolean;
    analysisAfterMistake?: boolean;
    startPosition?: string;
    handicap?: {
      removePieces: string[];
    };
  };
}

export const trainingModes: TrainingModeConfig[] = [
  {
    id: 'standard',
    name: 'Standard Practice',
    description: 'Regular game with full features',
    icon: '♟️',
    settings: {
      hintsAllowed: 3,
      undoAllowed: true,
    },
  },
  {
    id: 'opening-practice',
    name: 'Opening Practice',
    description: 'Practice specific openings with instant feedback',
    icon: '📖',
    settings: {
      hintsAllowed: 5,
      undoAllowed: true,
      analysisAfterMistake: true,
    },
  },
  {
    id: 'endgame-practice',
    name: 'Endgame Practice',
    description: 'Start from endgame positions and practice technique',
    icon: '👑',
    settings: {
      hintsAllowed: 5,
      undoAllowed: true,
      startPosition: 'custom', // Will be set based on endgame type
    },
  },
  {
    id: 'play-until-win',
    name: 'Play Until You Win',
    description: 'Keep trying until you win. Learn from each attempt.',
    icon: '🎯',
    settings: {
      hintsAllowed: 999,
      undoAllowed: true,
      analysisAfterMistake: true,
    },
  },
  {
    id: 'handicap',
    name: 'Handicap Match',
    description: 'Bot starts without pieces. Perfect for building confidence.',
    icon: '⚖️',
    settings: {
      hintsAllowed: 0,
      undoAllowed: false,
      handicap: {
        removePieces: ['b1', 'g1'], // Remove knights as example
      },
    },
  },
];

export type HintType = 'show-legal' | 'show-best' | 'explain-why';

export interface Hint {
  type: HintType;
  cost: number; // How many hints it uses
  label: string;
  description: string;
}

export const hintTypes: Hint[] = [
  {
    type: 'show-legal',
    cost: 0.5,
    label: 'Show Legal Moves',
    description: 'Highlight all legal moves for selected piece',
  },
  {
    type: 'show-best',
    cost: 1,
    label: 'Show Best Move',
    description: 'Reveal the best move according to Stockfish',
  },
  {
    type: 'explain-why',
    cost: 1,
    label: 'Explain Position',
    description: 'Get explanation of what to look for',
  },
];
