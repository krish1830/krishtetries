
import React from 'react';
import { Tetromino } from '../types';

interface GameUIProps {
  score: number;
  highScore: number;
  level: number;
  lines: number;
  bombs: number;
  nextPiece: Tetromino;
}

const GameUI: React.FC<GameUIProps> = ({ score, highScore, level, lines, bombs, nextPiece }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full font-sans z-10 overflow-hidden">
      <div className="bg-slate-950/90 backdrop-blur-md p-1.5 rounded border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.05)]">
        <div className="text-[6px] text-amber-500 font-retro uppercase tracking-widest mb-1.5 text-center">Next</div>
        <div className="h-8 flex items-center justify-center bg-black/60 rounded border border-slate-800 overflow-hidden">
           <div className="grid grid-cols-4 gap-[1px] scale-75">
             {nextPiece.shape.map((row, y) => row.map((cell, x) => (
               <div 
                 key={`${y}-${x}`}
                 className={`w-1.5 h-1.5 rounded-[0.5px] ${cell ? nextPiece.color : 'bg-transparent'} ${cell ? 'shadow-[0_0_2px_currentColor] block-gloss' : ''}`}
               />
             )))}
           </div>
        </div>
      </div>

      <div className="bg-slate-950/90 p-1.5 rounded border border-slate-800">
        <div className="text-[6px] text-slate-500 font-retro uppercase tracking-tighter mb-0.5">Best</div>
        <div className="text-[9px] font-black text-amber-500 font-orbitron truncate italic leading-tight">{highScore.toLocaleString()}</div>
      </div>

      <div className="bg-slate-950/90 p-1.5 rounded border border-amber-500/20">
        <div className="text-[6px] text-amber-400 font-retro uppercase tracking-tighter mb-0.5">Score</div>
        <div className="text-[10px] font-black text-white font-orbitron truncate italic leading-tight">{score.toLocaleString()}</div>
      </div>

      <div className="grid grid-cols-1 gap-1">
        <div className="bg-slate-950/90 p-1 rounded border border-slate-800 flex flex-col items-center">
          <div className="text-[5px] text-slate-500 font-retro uppercase">Level</div>
          <div className="text-[9px] font-black text-white font-orbitron italic leading-none mt-0.5">{level}</div>
        </div>
        <div className="bg-slate-950/90 p-1 rounded border border-slate-800 flex flex-col items-center">
          <div className="text-[5px] text-slate-500 font-retro uppercase">Lines</div>
          <div className="text-[9px] font-black text-white font-orbitron italic leading-none mt-0.5">{lines}</div>
        </div>
      </div>

      <div className={`bg-slate-950/90 p-1 rounded border transition-all duration-500 ${bombs > 0 ? 'border-amber-600 shadow-[0_0_10px_rgba(245,158,11,0.1)]' : 'border-slate-800'}`}>
        <div className="text-[5px] text-amber-500 font-retro uppercase text-center">Bombs</div>
        <div className={`text-[9px] font-black font-orbitron italic text-center leading-none mt-0.5 ${bombs > 0 ? 'text-amber-400' : 'text-slate-700'}`}>
          {bombs}
        </div>
      </div>
    </div>
  );
};

export default GameUI;
