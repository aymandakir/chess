"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Home, RotateCcw, Cpu } from "lucide-react";
import { useSearchParams } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/lib/useTheme";

function BotGame() {
  const { isDark } = useTheme();
  const searchParams = useSearchParams();
  const elo = parseInt(searchParams.get("elo") || "1200");
  
  const [game, setGame] = useState(new Chess());
  const [thinking, setThinking] = useState(false);
  const [optionSquares, setOptionSquares] = useState<Record<string, any>>({});
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);

  const getLevelName = (elo: number) => {
    if (elo <= 800) return "Beginner";
    if (elo <= 1200) return "Casual";
    if (elo <= 1600) return "Intermediate";
    if (elo <= 2000) return "Advanced";
    if (elo <= 2400) return "Master";
    return "Grandmaster";
  };

  const makeComputerMove = useCallback((currentGame: Chess) => {
    const possibleMoves = currentGame.moves({ verbose: true });
    if (possibleMoves.length === 0) return;

    // Simulate thinking time based on ELO (higher ELO = faster thinking)
    const thinkTime = Math.max(300, 1500 - (elo / 3));
    
    setThinking(true);
    
    setTimeout(() => {
      const gameCopy = new Chess(currentGame.fen());
      
      // Simple move selection based on ELO
      let selectedMove;
      if (elo >= 2400) {
        // Master/Grandmaster: Prefer captures and center control
        const captures = possibleMoves.filter(m => m.captured);
        const centerMoves = possibleMoves.filter(m => 
          ['d4', 'd5', 'e4', 'e5'].includes(m.to)
        );
        
        if (captures.length > 0 && Math.random() > 0.3) {
          selectedMove = captures[Math.floor(Math.random() * captures.length)];
        } else if (centerMoves.length > 0 && Math.random() > 0.5) {
          selectedMove = centerMoves[Math.floor(Math.random() * centerMoves.length)];
        } else {
          selectedMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        }
      } else if (elo >= 1600) {
        // Intermediate/Advanced: Sometimes prefer captures
        const captures = possibleMoves.filter(m => m.captured);
        if (captures.length > 0 && Math.random() > 0.5) {
          selectedMove = captures[Math.floor(Math.random() * captures.length)];
        } else {
          selectedMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        }
      } else {
        // Beginner/Casual: Purely random
        selectedMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      }
      
      gameCopy.move(selectedMove);
      setGame(gameCopy);
      setThinking(false);
    }, thinkTime);
  }, [elo]);

  const getMoveOptions = (square: string) => {
    const moves = game.moves({
      square: square as any,
      verbose: true,
    });
    
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const newSquares: Record<string, any> = {};
    moves.forEach((move) => {
      newSquares[move.to] = {
        background:
          move.captured
            ? "radial-gradient(circle, rgba(239, 68, 68, 0.7) 15%, transparent 20%)"
            : "radial-gradient(circle, rgba(59, 130, 246, 0.5) 20%, transparent 25%)",
        borderRadius: "50%",
      };
    });
    
    // Subtle highlight for the selected square
    newSquares[square] = {
      background: "rgba(59, 130, 246, 0.12)",
    };
    
    setOptionSquares(newSquares);
    return true;
  };

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    // Clear highlights and selection
    setOptionSquares({});
    setSelectedSquare(null);
    
    // Prevent moves while computer is thinking
    if (thinking) return false;
    
    // Only allow moving white pieces (player is white)
    if (game.turn() !== 'w') return false;
    
    try {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      });

      if (move === null) return false;

      setGame(gameCopy);
      
      // Computer makes a move after player (if game not over)
      if (!gameCopy.isGameOver() && gameCopy.turn() === 'b') {
        // Small delay before computer thinks
        setTimeout(() => {
          makeComputerMove(gameCopy);
        }, 200);
      }
      
      return true;
    } catch {
      return false;
    }
  };

  const onSquareClick = (square: string) => {
    // Don't allow clicks when computer is thinking or it's not player's turn
    if (thinking || game.turn() !== 'w') return;
    
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
  };

  const isCheck = game.isCheck();
  const isCheckmate = game.isCheckmate();
  const isDraw = game.isDraw();
  const turn = game.turn() === 'w' ? 'White' : 'Black';

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
                    // Only show hover preview if no piece is currently selected
                    if (!selectedSquare && !thinking && game.turn() === 'w' && piece && piece.pieceType[0] === 'w') {
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
                  allowDragging: !thinking,
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
