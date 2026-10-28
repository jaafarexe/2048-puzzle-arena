/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MoveDirection = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GameStatus = 'PLAYING' | 'WON' | 'GAME_OVER';

export type GridSize = 3 | 4 | 5;

export interface Tile {
  id: string;
  value: number;
  row: number;
  col: number;
  isNew?: boolean;
  isMerged?: boolean;
}

export interface MoveHistoryItem {
  id: string;
  moveNumber: number;
  direction: MoveDirection;
  scoreGained: number;
  maxTile: number;
  timestamp: number;
}

export interface GameSnapshot {
  tiles: Tile[];
  score: number;
  moveCount: number;
  status: GameStatus;
  history: MoveHistoryItem[];
  elapsedSeconds: number;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  bestScore: number;
  highestTile: number;
  totalMoves: number;
  totalScore: number;
  currentStreak: number;
  bestStreak: number;
  fastestWinSeconds: number | null;
}

export type ThemeId = 'classic' | 'midnight' | 'emerald' | 'amber' | 'retro';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  bgClass: string;
  boardBg: string;
  cellBg: string;
  accentColor: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: number | null;
}
