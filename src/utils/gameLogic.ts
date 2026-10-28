/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GridSize, MoveDirection, Tile } from '../types/game';

let tileCounter = 0;
export function generateTileId(): string {
  tileCounter += 1;
  return `tile_${Date.now()}_${tileCounter}_${Math.random().toString(36).slice(2, 7)}`;
}

export function createEmptyGrid(size: GridSize): (Tile | null)[][] {
  const grid: (Tile | null)[][] = [];
  for (let r = 0; r < size; r++) {
    const row: (Tile | null)[] = [];
    for (let c = 0; c < size; c++) {
      row.push(null);
    }
    grid.push(row);
  }
  return grid;
}

export function tilesToGrid(tiles: Tile[], size: GridSize): (Tile | null)[][] {
  const grid = createEmptyGrid(size);
  for (const tile of tiles) {
    if (tile.row >= 0 && tile.row < size && tile.col >= 0 && tile.col < size) {
      grid[tile.row][tile.col] = tile;
    }
  }
  return grid;
}

export function getEmptyCells(tiles: Tile[], size: GridSize): { row: number; col: number }[] {
  const grid = tilesToGrid(tiles, size);
  const emptyCells: { row: number; col: number }[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!grid[r][c]) {
        emptyCells.push({ row: r, col: c });
      }
    }
  }
  return emptyCells;
}

export function spawnRandomTile(tiles: Tile[], size: GridSize): { newTile: Tile; updatedTiles: Tile[] } | null {
  const empty = getEmptyCells(tiles, size);
  if (empty.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * empty.length);
  const cell = empty[randomIndex];
  const value = Math.random() < 0.9 ? 2 : 4;

  const newTile: Tile = {
    id: generateTileId(),
    value,
    row: cell.row,
    col: cell.col,
    isNew: true,
  };

  const updatedTiles: Tile[] = [...tiles.map(t => ({ ...t, isNew: false, isMerged: false })), newTile];
  return { newTile, updatedTiles };
}

export function createInitialTiles(size: GridSize): Tile[] {
  const tiles: Tile[] = [];
  const firstEmpty = getEmptyCells(tiles, size);
  const pos1 = firstEmpty[Math.floor(Math.random() * firstEmpty.length)];
  const tile1: Tile = {
    id: generateTileId(),
    value: Math.random() < 0.9 ? 2 : 4,
    row: pos1.row,
    col: pos1.col,
    isNew: true,
  };
  tiles.push(tile1);

  const secondEmpty = getEmptyCells(tiles, size);
  const pos2 = secondEmpty[Math.floor(Math.random() * secondEmpty.length)];
  const tile2: Tile = {
    id: generateTileId(),
    value: Math.random() < 0.9 ? 2 : 4,
    row: pos2.row,
    col: pos2.col,
    isNew: true,
  };
  tiles.push(tile2);

  return tiles;
}

export interface MoveResult {
  nextTiles: Tile[];
  scoreGained: number;
  moved: boolean;
  mergedCount: number;
  maxMergedValue: number;
}

export function executeMove(tiles: Tile[], direction: MoveDirection, size: GridSize): MoveResult {
  const grid = tilesToGrid(tiles, size);
  let scoreGained = 0;
  let moved = false;
  let mergedCount = 0;
  let maxMergedValue = 0;

  const newTiles: Tile[] = [];

  // Helper vectors for directions
  const isHorizontal = direction === 'LEFT' || direction === 'RIGHT';
  const isForward = direction === 'RIGHT' || direction === 'DOWN';

  for (let i = 0; i < size; i++) {
    // Extract line of tiles
    const line: Tile[] = [];
    for (let j = 0; j < size; j++) {
      const r = isHorizontal ? i : j;
      const c = isHorizontal ? j : i;
      const t = grid[r][c];
      if (t) line.push(t);
    }

    if (isForward) {
      line.reverse();
    }

    const processedLine: Tile[] = [];
    let skipNext = false;

    for (let k = 0; k < line.length; k++) {
      if (skipNext) {
        skipNext = false;
        continue;
      }

      const current = line[k];
      const next = line[k + 1];

      if (next && current.value === next.value) {
        // Merge tiles
        const mergedValue = current.value * 2;
        scoreGained += mergedValue;
        mergedCount += 1;
        if (mergedValue > maxMergedValue) {
          maxMergedValue = mergedValue;
        }

        const targetIndex = isForward ? size - 1 - processedLine.length : processedLine.length;
        const targetRow = isHorizontal ? i : targetIndex;
        const targetCol = isHorizontal ? targetIndex : i;

        // The merged tile gets a fresh ID or inherits current to trigger pop animation
        processedLine.push({
          id: generateTileId(),
          value: mergedValue,
          row: targetRow,
          col: targetCol,
          isMerged: true,
          isNew: false,
        });

        moved = true;
        skipNext = true;
      } else {
        const targetIndex = isForward ? size - 1 - processedLine.length : processedLine.length;
        const targetRow = isHorizontal ? i : targetIndex;
        const targetCol = isHorizontal ? targetIndex : i;

        if (current.row !== targetRow || current.col !== targetCol) {
          moved = true;
        }

        processedLine.push({
          ...current,
          row: targetRow,
          col: targetCol,
          isMerged: false,
          isNew: false,
        });
      }
    }

    newTiles.push(...processedLine);
  }

  return {
    nextTiles: newTiles,
    scoreGained,
    moved,
    mergedCount,
    maxMergedValue,
  };
}

export function hasAvailableMoves(tiles: Tile[], size: GridSize): boolean {
  if (getEmptyCells(tiles, size).length > 0) {
    return true;
  }

  const grid = tilesToGrid(tiles, size);

  // Check for any horizontal or vertical adjacent match
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const current = grid[r][c];
      if (!current) return true;

      // Check right neighbor
      if (c + 1 < size) {
        const right = grid[r][c + 1];
        if (right && right.value === current.value) return true;
      }

      // Check down neighbor
      if (r + 1 < size) {
        const down = grid[r + 1][c];
        if (down && down.value === current.value) return true;
      }
    }
  }

  return false;
}

export function getHighestTile(tiles: Tile[]): number {
  if (tiles.length === 0) return 0;
  return Math.max(...tiles.map(t => t.value));
}
