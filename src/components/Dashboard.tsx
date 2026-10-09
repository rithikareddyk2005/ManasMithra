import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Heart,
  Moon,
  Footprints,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Wind,
  Brain,
  Droplets,
  Users,
  Smile,
  ShieldCheck,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { CheckInRecord, HabitItem, PersonalizedRecommendation, PreventiveObservation } from '../types';
import { THEMES, ThemeId } from '../utils/theme';

interface DashboardProps {
  latestCheckIn?: CheckInRecord;
  habits: HabitItem[];
  preventiveObservation: PreventiveObservation;
  userName: string;
  onOpenCheckIn: () => void;
  onNavigateTab: (tab: string) => void;
  onLaunchActivity: (activity: 'breathing' | 'reframe' | 'grounding' | 'gratitude' | 'stretch') => void;
  onOpenZenMode: () => void;
  currentTheme?: ThemeId;
}

export const Dashboard: React.FC<DashboardProps> = ({
  latestCheckIn,
  habits,
  preventiveObservation,
  userName,
  onOpenCheckIn,
  onNavigateTab,
  onLaunchActivity,
  onOpenZenMode,
  currentTheme = 'emerald',
}) => {
  const theme = THEMES[currentTheme] || THEMES.emerald;
  const [recommendation, setRecommendation] = useState<PersonalizedRecommendation>({
    headline: 'Gentle Pacing & Restorative Movement',
    recommendation:
      'You logged steady rest and active focus today. A short 10-minute walk or light stretching session will help release physical tension and refresh your mind.',
    suggestedActivity: 'stretch',
    pillar: 'Healthy Habits',
  });
  const [isLoadingRec, setIsLoadingRec] = useState(false);

  // Determine current greeting based on local time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Fetch AI recommendation on mount or when check-in updates
  useEffect(() => {
    const fetchRec = async () => {
      if (!latestCheckIn) return;
      setIsLoadingRec(true);
      try {
        const res = await fetch('/api/recommendation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mood: latestCheckIn.mood,
            energy: latestCheckIn.energy,
            sleepHours: latestCheckIn.sleepHours,
            activityMinutes: latestCheckIn.activityMinutes,
            habits: habits.filter((h) => h.completed).map((h) => h.title),
            notes: latestCheckIn.notes,
          }),
        });
        const data = await res.json();
        if (data.headline) {
          setRecommendation(data);
        }
      } catch (err) {
        console.warn('Could not fetch recommendation:', err);
      } finally {
        setIsLoadingRec(false);
      }
    };

    fetchRec();
  }, [latestCheckIn?.id]);

  const habitsDone = habits.filter((h) => h.completed).length;
  const habitsTotal = habits.length;

  const score = latestCheckIn ? latestCheckIn.calculatedScore : 78;
  const breakdown = latestCheckIn
    ? latestCheckIn.breakdown
    : { emotional: 82, rest: 71, activity: 76, habits: 84, connection: 77 };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${theme.bannerGradient} text-white p-7 sm:p-8 shadow-xl transition-all duration-300`}>
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${theme.bannerBadgeClass} shadow-xs`}>
              {theme.emoji} UN SDG 3 Good Health & Well-Being
            </span>
            <span className="text-xs text-white/80">
              Preventive & Awareness-Oriented Platform • Atmosphere: {theme.name}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {getGreeting()}, {userName}! {theme.emoji}
          </h1>
          <p className="text-white/90 text-xs sm:text-sm max-w-2xl font-serif-accent italic leading-relaxed">
            “Understand Your Mind. Nurture Your Well-Being.” Take a mindful moment to observe your internal rhythm.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenCheckIn}
              className={`px-5 py-2.5 rounded-xl ${theme.heroButtonClass} font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-102 flex items-center gap-2`}
            >
              <Calendar className="w-4 h-4" />
              Complete Today's Check-In
            </button>

            <button
              onClick={onOpenZenMode}
              className={`px-5 py-2.5 rounded-xl bg-stone-900/90 hover:bg-stone-900 text-stone-100 font-bold text-xs sm:text-sm border transition-all hover:scale-102 flex items-center gap-2 shadow-sm ${
                theme.isDark ? 'border-indigo-700/60' : 'border-white/30'
              }`}
            >
              <span>🌙</span>
              Digital Zen Mode
            </button>

            <button
              onClick={() => onNavigateTab('companion')}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-xs border border-white/20 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-white/90" />
              Reflect with ManasMitra AI
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div
          className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full opacity-30 blur-3xl pointer-events-none"
          style={{ backgroundColor: theme.accentColor }}
        />
      </div>

      {/* Preventive Alert Banner (if subtle trend detected) */}
      {preventiveObservation.hasPattern && (
        <div className="p-4.5 rounded-2xl bg-amber-50 border border-amber-300/80 shadow-xs flex items-start justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-200/70 text-amber-900 shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-900">
                  Preventive Well-Being Observation
                </span>
                <span className="text-[10px] font-semibold bg-amber-200/60 text-amber-950 px-2 py-0.5 rounded-full">
                  Early Signal
                </span>
              </div>
              <p className="text-xs text-amber-950 leading-relaxed">
                {preventiveObservation.summary} {preventiveObservation.preventiveTip}
              </p>
            </div>
          </div>
          <button
            onClick={() => onLaunchActivity('breathing')}
            className="px-3.5 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shrink-0 self-center shadow-xs transition-colors"
          >
            Take 2-Min Reset
          </button>
        </div>
      )}

      {/* 4 Core Well-Being Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Emotional Well-Being */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-semibold flex items-center gap-1.5">
              <span className="text-base">🧠</span> Emotional Well-Being
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-stone-900 capitalize">
            {latestCheckIn?.mood ? `${latestCheckIn.mood} State` : 'Good'}
          </div>
          <p className="text-[11px] text-stone-500">
            Energy: <strong className="capitalize">{latestCheckIn?.energy || 'Balanced'}</strong>
          </p>
        </div>

        {/* 2. Sleep & Rest */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-semibold flex items-center gap-1.5">
              <Moon className="w-4 h-4 text-indigo-500" /> Sleep & Rest
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-stone-900">
            {latestCheckIn?.sleepHours ?? 7.5} hrs
          </div>
          <p className="text-[11px] text-stone-500">
            Quality: <strong className="capitalize">{latestCheckIn?.sleepQuality || 'Good'}</strong>
          </p>
        </div>

        {/* 3. Physical Activity */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-semibold flex items-center gap-1.5">
              <Footprints className="w-4 h-4 text-emerald-600" /> Physical Activity
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-stone-900">
            {latestCheckIn?.activityMinutes ?? 32} min
          </div>
          <p className="text-[11px] text-stone-500">
            Level: <strong className="capitalize">{latestCheckIn?.activityLevel || 'Active'}</strong>
          </p>
        </div>

        {/* 4. Daily Habits */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-semibold flex items-center gap-1.5">
              <span className="text-base">🌱</span> Daily Habits
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-stone-900">
            {habitsDone} / {habitsTotal}
          </div>
          <p className="text-[11px] text-stone-500">
            Completed today ({habitsTotal > 0 ? Math.round((habitsDone / habitsTotal) * 100) : 0}%)
          </p>
        </div>
      </div>

      {/* Main Grid: Well-Being Indicator & AI Personalized Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (1 Col): Visual Well-Being Score Indicator Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-stone-900">Personal Well-Being Indicator</h3>
              <p className="text-[11px] text-stone-400">Holistic balance of 5 SDG pillars</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              SDG 3
            </span>
          </div>

          {/* Central Circular / Gauge representation */}
          <div className="flex flex-col items-center justify-center py-2 text-center">
            <div className="relative w-36 h-36 rounded-full border-8 border-stone-100 flex flex-col items-center justify-center bg-gradient-to-b from-stone-50 to-white shadow-inner">
              <span className="text-4xl font-black text-stone-900 tracking-tight">{score}</span>
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-0.5">
                / 100
              </span>
            </div>
            <span className="text-xs font-semibold text-emerald-700 mt-2">
              Optimal Equilibrium
            </span>
            <span className="text-[10px] text-stone-400 max-w-[200px] mt-0.5">
              *A reflective well-being indicator, not a medical or psychological score.
            </span>
          </div>

          {/* 5 Pillars Breakdown Progress */}
          <div className="space-y-3 pt-2 border-t border-stone-100 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between font-medium">
                <span className="text-stone-700 flex items-center gap-1.5">
                  <span>🧠</span> Emotional Well-Being
                </span>
                <span className="font-bold text-stone-900">{breakdown.emotional}</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${breakdown.emotional}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-medium">
                <span className="text-stone-700 flex items-center gap-1.5">
                  <span>💤</span> Sleep & Rest
                </span>
                <span className="font-bold text-stone-900">{breakdown.rest}</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full"
                  style={{ width: `${breakdown.rest}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-medium">
                <span className="text-stone-700 flex items-center gap-1.5">
                  <span>🚶</span> Physical Activity
                </span>
                <span className="font-bold text-stone-900">{breakdown.activity}</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-teal-500 h-full rounded-full"
                  style={{ width: `${breakdown.activity}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-medium">
                <span className="text-stone-700 flex items-center gap-1.5">
                  <span>🌱</span> Daily Habits
                </span>
                <span className="font-bold text-stone-900">{breakdown.habits}</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${breakdown.habits}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-medium">
                <span className="text-stone-700 flex items-center gap-1.5">
                  <span>🤝</span> Social Connection
                </span>
                <span className="font-bold text-stone-900">{breakdown.connection}</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-500 h-full rounded-full"
                  style={{ width: `${breakdown.connection}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right (2 Cols): Personalized Recommendation & Quick Activities */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personalized Recommendation Card */}
          <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-sm shadow-xs">
                  🌱
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-900">
                    Today's Personalized Recommendation
                  </h3>
                  <span className="text-[10px] text-emerald-800 font-semibold">
                    Synthesizing mood, sleep & movement metrics
                  </span>
                </div>
              </div>

              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                {recommendation.pillar}
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-stone-900 text-base">
                {recommendation.headline}
              </h4>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {recommendation.recommendation}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => onLaunchActivity(recommendation.suggestedActivity)}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all hover:scale-102"
              >
                <span>Practice Recommended Activity</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigateTab('companion')}
                className="text-xs text-stone-500 hover:text-emerald-800 font-semibold"
              >
                Discuss with ManasMitra AI →
              </button>
            </div>
          </div>

          {/* Quick Well-Being Micro-Practices Studio */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-stone-900">Well-Being Practice Studio</h3>
                <p className="text-xs text-stone-500">
                  Quick somatic exercises to reset your nervous system in 2-5 minutes.
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('activities')}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                View all →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                onClick={() => onLaunchActivity('breathing')}
                className="p-3.5 rounded-2xl border border-stone-200 hover:border-emerald-300 bg-stone-50/50 hover:bg-emerald-50/40 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center text-sm mb-2 group-hover:scale-105 transition-transform">
                  <Wind className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-stone-900">Box Breathing</div>
                <div className="text-[11px] text-stone-500 mt-0.5">4-4-4-4 Calm</div>
              </button>

              <button
                onClick={() => onLaunchActivity('reframe')}
                className="p-3.5 rounded-2xl border border-stone-200 hover:border-emerald-300 bg-stone-50/50 hover:bg-emerald-50/40 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center text-sm mb-2 group-hover:scale-105 transition-transform">
                  <Brain className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-stone-900">Thought Reframe</div>
                <div className="text-[11px] text-stone-500 mt-0.5">Untangle Stress</div>
              </button>

              <button
                onClick={() => onLaunchActivity('grounding')}
                className="p-3.5 rounded-2xl border border-stone-200 hover:border-emerald-300 bg-stone-50/50 hover:bg-emerald-50/40 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center text-sm mb-2 group-hover:scale-105 transition-transform">
                  🌿
                </div>
                <div className="font-bold text-xs text-stone-900">5-4-3-2-1 Sensory</div>
                <div className="text-[11px] text-stone-500 mt-0.5">Anxiety Relief</div>
              </button>

              <button
                onClick={() => onLaunchActivity('gratitude')}
                className="p-3.5 rounded-2xl border border-stone-200 hover:border-emerald-300 bg-stone-50/50 hover:bg-emerald-50/40 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-sm mb-2 group-hover:scale-105 transition-transform">
                  ✨
                </div>
                <div className="font-bold text-xs text-stone-900">3-Good-Things</div>
                <div className="text-[11px] text-stone-500 mt-0.5">Positive Focus</div>
              </button>

              <button
                onClick={() => onLaunchActivity('stretch')}
                className="p-3.5 rounded-2xl border border-stone-200 hover:border-emerald-300 bg-stone-50/50 hover:bg-emerald-50/40 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm mb-2 group-hover:scale-105 transition-transform">
                  <Footprints className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-stone-900">Desk Movement</div>
                <div className="text-[11px] text-stone-500 mt-0.5">5-Min Stretch</div>
              </button>

              <button
                onClick={() => onNavigateTab('social')}
                className="p-3.5 rounded-2xl border border-stone-200 hover:border-emerald-300 bg-stone-50/50 hover:bg-emerald-50/40 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center text-sm mb-2 group-hover:scale-105 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-stone-900">Reach Out</div>
                <div className="text-[11px] text-stone-500 mt-0.5">Kind Message</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Creative Stress-Free Zen Sanctuary Card */}
      <div className="rounded-3xl bg-gradient-to-r from-teal-900 via-emerald-900 to-indigo-950 text-white p-6 sm:p-7 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-400 text-emerald-950 shadow-xs">
            ✨ Interactive De-Stress Sanctuary
          </div>
          <h3 className="text-xl font-bold tracking-tight">
            Need an effortless, calming mental reset?
          </h3>
          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
            Visit the <strong>Zen Sanctuary</strong>: tend your living <em>Mind Garden</em>, release heavy worries as <em>Sky Lanterns</em>, resonate with <em>Tibetan Singing Bowls</em>, or take a 3-minute <em>Decompression Cafe</em> break.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigateTab('sanctuary')}
            className="px-5 py-2.5 rounded-xl bg-white text-emerald-950 font-bold text-xs sm:text-sm shadow-md hover:bg-emerald-50 transition-all hover:scale-102 flex items-center gap-2"
          >
            <span>Enter Zen Sanctuary 🏮</span>
            <ArrowRight className="w-4 h-4 text-emerald-700" />
          </button>
        </div>
      </div>

      {/* Featured Kindness Tracker & Collective Impact Card */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-900 via-rose-950 to-stone-900 text-white p-6 sm:p-7 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-400 text-rose-950 shadow-xs">
            ❤️ UN SDG 3 Pro-Social Health
          </div>
          <h3 className="text-xl font-bold tracking-tight">
            Kindness Tracker & Collective Impact
          </h3>
          <p className="text-rose-100 text-xs sm:text-sm leading-relaxed">
            Log daily micro-acts of kindness—sending an encouraging word, listening without judgment, or helping a peer. Watch your contribution swell our <strong>14,890+ Collective Kindness Impact</strong> counter!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigateTab('kindness')}
            className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-102 flex items-center gap-2"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>Open Kindness Tracker</span>
          </button>
        </div>
      </div>

      {/* The Central Innovation: ManasMitra Personal Well-Being Loop Visualizer */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌱</span>
            <div>
              <h3 className="font-bold text-sm text-stone-900">
                The ManasMitra Preventive Well-Being Loop
              </h3>
              <p className="text-xs text-stone-500">
                From self-awareness to gentle action, building lifelong psychological immunity.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            SDG 3 Continuous Cycle
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2">
          {[
            { step: '1. Check In', desc: 'Notice your state', icon: '📝' },
            { step: '2. Understand', desc: 'Identify patterns', icon: '🧠' },
            { step: '3. Reflect', desc: 'Safe expression', icon: '💭' },
            { step: '4. AI Recommends', desc: 'Contextual tips', icon: '🌱' },
            { step: '5. Micro-Action', desc: 'Breathing / habit', icon: '🧘' },
            { step: '6. Track Progress', desc: 'Measure shifts', icon: '📈' },
            { step: '7. Awareness', desc: 'Preventive shield', icon: '🛡️' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-1 hover:border-emerald-300 transition-colors"
            >
              <span className="text-lg block">{item.icon}</span>
              <div className="font-bold text-xs text-stone-900">{item.step}</div>
              <div className="text-[10px] text-stone-500">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
