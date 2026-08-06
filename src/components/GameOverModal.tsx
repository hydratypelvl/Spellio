"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Stats {
  totalGames: number;
  totalWins: number;
  currentStreak: number;
  maxStreak: number;
  distribution: number[];
}

function loadStats(won: boolean, attempts: number): Stats {
  const saved = localStorage.getItem("wordle-stats");
  const existing: Stats = saved
    ? JSON.parse(saved)
    : {
        totalGames: 0,
        totalWins: 0,
        currentStreak: 0,
        maxStreak: 0,
        distribution: [0, 0, 0, 0, 0, 0],
      };

  if (won) {
    existing.totalGames += 1;
    existing.totalWins += 1;
    existing.currentStreak += 1;
    existing.maxStreak = Math.max(existing.maxStreak, existing.currentStreak);
    existing.distribution[attempts - 1] += 1;
  } else {
    existing.totalGames += 1;
    existing.currentStreak = 0;
  }

  localStorage.setItem("wordle-stats", JSON.stringify(existing));
  return existing;
}

export default function GameOverModal({
  won,
  attempts,
  targetWord,
  onClose,
}: {
  won: boolean;
  attempts: number;
  targetWord: string;
  onClose: () => void;
}) {
  const { data: session } = useSession();
  const [stats] = useState<Stats>(() => loadStats(won, attempts));

  const distribution = stats.distribution;
  const losses = stats.totalGames - stats.totalWins;
  const maxCount = Math.max(...distribution, losses, 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            {won ? "You Won!" : "Game Over"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!won && (
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            The word was <span className="font-bold text-green-600 dark:text-green-400">{targetWord}</span>
          </p>
        )}

        {won && (
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Great job solving it in {attempts} {attempts === 1 ? "try" : "tries"}!
          </p>
        )}

        {session?.user && (
          <div className="mb-6">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-black dark:text-white">{stats.totalGames}</div>
                <div className="text-xs text-zinc-500">Played</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-black dark:text-white">
                  {stats.totalGames > 0 ? Math.round((stats.totalWins / stats.totalGames) * 100) : 0}%
                </div>
                <div className="text-xs text-zinc-500">Win %</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-black dark:text-white">{stats.currentStreak}</div>
                <div className="text-xs text-zinc-500">Streak</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-black dark:text-white">{stats.maxStreak}</div>
                <div className="text-xs text-zinc-500">Max Streak</div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2 text-zinc-700 dark:text-zinc-300">Guess Distribution</h3>
          <div className="space-y-1">
            {distribution.map((count, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-4 text-sm text-zinc-600 dark:text-zinc-400">{i + 1}</span>
                <div className="flex-1 h-6 bg-zinc-100 dark:bg-zinc-700 rounded">
                  <div
                    className="h-full flex items-center justify-end px-2 rounded text-xs font-bold text-white"
                    style={{
                      width: `${maxCount > 0 ? (count / maxCount) * 100 : 0}%`,
                      minWidth: count > 0 ? "24px" : "0",
                      backgroundColor: won && attempts - 1 === i ? "#6aaa64" : "#787c7e",
                    }}
                  >
                    {count}
                  </div>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <span className="w-4 text-sm text-zinc-600 dark:text-zinc-400">X</span>
              <div className="flex-1 h-6 bg-zinc-100 dark:bg-zinc-700 rounded">
                <div
                  className="h-full flex items-center justify-end px-2 bg-red-500 rounded text-xs font-bold text-white"
                  style={{
                    width: `${maxCount > 0 ? (losses / maxCount) * 100 : 0}%`,
                    minWidth: losses > 0 ? "24px" : "0",
                  }}
                >
                  {losses}
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors"
        >
          Play Again
        </button>

        {!session?.user && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center mt-4">
            <Link href="/signin" className="font-semibold text-green-600 dark:text-green-400 hover:underline">Sign in</Link> to track stats
          </p>
        )}
      </div>
    </div>
  );
}
