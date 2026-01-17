"use client";

import { Home, TrendingUp, Target, Award, Calendar, Clock, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/lib/useTheme";
import { useGameHistory } from "@/lib/useGameHistory";
import { usePuzzleStats } from "@/lib/usePuzzleStats";
import { useProgress } from "@/lib/useProgress";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function StatsPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const gameHistory = useGameHistory();
  const puzzleStats = usePuzzleStats();
  const learningProgress = useProgress();
  
  const stats = gameHistory.getStats();

  // Prepare chart data
  const ratingHistory = gameHistory.games
    .slice(0, 20)
    .reverse()
    .map((game, index) => ({
      game: index + 1,
      rating: game.rating,
    }));

  const winLossData = [
    { name: 'Wins', value: stats.wins, color: '#10b981' },
    { name: 'Draws', value: stats.draws, color: '#6b7280' },
    { name: 'Losses', value: stats.losses, color: '#ef4444' },
  ];

  const colorPerformance = [
    { 
      color: 'White', 
      wins: gameHistory.games.filter(g => g.playerColor === 'w' && g.result === 'win').length,
      draws: gameHistory.games.filter(g => g.playerColor === 'w' && g.result === 'draw').length,
      losses: gameHistory.games.filter(g => g.playerColor === 'w' && g.result === 'loss').length,
    },
    { 
      color: 'Black',
      wins: gameHistory.games.filter(g => g.playerColor === 'b' && g.result === 'win').length,
      draws: gameHistory.games.filter(g => g.playerColor === 'b' && g.result === 'draw').length,
      losses: gameHistory.games.filter(g => g.playerColor === 'b' && g.result === 'loss').length,
    },
  ];

  const topOpenings = Object.entries(stats.openingStats)
    .map(([name, data]: [string, any]) => ({
      name,
      games: data.games,
      winRate: Math.round(((data.wins + data.draws * 0.5) / data.games) * 100),
    }))
    .sort((a, b) => b.games - a.games)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold font-display text-neutral-900 dark:text-white mb-2">
              Your Statistics
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Track your progress and improvement
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

        {/* Overview Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Games Played</div>
            </div>
            <div className="text-3xl font-bold text-neutral-900 dark:text-white">
              {stats.totalGames}
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Win Rate</div>
            </div>
            <div className="text-3xl font-bold text-neutral-900 dark:text-white">
              {stats.winRate}%
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {stats.wins}W {stats.draws}D {stats.losses}L
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Current Rating</div>
            </div>
            <div className="text-3xl font-bold text-neutral-900 dark:text-white">
              {stats.currentRating}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Peak: {stats.peakRating}
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Puzzles</div>
            </div>
            <div className="text-3xl font-bold text-neutral-900 dark:text-white">
              {puzzleStats.totalSolved}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Rating: {puzzleStats.puzzleRating}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Rating Progress Chart */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
            <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-4">
              Rating Progress
            </h3>
            {ratingHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={ratingHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#404040' : '#e5e5e5'} />
                  <XAxis 
                    dataKey="game" 
                    stroke={isDark ? '#a3a3a3' : '#737373'}
                    label={{ value: 'Game #', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    stroke={isDark ? '#a3a3a3' : '#737373'}
                    label={{ value: 'Rating', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#262626' : '#ffffff',
                      border: `1px solid ${isDark ? '#404040' : '#e5e5e5'}`,
                      borderRadius: '8px',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rating" 
                    stroke="#0ea5e9" 
                    strokeWidth={2}
                    dot={{ fill: '#0ea5e9', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                No games played yet
              </div>
            )}
          </div>

          {/* Win/Loss Distribution */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
            <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-4">
              Game Results
            </h3>
            {stats.totalGames > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={winLossData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {winLossData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                No games played yet
              </div>
            )}
          </div>
        </div>

        {/* Performance by Color */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
            <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-4">
              Performance by Color
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={colorPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#404040' : '#e5e5e5'} />
                <XAxis dataKey="color" stroke={isDark ? '#a3a3a3' : '#737373'} />
                <YAxis stroke={isDark ? '#a3a3a3' : '#737373'} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#262626' : '#ffffff',
                    border: `1px solid ${isDark ? '#404040' : '#e5e5e5'}`,
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="wins" fill="#10b981" name="Wins" />
                <Bar dataKey="draws" fill="#6b7280" name="Draws" />
                <Bar dataKey="losses" fill="#ef4444" name="Losses" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Openings */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
            <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-4">
              Most Played Openings
            </h3>
            {topOpenings.length > 0 ? (
              <div className="space-y-3">
                {topOpenings.map((opening, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-neutral-900 dark:text-white text-sm">
                        {opening.name}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        {opening.games} games
                      </div>
                    </div>
                    <div className={`font-bold text-lg ${
                      opening.winRate >= 60 ? 'text-green-600 dark:text-green-400' :
                      opening.winRate >= 45 ? 'text-blue-600 dark:text-blue-400' :
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {opening.winRate}%
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                No opening data yet
              </div>
            )}
          </div>
        </div>

        {/* All Ratings Overview */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 rounded-2xl p-8 text-white mb-8 shadow-lg">
          <h3 className="text-2xl font-bold font-display mb-6">All Ratings</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm opacity-90 mb-1">Game Rating</div>
              <div className="text-4xl font-bold">{stats.currentRating}</div>
              <div className="text-sm opacity-75 mt-1">Peak: {stats.peakRating}</div>
            </div>
            <div>
              <div className="text-sm opacity-90 mb-1">Puzzle Rating</div>
              <div className="text-4xl font-bold">{puzzleStats.puzzleRating}</div>
              <div className="text-sm opacity-75 mt-1">{puzzleStats.totalSolved} solved</div>
            </div>
            <div>
              <div className="text-sm opacity-90 mb-1">Learning ELO</div>
              <div className="text-4xl font-bold">{learningProgress.currentElo}</div>
              <div className="text-sm opacity-75 mt-1">{learningProgress.completedLessons.length} lessons</div>
            </div>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-800">
            <h3 className="font-bold text-lg text-green-900 dark:text-green-300 mb-4 flex items-center gap-2">
              <span>💪</span> Your Strengths
            </h3>
            <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
              {stats.winRate >= 60 && <li>• Excellent win rate - very consistent play</li>}
              {puzzleStats.currentStreak >= 5 && <li>• Strong puzzle streak - good pattern recognition</li>}
              {learningProgress.completedLessons.length >= 5 && <li>• Dedicated learner - completed multiple lessons</li>}
              {stats.avgAccuracy >= 85 && <li>• High accuracy - making few mistakes</li>}
              {stats.totalGames === 0 && <li>• Play some games to discover your strengths!</li>}
            </ul>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6 border-2 border-orange-200 dark:border-orange-800">
            <h3 className="font-bold text-lg text-orange-900 dark:text-orange-300 mb-4 flex items-center gap-2">
              <span>🎯</span> Areas to Improve
            </h3>
            <ul className="space-y-2 text-sm text-orange-800 dark:text-orange-200">
              {stats.winRate < 40 && <li>• Focus on reducing mistakes in your games</li>}
              {puzzleStats.totalSolved < 10 && <li>• Solve more puzzles to improve tactics</li>}
              {learningProgress.completedLessons.length < 3 && <li>• Complete more lessons to build foundations</li>}
              {stats.avgAccuracy < 70 && <li>• Work on calculation - think before moving</li>}
              {stats.totalGames === 0 && <li>• Start playing to identify weak areas</li>}
              <li>• Consistent practice leads to improvement</li>
            </ul>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
          <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-4">
            Quick Stats
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Puzzle Stats</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-700 dark:text-neutral-300">Success Rate:</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {puzzleStats.totalAttempted > 0 
                      ? Math.round((puzzleStats.totalSolved / puzzleStats.totalAttempted) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-700 dark:text-neutral-300">Best Streak:</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{puzzleStats.bestStreak}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Learning Progress</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-700 dark:text-neutral-300">Lessons Done:</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {learningProgress.completedLessons.length}/14
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-700 dark:text-neutral-300">Learning ELO:</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {learningProgress.currentElo}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Average Accuracy</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-700 dark:text-neutral-300">Per Game:</span>
                  <span className={`font-semibold ${
                    stats.avgAccuracy >= 85 ? 'text-green-600 dark:text-green-400' :
                    stats.avgAccuracy >= 70 ? 'text-blue-600 dark:text-blue-400' :
                    'text-orange-600 dark:text-orange-400'
                  }`}>
                    {stats.avgAccuracy}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-primary-50 dark:bg-primary-950/30 rounded-xl p-6 border border-primary-200 dark:border-primary-800">
          <h3 className="font-bold text-lg text-primary-900 dark:text-primary-300 mb-4">
            💡 Recommendations
          </h3>
          <div className="space-y-3">
            {stats.totalGames < 10 && (
              <div className="flex items-start gap-3">
                <span>🎮</span>
                <div className="text-sm text-primary-800 dark:text-primary-200">
                  <strong>Play more games</strong> to build experience and get better statistics
                </div>
              </div>
            )}
            {puzzleStats.totalSolved < 20 && (
              <div className="flex items-start gap-3">
                <span>🧩</span>
                <div className="text-sm text-primary-800 dark:text-primary-200">
                  <strong>Solve puzzles daily</strong> to improve your tactical vision
                </div>
              </div>
            )}
            {learningProgress.completedLessons.length < 5 && (
              <div className="flex items-start gap-3">
                <span>🎓</span>
                <div className="text-sm text-primary-800 dark:text-primary-200">
                  <strong>Complete more lessons</strong> to unlock advanced content
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <span>📊</span>
              <div className="text-sm text-primary-800 dark:text-primary-200">
                <strong>Review your games</strong> using the analysis feature after each match
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
