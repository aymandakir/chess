"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Friend, Challenge, UserProfile } from "./social";

interface SocialState {
  currentUser: Partial<UserProfile> | null;
  friends: Friend[];
  challenges: Challenge[];
  clubs: string[];
  
  setUser: (user: Partial<UserProfile>) => void;
  addFriend: (friend: Friend) => void;
  removeFriend: (friendId: string) => void;
  sendChallenge: (challenge: Omit<Challenge, 'id' | 'status' | 'createdAt'>) => void;
  respondToChallenge: (challengeId: string, accept: boolean) => void;
  joinClub: (clubId: string) => void;
  leaveClub: (clubId: string) => void;
}

export const useSocial = create<SocialState>()(
  persist(
    (set) => ({
      currentUser: null,
      friends: [],
      challenges: [],
      clubs: [],

      setUser: (user) =>
        set({ currentUser: user }),

      addFriend: (friend) =>
        set((state) => ({
          friends: [...state.friends, friend],
        })),

      removeFriend: (friendId) =>
        set((state) => ({
          friends: state.friends.filter(f => f.id !== friendId),
        })),

      sendChallenge: (challenge) =>
        set((state) => ({
          challenges: [
            ...state.challenges,
            {
              ...challenge,
              id: Date.now().toString(),
              status: 'pending',
              createdAt: Date.now(),
            },
          ],
        })),

      respondToChallenge: (challengeId, accept) =>
        set((state) => ({
          challenges: state.challenges.map(c =>
            c.id === challengeId
              ? { ...c, status: accept ? 'accepted' : 'declined' }
              : c
          ),
        })),

      joinClub: (clubId) =>
        set((state) => ({
          clubs: [...state.clubs, clubId],
        })),

      leaveClub: (clubId) =>
        set((state) => ({
          clubs: state.clubs.filter(id => id !== clubId),
        })),
    }),
    {
      name: "chess-social",
    }
  )
);
