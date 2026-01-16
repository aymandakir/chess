"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Home, RotateCcw, Cpu } from "lucide-react";
import { useSearchParams } from "next/navigation";

function BotGame() {
  const searchParams = useSearchParams();
  const elo = parseInt(searchParams.get("elo") || "1200");
  
  const [game, setGame] = useState(new Chess());
  const [thinking, setThinking] = useState(false);

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

  const onDrop = (sourceSquare: string, targetSquare: string) => {
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
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold font-display text-neutral-900">
            Chess vs Computer
          </h1>
          <a
            href="/"
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Home</span>
          </a>
        </div>

        {/* Game Info Bar */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-neutral-100 px-3 py-2 rounded-lg">
                <Cpu className="w-4 h-4 text-primary-600" />
                <span className="font-semibold text-sm text-neutral-700">
                  {getLevelName(elo)} ({elo})
                </span>
              </div>
              {thinking && (
                <span className="text-sm text-neutral-500 animate-pulse">
                  Computer is thinking...
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${turn === 'White' ? 'bg-neutral-800' : 'bg-neutral-400'}`} />
              <span className="font-semibold text-neutral-900">
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
          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <div className="aspect-square max-w-2xl mx-auto">
              <Chessboard
                options={{
                  position: game.fen(),
                  onPieceDrop: ({ sourceSquare, targetSquare }) => {
                    if (!targetSquare) return false;
                    return onDrop(sourceSquare, targetSquare);
                  },
                  boardStyle: {
                    borderRadius: '8px',
                  },
                  lightSquareStyle: { 
                    backgroundColor: '#f5f5f4',
                  },
                  darkSquareStyle: { 
                    backgroundColor: '#a8a29e',
                  },
                  allowDragging: !thinking,
                }}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Controls */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200 space-y-3">
              <h3 className="font-semibold text-neutral-900 mb-3">Controls</h3>
              
              <button
                onClick={resetGame}
                className="w-full flex items-center justify-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>New Game</span>
              </button>
            </div>

            {/* Info */}
            <div className="bg-primary-50 rounded-xl p-6 border border-primary-100">
              <h3 className="font-semibold text-primary-900 mb-3">
                Playing vs {getLevelName(elo)}
              </h3>
              <div className="text-sm text-primary-800 space-y-2">
                <p>ELO Rating: <span className="font-semibold">{elo}</span></p>
                <p className="text-xs text-primary-600 mt-2">
                  You are White. Computer is Black.
                </p>
                {thinking && (
                  <p className="text-xs text-primary-700 font-medium animate-pulse">
                    🤔 Computer is thinking...
                  </p>
                )}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
              <h3 className="font-semibold text-neutral-900 mb-3">Tips</h3>
              <ul className="text-sm text-neutral-600 space-y-2">
                <li>• Control the center</li>
                <li>• Develop your pieces</li>
                <li>• Protect your king</li>
                <li>• Think ahead!</li>
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
