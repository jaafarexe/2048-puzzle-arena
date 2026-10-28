/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Achievement, GameStats, ThemeId } from '../types/game';

const STATS_KEY = '2048_arena_stats';
const ACHIEVEMENTS_KEY = '2048_arena_achievements';
const THEME_KEY = '2048_arena_theme';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_merge',
    title: 'First Fusion',
    description: 'Merge two matching tiles together for the first time.',
    icon: 'Sparkles',
    unlockedAt: null,
  },
  {
    id: 'reach_128',
    title: 'Triple Digits',
    description: 'Create a 128 tile on the board.',
    icon: 'Layers',
    unlockedAt: null,
  },
  {
    id: 'reach_512',
    title: 'High Velocity',
    description: 'Create a 512 tile on the board.',
    icon: 'Flame',
    unlockedAt: null,
  },
  {
    id: 'reach_1024',
    title: 'Apex Threshold',
    description: 'Create a 1024 tile on the board.',
    icon: 'Zap',
    unlockedAt: null,
  },
  {
    id: 'reach_2048',
    title: 'Arena Champion',
    description: 'Reach the legendary 2048 tile and claim victory!',
    icon: 'Trophy',
    unlockedAt: null,
  },
  {
    id: 'reach_4096',
    title: 'Beyond Mythic',
    description: 'Surpass 2048 and forge a 4096 tile.',
    icon: 'Crown',
    unlockedAt: null,
  },
  {
    id: 'marathon_100',
    title: 'Centurion',
    description: 'Execute 100 tactical moves in a single game.',
    icon: 'Clock',
    unlockedAt: null,
  },
  {
    id: 'score_10k',
    title: 'High Roller',
    description: 'Amass 10,000 points or more in a single run.',
    icon: 'Star',
    unlockedAt: null,
  },
  {
    id: 'pure_victory',
    title: 'Pure Instinct',
    description: 'Win a game without using the Undo feature.',
    icon: 'ShieldCheck',
    unlockedAt: null,
  },
  {
    id: 'speed_demon',
    title: 'Speedrunner',
    description: 'Reach 2048 in under 3 minutes.',
    icon: 'Timer',
    unlockedAt: null,
  },
];

export const INITIAL_STATS: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  bestScore: 0,
  highestTile: 0,
  totalMoves: 0,
  totalScore: 0,
  currentStreak: 0,
  bestStreak: 0,
  fastestWinSeconds: null,
};

export function loadStats(): GameStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return { ...INITIAL_STATS };
    return { ...INITIAL_STATS, ...JSON.parse(raw) };
  } catch {
    return { ...INITIAL_STATS };
  }
}

export function saveStats(stats: GameStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // LocalStorage quota or access error
  }
}

export function loadAchievements(): Achievement[] {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (!raw) return [...INITIAL_ACHIEVEMENTS];
    const saved: Achievement[] = JSON.parse(raw);
    return INITIAL_ACHIEVEMENTS.map(initial => {
      const found = saved.find(s => s.id === initial.id);
      return found ? { ...initial, unlockedAt: found.unlockedAt } : initial;
    });
  } catch {
    return [...INITIAL_ACHIEVEMENTS];
  }
}

export function saveAchievements(achievements: Achievement[]): void {
  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  } catch {
    // LocalStorage error safety
  }
}

export function loadTheme(): ThemeId {
  try {
    const raw = localStorage.getItem(THEME_KEY);
    if (raw && ['classic', 'midnight', 'emerald', 'amber', 'retro'].includes(raw)) {
      return raw as ThemeId;
    }
  } catch {
    // ignore
  }
  return 'classic';
}

export function saveTheme(theme: ThemeId): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // ignore
  }
}
