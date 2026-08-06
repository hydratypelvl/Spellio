"use client";

import { useEffect, useState } from "react";

interface TutorialModalProps {
  onClose: () => void;
}

export default function TutorialModal({ onClose }: TutorialModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-black dark:text-white">
          How to Play
        </h2>

        <div className="space-y-4 text-sm text-zinc-700 dark:text-zinc-300">
          <p>
            Guess the word in 6 tries. Each guess must be a valid 5-letter word.
          </p>

          <div className="flex gap-2 my-4">
            <div className="w-12 h-12 flex items-center justify-center bg-green-500 text-white font-bold text-lg rounded">
              W
            </div>
            <div className="flex items-center">
              <span>
                <strong>Green</strong> — letter is in the correct position
              </span>
            </div>
          </div>

          <div className="flex gap-2 my-4">
            <div className="w-12 h-12 flex items-center justify-center bg-yellow-500 text-white font-bold text-lg rounded">
              E
            </div>
            <div className="flex items-center">
              <span>
                <strong>Yellow</strong> — letter is in the word but wrong position
              </span>
            </div>
          </div>

          <div className="flex gap-2 my-4">
            <div className="w-12 h-12 flex items-center justify-center bg-zinc-500 text-white font-bold text-lg rounded">
              X
            </div>
            <div className="flex items-center">
              <span>
                <strong>Gray</strong> — letter is not in the word
              </span>
            </div>
          </div>

          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Use your keyboard or tap the on-screen keys to type. Press Enter to
            submit a guess.
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}

export function useTutorial() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasSeenTutorial = localStorage.getItem("wordle-tutorial-seen");
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  const closeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem("wordle-tutorial-seen", "true");
  };

  return { showTutorial: mounted && showTutorial, closeTutorial };
}
