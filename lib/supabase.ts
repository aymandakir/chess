"use client";

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

export const hasSupabase = !!supabase;

// Database types
export interface GameRecord {
  id: string;
  white_player: string;
  black_player: string;
  fen: string;
  moves: string[];
  time_control: string;
  white_time: number;
  black_time: number;
  status: 'waiting' | 'active' | 'completed';
  result?: 'white' | 'black' | 'draw';
  created_at: string;
  updated_at: string;
}

export interface Player {
  id: string;
  username: string;
  rating: number;
  online: boolean;
  last_seen: string;
}

// SQL Schema for Supabase (copy to SQL Editor in Supabase Dashboard):
/*
-- Enable realtime
alter publication supabase_realtime add table games;
alter publication supabase_realtime add table players;

-- Games table
create table games (
  id uuid primary key default uuid_generate_v4(),
  white_player uuid references auth.users,
  black_player uuid references auth.users,
  fen text not null,
  moves jsonb default '[]'::jsonb,
  time_control text not null,
  white_time integer not null,
  black_time integer not null,
  status text not null check (status in ('waiting', 'active', 'completed')),
  result text check (result in ('white', 'black', 'draw')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Players table
create table players (
  id uuid primary key references auth.users,
  username text unique not null,
  rating integer default 1200,
  puzzle_rating integer default 1200,
  online boolean default false,
  last_seen timestamp with time zone default now()
);

-- Indexes
create index idx_games_status on games(status);
create index idx_games_players on games(white_player, black_player);
create index idx_players_online on players(online);
create index idx_players_rating on players(rating);

-- RLS Policies
alter table games enable row level security;
alter table players enable row level security;

create policy "Games are viewable by players"
  on games for select
  using (auth.uid() = white_player or auth.uid() = black_player);

create policy "Players can update their games"
  on games for update
  using (auth.uid() = white_player or auth.uid() = black_player);

create policy "Players can create games"
  on games for insert
  with check (auth.uid() = white_player or auth.uid() = black_player);

create policy "Players are viewable by anyone"
  on players for select
  using (true);

create policy "Players can update themselves"
  on players for update
  using (auth.uid() = id);
*/

