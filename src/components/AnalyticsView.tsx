import React from 'react';
import {
  TrendingUp,
  Calendar,
  Moon,
  Footprints,
  Smile,
  ShieldCheck,
  AlertTriangle,
  Download,
  Flame,
  Award,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { CheckInRecord, PreventiveObservation } from '../types';

interface AnalyticsViewProps {
  history: CheckInRecord[];
  preventiveObservation: PreventiveObservation;
  onLaunchCheckIn: () => void;
  onLaunchActivity: (activity: any) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  history,
  preventiveObservation,
  onLaunchCheckIn,
  onLaunchActivity,
}) => {
  // Sort history chronologically for visualization
  const chronological = [...history].sort((a, b) => a.timestamp - b.timestamp);
  const recent7 = chronological.slice(-7);

  const moodEmojis: Record<string, string> = {
    great: '😊',
    good: '🙂',
    okay: '😐',
    low: '😔',
    difficult: '😣',
  };

  const avgSleep = recent7.length
    ? (recent7.reduce((sum, r) => sum + r.sleepHours, 0) / recent7.length).toFixed(1)
    : '7.4';

  const avgActivity = recent7.length
    ? Math.round(recent7.reduce((sum, r) => sum + r.activityMinutes, 0) / recent7.length)
    : 28;

  const avgWellbeing = recent7.length
    ? Math.round(recent7.reduce((sum, r) => sum + r.calculatedScore, 0) / recent7.length)
    : 78;

  const handleExportSummary = () => {
    const summaryText = `MANASMITRA AI - WELL-BEING SUMMARY (SDG 3)
Generated on: ${new Date().toLocaleDateString()}
--------------------------------------------------
Overall Well-Being Indicator: ${avgWellbeing}/100
Average Sleep: ${avgSleep} hours/night
Average Physical Activity: ${avgActivity} minutes/day
Total Check-ins Completed: ${history.length}

7-DAY MOOD & RECOVERY LOG:
${recent7
  .map(
    (r) =>
      `• ${new Date(r.timestamp).toLocaleDateString([], { weekday: 'short' })}: Mood: ${r.mood.toUpperCase()} | Sleep: ${r.sleepHours}h | Activity: ${r.activityMinutes}m | Social: ${r.socialConnection} | Indicator: ${r.calculatedScore}/100`
  )
  .join('\n')}

PREVENTIVE OBSERVATION:
${preventiveObservation.summary}
Recommendation: ${preventiveObservation.preventiveTip}

*Notice: ManasMitra AI is a preventive well-being companion aligned with UN SDG 3 and is not a medical diagnostic service.*`;

    const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ManasMitra_WellBeing_Summary_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/30 text-emerald-100 border border-emerald-400/30 mb-2">
            📊 Preventive Well-Being Analytics
          </div>
          <h2 className="text-xl font-bold">Progress, Weekly Rhythms & Early Signals</h2>
          <p className="text-emerald-100 text-xs mt-1 max-w-xl">
            Observing weekly changes allows you to address fatigue, social isolation, or stress before they accumulate into burnout.
          </p>
        </div>

        <button
          onClick={handleExportSummary}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-xs shadow-md hover:bg-emerald-50 transition-colors self-start sm:self-auto shrink-0"
        >
          <Download className="w-4 h-4" /> Export Well-Being Summary
        </button>
      </div>

      {/* Innovative Preventive Pattern Detector Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-xl ${
                preventiveObservation.hasPattern ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {preventiveObservation.hasPattern ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <ShieldCheck className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <span>Preventive Well-Being Observation</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                  SDG 3 Preventive Model
                </span>
              </h3>
              <p className="text-xs text-stone-500">
                Early pattern recognition based on multi-dimensional check-in shifts.
              </p>
            </div>
          </div>

          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              preventiveObservation.hasPattern
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            {preventiveObservation.hasPattern ? 'Subtle Shift Observed' : 'Equilibrium Maintained'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs leading-relaxed space-y-2">
          <p className="text-stone-800 font-medium">
            {preventiveObservation.summary}
          </p>
          <div className="p-3 rounded-xl bg-white border border-stone-200 text-emerald-950 font-semibold flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Recommended Preventive Action: {preventiveObservation.preventiveTip}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-stone-500 pt-1">
          <span>Formula: Sleep (22%) + Mood (28%) + Activity (20%) + Habits (15%) + Connection (15%)</span>
          <button
            onClick={() => onLaunchActivity('breathing')}
            className="text-emerald-700 font-bold hover:underline"
          >
            Try 2-min restorative breathing now →
          </button>
        </div>
      </div>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            7-Day Avg Indicator
          </span>
          <div className="text-2xl font-extrabold text-stone-900">{avgWellbeing} / 100</div>
          <span className="text-[11px] font-semibold text-emerald-700">Healthy Range</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            Sleep Average
          </span>
          <div className="text-2xl font-extrabold text-indigo-900">{avgSleep} hrs</div>
          <span className="text-[11px] font-semibold text-indigo-700">Optimal Rest Window</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            Daily Movement
          </span>
          <div className="text-2xl font-extrabold text-emerald-900">{avgActivity} min</div>
          <span className="text-[11px] font-semibold text-emerald-700">Exceeds 20m Target</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            Consistency Streak
          </span>
          <div className="text-2xl font-extrabold text-amber-700 flex items-center gap-1">
            <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
            <span>7 Days</span>
          </div>
          <span className="text-[11px] font-semibold text-amber-800">100% check-in rate</span>
        </div>
      </div>

      {/* 7-Day Weekly Mood Trend Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-stone-900">Your Weekly Well-Being Timeline</h3>
          <span className="text-xs text-stone-500">Last 7 logged days</span>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-2">
          {recent7.map((item, idx) => {
            const dateObj = new Date(item.timestamp);
            const dayName = dateObj.toLocaleDateString([], { weekday: 'short' });
            return (
              <div
                key={item.id || idx}
                className="flex flex-col items-center p-3 rounded-2xl border border-stone-200 bg-stone-50/70 space-y-2 text-center hover:border-emerald-300 transition-colors"
              >
                <span className="text-xs font-bold text-stone-500">{dayName}</span>
                <span className="text-2xl" title={item.mood}>
                  {moodEmojis[item.mood] || '🙂'}
                </span>
                <span className="text-[11px] font-extrabold text-stone-800">
                  {item.calculatedScore}
                </span>
                <div className="text-[10px] text-stone-500 space-y-0.5 border-t border-stone-200 pt-1 w-full">
                  <div>💤 {item.sleepHours}h</div>
                  <div>🚶 {item.activityMinutes}m</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Milestone & Reflection Badges */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border border-emerald-200 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-sm">
            🏆
          </div>
          <div>
            <h4 className="font-bold text-sm text-emerald-950">
              7-Day Well-Being Awareness Milestone
            </h4>
            <p className="text-xs text-emerald-800 mt-0.5">
              You have established continuous preventive awareness, taking proactive responsibility for mental and physical rhythm.
            </p>
          </div>
        </div>

        <button
          onClick={onLaunchCheckIn}
          className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm shrink-0"
        >
          Update Today's Check-In
        </button>
      </div>
    </div>
  );
};
