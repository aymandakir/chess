"use client";

export class StockfishEngine {
  private worker: Worker | null = null;
  private onBestMove: ((move: string) => void) | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        // Initialize Stockfish worker
        this.worker = new Worker('/stockfish.js');
        
        this.worker.onmessage = (event) => {
          const message = event.data;
          
          if (typeof message === 'string' && message.startsWith('bestmove')) {
            const bestMove = message.split(' ')[1];
            if (this.onBestMove) {
              this.onBestMove(bestMove);
            }
          }
        };

        // Initialize UCI protocol
        this.worker.postMessage('uci');
      } catch (error) {
        console.error('Failed to initialize Stockfish:', error);
      }
    }
  }

  async getBestMove(
    fen: string, 
    elo: number,
    onMove: (move: string) => void
  ): Promise<void> {
    if (!this.worker) {
      console.error('Stockfish worker not initialized');
      return;
    }

    this.onBestMove = onMove;

    // Configure strength based on ELO
    const config = this.getEngineConfig(elo);
    
    // Set UCI options
    this.worker.postMessage(`setoption name Skill Level value ${config.skillLevel}`);
    this.worker.postMessage(`setoption name UCI_LimitStrength value true`);
    this.worker.postMessage(`setoption name UCI_Elo value ${elo}`);
    
    // Set position
    this.worker.postMessage(`position fen ${fen}`);
    
    // Start search
    if (config.depth) {
      this.worker.postMessage(`go depth ${config.depth}`);
    } else {
      this.worker.postMessage(`go movetime ${config.moveTime}`);
    }
  }

  private getEngineConfig(elo: number) {
    // Configure engine parameters based on ELO
    if (elo <= 800) {
      // Beginner: Very limited
      return { skillLevel: 0, depth: 1, moveTime: 100 };
    } else if (elo <= 1200) {
      // Casual: Basic calculation
      return { skillLevel: 3, depth: 3, moveTime: 200 };
    } else if (elo <= 1600) {
      // Intermediate: Moderate strength
      return { skillLevel: 7, depth: 6, moveTime: 500 };
    } else if (elo <= 2000) {
      // Advanced: Strong tactical play
      return { skillLevel: 12, depth: 10, moveTime: 1000 };
    } else if (elo <= 2400) {
      // Master: Very strong
      return { skillLevel: 17, depth: 14, moveTime: 2000 };
    } else {
      // Grandmaster: Maximum strength
      return { skillLevel: 20, depth: 18, moveTime: 3000 };
    }
  }

  stop() {
    if (this.worker) {
      this.worker.postMessage('stop');
    }
  }

  quit() {
    if (this.worker) {
      this.worker.postMessage('quit');
      this.worker.terminate();
      this.worker = null;
    }
  }
}
