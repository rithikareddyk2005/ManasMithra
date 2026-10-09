import React, { useState, useEffect } from 'react';
import { Sparkles, Droplets, Sun, Wind, Heart, Award, RefreshCw, Leaf } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { triggerCelebration } from '../utils/storage';

interface MindGardenProps {
  completedHabitsCount: number;
  totalHabitsCount: number;
  hasCheckedInToday: boolean;
}

export const MindGarden: React.FC<MindGardenProps> = ({
  completedHabitsCount,
  totalHabitsCount,
  hasCheckedInToday,
}) => {
  // Garden level state persisted in localStorage
  const [gardenPoints, setGardenPoints] = useState<number>(() => {
    const saved = localStorage.getItem('manasmitra_garden_points');
    return saved ? parseInt(saved, 10) : 35;
  });

  const [activeLeafNote, setActiveLeafNote] = useState<string | null>(null);
  const [justWatered, setJustWatered] = useState(false);
  const [justShined, setJustShined] = useState(false);

  // Compute garden stage based on points (1 to 5)
  const stage = Math.min(5, Math.max(1, Math.floor(gardenPoints / 25) + 1));

  const stagesInfo = [
    { name: 'Tender Sprout', emoji: '🌱', title: 'Beginning of Mindful Awareness', desc: 'A tiny seed of self-compassion rooted in rich, patient soil.' },
    { name: 'Young Bodhi Sapling', emoji: '🌿', title: 'Consistent Micro-Rhythms', desc: 'Developing strong roots with hydration, regular rest, and gentle movement.' },
    { name: 'Budding Wellness Tree', emoji: '🌸', title: 'Flowering Emotional Balance', desc: 'Branching out into social connections, calm pauses, and positive reflections.' },
    { name: 'Flourishing Zen Bonsai', emoji: '🌳', title: 'Holistic Equilibrium', desc: 'A steadfast sanctuary of inner peace, weathering deadlines and changes gracefully.' },
    { name: 'Golden Radiance Blossom', emoji: '✨', title: 'Preventive Wisdom Mastery', desc: 'Full bloom of SDG 3 well-being: mental, physical, emotional, and social harmony.' },
  ];

  const currentStage = stagesInfo[stage - 1];

  const handleWater = () => {
    soundEngine.playWaterDrop();
    setGardenPoints((prev) => {
      const next = prev + 5;
      localStorage.setItem('manasmitra_garden_points', next.toString());
      return next;
    });
    setJustWatered(true);
    setTimeout(() => setJustWatered(false), 2000);
  };

  const handleSunshine = () => {
    soundEngine.playChime('high');
    setGardenPoints((prev) => {
      const next = prev + 5;
      localStorage.setItem('manasmitra_garden_points', next.toString());
      return next;
    });
    setJustShined(true);
    setTimeout(() => setJustShined(false), 2000);
  };

  const leafWisdom = [
    '“You do not need to earn your rest. Rest is a biological requirement, not a reward.”',
    '“Deep roots are formed during quiet seasons of stillness.”',
    '“Take one slow breath for every anxious thought you encountered today.”',
    '“Progress in well-being is measured in gentle recovery, not uninterrupted perfection.”',
    '“Drink a mindful sip of water and notice the coolness traveling down.”',
    '“You are worthy of the same kindness you effortlessly give to others.”',
  ];

  const handleLeafClick = (idx: number) => {
    soundEngine.playChime('medium');
    setActiveLeafNote(leafWisdom[idx % leafWisdom.length]);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-1.5">
            🌱 Interactive Zen Mind Garden
          </div>
          <h2 className="text-xl font-bold text-stone-900">Your Living Well-Being Garden</h2>
          <p className="text-xs text-stone-500">
            Nourished each day by your hydration, check-ins, sleep, and mindful pauses.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto bg-stone-50 px-4 py-2 rounded-2xl border border-stone-200">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <div className="text-xs">
            <span className="text-stone-500">Vitality Points: </span>
            <strong className="text-stone-900 font-extrabold">{gardenPoints} pts</strong>
          </div>
        </div>
      </div>

      {/* Main Garden Visual Stage */}
      <div className="relative rounded-3xl bg-gradient-to-b from-teal-900/10 via-emerald-800/5 to-amber-900/10 border border-emerald-200/60 p-8 flex flex-col items-center justify-center min-h-[300px] overflow-hidden text-center">
        {/* Sky / sunlight aura */}
        <div
          className={`absolute top-4 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-amber-200/40 blur-3xl pointer-events-none transition-all duration-1000 ${
            justShined ? 'scale-150 opacity-90' : 'opacity-40'
          }`}
        />

        {/* Rain droplets visual effect */}
        {justWatered && (
          <div className="absolute inset-0 pointer-events-none flex justify-center items-center gap-6 animate-pulse">
            <span className="text-2xl animate-bounce">💧</span>
            <span className="text-3xl animate-bounce [animation-delay:0.2s]">💧</span>
            <span className="text-2xl animate-bounce [animation-delay:0.4s]">💧</span>
          </div>
        )}

        {/* Tree / Plant Visual */}
        <div className="relative z-10 space-y-4 my-2">
          <div className="relative inline-block">
            {/* Stage Icon */}
            <div className="text-7xl sm:text-8xl select-none filter drop-shadow-md animate-float cursor-pointer hover:scale-110 transition-transform">
              {currentStage.emoji}
            </div>

            {/* Glowing aura if stage 5 */}
            {stage === 5 && (
              <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-xl animate-pulse" />
            )}
          </div>

          <div className="space-y-1 max-w-sm mx-auto">
            <div className="text-sm font-bold text-emerald-950 flex items-center justify-center gap-1.5">
              <span>Stage {stage}: {currentStage.name}</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              {currentStage.desc}
            </p>
          </div>
        </div>

        {/* Interactive Clickable Leaves with Wisdom */}
        <div className="relative z-10 flex flex-wrap justify-center gap-2 mt-4 pt-4 border-t border-emerald-900/10 w-full max-w-md">
          <span className="w-full text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">
            Tap a leaf to reveal soothing wisdom:
          </span>
          {[0, 1, 2, 3].map((idx) => (
            <button
              key={idx}
              onClick={() => handleLeafClick(idx)}
              className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-emerald-50 border border-emerald-300/80 text-emerald-800 text-xs font-semibold shadow-2xs transition-all hover:scale-105 flex items-center gap-1"
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>Leaf #{idx + 1}</span>
            </button>
          ))}
        </div>

        {/* Display Leaf Note if clicked */}
        {activeLeafNote && (
          <div className="relative z-10 mt-3 p-4 rounded-2xl bg-white/95 border border-emerald-300 text-xs text-emerald-950 shadow-md max-w-md animate-in fade-in zoom-in-95">
            <p className="italic font-serif-accent text-sm leading-relaxed text-stone-800">
              {activeLeafNote}
            </p>
            <button
              onClick={() => setActiveLeafNote(null)}
              className="mt-2 text-[10px] text-stone-400 hover:text-stone-700 font-bold"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Garden Tending Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={handleWater}
          className="p-4 rounded-2xl border border-cyan-200 hover:border-cyan-400 bg-cyan-50/50 hover:bg-cyan-50 transition-all text-left flex items-center gap-3.5 group shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500 text-white flex items-center justify-center text-lg shadow-xs group-hover:scale-105 transition-transform">
            💧
          </div>
          <div>
            <div className="font-bold text-xs text-cyan-950">Water Your Mind Garden</div>
            <div className="text-[11px] text-cyan-700">Nourish with a conscious sip of water (+5 pts)</div>
          </div>
        </button>

        <button
          onClick={handleSunshine}
          className="p-4 rounded-2xl border border-amber-200 hover:border-amber-400 bg-amber-50/50 hover:bg-amber-50 transition-all text-left flex items-center gap-3.5 group shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-lg shadow-xs group-hover:scale-105 transition-transform">
            ☀️
          </div>
          <div>
            <div className="font-bold text-xs text-amber-950">Send Gratitude Sunshine</div>
            <div className="text-[11px] text-amber-700">Send warmth to a kind thought (+5 pts)</div>
          </div>
        </button>
      </div>

      {/* Growth Progress to Next Stage */}
      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
        <div className="flex justify-between text-xs font-semibold text-stone-700">
          <span>Growth to Next Stage ({Math.min(100, Math.round(((gardenPoints % 25) / 25) * 100))}%)</span>
          <span className="text-emerald-700 font-bold">{25 - (gardenPoints % 25)} pts to advance</span>
        </div>
        <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.min(100, ((gardenPoints % 25) / 25) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
