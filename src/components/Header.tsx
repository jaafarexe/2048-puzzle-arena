/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  Trophy,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  BarChart3,
  HelpCircle,
  Palette,
} from 'lucide-react';
import { GridSize, ThemeId } from '../types/game';
import { THEMES } from '../utils/themeStyles';

interface HeaderProps {
  score: number;
  bestScore: number;
  scoreAddition: number;
  moveCount: number;
  elapsedSeconds: number;
  gridSize: GridSize;
  onChangeGridSize: (size: GridSize) => void;
  onNewGame: () => void;
  onUndo: () => void;
  canUndo: boolean;
  undoCount: number;
  onOpenStats: () => void;
  onOpenAchievements: () => void;
  onOpenRules: () => void;
  onToggleTheme: () => void;
  currentTheme: ThemeId;
  isMuted: boolean;
  onToggleMute: () => void;
  onGetHint: () => void;
  hintActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  score,
  bestScore,
  scoreAddition,
  moveCount,
  elapsedSeconds,
  gridSize,
  onChangeGridSize,
  onNewGame,
  onUndo,
  canUndo,
  undoCount,
  onOpenStats,
  onOpenAchievements,
  onOpenRules,
  onToggleTheme,
  currentTheme,
  isMuted,
  onToggleMute,
  onGetHint,
  hintActive,
}) => {
  const [floatingScore, setFloatingScore] = useState<{ id: number; value: number } | null>(null);

  useEffect(() => {
    if (scoreAddition > 0) {
      const id = Date.now();
      setFloatingScore({ id, value: scoreAddition });
      const timer = setTimeout(() => {
        setFloatingScore(null);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [scoreAddition]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const themeName = THEMES[currentTheme]?.name || 'Classic';

  return (
    <header className="w-full max-w-4xl mx-auto px-4 pt-3 pb-2 space-y-4">
      {/* Universal Top Bar Contract: Zone 1 (Wordmark), Zone 2 (Nav links), Zone 3 (Primary Action) */}
      <div className="flex items-center justify-between gap-6 pb-2 border-b border-neutral-800/80">
        {/* Zone 1: Single Wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-black text-slate-950 text-sm shadow-md shadow-amber-500/20">
            2K
          </div>
          <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap">
            2048 Puzzle Arena
          </span>
        </div>

        {/* Zone 2: Navigation Links / Utility modals */}
        <nav className="hidden sm:flex items-center gap-5 text-sm font-medium text-neutral-400">
          <button
            onClick={onOpenStats}
            className="hover:text-white transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-neutral-400" />
            <span>Statistics</span>
          </button>
          <button
            onClick={onOpenAchievements}
            className="hover:text-white transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Milestones</span>
          </button>
          <button
            onClick={onOpenRules}
            className="hover:text-white transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-neutral-400" />
            <span>How to Play</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
            className="p-2 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          <button
            onClick={onToggleTheme}
            title={`Current Theme: ${themeName}`}
            aria-label="Cycle visual theme"
            className="p-2 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 transition-colors flex items-center gap-1 text-xs cursor-pointer"
          >
            <Palette className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline font-mono">{themeName.split(' ')[0]}</span>
          </button>

          <button
            onClick={onNewGame}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-amber-400/20 cursor-pointer"
          >
            New Game
          </button>
        </div>
      </div>

      {/* Game HUD: Scores & Status Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Current Score */}
        <div className="relative bg-neutral-800/80 border border-neutral-700/60 rounded-xl px-3.5 py-2 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-xs font-medium text-neutral-400 uppercase tracking-wider">
            <span>Score</span>
            {floatingScore && (
              <span
                key={floatingScore.id}
                className="absolute right-3 top-1 text-xs font-bold font-mono text-amber-400 animate-score-float pointer-events-none"
              >
                +{floatingScore.value}
              </span>
            )}
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white truncate">
            {score.toLocaleString()}
          </div>
        </div>

        {/* Best Score */}
        <div className="bg-neutral-800/80 border border-neutral-700/60 rounded-xl px-3.5 py-2 flex flex-col justify-between shadow-sm">
          <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider flex items-center justify-between">
            <span>Best</span>
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-amber-300 truncate">
            {bestScore.toLocaleString()}
          </div>
        </div>

        {/* Moves & Undo */}
        <div className="bg-neutral-800/80 border border-neutral-700/60 rounded-xl px-3.5 py-2 flex flex-col justify-between shadow-sm">
          <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider flex items-center justify-between">
            <span>Moves</span>
            <span className="text-[11px] text-neutral-500 font-mono">#{moveCount}</span>
          </div>
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-lg font-bold font-mono tabular-nums text-neutral-200">
              {moveCount}
            </span>
            <button
              onClick={onUndo}
              disabled={!canUndo}
              title="Undo last move (Z or U)"
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                canUndo
                  ? 'bg-neutral-700 hover:bg-neutral-600 text-white shadow-sm'
                  : 'bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-50'
              }`}
            >
              <RotateCcw className="w-3 h-3" />
              <span>Undo {undoCount > 0 ? `(${undoCount})` : ''}</span>
            </button>
          </div>
        </div>

        {/* Game Mode / Timer & Hint */}
        <div className="bg-neutral-800/80 border border-neutral-700/60 rounded-xl px-3.5 py-2 flex flex-col justify-between shadow-sm">
          <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider flex items-center justify-between">
            <span>Timer</span>
            <span className="font-mono text-neutral-300 font-medium tabular-nums">{formatTime(elapsedSeconds)}</span>
          </div>
          <div className="flex items-center justify-between gap-1.5 mt-0.5">
            {/* Grid size selector */}
            <div className="flex items-center bg-neutral-900 rounded p-0.5 text-xs font-mono">
              {([3, 4, 5] as GridSize[]).map((sz) => (
                <button
                  key={sz}
                  onClick={() => onChangeGridSize(sz)}
                  className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                    gridSize === sz
                      ? 'bg-neutral-700 text-white font-bold'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                  title={`${sz}x${sz} Grid`}
                >
                  {sz}x{sz}
                </button>
              ))}
            </div>

            {/* AI Hint button */}
            <button
              onClick={onGetHint}
              disabled={hintActive}
              title="Get AI Move Recommendation (H)"
              className="flex items-center gap-1 px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-medium transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Hint</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
