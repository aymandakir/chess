"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Home, RotateCcw, Cpu } from "lucide-react";
import { useSearchParams } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/lib/useTheme";
import PromotionDialog from "@/components/PromotionDialog";
import CheckmateEffect from "@/components/CheckmateEffect";

function BotGame() {
  const { isDark } = useTheme();
  const searchParams = useSearchParams();
  const elo = parseInt(searchParams.get("elo") || "1200");
  
  const [game, setGame] = useState(new Chess());
  const [thinking, setThinking] = useState(false);
  const [optionSquares, setOptionSquares] = useState<Record<string, any>>({});
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [premove, setPremove] = useState<{ from: string; to: string } | null>(null);
  const [showPromotion, setShowPromotion] = useState(false);
  const [pendingPromotion, setPendingPromotion] = useState<{ from: string; to: string } | null>(null);
  const [showCheckmate, setShowCheckmate] = useState(false);
  const [stockfish, setStockfish] = useState<Worker | null>(null);

  const getLevelName = (elo: number) => {
    if (elo <= 800) return "Beginner";
    if (elo <= 1200) return "Casual";
    if (elo <= 1600) return "Intermediate";
    if (elo <= 2000) return "Advanced";
    if (elo <= 2400) return "Master";
    return "Grandmaster";
  };

  const getEngineConfig = (elo: number) => {
    if (elo <= 800) {
      return { skillLevel: 0, depth: 1 };
    } else if (elo <= 1200) {
      return { skillLevel: 3, depth: 3 };
    } else if (elo <= 1600) {
      return { skillLevel: 7, depth: 6 };
    } else if (elo <= 2000) {
      return { skillLevel: 12, depth: 10 };
    } else if (elo <= 2400) {
      return { skillLevel: 17, depth: 14 };
    } else {
      return { skillLevel: 20, depth: 18 };
    }
  };

  // Initialize Stockfish
  useEffect(() => {
    const worker = new Worker('/stockfish.js');
    worker.postMessage('uci');
    setStockfish(worker);

    return () => {
      worker.postMessage('quit');
      worker.terminate();
    };
  }, []);

  const makeComputerMove = useCallback((currentGame: Chess) => {
    if (!stockfish) return;
    
    const possibleMoves = currentGame.moves({ verbose: true });
    if (possibleMoves.length === 0) return;

    setThinking(true);

    const config = getEngineConfig(elo);
    
    // Configure Stockfish with current ELO settings
    stockfish.postMessage(`setoption name Skill Level value ${config.skillLevel}`);
    stockfish.postMessage(`setoption name UCI_LimitStrength value true`);
    stockfish.postMessage(`setoption name UCI_Elo value ${elo}`);
    
    // Set up position
    stockfish.postMessage(`position fen ${currentGame.fen()}`);
    
    // Start search
    stockfish.postMessage(`go depth ${config.depth}`);

    // Listen for best move
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      
      if (typeof message === 'string' && message.startsWith('bestmove')) {
        const moveStr = message.split(' ')[1];
        
        let updatedGame: Chess | null = null;
        
        try {
          const gameCopy = new Chess(currentGame.fen());
          
          // Convert UCI format (e2e4) to chess.js format
          const from = moveStr.substring(0, 2);
          const to = moveStr.substring(2, 4);
          const promotion = moveStr.length > 4 ? moveStr.substring(4, 5) : undefined;
          
          const move = gameCopy.move({
            from,
            to,
            promotion,
          });

          if (move) {
            setGame(gameCopy);
            updatedGame = gameCopy;
          }
        } catch (error) {
          console.error('Error making computer move:', error);
        }
        
        setThinking(false);
        
        // Execute premove if one exists
        if (premove && updatedGame) {
          setTimeout(() => {
            const premoveSuccess = tryPremove(updatedGame!, premove);
            if (premoveSuccess) {
              setPremove(null);
            } else {
              setPremove(null);
              setSelectedSquare(null);
              setOptionSquares({});
            }
          }, 100);
        }
        
        stockfish.removeEventListener('message', handleMessage);
      }
    };

    stockfish.addEventListener('message', handleMessage);
  }, [elo, premove, stockfish]);

  const tryPremove = (currentGame: Chess, move: { from: string; to: string }) => {
    try {
      // Clear the selection and highlights when executing premove
      setSelectedSquare(null);
      setOptionSquares({});
      
      const gameCopy = new Chess(currentGame.fen());
      const result = gameCopy.move({
        from: move.from,
        to: move.to,
        promotion: 'q',
      });

      if (result === null) return false;

      setGame(gameCopy);
      
      // Computer responds to premove
      if (!gameCopy.isGameOver() && gameCopy.turn() === 'b') {
        setTimeout(() => {
          makeComputerMove(gameCopy);
        }, 200);
      }
      
      return true;
    } catch {
      return false;
    }
  };

  const getMoveOptions = (square: string) => {
    const moves = game.moves({
      square: square as any,
      verbose: true,
    });
    
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const isPremove = thinking && game.turn() !== 'w';
    
    const newSquares: Record<string, any> = {};
    moves.forEach((move) => {
      if (move.captured) {
        // Capture moves: Bold corner brackets
        newSquares[move.to] = {
          background: isPremove 
            ? "rgba(251, 146, 60, 0.15)" 
            : "rgba(239, 68, 68, 0.15)",
          boxShadow: isPremove
            ? "inset 0 0 0 3px rgba(251, 146, 60, 0.8)"
            : "inset 0 0 0 3px rgba(239, 68, 68, 0.9)",
          borderRadius: "4px",
        };
      } else {
        // Regular moves: Small centered dot
        newSquares[move.to] = {
          background: isPremove
            ? "radial-gradient(circle, rgba(251, 146, 60, 0.6) 20%, transparent 25%)"
            : "radial-gradient(circle, rgba(59, 130, 246, 0.6) 20%, transparent 25%)",
          borderRadius: "50%",
        };
      }
    });
    
    // Subtle highlight for the selected square
    newSquares[square] = {
      background: isPremove ? "rgba(251, 146, 60, 0.15)" : "rgba(59, 130, 246, 0.15)",
      borderRadius: "4px",
    };
    
    setOptionSquares(newSquares);
    return true;
  };

  const isPromotion = (from: string, to: string) => {
    const piece = game.get(from as any);
    if (!piece || piece.type !== 'p') return false;
    
    const toRank = to[1];
    return (piece.color === 'w' && toRank === '8') || (piece.color === 'b' && toRank === '1');
  };

  const executeMove = (from: string, to: string, promotion?: string) => {
    setOptionSquares({});
    setSelectedSquare(null);
    
    try {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: from,
        to: to,
        promotion: promotion || 'q',
      });

      if (move === null) return false;

      setGame(gameCopy);
      
      // Computer makes a move after player (if game not over)
      if (!gameCopy.isGameOver() && gameCopy.turn() === 'b') {
        setTimeout(() => {
          makeComputerMove(gameCopy);
        }, 200);
      }
      
      return true;
    } catch {
      return false;
    }
  };

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    // If computer is thinking or not player's turn, treat as premove via drag
    if (thinking && game.turn() === 'b') {
      setPremove({ from: sourceSquare, to: targetSquare });
      setSelectedSquare(sourceSquare); // Keep selection visible
      return true; // Accept the drag but queue as premove
    }
    
    // Can't make normal moves during computer's turn
    if (game.turn() !== 'w') return false;
    
    // Check if this is a pawn promotion
    if (isPromotion(sourceSquare, targetSquare)) {
      setPendingPromotion({ from: sourceSquare, to: targetSquare });
      setShowPromotion(true);
      return true;
    }
    
    return executeMove(sourceSquare, targetSquare);
  };

  const handlePromotion = (piece: 'q' | 'r' | 'b' | 'n') => {
    if (pendingPromotion) {
      executeMove(pendingPromotion.from, pendingPromotion.to, piece);
      setPendingPromotion(null);
    }
    setShowPromotion(false);
  };

  const onSquareClick = (square: string) => {
    // PREMOVE MODE: Allow setting up moves during computer's turn
    if (thinking && game.turn() === 'b') {
      // If no piece is selected, select a white piece for premove
      if (!selectedSquare) {
        const piece = game.get(square as any);
        if (piece && piece.color === 'w') {
          setSelectedSquare(square);
          getMoveOptions(square);
        }
        return;
      }
      
      // If a piece is selected, set the premove to this square
      setPremove({ from: selectedSquare, to: square });
      // Keep the selection visible so user can see their premove
      return;
    }
    
    // NORMAL MODE: Regular turn logic
    if (game.turn() !== 'w') return;
    
    // If no piece is selected, try to select this square's piece
    if (!selectedSquare) {
      const piece = game.get(square as any);
      if (piece && piece.color === 'w') {
        setSelectedSquare(square);
        getMoveOptions(square);
      }
      return;
    }
    
    // If a piece is already selected, try to move to this square
    const moveSuccessful = onDrop(selectedSquare, square);
    if (moveSuccessful) {
      setSelectedSquare(null);
      setOptionSquares({});
    } else {
      // If the move failed, check if clicking on another piece
      const piece = game.get(square as any);
      if (piece && piece.color === 'w') {
        setSelectedSquare(square);
        getMoveOptions(square);
      } else {
        // Deselect if clicking on empty or opponent piece
        setSelectedSquare(null);
        setOptionSquares({});
      }
    }
  };

  const onPieceClick = (piece: string, square: string | null) => {
    // Don't show options when computer is thinking or it's not player's turn
    if (thinking || game.turn() !== 'w' || !square) return;
    
    // Only show options for white pieces
    if (piece[0] === 'w') {
      setSelectedSquare(square);
      getMoveOptions(square);
    }
  };

  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setThinking(false);
    setShowCheckmate(false);
    setSelectedSquare(null);
    setOptionSquares({});
    setPremove(null);
  };

  const isCheck = game.isCheck();
  const isCheckmate = game.isCheckmate();
  const isDraw = game.isDraw();
  const turn = game.turn() === 'w' ? 'White' : 'Black';

  // Show checkmate effect when game ends
  useEffect(() => {
    if (isCheckmate) {
      setTimeout(() => setShowCheckmate(true), 500);
    }
  }, [isCheckmate]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold font-display text-neutral-900 dark:text-white">
            Chess vs Computer
          </h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="/"
              className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </a>
          </div>
        </div>

        {/* Game Info Bar */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm border border-neutral-200 dark:border-neutral-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-700 px-3 py-2 rounded-lg">
                <Cpu className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span className="font-semibold text-sm text-neutral-700 dark:text-neutral-300">
                  {getLevelName(elo)} ({elo})
                </span>
              </div>
              {thinking && (
                <span className="text-sm text-neutral-500 dark:text-neutral-400 animate-pulse">
                  Computer is thinking...
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${turn === 'White' ? 'bg-neutral-800 dark:bg-neutral-200' : 'bg-neutral-400 dark:bg-neutral-500'}`} />
              <span className="font-semibold text-neutral-900 dark:text-white">
                {isCheckmate && '🏆 Checkmate! '}
                {isDraw && '🤝 Draw'}
                {!isCheckmate && !isDraw && (
                  <>
                    {turn} to move
                    {isCheck && ' • Check!'}
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Board Container */}
        <div className="grid lg:grid-cols-[1fr,300px] gap-6">
          {/* Chess Board */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700">
            <div className="aspect-square max-w-2xl mx-auto">
              <Chessboard
                options={{
                  position: game.fen(),
                  onPieceDrop: ({ sourceSquare, targetSquare }) => {
                    if (!targetSquare) return false;
                    return onDrop(sourceSquare, targetSquare);
                  },
                  onSquareClick: ({ square }) => onSquareClick(square),
                  onPieceClick: ({ piece, square }) => onPieceClick(piece.pieceType, square),
                  onMouseOverSquare: ({ square, piece }) => {
                    // Show hover preview if no piece is selected
                    // Allow during computer turn for premove visualization
                    if (!selectedSquare && piece && piece.pieceType[0] === 'w') {
                      getMoveOptions(square);
                    }
                  },
                  onMouseOutSquare: () => {
                    // Only clear if no piece is selected (don't clear on click-selection)
                    if (!selectedSquare) {
                      setOptionSquares({});
                    }
                  },
                  boardStyle: {
                    borderRadius: '8px',
                  },
                  lightSquareStyle: { 
                    backgroundColor: isDark ? '#404040' : '#f5f5f4',
                  },
                  darkSquareStyle: { 
                    backgroundColor: isDark ? '#262626' : '#a8a29e',
                  },
                  squareStyles: optionSquares,
                  allowDragging: true, // Always allow dragging for premoves
                }}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Controls */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700 space-y-3">
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">Controls</h3>
              
              <button
                onClick={resetGame}
                className="w-full flex items-center justify-center gap-2 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>New Game</span>
              </button>
            </div>

            {/* Info */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                  <h3 className="font-semibold text-neutral-900 dark:text-white">
                    {getLevelName(elo)}
                  </h3>
                </div>
                
                <div className="flex items-center justify-between py-2 px-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">ELO Rating</span>
                  <span className="font-mono font-bold text-neutral-900 dark:text-white">{elo}</span>
                </div>

                <div className="pt-2 space-y-1.5 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white dark:bg-neutral-200 rounded border-2 border-neutral-300 dark:border-neutral-600" />
                    <span className="text-neutral-700 dark:text-neutral-300">You (White)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-neutral-800 dark:bg-neutral-700 rounded border-2 border-neutral-400 dark:border-neutral-500" />
                    <span className="text-neutral-700 dark:text-neutral-300">Computer (Black)</span>
                  </div>
                </div>

                {thinking && (
                  <div className="pt-2 text-xs text-primary-600 dark:text-primary-400 font-medium animate-pulse">
                    🤔 Computer is thinking...
                  </div>
                )}
                
                {premove && (
                  <div className="pt-2 text-xs text-orange-600 dark:text-orange-400 font-medium">
                    ⚡ Premove queued
                  </div>
                )}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700">
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">Tips</h3>
              <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2">
                <li>• Hover pieces to see moves</li>
                <li>• Control the center</li>
                <li>• Develop your pieces</li>
                <li>• Protect your king</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Promotion Dialog */}
      {showPromotion && (
        <PromotionDialog
          color="w"
          onSelect={handlePromotion}
          onCancel={() => {
            setShowPromotion(false);
            setPendingPromotion(null);
          }}
        />
      )}

      {/* Checkmate Effect */}
      {showCheckmate && (
        <CheckmateEffect
          winner={turn === 'White' ? 'Black' : 'White'}
          onClose={resetGame}
        />
      )}
    </div>
  );
}

export default function BotPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-neutral-600">Loading game...</p>
        </div>
      </div>
    }>
      <BotGame />
    </Suspense>
  );
}
