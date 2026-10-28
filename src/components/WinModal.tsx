/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Play, RefreshCw, X } from 'lucide-react';

interface WinModalProps {
  isOpen: boolean;
  score: number;
  moveCount: number;
  elapsedSeconds: number;
  onKeepGoing: () => void;
  onNewGame: () => void;
  onClose: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({
  isOpen,
  score,
  moveCount,
  elapsedSeconds,
  onKeepGoing,
  onNewGame,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#fcd34d'],
        });
      } catch {
        // Confetti canvas safety
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const m = Math.floor(elapsedSeconds / 60);
  const s = elapsedSeconds % 60;
  const timeFormatted = `${m}m ${s}s`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
      <div className="relative w-full max-w-md bg-neutral-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 text-center shadow-2xl shadow-amber-500/20 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Victory Badge */}
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/30 text-slate-950 animate-bounce">
          <Trophy className="w-10 h-10" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Arena Champion!
        </h2>
        <p className="text-sm text-neutral-300 mt-1 max-w-xs mx-auto">
          You achieved the legendary 2048 tile. Can you ascend even higher?
        </p>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-2 my-6 bg-neutral-950/60 border border-neutral-800 rounded-2xl p-3">
          <div>
            <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider block">
              Score
            </span>
            <span className="text-base font-bold font-mono text-amber-300 tabular-nums">
              {score.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider block">
              Moves
            </span>
            <span className="text-base font-bold font-mono text-white tabular-nums">
              {moveCount}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider block">
              Time
            </span>
            <span className="text-base font-bold font-mono text-neutral-300 tabular-nums">
              {timeFormatted}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onKeepGoing}
            className="w-full sm:flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Keep Going</span>
          </button>
          <button
            onClick={onNewGame}
            className="w-full sm:flex-1 py-3 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>New Game</span>
          </button>
        </div>
      </div>
    </div>
  );
};
