"use client";

import { Move } from "chess.js";

export type MoveClassification = 
  | 'brilliant'    // !! - Only best move in critical position
  | 'great'        // ! - Very strong move
  | 'best'         // Best move
  | 'excellent'    // Top 3 move
  | 'good'         // Reasonable move
  | 'inaccuracy'   // ?! - Dubious move
  | 'mistake'      // ? - Clear mistake
  | 'blunder'      // ?? - Major error
  | 'miss';        // Missed winning opportunity

export interface EvaluatedMove {
  move: Move;
  evaluation: number; // Centipawns (positive = white advantage)
  classification: MoveClassification;
  bestMove?: string;
  explanation: string;
  depth: number;
}

export interface CriticalMoment {
  moveNumber: number;
  move: Move;
  evalBefore: number;
  evalAfter: number;
  swing: number;
  type: 'blunder' | 'miss' | 'turning_point';
}

export class AnalysisEngine {
  private worker: Worker | null = null;
  private evaluations: Map<string, number> = new Map();

  constructor() {
    if (typeof window !== "undefined") {
      try {
        this.worker = new Worker('/stockfish.js');
        this.worker.postMessage('uci');
        this.worker.postMessage('setoption name UCI_AnalyseMode value true');
      } catch (error) {
        console.error('Failed to initialize analysis engine:', error);
      }
    }
  }

  async evaluatePosition(
    fen: string,
    depth: number = 16
  ): Promise<{ eval: number; bestMove: string } | null> {
    if (!this.worker) return null;

    return new Promise((resolve) => {
      let bestMove = '';
      let currentEval = 0;

      const handleMessage = (event: MessageEvent) => {
        const message = event.data;
        
        if (typeof message === 'string') {
          // Parse evaluation
          if (message.includes('score cp')) {
            const match = message.match(/score cp (-?\d+)/);
            if (match) {
              currentEval = parseInt(match[1]);
            }
          } else if (message.includes('score mate')) {
            const match = message.match(/score mate (-?\d+)/);
            if (match) {
              const mateIn = parseInt(match[1]);
              currentEval = mateIn > 0 ? 10000 : -10000;
            }
          }
          
          // Get best move
          if (message.startsWith('bestmove')) {
            bestMove = message.split(' ')[1];
            this.worker?.removeEventListener('message', handleMessage);
            resolve({ eval: currentEval, bestMove });
          }
        }
      };

      this.worker!.addEventListener('message', handleMessage);
      this.worker!.postMessage(`position fen ${fen}`);
      this.worker!.postMessage(`go depth ${depth}`);

      // Timeout after 10 seconds
      setTimeout(() => {
        this.worker?.removeEventListener('message', handleMessage);
        resolve({ eval: currentEval, bestMove });
      }, 10000);
    });
  }

  classifyMove(
    evalBefore: number,
    evalAfter: number,
    isPlayerMove: boolean,
    isBestMove: boolean
  ): MoveClassification {
    // Adjust perspective (positive is good for the player)
    const perspectiveBefore = isPlayerMove ? evalBefore : -evalBefore;
    const perspectiveAfter = isPlayerMove ? -evalAfter : evalAfter; // Flipped because it's opponent's turn after
    
    const diff = perspectiveAfter - perspectiveBefore; // How much advantage changed

    // Brilliant: Only best move in critical position and gains significant advantage
    if (isBestMove && diff > 200 && Math.abs(perspectiveBefore) > 300) {
      return 'brilliant';
    }

    // Great: Very strong move gaining significant advantage
    if (diff > 150) {
      return 'great';
    }

    // Best move
    if (isBestMove && diff > -25) {
      return 'best';
    }

    // Excellent: Top moves, minimal loss
    if (diff > -25) {
      return 'excellent';
    }

    // Good: Acceptable move
    if (diff > -75) {
      return 'good';
    }

    // Inaccuracy: Suboptimal but not critical
    if (diff > -150) {
      return 'inaccuracy';
    }

    // Mistake: Clear error
    if (diff > -300) {
      return 'mistake';
    }

    // Blunder: Major error
    if (diff <= -300) {
      return 'blunder';
    }

    // Miss: Missed a winning opportunity
    if (perspectiveBefore > 500 && diff < -200) {
      return 'miss';
    }

    return 'good';
  }

  getExplanation(
    classification: MoveClassification,
    evalChange: number,
    move: Move
  ): string {
    const explanations: Record<MoveClassification, string[]> = {
      brilliant: [
        'Brilliant! The only move that maintains the advantage',
        'Outstanding find! A spectacular tactical blow',
        'Genius move! Completely changes the position',
      ],
      great: [
        'Excellent move! Significantly improves your position',
        'Great tactical shot!',
        'Very strong move gaining clear advantage',
      ],
      best: [
        'The best move in this position',
        'Perfect play!',
        'Optimal choice',
      ],
      excellent: [
        'Excellent move',
        'Very good choice',
        'Strong play',
      ],
      good: [
        move.captured ? 'Good capture' : 'Solid move',
        move.san.includes('+') ? 'Good check' : 'Reasonable move',
        'Acceptable play',
      ],
      inaccuracy: [
        'A better move was available',
        'Not the most accurate',
        'Could have been stronger',
      ],
      mistake: [
        `Mistake! Lost ${Math.abs(Math.round(evalChange / 100))} pawns of advantage`,
        'This move weakens your position significantly',
        'Not a good choice here',
      ],
      blunder: [
        `Blunder! Threw away ${Math.abs(Math.round(evalChange / 100))} pawns`,
        'Major error! This loses the game',
        'Critical mistake',
      ],
      miss: [
        'Missed a winning opportunity!',
        'You had a much better move available',
        'A golden chance was missed',
      ],
    };

    const options = explanations[classification];
    return options[Math.floor(Math.random() * options.length)];
  }

  dispose() {
    if (this.worker) {
      this.worker.postMessage('quit');
      this.worker.terminate();
    }
  }
}

export function formatEval(centipawns: number): string {
  if (Math.abs(centipawns) > 5000) {
    const mateIn = Math.ceil((10000 - Math.abs(centipawns)) / 1000);
    return centipawns > 0 ? `M${mateIn}` : `-M${mateIn}`;
  }
  return (centipawns / 100).toFixed(1);
}

export function getEvalColor(evaluation: number): string {
  if (evaluation > 200) return 'text-green-600 dark:text-green-400';
  if (evaluation > 0) return 'text-green-700 dark:text-green-500';
  if (evaluation > -200) return 'text-neutral-600 dark:text-neutral-400';
  return 'text-red-600 dark:text-red-400';
}
