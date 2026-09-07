
import { useCallback, useRef } from 'react';

export const useSound = () => {
  const audioCtx = useRef<AudioContext | null>(null);

  const init = () => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.current.state === 'suspended') {
      audioCtx.current.resume();
    }
  };

  const playSound = useCallback((freq: number, type: OscillatorType, duration: number, volume: number, ramp = true) => {
    init();
    if (!audioCtx.current) return;
    
    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.current.currentTime);
    
    gain.gain.setValueAtTime(volume, audioCtx.current.currentTime);
    if (ramp) {
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + duration);
    }

    osc.connect(gain);
    gain.connect(audioCtx.current.destination);

    osc.start();
    osc.stop(audioCtx.current.currentTime + duration);
  }, []);

  const playMove = useCallback(() => playSound(150, 'sine', 0.05, 0.1), [playSound]);
  const playRotate = useCallback(() => playSound(300, 'triangle', 0.05, 0.1), [playSound]);
  const playDrop = useCallback(() => playSound(80, 'sine', 0.1, 0.2), [playSound]);
  
  const playClear = useCallback((lines: number) => {
    const baseFreq = 400 + lines * 100;
    playSound(baseFreq, 'sine', 0.3, 0.2);
    setTimeout(() => playSound(baseFreq * 1.5, 'sine', 0.2, 0.1), 50);
  }, [playSound]);

  const playBomb = useCallback(() => {
    playSound(60, 'sawtooth', 0.6, 0.3);
    playSound(40, 'sine', 0.8, 0.4);
  }, [playSound]);

  const playGameOver = useCallback(() => {
    init();
    if (!audioCtx.current) return;
    [300, 200, 150].forEach((f) => {
      playSound(f, 'sawtooth', 0.5, 0.05, false);
    });
  }, [playSound]);

  const playLevelUp = useCallback(() => {
    init();
    if (!audioCtx.current) return;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((f, idx) => {
      setTimeout(() => playSound(f, 'triangle', 0.18, 0.2), idx * 80);
    });
  }, [playSound]);

  const playDhandamVictory = useCallback(() => {
    init();
    if (!audioCtx.current) return;
    const fanfareNotes = [523.25, 659.25, 783.99, 1046.5, 880, 1046.5, 1318.51];
    fanfareNotes.forEach((f, idx) => {
      setTimeout(() => playSound(f, idx >= 4 ? 'triangle' : 'sine', 0.35, 0.25), idx * 110);
    });
  }, [playSound]);

  return { playMove, playRotate, playClear, playDrop, playGameOver, playBomb, playLevelUp, playDhandamVictory };
};
