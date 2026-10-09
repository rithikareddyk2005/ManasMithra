import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sliders,
  Music,
  Headphones,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

export const SoundBathMixer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('study');

  // Channel volumes (0 - 100)
  const [earth432, setEarth432] = useState<number>(60);
  const [solfeggio528, setSolfeggio528] = useState<number>(30);
  const [alphaBeat, setAlphaBeat] = useState<number>(50); // 10 Hz
  const [thetaBeat, setThetaBeat] = useState<number>(0);  // 6 Hz
  const [rainVolume, setRainVolume] = useState<number>(45);

  const presets = [
    {
      id: 'study',
      name: '🧠 Deep Focus & Flow',
      desc: '10Hz Alpha Waves + 432Hz Earth tone + Soft rainfall for high cognitive stamina.',
      earth: 60,
      solfeggio: 25,
      alpha: 65,
      theta: 0,
      rain: 40,
    },
    {
      id: 'sleep',
      name: '🌙 Evening Sleep Wind-Down',
      desc: '6Hz Theta Waves + 528Hz restoration tone + gentle rain for sleep onset.',
      earth: 30,
      solfeggio: 55,
      alpha: 0,
      theta: 70,
      rain: 50,
    },
    {
      id: 'soothe',
      name: '🛡️ Acute Anxiety Soother',
      desc: 'Low-frequency 432Hz grounding tone + rain white noise to steady panic.',
      earth: 80,
      solfeggio: 20,
      alpha: 30,
      theta: 30,
      rain: 60,
    },
    {
      id: 'zen',
      name: '🧘 Deep Meditative Stillness',
      desc: 'Rich 432Hz and 528Hz harmonic blend with theta entrainment.',
      earth: 70,
      solfeggio: 60,
      alpha: 20,
      theta: 50,
      rain: 15,
    },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setSelectedPreset(preset.id);
    setEarth432(preset.earth);
    setSolfeggio528(preset.solfeggio);
    setAlphaBeat(preset.alpha);
    setThetaBeat(preset.theta);
    setRainVolume(preset.rain);
    soundEngine.playChime('medium');

    if (isPlaying) {
      updateAudioStreams(preset.alpha > 0 ? 10 : 6, (preset.alpha || preset.theta) / 100);
    }
  };

  const updateAudioStreams = (beatHz: number, binauralVol: number) => {
    if (binauralVol > 0) {
      soundEngine.startBinauralBeat(216, beatHz, binauralVol * 0.16);
    } else {
      soundEngine.stopBinauralBeat();
    }

    if (rainVolume > 0) {
      soundEngine.toggleAmbient('rain', (rainVolume / 100) * 0.18);
    }
  };

  const toggleMasterPlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      soundEngine.playTibetanBowl(432);
      const beat = alphaBeat > 0 ? 10 : 6;
      const vol = Math.max(alphaBeat, thetaBeat) / 100;
      updateAudioStreams(beat, vol);
    } else {
      setIsPlaying(false);
      soundEngine.stopAmbient();
      soundEngine.stopBinauralBeat();
    }
  };

  useEffect(() => {
    return () => {
      soundEngine.stopBinauralBeat();
    };
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 mb-1.5">
            🎵 Acoustic Frequency Sanctuary
          </div>
          <h2 className="text-xl font-bold text-stone-900">Binaural & 432Hz Sound Bath Mixer</h2>
          <p className="text-xs text-stone-500">
            Real-time neural entrainment and Solfeggio harmonic synthesizer. Wear headphones for optimal binaural stereo effects.
          </p>
        </div>

        <button
          onClick={toggleMasterPlay}
          className={`px-6 py-2.5 rounded-2xl font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto ${
            isPlaying
              ? 'bg-rose-600 hover:bg-rose-700 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-102'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" /> Stop Sound Bath
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Start Acoustic Bath
            </>
          )}
        </button>
      </div>

      {/* Visualizer Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-stone-900 via-indigo-950 to-stone-900 text-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden">
        <div className="space-y-1 relative z-10 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Headphones className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">
              Stereo Entrainment Active
            </span>
          </div>
          <p className="text-xs text-stone-300 font-serif-accent italic">
            {isPlaying
              ? 'Sound frequencies actively entraining brainwave oscillation...'
              : 'Select a preset below or adjust channels, then click Start.'}
          </p>
        </div>

        {/* Animated Audio Equalizer Bars */}
        <div className="flex items-end gap-1.5 h-12 relative z-10">
          {[40, 75, 55, 90, 60, 85, 45, 95, 70, 50, 80, 65].map((h, i) => (
            <div
              key={i}
              className={`w-1.5 rounded-full bg-gradient-to-t from-emerald-500 to-cyan-300 transition-all duration-300 ${
                isPlaying ? 'animate-pulse' : 'opacity-25'
              }`}
              style={{ height: isPlaying ? `${h}%` : '20%' }}
            />
          ))}
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-stone-700">Recommended Sound Presets:</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => applyPreset(p)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                selectedPreset === p.id
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 text-stone-700'
              }`}
            >
              <div className="text-xs font-bold">{p.name}</div>
              <div className="text-[10px] text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                {p.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Sliders for Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
        {/* 432Hz */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
          <div className="flex justify-between text-xs font-bold text-stone-800">
            <span>🌍 432 Hz Earth Resonance</span>
            <span className="text-emerald-700">{earth432}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={earth432}
            onChange={(e) => setEarth432(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
          <p className="text-[10px] text-stone-500">Natural harmonic alignment</p>
        </div>

        {/* 528Hz */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
          <div className="flex justify-between text-xs font-bold text-stone-800">
            <span>✨ 528 Hz Transformation Tone</span>
            <span className="text-indigo-700">{solfeggio528}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={solfeggio528}
            onChange={(e) => setSolfeggio528(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
          <p className="text-[10px] text-stone-500">Restorative Solfeggio frequency</p>
        </div>

        {/* Alpha Waves */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
          <div className="flex justify-between text-xs font-bold text-stone-800">
            <span>🧠 10 Hz Alpha Wave Entrainment</span>
            <span className="text-teal-700">{alphaBeat}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={alphaBeat}
            onChange={(e) => setAlphaBeat(Number(e.target.value))}
            className="w-full accent-teal-600 cursor-pointer"
          />
          <p className="text-[10px] text-stone-500">Relaxed alertness & creative flow</p>
        </div>

        {/* Theta Waves */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
          <div className="flex justify-between text-xs font-bold text-stone-800">
            <span>🌙 6 Hz Theta Wave Entrainment</span>
            <span className="text-purple-700">{thetaBeat}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={thetaBeat}
            onChange={(e) => setThetaBeat(Number(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer"
          />
          <p className="text-[10px] text-stone-500">Deep meditation & circadian wind-down</p>
        </div>

        {/* Rainfall */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 sm:col-span-2">
          <div className="flex justify-between text-xs font-bold text-stone-800">
            <span>🌧️ Calming Rainfall White Noise</span>
            <span className="text-cyan-700">{rainVolume}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={rainVolume}
            onChange={(e) => setRainVolume(Number(e.target.value))}
            className="w-full accent-cyan-600 cursor-pointer"
          />
          <p className="text-[10px] text-stone-500">Soothing acoustic pink/brown noise layer</p>
        </div>
      </div>
    </div>
  );
};
