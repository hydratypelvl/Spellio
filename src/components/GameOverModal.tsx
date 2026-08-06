"use client";

import { useEffect, useState } from "react";

interface GameOverModalProps {
  won: boolean;
  attempts: number;
  targetWord: string;
  onClose: () => void;
}

const DISTRIBUTION_LABELS = ["1", "2", "3", "4", "5", "6"];

export default function GameOverModal({
  won,
  attempts,
  targetWord,
  onClose,
}: GameOverModalProps) {
  const [distribution, setDistribution] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [maxCount, setMaxCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("wordle-stats");
    const stats = stored
      ? JSON.parse(stored)
      : { distribution: [0, 0, 0, 0, 0, 0] };

    if (won && attempts >= 1 && attempts <= 6) {
      stats.distribution[attempts - 1]++;
    }

    localStorage.setItem("wordle-stats", JSON.stringify(stats));
    setDistribution(stats.distribution);
    setMaxCount(Math.max(...stats.distribution));
  }, [won, attempts]);

  const maxBarWidth = maxCount > 0 ? 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-2 text-black dark:text-white">
          {won ? "You Won!" : "Game Over"}
        </h2>

        {!won && (
          <p className="text-center text-zinc-600 dark:text-zinc-400 mb-4">
            The word was{" "}
            <span className="font-bold text-green-600 dark:text-green-400 uppercase">
              {targetWord}
            </span>
          </p>
        )}

        {won && (
          <p className="text-center text-zinc-600 dark:text-zinc-400 mb-6">
            Solved in <span className="font-bold">{attempts}</span> {attempts === 1 ? "try" : "tries"}
          </p>
        )}

        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3 text-zinc-700 dark:text-zinc-300">
            Guess Distribution
          </h3>
          <div className="space-y-2">
            {DISTRIBUTION_LABELS.map((label, index) => (
              <div key={label} className="flex items-center gap-2">
                <span className="w-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {label}
                </span>
                <div className="flex-1 h-6 bg-zinc-100 dark:bg-zinc-700 rounded">
                  <div
                    className={`h-full flex items-center justify-end px-2 rounded text-xs font-bold text-white ${
                      won && index === attempts - 1
                        ? "bg-green-500"
                        : "bg-zinc-500"
                    }`}
                    style={{
                      minWidth: distribution[index] > 0 ? "24px" : "0",
                      width: `${
                        maxCount > 0
                          ? (distribution[index] / maxBarWidth) * 100
                          : 0
                      }%`,
                    }}
                  >
                    {distribution[index] > 0 && distribution[index]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
