"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { Users, Sparkles, Cpu, X } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [showBotMenu, setShowBotMenu] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [gameCode, setGameCode] = useState("");

  const createGame = () => {
    const gameId = nanoid(10);
    router.push(`/game/${gameId}`);
  };

  const joinGame = () => {
    if (gameCode.trim()) {
      router.push(`/game/${gameCode.trim()}`);
    }
  };

  const playVsBot = (elo: number) => {
    router.push(`/bot?elo=${elo}`);
  };

  const botLevels = [
    { name: "Beginner", elo: 800, description: "Learning the game" },
    { name: "Casual", elo: 1200, description: "Knows the basics" },
    { name: "Intermediate", elo: 1600, description: "Club player" },
    { name: "Advanced", elo: 2000, description: "Strong player" },
    { name: "Master", elo: 2400, description: "Chess master" },
    { name: "Grandmaster", elo: 2800, description: "World-class" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Logo/Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500 rounded-2xl mb-4">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold font-display text-neutral-900">
            Chess
          </h1>
          <p className="text-lg text-neutral-600 font-medium">
            Play online with friends or computer
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-8">
          <button
            onClick={createGame}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary-500/30"
          >
            <div className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              <span>Play with Friend</span>
            </div>
          </button>

          <button
            onClick={() => setShowBotMenu(!showBotMenu)}
            className="w-full bg-white hover:bg-neutral-50 text-neutral-900 font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] border-2 border-neutral-200"
          >
            <div className="flex items-center justify-center gap-2">
              <Cpu className="w-5 h-5" />
              <span>Play vs Computer</span>
            </div>
          </button>

          <button
            onClick={() => setShowJoinModal(true)}
            className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium py-3 px-6 rounded-xl transition-all duration-200"
          >
            Join with Code
          </button>
        </div>

        {/* Join Game Modal */}
        {showJoinModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold font-display text-neutral-900">
                  Join Game
                </h2>
                <button
                  onClick={() => {
                    setShowJoinModal(false);
                    setGameCode("");
                  }}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-neutral-600 mb-4">
                Enter the game code shared by your friend
              </p>
              
              <input
                type="text"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    joinGame();
                  }
                }}
                placeholder="Enter game code"
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none font-mono text-lg text-center"
                autoFocus
              />
              
              <button
                onClick={joinGame}
                disabled={!gameCode.trim()}
                className="w-full mt-4 bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-200 disabled:text-neutral-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
              >
                Join Game
              </button>
            </div>
          </div>
        )}

        {/* Bot Level Selection */}
        {showBotMenu && (
          <div className="pt-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <h3 className="text-sm font-semibold text-neutral-700 mb-3">
              Choose Difficulty
            </h3>
            {botLevels.map((level) => (
              <button
                key={level.elo}
                onClick={() => playVsBot(level.elo)}
                className="w-full bg-white hover:bg-primary-50 border-2 border-neutral-200 hover:border-primary-200 text-left py-3 px-4 rounded-lg transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-neutral-900 group-hover:text-primary-700">
                      {level.name}
                    </div>
                    <div className="text-xs text-neutral-500">
                      {level.description}
                    </div>
                  </div>
                  <div className="text-sm font-mono font-semibold text-neutral-400 group-hover:text-primary-600">
                    {level.elo}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
