"use client";

import { useState } from "react";
import Tile from "./Tile";

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

export default function TutorialModal({ onClose }: { onClose: () => void }) {
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

        <h2 className="text-3xl font-bold text-center text-black dark:text-white mb-6">How To Play</h2>

        <div className="space-y-6">
          <p className="text-zinc-600 dark:text-zinc-400 text-center">
            Guess the Wordle in 6 tries. Each guess must be a valid 5-letter word.
          </p>

          <div>
            <p className="text-zinc-600 dark:text-zinc-400 mb-2">After each guess, the tiles will change color:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Tile letter="W" state="correct" />
                <span className="text-zinc-700 dark:text-zinc-300">
                  <span className="font-bold">Green</span> is in the word and in the correct spot.
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Tile letter="E" state="present" />
                <span className="text-zinc-700 dark:text-zinc-300">
                  <span className="font-bold">Yellow</span> is in the word but in the wrong spot.
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Tile letter="A" state="absent" />
                <span className="text-zinc-700 dark:text-zinc-300">
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
          className="w-full mt-8 py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors"
        >
          Got It!
        </button>
      </div>
    </div>
  );
}
