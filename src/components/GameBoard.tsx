/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { GridSize, MoveDirection, ThemeId, Tile } from '../types/game';
import { getTileStyle, THEMES } from '../utils/themeStyles';

interface GameBoardProps {
  tiles: Tile[];
  size: GridSize;
  theme: ThemeId;
  onMove: (direction: MoveDirection) => void;
  disabled?: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  tiles,
  size,
  theme,
  onMove,
  disabled = false,
}) => {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const themeConfig = THEMES[theme] || THEMES.classic;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (disabled || !touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    const minSwipeDistance = 30;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (Math.max(absX, absY) < minSwipeDistance) return;

    if (absX > absY) {
      if (deltaX > 0) {
        onMove('RIGHT');
      } else {
        onMove('LEFT');
      }
    } else {
      if (deltaY > 0) {
        onMove('DOWN');
      } else {
        onMove('UP');
      }
    }
  };

  // Gap and size calculations based on grid size
  const gapPx = size === 3 ? 14 : size === 4 ? 12 : 10;
  const paddingPx = size === 3 ? 16 : size === 4 ? 14 : 12;

  // Background slot cells
  const backgroundSlots: { row: number; col: number }[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      backgroundSlots.push({ row: r, col: c });
    }
  }

  // Calculate font size according to tile number length and grid size
  const getFontSize = (val: number) => {
    const len = val.toString().length;
    if (size === 5) {
      if (len <= 2) return 'text-xl sm:text-2xl';
      if (len === 3) return 'text-lg sm:text-xl';
      if (len === 4) return 'text-base sm:text-lg';
      return 'text-xs sm:text-sm';
    }
    if (size === 3) {
      if (len <= 2) return 'text-3xl sm:text-5xl';
      if (len === 3) return 'text-2xl sm:text-4xl';
      if (len === 4) return 'text-xl sm:text-3xl';
      return 'text-lg sm:text-2xl';
    }
    // 4x4 default
    if (len <= 2) return 'text-2xl sm:text-4xl';
    if (len === 3) return 'text-xl sm:text-3xl';
    if (len === 4) return 'text-lg sm:text-2xl';
    return 'text-sm sm:text-xl';
  };

  return (
    <div className="relative w-full max-w-[460px] mx-auto select-none touch-none">
      {/* Aspect Ratio Box */}
      <div
        className={`relative w-full pb-[100%] rounded-2xl p-3 border shadow-2xl transition-colors duration-300 ${themeConfig.boardBg}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.45)',
        }}
      >
        <div className="absolute inset-0 p-3 sm:p-3.5">
          {/* Static Background Slots */}
          <div
            className="w-full h-full grid"
            style={{
              gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
              gap: `${gapPx}px`,
            }}
          >
            {backgroundSlots.map((slot) => (
              <div
                key={`slot-${slot.row}-${slot.col}`}
                className={`w-full h-full rounded-xl transition-colors ${themeConfig.cellBg}`}
              />
            ))}
          </div>

          {/* Active Animated Tiles Layer */}
          <div className="absolute inset-0 p-3 sm:p-3.5 pointer-events-none">
            {tiles.map((tile) => {
              const style = getTileStyle(tile.value, theme);
              const fontSizeClass = getFontSize(tile.value);

              // Percentage coordinates calculation
              // Width of one tile: (100% - (size - 1) * gap) / size
              const leftPercent = `calc(${tile.col} * ((100% - ${(size - 1) * gapPx}px) / ${size} + ${gapPx}px))`;
              const topPercent = `calc(${tile.row} * ((100% - ${(size - 1) * gapPx}px) / ${size} + ${gapPx}px))`;
              const tileSize = `calc((100% - ${(size - 1) * gapPx}px) / ${size})`;

              return (
                <div
                  key={tile.id}
                  className={`absolute rounded-xl flex items-center justify-center font-extrabold transition-all duration-150 ease-out will-change-transform ${style.bg} ${style.text} ${fontSizeClass} ${
                    tile.isNew ? 'animate-tile-appear' : ''
                  } ${tile.isMerged ? 'animate-tile-pop' : ''}`}
                  style={{
                    left: leftPercent,
                    top: topPercent,
                    width: tileSize,
                    height: tileSize,
                    zIndex: tile.isMerged ? 20 : 10,
                  }}
                >
                  <span className="font-mono tabular-nums leading-none tracking-tight">
                    {tile.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
