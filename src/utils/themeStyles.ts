/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ThemeConfig, ThemeId } from '../types/game';

export const THEMES: Record<ThemeId, ThemeConfig> = {
  classic: {
    id: 'classic',
    name: 'Classic Arena',
    bgClass: 'bg-stone-900',
    boardBg: 'bg-stone-800/90 border-stone-700/60',
    cellBg: 'bg-stone-700/40',
    accentColor: 'text-amber-400',
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Obsidian',
    bgClass: 'bg-slate-950',
    boardBg: 'bg-slate-900/90 border-slate-800',
    cellBg: 'bg-slate-800/40',
    accentColor: 'text-cyan-400',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Forest',
    bgClass: 'bg-emerald-950',
    boardBg: 'bg-emerald-900/80 border-emerald-800/60',
    cellBg: 'bg-emerald-800/40',
    accentColor: 'text-emerald-400',
  },
  amber: {
    id: 'amber',
    name: 'Solar Amber',
    bgClass: 'bg-zinc-950',
    boardBg: 'bg-amber-950/40 border-amber-900/50',
    cellBg: 'bg-amber-950/30',
    accentColor: 'text-amber-500',
  },
  retro: {
    id: 'retro',
    name: 'Retro Synthwave',
    bgClass: 'bg-neutral-950',
    boardBg: 'bg-purple-950/50 border-purple-800/50',
    cellBg: 'bg-purple-900/30',
    accentColor: 'text-fuchsia-400',
  },
};

export function getTileStyle(value: number, theme: ThemeId): { bg: string; text: string; glow?: string } {
  switch (theme) {
    case 'midnight':
      switch (value) {
        case 2: return { bg: 'bg-slate-800 border border-slate-700/60', text: 'text-slate-100 font-bold' };
        case 4: return { bg: 'bg-slate-700 border border-slate-600/70', text: 'text-slate-100 font-bold' };
        case 8: return { bg: 'bg-cyan-900 border border-cyan-700/70', text: 'text-cyan-100 font-bold' };
        case 16: return { bg: 'bg-cyan-800 border border-cyan-600', text: 'text-cyan-50 font-bold' };
        case 32: return { bg: 'bg-indigo-700', text: 'text-white font-bold' };
        case 64: return { bg: 'bg-indigo-600', text: 'text-white font-bold' };
        case 128: return { bg: 'bg-violet-600 shadow-lg shadow-violet-900/40', text: 'text-white font-bold' };
        case 256: return { bg: 'bg-violet-500 shadow-lg shadow-violet-800/50', text: 'text-white font-bold' };
        case 512: return { bg: 'bg-fuchsia-600 shadow-lg shadow-fuchsia-900/50', text: 'text-white font-extrabold' };
        case 1024: return { bg: 'bg-gradient-to-br from-cyan-400 to-blue-600 shadow-xl shadow-cyan-500/30 ring-2 ring-cyan-300', text: 'text-slate-950 font-black' };
        case 2048: return { bg: 'bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 shadow-2xl shadow-yellow-500/50 ring-2 ring-yellow-200 animate-pulse', text: 'text-slate-950 font-black' };
        case 4096: return { bg: 'bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 shadow-2xl shadow-pink-500/50 ring-2 ring-pink-300', text: 'text-white font-black' };
        default: return { bg: 'bg-gradient-to-br from-emerald-400 to-teal-600 ring-2 ring-emerald-300', text: 'text-white font-black' };
      }

    case 'emerald':
      switch (value) {
        case 2: return { bg: 'bg-stone-200 shadow-sm', text: 'text-stone-800 font-bold' };
        case 4: return { bg: 'bg-stone-300 shadow-sm', text: 'text-stone-900 font-bold' };
        case 8: return { bg: 'bg-teal-700 shadow-sm', text: 'text-white font-bold' };
        case 16: return { bg: 'bg-teal-600 shadow-sm', text: 'text-white font-bold' };
        case 32: return { bg: 'bg-emerald-700 shadow-sm', text: 'text-white font-bold' };
        case 64: return { bg: 'bg-emerald-600 shadow-sm', text: 'text-white font-bold' };
        case 128: return { bg: 'bg-emerald-500 shadow-md shadow-emerald-900/30', text: 'text-white font-bold' };
        case 256: return { bg: 'bg-green-500 shadow-md shadow-green-900/30', text: 'text-white font-bold' };
        case 512: return { bg: 'bg-lime-600 shadow-lg shadow-lime-900/40', text: 'text-white font-extrabold' };
        case 1024: return { bg: 'bg-gradient-to-br from-emerald-400 to-teal-500 ring-2 ring-emerald-300', text: 'text-slate-950 font-black' };
        case 2048: return { bg: 'bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 shadow-2xl shadow-yellow-500/50 ring-2 ring-yellow-200 animate-pulse', text: 'text-stone-950 font-black' };
        case 4096: return { bg: 'bg-gradient-to-br from-teal-300 via-cyan-400 to-blue-500 ring-2 ring-cyan-200', text: 'text-slate-950 font-black' };
        default: return { bg: 'bg-gradient-to-br from-purple-500 to-indigo-600 ring-2 ring-purple-300', text: 'text-white font-black' };
      }

    case 'retro':
      switch (value) {
        case 2: return { bg: 'bg-neutral-800 border border-purple-700/60', text: 'text-fuchsia-300 font-bold' };
        case 4: return { bg: 'bg-purple-900 border border-purple-600', text: 'text-fuchsia-200 font-bold' };
        case 8: return { bg: 'bg-purple-800 shadow-sm', text: 'text-white font-bold' };
        case 16: return { bg: 'bg-fuchsia-800 shadow-sm', text: 'text-white font-bold' };
        case 32: return { bg: 'bg-pink-700 shadow-sm', text: 'text-white font-bold' };
        case 64: return { bg: 'bg-rose-600 shadow-sm', text: 'text-white font-bold' };
        case 128: return { bg: 'bg-amber-600 shadow-md shadow-amber-900/40', text: 'text-white font-bold' };
        case 256: return { bg: 'bg-amber-500 shadow-md shadow-amber-800/50', text: 'text-white font-bold' };
        case 512: return { bg: 'bg-cyan-600 shadow-lg shadow-cyan-900/50', text: 'text-white font-extrabold' };
        case 1024: return { bg: 'bg-gradient-to-br from-fuchsia-500 to-cyan-500 ring-2 ring-fuchsia-300', text: 'text-white font-black' };
        case 2048: return { bg: 'bg-gradient-to-br from-yellow-300 via-amber-400 to-pink-500 shadow-2xl shadow-yellow-400/50 ring-2 ring-yellow-200 animate-pulse', text: 'text-slate-950 font-black' };
        default: return { bg: 'bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500', text: 'text-white font-black' };
      }

    default: // Classic & Amber
      switch (value) {
        case 2: return { bg: 'bg-[#eee4da] shadow-sm', text: 'text-[#776e65] font-bold' };
        case 4: return { bg: 'bg-[#ede0c8] shadow-sm', text: 'text-[#776e65] font-bold' };
        case 8: return { bg: 'bg-[#f2b179] shadow-sm', text: 'text-[#f9f6f2] font-bold' };
        case 16: return { bg: 'bg-[#f59563] shadow-sm', text: 'text-[#f9f6f2] font-bold' };
        case 32: return { bg: 'bg-[#f67c5f] shadow-sm', text: 'text-[#f9f6f2] font-bold' };
        case 64: return { bg: 'bg-[#e95b3a] shadow-sm', text: 'text-[#f9f6f2] font-bold' };
        case 128: return { bg: 'bg-[#edcf72] shadow-md shadow-amber-500/20', text: 'text-[#f9f6f2] font-bold' };
        case 256: return { bg: 'bg-[#edcc61] shadow-md shadow-amber-500/30', text: 'text-[#f9f6f2] font-bold' };
        case 512: return { bg: 'bg-[#edc850] shadow-lg shadow-amber-500/40', text: 'text-[#f9f6f2] font-extrabold' };
        case 1024: return { bg: 'bg-[#edc53f] shadow-lg shadow-amber-400/40 ring-1 ring-amber-200/50', text: 'text-[#f9f6f2] font-black' };
        case 2048: return { bg: 'bg-gradient-to-br from-[#ecc440] via-[#f5cb39] to-[#f39c12] shadow-2xl shadow-amber-400/60 ring-2 ring-yellow-200 animate-pulse', text: 'text-[#f9f6f2] font-black' };
        case 4096: return { bg: 'bg-gradient-to-br from-[#3b5998] to-[#1d2f57] shadow-xl ring-2 ring-blue-300', text: 'text-[#f9f6f2] font-black' };
        case 8192: return { bg: 'bg-gradient-to-br from-[#8e44ad] to-[#2c3e50] shadow-xl ring-2 ring-purple-300', text: 'text-[#f9f6f2] font-black' };
        default: return { bg: 'bg-gradient-to-br from-[#e74c3c] to-[#c0392b] ring-2 ring-rose-300', text: 'text-[#f9f6f2] font-black' };
      }
  }
}
