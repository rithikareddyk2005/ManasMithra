import React, { useState } from 'react';
import { Volume2, Sparkles, Music, Play, RotateCcw, Info } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export const SingingBowlSanctuary: React.FC = () => {
  const [selectedFreq, setSelectedFreq] = useState<number>(432);
  const [isVibrating, setIsVibrating] = useState(false);
  const [strikeCount, setStrikeCount] = useState(0);

  const frequencies = [
    { freq: 396, label: '396 Hz', name: 'Root Grounding', desc: 'Releasing fear, anxiety, and tension in the lower back.' },
    { freq: 432, label: '432 Hz', name: 'Earth Harmony', desc: 'Natural mathematical frequency for deep parasympathetic relaxation.' },
    { freq: 528, label: '528 Hz', name: 'Heart & Restoration', desc: 'Known as the Solfeggio transformation tone for cellular balance.' },
    { freq: 639, label: '639 Hz', name: 'Interpersonal Warmth', desc: 'Fosters compassion, connection, and harmonious social bonds.' },
  ];

  const handleStrike = () => {
    soundEngine.playTibetanBowl(selectedFreq);
    setIsVibrating(true);
    setStrikeCount((c) => c + 1);
    setTimeout(() => setIsVibrating(false), 3800);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 mb-1.5">
            🔔 Acoustic Resonance Sanctuary
          </div>
          <h2 className="text-xl font-bold text-stone-900">Tibetan Singing Bowl & Sound Sanctuary</h2>
          <p className="text-xs text-stone-500">
            Harmonic overtone synthesis calibrated to slow down brainwaves from high beta to tranquil alpha states.
          </p>
        </div>
      </div>

      {/* Main Interactive Bowl Stage */}
      <div className="relative rounded-3xl bg-gradient-to-b from-stone-900 via-stone-900 to-amber-950 p-8 flex flex-col items-center justify-center min-h-[340px] text-center overflow-hidden">
        {/* Radiating soundwave rings */}
        {isVibrating && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 rounded-full border-2 border-amber-400/40 animate-ping duration-1000" />
            <div className="w-72 h-72 rounded-full border border-amber-300/30 animate-ping duration-[2000ms]" />
            <div className="w-96 h-96 rounded-full border border-amber-200/20 animate-ping duration-[3000ms]" />
          </div>
        )}

        {/* Ambient bronze glow */}
        <div
          className={`absolute w-64 h-64 rounded-full bg-amber-500/15 blur-3xl transition-opacity duration-1000 ${
            isVibrating ? 'opacity-100 scale-125' : 'opacity-40'
          }`}
        />

        {/* The Bowl Instrument */}
        <div className="relative z-10 flex flex-col items-center my-3">
          <button
            onClick={handleStrike}
            title="Click or tap to strike the Tibetan Singing Bowl"
            className="group relative cursor-pointer focus:outline-hidden"
          >
            {/* Outer metallic singing bowl rim */}
            <div
              className={`w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-tr from-amber-700 via-yellow-600 to-amber-500 border-4 border-amber-300/80 shadow-2xl flex flex-col items-center justify-center transition-all duration-300 ${
                isVibrating ? 'scale-105 shadow-amber-500/30 ring-8 ring-amber-400/20' : 'group-hover:scale-102'
              }`}
            >
              {/* Inner bowl recess */}
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-amber-900 via-stone-900 to-amber-800 border-2 border-amber-400/50 flex flex-col items-center justify-center text-white shadow-inner">
                <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">🔔</span>
                <span className="text-xs font-bold text-amber-200 tracking-wider">
                  {selectedFreq} Hz
                </span>
                <span className="text-[10px] text-amber-300/70 uppercase">
                  {isVibrating ? 'Resonating...' : 'Tap to Strike'}
                </span>
              </div>
            </div>

            {/* Wooden striker mallet hint */}
            <div className="mt-3 text-xs font-bold text-amber-200/90 flex items-center justify-center gap-1.5 group-hover:text-amber-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Strike Mallet</span>
            </div>
          </button>
        </div>

        <p className="relative z-10 text-xs text-stone-300 max-w-sm mt-2 font-serif-accent italic">
          “Allow the sound to fill your chest. Follow the resonance as it fades into silence.”
        </p>
      </div>

      {/* Frequency selector buttons */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-stone-700">
          Select Solfeggio Harmonic Tuning:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {frequencies.map((item) => (
            <button
              key={item.freq}
              onClick={() => {
                setSelectedFreq(item.freq);
                soundEngine.playTibetanBowl(item.freq);
              }}
              className={`p-3 rounded-2xl border text-left transition-all ${
                selectedFreq === item.freq
                  ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold ring-2 ring-amber-500/20 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 text-stone-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span>{item.label}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-600 font-normal">
                  {item.name}
                </span>
              </div>
              <p className="text-[10px] text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                {item.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Scientific explanation */}
      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-stone-800">Acoustic Biofeedback:</strong> When listening to sustained pure sinusoidal harmonics, the auditory cortex signals the dorsal vagal nucleus, helping to decrease resting heart rate and reduce salivary cortisol within 3 to 5 minutes of focused listening.
        </p>
      </div>
    </div>
  );
};
