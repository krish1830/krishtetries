
import React, { useState } from 'react';
import { getGameAdvice } from '../services/geminiService';
import { Board, Tetromino } from '../types';

interface AISuggestionsProps {
  board: Board;
  nextPiece: Tetromino;
  score: number;
  level: number;
}

const AISuggestions: React.FC<AISuggestionsProps> = ({ board, nextPiece, score, level }) => {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string[]>([]);
  const [risk, setRisk] = useState<string>('');

  const fetchAdvice = async () => {
    setLoading(true);
    const result = await getGameAdvice(board, nextPiece, score, level);
    if (result) {
      setAdvice(result.advice);
      setRisk(result.riskLevel);
    }
    setLoading(false);
  };

  return (
    <div className="w-full font-sans">
      <div className="bg-[#0a0a0a]/90 backdrop-blur-sm border border-slate-800/60 rounded p-1 flex items-center gap-1.5">
        <button 
          onClick={fetchAdvice}
          disabled={loading}
          className="h-6 w-6 shrink-0 flex items-center justify-center border border-slate-800 hover:border-amber-500 transition-colors disabled:opacity-20 bg-black/40 rounded-sm"
        >
          <i className={`fa-solid ${loading ? 'fa-spinner fa-spin' : 'fa-bolt-lightning'} text-[7px] text-amber-500`}></i>
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
             <span className="text-[4px] font-bold uppercase text-slate-600 tracking-tighter font-retro leading-none">AI Intel</span>
             {risk && (
                <span className={`text-[4px] font-bold px-0.5 rounded-none uppercase border leading-none ${
                  risk === 'Low' ? 'border-green-900/50 text-green-500/80' : 
                  risk === 'Medium' ? 'border-yellow-900/50 text-yellow-500/80' : 'border-red-900/50 text-red-500/80'
                }`}>
                  {risk}
                </span>
              )}
          </div>
          <div className="truncate mt-0.5">
            {advice.length > 0 ? (
              <p className="text-[6px] text-slate-300 font-medium leading-none truncate italic">
                {advice[0]}
              </p>
            ) : (
              <p className="text-[5px] text-slate-600 leading-none uppercase tracking-tighter">Ready...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISuggestions;
