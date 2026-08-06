"use client";

import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  delay: number;
  duration: number;
  rotation: number;
  size: number;
}

const COLORS = [
  "#22c55e",
  "#eab308",
  "#ef4444",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
  "#f97316",
  "#06b6d4",
];

function createConfettiPiece(id: number): ConfettiPiece {
  return {
    id,
    x: Math.random() * 100,
    y: -10,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    rotation: Math.random() * 360,
    size: 8 + Math.random() * 8,
  };
}

export default function Confetti({ active }: { active: boolean }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!active) {
      setPieces([]);
      return;
    }

    const newPieces = Array.from({ length: 50 }, (_, i) =>
      createConfettiPiece(i)
    );
    setPieces(newPieces);

    const timeout = setTimeout(() => setPieces([]), 4000);
    return () => clearTimeout(timeout);
  }, [active]);

  if (!active || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "0",
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${piece.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}
