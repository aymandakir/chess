"use client";

import { useState, useEffect } from "react";
import { Chess, Move } from "chess.js";
import { X, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Award, BarChart3 } from "lucide-react";

interface GameAnalysisProps {
  moves: Move[];
  playerColor: 'w' | 'b';
  result: 'win' | 'loss' | 'draw';
  onClose: () => void;
}

interface MoveAnalysis {
  move: Move;
  evaluation: 'excellent' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';
  explanation: string;
}

export default function GameAnalysis({ moves, playerColor, result, onClose }: GameAnalysisProps) {
  const [analysis, setAnalysis] = useState<MoveAnalysis[]>([]);
  const [performanceElo, setPerformanceElo] = useState(0);
  const [analyzing, setAnalyzing] = useState(true);

  useEffect(() => {
    // Analyze the game
    analyzeGame();
  }, [moves]);

  const analyzeGame = () => {
    setAnalyzing(true);
    
    // Simple heuristic analysis (can be enhanced with Stockfish evaluation)
    const analyzed: MoveAnalysis[] = [];
    const game = new Chess();
    
    let blunders = 0;
    let mistakes = 0;
    let inaccuracies = 0;
    let goodMoves = 0;
    let excellentMoves = 0;

    moves.forEach((move, index) => {
      // Only analyze player's moves
      if (move.color !== playerColor) {
        game.move(move);
        return;
      }

      let evaluation: 'excellent' | 'good' | 'inaccuracy' | 'mistake' | 'blunder' = 'good';
      let explanation = '';

      // Check if move was a capture
      if (move.captured) {
        // Capturing is generally good
        evaluation = 'good';
        explanation = 'Captured opponent\'s piece';
        goodMoves++;
      }
      // Check if move creates check
      else if (move.san.includes('+')) {
        evaluation = 'good';
        explanation = 'Put opponent in check';
        goodMoves++;
      }
      // Check if move was castling
      else if (move.san === 'O-O' || move.san === 'O-O-O') {
        if (index < 10) {
          evaluation = 'excellent';
          explanation = 'Good king safety - castled early';
          excellentMoves++;
        } else {
          evaluation = 'good';
          explanation = 'Improved king safety';
          goodMoves++;
        }
      }
      // Check for center control in opening
      else if (index < 10 && ['e4', 'd4', 'e5', 'd5'].includes(move.to)) {
        evaluation = 'excellent';
        explanation = 'Controlled the center';
        excellentMoves++;
      }
      // Check if moving same piece multiple times in opening
      else if (index < 10) {
        const previousMoves = moves.slice(0, index).filter(m => m.color === playerColor);
        const samePieceMoves = previousMoves.filter(m => m.piece === move.piece).length;
        
        if (samePieceMoves >= 2) {
          evaluation = 'inaccuracy';
          explanation = 'Moving the same piece multiple times in opening';
          inaccuracies++;
        } else {
          evaluation = 'good';
          explanation = 'Developing pieces';
          goodMoves++;
        }
      } else {
        evaluation = 'good';
        explanation = 'Reasonable move';
        goodMoves++;
      }

      game.move(move);

      analyzed.push({
        move,
        evaluation,
        explanation,
      });
    });

    setAnalysis(analyzed);

    // Calculate performance ELO based on move quality
    const totalMoves = analyzed.length;
    const score = 
      (excellentMoves * 5) + 
      (goodMoves * 3) + 
      (inaccuracies * 1) - 
      (mistakes * 2) - 
      (blunders * 5);
    
    const avgScore = totalMoves > 0 ? score / totalMoves : 0;
    const baseElo = 1200;
    const calculatedElo = baseElo + (avgScore * 200);
    
    setPerformanceElo(Math.round(Math.max(400, Math.min(2800, calculatedElo))));
    setAnalyzing(false);
  };

  const getEvaluationIcon = (evaluation: string) => {
    switch (evaluation) {
      case 'excellent': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'good': return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'inaccuracy': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'mistake': return <TrendingDown className="w-5 h-5 text-orange-500" />;
      case 'blunder': return <X className="w-5 h-5 text-red-500" />;
    }
  };

  const getEvaluationColor = (evaluation: string) => {
    switch (evaluation) {
      case 'excellent': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'good': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'inaccuracy': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'mistake': return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      case 'blunder': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default: return 'bg-neutral-50 dark:bg-neutral-800';
    }
  };

  const moveStats = {
    excellent: analysis.filter(a => a.evaluation === 'excellent').length,
    good: analysis.filter(a => a.evaluation === 'good').length,
    inaccuracy: analysis.filter(a => a.evaluation === 'inaccuracy').length,
    mistake: analysis.filter(a => a.evaluation === 'mistake').length,
    blunder: analysis.filter(a => a.evaluation === 'blunder').length,
  };

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl w-full max-w-3xl shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
          <div>
            <h2 className="text-3xl font-bold font-display text-neutral-900 dark:text-white">
              Game Analysis
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              Learn from your game and improve
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Performance Rating */}
          <div className={`rounded-xl p-6 border-2 ${
            result === 'win' 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800' 
              : result === 'loss'
              ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800'
              : 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-800'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-6 h-6 text-amber-500" />
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                    Performance Rating
                  </h3>
                </div>
                <p className="text-3xl font-bold font-mono text-neutral-900 dark:text-white">
                  {performanceElo} ELO
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  {performanceElo < 1000 ? 'Keep practicing!' :
                   performanceElo < 1500 ? 'Good performance!' :
                   performanceElo < 2000 ? 'Strong play!' :
                   'Excellent performance!'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Result</div>
                <div className={`text-2xl font-bold ${
                  result === 'win' ? 'text-green-600 dark:text-green-400' :
                  result === 'loss' ? 'text-red-600 dark:text-red-400' :
                  'text-blue-600 dark:text-blue-400'
                }`}>
                  {result === 'win' ? '🏆 Victory' : result === 'loss' ? '💔 Defeat' : '🤝 Draw'}
                </div>
              </div>
            </div>
          </div>

          {/* Move Quality Summary */}
          <div className="bg-white dark:bg-neutral-700 rounded-xl p-6 border border-neutral-200 dark:border-neutral-600">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                Move Quality Breakdown
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{moveStats.excellent}</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">Excellent</div>
              </div>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{moveStats.good}</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">Good</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{moveStats.inaccuracy}</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">Inaccuracy</div>
              </div>
              <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{moveStats.mistake}</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">Mistake</div>
              </div>
              <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{moveStats.blunder}</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">Blunder</div>
              </div>
            </div>
          </div>

          {/* Key Improvements */}
          <div className="bg-primary-50 dark:bg-primary-950/30 rounded-xl p-6 border border-primary-200 dark:border-primary-800">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
              💡 Key Areas to Improve
            </h3>
            <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
              {moveStats.inaccuracy + moveStats.mistake + moveStats.blunder > 5 && (
                <li>• Focus on calculating before moving - take your time</li>
              )}
              {moveStats.blunder > 0 && (
                <li>• Watch out for hanging pieces - check all opponent threats</li>
              )}
              {analysis.filter(a => a.explanation.includes('same piece')).length > 0 && (
                <li>• Develop all pieces before moving the same one twice</li>
              )}
              {analysis.filter(a => a.move.san === 'O-O' || a.move.san === 'O-O-O').length === 0 && (
                <li>• Castle early to protect your king</li>
              )}
              <li>• Study tactical patterns to spot opportunities</li>
              <li>• Review the move-by-move analysis below</li>
            </ul>
          </div>

          {/* Move-by-Move Analysis */}
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
              📝 Your Moves Analysis
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {analysis.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${getEvaluationColor(item.evaluation)}`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getEvaluationIcon(item.evaluation)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-neutral-900 dark:text-white">
                        {Math.floor(index / 2) + 1}. {item.move.san}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded capitalize ${
                        item.evaluation === 'excellent' ? 'bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-200' :
                        item.evaluation === 'good' ? 'bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-200' :
                        item.evaluation === 'inaccuracy' ? 'bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-200' :
                        item.evaluation === 'mistake' ? 'bg-orange-200 dark:bg-orange-800 text-orange-900 dark:text-orange-200' :
                        'bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-200'
                      }`}>
                        {item.evaluation}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">
                      {item.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105"
            >
              Play Again
            </button>
            <a
              href="/learn"
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 text-center"
            >
              Go to Lessons
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
