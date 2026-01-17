"use client";

import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { ArrowLeft, CheckCircle, XCircle, Lightbulb, SkipForward, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/useTheme";
import { fetchPuzzleByRating, Puzzle, getThemeIcon, getThemeDisplayName } from "@/lib/puzzles";
import { usePuzzleStats } from "@/lib/usePuzzleStats";

export default function PracticePuzzlesPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const stats = usePuzzleStats();
  
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [game, setGame] = useState<Chess | null>(null);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [status, setStatus] = useState<'solving' | 'correct' | 'wrong'>('solving');
  const [showSolution, setShowSolution] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNewPuzzle();
  }, []);

  const loadNewPuzzle = async () => {
    setLoading(true);
    setStatus('solving');
    setShowSolution(false);
    setCurrentMoveIndex(0);
    
    const newPuzzle = await fetchPuzzleByRating(stats.puzzleRating);
    
    if (newPuzzle) {
      setPuzzle(newPuzzle);
      const newGame = new Chess(newPuzzle.fen);
      
      // Make the first move (opponent's move to set up the puzzle)
      if (newPuzzle.moves.length > 0) {
        const firstMove = newPuzzle.moves[0];
        newGame.move(firstMove);
        setCurrentMoveIndex(1);
      }
      
      setGame(newGame);
    }
    
    setLoading(false);
  };

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    if (!puzzle || !game || status !== 'solving') return false;
    
    try {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      });

      if (!move) return false;

      const moveStr = `${sourceSquare}${targetSquare}`;
      const expectedMove = puzzle.moves[currentMoveIndex];

      // Check if this is the correct move
      if (moveStr === expectedMove || move.san === expectedMove) {
        setGame(gameCopy);
        
        // Check if puzzle is complete
        if (currentMoveIndex >= puzzle.moves.length - 1) {
          setStatus('correct');
          stats.recordAttempt(true, puzzle.themes[0] || 'tactics', puzzle.rating);
          return true;
        }
        
        // Make opponent's response
        setCurrentMoveIndex(currentMoveIndex + 1);
        setTimeout(() => {
          const nextMove = puzzle.moves[currentMoveIndex + 1];
          if (nextMove) {
            gameCopy.move(nextMove);
            setGame(new Chess(gameCopy.fen()));
            setCurrentMoveIndex(currentMoveIndex + 2);
          } else {
            setStatus('correct');
            stats.recordAttempt(true, puzzle.themes[0] || 'tactics', puzzle.rating);
          }
        }, 300);
        
        return true;
      } else {
        // Wrong move
        setStatus('wrong');
        stats.recordAttempt(false, puzzle.themes[0] || 'tactics', puzzle.rating);
        return false;
      }
    } catch {
      return false;
    }
  };

  if (loading || !puzzle || !game) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Loading puzzle...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/puzzles')}
            className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-white dark:bg-neutral-800 px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">Streak: </span>
              <span className="font-bold text-lg text-amber-600 dark:text-amber-400">
                🔥 {stats.currentStreak}
              </span>
            </div>
          </div>
        </div>

        {/* Puzzle Info */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-2xl">{getThemeIcon(puzzle.themes[0])}</div>
              <div>
                <div className="font-semibold text-neutral-900 dark:text-white">
                  {getThemeDisplayName(puzzle.themes[0])}
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  Rating: {puzzle.rating}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Your Rating</div>
              <div className="font-bold text-xl text-primary-600 dark:text-primary-400">
                {stats.puzzleRating}
              </div>
            </div>
          </div>
        </div>

        {/* Board */}
        <div className="grid lg:grid-cols-[1fr,300px] gap-6">
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
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
                    backgroundColor: isDark ? '#404040' : '#f5f5f4',
                  },
                  darkSquareStyle: { 
                    backgroundColor: isDark ? '#262626' : '#a8a29e',
                  },
                  allowDragging: status === 'solving',
                }}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Status Card */}
            {status === 'correct' && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border-2 border-green-300 dark:border-green-700 animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  <h3 className="text-xl font-bold text-green-900 dark:text-green-300">
                    Correct!
                  </h3>
                </div>
                <p className="text-sm text-green-800 dark:text-green-300 mb-4">
                  Great job! You found the winning move.
                </p>
                <button
                  onClick={loadNewPuzzle}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <SkipForward className="w-4 h-4" />
                  Next Puzzle
                </button>
              </div>
            )}

            {status === 'wrong' && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border-2 border-red-300 dark:border-red-700 animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                  <h3 className="text-xl font-bold text-red-900 dark:text-red-300">
                    Not Quite
                  </h3>
                </div>
                <p className="text-sm text-red-800 dark:text-red-300 mb-4">
                  That wasn't the best move. Try again or see the solution.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setStatus('solving');
                      setGame(new Chess(puzzle.fen));
                      if (puzzle.moves.length > 0) {
                        const newGame = new Chess(puzzle.fen);
                        newGame.move(puzzle.moves[0]);
                        setGame(newGame);
                      }
                      setCurrentMoveIndex(1);
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Retry
                  </button>
                  <button
                    onClick={() => setShowSolution(true)}
                    className="flex-1 bg-white dark:bg-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white border-2 border-red-200 dark:border-red-800 font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Solution
                  </button>
                </div>
              </div>
            )}

            {status === 'solving' && (
              <div className="bg-primary-50 dark:bg-primary-950/30 rounded-xl p-6 border border-primary-200 dark:border-primary-800">
                <h3 className="font-bold text-primary-900 dark:text-primary-300 mb-2">
                  Find the best move!
                </h3>
                <p className="text-sm text-primary-800 dark:text-primary-200">
                  {game.turn() === 'w' ? 'White' : 'Black'} to move
                </p>
              </div>
            )}

            {/* Solution Display */}
            {showSolution && (
              <div className="bg-white dark:bg-neutral-700 rounded-xl p-6 border border-neutral-200 dark:border-neutral-600">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-neutral-900 dark:text-white">Solution</h3>
                </div>
                <div className="space-y-2">
                  {puzzle.moves.map((move, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-mono text-neutral-600 dark:text-neutral-400">
                        {Math.floor(index / 2) + 1}.{index % 2 === 0 ? '' : '..'} {move}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={loadNewPuzzle}
                  className="w-full mt-4 bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Next Puzzle
                </button>
              </div>
            )}

            {/* Progress */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">Your Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-400">Total Solved</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{stats.totalSolved}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-400">Success Rate</span>
                  <span className="font-bold text-neutral-900 dark:text-white">
                    {stats.totalAttempted > 0 
                      ? Math.round((stats.totalSolved / stats.totalAttempted) * 100) 
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-400">Best Streak</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{stats.bestStreak}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
