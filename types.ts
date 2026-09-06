
export type Shape = number[][];

export interface Tetromino {
  shape: Shape;
  color: string;
  id: string;
}

export interface Position {
  x: number;
  y: number;
}

export type Board = (string | null)[][];

export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard'
}

export interface UserProfile {
  id: string;
  name: string;
  tetrisStats: {
    bestScore: number;
    totalLines: number;
    gamesPlayed: number;
  };
}

export enum GameType {
  Tetris = 'Tetris'
}

export interface GameState {
  board: Board;
  activePiece: ActivePiece | null;
  nextPiece: Tetromino;
  score: number;
  level: number;
  lines: number;
  gameOver: boolean;
  paused: boolean;
  difficulty: Difficulty;
  highScore: number;
  bombs: number;
}

export interface ActivePiece {
  tetromino: Tetromino;
  position: Position;
  rotationIndex: number; // 0: Spawn, 1: 90deg, 2: 180deg, 3: 270deg
}

export enum Direction {
  Left = -1,
  Right = 1,
  Down = 0
}
