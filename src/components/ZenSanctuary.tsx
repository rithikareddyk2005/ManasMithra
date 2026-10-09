import React, { useState } from 'react';
import { Sparkles, Moon, Bell, Coffee, Wind, Compass, Leaf } from 'lucide-react';
import { MindGarden } from './MindGarden';
import { WorryReleasePond } from './WorryReleasePond';
import { SingingBowlSanctuary } from './SingingBowlSanctuary';
import { WisdomStones } from './WisdomStones';
import { DecompressionCafe } from './DecompressionCafe';
import { SoundBathMixer } from './SoundBathMixer';

interface ZenSanctuaryProps {
  completedHabitsCount: number;
  totalHabitsCount: number;
  hasCheckedInToday: boolean;
}

export const ZenSanctuary: React.FC<ZenSanctuaryProps> = ({
  completedHabitsCount,
  totalHabitsCount,
  hasCheckedInToday,
}) => {
  const [activeTool, setActiveTool] = useState<'garden' | 'worry' | 'bowl' | 'mixer' | 'stones' | 'cafe'>('garden');

  const tools = [
    { id: 'garden', label: '🌿 Zen Mind Garden', desc: 'Living growth tree', icon: Leaf },
    { id: 'worry', label: '🏮 Worry Release Pond', desc: 'Lanterns & pebbles', icon: Wind },
    { id: 'bowl', label: '🔔 Singing Bowl Sanctuary', desc: 'Acoustic Solfeggio', icon: Bell },
    { id: 'mixer', label: '🎵 Sound Bath Mixer', desc: 'Binaural & 432Hz', icon: Sparkles },
    { id: 'stones', label: '🪨 Daily Wisdom Stones', desc: 'Tactile cards', icon: Sparkles },
    { id: 'cafe', label: '☕ Decompression Cafe', desc: '3-min micro-rest', icon: Coffee },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-indigo-950 text-white p-6 sm:p-7 rounded-3xl shadow-lg space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-400 text-emerald-950">
            🌱 Creative De-Stress Sanctuary
          </span>
          <span className="text-xs text-emerald-200">
            Non-verbal, experiential, and restorative mindfulness tools
          </span>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            The ManasMitra Zen Sanctuary
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm max-w-2xl mt-1 leading-relaxed">
            When you don't feel like typing or talking, enter this tranquil space to tend your mind garden, release worries into starry skies, and resonate with acoustic frequencies.
          </p>
        </div>

        {/* Sanctuary Sub-tabs */}
        <div className="flex gap-2 overflow-x-auto pt-2 border-t border-emerald-800/60 pb-1">
          {tools.map((t) => {
            const active = activeTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTool(t.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  active
                    ? 'bg-white text-emerald-950 shadow-md scale-102'
                    : 'bg-white/10 hover:bg-white/20 text-emerald-100'
                }`}
              >
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render active tool */}
      <div>
        {activeTool === 'garden' && (
          <MindGarden
            completedHabitsCount={completedHabitsCount}
            totalHabitsCount={totalHabitsCount}
            hasCheckedInToday={hasCheckedInToday}
          />
        )}
        {activeTool === 'worry' && <WorryReleasePond />}
        {activeTool === 'bowl' && <SingingBowlSanctuary />}
        {activeTool === 'mixer' && <SoundBathMixer />}
        {activeTool === 'stones' && <WisdomStones />}
        {activeTool === 'cafe' && <DecompressionCafe />}
      </div>
    </div>
  );
};
