"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Tournament, TournamentPlayer } from "./tournaments";

interface TournamentsState {
  tournaments: Tournament[];
  myTournaments: string[];
  createTournament: (tournament: Omit<Tournament, 'id' | 'players' | 'pairings' | 'standings'>) => string;
  joinTournament: (tournamentId: string, player: TournamentPlayer) => void;
  updateTournament: (tournamentId: string, updates: Partial<Tournament>) => void;
  getTournament: (id: string) => Tournament | undefined;
}

export const useTournaments = create<TournamentsState>()(
  persist(
    (set, get) => ({
      tournaments: [],
      myTournaments: [],

      createTournament: (tournament) => {
        const id = `tournament-${Date.now()}`;
        const newTournament: Tournament = {
          ...tournament,
          id,
          players: [],
          pairings: [],
          standings: [],
        };

        set((state) => ({
          tournaments: [...state.tournaments, newTournament],
        }));

        return id;
      },

      joinTournament: (tournamentId, player) =>
        set((state) => {
          const tournament = state.tournaments.find(t => t.id === tournamentId);
          if (!tournament || tournament.players.length >= tournament.maxPlayers) {
            return state;
          }

          const updatedTournaments = state.tournaments.map(t =>
            t.id === tournamentId
              ? { ...t, players: [...t.players, player] }
              : t
          );

          return {
            tournaments: updatedTournaments,
            myTournaments: [...state.myTournaments, tournamentId],
          };
        }),

      updateTournament: (tournamentId, updates) =>
        set((state) => ({
          tournaments: state.tournaments.map(t =>
            t.id === tournamentId ? { ...t, ...updates } : t
          ),
        })),

      getTournament: (id) => {
        return get().tournaments.find(t => t.id === id);
      },
    }),
    {
      name: "chess-tournaments",
    }
  )
);
