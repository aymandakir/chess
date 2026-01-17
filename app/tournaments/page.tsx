"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Home, Plus, Trophy, Clock, Users, Star, Calendar } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/lib/useTheme";
import { useTournaments } from "@/lib/useTournaments";
import { dailyTournaments, tournamentTypes, timeControls, formatTimeControl } from "@/lib/tournaments";
import { format } from 'date-fns';

export default function TournamentsPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { tournaments, myTournaments } = useTournaments();
  const [showCreate, setShowCreate] = useState(false);

  const allTournaments = [...dailyTournaments.map(t => ({
    ...t,
    id: t.name.toLowerCase().replace(/\s+/g, '-'),
    players: [],
    pairings: [],
    standings: [],
  })), ...tournaments];

  const upcomingTournaments = allTournaments.filter(t => t.status === 'upcoming');
  const activeTournaments = allTournaments.filter(t => t.status === 'in-progress');
  const myActiveTournaments = allTournaments.filter(t => myTournaments.includes(t.id));

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold font-display text-neutral-900 dark:text-white mb-2">
              Tournaments
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Compete in organized events and climb the leaderboard
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 text-white rounded-lg transition-colors font-semibold"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Create</span>
            </button>
            <ThemeToggle />
            <a
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
            >
              <Home className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Tournament Types Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {tournamentTypes.map((type) => (
            <div
              key={type.id}
              className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 text-center"
            >
              <div className="text-4xl mb-2">{type.icon}</div>
              <h3 className="font-bold text-neutral-900 dark:text-white mb-1">
                {type.name}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                {type.description}
              </p>
              <div className="text-xs text-neutral-500 dark:text-neutral-500">
                {type.rounds}
              </div>
            </div>
          ))}
        </div>

        {/* My Tournaments */}
        {myActiveTournaments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold font-display text-neutral-900 dark:text-white mb-4">
              My Tournaments
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {myActiveTournaments.map((tournament) => (
                <button
                  key={tournament.id}
                  onClick={() => router.push(`/tournaments/${tournament.id}`)}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl p-6 text-left hover:from-amber-600 hover:to-orange-600 transition-all duration-200 hover:scale-105"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Trophy className="w-8 h-8" />
                    <span className="text-sm opacity-90">
                      {tournament.status === 'in-progress' ? '🟢 Live' : '⏰ Starting Soon'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{tournament.name}</h3>
                  <div className="flex items-center gap-4 text-sm opacity-90">
                    <span>⏱️ {formatTimeControl(tournament.timeControl)}</span>
                    <span>👥 {tournament.players.length}/{tournament.maxPlayers}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Daily Tournaments */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold font-display text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Daily & Weekly Events
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {dailyTournaments.map((tournament, index) => (
              <div
                key={index}
                className="bg-white dark:bg-neutral-800 rounded-xl p-6 border-2 border-neutral-200 dark:border-neutral-700 hover:border-primary-400 dark:hover:border-primary-600 transition-all cursor-pointer"
                onClick={() => router.push('/tournaments/create')}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{tournamentTypes.find(t => t.id === tournament.type)?.icon}</div>
                  <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-2 py-1 rounded-full font-semibold">
                    {formatTimeControl(tournament.timeControl)}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-2">
                  {tournament.name}
                </h3>

                <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Starts {format(tournament.startTime, 'h:mm a')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Max {tournament.maxPlayers} players</span>
                  </div>
                  {tournament.prize && (
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      <span className="font-semibold text-amber-600 dark:text-amber-400">
                        {tournament.prize.title || `+${tournament.prize.ratingBoost} ELO`}
                      </span>
                    </div>
                  )}
                </div>

                <button className="w-full bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                  Join Tournament
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Active Tournaments */}
        {activeTournaments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold font-display text-neutral-900 dark:text-white mb-4">
              Live Tournaments
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {activeTournaments.map((tournament) => (
                <button
                  key={tournament.id}
                  onClick={() => router.push(`/tournaments/${tournament.id}`)}
                  className="bg-white dark:bg-neutral-800 rounded-xl p-6 border-2 border-green-300 dark:border-green-800 text-left hover:border-green-400 dark:hover:border-green-700 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">LIVE</span>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                    {tournament.name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                    <span>⏱️ {formatTimeControl(tournament.timeControl)}</span>
                    <span>👥 {tournament.players.length} players</span>
                    <span>Round {tournament.currentRound}/{tournament.totalRounds}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
          <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Tournament Rewards
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="font-semibold text-neutral-900 dark:text-white mb-2">🏆 Champion</div>
              <ul className="text-neutral-600 dark:text-neutral-400 space-y-1">
                <li>• Title badge</li>
                <li>• +50 rating boost</li>
                <li>• Trophy on profile</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-neutral-900 dark:text-white mb-2">🥈 Runner-up</div>
              <ul className="text-neutral-600 dark:text-neutral-400 space-y-1">
                <li>• Silver badge</li>
                <li>• +25 rating boost</li>
                <li>• Honorable mention</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-neutral-900 dark:text-white mb-2">🥉 Top 3</div>
              <ul className="text-neutral-600 dark:text-neutral-400 space-y-1">
                <li>• Bronze badge</li>
                <li>• +10 rating boost</li>
                <li>• Recognition</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
