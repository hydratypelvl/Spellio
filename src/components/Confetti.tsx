"use client";

import { useState, useEffect, useRef } from "react";

interface Piece {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  rotation: number;
  borderRadius: string;
}

const COLORS = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7", "#dfe6e9", "#fd79a8", "#6c5ce7"];

function createPieces(): Piece[] {
  const pieces: Piece[] = [];
  for (let i = 0; i < 50; i++) {
    pieces.push({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 10 + 5,
      delay: Math.random() * 0.5,
      duration: Math.random() * 2 + 2,
      rotation: Math.random() * 360,
      borderRadius: Math.random() > 0.5 ? "50%" : "0",
    });
  }
  return pieces;
}

export default function Confetti({ active }: { active: boolean }) {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const hasCreated = useRef(false);
  const prevActive = useRef(false);

  useEffect(() => {
    if (active && !prevActive.current && !hasCreated.current) {
      setPieces(createPieces());
      hasCreated.current = true;
    } else if (!active && prevActive.current) {
      hasCreated.current = false;
      setPieces([]);
    }
    prevActive.current = active;
  }, [active]);

  if (!active || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 9999 }}>
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece absolute"
          style={{
            left: `${piece.x}%`,
            top: "-10px",
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: piece.borderRadius,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${piece.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}
