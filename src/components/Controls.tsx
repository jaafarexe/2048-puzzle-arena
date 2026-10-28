/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  RotateCcw,
  RefreshCw,
} from 'lucide-react';
import { MoveDirection } from '../types/game';
import { HintRecommendation } from '../utils/aiHint';

interface ControlsProps {
  onMove: (direction: MoveDirection) => void;
  onUndo: () => void;
  canUndo: boolean;
  onNewGame: () => void;
  hint: HintRecommendation | null;
  onClearHint: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  onMove,
  onUndo,
  canUndo,
  onNewGame,
  hint,
  onClearHint,
}) => {
  return (
    <div className="w-full max-w-[460px] mx-auto px-2 space-y-3">
      {/* Hint Banner if active */}
      {hint && (
        <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-spin" style={{ animationDuration: '4s' }} />
            <div>
              <span className="font-semibold text-white">Suggested: Slide {hint.direction}</span>
              <p className="text-[11px] text-amber-300/80 leading-snug">{hint.reason}</p>
            </div>
          </div>
          <button
            onClick={() => {
              onMove(hint.direction);
              onClearHint();
            }}
            className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs transition-colors shrink-0 cursor-pointer shadow-sm"
          >
            Play {hint.direction}
          </button>
        </div>
      )}

      {/* D-Pad & Control cluster for mobile touch / accessibility */}
      <div className="flex items-center justify-between px-2 pt-1">
        {/* Left utility buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              canUndo
                ? 'bg-neutral-800/90 border-neutral-700 hover:bg-neutral-750 text-white shadow-sm'
                : 'bg-neutral-900/50 border-neutral-800/60 text-neutral-600 cursor-not-allowed opacity-60'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Undo Move</span>
          </button>

          <button
            onClick={onNewGame}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-neutral-800/90 border border-neutral-700 hover:bg-neutral-750 text-neutral-300 hover:text-white transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Board</span>
          </button>
        </div>

        {/* On-screen Directional D-Pad */}
        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-neutral-900/70 border border-neutral-800/80 rounded-2xl shadow-inner">
          <div />
          <button
            onClick={() => onMove('UP')}
            aria-label="Slide Up"
            className={`w-11 h-11 flex items-center justify-center rounded-xl font-bold transition-all active:scale-95 cursor-pointer ${
              hint?.direction === 'UP'
                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 shadow-lg shadow-amber-500/40 animate-pulse'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700/60'
            }`}
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <div />

          <button
            onClick={() => onMove('LEFT')}
            aria-label="Slide Left"
            className={`w-11 h-11 flex items-center justify-center rounded-xl font-bold transition-all active:scale-95 cursor-pointer ${
              hint?.direction === 'LEFT'
                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 shadow-lg shadow-amber-500/40 animate-pulse'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700/60'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => onMove('DOWN')}
            aria-label="Slide Down"
            className={`w-11 h-11 flex items-center justify-center rounded-xl font-bold transition-all active:scale-95 cursor-pointer ${
              hint?.direction === 'DOWN'
                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 shadow-lg shadow-amber-500/40 animate-pulse'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700/60'
            }`}
          >
            <ArrowDown className="w-5 h-5" />
          </button>

          <button
            onClick={() => onMove('RIGHT')}
            aria-label="Slide Right"
            className={`w-11 h-11 flex items-center justify-center rounded-xl font-bold transition-all active:scale-95 cursor-pointer ${
              hint?.direction === 'RIGHT'
                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 shadow-lg shadow-amber-500/40 animate-pulse'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700/60'
            }`}
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Subtle Keyboard Navigation reminder */}
      <div className="text-center text-[11px] text-neutral-500 font-medium">
        Use <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 font-mono">Arrow Keys</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 font-mono">W A S D</kbd> to slide tiles · Swipe on touch
      </div>
    </div>
  );
};
