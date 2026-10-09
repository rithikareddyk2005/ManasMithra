import React, { useState, useEffect } from 'react';
import {
  Heart,
  Users,
  Sparkles,
  Plus,
  Send,
  Award,
  Globe2,
  Share2,
  CheckCircle2,
  Smile,
  ShieldCheck,
  Flame,
  MessageCircle,
  Coffee,
  Leaf,
  HandHeart,
  RotateCcw,
} from 'lucide-react';
import { KindnessAct } from '../types';
import { soundEngine } from '../utils/audio';
import { triggerCelebration } from '../utils/storage';

const INITIAL_ACTS: KindnessAct[] = [
  {
    id: 'k-1',
    title: 'Sent an encouraging note to a stressed classmate',
    category: 'emotional',
    recipient: 'Classmate',
    notes: 'Reminded them that one test does not define their worth.',
    timestamp: Date.now() - 86400000,
    dateStr: 'Yesterday',
  },
  {
    id: 'k-2',
    title: 'Brewed morning tea for my roommate',
    category: 'practical',
    recipient: 'Roommate',
    notes: 'Surprised them before their early morning lecture.',
    timestamp: Date.now() - 2 * 86400000,
    dateStr: '2 days ago',
  },
  {
    id: 'k-3',
    title: 'Picked up litter along the campus garden path',
    category: 'community',
    recipient: 'Community & Earth',
    notes: 'Cared for our shared green space.',
    timestamp: Date.now() - 3 * 86400000,
    dateStr: '3 days ago',
  },
];

const COMMUNITY_RIPPLES = [
  { user: 'Maya K.', act: 'Brought homemade soup to a neighbor recovering from illness.', time: '12m ago', tag: 'Care' },
  { user: 'Arjun S.', act: 'Tutored a junior peer in calculus for an hour with infinite patience.', time: '28m ago', tag: 'Mentorship' },
  { user: 'Sarah L.', act: 'Left a sticky note with an uplifting quote on a library desk.', time: '45m ago', tag: 'Surprise' },
  { user: 'David W.', act: 'Gave up their subway seat to an elderly traveler with a warm smile.', time: '1h ago', tag: 'Courtesy' },
  { user: 'Priya N.', act: 'Watered dry plants outside the community center.', time: '2h ago', tag: 'Eco Care' },
  { user: 'Kenji T.', act: 'Texted their parents just to say thank you for everything.', time: '3h ago', tag: 'Gratitude' },
];

export const KindnessTracker: React.FC = () => {
  const [acts, setActs] = useState<KindnessAct[]>(() => {
    const saved = localStorage.getItem('manasmitra_kindness_acts');
    return saved ? JSON.parse(saved) : INITIAL_ACTS;
  });

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'emotional' | 'practical' | 'community' | 'gratitude' | 'quiet'>('emotional');
  const [recipient, setRecipient] = useState('Friend / Peer');
  const [notes, setNotes] = useState('');
  const [activeChallengeIndex, setActiveChallengeIndex] = useState(0);

  const challenges = [
    'Send an unscheduled 1-sentence message of genuine appreciation to a mentor or friend.',
    'Hold the elevator or door open for someone and offer an authentic, warm smile.',
    'Write a sincere positive review for a small local business or quiet content creator.',
    'Notice someone working hard (custodian, barista, teammate) and verbally thank them.',
    'Pick up three pieces of plastic or litter from a park or hallway and discard them.',
    'Compliment someone today on a character trait (patience, courage, listening skill) rather than physical appearance.',
  ];

  const handleRollChallenge = () => {
    soundEngine.playChime('medium');
    setActiveChallengeIndex((prev) => (prev + 1) % challenges.length);
  };

  const handleLogAct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    soundEngine.playChime('high');
    triggerCelebration();

    const newAct: KindnessAct = {
      id: `act-${Date.now()}`,
      title: title.trim(),
      category,
      recipient,
      notes: notes.trim() || undefined,
      timestamp: Date.now(),
      dateStr: 'Just now',
    };

    const updated = [newAct, ...acts];
    setActs(updated);
    localStorage.setItem('manasmitra_kindness_acts', JSON.stringify(updated));

    setTitle('');
    setNotes('');
  };

  const totalActs = acts.length;
  // Collective community simulation: baseline 14,892 + user's local acts
  const collectiveCount = 14892 + totalActs;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-teal-900 to-emerald-950 text-white p-7 rounded-3xl shadow-xl space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-400 text-rose-950 shadow-xs">
            <Heart className="w-3.5 h-3.5 fill-rose-950" /> UN SDG 3 Social Well-Being
          </span>
          <span className="text-xs text-rose-200">
            Target 3.4 & 3.d: Pro-Social Neurobiology & Mental Health
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Daily Kindness Tracker & Collective Impact
          </h1>
          <p className="text-rose-100 text-xs sm:text-sm max-w-2xl mt-1 leading-relaxed">
            Acts of kindness are not merely social pleasantries—they stimulate <strong>oxytocin, dopamine, and vagal tone</strong>, lowering systemic inflammation and protecting both giver and receiver from psychological isolation.
          </p>
        </div>

        {/* Collective Impact Counter Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-rose-800/60">
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 text-center">
            <span className="text-2xl sm:text-3xl font-black text-white block">
              {collectiveCount.toLocaleString()}
            </span>
            <span className="text-[11px] text-rose-200 font-medium">Collective Acts Shared</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 text-center">
            <span className="text-2xl sm:text-3xl font-black text-rose-300 block">
              {totalActs}
            </span>
            <span className="text-[11px] text-rose-200 font-medium">Your Personal Acts</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 text-center">
            <span className="text-2xl sm:text-3xl font-black text-emerald-300 block">
              98.4%
            </span>
            <span className="text-[11px] text-rose-200 font-medium">Community Uplift Rate</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 text-center">
            <span className="text-2xl sm:text-3xl font-black text-amber-300 block">
              {totalActs * 3}d
            </span>
            <span className="text-[11px] text-rose-200 font-medium">Kindness Ripple Streak</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Log Act Form & Daily Challenge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 Cols): Log an Act of Kindness Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center text-lg">
                <HandHeart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-900">Log a Micro-Act of Kindness</h3>
                <p className="text-xs text-stone-500">Every small gesture creates neurological ripples of safety.</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
              Pro-Social Health
            </span>
          </div>

          <form onSubmit={handleLogAct} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5">
                What kind act did you perform or express today?
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Listened attentively to a coworker, sent an encouraging text, helped carry groceries..."
                className="w-full text-xs sm:text-sm p-3.5 rounded-2xl border border-stone-200 focus:outline-rose-600 bg-stone-50/50"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5">
                  Kindness Dimension
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:outline-rose-600 bg-white"
                >
                  <option value="emotional">❤️ Emotional Support (Listening, Encouragement)</option>
                  <option value="practical">🤝 Practical Help (Assistance, Sharing)</option>
                  <option value="community">🌿 Community & Earth Care (Litter, Plants, Spaces)</option>
                  <option value="gratitude">✨ Warm Appreciation (Direct Thank You)</option>
                  <option value="quiet">🤫 Quiet Secret Kindness (Unnoticed Goodness)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5">
                  Recipient
                </label>
                <select
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:outline-rose-600 bg-white"
                >
                  <option value="Friend / Peer">Friend or Peer</option>
                  <option value="Family Member">Family Member</option>
                  <option value="Colleague / Classmate">Colleague or Classmate</option>
                  <option value="Stranger / Public">Stranger in Public</option>
                  <option value="Community & Earth">Community & Earth</option>
                  <option value="Self (Self-Compassion)">Self (Self-Compassion)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5">
                How did it make you feel? (Optional reflection)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Noticing your own feelings of warmth reinforces pro-social habit loops in your brain."
                className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:outline-rose-600 bg-stone-50/50 min-h-[65px]"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={!title.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all hover:scale-102 flex items-center gap-2"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Log Kindness Act & Add to Collective Impact</span>
              </button>
            </div>
          </form>

          {/* User's Kindness Log */}
          <div className="pt-4 border-t border-stone-100 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-stone-900 uppercase tracking-wider">
                Your Recent Kindness Journal ({acts.length} acts)
              </h4>
              <span className="text-[11px] text-stone-400">Personal History</span>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto">
              {acts.map((act) => (
                <div
                  key={act.id}
                  className="p-3.5 rounded-2xl bg-stone-50/70 border border-stone-200 hover:border-rose-300 transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      <span>{act.title}</span>
                    </span>
                    <span className="text-[10px] text-stone-400">{act.dateStr}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-stone-500">
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-semibold capitalize">
                      {act.category}
                    </span>
                    <span>To: <strong>{act.recipient}</strong></span>
                  </div>

                  {act.notes && (
                    <p className="text-xs text-stone-600 italic font-serif-accent bg-white p-2 rounded-xl border border-stone-100">
                      “{act.notes}”
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right (1 Col): Daily Kindness Challenge & Collective Live Feed */}
        <div className="space-y-6">
          {/* Daily Kindness Micro-Challenge Card */}
          <div className="bg-gradient-to-br from-amber-50 to-rose-50 rounded-3xl border border-rose-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">✨</span>
                <h3 className="font-bold text-sm text-stone-900">Today's Kindness Challenge</h3>
              </div>
              <button
                onClick={handleRollChallenge}
                title="Roll another challenge"
                className="p-1.5 rounded-xl border border-rose-200 bg-white hover:bg-rose-100 text-rose-800 transition-colors text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <blockquote className="p-4 rounded-2xl bg-white/90 border border-rose-200 text-xs sm:text-sm text-stone-800 font-serif-accent italic leading-relaxed">
              “{challenges[activeChallengeIndex]}”
            </blockquote>

            <button
              onClick={() => setTitle(challenges[activeChallengeIndex])}
              className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all"
            >
              Accept Challenge & Pre-fill Form
            </button>
          </div>

          {/* Collective Community Ripple Feed */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                  <Globe2 className="w-4 h-4 text-emerald-600" />
                  <span>Global Kindness Ripples</span>
                </h3>
                <p className="text-[11px] text-stone-500">Live collective well-being stream</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-3">
              {COMMUNITY_RIPPLES.map((rip, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-stone-800">{rip.user}</span>
                    <span className="text-[10px] text-stone-400">{rip.time}</span>
                  </div>
                  <p className="text-stone-600 text-xs">{rip.act}</p>
                  <span className="inline-block text-[9px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded-full">
                    {rip.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
