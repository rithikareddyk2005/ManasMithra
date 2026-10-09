import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Flame,
  Plus,
  Droplets,
  Moon,
  Footprints,
  Sparkles,
  Heart,
  TrendingUp,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { HabitItem, HabitCategory } from '../types';
import { soundEngine } from '../utils/audio';
import { triggerCelebration } from '../utils/storage';

interface HabitsTrackerProps {
  habits: HabitItem[];
  onUpdateHabits: (habits: HabitItem[]) => void;
  onLaunchActivity: (activity: any) => void;
}

export const HabitsTracker: React.FC<HabitsTrackerProps> = ({
  habits,
  onUpdateHabits,
  onLaunchActivity,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<HabitCategory>('physical');
  const [newTarget, setNewTarget] = useState('Daily');

  // Quick Hydration Counter
  const hydrationHabit = habits.find((h) => h.category === 'hydration');
  const [waterGlasses, setWaterGlasses] = useState(7);

  const toggleHabit = (id: string) => {
    soundEngine.playChime('medium');
    const updated = habits.map((h) => {
      if (h.id === id) {
        const nextCompleted = !h.completed;
        if (nextCompleted) {
          triggerCelebration();
        }
        return {
          ...h,
          completed: nextCompleted,
          streak: nextCompleted ? h.streak + 1 : Math.max(0, h.streak - 1),
        };
      }
      return h;
    });
    onUpdateHabits(updated);
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newHabit: HabitItem = {
      id: `custom-habit-${Date.now()}`,
      title: newTitle.trim(),
      description: 'Personal well-being routine aligned with daily balance.',
      category: newCategory,
      pillar:
        newCategory === 'rest'
          ? 'Healthy Habits'
          : newCategory === 'mental'
          ? 'Mental Awareness'
          : newCategory === 'social'
          ? 'Social Well-Being'
          : 'Healthy Habits',
      completed: false,
      streak: 0,
      targetUnit: newTarget,
    };

    onUpdateHabits([...habits, newHabit]);
    setNewTitle('');
    setShowAddModal(false);
    soundEngine.playChime('high');
  };

  const removeHabit = (id: string) => {
    onUpdateHabits(habits.filter((h) => h.id !== id));
  };

  const completedCount = habits.filter((h) => h.completed).length;
  const progressPercent = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/30 text-emerald-100 border border-emerald-400/30 mb-2">
            🌱 SDG 3.4 Preventive Lifestyle Routines
          </div>
          <h2 className="text-xl font-bold">Healthy Lifestyle & Habit Builder</h2>
          <p className="text-emerald-100 text-xs mt-1 max-w-lg">
            Consistent micro-habits—sleep rhythm, hydration, and movement—anchor long-term mental clarity and physiological resilience.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0">
          <div className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider">
            Today's Completion
          </div>
          <div className="text-3xl font-extrabold text-white mt-0.5">
            {progressPercent}%
          </div>
          <div className="text-xs text-emerald-100 font-medium">
            {completedCount} of {habits.length} habits done
          </div>
        </div>
      </div>

      {/* 3 Lifestyle Micro-Trackers: Sleep, Hydration, Movement */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sleep Rhythm */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                <Moon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-stone-900">Sleep Architecture</h3>
            </div>
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
              7.5 hrs avg
            </span>
          </div>
          <p className="text-xs text-stone-600">
            Target: In bed by 11:00 PM to protect slow-wave deep sleep cycles.
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
            <span className="text-stone-500">Sleep Consistency:</span>
            <span className="font-bold text-emerald-700">92% Regular</span>
          </div>
        </div>

        {/* Hydration Tracker */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-50 text-cyan-700">
                <Droplets className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-stone-900">Cellular Hydration</h3>
            </div>
            <span className="text-[11px] font-semibold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full">
              {(waterGlasses * 0.25).toFixed(1)} / 2.0 L
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-600">{waterGlasses} glasses consumed</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setWaterGlasses(Math.max(0, waterGlasses - 1))}
                className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 font-bold text-stone-700 flex items-center justify-center text-xs"
              >
                -
              </button>
              <button
                onClick={() => {
                  soundEngine.playChime('medium');
                  setWaterGlasses(waterGlasses + 1);
                }}
                className="w-7 h-7 rounded-lg bg-cyan-600 hover:bg-cyan-700 font-bold text-white flex items-center justify-center text-xs shadow-xs"
              >
                +
              </button>
            </div>
          </div>
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-cyan-500 h-full transition-all"
              style={{ width: `${Math.min(100, (waterGlasses / 8) * 100)}%` }}
            />
          </div>
        </div>

        {/* Physical Movement */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <Footprints className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-stone-900">Physical Movement</h3>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              32 min today
            </span>
          </div>
          <p className="text-xs text-stone-600">
            20 minutes of brisk walking stimulates brain-derived neurotrophic factor (BDNF).
          </p>
          <button
            onClick={() => onLaunchActivity('stretch')}
            className="w-full py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors"
          >
            Launch 5-Minute Desk Stretch 🏃
          </button>
        </div>
      </div>

      {/* Main Habit Checklist & Streak Tracker */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-stone-900">Your Daily Well-Being Habits</h3>
            <p className="text-xs text-stone-500">
              Check off your wellness habits as you practice them throughout the day.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all hover:scale-102"
          >
            <Plus className="w-4 h-4" /> Add Custom Habit
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 bg-stone-50 p-4 rounded-2xl border border-stone-200">
          <div className="flex justify-between text-xs font-semibold text-stone-700">
            <span>Daily Routine Completion</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Habit List */}
        <div className="space-y-2.5">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                habit.completed
                  ? 'bg-emerald-50/60 border-emerald-300/80 shadow-2xs'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center gap-3.5 flex-1">
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                    habit.completed
                      ? 'bg-emerald-600 text-white'
                      : 'border-2 border-stone-300 hover:border-emerald-500 text-transparent'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs sm:text-sm font-bold ${
                        habit.completed ? 'line-through text-stone-500' : 'text-stone-900'
                      }`}
                    >
                      {habit.title}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                      {habit.pillar}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 hidden sm:block">{habit.description}</p>
                </div>
              </div>

              {/* Right: Streak & Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <div
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold"
                  title="Daily consistency streak"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{habit.streak}d streak</span>
                </div>

                {habit.id.startsWith('custom-habit') && (
                  <button
                    onClick={() => removeHabit(habit.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Custom Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <h3 className="font-bold text-base text-stone-900">Create New Healthy Habit</h3>
            <p className="text-xs text-stone-500">
              Anchor small, manageable routines aligned with UN SDG 3 Good Health.
            </p>

            <form onSubmit={handleAddHabit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Habit Name</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 10-minute Evening Journaling, Morning Stretch"
                  className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:outline-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Pillar Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:outline-emerald-600 bg-white"
                >
                  <option value="physical">Physical Movement</option>
                  <option value="rest">Sleep & Rest</option>
                  <option value="hydration">Hydration</option>
                  <option value="mindful">Mindfulness & Breathing</option>
                  <option value="mental">Mental Awareness</option>
                  <option value="social">Social Connection</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Target Frequency</label>
                <input
                  type="text"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  placeholder="e.g. Daily, 3x per week"
                  className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:outline-emerald-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-stone-500 hover:text-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
                >
                  Add Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
