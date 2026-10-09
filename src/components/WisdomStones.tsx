import React, { useState } from 'react';
import { Sparkles, RotateCcw, CheckCircle, Heart, ArrowRight } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { triggerCelebration } from '../utils/storage';

export const WisdomStones: React.FC = () => {
  const [selectedStone, setSelectedStone] = useState<number | null>(null);

  const stoneWisdoms = [
    {
      stoneName: 'Jasper of Stillness',
      color: 'from-amber-700 to-amber-900',
      reflection: '“You do not have to conquer every mountain today. Some days are simply meant for gathering water at the base.”',
      microChallenge: 'Look out a window right now and follow the gentle movement of a single leaf or cloud for 45 seconds.',
    },
    {
      stoneName: 'River Stone of Kindness',
      color: 'from-emerald-700 to-teal-900',
      reflection: '“Talk to yourself the exact way you would talk to a small child who is doing their very best.”',
      microChallenge: 'Place your hand over your heart, take three long exhales, and silently say: “I am doing enough.”',
    },
    {
      stoneName: 'Amethyst of Perspective',
      color: 'from-purple-800 to-indigo-950',
      reflection: '“Most urgent things are not important; most important things are rarely screaming for attention.”',
      microChallenge: 'Identify one task you can safely put aside until tomorrow without any real catastrophe.',
    },
    {
      stoneName: 'Obsidian of Boundaries',
      color: 'from-stone-700 to-stone-900',
      reflection: '“Saying ‘no’ to a draining demand is saying ‘yes’ to your sanity and long-term vitality.”',
      microChallenge: 'Silence non-essential notification badges on your computer or phone for the next 2 hours.',
    },
    {
      stoneName: 'Rose Quartz of Acceptance',
      color: 'from-rose-700 to-pink-900',
      reflection: '“Healing is not linear. Feeling heavy today does not erase the solid ground you crossed yesterday.”',
      microChallenge: 'Drink your next glass of water with your eyes closed, noticing temperature and taste fully.',
    },
    {
      stoneName: 'Jade of Renewal',
      color: 'from-teal-700 to-emerald-950',
      reflection: '“Every new breath is an invitation to start fresh, unburdened by the previous hour.”',
      microChallenge: 'Roll your shoulders backward five times and unclench your jaw completely.',
    },
  ];

  const handlePickStone = (idx: number) => {
    soundEngine.playChime('high');
    triggerCelebration();
    setSelectedStone(idx);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-1.5">
            🪨 Daily Mindful Wisdom Stones
          </div>
          <h2 className="text-xl font-bold text-stone-900">Tactile Wisdom Stones & Micro-Challenges</h2>
          <p className="text-xs text-stone-500">
            Pick a stone from the riverbed to receive your grounded reflection and a 60-second micro-challenge.
          </p>
        </div>

        {selectedStone !== null && (
          <button
            onClick={() => setSelectedStone(null)}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Pick Another Stone
          </button>
        )}
      </div>

      {/* 6 Stones Grid */}
      {selectedStone === null ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4">
          {stoneWisdoms.map((stone, idx) => (
            <button
              key={idx}
              onClick={() => handlePickStone(idx)}
              className="group p-6 rounded-3xl bg-gradient-to-b from-stone-100 to-stone-50 border border-stone-200 hover:border-emerald-400 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center space-y-3 cursor-pointer"
            >
              {/* Stone 3D egg-shape */}
              <div
                className={`w-20 h-16 rounded-[45%] bg-gradient-to-br ${stone.color} shadow-md group-hover:scale-110 group-hover:rotate-2 transition-transform duration-300 flex items-center justify-center text-white/40 text-xs`}
              >
                ✨
              </div>

              <div className="space-y-0.5">
                <span className="text-xs font-bold text-stone-800 group-hover:text-emerald-700 transition-colors block">
                  {stone.stoneName}
                </span>
                <span className="text-[10px] text-stone-400">Click to reveal</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        /* Selected Stone Reveal Card */
        <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/70 border border-emerald-200 shadow-sm space-y-6 animate-in fade-in zoom-in-95 max-w-2xl mx-auto text-center">
          <div
            className={`w-24 h-20 rounded-[45%] bg-gradient-to-br ${stoneWisdoms[selectedStone].color} shadow-lg mx-auto flex items-center justify-center text-white text-xl animate-float`}
          >
            ✨
          </div>

          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800">
              {stoneWisdoms[selectedStone].stoneName}
            </span>
            <p className="text-base sm:text-lg font-serif-accent italic text-stone-800 leading-relaxed max-w-lg mx-auto">
              {stoneWisdoms[selectedStone].reflection}
            </p>
          </div>

          {/* Micro-Challenge Box */}
          <div className="p-4 rounded-2xl bg-white border border-emerald-200/80 shadow-xs text-left space-y-1.5 max-w-lg mx-auto">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Your 60-Second Micro-Challenge:</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed font-medium">
              {stoneWisdoms[selectedStone].microChallenge}
            </p>
          </div>

          <button
            onClick={() => setSelectedStone(null)}
            className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all hover:scale-102 mx-auto inline-flex items-center gap-2"
          >
            <span>Done with Practice</span>
            <CheckCircle className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
