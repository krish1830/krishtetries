
import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Board, 
  Position, 
  Tetromino, 
  Direction, 
  Shape,
  Difficulty,
  UserProfile,
  ActivePiece
} from '../types';
import { 
  COLS, 
  ROWS, 
  getRandomTetromino, 
  MIN_DROP_SPEED,
  LEVEL_MILESTONES,
  DHANDAM_SCORE_TARGET
} from '../constants';
import { useSound } from './useSound';

const createEmptyBoard = (): Board => 
  Array.from({ length: ROWS }, () => Array(COLS).fill(null));

// Scoring scales generously with level so reaching 10k, 20k... 100k feels rewarding and achievable
const SCORING = [0, 250, 750, 1500, 3500];
const T_SPIN_BONUS = [600, 1200, 1800, 2400];

const KICKS_JLTSZ: Record<string, Position[]> = {
  '0->1': [{x: 0, y: 0}, {x: -1, y: 0}, {x: -1, y: -1}, {x: 0, y: 2}, {x: -1, y: 2}],
  '1->2': [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: -2}, {x: 1, y: -2}],
  '2->3': [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: -1}, {x: 0, y: 2}, {x: 1, y: 2}],
  '3->0': [{x: 0, y: 0}, {x: -1, y: 0}, {x: -1, y: 1}, {x: 0, y: -2}, {x: -1, y: -2}],
};

const KICKS_I: Record<string, Position[]> = {
  '0->1': [{x: 0, y: 0}, {x: -2, y: 0}, {x: 1, y: 0}, {x: -2, y: 1}, {x: 1, y: -2}],
  '1->2': [{x: 0, y: 0}, {x: -1, y: 0}, {x: 2, y: 0}, {x: -1, y: -2}, {x: 2, y: 1}],
  '2->3': [{x: 0, y: 0}, {x: 2, y: 0}, {x: -1, y: 0}, {x: 2, y: -1}, {x: -1, y: 2}],
  '3->0': [{x: 0, y: 0}, {x: 1, y: 0}, {x: -2, y: 0}, {x: 1, y: 2}, {x: -2, y: -1}],
};

const GENERAL_KICKS: Position[] = [
  {x: 0, y: 0}, {x: -1, y: 0}, {x: 1, y: 0}, {x: 0, y: -1}, {x: -2, y: 0}, {x: 2, y: 0}
];

export interface LevelUpEvent {
  level: number;
  title: string;
  shapeNames: string[];
  description: string;
}

export const useTetris = (activeProfile: UserProfile | null) => {
  const { playMove, playRotate, playClear, playDrop, playGameOver, playBomb, playLevelUp, playDhandamVictory } = useSound();
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [activePiece, setActivePiece] = useState<ActivePiece | null>(null);
  const [nextPiece, setNextPiece] = useState<Tetromino>(getRandomTetromino(1));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [bombs, setBombs] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Medium);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [hasSave, setHasSave] = useState(false);
  
  // Progression & Milestones
  const [levelUpEvent, setLevelUpEvent] = useState<LevelUpEvent | null>(null);
  const [showDhandamBanner, setShowDhandamBanner] = useState(false);
  const [hasAwardedDhandam, setHasAwardedDhandam] = useState(false);

  const timerRef = useRef<number | null>(null);
  const isLastMoveRotation = useRef(false);
  const levelRef = useRef(level);
  levelRef.current = level;

  // Maintain activePiece and board in refs for the game loop to access latest state without re-registering interval
  const activePieceRef = useRef<ActivePiece | null>(null);
  const boardRef = useRef<Board>(board);
  activePieceRef.current = activePiece;
  boardRef.current = board;

  const profileId = activeProfile?.id;
  const profileBestScore = activeProfile?.tetrisStats.bestScore;

  const getSaveKey = useCallback(() => {
    return profileId ? `tetris_save_${profileId}` : null;
  }, [profileId]);

  useEffect(() => {
    const key = getSaveKey();
    if (key) {
      const saved = localStorage.getItem(key);
      setHasSave(!!saved);
    } else {
      setHasSave(false);
    }
  }, [getSaveKey]);

  useEffect(() => {
    if (typeof profileBestScore === 'number') {
      setHighScore(profileBestScore);
    }
  }, [profileBestScore]);

  const checkCollision = useCallback((shape: Shape, pos: Position, currentBoard: Board): boolean => {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const newX = pos.x + x;
          const newY = pos.y + y;
          if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && currentBoard[newY][newX] !== null)) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  const isTSpinMove = (piece: ActivePiece, currentBoard: Board): boolean => {
    if (piece.tetromino.id !== 'T' || !isLastMoveRotation.current) return false;
    const corners = [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 2 }, { x: 2, y: 2 }];
    let occupiedCorners = 0;
    for (const corner of corners) {
      const boardX = piece.position.x + corner.x;
      const boardY = piece.position.y + corner.y;
      if (boardX < 0 || boardX >= COLS || boardY >= ROWS || (boardY >= 0 && currentBoard[boardY][boardX] !== null)) {
        occupiedCorners++;
      }
    }
    return occupiedCorners >= 3;
  };

  const finalizePiece = useCallback((pieceToLock: ActivePiece) => {
    setBoard(prevBoard => {
      const newBoard = prevBoard.map(row => [...row]);
      pieceToLock.tetromino.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            const boardY = pieceToLock.position.y + y;
            const boardX = pieceToLock.position.x + x;
            if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
              newBoard[boardY][boardX] = pieceToLock.tetromino.color;
            }
          }
        });
      });

      const tSpin = isTSpinMove(pieceToLock, prevBoard);
      let clearedCount = 0;
      const filteredBoard = newBoard.filter(row => {
        const isFull = row.every(cell => cell !== null);
        if (isFull) clearedCount++;
        return !isFull;
      });

      while (filteredBoard.length < ROWS) filteredBoard.unshift(Array(COLS).fill(null));

      const currentLvl = levelRef.current;
      let points = (SCORING[clearedCount] || 0) * currentLvl;
      if (tSpin) points += (T_SPIN_BONUS[Math.min(clearedCount, 3)] || 0) * currentLvl;

      if (clearedCount > 0 || tSpin) {
        if (clearedCount > 0) playClear(clearedCount);
        setScore(prevScore => {
          const newScore = prevScore + points;
          if (newScore > highScore) setHighScore(newScore);

          // Calculate new level based on each 10,000 points!
          const calculatedLevel = Math.min(10, Math.floor(newScore / 10000) + 1);
          if (calculatedLevel > currentLvl) {
            setLevel(calculatedLevel);
            levelRef.current = calculatedLevel;
            setBombs(b => b + 1); // Reward bonus bomb for each 10,000 point level-up!
            playLevelUp();

            const milestone = LEVEL_MILESTONES.find(m => m.level === calculatedLevel);
            if (milestone) {
              setLevelUpEvent({
                level: milestone.level,
                title: milestone.title,
                shapeNames: milestone.shapeNames,
                description: milestone.description,
              });
            }
          }

          // Check if player crossed 100,000 score threshold for the supreme "Dhandam ra dhootha" award!
          if (newScore >= DHANDAM_SCORE_TARGET && !hasAwardedDhandam) {
            setHasAwardedDhandam(true);
            setShowDhandamBanner(true);
            playDhandamVictory();
          }

          return newScore;
        });
        if (clearedCount > 0) setLines(l => l + clearedCount);
      } else {
        playDrop();
      }
      return filteredBoard;
    });
    setActivePiece(null);
    isLastMoveRotation.current = false;
  }, [highScore, playClear, playDrop, playLevelUp, playDhandamVictory, hasAwardedDhandam]);

  const move = useCallback((dir: Direction) => {
    const active = activePieceRef.current;
    if (!active || paused || gameOver || !isGameStarted) return false;
    const newPos = {
      x: active.position.x + (dir === Direction.Down ? 0 : dir),
      y: active.position.y + (dir === Direction.Down ? 1 : 0)
    };
    if (!checkCollision(active.tetromino.shape, newPos, boardRef.current)) {
      setActivePiece({ ...active, position: newPos });
      if (dir !== Direction.Down) {
        playMove();
        isLastMoveRotation.current = false;
      }
      return true;
    }
    if (dir === Direction.Down) finalizePiece(active);
    return false;
  }, [checkCollision, paused, gameOver, finalizePiece, isGameStarted, playMove]);

  const rotate = useCallback(() => {
    const active = activePieceRef.current;
    if (!active || paused || gameOver || !isGameStarted) return;
    if (active.tetromino.id === 'O') { playRotate(); return; }
    const currentRotation = active.rotationIndex;
    const nextRotation = (currentRotation + 1) % 4;
    const rotatedShape = active.tetromino.shape[0].map((_, index) =>
      active.tetromino.shape.map(col => col[index]).reverse()
    );
    const kickKey = `${currentRotation}->${nextRotation}`;
    let kicks = active.tetromino.id === 'I' || active.tetromino.id === 'LONG_5' 
      ? KICKS_I[kickKey] || GENERAL_KICKS
      : KICKS_JLTSZ[kickKey] || GENERAL_KICKS;

    // Combine with general kicks to ensure exotic pieces rotate smoothly near borders
    const kickCandidates = [...kicks, ...GENERAL_KICKS];
    for (const kick of kickCandidates) {
      const testPos = { x: active.position.x + kick.x, y: active.position.y + kick.y };
      if (!checkCollision(rotatedShape, testPos, boardRef.current)) {
        setActivePiece({ ...active, position: testPos, rotationIndex: nextRotation, tetromino: { ...active.tetromino, shape: rotatedShape } });
        playRotate();
        isLastMoveRotation.current = true;
        return;
      }
    }
  }, [checkCollision, paused, gameOver, isGameStarted, playRotate]);

  const hardDrop = useCallback(() => {
    const active = activePieceRef.current;
    if (!active || paused || gameOver || !isGameStarted) return;
    let newY = active.position.y;
    while (!checkCollision(active.tetromino.shape, { x: active.position.x, y: newY + 1 }, boardRef.current)) {
      newY++;
    }
    const dropDistance = newY - active.position.y;
    if (dropDistance > 0) {
      setScore(s => s + dropDistance * 2); // Hard drop precision bonus
    }
    finalizePiece({ ...active, position: { ...active.position, y: newY } });
  }, [checkCollision, paused, gameOver, isGameStarted, finalizePiece]);

  const startGame = useCallback((selectedDifficulty: Difficulty = Difficulty.Medium) => {
    setDifficulty(selectedDifficulty);
    setIsGameStarted(true);
    setGameOver(false);
    setPaused(false);
    setBoard(createEmptyBoard());
    setScore(0);
    setLevel(1);
    levelRef.current = 1;
    setLines(0);
    setBombs(1);
    setActivePiece(null);
    setNextPiece(getRandomTetromino(1));
    setLevelUpEvent(null);
    setShowDhandamBanner(false);
    setHasAwardedDhandam(false);
    isLastMoveRotation.current = false;
  }, []);

  const spawnPiece = useCallback(() => {
    const piece = nextPiece;
    const shapeWidth = piece.shape[0]?.length || 3;
    const spawnPos = { x: Math.max(0, Math.floor((COLS - shapeWidth) / 2)), y: 0 };
    if (checkCollision(piece.shape, spawnPos, boardRef.current)) {
      setGameOver(true);
      playGameOver();
      return;
    }
    setActivePiece({ tetromino: piece, position: spawnPos, rotationIndex: 0 });
    setNextPiece(getRandomTetromino(levelRef.current));
    isLastMoveRotation.current = false;
  }, [nextPiece, checkCollision, playGameOver]);

  useEffect(() => {
    if (isGameStarted && !activePiece && !gameOver && !paused) spawnPiece();
  }, [activePiece, gameOver, paused, spawnPiece, isGameStarted]);

  useEffect(() => {
    if (gameOver || paused || !isGameStarted) return;
    // Speed scales with level (every 10,000 score brings new level & faster pace)
    const speed = Math.max(MIN_DROP_SPEED, 750 - (level - 1) * 65);
    timerRef.current = window.setInterval(() => move(Direction.Down), speed);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [level, gameOver, paused, isGameStarted, move]);

  const useBomb = useCallback(() => {
    if (bombs <= 0 || !isGameStarted || paused || gameOver) return;
    setBombs(prev => prev - 1);
    playBomb();
    setBoard(prev => {
      const newBoard = [...prev];
      for (let i = 0; i < 4; i++) { newBoard.pop(); newBoard.unshift(Array(COLS).fill(null)); }
      return newBoard;
    });
  }, [bombs, isGameStarted, paused, gameOver, playBomb]);

  const dismissLevelUp = useCallback(() => {
    setLevelUpEvent(null);
  }, []);

  const dismissDhandamBanner = useCallback(() => {
    setShowDhandamBanner(false);
  }, []);

  return { 
    board, activePiece, nextPiece, score, highScore, level, lines, bombs, useBomb, 
    gameOver, paused, difficulty, isGameStarted, setPaused, move, rotate, 
    hardDrop, resetGame: () => setIsGameStarted(false), startGame, resumeGame: () => {}, hasSave,
    levelUpEvent, dismissLevelUp, showDhandamBanner, dismissDhandamBanner, hasAwardedDhandam,
    checkCollision
  };
};
