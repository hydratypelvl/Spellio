"use client";

import { useEffect, useState } from "react";
import { type TileState } from "@/lib/wordle";

interface TileProps {
  letter: string;
  state: TileState;
  delay?: number;
  animate?: boolean;
}

const stateStyles: Record<TileState, string> = {
  correct: "bg-green-500 border-green-500 text-white",
  present: "bg-yellow-500 border-yellow-500 text-white",
  absent: "bg-zinc-500 border-zinc-500 text-white",
  empty: "bg-white border-zinc-300 text-black dark:bg-zinc-800 dark:border-zinc-600 dark:text-white",
};

export default function Tile({ letter, state, delay = 0, animate = false }: TileProps) {
  const [isRevealing, setIsRevealing] = useState(false);
  const [currentState, setCurrentState] = useState<TileState>(state);

  useEffect(() => {
    if (animate && state !== "empty" && letter) {
      setIsRevealing(true);
      setCurrentState("empty");

      const revealTimeout = setTimeout(() => {
        setCurrentState(state);
        setIsRevealing(false);
      }, delay + 300);

      return () => clearTimeout(revealTimeout);
    } else {
      setCurrentState(state);
    }
  }, [animate, state, letter, delay]);

  return (
    <div
      className={`
        flex items-center justify-center w-14 h-14 border-2 text-2xl font-bold uppercase select-none
        transition-all duration-300
        ${stateStyles[currentState]}
        ${isRevealing ? "animate-flip" : ""}
      `}
      style={{
        animationDelay: state !== "empty" ? `${delay}ms` : undefined,
      }}
      aria-label={letter ? `${letter}, ${state}` : "empty"}
    >
      <div className={`${isRevealing ? "animate-spin-in" : ""}`}
        style={{ animationDelay: `${delay}ms` }}
      >
        {letter}
      </div>
    </div>
  );
}
