import React, { useState } from 'react';
import {
  Globe2,
  Heart,
  Target,
  Sparkles,
  Copy,
  Check,
  CheckCircle2,
  Award,
  Layers,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

export const SdgImpactView: React.FC = () => {
  const [copiedPoster, setCopiedPoster] = useState(false);

  const posterStatement =
    'ManasMitra AI is an intelligent personal well-being companion that promotes mental, emotional, physical, and social well-being through AI-guided reflection, healthy habit building, mood awareness, personalized activities, and preventive support, contributing to SDG 3: Good Health and Well-Being.';

  const handleCopyPoster = () => {
    navigator.clipboard.writeText(posterStatement);
    soundEngine.playChime('high');
    setCopiedPoster(true);
    setTimeout(() => setCopiedPoster(false), 3000);
  };

  const mappingData = [
    { feature: 'Mood Tracking & Energy Log', contribution: 'Promotes emotional self-awareness and reduces stigma around mood variations.' },
    { feature: 'AI Companion (ManasMitra)', contribution: 'Provides accessible, non-stigmatizing, empathetic reflection and actionable micro-steps.' },
    { feature: 'Daily Well-Being Check-In', contribution: 'Builds preventive self-monitoring across sleep, activity, hydration, and social ties.' },
    { feature: 'Habit & Lifestyle Tracker', contribution: 'Encourages sustainable lifestyle routines (sleep schedule, hydration, movement).' },
    { feature: 'Sleep Architecture Tracking', contribution: 'Fosters sleep hygiene literacy and circadian alignment to protect mental stamina.' },
    { feature: 'Movement & Physical Activity', contribution: 'Counters sedentary stress and stimulates neuroprotective factors (BDNF).' },
    { feature: 'Well-Being Practice Studio', contribution: 'Provides on-demand evidence-based somatic calming (Box Breathing, 5-4-3-2-1, Reframe).' },
    { feature: 'Social Well-Being Hub', contribution: 'Nurtures meaningful relational health and reduces psychological isolation.' },
    { feature: 'Educational Wellness Hub', contribution: 'Strengthens preventive mental health literacy and psychoeducational self-efficacy.' },
    { feature: 'Safety Resources & Directory', contribution: 'Provides clear escalation pathways and free 24/7 crisis hotlines worldwide.' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hero SDG 3 Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 text-white p-7 rounded-3xl shadow-xl space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-400 text-emerald-950">
            UNITED NATIONS SDG 3
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-emerald-100 border border-white/20">
            Target 3.4: Mental Health & Well-Being
          </span>
          <span className="ml-auto text-xs text-emerald-200">
            Prototype Presentation Suite
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            ManasMitra AI: Good Health & Well-Being
          </h1>
          <p className="text-emerald-100 text-sm max-w-3xl leading-relaxed">
            Aligned with the UN 2030 Agenda for Sustainable Development, ManasMitra transforms mental wellness from a reactive crisis-intervention model into a daily, preventive, accessible, and supportive lifestyle habit.
          </p>
        </div>

        {/* 5 Pillars Quick Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-emerald-700/50">
          {[
            { icon: '🧠', name: 'Mental Awareness' },
            { icon: '❤️', name: 'Emotional Well-Being' },
            { icon: '🌱', name: 'Healthy Habits' },
            { icon: '🤝', name: 'Social Well-Being' },
            { icon: '🛡️', name: 'Preventive Support' },
          ].map((pil, idx) => (
            <div key={idx} className="bg-white/10 p-2.5 rounded-xl text-center backdrop-blur-xs">
              <span className="text-lg block mb-0.5">{pil.icon}</span>
              <span className="text-[11px] font-bold text-emerald-100">{pil.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* College / Exhibition Poster Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900">Official Project Poster Synopsis</h3>
              <p className="text-xs text-stone-500">
                Ready for project abstracts, competition pitches, and exhibition posters.
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyPoster}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors"
          >
            {copiedPoster ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" /> Copied Synopsis!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy One-Liner
              </>
            )}
          </button>
        </div>

        <blockquote className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-800 italic leading-relaxed">
          “{posterStatement}”
        </blockquote>
      </div>

      {/* Impact Numbers Grid (Sample/Demo prototype metrics) */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-stone-900">Prototype Health Impact Dashboard</h3>
          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            Interactive Sample Simulation Data
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-1">
            <span className="text-3xl font-extrabold text-emerald-700">1,248</span>
            <div className="text-xs font-bold text-stone-800">Check-ins Completed</div>
            <p className="text-[10px] text-stone-500">Preventive emotional tracking</p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-1">
            <span className="text-3xl font-extrabold text-teal-700">842</span>
            <div className="text-xs font-bold text-stone-800">Activities Completed</div>
            <p className="text-[10px] text-stone-500">Box breathing & cognitive reframes</p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-1">
            <span className="text-3xl font-extrabold text-indigo-700">93%</span>
            <div className="text-xs font-bold text-stone-800">Habit Adherence Rate</div>
            <p className="text-[10px] text-stone-500">Hydration, rest, and active breaks</p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-1">
            <span className="text-3xl font-extrabold text-rose-700">76%</span>
            <div className="text-xs font-bold text-stone-800">Self-Reflections Saved</div>
            <p className="text-[10px] text-stone-500">Gratitude and cognitive balance</p>
          </div>
        </div>
      </div>

      {/* SDG 3 Target 3.4 Feature Mapping Table */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-base text-stone-900">
            Systematic SDG 3 Mapping Architecture
          </h3>
          <p className="text-xs text-stone-500">
            Detailed alignment matrix connecting prototype components directly to United Nations Sustainable Development Goal 3 outcomes.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-stone-700 font-bold">
                <th className="py-3 px-4 rounded-l-xl">ManasMitra Feature</th>
                <th className="py-3 px-4 rounded-r-xl">Direct SDG 3 Contribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {mappingData.map((row, idx) => (
                <tr key={idx} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-stone-900 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{row.feature}</span>
                  </td>
                  <td className="py-3 px-4 text-stone-600">{row.contribution}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* The Preventive Well-Being Loop Diagram */}
      <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-3xl p-6 shadow-md space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-stone-900">
            ↺
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">
              The ManasMitra Personal Well-Being Loop
            </h3>
            <p className="text-xs text-stone-400">
              The central design innovation that makes ManasMitra an ecosystem rather than a basic chatbot.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2">
          {[
            { step: '1', title: 'Check In', desc: 'Log mood & rest' },
            { step: '2', title: 'Understand', desc: 'View indicators' },
            { step: '3', title: 'Reflect', desc: 'Notice thoughts' },
            { step: '4', title: 'AI Analyzes', desc: 'Identify context' },
            { step: '5', title: 'Recommend', desc: 'Micro-actions' },
            { step: '6', title: 'Take Action', desc: 'Breathing / habits' },
            { step: '7', title: 'Track It', desc: 'Measure changes' },
            { step: '8', title: 'Better Aware', desc: 'Preventive shield' },
          ].map((loop, i) => (
            <div key={i} className="p-3 rounded-2xl bg-stone-800/80 border border-stone-700 text-center space-y-1">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center justify-center mx-auto">
                {loop.step}
              </span>
              <div className="text-xs font-bold text-stone-100">{loop.title}</div>
              <div className="text-[10px] text-stone-400">{loop.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
