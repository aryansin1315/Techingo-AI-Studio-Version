import React from 'react';
import { BingoCell } from '../types';
import { Star, Check } from './icons';

interface BingoGridProps {
  grid: (BingoCell | null)[][];
  onCellClick: (cellId: number) => void;
  revealedClues: string[];
  gridSize: number;
}

const CellComponent: React.FC<{ cell: BingoCell | null; onClick: () => void; revealed: boolean }> = ({ cell, onClick, revealed }) => {
  if (!cell) {
    return <div className="aspect-square rounded-xl bg-slate-100" />;
  }

  const isMarkable = revealed || cell.isFreeSpace;
  const isMarked = cell.marked;

  const baseClasses = "aspect-square rounded-xl border-2 p-1 md:p-2 font-medium transition-all relative overflow-hidden flex flex-col items-center justify-center text-center";
  const disabledClasses = "cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200";
  const markableClasses = "bg-white border-slate-200 hover:border-primary-500 hover:shadow-md text-slate-700 cursor-pointer";
  const markedClasses = "bg-gradient-to-br from-accent-green to-accent-teal border-green-400 text-white shadow-lg scale-105 animate-flip";
  const freeSpaceClasses = "bg-gradient-to-br from-accent-amber to-orange-500 border-yellow-400 text-white";

  const cellClasses = `${baseClasses} ${isMarked ? markedClasses : (cell.isFreeSpace ? freeSpaceClasses : (isMarkable ? markableClasses : disabledClasses))}`;

  return (
    <button
      onClick={onClick}
      disabled={!isMarkable && !cell.isFreeSpace}
      className={cellClasses}
    >
      {cell.isFreeSpace ? (
        <>
          <Star className="w-6 h-6 md:w-8 md:h-8 mb-1" />
          <span className="text-xs md:text-sm font-bold">FREE</span>
        </>
      ) : (
        <>
          <p className="text-[10px] sm:text-xs md:text-sm leading-tight line-clamp-4">{cell.clue?.companyName}</p>
          {isMarked && (
             <div className="absolute inset-0 bg-white/20 flex items-center justify-center">
                <Check className="w-6 h-6 md:w-10 md:h-10 text-white" />
            </div>
          )}
        </>
      )}
    </button>
  );
};

export const BingoGrid: React.FC<BingoGridProps> = ({ grid, onCellClick, revealedClues, gridSize }) => {
  const gridTemplateColumns = `repeat(${gridSize}, minmax(0, 1fr))`;
  return (
    <div 
      className="grid gap-2 md:gap-3 p-2 md:p-4 bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl max-w-2xl mx-auto"
      style={{ gridTemplateColumns }}
    >
      {grid.flat().map((cell) => {
         if (!cell) return <div key={`empty-${cell?.id}-${Math.random()}`} />;
         const isRevealed = revealedClues.includes(cell.clue?.clueText ?? '');
         return (
            <CellComponent
                key={cell.id}
                cell={cell}
                onClick={() => onCellClick(cell.id)}
                revealed={isRevealed}
            />
         );
      })}
    </div>
  );
};
