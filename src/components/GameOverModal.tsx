/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RefreshCw, RotateCcw, AlertCircle, X } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  bestScore: number;
  highestTile: number;
  moveCount: number;
  onNewGame: () => void;
  onUndo: () => void;
  canUndo: boolean;
  onClose: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  score,
  bestScore,
  highestTile,
  moveCount,
  onNewGame,
  onUndo,
  canUndo,
  onClose,
}) => {
  if (!isOpen) return null;

  const isNewRecord = score >= bestScore && score > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl overflow-hidden">
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-neutral-800 border border-neutral-700/80 flex items-center justify-center text-rose-400 shadow-md">
          <AlertCircle className="w-8 h-8" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Game Over
        </h2>
        <p className="text-sm text-neutral-400 mt-1">
          No remaining legal moves on the arena grid.
        </p>

        {isNewRecord && (
          <div className="mt-3 inline-block px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            ★ New Personal Best!
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 my-6 bg-neutral-950/60 border border-neutral-800 rounded-2xl p-3">
          <div>
            <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider block">
              Final Score
            </span>
            <span className="text-base font-bold font-mono text-white tabular-nums">
              {score.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider block">
              Peak Tile
            </span>
            <span className="text-base font-bold font-mono text-amber-400 tabular-nums">
              {highestTile}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider block">
              Moves
            </span>
            <span className="text-base font-bold font-mono text-neutral-300 tabular-nums">
              {moveCount}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onNewGame}
            className="w-full sm:flex-1 py-3 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          {canUndo && (
            <button
              onClick={onUndo}
              className="w-full sm:flex-1 py-3 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer border border-neutral-700"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Undo Last Move</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
