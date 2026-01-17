"use client";

import { useState, useEffect } from "react";
import { Chess, Move } from "chess.js";
import { X, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Award, BarChart3, Sparkles, Download, Share2, Zap } from "lucide-react";
import { AnalysisEngine, MoveClassification, formatEval, getEvalColor } from "@/lib/analysis";

interface GameAnalysisProps {
  moves: Move[];
  playerColor: 'w' | 'b';
  result: 'win' | 'loss' | 'draw';
  onClose: () => void;
}

interface MoveAnalysis {
  move: Move;
  classification: MoveClassification;
  explanation: string;
  evalBefore?: number;
  evalAfter?: number;
  bestMove?: string;
}

export default function GameAnalysis({ moves, playerColor, result, onClose }: GameAnalysisProps) {
  const [analysis, setAnalysis] = useState<MoveAnalysis[]>([]);
  const [performanceElo, setPerformanceElo] = useState(0);
  const [analyzing, setAnalyzing] = useState(true);
  const [analysisDepth, setAnalysisDepth] = useState<'quick' | 'deep'>('quick');
  const [openingName, setOpeningName] = useState('');

  useEffect(() => {
    analyzeGame();
  }, [moves, analysisDepth]);

  const analyzeGame = async () => {
    setAnalyzing(true);
    
    const engine = new AnalysisEngine();
    const analyzed: MoveAnalysis[] = [];
    const game = new Chess();
    const depth = analysisDepth === 'quick' ? 12 : 18;
    
    let brilliant = 0;
    let great = 0;
    let best = 0;
    let excellent = 0;
    let good = 0;
    let inaccuracy = 0;
    let mistake = 0;
    let blunder = 0;
    let miss = 0;

    // Detect opening
    const firstMoves = moves.slice(0, 6).map(m => m.san).join(' ');
    if (firstMoves.includes('e4 e5 Nf3 Nc6 Bb5')) {
      setOpeningName('Ruy Lopez');
    } else if (firstMoves.includes('e4 e5 Nf3 Nc6 Bc4')) {
      setOpeningName('Italian Game');
    } else if (firstMoves.includes('e4 c5')) {
      setOpeningName('Sicilian Defense');
    } else if (firstMoves.includes('d4 d5 c4')) {
      setOpeningName('Queen\'s Gambit');
    } else if (firstMoves.includes('d4 Nf6 c4 g6')) {
      setOpeningName('King\'s Indian Defense');
    } else {
      setOpeningName('Various Opening');
    }

    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      
      // Only analyze player's moves
      if (move.color !== playerColor) {
        game.move(move);
        continue;
      }

      // Get evaluation before move
      const evalBefore = await engine.evaluatePosition(game.fen(), depth);
      
      // Make the move
      game.move(move);
      
      // Get evaluation after move
      const evalAfter = await engine.evaluatePosition(game.fen(), depth);

      if (!evalBefore || !evalAfter) {
        // Fallback to heuristic
        analyzed.push({
          move,
          classification: 'good',
          explanation: 'Move analysis unavailable',
        });
        good++;
        continue;
      }

      // Check if this was the best move
      const isBestMove = move.from + move.to === evalBefore.bestMove?.substring(0, 4);
      
      // Classify the move
      const classification = engine.classifyMove(
        evalBefore.eval,
        evalAfter.eval,
        true,
        isBestMove
      );

      // Update counters
      switch (classification) {
        case 'brilliant': brilliant++; break;
        case 'great': great++; break;
        case 'best': best++; break;
        case 'excellent': excellent++; break;
        case 'good': good++; break;
        case 'inaccuracy': inaccuracy++; break;
        case 'mistake': mistake++; break;
        case 'blunder': blunder++; break;
        case 'miss': miss++; break;
      }

      analyzed.push({
        move,
        classification,
        explanation: engine.getExplanation(classification, evalAfter.eval - evalBefore.eval, move),
        evalBefore: evalBefore.eval,
        evalAfter: evalAfter.eval,
        bestMove: evalBefore.bestMove,
      });
    }

    setAnalysis(analyzed);

    // Calculate performance ELO
    const totalMoves = analyzed.length;
    const score = 
      (brilliant * 10) + 
      (great * 7) +
      (best * 5) +
      (excellent * 4) + 
      (good * 3) + 
      (inaccuracy * 1) - 
      (mistake * 2) - 
      (blunder * 5) -
      (miss * 3);
    
    const avgScore = totalMoves > 0 ? score / totalMoves : 0;
    const baseElo = 1200;
    const calculatedElo = baseElo + (avgScore * 150);
    
    setPerformanceElo(Math.round(Math.max(400, Math.min(2800, calculatedElo))));
    setAnalyzing(false);
    
    engine.dispose();
  };

  const getEvaluationIcon = (classification: MoveClassification) => {
    switch (classification) {
      case 'brilliant': return <Sparkles className="w-5 h-5 text-cyan-500" />;
      case 'great': return <Zap className="w-5 h-5 text-green-500" />;
      case 'best': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'excellent': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'good': return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'inaccuracy': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'mistake': return <TrendingDown className="w-5 h-5 text-orange-500" />;
      case 'blunder': return <X className="w-5 h-5 text-red-500" />;
      case 'miss': return <AlertCircle className="w-5 h-5 text-purple-500" />;
    }
  };

  const getEvaluationColor = (classification: MoveClassification) => {
    switch (classification) {
      case 'brilliant': return 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-300 dark:border-cyan-800';
      case 'great': return 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800';
      case 'best': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'excellent': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'good': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'inaccuracy': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'mistake': return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      case 'blunder': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'miss': return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
      default: return 'bg-neutral-50 dark:bg-neutral-800';
    }
  };

  const moveStats = {
    brilliant: analysis.filter(a => a.classification === 'brilliant').length,
    great: analysis.filter(a => a.classification === 'great').length,
    best: analysis.filter(a => a.classification === 'best').length,
    excellent: analysis.filter(a => a.classification === 'excellent').length,
    good: analysis.filter(a => a.classification === 'good').length,
    inaccuracy: analysis.filter(a => a.classification === 'inaccuracy').length,
    mistake: analysis.filter(a => a.classification === 'mistake').length,
    blunder: analysis.filter(a => a.classification === 'blunder').length,
    miss: analysis.filter(a => a.classification === 'miss').length,
  };

  const downloadPGN = () => {
    const game = new Chess();
    moves.forEach(move => game.move(move));
    
    const pgn = game.pgn();
    const blob = new Blob([pgn], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chess-game-${Date.now()}.pgn`;
    a.click();
    URL.revokeObjectURL(url);
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

          {/* Opening Detection */}
          {openingName && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-2">
                <span className="text-lg">📖</span>
                <div>
                  <div className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">Opening Played</div>
                  <div className="font-bold text-emerald-900 dark:text-emerald-300">{openingName}</div>
                </div>
              </div>
            </div>
          )}

          {/* Move Quality Summary */}
          <div className="bg-white dark:bg-neutral-700 rounded-xl p-6 border border-neutral-200 dark:border-neutral-600">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  Move Quality
                </h3>
              </div>
              <button
                onClick={() => setAnalysisDepth(analysisDepth === 'quick' ? 'deep' : 'quick')}
                className="text-xs px-3 py-1 bg-neutral-100 dark:bg-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-500 rounded-full transition-colors text-neutral-700 dark:text-neutral-300"
              >
                {analyzing ? 'Analyzing...' : analysisDepth === 'quick' ? 'Quick Analysis' : 'Deep Analysis'}
              </button>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {moveStats.brilliant > 0 && (
                <div className="text-center p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{moveStats.brilliant}</div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">!!</div>
                </div>
              )}
              {moveStats.great > 0 && (
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{moveStats.great}</div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">!</div>
                </div>
              )}
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{moveStats.best + moveStats.excellent}</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">Best</div>
              </div>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{moveStats.good}</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">Good</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{moveStats.inaccuracy}</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">?!</div>
              </div>
              <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{moveStats.mistake}</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">?</div>
              </div>
              <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{moveStats.blunder}</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">??</div>
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
                  className={`flex items-start gap-3 p-3 rounded-lg border ${getEvaluationColor(item.classification)}`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getEvaluationIcon(item.classification)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-neutral-900 dark:text-white">
                        {Math.floor(index / 2) + 1}. {item.move.san}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded capitalize ${
                        item.classification === 'brilliant' ? 'bg-cyan-200 dark:bg-cyan-800 text-cyan-900 dark:text-cyan-200' :
                        item.classification === 'great' || item.classification === 'best' || item.classification === 'excellent' ? 'bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-200' :
                        item.classification === 'good' ? 'bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-200' :
                        item.classification === 'inaccuracy' ? 'bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-200' :
                        item.classification === 'mistake' ? 'bg-orange-200 dark:bg-orange-800 text-orange-900 dark:text-orange-200' :
                        item.classification === 'miss' ? 'bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-200' :
                        'bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-200'
                      }`}>
                        {item.classification === 'brilliant' && '!!'}
                        {item.classification === 'great' && '!'}
                        {item.classification === 'inaccuracy' && '?!'}
                        {item.classification === 'mistake' && '?'}
                        {item.classification === 'blunder' && '??'}
                        {' '}{item.classification}
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

          {/* Export Options */}
          <div className="flex gap-2">
            <button
              onClick={downloadPGN}
              className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-600 border-2 border-neutral-200 dark:border-neutral-600 text-neutral-900 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download PGN</span>
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Game link copied!');
              }}
              className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-600 border-2 border-neutral-200 dark:border-neutral-600 text-neutral-900 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
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
