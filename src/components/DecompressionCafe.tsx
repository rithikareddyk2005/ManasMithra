import React, { useState, useEffect } from 'react';
import { Coffee, Play, Pause, RotateCcw, Sparkles, Volume2, VolumeX, CheckCircle } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { triggerCelebration } from '../utils/storage';

export const DecompressionCafe: React.FC = () => {
  const [selectedDuration, setSelectedDuration] = useState<number>(180); // 3 minutes = 180s
  const [timeLeft, setTimeLeft] = useState<number>(180);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      soundEngine.playChime('high');
      triggerCelebration();
      setIsActive(false);
      if (soundEnabled) {
        soundEngine.stopAmbient();
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, soundEnabled]);

  const toggleTimer = () => {
    if (!isActive) {
      if (soundEnabled) {
        soundEngine.toggleAmbient('rain', 0.12);
      }
      soundEngine.playChime('medium');
    } else {
      if (soundEnabled) {
        soundEngine.stopAmbient();
      }
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(selectedDuration);
    if (soundEnabled) {
      soundEngine.stopAmbient();
    }
  };

  const selectDuration = (sec: number) => {
    setSelectedDuration(sec);
    setTimeLeft(sec);
    setIsActive(false);
    if (soundEnabled) {
      soundEngine.stopAmbient();
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 mb-1.5">
            ☕ Digital Decompression Cafe
          </div>
          <h2 className="text-xl font-bold text-stone-900">3-Minute Micro-Sanctuary</h2>
          <p className="text-xs text-stone-500">
            A deliberate non-stimulating pause. Lower screen brightness, close your eyes, and let your nervous system catch up.
          </p>
        </div>

        {/* Duration selector */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-stone-100 p-1 rounded-2xl">
          {[
            { label: '1 Min', val: 60 },
            { label: '3 Min', val: 180 },
            { label: '5 Min', val: 300 },
          ].map((d) => (
            <button
              key={d.val}
              onClick={() => selectDuration(d.val)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                selectedDuration === d.val
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cozy Visual Sanctuary Card */}
      <div className="relative rounded-3xl bg-gradient-to-b from-stone-900 via-amber-950/70 to-stone-900 text-white p-8 flex flex-col items-center justify-center min-h-[300px] text-center overflow-hidden">
        {/* Soft glowing tea/fireplace amber lamp */}
        <div
          className={`absolute w-72 h-72 rounded-full bg-amber-500/20 blur-3xl transition-all duration-1000 ${
            isActive ? 'scale-125 opacity-80 animate-pulse' : 'opacity-40'
          }`}
        />

        <div className="relative z-10 space-y-3">
          <div className="text-5xl animate-float">☕</div>

          {/* Large Countdown */}
          <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-amber-100">
            {formatTime(timeLeft)}
          </div>

          <p className="text-xs text-amber-200/90 max-w-sm mx-auto font-serif-accent italic">
            {isActive
              ? '“Rest your gaze on the horizon or close your eyelids. Let go of whatever just happened.”'
              : 'Press Play to begin your silent tea sanctuary.'}
          </p>
        </div>

        {/* Controls */}
        <div className="relative z-10 flex items-center gap-3 mt-6">
          <button
            onClick={toggleTimer}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-105 flex items-center gap-2"
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4" /> Pause Rest
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Enter Sanctuary
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors text-xs flex items-center gap-1"
            title="Toggle rainfall audio"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-300" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mindful Cafe Prompts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
          <div className="font-bold text-stone-800">1. Release the Gaze</div>
          <p className="text-stone-500 text-[11px]">
            Look 20 feet away to relax the ciliary muscles in your eyes.
          </p>
        </div>
        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
          <div className="font-bold text-stone-800">2. Drop the Shoulders</div>
          <p className="text-stone-500 text-[11px]">
            Allow your collarbones to broaden and release jaw tension.
          </p>
        </div>
        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
          <div className="font-bold text-stone-800">3. Slow Sip of Water</div>
          <p className="text-stone-500 text-[11px]">
            A temperature change immediately interrupts ruminative mental loops.
          </p>
        </div>
      </div>
    </div>
  );
};
