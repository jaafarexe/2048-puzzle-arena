/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Achievement,
  GameSnapshot,
  GameStats,
  GameStatus,
  GridSize,
  MoveDirection,
  MoveHistoryItem,
  ThemeId,
  Tile,
} from './types/game';
import {
  createInitialTiles,
  executeMove,
  getHighestTile,
  hasAvailableMoves,
  spawnRandomTile,
} from './utils/gameLogic';
import { calculateBestMove, HintRecommendation } from './utils/aiHint';
import { soundManager } from './utils/audio';
import {
  loadAchievements,
  loadStats,
  loadTheme,
  saveAchievements,
  saveStats,
  saveTheme,
} from './utils/storage';
import { THEMES } from './utils/themeStyles';
import { Header } from './components/Header';
import { GameBoard } from './components/GameBoard';
import { Controls } from './components/Controls';
import { StatsAndHistoryModal } from './components/StatsAndHistoryModal';
import { WinModal } from './components/WinModal';
import { GameOverModal } from './components/GameOverModal';
import { RulesModal } from './components/RulesModal';
import { Trophy, Sparkles } from 'lucide-react';

export default function App() {
  // Config & Persistence
  const [gridSize, setGridSize] = useState<GridSize>(4);
  const [theme, setTheme] = useState<ThemeId>(() => loadTheme());
  const [stats, setStats] = useState<GameStats>(() => loadStats());
  const [achievements, setAchievements] = useState<Achievement[]>(() => loadAchievements());
  const [isMuted, setIsMuted] = useState<boolean>(() => soundManager.getMuted());

  // Game Engine State
  const [tiles, setTiles] = useState<Tile[]>(() => createInitialTiles(4));
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(() => stats.bestScore);
  const [scoreAddition, setScoreAddition] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('PLAYING');
  const [hasAcknowledgedWin, setHasAcknowledgedWin] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [usedUndoInCurrentGame, setUsedUndoInCurrentGame] = useState<boolean>(false);

  // Undo & History
  const [undoStack, setUndoStack] = useState<GameSnapshot[]>([]);
  const [history, setHistory] = useState<MoveHistoryItem[]>([]);

  // AI & Modals
  const [hint, setHint] = useState<HintRecommendation | null>(null);
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);
  const [statsTab, setStatsTab] = useState<'stats' | 'history' | 'achievements'>('stats');
  const [showWinModal, setShowWinModal] = useState<boolean>(false);
  const [showGameOverModal, setShowGameOverModal] = useState<boolean>(false);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Elapsed Timer
  useEffect(() => {
    if (gameStatus === 'PLAYING') {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStatus]);

  // Sync Best Score
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      setStats((prev) => {
        const next = { ...prev, bestScore: score };
        saveStats(next);
        return next;
      });
    }
  }, [score, bestScore]);

  // Achievement Check helper
  const triggerUnlock = useCallback((id: string, message: string) => {
    setAchievements((prev) => {
      const idx = prev.findIndex((a) => a.id === id);
      if (idx !== -1 && prev[idx].unlockedAt === null) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], unlockedAt: Date.now() };
        saveAchievements(updated);
        setToastMessage(`Milestone Unlocked: ${message}`);
        setTimeout(() => setToastMessage(null), 3500);
        return updated;
      }
      return prev;
    });
  }, []);

  // Check achievements after move
  const evaluateAchievements = useCallback((currentTiles: Tile[], currentScore: number, moves: number, elapsed: number, won: boolean) => {
    const peak = getHighestTile(currentTiles);

    if (peak >= 128) triggerUnlock('reach_128', 'Triple Digits (128 Tile)');
    if (peak >= 512) triggerUnlock('reach_512', 'High Velocity (512 Tile)');
    if (peak >= 1024) triggerUnlock('reach_1024', 'Apex Threshold (1024 Tile)');
    if (peak >= 2048) triggerUnlock('reach_2048', 'Arena Champion (2048 Tile)');
    if (peak >= 4096) triggerUnlock('reach_4096', 'Beyond Mythic (4096 Tile)');
    if (moves >= 100) triggerUnlock('marathon_100', 'Centurion (100 Moves)');
    if (currentScore >= 10000) triggerUnlock('score_10k', 'High Roller (10,000 Pts)');

    if (won && !usedUndoInCurrentGame) {
      triggerUnlock('pure_victory', 'Pure Instinct (Won with zero Undos)');
    }
    if (won && elapsed <= 180) {
      triggerUnlock('speed_demon', 'Speedrunner (Won under 3 minutes)');
    }
  }, [triggerUnlock, usedUndoInCurrentGame]);

  // Perform Move Handler
  const handleMove = useCallback((direction: MoveDirection) => {
    if (gameStatus === 'GAME_OVER') return;

    const moveResult = executeMove(tiles, direction, gridSize);
    if (!moveResult.moved) return;

    // Save snapshot for Undo
    const snapshot: GameSnapshot = {
      tiles: tiles.map((t) => ({ ...t })),
      score,
      moveCount,
      status: gameStatus,
      history: [...history],
      elapsedSeconds,
    };
    setUndoStack((prev) => [...prev.slice(-25), snapshot]); // Store up to 25 undos

    // Sound effects
    if (moveResult.mergedCount > 0) {
      soundManager.playMerge(moveResult.maxMergedValue);
      triggerUnlock('first_merge', 'First Fusion (Merged matching tiles)');
    } else {
      soundManager.playMove();
    }

    // Spawn new tile
    const spawnRes = spawnRandomTile(moveResult.nextTiles, gridSize);
    const finalTiles = spawnRes ? spawnRes.updatedTiles : moveResult.nextTiles;

    const newScore = score + moveResult.scoreGained;
    const nextMoveCount = moveCount + 1;
    setTiles(finalTiles);
    setScore(newScore);
    if (moveResult.scoreGained > 0) {
      setScoreAddition(moveResult.scoreGained);
    }
    setMoveCount(nextMoveCount);
    setHint(null); // Clear active hint

    // Update Move History
    const historyItem: MoveHistoryItem = {
      id: `m_${Date.now()}_${nextMoveCount}`,
      moveNumber: nextMoveCount,
      direction,
      scoreGained: moveResult.scoreGained,
      maxTile: getHighestTile(finalTiles),
      timestamp: Date.now(),
    };
    setHistory((prev) => [...prev, historyItem]);

    // Check Win Condition (2048)
    const highest = getHighestTile(finalTiles);
    let isWinMove = false;
    if (highest >= 2048 && !hasAcknowledgedWin && gameStatus !== 'WON') {
      setGameStatus('WON');
      setShowWinModal(true);
      soundManager.playWin();
      isWinMove = true;

      // Update Win stats
      setStats((prev) => {
        const next: GameStats = {
          ...prev,
          gamesWon: prev.gamesWon + 1,
          currentStreak: prev.currentStreak + 1,
          bestStreak: Math.max(prev.bestStreak, prev.currentStreak + 1),
          fastestWinSeconds: prev.fastestWinSeconds
            ? Math.min(prev.fastestWinSeconds, elapsedSeconds)
            : elapsedSeconds,
        };
        saveStats(next);
        return next;
      });
    }

    // Evaluate Achievements
    evaluateAchievements(finalTiles, newScore, nextMoveCount, elapsedSeconds, isWinMove);

    // Update highest tile stat
    if (highest > stats.highestTile) {
      setStats((prev) => {
        const next = { ...prev, highestTile: highest };
        saveStats(next);
        return next;
      });
    }

    // Check Game Over
    if (!hasAvailableMoves(finalTiles, gridSize)) {
      setGameStatus('GAME_OVER');
      setShowGameOverModal(true);
      soundManager.playGameOver();

      // Record finished game stats
      setStats((prev) => {
        const next: GameStats = {
          ...prev,
          gamesPlayed: prev.gamesPlayed + 1,
          totalMoves: prev.totalMoves + nextMoveCount,
          totalScore: prev.totalScore + newScore,
          currentStreak: 0,
        };
        saveStats(next);
        return next;
      });
    }
  }, [
    tiles,
    score,
    moveCount,
    gameStatus,
    history,
    elapsedSeconds,
    gridSize,
    hasAcknowledgedWin,
    evaluateAchievements,
    triggerUnlock,
    stats.highestTile,
  ]);

  // Undo Handler
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;

    const previous = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));

    setTiles(previous.tiles);
    setScore(previous.score);
    setMoveCount(previous.moveCount);
    setGameStatus(previous.status);
    setHistory(previous.history);
    setElapsedSeconds(previous.elapsedSeconds);
    setUsedUndoInCurrentGame(true);
    setHint(null);
    setShowGameOverModal(false);

    soundManager.playUndo();
  }, [undoStack]);

  // New Game Handler
  const handleNewGame = useCallback(() => {
    // Record game played if moved at least 5 times and not already game over
    if (moveCount >= 5 && gameStatus === 'PLAYING') {
      setStats((prev) => {
        const next: GameStats = {
          ...prev,
          gamesPlayed: prev.gamesPlayed + 1,
          totalMoves: prev.totalMoves + moveCount,
          totalScore: prev.totalScore + score,
        };
        saveStats(next);
        return next;
      });
    }

    const initial = createInitialTiles(gridSize);
    setTiles(initial);
    setScore(0);
    setScoreAddition(0);
    setMoveCount(0);
    setGameStatus('PLAYING');
    setHasAcknowledgedWin(false);
    setElapsedSeconds(0);
    setUsedUndoInCurrentGame(false);
    setUndoStack([]);
    setHistory([]);
    setHint(null);
    setShowWinModal(false);
    setShowGameOverModal(false);

    soundManager.playMove();
  }, [gridSize, moveCount, gameStatus, score]);

  // Change Grid Size Handler
  const handleChangeGridSize = (size: GridSize) => {
    if (size === gridSize) return;
    setGridSize(size);
    const initial = createInitialTiles(size);
    setTiles(initial);
    setScore(0);
    setScoreAddition(0);
    setMoveCount(0);
    setGameStatus('PLAYING');
    setHasAcknowledgedWin(false);
    setElapsedSeconds(0);
    setUsedUndoInCurrentGame(false);
    setUndoStack([]);
    setHistory([]);
    setHint(null);
    setShowWinModal(false);
    setShowGameOverModal(false);
  };

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input or modal is active that needs typing
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (showStatsModal || showWinModal || showGameOverModal || showRulesModal) {
        if (e.key === 'Escape') {
          setShowStatsModal(false);
          setShowWinModal(false);
          setShowGameOverModal(false);
          setShowRulesModal(false);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          handleMove('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          handleMove('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          handleMove('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          handleMove('RIGHT');
          break;
        case 'z':
        case 'Z':
        case 'u':
        case 'U':
        case 'Backspace':
          e.preventDefault();
          handleUndo();
          break;
        case 'h':
        case 'H':
          e.preventDefault();
          handleGetHint();
          break;
        case 'n':
        case 'N':
        case 'r':
        case 'R':
          e.preventDefault();
          handleNewGame();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleMove,
    handleUndo,
    handleNewGame,
    showStatsModal,
    showWinModal,
    showGameOverModal,
    showRulesModal,
  ]);

  // AI Hint generator
  const handleGetHint = () => {
    const rec = calculateBestMove(tiles, gridSize);
    if (rec) {
      setHint(rec);
    }
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  // Cycle Theme
  const handleToggleTheme = () => {
    const themesList: ThemeId[] = ['classic', 'midnight', 'emerald', 'amber', 'retro'];
    const currentIdx = themesList.indexOf(theme);
    const nextTheme = themesList[(currentIdx + 1) % themesList.length];
    setTheme(nextTheme);
    saveTheme(nextTheme);
  };

  const themeConfig = THEMES[theme] || THEMES.classic;

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-500 font-sans ${themeConfig.bgClass} text-neutral-100`}>
      {/* Top Header & HUD */}
      <div>
        <Header
          score={score}
          bestScore={bestScore}
          scoreAddition={scoreAddition}
          moveCount={moveCount}
          elapsedSeconds={elapsedSeconds}
          gridSize={gridSize}
          onChangeGridSize={handleChangeGridSize}
          onNewGame={handleNewGame}
          onUndo={handleUndo}
          canUndo={undoStack.length > 0}
          undoCount={undoStack.length}
          onOpenStats={() => {
            setStatsTab('stats');
            setShowStatsModal(true);
          }}
          onOpenAchievements={() => {
            setStatsTab('achievements');
            setShowStatsModal(true);
          }}
          onOpenRules={() => setShowRulesModal(true)}
          onToggleTheme={handleToggleTheme}
          currentTheme={theme}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onGetHint={handleGetHint}
          hintActive={hint !== null}
        />

        {/* Milestone Achievement Toast */}
        {toastMessage && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 text-slate-950 font-bold text-xs shadow-2xl shadow-amber-500/40 animate-in fade-in slide-in-from-top-3 duration-300">
            <Trophy className="w-4 h-4 fill-slate-950" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Main Game Center Area */}
        <main className="w-full max-w-4xl mx-auto px-4 py-2 flex flex-col items-center justify-center">
          <div className="w-full max-w-[460px] space-y-4">
            {/* The 2048 Game Board */}
            <GameBoard
              tiles={tiles}
              size={gridSize}
              theme={theme}
              onMove={handleMove}
              disabled={gameStatus === 'GAME_OVER'}
            />

            {/* On-screen Controls, D-Pad, and Hint Indicator */}
            <Controls
              onMove={handleMove}
              onUndo={handleUndo}
              canUndo={undoStack.length > 0}
              onNewGame={handleNewGame}
              hint={hint}
              onClearHint={() => setHint(null)}
            />
          </div>
        </main>
      </div>

      {/* Quiet, Human Editorial Footer */}
      <footer className="w-full max-w-4xl mx-auto px-4 py-4 text-center text-xs text-neutral-500 border-t border-neutral-800/60 mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span>2048 Puzzle Arena</span>
          <span aria-hidden="true">·</span>
          <span>Offline Local Play</span>
          <span aria-hidden="true">·</span>
          <span>Zero Server Lag</span>
        </div>
        <div className="flex items-center gap-4 text-neutral-400">
          <button
            onClick={() => {
              setStatsTab('history');
              setShowStatsModal(true);
            }}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Move History
          </button>
          <button
            onClick={() => setShowRulesModal(true)}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Shortcuts
          </button>
        </div>
      </footer>

      {/* Modals */}
      <StatsAndHistoryModal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        stats={stats}
        history={history}
        achievements={achievements}
        currentTiles={tiles}
        initialTab={statsTab}
      />

      <WinModal
        isOpen={showWinModal}
        score={score}
        moveCount={moveCount}
        elapsedSeconds={elapsedSeconds}
        onKeepGoing={() => {
          setHasAcknowledgedWin(true);
          setShowWinModal(false);
        }}
        onNewGame={handleNewGame}
        onClose={() => setShowWinModal(false)}
      />

      <GameOverModal
        isOpen={showGameOverModal}
        score={score}
        bestScore={bestScore}
        highestTile={getHighestTile(tiles)}
        moveCount={moveCount}
        onNewGame={handleNewGame}
        onUndo={handleUndo}
        canUndo={undoStack.length > 0}
        onClose={() => setShowGameOverModal(false)}
      />

      <RulesModal
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
      />
    </div>
  );
}
