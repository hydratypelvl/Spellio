"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface LeaderboardPlayer {
  userId: string;
  username: string;
  name: string | null;
  image: string | null;
  totalGames: number;
  wins: number;
  winRate: number;
  currentStreak: number;
  maxStreak: number;
  avgTime: number;
}

interface LeaderboardModalProps {
  onClose: () => void;
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function LeaderboardModal({ onClose }: LeaderboardModalProps) {
  const { data: session } = useSession();
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<"wins" | "winRate" | "maxStreak">("wins");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/leaderboard");
        if (res.ok) {
          const data = await res.json();
          setPlayers(data.leaderboard);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const sorted = [...players].sort((a, b) => b[sortKey] - a[sortKey]);
  const currentUserId = session?.user?.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-black dark:text-white">Leaderboard</h2>
          <button
            onClick={onClose}
            className="p-1 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          {([
            { key: "wins" as const, label: "Wins" },
            { key: "winRate" as const, label: "Win %" },
            { key: "maxStreak" as const, label: "Streak" },
          ]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSortKey(key)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                sortKey === key
                  ? "bg-green-600 text-white"
                  : "bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8 text-zinc-500">Loading...</div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">No players yet</div>
          ) : (
            <div className="space-y-2">
              {sorted.map((player, index) => {
                const isMe = player.userId === currentUserId;
                return (
                  <div
                    key={player.userId}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      isMe
                        ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                        : "bg-zinc-50 dark:bg-zinc-700/50"
                    }`}
                  >
                    <span className={`w-6 text-sm font-bold text-center ${
                      index === 0 ? "text-yellow-500" : index === 1 ? "text-zinc-400" : index === 2 ? "text-amber-600" : "text-zinc-400"
                    }`}>
                      {index + 1}
                    </span>

                    {player.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={player.image}
                        alt={player.username || "User"}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold">
                        {(player.username || "?")[0].toUpperCase()}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-black dark:text-white truncate">
                        {player.username}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        {player.totalGames} games
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-black dark:text-white">
                        {sortKey === "wins" && `${player.wins}W`}
                        {sortKey === "winRate" && `${player.winRate}%`}
                        {sortKey === "maxStreak" && `${player.maxStreak}`}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        {formatTime(player.avgTime)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
