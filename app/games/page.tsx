"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Home, Filter, Folder, Tag, Search, Plus, BookMarked, Brain } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/lib/useTheme";
import { useGameLibrary } from "@/lib/useGameLibrary";
import { GameTag } from "@/lib/gameLibrary";
import { format } from "date-fns";

export default function GamesPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const library = useGameLibrary();
  
  const [filterResult, setFilterResult] = useState<'all' | 'win' | 'loss' | 'draw'>('all');
  const [filterTag, setFilterTag] = useState<GameTag | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFolders, setShowFolders] = useState(false);

  const filteredGames = library.games.filter(game => {
    if (filterResult !== 'all' && game.result !== filterResult) return false;
    if (filterTag !== 'all' && !game.tags.includes(filterTag)) return false;
    if (searchQuery && !game.opening.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !game.opponent.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const dueCards = library.getDueCards();

  const tagColors: Record<GameTag, string> = {
    'good': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    'bad': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    'study-later': 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    'brilliant': 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400',
    'blunder-fest': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    'favorite': 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400',
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold font-display text-neutral-900 dark:text-white mb-2">
              Game Library
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              All your games saved and organized
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

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700 text-center">
            <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-1">
              {library.games.length}
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Total Games</div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700 text-center">
            <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-1">
              {library.folders.length}
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Folders</div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700 text-center">
            <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-1">
              {library.games.filter(g => g.studied).length}
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Studied</div>
          </div>

          <button
            onClick={() => router.push('/games/review')}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl p-4 text-white text-center transition-all hover:scale-105"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Brain className="w-6 h-6" />
              <span className="text-3xl font-bold">{dueCards.length}</span>
            </div>
            <div className="text-sm opacity-90">Cards Due</div>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700 mb-6">
          <div className="flex flex-wrap gap-3 items-center">
            <Search className="w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by opening or opponent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-[200px] bg-transparent border-none focus:outline-none text-neutral-900 dark:text-white placeholder-neutral-400"
            />

            <div className="flex gap-2">
              {(['all', 'win', 'loss', 'draw'] as const).map((result) => (
                <button
                  key={result}
                  onClick={() => setFilterResult(result)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filterResult === result
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                  }`}
                >
                  {result === 'all' ? 'All' : result.charAt(0).toUpperCase() + result.slice(1)}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowFolders(!showFolders)}
              className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg text-sm font-medium transition-colors"
            >
              <Folder className="w-4 h-4" />
              Folders
            </button>
          </div>
        </div>

        {/* Games List */}
        <div className="space-y-3">
          {filteredGames.length === 0 ? (
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-12 border border-neutral-200 dark:border-neutral-700 text-center">
              <BookMarked className="w-16 h-16 mx-auto mb-4 text-neutral-300 dark:text-neutral-600" />
              <p className="text-neutral-500 dark:text-neutral-400 mb-2">
                No games found
              </p>
              <p className="text-sm text-neutral-400 dark:text-neutral-500">
                Play some games to start building your library!
              </p>
            </div>
          ) : (
            filteredGames.map((game) => (
              <div
                key={game.id}
                className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all cursor-pointer"
                onClick={() => router.push(`/games/${game.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`px-3 py-1 rounded-lg font-semibold text-sm ${
                        game.result === 'win' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                        game.result === 'loss' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                        'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                      }`}>
                        {game.result.toUpperCase()}
                      </div>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        vs {game.opponent}
                      </span>
                      <span className="text-sm text-neutral-500 dark:text-neutral-500">
                        ({game.rating})
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                      <span>📖 {game.opening}</span>
                      <span>•</span>
                      <span>📅 {format(game.date, 'MMM d, yyyy')}</span>
                      <span>•</span>
                      <span>🎯 {game.accuracy}% accuracy</span>
                    </div>

                    {game.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {game.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`text-xs px-2 py-1 rounded-full font-medium ${tagColors[tag]}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        library.updateGame(game.id, { studied: !game.studied });
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        game.studied
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                          : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                      }`}
                      title={game.studied ? "Studied" : "Mark as studied"}
                    >
                      <BookMarked className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Empty State with Tips */}
        {library.games.length === 0 && (
          <div className="mt-8 bg-primary-50 dark:bg-primary-950/30 rounded-xl p-6 border border-primary-200 dark:border-primary-800">
            <h3 className="font-bold text-primary-900 dark:text-primary-300 mb-3">
              💡 Building Your Game Library
            </h3>
            <ul className="text-sm text-primary-800 dark:text-primary-200 space-y-2">
              <li>• All your games are automatically saved here</li>
              <li>• Tag games for easy organization</li>
              <li>• Create folders for collections</li>
              <li>• Review and study your mistakes</li>
              <li>• Track your improvement over time</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
