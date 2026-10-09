import React, { useState } from 'react';
import {
  X,
  Smile,
  Battery,
  Moon,
  Footprints,
  Users,
  Droplets,
  Heart,
  Sparkles,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { CheckInRecord, MoodType, EnergyType, SleepQualityType, ActivityLevelType, SocialConnectionType } from '../types';
import { calculateWellBeingScore, saveCheckIn, triggerCelebration } from '../utils/storage';
import { soundEngine } from '../utils/audio';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (record: CheckInRecord) => void;
  habitsRatio: number;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  habitsRatio,
}) => {
  const [mood, setMood] = useState<MoodType>('good');
  const [energy, setEnergy] = useState<EnergyType>('medium');
  const [sleepQuality, setSleepQuality] = useState<SleepQualityType>('good');
  const [sleepHours, setSleepHours] = useState<number>(7.5);
  const [activityLevel, setActivityLevel] = useState<ActivityLevelType>('some');
  const [activityMinutes, setActivityMinutes] = useState<number>(25);
  const [waterGlasses, setWaterGlasses] = useState<number>(7);
  const [socialConnection, setSocialConnection] = useState<SocialConnectionType>('connected');
  const [notes, setNotes] = useState<string>('');
  const [gratitudeNote, setGratitudeNote] = useState<string>('');
  const [step, setStep] = useState<number>(1);

  if (!isOpen) return null;

  const currentPreview = calculateWellBeingScore(
    { mood, energy, sleepQuality, sleepHours, activityLevel, activityMinutes, socialConnection },
    habitsRatio
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const todayStr = new Date().toISOString().split('T')[0];

    const newRecord: CheckInRecord = {
      id: `chk-${Date.now()}`,
      date: todayStr,
      timestamp: Date.now(),
      mood,
      energy,
      sleepQuality,
      sleepHours,
      activityLevel,
      activityMinutes,
      waterGlasses,
      socialConnection,
      notes,
      gratitudeNote,
      calculatedScore: currentPreview.score,
      breakdown: currentPreview.breakdown,
    };

    saveCheckIn(newRecord);
    soundEngine.playChime('high');
    triggerCelebration();
    onComplete(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/30 text-emerald-100 border border-emerald-400/30 mb-2">
            🌱 SDG 3 Daily Well-Being Check-In
          </div>
          <h2 className="text-xl font-bold">How are you feeling today?</h2>
          <p className="text-emerald-100 text-xs mt-1">
            A safe, non-diagnostic space to notice your rhythm and build self-awareness.
          </p>

          {/* Real-time Indicator Preview */}
          <div className="mt-4 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-medium text-emerald-200 uppercase tracking-wider block">
                Estimated Well-Being Indicator
              </span>
              <span className="text-xs text-white/80">Reflects emotional state, rest, movement & ties</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-extrabold text-white">{currentPreview.score}</span>
              <span className="text-xs text-emerald-200 font-semibold">/ 100</span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Question 1: Mood */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-stone-800 flex items-center gap-1.5">
              <span>1. How are you feeling right now?</span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(
                [
                  { type: 'great', label: 'Great', emoji: '😊', color: 'border-emerald-500 bg-emerald-50 text-emerald-800' },
                  { type: 'good', label: 'Good', emoji: '🙂', color: 'border-teal-500 bg-teal-50 text-teal-800' },
                  { type: 'okay', label: 'Okay', emoji: '😐', color: 'border-amber-500 bg-amber-50 text-amber-800' },
                  { type: 'low', label: 'Low', emoji: '😔', color: 'border-orange-500 bg-orange-50 text-orange-800' },
                  { type: 'difficult', label: 'Difficult', emoji: '😣', color: 'border-rose-500 bg-rose-50 text-rose-800' },
                ] as const
              ).map((m) => (
                <button
                  key={m.type}
                  type="button"
                  onClick={() => setMood(m.type)}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                    mood === m.type
                      ? `${m.color} ring-2 ring-emerald-500/30 scale-102 font-bold`
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 text-stone-600'
                  }`}
                >
                  <span className="text-2xl mb-1">{m.emoji}</span>
                  <span className="text-xs">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Energy */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-stone-800 flex items-center gap-1.5">
              <span>2. How was your energy today?</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  { type: 'high', label: 'High Energy', icon: '⚡ High (80%+)', desc: 'Feeling vibrant & alert' },
                  { type: 'medium', label: 'Medium Energy', icon: '🔋 Balanced', desc: 'Steady, manageable pace' },
                  { type: 'low', label: 'Low Energy', icon: '🪫 Drained', desc: 'Feeling heavy or depleted' },
                ] as const
              ).map((e) => (
                <button
                  key={e.type}
                  type="button"
                  onClick={() => setEnergy(e.type)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    energy === e.type
                      ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold ring-2 ring-emerald-500/20'
                      : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                  }`}
                >
                  <div className="text-xs font-bold">{e.icon}</div>
                  <div className="text-[11px] text-stone-500 mt-0.5">{e.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Sleep */}
          <div className="space-y-3 bg-stone-50/80 p-4 rounded-2xl border border-stone-200">
            <label className="block text-sm font-bold text-stone-800 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-500" />
                3. Sleep & Restful Recovery
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                {sleepHours} Hours Logged
              </span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { type: 'good', label: 'Deep / Refreshing', emoji: '😊' },
                  { type: 'average', label: 'Average Rest', emoji: '😐' },
                  { type: 'poor', label: 'Restless / Fragmented', emoji: '😴' },
                ] as const
              ).map((s) => (
                <button
                  key={s.type}
                  type="button"
                  onClick={() => setSleepQuality(s.type)}
                  className={`p-2.5 rounded-lg border text-xs flex items-center justify-center gap-1.5 transition-all ${
                    sleepQuality === s.type
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                      : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <span>{s.emoji}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <div className="flex justify-between text-xs text-stone-500 mb-1">
                <span>4.0 hrs</span>
                <span className="font-semibold text-stone-700">Duration: {sleepHours} hours</span>
                <span>12.0 hrs</span>
              </div>
              <input
                type="range"
                min="4"
                max="12"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Question 4: Activity & Hydration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Movement */}
            <div className="space-y-2 bg-stone-50/80 p-4 rounded-2xl border border-stone-200">
              <label className="block text-xs font-bold text-stone-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Footprints className="w-3.5 h-3.5 text-emerald-600" />
                  4. Physical Movement
                </span>
                <span className="text-emerald-700 font-semibold">{activityMinutes} mins</span>
              </label>
              <div className="flex gap-2">
                {(
                  [
                    { type: 'none', label: 'Resting / Sedentary', min: 5 },
                    { type: 'some', label: 'Moderate (15-30m)', min: 25 },
                    { type: 'active', label: 'Very Active (40m+)', min: 45 },
                  ] as const
                ).map((a) => (
                  <button
                    key={a.type}
                    type="button"
                    onClick={() => {
                      setActivityLevel(a.type);
                      setActivityMinutes(a.min);
                    }}
                    className={`flex-1 py-2 px-1 rounded-lg border text-[11px] text-center font-medium transition-all ${
                      activityLevel === a.type
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                        : 'border-stone-200 bg-white text-stone-600'
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hydration */}
            <div className="space-y-2 bg-stone-50/80 p-4 rounded-2xl border border-stone-200">
              <label className="block text-xs font-bold text-stone-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-cyan-600" />
                  5. Hydration
                </span>
                <span className="text-cyan-700 font-semibold">
                  {waterGlasses} glasses ({(waterGlasses * 0.25).toFixed(1)}L)
                </span>
              </label>
              <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-stone-200">
                <button
                  type="button"
                  onClick={() => setWaterGlasses(Math.max(1, waterGlasses - 1))}
                  className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 font-bold text-stone-700 flex items-center justify-center text-sm"
                >
                  -
                </button>
                <div className="flex gap-1">
                  {[...Array(Math.min(8, waterGlasses))].map((_, i) => (
                    <span key={i} className="text-base">💧</span>
                  ))}
                  {waterGlasses > 8 && <span className="text-xs font-bold text-cyan-700 self-center">+{waterGlasses - 8}</span>}
                </div>
                <button
                  type="button"
                  onClick={() => setWaterGlasses(Math.min(14, waterGlasses + 1))}
                  className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 font-bold text-stone-700 flex items-center justify-center text-sm"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Question 5: Social Connection */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-stone-800 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-teal-600" />
              <span>6. How connected did you feel with others?</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  { type: 'connected', label: 'Connected', emoji: '💙', desc: 'Felt supported or engaged' },
                  { type: 'neutral', label: 'Neutral', emoji: '😐', desc: 'Ordinary day-to-day rhythm' },
                  { type: 'isolated', label: 'Isolated', emoji: '🌧️', desc: 'Felt distant, quiet, or lonely' },
                ] as const
              ).map((c) => (
                <button
                  key={c.type}
                  type="button"
                  onClick={() => setSocialConnection(c.type)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    socialConnection === c.type
                      ? 'border-teal-600 bg-teal-50 text-teal-950 font-bold ring-2 ring-teal-500/20'
                      : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                  }`}
                >
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <span>{c.emoji}</span> {c.label}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">{c.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Self-Reflection Note */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-800">
              7. Self-Reflection & Thoughts (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What made you pause, smile, or feel stretched today? What would nurture you tonight?"
              className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:outline-emerald-600 focus:ring-1 focus:ring-emerald-500 min-h-[70px] bg-stone-50/50"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-500 hover:text-stone-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-700/20 flex items-center gap-2 hover:scale-102 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              Complete Check-In & Update Indicator
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
