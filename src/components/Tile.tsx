"use client";

import { useState, useEffect, useRef } from "react";

interface TileProps {
  letter: string;
  state?: "empty" | "correct" | "present" | "absent";
  animate?: boolean;
  delay?: number;
}

export default function Tile({ letter, state = "empty", animate = false, delay = 0 }: TileProps) {
  const [isRevealing, setIsRevealing] = useState(false);
  const [currentState, setCurrentState] = useState(state);
  const [flipComplete, setFlipComplete] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevAnimate = useRef(false);
  const prevState = useRef(state);

  useEffect(() => {
    const shouldAnimate = animate && state !== "empty" && letter && !prevAnimate.current;
    prevAnimate.current = animate;

    if (!shouldAnimate) {
      setCurrentState(state);
      prevState.current = state;
      return;
    }

    const revealDelay = setTimeout(() => {
      setIsRevealing(true);
      setCurrentState("empty");

      const flipTimeout = setTimeout(() => {
        setCurrentState(state);
        setFlipComplete(true);

        const resetTimeout = setTimeout(() => {
          setIsRevealing(false);
        }, 600);

        timeoutRef.current = resetTimeout;
      }, 300);

      timeoutRef.current = flipTimeout;
    }, delay);

    timeoutRef.current = revealDelay;

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [animate, state, letter, delay]);

  const getBackgroundColor = () => {
    if (!letter && !isRevealing) return "bg-zinc-200 dark:bg-zinc-700 border-zinc-400 dark:border-zinc-600";

    if (isRevealing && !flipComplete) return "bg-zinc-200 dark:bg-zinc-700 border-zinc-400 dark:border-zinc-600";

    switch (currentState) {
      case "correct":
        return "bg-green-500 border-green-500 text-white";
      case "present":
        return "bg-yellow-500 border-yellow-500 text-white";
      case "absent":
        return "bg-zinc-500 border-zinc-500 text-white";
      default:
        return "bg-zinc-200 dark:bg-zinc-700 border-zinc-400 dark:border-zinc-600";
    }
  };

  const shouldFlip = animate && letter && (state !== "empty");
  const flipClass = shouldFlip ? (flipComplete ? "flip-complete" : "flip-half") : "";

  return (
    <div
      className={`relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center border-2 text-2xl sm:text-3xl font-bold uppercase ${getBackgroundColor()} ${flipClass} tile-flip`}
      data-letter={letter}
      data-state={state}
      aria-label={letter ? `Letter ${letter}, ${state}` : "Empty tile"}
    >
      <span className="relative z-10">{letter}</span>
    </div>
  );
}
