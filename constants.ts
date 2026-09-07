
import { Tetromino } from './types';

export const COLS = 10;
export const ROWS = 20;
export const INITIAL_DROP_SPEED = 750;
export const MIN_DROP_SPEED = 120;
export const DHANDAM_SCORE_TARGET = 100000;

export interface LevelDetail {
  level: number;
  scoreRequired: number;
  title: string;
  shapeNames: string[];
  description: string;
}

export const LEVEL_MILESTONES: LevelDetail[] = [
  { level: 1, scoreRequired: 0, title: 'Sector Alpha', shapeNames: ['Classic 7 Tetrominoes'], description: 'The original 7 classic shapes' },
  { level: 2, scoreRequired: 10000, title: 'Tromino Grid', shapeNames: ['Corner', 'Tri-Wedge'], description: 'Corner & Tri-Wedge 3-block shapes' },
  { level: 3, scoreRequired: 20000, title: 'Cross Sector', shapeNames: ['Plus / Cross'], description: '5-block Plus Cross' },
  { level: 4, scoreRequired: 30000, title: 'Titan Corner', shapeNames: ['Extended Big L'], description: '5-block Long Corner' },
  { level: 5, scoreRequired: 40000, title: 'Horseshoe Core', shapeNames: ['U-Shape'], description: '5-block Horseshoe Cup' },
  { level: 6, scoreRequired: 50000, title: 'Beam Matrix', shapeNames: ['5-Block Long Beam'], description: '5-block Mega Long Beam' },
  { level: 7, scoreRequired: 60000, title: 'Stepped Helix', shapeNames: ['Stair Pentomino'], description: 'Stepped 5-block Stair' },
  { level: 8, scoreRequired: 70000, title: 'Pyramid Apex', shapeNames: ['Extended T-Plus'], description: 'Extended T-Plus Pentomino' },
  { level: 9, scoreRequired: 80000, title: 'Warp Flux', shapeNames: ['W-Pentomino'], description: 'W-Pentomino stepped block' },
  { level: 10, scoreRequired: 90000, title: 'Ring Singularity', shapeNames: ['Hollow Ring'], description: '3x3 Hollow Ring Matrix' },
];

export const TETROMINOES: Record<string, Tetromino> = {
  // Level 1: Standard Tetrominoes (Score: 0+)
  I: {
    id: 'I',
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: 'bg-amber-400',
  },
  J: {
    id: 'J',
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: 'bg-indigo-500',
  },
  L: {
    id: 'L',
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: 'bg-rose-500',
  },
  O: {
    id: 'O',
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: 'bg-yellow-200',
  },
  S: {
    id: 'S',
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: 'bg-fuchsia-500',
  },
  T: {
    id: 'T',
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: 'bg-violet-600',
  },
  Z: {
    id: 'Z',
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: 'bg-pink-400',
  },

  // Level 2: Trominoes (Score: 10,000+)
  CORNER: {
    id: 'CORNER',
    shape: [
      [1, 1],
      [1, 0],
    ],
    color: 'bg-emerald-400',
  },
  TRI: {
    id: 'TRI',
    shape: [
      [0, 1, 0],
      [1, 0, 1],
      [0, 0, 0],
    ],
    color: 'bg-orange-400',
  },

  // Level 3: Plus / Cross (Score: 20,000+)
  PLUS: {
    id: 'PLUS',
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    color: 'bg-sky-400',
  },

  // Level 4: Extended Big L (Score: 30,000+)
  BIG_L: {
    id: 'BIG_L',
    shape: [
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: 'bg-lime-400',
  },

  // Level 5: U-Shape (Score: 40,000+)
  U_SHAPE: {
    id: 'U_SHAPE',
    shape: [
      [1, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: 'bg-cyan-300',
  },

  // Level 6: 5-Block Long Beam (Score: 50,000+)
  LONG_5: {
    id: 'LONG_5',
    shape: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
    color: 'bg-teal-300',
  },

  // Level 7: Stepped Stair Pentomino (Score: 60,000+)
  STAIR: {
    id: 'STAIR',
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 1],
    ],
    color: 'bg-amber-500',
  },

  // Level 8: Extended T-Plus (Score: 70,000+)
  T_PLUS: {
    id: 'T_PLUS',
    shape: [
      [1, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
    ],
    color: 'bg-purple-400',
  },

  // Level 9: W-Pentomino (Score: 80,000+)
  W_SHAPE: {
    id: 'W_SHAPE',
    shape: [
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: 'bg-rose-400',
  },

  // Level 10: 3x3 Hollow Ring (Score: 90,000+)
  DONUT: {
    id: 'DONUT',
    shape: [
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 1],
    ],
    color: 'bg-yellow-300',
  },
};

export const getRandomTetromino = (level: number = 1): Tetromino => {
  const availableKeys = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  
  if (level >= 2) availableKeys.push('CORNER', 'TRI');
  if (level >= 3) availableKeys.push('PLUS');
  if (level >= 4) availableKeys.push('BIG_L');
  if (level >= 5) availableKeys.push('U_SHAPE');
  if (level >= 6) availableKeys.push('LONG_5');
  if (level >= 7) availableKeys.push('STAIR');
  if (level >= 8) availableKeys.push('T_PLUS');
  if (level >= 9) availableKeys.push('W_SHAPE');
  if (level >= 10) availableKeys.push('DONUT');

  const key = availableKeys[Math.floor(Math.random() * availableKeys.length)];
  return TETROMINOES[key];
};

