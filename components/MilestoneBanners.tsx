import React, { useEffect, useState } from 'react';
import { LevelUpEvent } from '../hooks/useTetris';
import { UserProfile } from '../types';

interface MilestoneBannersProps {
  levelUpEvent: LevelUpEvent | null;
  onDismissLevelUp: () => void;
  showDhandamBanner: boolean;
  onDismissDhandam: () => void;
  score: number;
  lines: number;
  activeProfile: UserProfile;
}

export const MilestoneBanners: React.FC<MilestoneBannersProps> = ({
  levelUpEvent,
  onDismissLevelUp,
  showDhandamBanner,
  onDismissDhandam,
  score,
  lines,
  activeProfile,
}) => {
  // Auto-dismiss level-up banner after 5 seconds
  useEffect(() => {
    if (levelUpEvent) {
      const timer = setTimeout(() => {
        onDismissLevelUp();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [levelUpEvent, onDismissLevelUp]);

  return (
    <>
      {/* LEVEL UP NOTIFICATION TOAST */}
      {levelUpEvent && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm pointer-events-auto animate-in slide-in-from-top-6 duration-300">
          <div className="bg-gradient-to-r from-slate-950 via-amber-950/80 to-slate-950 border-2 border-amber-400/80 rounded-xl p-3.5 shadow-[0_0_25px_rgba(245,158,11,0.35)] backdrop-blur-md relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0 text-amber-300">
                <i className="fa-solid fa-layer-group text-base animate-pulse"></i>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black font-orbitron uppercase tracking-widest text-amber-400">
                    LEVEL {levelUpEvent.level} UNLOCKED!
                  </span>
                  <span className="px-1.5 py-0.2 text-[8px] font-bold font-retro bg-amber-500/20 text-amber-300 rounded border border-amber-500/40">
                    +1 BOMB
                  </span>
                </div>
                <div className="text-xs font-black font-orbitron text-white uppercase tracking-tight mt-0.5">
                  {levelUpEvent.title}
                </div>
                <div className="text-[10px] text-amber-200/90 font-sans mt-1">
                  ✨ <strong className="text-white font-medium">New Shapes:</strong> {levelUpEvent.shapeNames.join(', ')}
                </div>
              </div>
              <button
                onClick={onDismissLevelUp}
                className="text-slate-400 hover:text-white text-xs p-1"
                title="Dismiss"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GRAND 100,000 SCORE CELEBRATION: "DHANDAM RA DHOOTHA" BANNER MODAL */}
      {showDhandamBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-gradient-to-b from-amber-950/90 via-slate-950 to-black border-2 border-amber-400 rounded-2xl p-6 shadow-[0_0_50px_rgba(245,158,11,0.5)] relative overflow-hidden text-center space-y-5 animate-in zoom-in-95 duration-300">
            {/* Background radiant flare */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Supreme Crown / Honor Emblem */}
            <div className="relative inline-flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-[0_0_30px_rgba(245,158,11,0.8)] animate-bounce">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-3xl text-amber-400">
                  🫡
                </div>
              </div>
              <div className="absolute -top-3 -right-2 text-2xl animate-pulse">👑</div>
            </div>

            {/* The Legendary Title */}
            <div className="space-y-1 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/50 rounded-full text-amber-300 text-[10px] font-orbitron uppercase tracking-widest font-black">
                <i className="fa-solid fa-award"></i>
                <span>SUPREME LEGENDARY TITLE UNLOCKED</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-black font-orbitron tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-400 to-rose-400 uppercase drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]">
                DHANDAM RA DHOOTHA
              </h1>
              
              <p className="text-xs text-amber-200/90 font-retro tracking-wider uppercase">
                దండుం రా దూత • THE GRID IS BOWING DOWN TO YOU
              </p>
            </div>

            {/* Honor stats badge */}
            <div className="bg-slate-900/80 border border-amber-500/30 rounded-xl p-4 grid grid-cols-3 gap-2 text-left relative z-10">
              <div>
                <div className="text-[9px] text-slate-400 font-retro uppercase">Legend Pilot</div>
                <div className="text-sm font-black font-orbitron text-white truncate">{activeProfile.name}</div>
              </div>
              <div>
                <div className="text-[9px] text-amber-400/80 font-retro uppercase">Score Reached</div>
                <div className="text-sm font-black font-orbitron text-amber-300">{score.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-400 font-retro uppercase">Lines Cleared</div>
                <div className="text-sm font-black font-orbitron text-white">{lines}</div>
              </div>
            </div>

            {/* Narrative homage text */}
            <p className="text-xs text-slate-300 leading-relaxed font-sans px-2 relative z-10">
              You conquered <strong>10 progressive levels</strong>, mastered every exotic block from Trominoes to the Hollow Singularity, and crossed the monumental <strong>100,000 score threshold</strong>. You are the ultimate BuildingBlocks architect!
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2 relative z-10">
              <button
                id="dhandam-keep-playing-btn"
                onClick={onDismissDhandam}
                className="flex-1 py-3.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-black font-orbitron text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-play"></i>
                <span>KEEP DOMINATING GRID</span>
              </button>
              <button
                id="dhandam-salute-btn"
                onClick={onDismissDhandam}
                className="py-3.5 px-5 border border-amber-500/40 bg-slate-900/60 hover:bg-slate-800 text-amber-300 font-orbitron text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
              >
                SALUTE 🫡
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MilestoneBanners;
