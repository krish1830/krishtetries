
import { Tetromino } from './types';

export const COLS = 10;
export const ROWS = 20;
export const INITIAL_DROP_SPEED = 800;
export const MIN_DROP_SPEED = 100;

export const TETROMINOES: Record<string, Tetromino> = {
  // Standard Tetrominoes (Level 1+)
  I: {
    id: 'I',
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: 'bg-amber-400', // Electric Gold
  },
  J: {
    id: 'J',
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: 'bg-indigo-500', // Deep Indigo
  },
  L: {
    id: 'L',
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: 'bg-rose-500', // Pinkish Red
  },
  O: {
    id: 'O',
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: 'bg-yellow-200', // Bright White-Gold
  },
  S: {
    id: 'S',
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: 'bg-fuchsia-500', // Bright Magenta
  },
  T: {
    id: 'T',
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: 'bg-violet-600', // Rich Purple
  },
  Z: {
    id: 'Z',
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: 'bg-pink-400', // Soft Pink
  },
  // Level 2: Triangles (Trominoes)
  TRI: {
    id: 'TRI',
    shape: [
      [0, 1, 0],
      [1, 0, 1],
      [0, 0, 0],
    ],
    color: 'bg-orange-400',
  },
  CORNER: {
    id: 'CORNER',
    shape: [
      [1, 1],
      [1, 0],
    ],
    color: 'bg-emerald-400',
  },
  // Level 3+: More exotic colors
  PLUS: {
    id: 'PLUS',
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    color: 'bg-sky-400',
  },
  BIG_L: {
    id: 'BIG_L',
    shape: [
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: 'bg-lime-400',
  },
  U_SHAPE: {
    id: 'U_SHAPE',
    shape: [
      [1, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: 'bg-white',
  },
};

export const getRandomTetromino = (level: number = 1): Tetromino => {
  const availableKeys = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  
  if (level >= 2) availableKeys.push('TRI', 'CORNER');
  if (level >= 3) availableKeys.push('PLUS');
  if (level >= 4) availableKeys.push('BIG_L');
  if (level >= 5) availableKeys.push('U_SHAPE');

  const key = availableKeys[Math.floor(Math.random() * availableKeys.length)];
  return TETROMINOES[key];
};
