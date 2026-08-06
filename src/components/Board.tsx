"use client";

import Tile from "./Tile";
import { type Tile as TileType } from "@/lib/wordle";

interface BoardProps {
  board: TileType[][];
  revealedRows: Set<number>;
}

export default function Board({ board, revealedRows }: BoardProps) {
  return (
    <div className="flex flex-col gap-1.5" role="grid" aria-label="Wordle board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1.5" role="row">
          {row.map((tile, colIndex) => (
            <Tile
              key={`${rowIndex}-${colIndex}`}
              letter={tile.letter}
              state={tile.state}
              delay={colIndex * 100}
              animate={revealedRows.has(rowIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
