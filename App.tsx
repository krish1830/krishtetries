import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTetris } from './hooks/useTetris';
import BoardView from './components/BoardView';
import Controls from './components/Controls';
import GameUI from './components/GameUI';
import AISuggestions from './components/AISuggestions';
import PWAInstallButton from './components/PWAInstallButton';
import OfflineIndicator from './components/OfflineIndicator';
import { Direction, Position, Board, Difficulty, UserProfile } from './types';

const STORAGE_KEY = 'neon_tetris_profiles_v1';
const DEFAULT_PILOT: UserProfile = {
  id: 'default-pilot-01',
  name: 'CYBER-01',
  tetrisStats: {
    bestScore: 0,
    totalLines: 0,
    gamesPlayed: 0
  }
};

const App: React.FC = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([DEFAULT_PILOT]);
  const [activeProfileId, setActiveProfileId] = useState<string>('default-pilot-01');
  const [newProfileName, setNewProfileName] = useState('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Active profile derived from profile list
  const activeProfile = useMemo(() => {
    return profiles.find(p => p.id === activeProfileId) || profiles[0] || DEFAULT_PILOT;
  }, [profiles, activeProfileId]);

  const { 
    board, activePiece, nextPiece, score, highScore, level, lines, bombs, useBomb,
    gameOver, paused, difficulty, isGameStarted, setPaused, 
    move, rotate, hardDrop, resetGame, startGame, resumeGame, hasSave 
  } = useTetris(activeProfile);

  // Load profiles from storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProfiles(parsed);
          setActiveProfileId(parsed[0].id);
        }
      } catch (e) {
        console.error('Failed to load profiles:', e);
      }
    }
  }, []);

  // Save profiles whenever updated
  useEffect(() => {
    if (profiles.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    }
  }, [profiles]);

  const updateProfileStats = useCallback((statsUpdater: (p: UserProfile) => UserProfile) => {
    if (!activeProfileId) return;
    setProfiles(prev => prev.map(p => p.id === activeProfileId ? statsUpdater(p) : p));
  }, [activeProfileId]);

  const tetrisGameOverHandledRef = useRef(false);

  // Update stats on Game Over once
  useEffect(() => {
    if (!isGameStarted) {
      tetrisGameOverHandledRef.current = false;
      return;
    }

    if (gameOver && !tetrisGameOverHandledRef.current && activeProfileId) {
      tetrisGameOverHandledRef.current = true;
      updateProfileStats(p => ({
        ...p,
        tetrisStats: {
          bestScore: Math.max(p.tetrisStats.bestScore, score),
          totalLines: p.tetrisStats.totalLines + lines,
          gamesPlayed: p.tetrisStats.gamesPlayed + 1
        }
      }));
    }
  }, [gameOver, isGameStarted, score, lines, updateProfileStats, activeProfileId]);

  // Handle Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isProfileModalOpen) return;
      if (gameOver || !isGameStarted) return;

      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        e.preventDefault();
        setPaused(!paused);
        return;
      }

      if (paused) return;

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          move(Direction.Left);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          move(Direction.Right);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          move(Direction.Down);
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          rotate();
          break;
        case ' ':
          e.preventDefault();
          hardDrop();
          break;
        case 'b':
        case 'B':
          e.preventDefault();
          if (bombs > 0) {
            useBomb();
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameOver, paused, isGameStarted, move, rotate, hardDrop, setPaused, bombs, useBomb, isProfileModalOpen]);

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    const newProfile: UserProfile = {
      id: Date.now().toString(),
      name: newProfileName.trim().toUpperCase(),
      tetrisStats: { bestScore: 0, totalLines: 0, gamesPlayed: 0 }
    };
    setProfiles(prev => [...prev, newProfile]);
    setActiveProfileId(newProfile.id);
    setNewProfileName('');
    setIsProfileModalOpen(false);
  };

  const checkCollisionHelper = (shape: number[][], pos: Position, b: Board) => {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const newX = pos.x + x;
          const newY = pos.y + y;
          if (newX < 0 || newX >= 10 || newY >= 20 || (newY >= 0 && b[newY][newX] !== null)) return true;
        }
      }
    }
    return false;
  };

  return (
    <div className={`h-screen bg-[#050505] text-slate-200 flex flex-col items-center justify-start py-2 px-2 overflow-hidden font-sans relative ${isShaking ? 'animate-shake' : ''}`}>
      <div className="animated-grid opacity-30"></div>

      {/* Top Header */}
      <header className="w-full max-w-2xl flex items-center justify-between px-2 z-10 shrink-0 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <i className="fa-solid fa-shapes text-sm"></i>
          </div>
          <div className="flex flex-col">
            <h1 className="text-base sm:text-lg font-black tracking-wider text-white uppercase font-orbitron italic leading-tight">
              Neon Tetris AI
            </h1>
            <button 
              onClick={() => setIsProfileModalOpen(true)}
              className="text-[9px] text-amber-400 font-retro uppercase flex items-center gap-1.5 hover:text-amber-300 text-left transition-colors"
              title="Change Pilot Profile"
            >
              <span>PILOT: {activeProfile?.name}</span>
              <i className="fa-solid fa-pen-to-square text-[8px] text-slate-500"></i>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <PWAInstallButton />
          
          <button 
            onClick={() => setPaused(!paused)} 
            disabled={!isGameStarted || gameOver}
            className="w-9 h-9 border border-slate-800 bg-slate-900/60 rounded-lg flex items-center justify-center text-slate-300 hover:text-amber-400 hover:border-amber-500/40 transition-all disabled:opacity-30"
            title={paused ? 'Resume Game' : 'Pause Game'}
          >
            <i className={`fa-solid ${paused ? 'fa-play' : 'fa-pause'} text-xs`}></i>
          </button>

          <button 
            onClick={resetGame}
            className="text-[9px] font-black text-slate-400 hover:text-amber-400 border border-slate-800 hover:border-amber-500/30 px-3 py-2 bg-slate-900/60 rounded-lg font-orbitron uppercase tracking-wider transition-all"
            title="Reset Game"
          >
            RESET
          </button>
        </div>
      </header>

      {/* Main Game Stage */}
      <div className="flex gap-3 sm:gap-4 items-stretch justify-center w-full max-w-2xl h-[calc(100vh-180px)] z-10 mb-2 transition-all">
        {/* Tetris Board */}
        <div className="flex-1 flex justify-center h-full max-w-[340px]">
          <BoardView 
            board={board} 
            activePiece={activePiece} 
            checkCollision={checkCollisionHelper} 
            bombsCount={bombs} 
          />
        </div>

        {/* Side HUD & AI Strategist */}
        <div className="flex flex-col gap-2 w-24 sm:w-28 shrink-0">
          <GameUI 
            score={score} 
            highScore={highScore} 
            level={level} 
            lines={lines} 
            bombs={bombs} 
            nextPiece={nextPiece} 
          />
          <div className="mt-auto">
            <AISuggestions 
              board={board} 
              nextPiece={nextPiece} 
              score={score} 
              level={level} 
            />
          </div>
        </div>
      </div>

      {/* Bottom Touch Controls */}
      <div className="w-full flex flex-col items-center gap-1 z-20 shrink-0 pb-2">
        <Controls 
          onMove={move} 
          onRotate={rotate} 
          onHardDrop={hardDrop} 
          onBomb={() => { 
            if (bombs > 0) { 
              useBomb(); 
              setIsShaking(true); 
              setTimeout(() => setIsShaking(false), 500); 
            }
          }} 
          bombs={bombs} 
        />
      </div>

      {/* Game Over / Pause / Start Overlay */}
      {(!isGameStarted || gameOver || paused) && !isProfileModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center">
          {gameOver ? (
            <div className="space-y-6 animate-in zoom-in duration-300 max-w-sm w-full">
              <div className="space-y-1">
                <h2 className="text-4xl sm:text-5xl font-black italic font-orbitron text-red-500 tracking-tighter uppercase">
                  GAME OVER
                </h2>
                <p className="text-[9px] text-slate-400 font-retro uppercase tracking-widest">
                  Matrix Overloaded
                </p>
              </div>

              <div className="bg-slate-900/60 p-5 border border-slate-800 rounded-xl space-y-3">
                <p className="text-[10px] text-slate-500 font-retro uppercase tracking-wider">Flight Record</p>
                <div className="text-3xl font-black font-orbitron text-white">{score.toLocaleString()}</div>
                {score >= highScore && score > 0 && (
                  <span className="inline-block px-2 py-0.5 bg-amber-500/20 border border-amber-500/50 text-amber-400 text-[8px] font-retro uppercase tracking-wider rounded">
                    ★ NEW RECORD ★
                  </span>
                )}
                <div className="text-[9px] text-amber-500 font-retro uppercase pt-2 border-t border-slate-800/80">
                  Level {level} • {lines} Lines Cleared
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => startGame(difficulty)} 
                  className="w-full py-4 bg-white text-black font-black font-orbitron uppercase italic tracking-widest hover:bg-amber-400 transition-all rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                >
                  REBOOT SYSTEM
                </button>
                <button 
                  onClick={resetGame} 
                  className="w-full py-3 border border-slate-800 bg-slate-900/40 text-slate-400 hover:text-white font-orbitron text-xs font-bold uppercase tracking-widest transition-all rounded-lg"
                >
                  CHANGE PROTOCOL
                </button>
              </div>
            </div>
          ) : paused ? (
            <div className="space-y-6 animate-in zoom-in duration-300 max-w-sm w-full">
              <div className="space-y-1">
                <h2 className="text-4xl font-black italic font-orbitron text-amber-400 tracking-tighter uppercase">
                  PAUSED
                </h2>
                <p className="text-[9px] text-slate-400 font-retro uppercase tracking-widest">
                  System Suspended
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setPaused(false)} 
                  className="w-full py-4 bg-white text-black font-black font-orbitron uppercase italic tracking-widest hover:bg-amber-400 transition-all rounded-lg"
                >
                  RESUME LINK
                </button>
                <button 
                  onClick={resetGame} 
                  className="w-full py-3 border border-slate-800 bg-slate-900/40 text-slate-400 hover:text-white font-orbitron text-xs font-bold uppercase tracking-widest transition-all rounded-lg"
                >
                  ABORT SESSION
                </button>
              </div>
            </div>
          ) : (
            /* Game Start Screen: Difficulty Selector */
            <div className="space-y-6 animate-in zoom-in duration-300 max-w-sm w-full">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-[9px] font-retro uppercase">
                  <i className="fa-solid fa-microchip"></i>
                  <span>AI Powered Grid</span>
                </div>
                <h2 className="text-4xl font-black italic font-orbitron text-white tracking-tighter uppercase">
                  NEON TETRIS
                </h2>
                <p className="text-[10px] text-slate-400 font-retro uppercase tracking-widest">
                  Select Difficulty Protocol
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {(Object.keys(Difficulty) as Array<keyof typeof Difficulty>).map((diff) => (
                  <button 
                    key={diff} 
                    onClick={() => startGame(Difficulty[diff])}
                    className="w-full py-3.5 border border-slate-800 bg-slate-900/60 text-white font-black font-orbitron uppercase italic tracking-widest hover:border-amber-400 hover:bg-amber-500/10 transition-all rounded-lg flex items-center justify-between px-6 group"
                  >
                    <span>{diff}</span>
                    <span className="text-[9px] text-slate-500 font-retro group-hover:text-amber-400">
                      {diff === 'Easy' ? '1.0x SPD' : diff === 'Medium' ? '1.4x SPD' : '2.5x SPD'}
                    </span>
                  </button>
                ))}
              </div>

              {hasSave && (
                <button 
                  onClick={resumeGame}
                  className="w-full py-3 border border-cyan-500/40 bg-cyan-950/20 text-cyan-400 font-orbitron text-xs font-black uppercase tracking-widest hover:bg-cyan-500/20 transition-all rounded-lg flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-floppy-disk text-xs"></i>
                  <span>RESUME SAVED SESSION</span>
                </button>
              )}

              <div className="pt-2 flex items-center justify-between text-left text-xs border-t border-slate-800/60">
                <div>
                  <div className="text-[9px] text-slate-500 font-retro uppercase">Current Pilot</div>
                  <div className="font-orbitron font-bold text-white text-sm">{activeProfile.name}</div>
                </div>
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="text-[10px] text-amber-400 hover:text-amber-300 font-orbitron uppercase underline tracking-wider"
                >
                  Switch Pilot
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pilot Profile Switcher Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-black font-orbitron uppercase text-white tracking-wider">
                  Pilot Registry
                </h3>
                <p className="text-[9px] text-slate-400 font-retro uppercase mt-0.5">
                  Select or Register Callsign
                </p>
              </div>
              <button 
                onClick={() => setIsProfileModalOpen(false)}
                className="w-8 h-8 rounded-lg border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            {/* List of active profiles */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
              {profiles.map(p => {
                const isActive = p.id === activeProfileId;
                return (
                  <button 
                    key={p.id}
                    onClick={() => {
                      setActiveProfileId(p.id);
                      setIsProfileModalOpen(false);
                    }}
                    className={`w-full p-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                      isActive 
                        ? 'border-amber-400 bg-amber-500/10 text-white' 
                        : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-700 hover:bg-slate-900/80'
                    }`}
                  >
                    <div>
                      <div className="font-orbitron font-bold text-sm tracking-wide flex items-center gap-2">
                        <span>{p.name}</span>
                        {isActive && (
                          <span className="text-[8px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded uppercase font-retro">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[9px] text-slate-400 font-retro mt-1">
                        Best: {p.tetrisStats.bestScore.toLocaleString()} • {p.tetrisStats.totalLines} Lines
                      </div>
                    </div>
                    <i className={`fa-solid fa-chevron-right text-xs ${isActive ? 'text-amber-400' : 'text-slate-600'}`}></i>
                  </button>
                );
              })}
            </div>

            {/* Register New Pilot */}
            <form onSubmit={handleCreateProfile} className="space-y-3 pt-3 border-t border-slate-800">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-orbitron block">
                Create New Pilot
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="NEW CALLSIGN" 
                  value={newProfileName} 
                  onChange={(e) => setNewProfileName(e.target.value.toUpperCase())} 
                  maxLength={12} 
                  className="flex-1 bg-black/60 border border-slate-800 px-3 py-2.5 text-xs font-orbitron font-bold tracking-widest focus:border-amber-500 focus:outline-none text-amber-400 rounded-lg" 
                />
                <button 
                  type="submit" 
                  className="bg-amber-500 text-black px-4 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-amber-400 transition-colors rounded-lg font-orbitron"
                >
                  ADD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <OfflineIndicator />
    </div>
  );
};

export default App;
