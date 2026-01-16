"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { Copy, Users, Sparkles } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const createGame = () => {
    const gameId = nanoid(10);
    router.push(`/game/${gameId}`);
  };

  const joinGame = () => {
    const gameId = prompt("Enter game code:");
    if (gameId) {
      router.push(`/game/${gameId}`);
    }
  };

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
            Play online with friends
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-8">
          <button
            onClick={createGame}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary-500/30"
          >
            Create New Game
          </button>

          <button
            onClick={joinGame}
            className="w-full bg-white hover:bg-neutral-50 text-neutral-900 font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] border-2 border-neutral-200"
          >
            Join Game
          </button>
        </div>

        {/* Info */}
        <div className="pt-8 space-y-4">
          <div className="flex items-center justify-center gap-2 text-neutral-500 text-sm">
            <Users className="w-4 h-4" />
            <span>Share the game link to play with anyone</span>
          </div>
        </div>
      </div>
    </div>
  );
}
