import React, { useState } from 'react';
import {
  Brain,
  ShieldCheck,
  Search,
  Sparkles,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  ArrowRight,
  Heart,
  Wind,
  Phone,
  BookOpen,
} from 'lucide-react';
import { MENTAL_PROBLEMS_SOLUTIONS, MentalProblemSolution } from '../data/mentalHealthSolutions';
import { soundEngine } from '../utils/audio';

interface MentalSolutionsHubProps {
  onLaunchBreathing: () => void;
  onLaunchReframe: () => void;
  onOpenCrisisModal: () => void;
}

export const MentalSolutionsHub: React.FC<MentalSolutionsHubProps> = ({
  onLaunchBreathing,
  onLaunchReframe,
  onOpenCrisisModal,
}) => {
  const [selectedSolution, setSelectedSolution] = useState<MentalProblemSolution>(
    MENTAL_PROBLEMS_SOLUTIONS[0]
  );
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'sos' | 'cognitive' | 'lifestyle'>('sos');

  const filtered = MENTAL_PROBLEMS_SOLUTIONS.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.tagline.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (item: MentalProblemSolution) => {
    setSelectedSolution(item);
    soundEngine.playChime('medium');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-teal-900 to-emerald-950 text-white p-7 rounded-3xl shadow-xl space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-400 text-emerald-950 shadow-xs">
            🧠 Real-World Mental Health Clinical Solutions
          </span>
          <span className="text-xs text-emerald-200">
            Evidence-informed protocols for real psychological dilemmas
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Mental Health First-Aid & Solutions Studio
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm max-w-2xl mt-1 leading-relaxed">
            Practical, actionable neuro-cognitive interventions to resolve acute panic, academic paralysis, depressive inertia, nighttime rumination, digital envy, and emotional burnout.
          </p>
        </div>
      </div>

      {/* Main Grid: Problem Selector & Detailed Solution Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (1 Col): Problem Selector List */}
        <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-sm space-y-3.5">
          <div>
            <h3 className="font-bold text-sm text-stone-900">Real Mental Dilemmas</h3>
            <p className="text-[11px] text-stone-500">Select what you are facing right now</p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter dilemmas (panic, burnout, sleep)..."
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:outline-emerald-600"
            />
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filtered.map((item) => {
              const isSelected = selectedSolution.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-2 ring-emerald-500/20'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/40 text-stone-700'
                  }`}
                >
                  <span className="text-2xl shrink-0 mt-0.5">{item.emoji}</span>
                  <div className="space-y-0.5">
                    <div className="font-bold text-xs text-stone-900 line-clamp-1">{item.title}</div>
                    <div className="text-[10px] text-stone-500 line-clamp-1">{item.category}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right (2 Cols): Clinical Solution Studio */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-sm space-y-6">
          {/* Header */}
          <div className="space-y-2 border-b border-stone-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{selectedSolution.emoji}</span>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  {selectedSolution.category}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-stone-900 mt-1">
                  {selectedSolution.title}
                </h2>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed font-medium">
              {selectedSolution.tagline}
            </p>
          </div>

          {/* Neurobiology Explanation Card */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/90 text-xs text-stone-700 space-y-1.5 leading-relaxed">
            <span className="font-bold text-stone-900 flex items-center gap-1.5 text-xs">
              <Brain className="w-4 h-4 text-emerald-700" /> What Is Happening in Your Brain:
            </span>
            <p>{selectedSolution.neuroscience}</p>
          </div>

          {/* Solution Tabs */}
          <div className="flex border-b border-stone-200 gap-4 text-xs font-semibold">
            {[
              { id: 'sos', label: '⚡ 90-Second SOS Protocol' },
              { id: 'cognitive', label: '🧠 Cognitive Restructuring' },
              { id: 'lifestyle', label: '🌱 Long-Term Habit Shield' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-2 border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-emerald-600 text-emerald-900 font-bold'
                    : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: SOS Protocol */}
          {activeTab === 'sos' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-stone-900">
                  {selectedSolution.sosProtocol.name}
                </h4>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  ⏱️ {selectedSolution.sosProtocol.duration}
                </span>
              </div>

              <div className="space-y-2.5">
                {selectedSolution.sosProtocol.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-stone-50/70 border border-stone-200 text-xs text-stone-800 flex items-start gap-3 leading-relaxed"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              {/* Action shortcuts */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={onLaunchBreathing}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
                >
                  <Wind className="w-3.5 h-3.5" /> Launch Calming Box Breath
                </button>

                <button
                  onClick={onOpenCrisisModal}
                  className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" /> Need immediate human support? 24/7 Helplines
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Cognitive Restructuring */}
          {activeTab === 'cognitive' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-800">
                  Toxic Distortion / Automatic Negative Thought:
                </span>
                <p className="text-xs text-rose-950 font-medium italic">
                  {selectedSolution.cognitiveRestructuring.toxicBelief}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                  Evidence-Based Clinical Reframe:
                </span>
                <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                  {selectedSolution.cognitiveRestructuring.clinicalReframe}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-amber-900">The Reality-Test Question: </strong>
                  {selectedSolution.cognitiveRestructuring.evidenceQuestion}
                </div>
              </div>

              <button
                onClick={onLaunchReframe}
                className="w-full py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs transition-colors"
              >
                Practice in Cognitive Reframe Studio →
              </button>
            </div>
          )}

          {/* Tab 3: Lifestyle Prescription & Red Flags */}
          {activeTab === 'lifestyle' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="space-y-2">
                <h4 className="font-bold text-xs text-stone-900 uppercase tracking-wider">
                  Preventive Lifestyle Prescription:
                </h4>
                {selectedSolution.lifestylePrescription.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-100">
                <h4 className="font-bold text-xs text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  When to Seek Professional Consultation (Red Flags):
                </h4>
                {selectedSolution.clinicalRedFlags.map((flag, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200 text-xs text-rose-950 flex items-start gap-2"
                  >
                    <span className="font-bold text-rose-600">•</span>
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
