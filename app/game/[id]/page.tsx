"use client";

import { useState, useEffect, use } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Copy, Home, RotateCcw, Check } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/lib/useTheme";
import PromotionDialog from "@/components/PromotionDialog";

export default function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const gameId = resolvedParams.id;
  const { isDark } = useTheme();
  
  const [game, setGame] = useState(new Chess());
  const [copied, setCopied] = useState(false);
  const [optionSquares, setOptionSquares] = useState<Record<string, any>>({});
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [showPromotion, setShowPromotion] = useState(false);
  const [pendingPromotion, setPendingPromotion] = useState<{ from: string; to: string; color: 'w' | 'b' } | null>(null);

  const gameLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/game/${gameId}` 
    : '';

  const copyLink = () => {
    navigator.clipboard.writeText(gameLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

    const newSquares: Record<string, any> = {};
    moves.forEach((move) => {
      if (move.captured) {
        // Capture moves: Bold border around entire square
        newSquares[move.to] = {
          background: "rgba(239, 68, 68, 0.15)",
          boxShadow: "inset 0 0 0 3px rgba(239, 68, 68, 0.9)",
          borderRadius: "4px",
        };
      } else {
        // Regular moves: Small centered dot
        newSquares[move.to] = {
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.6) 20%, transparent 25%)",
          borderRadius: "50%",
        };
      }
    });
    
    // Subtle highlight for the selected square
    newSquares[square] = {
      background: "rgba(59, 130, 246, 0.15)",
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
      return true;
    } catch {
      return false;
    }
  };

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    const piece = game.get(sourceSquare as any);
    
    // Check if this is a pawn promotion
    if (isPromotion(sourceSquare, targetSquare)) {
      setPendingPromotion({ 
        from: sourceSquare, 
        to: targetSquare,
        color: piece?.color || 'w'
      });
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
    // If no piece is selected, try to select this square's piece
    if (!selectedSquare) {
      const piece = game.get(square as any);
      if (piece) {
        setSelectedSquare(square);
        getMoveOptions(square);
      }
      return;
    }
    
    // If a piece is already selected, try to move to this square
    const moveSuccessful = onDrop(selectedSquare, square);
    if (!moveSuccessful) {
      // If the move failed, check if clicking on another piece
      const piece = game.get(square as any);
      if (piece) {
        setSelectedSquare(square);
        getMoveOptions(square);
      } else {
        // Deselect if clicking on empty square
        setSelectedSquare(null);
        setOptionSquares({});
      }
    }
  };

  const onPieceClick = (piece: string, square: string | null) => {
    if (square) {
      setSelectedSquare(square);
      getMoveOptions(square);
    }
  };

  const resetGame = () => {
    setGame(new Chess());
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
            Chess
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

            <button
              onClick={copyLink}
              className="flex items-center gap-2 bg-primary-50 dark:bg-primary-950/50 hover:bg-primary-100 dark:hover:bg-primary-900/50 text-primary-700 dark:text-primary-400 font-medium px-4 py-2 rounded-lg transition-colors border border-primary-100 dark:border-primary-900"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Share Link</span>
                </>
              )}
            </button>
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
                    if (!selectedSquare && piece) {
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
                }}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Game Code */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700">
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">Game Code</h3>
              <div className="bg-neutral-100 dark:bg-neutral-700 rounded-lg p-3 text-center">
                <code className="text-lg font-mono font-semibold text-primary-600 dark:text-primary-400">
                  {gameId}
                </code>
              </div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-3">
                Share this code with your friend to join
              </p>
            </div>

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

            {/* How to Play */}
            <div className="bg-primary-50 dark:bg-primary-950/50 rounded-xl p-6 border border-primary-100 dark:border-primary-900">
              <h3 className="font-semibold text-primary-900 dark:text-primary-300 mb-3">How to Play</h3>
              <ul className="text-sm text-primary-800 dark:text-primary-200 space-y-2">
                <li>• Hover pieces to see moves</li>
                <li>• Drag pieces to move</li>
                <li>• Share the game code</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Promotion Dialog */}
      {showPromotion && pendingPromotion && (
        <PromotionDialog
          color={pendingPromotion.color}
          onSelect={handlePromotion}
          onCancel={() => {
            setShowPromotion(false);
            setPendingPromotion(null);
          }}
        />
      )}
    </div>
  );
}
