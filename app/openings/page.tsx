"use client";

import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Home, ArrowLeft, BookOpen, Star, TrendingUp, Database, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/useTheme";
import ThemeToggle from "@/components/ThemeToggle";
import { fetchOpeningData, OpeningData, getOpeningName, calculateWinPercentages } from "@/lib/openings";
import { useRepertoire } from "@/lib/useRepertoire";

export default function OpeningsPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const repertoire = useRepertoire();
  
  const [game, setGame] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [openingData, setOpeningData] = useState<OpeningData | null>(null);
  const [loading, setLoading] = useState(false);
  const [masterMode, setMasterMode] = useState(false);
  const [showRepertoire, setShowRepertoire] = useState(false);

  useEffect(() => {
    loadOpeningData();
  }, [game, masterMode]);

  const loadOpeningData = async () => {
    setLoading(true);
    const data = await fetchOpeningData(game.fen(), masterMode);
    setOpeningData(data);
    setLoading(false);
  };

  const makeMove = (moveStr: string) => {
    try {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move(moveStr);
      
      if (move) {
        setGame(gameCopy);
        setMoveHistory([...moveHistory, move.san]);
      }
    } catch (error) {
      console.error("Invalid move:", error);
    }
  };

  const undoMove = () => {
    if (moveHistory.length === 0) return;
    
    const newGame = new Chess();
    const newHistory = moveHistory.slice(0, -1);
    
    newHistory.forEach(move => {
      newGame.move(move);
    });
    
    setGame(newGame);
    setMoveHistory(newHistory);
  };

  const reset = () => {
    setGame(new Chess());
    setMoveHistory([]);
  };

  const saveToRepertoire = () => {
    const color = game.fen().includes(' w ') ? 'white' : 'black';
    repertoire.addEntry({
      color,
      name: getOpeningName(moveHistory),
      moves: moveHistory,
      fen: game.fen(),
    });
    alert("Added to your repertoire!");
  };

  const percentages = openingData 
    ? calculateWinPercentages(openingData.white, openingData.draws, openingData.black)
    : { white: 0, draws: 0, black: 0 };

  const totalGames = openingData 
    ? openingData.white + openingData.draws + openingData.black 
    : 0;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-display text-neutral-900 dark:text-white">
              Opening Explorer
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              Explore chess openings with master game statistics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
            >
              <Home className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={undoMove}
              disabled={moveHistory.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-900 dark:text-white rounded-lg transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Undo
            </button>
            
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white rounded-lg transition-colors font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>

            <button
              onClick={() => setMasterMode(!masterMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
                masterMode
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white'
              }`}
            >
              <Star className={`w-4 h-4 ${masterMode ? 'fill-white' : ''}`} />
              {masterMode ? 'Master Games' : 'All Games'}
            </button>

            <button
              onClick={saveToRepertoire}
              disabled={moveHistory.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium ml-auto"
            >
              <BookOpen className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr,400px] gap-6">
          {/* Board */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
              <div className="aspect-square max-w-2xl mx-auto">
                <Chessboard
                  options={{
                    position: game.fen(),
                    boardStyle: {
                      borderRadius: '8px',
                    },
                    lightSquareStyle: { 
                      backgroundColor: isDark ? '#404040' : '#f5f5f4',
                    },
                    darkSquareStyle: { 
                      backgroundColor: isDark ? '#262626' : '#a8a29e',
                    },
                    allowDragging: false,
                  }}
                />
              </div>
            </div>

            {/* Move History */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
              <h3 className="font-bold text-neutral-900 dark:text-white mb-3">
                Current Line
              </h3>
              <div className="flex flex-wrap gap-2">
                {moveHistory.length === 0 ? (
                  <span className="text-neutral-500 dark:text-neutral-400 text-sm">
                    Starting position - click a move to begin
                  </span>
                ) : (
                  moveHistory.map((move, index) => (
                    <span
                      key={index}
                      className="font-mono text-sm bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded text-neutral-900 dark:text-white"
                    >
                      {Math.floor(index / 2) + 1}.{index % 2 === 0 ? '' : '..'} {move}
                    </span>
                  ))
                )}
              </div>
              <div className="mt-3 text-sm font-semibold text-primary-600 dark:text-primary-400">
                {getOpeningName(moveHistory)}
              </div>
            </div>
          </div>

          {/* Statistics Sidebar */}
          <div className="space-y-4">
            {/* Position Statistics */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h3 className="font-bold text-neutral-900 dark:text-white">
                  Position Stats
                </h3>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
              ) : openingData && totalGames > 0 ? (
                <div className="space-y-4">
                  <div className="text-center py-2">
                    <div className="text-3xl font-bold text-neutral-900 dark:text-white">
                      {totalGames.toLocaleString()}
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      games played
                    </div>
                  </div>

                  {/* Win Rate Bars */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-neutral-700 dark:text-neutral-300">White wins</span>
                        <span className="font-bold text-neutral-900 dark:text-white">{percentages.white}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                        <div
                          className="bg-white dark:bg-neutral-300 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentages.white}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-neutral-700 dark:text-neutral-300">Draws</span>
                        <span className="font-bold text-neutral-900 dark:text-white">{percentages.draws}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                        <div
                          className="bg-neutral-400 dark:bg-neutral-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentages.draws}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-neutral-700 dark:text-neutral-300">Black wins</span>
                        <span className="font-bold text-neutral-900 dark:text-white">{percentages.black}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                        <div
                          className="bg-neutral-800 dark:bg-neutral-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentages.black}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-500 dark:text-neutral-400 text-sm">
                  No statistics available
                </div>
              )}
            </div>

            {/* Popular Moves */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h3 className="font-bold text-neutral-900 dark:text-white">
                  Popular Moves
                </h3>
              </div>

              {loading ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                </div>
              ) : openingData && openingData.moves.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {openingData.moves
                    .sort((a, b) => b.games - a.games)
                    .slice(0, 10)
                    .map((move, index) => {
                      const movePercent = calculateWinPercentages(move.white, move.draws, move.black);
                      
                      return (
                        <button
                          key={index}
                          onClick={() => makeMove(move.san)}
                          className="w-full text-left p-3 rounded-lg hover:bg-primary-50 dark:hover:bg-neutral-700 transition-colors border border-neutral-100 dark:border-neutral-700 group"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono font-bold text-lg text-neutral-900 dark:text-white">
                              {move.san}
                            </span>
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                              {move.games.toLocaleString()} games
                            </span>
                          </div>
                          <div className="flex gap-1 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-white dark:bg-neutral-300"
                              style={{ width: `${movePercent.white}%` }}
                            />
                            <div
                              className="bg-neutral-400"
                              style={{ width: `${movePercent.draws}%` }}
                            />
                            <div
                              className="bg-neutral-800 dark:bg-neutral-600"
                              style={{ width: `${movePercent.black}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                            <span>W: {movePercent.white}%</span>
                            <span>D: {movePercent.draws}%</span>
                            <span>B: {movePercent.black}%</span>
                          </div>
                        </button>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-500 dark:text-neutral-400 text-sm">
                  No moves available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
