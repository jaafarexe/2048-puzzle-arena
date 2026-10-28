/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GridSize, MoveDirection, Tile } from '../types/game';
import { executeMove, getEmptyCells, tilesToGrid } from './gameLogic';

export interface HintRecommendation {
  direction: MoveDirection;
  reason: string;
  scoreBonus: number;
}

export function calculateBestMove(tiles: Tile[], size: GridSize): HintRecommendation | null {
  const directions: MoveDirection[] = ['LEFT', 'DOWN', 'RIGHT', 'UP'];
  const candidates: { direction: MoveDirection; evalScore: number; reason: string; scoreBonus: number }[] = [];

  for (const dir of directions) {
    const moveRes = executeMove(tiles, dir, size);
    if (!moveRes.moved) continue;

    // Evaluate position after move
    const nextTiles = moveRes.nextTiles;
    const grid = tilesToGrid(nextTiles, size);
    const emptyCount = getEmptyCells(nextTiles, size).length;

    // 1. Monotonicity score
    let monoScore = 0;
    // Check horizontal monotonicity
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size - 1; c++) {
        const val1 = grid[r][c]?.value || 0;
        const val2 = grid[r][c + 1]?.value || 0;
        if (val1 >= val2) monoScore += 1;
        if (val1 === val2 && val1 > 0) monoScore += 2;
      }
    }
    // Check vertical monotonicity
    for (let c = 0; c < size; c++) {
      for (let r = 0; r < size - 1; r++) {
        const val1 = grid[r][c]?.value || 0;
        const val2 = grid[r + 1][c]?.value || 0;
        if (val1 >= val2) monoScore += 1;
        if (val1 === val2 && val1 > 0) monoScore += 2;
      }
    }

    // 2. Corner bonus: highest tile in corner (prefer bottom-left or top-left)
    let maxTile = 0;
    let maxTileInCorner = false;
    for (const t of nextTiles) {
      if (t.value > maxTile) {
        maxTile = t.value;
      }
    }
    const corners = [
      grid[0][0],
      grid[0][size - 1],
      grid[size - 1][0],
      grid[size - 1][size - 1],
    ];
    for (const corner of corners) {
      if (corner && corner.value === maxTile) {
        maxTileInCorner = true;
        break;
      }
    }

    // 3. Smoothness penalty (difference between adjacent values)
    let smoothness = 0;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const val = grid[r][c]?.value;
        if (!val) continue;
        if (c + 1 < size && grid[r][c + 1]?.value) {
          smoothness -= Math.abs(Math.log2(val) - Math.log2(grid[r][c + 1]!.value));
        }
        if (r + 1 < size && grid[r + 1][c]?.value) {
          smoothness -= Math.abs(Math.log2(val) - Math.log2(grid[r + 1]![c]!.value));
        }
      }
    }

    let evalScore =
      emptyCount * 25 +
      monoScore * 10 +
      (maxTileInCorner ? 50 : 0) +
      smoothness * 4 +
      moveRes.scoreGained * 0.2;

    let reason = '';
    if (moveRes.scoreGained > 0) {
      reason = `Merges tiles for +${moveRes.scoreGained} pts and frees ${emptyCount} cells`;
    } else if (maxTileInCorner) {
      reason = `Safeguards max tile (${maxTile}) along the edge`;
    } else {
      reason = `Maintains high board flexibility with ${emptyCount} free cells`;
    }

    candidates.push({
      direction: dir,
      evalScore,
      reason,
      scoreBonus: moveRes.scoreGained,
    });
  }

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => b.evalScore - a.evalScore);
  return {
    direction: candidates[0].direction,
    reason: candidates[0].reason,
    scoreBonus: candidates[0].scoreBonus,
  };
}
