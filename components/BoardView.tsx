
import React, { useState, useEffect } from 'react';
import { Board, ActivePiece, Position } from '../types';

interface BoardViewProps {
  board: Board;
  activePiece: ActivePiece | null;
  checkCollision: (shape: number[][], pos: Position, board: Board) => boolean;
  bombsCount: number;
}

const BoardView: React.FC<BoardViewProps> = ({ board, activePiece, checkCollision, bombsCount }) => {
  const [showBlast, setShowBlast] = useState(false);
  const [lastBombsCount, setLastBombsCount] = useState(bombsCount);

  useEffect(() => {
    if (bombsCount < lastBombsCount) {
      setShowBlast(true);
      const timer = setTimeout(() => setShowBlast(false), 600);
      return () => clearTimeout(timer);
    }
    setLastBombsCount(bombsCount);
  }, [bombsCount, lastBombsCount]);

  let ghostY = activePiece?.position.y || 0;
  if (activePiece) {
    while (!checkCollision(activePiece.tetromino.shape, { x: activePiece.position.x, y: ghostY + 1 }, board)) {
      ghostY++;
    }
  }

  const renderCell = (y: number, x: number) => {
    let color = board[y][x];
    let isGhost = false;
    let isActive = false;

    if (activePiece) {
      const shape = activePiece.tetromino.shape;
      const py = y - activePiece.position.y;
      const px = x - activePiece.position.x;
      if (py >= 0 && py < shape.length && px >= 0 && px < shape[0].length && shape[py][px]) {
        color = activePiece.tetromino.color;
        isActive = true;
      }
      const gy = y - ghostY;
      if (!isActive && gy >= 0 && gy < shape.length && px >= 0 && px < shape[0].length && shape[gy][px]) {
        color = activePiece.tetromino.color;
        isGhost = true;
      }
    }

    return (
      <div
        key={`${y}-${x}`}
        className={`
          relative w-full h-full
          ${color || 'bg-white/5'} 
          ${isGhost ? 'opacity-10 border border-dashed border-white/10' : 'opacity-100'}
          ${isActive ? 'z-10 shadow-[0_0_6px_rgba(255,255,255,0.3)]' : ''}
          rounded-[1px] transition-all duration-75
        `}
      >
        {color && !isGhost && (
          <div className="absolute inset-0 block-gloss border border-white/10" />
        )}
      </div>
    );
  };

  return (
    <div className="h-full max-h-full aspect-[1/2] grid grid-cols-10 grid-rows-20 gap-[1px] bg-black p-1 rounded border border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(168,85,247,0.05)] relative overflow-hidden transition-all">
      {board.map((row, y) => row.map((_, x) => renderCell(y, x)))}
      
      {showBlast && (
        <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none flex items-center justify-center z-50">
           <div className="w-24 h-24 bg-amber-500 rounded-full blur-2xl opacity-40 animate-ping"></div>
        </div>
      )}
    </div>
  );
};

export default BoardView;
