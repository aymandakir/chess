# Supabase Setup Guide

## Quick Setup Steps

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for it to initialize (~2 minutes)

### 2. Get Your Credentials
1. Go to Project Settings → API
2. Copy:
   - Project URL
   - `anon` public key

### 3. Configure Environment
Create `.env.local` in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Create Database Tables
1. Go to SQL Editor in Supabase Dashboard
2. Copy the SQL from `lib/supabase.ts` comments
3. Run the SQL to create tables
4. Enable Realtime for `games` and `players` tables

### 5. Enable Authentication
1. Go to Authentication → Providers
2. Enable:
   - Email (for email/password)
   - Google (optional, for OAuth)
   - Anonymous (for guest play)

### 6. Run Your App
```bash
npm run dev
```

## Features Enabled

Once Supabase is configured:

✅ Real-time multiplayer games
✅ User authentication
✅ Rating system
✅ Game history
✅ Matchmaking
✅ Live presence (who's online)
✅ Persistent user profiles

## Without Supabase

The app works without Supabase:
- ✅ Local games work
- ✅ Bot games work
- ✅ Puzzles work
- ✅ Learning system works
- ❌ Online multiplayer requires Supabase

## Security

- Row Level Security (RLS) enabled
- Players can only see/update their own games
- Secure authentication
- Real-time subscriptions protected
