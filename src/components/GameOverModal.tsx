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
  const maxCount = Math.max(...distribution);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
      <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 max-w-sm w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          {won ? (
            <>
              <h2 className="text-3xl font-bold text-black dark:text-white mb-2">You Won!</h2>
              <p className="text-zinc-600 dark:text-zinc-400">Great job solving it in {attempts} {attempts === 1 ? "try" : "tries"}!</p>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-black dark:text-white mb-2">Game Over</h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                The word was <span className="font-bold text-green-600 dark:text-green-400">{targetWord}</span>
              </p>
            </>
          )}
        </div>

        {session?.user && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">Your Stats</h3>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div>
                <div className="text-2xl font-bold text-black dark:text-white">{stats.totalGames}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">Played</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-black dark:text-white">
                  {stats.totalGames > 0 ? Math.round((stats.totalWins / stats.totalGames) * 100) : 0}%
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">Win %</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-black dark:text-white">{stats.currentStreak}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">Streak</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-black dark:text-white">{stats.maxStreak}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">Max Streak</div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">Guess Distribution</h3>
          <div className="space-y-1.5">
            {distribution.map((count, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-sm font-medium text-black dark:text-white w-3 text-center">{i + 1}</span>
                <div className="flex-1">
                  <div
                    className="h-6 rounded flex items-center text-xs font-bold text-white"
                    style={{
                      width: `${maxCount > 0 ? (count / maxCount) * 100 : 0}%`,
                      minWidth: count > 0 ? "24px" : "0px",
                      backgroundColor: won && attempts - 1 === i ? "#6aaa64" : "#787c7e",
                      justifyContent: count > 0 ? "flex-end" : "center",
                      padding: count > 0 ? "0 6px" : "0",
                    }}
                  >
                    {count}
                  </div>
                </div>
              </div>
            ))}
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
