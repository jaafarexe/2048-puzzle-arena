/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Trophy,
  BarChart3,
  History,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Flame,
  Clock,
  Sparkles,
  Layers,
  Zap,
  Crown,
  Star,
  ShieldCheck,
  Timer,
} from 'lucide-react';
import { Achievement, GameStats, MoveHistoryItem, MoveDirection, Tile } from '../types/game';

interface StatsAndHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  history: MoveHistoryItem[];
  achievements: Achievement[];
  currentTiles: Tile[];
  initialTab?: 'stats' | 'history' | 'achievements';
}

export const StatsAndHistoryModal: React.FC<StatsAndHistoryModalProps> = ({
  isOpen,
  onClose,
  stats,
  history,
  achievements,
  currentTiles,
  initialTab = 'stats',
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'history' | 'achievements'>(initialTab);

  if (!isOpen) return null;

  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;
  const avgScore = stats.gamesPlayed > 0 ? Math.round(stats.totalScore / stats.gamesPlayed) : 0;

  const getDirectionIcon = (dir: MoveDirection) => {
    switch (dir) {
      case 'UP': return <ArrowUp className="w-3.5 h-3.5 text-blue-400" />;
      case 'DOWN': return <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />;
      case 'LEFT': return <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />;
      case 'RIGHT': return <ArrowRight className="w-3.5 h-3.5 text-fuchsia-400" />;
    }
  };

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'Layers': return <Layers className="w-4 h-4 text-cyan-400" />;
      case 'Flame': return <Flame className="w-4 h-4 text-orange-400" />;
      case 'Zap': return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'Trophy': return <Trophy className="w-4 h-4 text-amber-400" />;
      case 'Crown': return <Crown className="w-4 h-4 text-purple-400" />;
      case 'Clock': return <Clock className="w-4 h-4 text-blue-400" />;
      case 'Star': return <Star className="w-4 h-4 text-yellow-300" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'Timer': return <Timer className="w-4 h-4 text-rose-400" />;
      default: return <Trophy className="w-4 h-4 text-amber-400" />;
    }
  };

  // Group tiles on the current board by value
  const tileCounts: Record<number, number> = {};
  currentTiles.forEach((t) => {
    tileCounts[t.value] = (tileCounts[t.value] || 0) + 1;
  });
  const sortedTileValues = Object.keys(tileCounts)
    .map(Number)
    .sort((a, b) => b - a);

  const unlockedCount = achievements.filter((a) => a.unlockedAt !== null).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/50">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Arena Hub</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 pb-2 border-b border-neutral-800 bg-neutral-950/40">
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Statistics</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Move History ({history.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'achievements'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Milestones ({unlockedCount}/{achievements.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* TAB 1: STATISTICS */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              {/* Primary Grid Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-neutral-800/60 border border-neutral-800 rounded-xl p-3">
                  <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider block">
                    Best Score
                  </span>
                  <span className="text-xl font-bold font-mono text-amber-300 tabular-nums">
                    {stats.bestScore.toLocaleString()}
                  </span>
                </div>

                <div className="bg-neutral-800/60 border border-neutral-800 rounded-xl p-3">
                  <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider block">
                    Highest Tile
                  </span>
                  <span className="text-xl font-bold font-mono text-white tabular-nums">
                    {stats.highestTile > 0 ? stats.highestTile.toLocaleString() : '—'}
                  </span>
                </div>

                <div className="bg-neutral-800/60 border border-neutral-800 rounded-xl p-3">
                  <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider block">
                    Games Won
                  </span>
                  <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                    {stats.gamesWon} <span className="text-xs text-neutral-400 font-sans font-normal">({winRate}%)</span>
                  </span>
                </div>

                <div className="bg-neutral-800/60 border border-neutral-800 rounded-xl p-3">
                  <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider block">
                    Games Played
                  </span>
                  <span className="text-xl font-bold font-mono text-neutral-200 tabular-nums">
                    {stats.gamesPlayed}
                  </span>
                </div>

                <div className="bg-neutral-800/60 border border-neutral-800 rounded-xl p-3">
                  <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider block">
                    Total Moves
                  </span>
                  <span className="text-xl font-bold font-mono text-neutral-200 tabular-nums">
                    {stats.totalMoves.toLocaleString()}
                  </span>
                </div>

                <div className="bg-neutral-800/60 border border-neutral-800 rounded-xl p-3">
                  <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider block">
                    Win Streak
                  </span>
                  <span className="text-xl font-bold font-mono text-orange-400 tabular-nums">
                    {stats.currentStreak} <span className="text-xs text-neutral-500 font-sans">Best: {stats.bestStreak}</span>
                  </span>
                </div>
              </div>

              {/* Current Board Tile Distribution */}
              {sortedTileValues.length > 0 && (
                <div className="bg-neutral-800/40 border border-neutral-800 rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                    Current Board Tiles
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sortedTileValues.map((val) => (
                      <div
                        key={val}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-800 border border-neutral-700/60 text-xs font-mono"
                      >
                        <span className="font-bold text-amber-300">{val}</span>
                        <span className="text-neutral-500">×{tileCounts[val]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Performance Summary */}
              <div className="text-xs text-neutral-400 space-y-1">
                <p>Average score per session: <span className="font-mono text-white tabular-nums">{avgScore.toLocaleString()} pts</span></p>
                {stats.fastestWinSeconds && (
                  <p>Fastest 2048 victory: <span className="font-mono text-amber-300 tabular-nums">{Math.floor(stats.fastestWinSeconds / 60)}m {stats.fastestWinSeconds % 60}s</span></p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MOVE HISTORY TIMELINE */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              {history.length === 0 ? (
                <div className="text-center py-10 text-neutral-500 text-sm">
                  No moves recorded in this game yet. Slide tiles to start!
                </div>
              ) : (
                <div className="divide-y divide-neutral-800/80 border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900/60">
                  <div className="grid grid-cols-4 px-3 py-2 bg-neutral-950/60 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    <span>Move</span>
                    <span>Direction</span>
                    <span className="text-right">Points</span>
                    <span className="text-right">Peak Tile</span>
                  </div>
                  <div className="max-h-[320px] overflow-y-auto divide-y divide-neutral-800/50">
                    {history.slice(-50).reverse().map((item) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-4 px-3 py-2 text-xs items-center hover:bg-neutral-800/40 transition-colors"
                      >
                        <span className="font-mono text-neutral-400">#{item.moveNumber}</span>
                        <span className="flex items-center gap-1 font-medium text-neutral-200">
                          {getDirectionIcon(item.direction)}
                          <span>{item.direction}</span>
                        </span>
                        <span className="font-mono tabular-nums text-right font-semibold text-amber-400">
                          {item.scoreGained > 0 ? `+${item.scoreGained}` : '—'}
                        </span>
                        <span className="font-mono tabular-nums text-right text-neutral-300 font-bold">
                          {item.maxTile}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ACHIEVEMENTS & MILESTONES */}
          {activeTab === 'achievements' && (
            <div className="space-y-2.5">
              {achievements.map((ach) => {
                const isUnlocked = ach.unlockedAt !== null;
                return (
                  <div
                    key={ach.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                      isUnlocked
                        ? 'bg-neutral-800/70 border-amber-500/30'
                        : 'bg-neutral-900/40 border-neutral-800/80 opacity-60'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isUnlocked ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-neutral-800 text-neutral-500'
                      }`}
                    >
                      {getAchievementIcon(ach.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm font-semibold truncate ${isUnlocked ? 'text-white' : 'text-neutral-400'}`}>
                          {ach.title}
                        </span>
                        {isUnlocked && (
                          <span className="text-[10px] font-mono text-amber-400 shrink-0">
                            Unlocked
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                        {ach.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-neutral-800 bg-neutral-900/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-lg text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
