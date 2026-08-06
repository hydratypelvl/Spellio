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

    if (key === "ENTER") return onEnter();
    if (key === "BACKSPACE") return onBackspace();

    onKeyPress(key);
  };

  return (
      <div
          className="mx-auto w-full max-w-[500px] px-1 mt-5"
          role="group"
          aria-label="Keyboard"
      >
        {ROWS.map((row, rowIndex) => (
            <div
                key={rowIndex}
                className={`mb-1 flex justify-center gap-1 ${
                    rowIndex === 1 ? "px-4" : ""
                }`}
            >
              {row.map((key) => {
                const isEnter = key === "ENTER";
                const isBackspace = key === "BACKSPACE";
                const isSpecial = isEnter || isBackspace;

                return (
                    <button
                        key={key}
                        onClick={() => handleClick(key)}
                        onMouseDown={(e) => e.preventDefault()}
                        disabled={disabled}
                        aria-label={
                          isBackspace ? "Backspace" : isEnter ? "Enter" : key
                        }
                        className={`
                  flex h-14 items-center justify-center rounded
                  font-bold select-none transition-colors
                  ${
                            isSpecial
                                ? "w-14 sm:w-16 text-[11px]"
                                : "flex-1 text-sm"
                        }
                  ${stateStyles[keyStates[key] ?? "empty"]}
                `}
                    >
                      {isBackspace ? (
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                          >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 14l-4-4m0 0l4-4m-4 4h11a4 4 0 010 8h-1"
                            />
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