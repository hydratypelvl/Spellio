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
  correct: "bg-green-500 hover:bg-green-600 border-green-500 text-white",
  present: "bg-yellow-500 hover:bg-yellow-600 border-yellow-500 text-white",
  absent: "bg-zinc-500 hover:bg-zinc-600 border-zinc-500 text-white",
  empty:
    "bg-zinc-200 hover:bg-zinc-300 border-zinc-300 text-black dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:border-zinc-600 dark:text-white",
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
    <div className="flex flex-col gap-[3px] sm:gap-1" role="group" aria-label="Keyboard">
      {ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-[3px] sm:gap-1">
          {row.map((key) => {
            const isSpecial = key === "ENTER" || key === "BACKSPACE";
            return (
              <button
                key={key}
                onClick={() => handleClick(key)}
                onMouseDown={(e) => e.preventDefault()}
                disabled={disabled}
                className={`h-[46px] sm:h-14 rounded-[4px] flex items-center justify-center border transition-colors duration-200 text-[13px] sm:text-base font-semibold select-none ${
                  isSpecial ? "px-1.5 sm:px-2 min-w-[46px] sm:min-w-[65px]" : "w-[38px] sm:w-[42px]"
                } ${stateStyles[keyStates[key] || "empty"]}`}
                aria-label={key === "BACKSPACE" ? "Backspace" : key === "ENTER" ? "Enter" : key}
              >
                {key === "BACKSPACE" ? "←" : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
