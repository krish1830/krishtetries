
import React from 'react';
import { Direction } from '../types';

interface ControlsProps {
  onMove: (dir: Direction) => void;
  onRotate: () => void;
  onHardDrop: () => void;
  onBomb: () => void;
  bombs: number;
}

const Controls: React.FC<ControlsProps> = ({ onMove, onRotate, onHardDrop, onBomb, bombs }) => {
  return (
    <div className="w-full max-w-2xl px-1 select-none z-20">
      <div className="flex flex-row items-center justify-between gap-1 h-16">
        {/* Direction: Move Left */}
        <button 
          onClick={() => onMove(Direction.Left)}
          className="flex-1 h-full border border-amber-500/30 bg-slate-900/60 flex items-center justify-center rounded-lg active:bg-amber-500 active:text-black transition-all shadow-lg"
          aria-label="Move Left"
        >
          <i className="fa-solid fa-chevron-left text-lg"></i>
        </button>

        {/* Direction: Move Right */}
        <button 
          onClick={() => onMove(Direction.Right)}
          className="flex-1 h-full border border-amber-500/30 bg-slate-900/60 flex items-center justify-center rounded-lg active:bg-amber-500 active:text-black transition-all shadow-lg"
          aria-label="Move Right"
        >
          <i className="fa-solid fa-chevron-right text-lg"></i>
        </button>

        {/* CENTER: Move Down (Soft Drop) - Swapped from end */}
        <button 
          onClick={() => onMove(Direction.Down)}
          className="flex-[1.5] h-full border-2 border-amber-500 bg-amber-950/20 flex flex-col items-center justify-center rounded-lg hover:bg-amber-500/20 active:bg-amber-500 active:text-black transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          aria-label="Move Down"
        >
          <i className="fa-solid fa-chevron-down text-xl"></i>
          <span className="text-[6px] font-bold uppercase tracking-widest font-retro mt-1">Down</span>
        </button>

        {/* CENTER: Rotate */}
        <button 
          onClick={onRotate}
          className="flex-[1.5] h-full border-2 border-amber-500 bg-amber-950/20 flex flex-col items-center justify-center rounded-lg hover:bg-amber-500/20 active:bg-amber-500 active:text-black transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          aria-label="Rotate"
        >
          <i className="fa-solid fa-rotate text-xl"></i>
          <span className="text-[6px] font-bold uppercase tracking-widest font-retro mt-1">Rotate</span>
        </button>

        {/* Action: Blast (Bomb) */}
        <button 
          onClick={onBomb}
          disabled={bombs === 0}
          className={`flex-1 h-full flex flex-col items-center justify-center rounded-lg border transition-all relative
            ${bombs > 0 
              ? 'border-red-500 bg-red-950/40 text-red-500' 
              : 'border-slate-900 bg-slate-950 text-slate-800 opacity-20 pointer-events-none'}
          `}
          aria-label="Use Bomb"
        >
          <i className="fa-solid fa-bomb text-lg"></i>
          {bombs > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[7px] w-4 h-4 flex items-center justify-center rounded-full font-black border border-black">
              {bombs}
            </span>
          )}
        </button>

        {/* Action: Hard Drop (Moved to end) */}
        <button 
          onClick={onHardDrop}
          className="flex-1 h-full border border-slate-700 bg-slate-900/40 flex flex-col items-center justify-center rounded-lg active:bg-amber-500 active:text-black transition-all"
          aria-label="Hard Drop"
        >
          <i className="fa-solid fa-angles-down text-lg"></i>
          <span className="text-[5px] font-bold uppercase tracking-tighter font-retro mt-0.5">Drop</span>
        </button>
      </div>
    </div>
  );
};

export default Controls;
