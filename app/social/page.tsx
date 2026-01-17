"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Home, Users, MessageCircle, Trophy, UserPlus, Clock, Swords } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/lib/useTheme";
import { useSocial } from "@/lib/useSocial";
import { generateMockFriends, generateActivityFeed, popularClubs } from "@/lib/social";
import { formatDistanceToNow } from "date-fns";

export default function SocialPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const social = useSocial();
  
  const [activeTab, setActiveTab] = useState<'friends' | 'activity' | 'clubs'>('friends');
  
  // Mock data (replace with real data when Supabase is connected)
  const friends = social.friends.length > 0 ? social.friends : generateMockFriends(8);
  const activities = generateActivityFeed(15);
  const onlineFriends = friends.filter(f => f.isOnline);

  const tabs = [
    { id: 'friends' as const, label: 'Friends', icon: Users, count: friends.length },
    { id: 'activity' as const, label: 'Activity', icon: MessageCircle, count: activities.length },
    { id: 'clubs' as const, label: 'Clubs', icon: Trophy, count: social.clubs.length },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold font-display text-neutral-900 dark:text-white mb-2">
              Social
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Connect with friends and join the community
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

        {/* Online Friends Banner */}
        {onlineFriends.length > 0 && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 mb-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {onlineFriends.slice(0, 3).map((friend, i) => (
                    <div
                      key={friend.id}
                      className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border-2 border-white font-bold"
                    >
                      {friend.username[0]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="font-semibold">
                    {onlineFriends.length} {onlineFriends.length === 1 ? 'friend' : 'friends'} online
                  </div>
                  <div className="text-sm opacity-90">Ready to play!</div>
                </div>
              </div>
              <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-semibold transition-colors">
                Challenge
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white dark:bg-neutral-800 rounded-xl p-2 border border-neutral-200 dark:border-neutral-700">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === tab.id
                    ? 'bg-white/20'
                    : 'bg-neutral-200 dark:bg-neutral-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        {activeTab === 'friends' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Your Friends</h2>
              <button className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                <UserPlus className="w-4 h-4" />
                Add Friend
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-xl font-bold text-primary-700 dark:text-primary-400">
                          {friend.username[0]}
                        </div>
                        {friend.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-neutral-800"></div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-neutral-900 dark:text-white">
                          {friend.username}
                        </div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                          Rating: {friend.rating}
                        </div>
                        {!friend.isOnline && friend.lastPlayed && (
                          <div className="text-xs text-neutral-500 dark:text-neutral-500">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {formatDistanceToNow(friend.lastPlayed, { addSuffix: true })}
                          </div>
                        )}
                      </div>
                    </div>
                    {friend.isOnline && (
                      <button className="flex items-center gap-1 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
                        <Swords className="w-3 h-3" />
                        Challenge
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Activity Feed</h2>
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="text-neutral-900 dark:text-white">
                        <span className="font-semibold">{activity.username}</span>{' '}
                        <span className="text-neutral-600 dark:text-neutral-400">{activity.content}</span>
                      </p>
                      <div className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'clubs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Chess Clubs</h2>
              <button className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                <Users className="w-4 h-4" />
                Create Club
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {popularClubs.map((club) => (
                <div
                  key={club.id}
                  className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{club.icon}</div>
                      <div>
                        <h3 className="font-bold text-lg text-neutral-900 dark:text-white">
                          {club.name}
                        </h3>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                          Avg. Rating: {club.rating}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                    {club.description}
                  </p>

                  <button
                    onClick={() => social.joinClub(club.id)}
                    disabled={social.clubs.includes(club.id)}
                    className={`w-full font-semibold py-2 px-4 rounded-lg transition-all ${
                      social.clubs.includes(club.id)
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-not-allowed'
                        : 'bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 text-white hover:scale-105'
                    }`}
                  >
                    {social.clubs.includes(club.id) ? 'Joined ✓' : 'Join Club'}
                  </button>
                </div>
              ))}
            </div>

            {/* My Clubs */}
            {social.clubs.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                  My Clubs
                </h3>
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm opacity-90 mb-1">Active in</div>
                      <div className="text-3xl font-bold">{social.clubs.length}</div>
                      <div className="text-sm opacity-90 mt-1">
                        {social.clubs.length === 1 ? 'club' : 'clubs'}
                      </div>
                    </div>
                    <Trophy className="w-16 h-16 opacity-20" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
