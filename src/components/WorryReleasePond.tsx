import React, { useState } from 'react';
import { Wind, Send, Sparkles, CheckCircle2, RotateCcw, Heart, Flame } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export const WorryReleasePond: React.FC = () => {
  const [worryText, setWorryText] = useState('');
  const [releaseMethod, setReleaseMethod] = useState<'lantern' | 'pebble' | 'leaf'>('lantern');
  const [isReleasing, setIsReleasing] = useState(false);
  const [released, setReleased] = useState(false);
  const [lastReleasedThought, setLastReleasedThought] = useState('');

  const handleRelease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!worryText.trim() || isReleasing) return;

    setIsReleasing(true);
    setLastReleasedThought(worryText.trim());

    if (releaseMethod === 'pebble') {
      soundEngine.playWaterDrop();
    } else {
      soundEngine.playTibetanBowl(432);
    }

    setTimeout(() => {
      setIsReleasing(false);
      setReleased(true);
      setWorryText('');
    }, 2800);
  };

  const handleReset = () => {
    setReleased(false);
    setWorryText('');
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 mb-1.5">
            🏮 Cognitive Defusion Sanctuary
          </div>
          <h2 className="text-xl font-bold text-stone-900">The Worry Release Pond & Sky Lanterns</h2>
          <p className="text-xs text-stone-500">
            A scientifically backed ACT practice: externalize intrusive thoughts, loosen their grip, and let them float away.
          </p>
        </div>
      </div>

      {!released ? (
        <form onSubmit={handleRelease} className="space-y-5">
          {/* Release Method Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700">
              Choose how you wish to release this thought:
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'lantern', label: '🏮 Sky Lantern', desc: 'Floats gently into the calm starry night' },
                { id: 'pebble', label: '💧 River Pebble', desc: 'Dissolves into peaceful rippling waters' },
                { id: 'leaf', label: '🍃 Stream Leaf', desc: 'Drifts peacefully down an autumn stream' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setReleaseMethod(m.id as any)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    releaseMethod === m.id
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold ring-2 ring-indigo-500/20'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 text-stone-700'
                  }`}
                >
                  <div className="text-xs font-bold">{m.label}</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Worry Text Area */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-700">
              What is weighing on your mind right now?
            </label>
            <textarea
              value={worryText}
              onChange={(e) => setWorryText(e.target.value)}
              disabled={isReleasing}
              placeholder="e.g. 'I am worried about my exam results tomorrow', 'I feel like I'm falling behind my peers', 'I can't seem to stop overthinking'..."
              className="w-full text-xs sm:text-sm p-4 rounded-2xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-indigo-600 focus:ring-1 focus:ring-indigo-500 min-h-[90px] transition-colors leading-relaxed"
            />
            <span className="text-[11px] text-stone-400 block">
              *Your thought is processed purely locally in your browser. It is never permanently stored or shared.
            </span>
          </div>

          {/* Animation View during release */}
          {isReleasing && (
            <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-indigo-950 text-white text-center space-y-4 overflow-hidden relative animate-in fade-in">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent pointer-events-none" />

              <div className="relative z-10 space-y-3">
                {releaseMethod === 'lantern' ? (
                  <div className="inline-block animate-float">
                    <div className="text-5xl filter drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]">
                      🏮
                    </div>
                  </div>
                ) : releaseMethod === 'pebble' ? (
                  <div className="text-5xl animate-bounce">💧</div>
                ) : (
                  <div className="text-5xl animate-float">🍃</div>
                )}

                <div className="text-xs font-serif-accent italic text-indigo-200 max-w-sm mx-auto">
                  “{worryText}”
                </div>

                <div className="text-xs font-bold text-emerald-300">
                  {releaseMethod === 'lantern'
                    ? 'Rising gently into the vast starry sky...'
                    : releaseMethod === 'pebble'
                    ? 'Rippling into the calm deep pond and dissolving...'
                    : 'Drifting softly down the peaceful flowing stream...'}
                </div>
              </div>
            </div>
          )}

          {!isReleasing && (
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={!worryText.trim()}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all hover:scale-102 flex items-center gap-2"
              >
                <span>Release Thought & Let Go</span>
                <Wind className="w-4 h-4" />
              </button>
            </div>
          )}
        </form>
      ) : (
        /* Post-Release Reflection State */
        <div className="p-8 rounded-3xl bg-gradient-to-b from-indigo-50/70 to-emerald-50/70 border border-indigo-200 text-center space-y-4 animate-in fade-in zoom-in-95">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl mx-auto shadow-sm">
            🌿
          </div>

          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-base font-bold text-stone-900">
              Thought Released to the Universe
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              You have acknowledged this heavy thought, honored your human emotion, and chosen not to carry its burden for the rest of this moment.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/80 border border-stone-200 text-xs text-stone-700 max-w-sm mx-auto italic font-serif-accent">
            “You are the vast sky. Thoughts are merely passing clouds.”
          </div>

          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" /> Release Another Thought
          </button>
        </div>
      )}
    </div>
  );
};
