"use client";

import { type TileState } from "@/lib/wordle";

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
  keyStates: Record<string, TileState>;
  disabled?: boolean;
}

const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

const stateStyles: Record<TileState, string> = {
  correct: "bg-green-500 hover:bg-green-600 text-white",
  present: "bg-yellow-500 hover:bg-yellow-600 text-white",
  absent: "bg-zinc-500 hover:bg-zinc-600 text-white",
  empty:
    "bg-zinc-200 hover:bg-zinc-300 text-black dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-white",
};

export default function Keyboard({
  onKeyPress,
  onEnter,
  onBackspace,
  keyStates,
  disabled = false,
}: KeyboardProps) {
  const handleClick = (key: string) => {
    if (disabled) return;

    if (key === "ENTER") {
      onEnter();
    } else if (key === "BACKSPACE") {
      onBackspace();
    } else {
      onKeyPress(key);
    }
  };

  return (
    <div className="flex flex-col gap-[5px] w-full max-w-[500px] md:max-w-[600px] lg:max-w-[700px] mx-auto" role="group" aria-label="Keyboard">
      {ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-[5px]">
          {row.map((key) => {
            const isEnter = key === "ENTER";
            const isBackspace = key === "BACKSPACE";
            return (
              <button
                key={key}
                onClick={() => handleClick(key)}
                onMouseDown={(e) => e.preventDefault()}
                disabled={disabled}
                className={`h-[50px] sm:h-[58px] md:h-[64px] lg:h-[70px] rounded-md flex items-center justify-center transition-colors duration-200 text-[13px] sm:text-sm md:text-base font-bold select-none tracking-wide ${
                  isEnter
                    ? "flex-[1.5] min-w-0 text-[11px] sm:text-xs md:text-sm uppercase"
                    : isBackspace
                      ? "flex-[1.5] min-w-0"
                      : "flex-1 min-w-0"
                } ${stateStyles[keyStates[key] || "empty"]}`}
                aria-label={isBackspace ? "Backspace" : isEnter ? "Enter" : key}
              >
                {isBackspace ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l-4-4m0 0l4-4m-4 4h11a4 4 0 010 8h-1" />
                  </svg>
                ) : (
                  key
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
