"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function useTutorial() {
  const [showTutorial, setShowTutorial] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem("wordle-tutorial-seen");
  });

  const closeTutorial = () => {
    localStorage.setItem("wordle-tutorial-seen", "true");
    setShowTutorial(false);
  };

  return { showTutorial, closeTutorial };
}

const TILE_COLORS: Record<string, string> = {
  correct: "bg-green-500 border-green-500",
  present: "bg-yellow-500 border-yellow-500",
  absent: "bg-zinc-500 border-zinc-500",
};

export default function TutorialModal({ onClose }: { onClose: () => void }) {
  const { data: session } = useSession();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black dark:text-white">How To Play</h2>
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

        <div className="space-y-5">
          <p className="text-zinc-600 dark:text-zinc-400 text-center">
            Guess the Wordle in 6 tries. Each guess must be a valid 5-letter word.
          </p>

          <div>
            <p className="text-zinc-600 dark:text-zinc-400 mb-3">After each guess, the tiles will change color:</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center border-2 rounded text-lg font-bold text-white ${TILE_COLORS.correct}`}>W</div>
                <span className="text-zinc-700 dark:text-zinc-300 text-sm">
                  <span className="font-bold">Green</span> is in the word and in the correct spot.
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center border-2 rounded text-lg font-bold text-white ${TILE_COLORS.present}`}>E</div>
                <span className="text-zinc-700 dark:text-zinc-300 text-sm">
                  <span className="font-bold">Yellow</span> is in the word but in the wrong spot.
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center border-2 rounded text-lg font-bold text-white ${TILE_COLORS.absent}`}>A</div>
                <span className="text-zinc-700 dark:text-zinc-300 text-sm">
                  <span className="font-bold">Gray</span> is not in the word at all.
                </span>
              </div>
            </div>
          </div>

          <p className="text-zinc-600 dark:text-zinc-400 text-center">
            Use your keyboard or tap the keys below to type.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors"
        >
          Got It!
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
