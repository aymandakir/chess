"use client";

import { useState, useEffect, use } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Copy, Home, RotateCcw, Check } from "lucide-react";

export default function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const gameId = resolvedParams.id;
  
  const [game, setGame] = useState(new Chess());
  const [copied, setCopied] = useState(false);

  const gameLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/game/${gameId}` 
    : '';

  const copyLink = () => {
    navigator.clipboard.writeText(gameLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    try {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      });

      if (move === null) return false;

      setGame(gameCopy);
      return true;
    } catch {
      return false;
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
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold font-display text-neutral-900">
            Chess
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

            <button
              onClick={copyLink}
              className="flex items-center gap-2 bg-primary-50 hover:bg-primary-100 text-primary-700 font-medium px-4 py-2 rounded-lg transition-colors"
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
                }}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Game Code */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
              <h3 className="font-semibold text-neutral-900 mb-3">Game Code</h3>
              <div className="bg-neutral-100 rounded-lg p-3 text-center">
                <code className="text-lg font-mono font-semibold text-primary-600">
                  {gameId}
                </code>
              </div>
              <p className="text-sm text-neutral-500 mt-3">
                Share this code with your friend to join
              </p>
            </div>

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

            {/* How to Play */}
            <div className="bg-primary-50 rounded-xl p-6 border border-primary-100">
              <h3 className="font-semibold text-primary-900 mb-3">How to Play</h3>
              <ul className="text-sm text-primary-800 space-y-2">
                <li>• Drag pieces to move</li>
                <li>• Share the game code</li>
                <li>• Play in real-time</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
