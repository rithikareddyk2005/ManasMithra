import React, { useState } from 'react';
import {
  Users,
  Heart,
  MessageCircle,
  Copy,
  Check,
  Send,
  Sparkles,
  ShieldAlert,
  ThumbsUp,
  BookmarkCheck,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { triggerCelebration } from '../utils/storage';

export const SocialHub: React.FC = () => {
  const [supportedBy, setSupportedBy] = useState('');
  const [reachOutTo, setReachOutTo] = useState('');
  const [reflectionNote, setReflectionNote] = useState('');
  const [savedNotes, setSavedNotes] = useState<
    Array<{ id: string; supportedBy: string; reachOutTo: string; note: string; date: string }>
  >([
    {
      id: 'soc-1',
      supportedBy: 'My project teammate Aisha',
      reachOutTo: 'My childhood friend Vikram',
      note: 'Aisha shared practical notes when I felt overwhelmed. Reminded me that asking for help is a sign of mutual trust.',
      date: 'Yesterday',
    },
  ]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const messageTemplates = [
    {
      title: 'Warm Gratitude & Appreciation',
      recipient: 'Friend or Colleague',
      text: 'Hey! Just wanted to take a quick moment to say thank you for being in my corner. Your support really meant a lot to me today. Hope you have a wonderful and peaceful evening! 🌿',
    },
    {
      title: 'Gentle Casual Check-In',
      recipient: 'Friend you haven’t spoken to in a while',
      text: 'Hi friend! You crossed my mind today and I wanted to check in. No pressure to reply immediately, just hoping life is treating you gently and wishing you good energy! ✨',
    },
    {
      title: 'Low-Pressure Tea / Coffee Invite',
      recipient: 'Study or Work Peer',
      text: 'Hey! Would you like to take a 15-minute screen break sometime this week to grab a cup of tea or walk? Would love to catch up.',
    },
    {
      title: 'Honest Boundary with Care',
      recipient: 'Anyone needing space',
      text: 'Thank you for reaching out! My bandwidth is quite stretched today, so I’m taking a quiet evening to recharge. Let’s catch up properly this weekend when I can be fully present. ❤️',
    },
  ];

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    soundEngine.playChime('medium');
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportedBy.trim() && !reachOutTo.trim() && !reflectionNote.trim()) return;

    soundEngine.playChime('high');
    triggerCelebration();

    const newEntry = {
      id: `soc-${Date.now()}`,
      supportedBy: supportedBy.trim() || 'A supportive contact',
      reachOutTo: reachOutTo.trim() || 'Someone special',
      note: reflectionNote.trim(),
      date: 'Just now',
    };

    setSavedNotes([newEntry, ...savedNotes]);
    setSupportedBy('');
    setReachOutTo('');
    setReflectionNote('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-teal-900 text-white p-6 rounded-3xl shadow-lg">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/30 text-emerald-100 border border-emerald-400/30 mb-2">
          🤝 SDG 3.4 Relational & Social Well-Being
        </div>
        <h2 className="text-xl font-bold">Social Connection & Micro-Relational Health</h2>
        <p className="text-emerald-100 text-xs mt-1 max-w-2xl">
          Health is not an isolated individual metric. Healthy social bonds lower cortisol, bolster immune function, and create the psychological safety needed to flourish.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Social Reflection Card */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900">Daily Connection Reflection</h3>
              <p className="text-xs text-stone-500">Notice the people who surround your day.</p>
            </div>
          </div>

          <form onSubmit={handleSaveReflection} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Who made you feel supported or heard today?
              </label>
              <input
                type="text"
                value={supportedBy}
                onChange={(e) => setSupportedBy(e.target.value)}
                placeholder="e.g. My sibling, project advisor, friendly neighbor..."
                className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:outline-emerald-600 bg-stone-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Is there someone you would like to reach out to?
              </label>
              <input
                type="text"
                value={reachOutTo}
                onChange={(e) => setReachOutTo(e.target.value)}
                placeholder="e.g. An old classmate, parent, mentor..."
                className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:outline-emerald-600 bg-stone-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                A reflection or kind thought about your relationships:
              </label>
              <textarea
                value={reflectionNote}
                onChange={(e) => setReflectionNote(e.target.value)}
                placeholder="What did you learn from an interaction today? What boundaries protected your peace?"
                className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:outline-emerald-600 bg-stone-50/50 min-h-[70px]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all hover:scale-101 flex items-center justify-center gap-2"
            >
              <BookmarkCheck className="w-4 h-4" /> Save Connection Reflection
            </button>
          </form>

          {/* Saved History */}
          {savedNotes.length > 0 && (
            <div className="pt-3 border-t border-stone-100 space-y-2.5">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                Recent Social Reflections:
              </span>
              {savedNotes.map((entry) => (
                <div key={entry.id} className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                  <div className="flex items-center justify-between font-semibold text-stone-800">
                    <span>Supported by: <strong className="text-emerald-700">{entry.supportedBy}</strong></span>
                    <span className="text-[10px] text-stone-400">{entry.date}</span>
                  </div>
                  {entry.reachOutTo && (
                    <div className="text-stone-600 text-[11px]">
                      Intending to contact: <strong>{entry.reachOutTo}</strong>
                    </div>
                  )}
                  {entry.note && <p className="text-stone-700 text-xs italic">“{entry.note}”</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Thoughtful Outreach Templates */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-700">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900">Pre-Written Connection Starters</h3>
              <p className="text-xs text-stone-500">
                1-click copyable messages to foster genuine bonds with zero friction.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {messageTemplates.map((tmpl, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl border border-stone-200 hover:border-emerald-300 transition-colors bg-stone-50/50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800">{tmpl.title}</span>
                  <span className="text-[10px] bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full font-medium">
                    {tmpl.recipient}
                  </span>
                </div>

                <p className="text-xs text-stone-600 bg-white p-2.5 rounded-xl border border-stone-100 font-mono text-[11px] leading-relaxed">
                  {tmpl.text}
                </p>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleCopy(tmpl.text, idx)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors border border-emerald-200/60"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied to Clipboard!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-stone-500" /> Copy Message
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
