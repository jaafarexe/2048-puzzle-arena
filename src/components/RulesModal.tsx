/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HelpCircle, X, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Sparkles, RotateCcw } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-y-auto max-h-[85vh] space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">How to Play 2048</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Rules */}
        <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
          <div className="p-3 rounded-xl bg-neutral-800/60 border border-neutral-700/60 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-xs">
              1
            </div>
            <div>
              <p className="font-semibold text-white">Slide the Tiles</p>
              <p className="text-xs text-neutral-400 mt-0.5">
                Use your Arrow keys, W/A/S/D keys, swipe gestures, or the on-screen D-pad to slide all tiles in that direction.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-800/60 border border-neutral-700/60 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-xs">
              2
            </div>
            <div>
              <p className="font-semibold text-white">Merge Matching Numbers</p>
              <p className="text-xs text-neutral-400 mt-0.5">
                When two tiles with the same number touch, they merge into one with twice the value (2 + 2 = 4, 4 + 4 = 8, ..., 1024 + 1024 = 2048)!
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-800/60 border border-neutral-700/60 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-xs">
              3
            </div>
            <div>
              <p className="font-semibold text-white">Reach 2048 to Win</p>
              <p className="text-xs text-neutral-400 mt-0.5">
                Create the 2048 tile to win! You can then continue playing in endless mode to reach 4096, 8192, and beyond.
              </p>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Controls & Shortcuts
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800 flex items-center justify-between">
              <span className="text-neutral-400">Slide Grid</span>
              <div className="flex gap-1">
                <span className="px-1.5 py-0.5 rounded bg-neutral-800 font-mono text-[11px] text-neutral-200">↑ ↓ ← →</span>
                <span className="px-1.5 py-0.5 rounded bg-neutral-800 font-mono text-[11px] text-neutral-200">WASD</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800 flex items-center justify-between">
              <span className="text-neutral-400">Undo Move</span>
              <span className="px-1.5 py-0.5 rounded bg-neutral-800 font-mono text-[11px] text-neutral-200">Z or U</span>
            </div>

            <div className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800 flex items-center justify-between">
              <span className="text-neutral-400">AI Hint</span>
              <span className="px-1.5 py-0.5 rounded bg-neutral-800 font-mono text-[11px] text-neutral-200">H</span>
            </div>

            <div className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800 flex items-center justify-between">
              <span className="text-neutral-400">New Game</span>
              <span className="px-1.5 py-0.5 rounded bg-neutral-800 font-mono text-[11px] text-neutral-200">N or R</span>
            </div>
          </div>
        </div>

        {/* Pro Strategy Tips */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1 text-amber-200/90">
          <p className="font-semibold text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master Strategy: Corner Anchor</span>
          </p>
          <p className="leading-relaxed">
            Keep your highest-value tile locked in one designated corner (e.g. bottom-left) and build a descending chain of numbers adjacent to it. Avoid sliding against your corner unless strictly necessary!
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-lg text-xs transition-colors cursor-pointer"
          >
            Got it, Let's Play
          </button>
        </div>
      </div>
    </div>
  );
};
