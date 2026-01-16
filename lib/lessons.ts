export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master';
  category: 'basics' | 'tactics' | 'strategy' | 'opening' | 'endgame';
  eloRequirement: number;
  locked: boolean;
  content?: string;
  objectives?: string[];
}

export interface LessonCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  lessons: Lesson[];
}

export const lessonCategories: LessonCategory[] = [
  {
    id: 'basics',
    name: 'Chess Basics',
    description: 'Learn the fundamental rules and piece movements',
    icon: '♟️',
    lessons: [
      {
        id: 'basics-1',
        title: 'How Pieces Move',
        description: 'Learn how each chess piece moves across the board. Master the unique movement patterns of pawns, knights, bishops, rooks, queens, and kings.',
        difficulty: 'beginner',
        category: 'basics',
        eloRequirement: 0,
        locked: false,
        objectives: [
          'Understand pawn movement and capture',
          'Master knight\'s L-shaped jumps',
          'Learn bishop diagonal movement',
          'Practice rook straight-line attacks',
          'Study queen\'s powerful mobility',
          'Know king\'s limited but crucial movement',
        ],
      },
      {
        id: 'basics-2',
        title: 'Special Moves',
        description: 'Discover castling, en passant, and pawn promotion. These special rules add depth to your chess understanding.',
        difficulty: 'beginner',
        category: 'basics',
        eloRequirement: 400,
        locked: false,
        objectives: [
          'Learn when and how to castle',
          'Understand en passant capture',
          'Master pawn promotion choices',
          'Know when castling is illegal',
        ],
      },
      {
        id: 'basics-3',
        title: 'Check and Checkmate',
        description: 'Understand the win condition. Learn the difference between check, checkmate, and stalemate.',
        difficulty: 'beginner',
        category: 'basics',
        eloRequirement: 600,
        locked: false,
        objectives: [
          'Recognize when king is in check',
          'Identify checkmate patterns',
          'Understand stalemate (draw)',
          'Learn to escape check',
        ],
      },
      {
        id: 'basics-4',
        title: 'Basic Opening Principles',
        description: 'Start games with confidence. Control the center, develop pieces, and protect your king.',
        difficulty: 'beginner',
        category: 'basics',
        eloRequirement: 800,
        locked: false,
        objectives: [
          'Control the center (e4, d4, e5, d5)',
          'Develop knights before bishops',
          'Castle early for king safety',
          'Don\'t move same piece twice in opening',
        ],
      },
    ],
  },
  {
    id: 'tactics',
    name: 'Tactical Patterns',
    description: 'Master winning combinations and tactical motifs',
    icon: '⚔️',
    lessons: [
      {
        id: 'tactics-1',
        title: 'Forks and Double Attacks',
        description: 'Attack two pieces at once. Learn the devastating power of forks, especially with knights and queens.',
        difficulty: 'intermediate',
        category: 'tactics',
        eloRequirement: 1000,
        locked: false,
        objectives: [
          'Spot knight fork opportunities',
          'Create queen forks',
          'Defend against double attacks',
          'Practice fork patterns',
        ],
      },
      {
        id: 'tactics-2',
        title: 'Pins and Skewers',
        description: 'Immobilize opponent pieces. Master the art of pinning pieces to more valuable targets.',
        difficulty: 'intermediate',
        category: 'tactics',
        eloRequirement: 1200,
        locked: false,
        objectives: [
          'Create absolute pins',
          'Use relative pins effectively',
          'Execute skewer tactics',
          'Break opponent\'s pins',
        ],
      },
      {
        id: 'tactics-3',
        title: 'Discovered Attacks',
        description: 'Unleash hidden power by moving one piece to reveal another\'s attack line.',
        difficulty: 'intermediate',
        category: 'tactics',
        eloRequirement: 1400,
        locked: false,
        objectives: [
          'Find discovered check opportunities',
          'Create discovered attacks',
          'Combine with other tactics',
          'Recognize opponent\'s threats',
        ],
      },
      {
        id: 'tactics-4',
        title: 'Removing the Defender',
        description: 'Eliminate key defending pieces to win material or deliver checkmate.',
        difficulty: 'advanced',
        category: 'tactics',
        eloRequirement: 1600,
        locked: false,
        objectives: [
          'Identify key defenders',
          'Calculate exchanges',
          'Force favorable trades',
          'Exploit weak defense',
        ],
      },
    ],
  },
  {
    id: 'strategy',
    name: 'Strategic Concepts',
    description: 'Develop long-term planning and positional understanding',
    icon: '🎯',
    lessons: [
      {
        id: 'strategy-1',
        title: 'Pawn Structure',
        description: 'Pawns are the soul of chess. Learn about pawn chains, islands, and weaknesses.',
        difficulty: 'intermediate',
        category: 'strategy',
        eloRequirement: 1400,
        locked: false,
        objectives: [
          'Understand pawn chains',
          'Identify weak pawns',
          'Create passed pawns',
          'Avoid doubled pawns',
        ],
      },
      {
        id: 'strategy-2',
        title: 'Piece Activity',
        description: 'Active pieces win games. Learn to maximize your pieces\' effectiveness.',
        difficulty: 'intermediate',
        category: 'strategy',
        eloRequirement: 1600,
        locked: false,
        objectives: [
          'Activate your pieces',
          'Find outposts for knights',
          'Control open files with rooks',
          'Place bishops on long diagonals',
        ],
      },
      {
        id: 'strategy-3',
        title: 'King Safety',
        description: 'Protect your king or face defeat. Balance between safety and activity.',
        difficulty: 'advanced',
        category: 'strategy',
        eloRequirement: 1800,
        locked: false,
        objectives: [
          'Evaluate king safety',
          'Create pawn shields',
          'Handle attacks on your king',
          'Know when to counter-attack',
        ],
      },
    ],
  },
  {
    id: 'endgame',
    name: 'Endgame Mastery',
    description: 'Convert advantages into wins in the final phase',
    icon: '👑',
    lessons: [
      {
        id: 'endgame-1',
        title: 'Basic Checkmates',
        description: 'Deliver checkmate with minimal material. Learn king and queen, king and rook checkmates.',
        difficulty: 'intermediate',
        category: 'endgame',
        eloRequirement: 1200,
        locked: false,
        objectives: [
          'Checkmate with queen and king',
          'Checkmate with rook and king',
          'Avoid stalemate traps',
          'Practice basic mates',
        ],
      },
      {
        id: 'endgame-2',
        title: 'Pawn Endgames',
        description: 'Master the most common endgame type. Learn about the square, opposition, and key squares.',
        difficulty: 'advanced',
        category: 'endgame',
        eloRequirement: 1600,
        locked: false,
        objectives: [
          'Understand opposition',
          'Use the rule of the square',
          'Create passed pawns',
          'Win king and pawn vs king',
        ],
      },
      {
        id: 'endgame-3',
        title: 'Rook Endgames',
        description: 'The most frequent endgame in master play. Learn Lucena and Philidor positions.',
        difficulty: 'expert',
        category: 'endgame',
        eloRequirement: 2000,
        locked: false,
        objectives: [
          'Master Lucena position',
          'Defend with Philidor position',
          'Use rook activity',
          'Handle rook and pawn endgames',
        ],
      },
    ],
  },
  {
    id: 'opening',
    name: 'Opening Repertoire',
    description: 'Build your opening knowledge and repertoire',
    icon: '📖',
    lessons: [
      {
        id: 'opening-1',
        title: 'Popular Openings Overview',
        description: 'Survey the most common chess openings. Understand the ideas behind e4, d4, and other first moves.',
        difficulty: 'intermediate',
        category: 'opening',
        eloRequirement: 1000,
        locked: false,
        objectives: [
          'Learn e4 openings (Italian, Spanish)',
          'Study d4 openings (Queen\'s Gambit)',
          'Understand opening principles',
          'Choose your repertoire',
        ],
      },
      {
        id: 'opening-2',
        title: 'Opening Traps',
        description: 'Avoid common pitfalls and set traps for your opponents.',
        difficulty: 'intermediate',
        category: 'opening',
        eloRequirement: 1400,
        locked: false,
        objectives: [
          'Recognize Scholar\'s Mate threat',
          'Avoid losing material early',
          'Set simple traps',
          'Develop safely',
        ],
      },
    ],
  },
];

export function getLessonById(id: string): Lesson | undefined {
  for (const category of lessonCategories) {
    const lesson = category.lessons.find(l => l.id === id);
    if (lesson) return lesson;
  }
  return undefined;
}

export function getUnlockedLessons(userElo: number): Lesson[] {
  const allLessons = lessonCategories.flatMap(cat => cat.lessons);
  return allLessons.filter(lesson => lesson.eloRequirement <= userElo);
}
