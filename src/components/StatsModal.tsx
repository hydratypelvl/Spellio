"use client";

import { useEffect, useState } from "react";

interface Stats {
  totalGames: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: Record<string, number>;
  totalTime: number;
}

interface Game {
  id: string;
  word: string;
  attempts: number;
  won: boolean;
  time: number;
  createdAt: string;
}

interface StatsModalProps {
  onClose: () => void;
}

export default function StatsModal({ onClose }: StatsModalProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentGames, setRecentGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setRecentGames(data.recentGames);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const accuracy = stats && stats.totalGames > 0
    ? Math.round((stats.wins / stats.totalGames) * 100)
    : 0;

  const avgTime = stats && stats.wins > 0
    ? Math.round(stats.totalTime / stats.wins)
    : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const maxDistribution = stats
    ? Math.max(...Object.values(stats.guessDistribution as Record<string, number>), 1)
    : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black dark:text-white">Statistics</h2>
          <button
            onClick={onClose}
            className="p-1 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-zinc-500">Loading...</div>
        ) : stats ? (
          <>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-black dark:text-white">{stats.totalGames}</div>
                <div className="text-xs text-zinc-500">Played</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-black dark:text-white">{accuracy}%</div>
                <div className="text-xs text-zinc-500">Win %</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-black dark:text-white">{stats.currentStreak}</div>
                <div className="text-xs text-zinc-500">Current Streak</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-black dark:text-white">{stats.maxStreak}</div>
                <div className="text-xs text-zinc-500">Max Streak</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-2 text-zinc-700 dark:text-zinc-300">Guess Distribution</h3>
              <div className="space-y-1">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div key={num} className="flex items-center gap-2">
                    <span className="w-4 text-sm text-zinc-600 dark:text-zinc-400">{num}</span>
                    <div className="flex-1 h-6 bg-zinc-100 dark:bg-zinc-700 rounded">
                      <div
                        className="h-full flex items-center justify-end px-2 bg-green-500 rounded text-xs font-bold text-white"
                        style={{
                          width: `${((stats.guessDistribution[num] || 0) / maxDistribution) * 100}%`,
                          minWidth: stats.guessDistribution[num] ? "24px" : "0",
                        }}
                      >
                        {stats.guessDistribution[num] || ""}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2 text-zinc-700 dark:text-zinc-300">Average Time</h3>
              <div className="text-2xl font-bold text-black dark:text-white">{formatTime(avgTime)}</div>
            </div>

            {recentGames.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2 text-zinc-700 dark:text-zinc-300">Recent Games</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {recentGames.map((game) => (
                    <div
                      key={game.id}
                      className="flex items-center justify-between p-2 bg-zinc-50 dark:bg-zinc-700 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-8 h-8 flex items-center justify-center rounded text-sm font-bold ${
                          game.won ? "bg-green-500 text-white" : "bg-zinc-300 dark:bg-zinc-600"
                        }`}>
                          {game.attempts}
                        </span>
                        <span className="font-medium uppercase text-black dark:text-white">{game.word}</span>
                      </div>
                      <span className="text-xs text-zinc-500">{formatTime(game.time)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-zinc-500">No stats available</div>
        )}
      </div>
    </div>
  );
}
