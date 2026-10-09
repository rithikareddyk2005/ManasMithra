import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Heart,
  Save,
  Download,
  CheckCircle2,
  AlertTriangle,
  Anchor,
  Users,
  Home,
  Phone,
  Sparkles,
  Edit3,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { triggerCelebration } from '../utils/storage';

interface BlueprintData {
  warningSigns: string[];
  groundingAnchors: string[];
  safeContacts: Array<{ name: string; relation: string; note: string }>;
  sensorySanctuary: string[];
  affirmation: string;
}

const DEFAULT_BLUEPRINT: BlueprintData = {
  warningSigns: [
    'Skipping regular meals or replacing lunch with caffeine',
    'Withdrawing from text messages and isolating in my room',
    'Reading the same paragraph multiple times with heavy brain fog',
    'Clenching my jaw and breathing high into my chest',
  ],
  groundingAnchors: [
    'Run cold water over my wrists and splash my face',
    'Do 2 minutes of 4-4-4-4 box breathing with closed eyes',
    'Step outside and look at the sky or touch a green leaf',
  ],
  safeContacts: [
    { name: 'Aisha', relation: 'Best Friend', note: 'I can text: “In a rough moment, just need you to say hi.”' },
    { name: 'Dr. Meera / Counselor', relation: 'Mentor / Advisor', note: 'Available during weekday office hours.' },
    { name: 'My Sister', relation: 'Family', note: 'Always listens with warmth without giving uninvited advice.' },
  ],
  sensorySanctuary: [
    'Dim overhead harsh LED lights and switch on warm soft ambient lamp',
    'Put my phone on Do-Not-Disturb in another room for 60 minutes',
    'Turn on 432Hz Zen Tone or rainfall white noise in ManasMitra',
    'Brew a warm cup of chamomile tea or hot water with lemon',
  ],
  affirmation: '“This intense feeling is a passing physiological wave, not my permanent reality. I am safe in this breath.”',
};

export const WellBeingBlueprint: React.FC = () => {
  const [blueprint, setBlueprint] = useState<BlueprintData>(() => {
    const saved = localStorage.getItem('manasmitra_user_blueprint');
    return saved ? JSON.parse(saved) : DEFAULT_BLUEPRINT;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states when editing
  const [signsInput, setSignsInput] = useState(blueprint.warningSigns.join('\n'));
  const [anchorsInput, setAnchorsInput] = useState(blueprint.groundingAnchors.join('\n'));
  const [sanctuaryInput, setSanctuaryInput] = useState(blueprint.sensorySanctuary.join('\n'));
  const [affirmationInput, setAffirmationInput] = useState(blueprint.affirmation);

  const handleSave = () => {
    soundEngine.playChime('high');
    triggerCelebration();

    const updated: BlueprintData = {
      ...blueprint,
      warningSigns: signsInput.split('\n').filter((s) => s.trim().length > 0),
      groundingAnchors: anchorsInput.split('\n').filter((s) => s.trim().length > 0),
      sensorySanctuary: sanctuaryInput.split('\n').filter((s) => s.trim().length > 0),
      affirmation: affirmationInput.trim(),
    };

    setBlueprint(updated);
    localStorage.setItem('manasmitra_user_blueprint', JSON.stringify(updated));
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportBlueprint = () => {
    soundEngine.playChime('medium');
    const text = `=====================================================
🌱 MANASMITRA AI - MY PERSONAL WELL-BEING BLUEPRINT
Aligned with UN Sustainable Development Goal 3 (Target 3.4)
=====================================================

1. MY EARLY WARNING SIGNS (Notice before crisis):
${blueprint.warningSigns.map((s, i) => `   [ ] ${i + 1}. ${s}`).join('\n')}

2. MY GROUNDING ANCHORS (Actions that reliably reset me):
${blueprint.groundingAnchors.map((a, i) => `   [*] ${i + 1}. ${a}`).join('\n')}

3. MY SAFE HARBOR PEOPLE (Contacts with zero judgment):
${blueprint.safeContacts.map((c) => `   • ${c.name} (${c.relation}): ${c.note}`).join('\n')}

4. MY SENSORY SANCTUARY (Physical environment tweaks):
${blueprint.sensorySanctuary.map((s) => `   • ${s}`).join('\n')}

5. MY EMERGENCY GROUNDING MANTRA:
   ${blueprint.affirmation}

6. 24/7 CRISIS SAFETY NET (Free & Confidential):
   • India: Tele-MANAS (14416 / 1800-891-4416) | KIRAN (1800-599-0019)
   • USA/Canada: 988 Suicide & Crisis Lifeline (Dial 988)
   • UK: Samaritans (116 123) | Shout (Text SHOUT to 85258)
   • Global: https://findahelpline.com
=====================================================`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `My_WellBeing_Blueprint_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-indigo-950 text-white p-7 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-400 text-emerald-950 shadow-xs mb-2">
            🛡️ WHO Preventive Model (SDG 3)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Personal Well-Being Safety Net Blueprint
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm max-w-2xl mt-1 leading-relaxed">
            Science shows that decision-making drops by over 70% during acute distress. Having your personal grounding anchors written beforehand acts as an indestructible emotional lifejacket.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-xs flex items-center gap-1.5 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Blueprint'}</span>
          </button>

          <button
            onClick={handleExportBlueprint}
            className="px-4 py-2.5 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-bold shadow-md flex items-center gap-1.5 transition-all hover:scale-102"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Pocket Card</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Your Well-Being Blueprint has been safely preserved to your personal device!</span>
        </div>
      )}

      {/* Blueprint Content or Editor */}
      {!isEditing ? (
        <div className="space-y-6">
          {/* Card 1 & 2 Grid: Early Warnings & Grounding Anchors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Early Warning Whispers */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-900">1. My Early Warning Whispers</h3>
                  <p className="text-[11px] text-stone-500">How I know my battery is getting low</p>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                {blueprint.warningSigns.map((sign, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-2"
                  >
                    <span className="font-bold text-amber-700 mt-0.5">•</span>
                    <span>{sign}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* My Grounding Anchors */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Anchor className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-900">2. My 3 Grounding Anchors</h3>
                  <p className="text-[11px] text-stone-500">Instant physical resets that never fail</p>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                {blueprint.groundingAnchors.map((anchor, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 text-xs text-emerald-950 flex items-start gap-2"
                  >
                    <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-900 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="font-medium">{anchor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3 & 4 Grid: Safe Contacts & Sensory Sanctuary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Safe Harbor Contacts */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-900">3. Safe Harbor Contacts</h3>
                  <p className="text-[11px] text-stone-500">People I can contact with zero shame</p>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                {blueprint.safeContacts.map((contact, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-rose-50/50 border border-rose-200/80 text-xs text-rose-950 space-y-0.5"
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{contact.name}</span>
                      <span className="text-[10px] font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                        {contact.relation}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 italic">“{contact.note}”</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sensory Sanctuary Environment */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
                  <Home className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-900">4. Sensory Sanctuary Tweaks</h3>
                  <p className="text-[11px] text-stone-500">Immediate room & device adjustments</p>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                {blueprint.sensorySanctuary.map((sens, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-indigo-50/50 border border-indigo-200/80 text-xs text-indigo-950 flex items-start gap-2"
                  >
                    <span className="font-bold text-indigo-700 mt-0.5">✓</span>
                    <span>{sens}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Emergency Mantra Quote Banner */}
          <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-7 shadow-sm text-center space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
              5. My Emergency Grounding Mantra
            </span>
            <blockquote className="text-base sm:text-lg font-serif-accent italic text-stone-100 max-w-2xl mx-auto leading-relaxed">
              {blueprint.affirmation}
            </blockquote>
          </div>
        </div>
      ) : (
        /* Edit Mode Form */
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-5">
          <h3 className="font-bold text-base text-stone-900">Customize Your Well-Being Blueprint</h3>
          <p className="text-xs text-stone-500">
            Write down your personalized signs, anchors, and comforting boundaries (one item per line).
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                1. Early Warning Signs (1 per line)
              </label>
              <textarea
                value={signsInput}
                onChange={(e) => setSignsInput(e.target.value)}
                className="w-full text-xs p-3.5 rounded-2xl border border-stone-200 bg-stone-50/50 min-h-[90px] focus:outline-emerald-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                2. My Grounding Anchors (1 per line)
              </label>
              <textarea
                value={anchorsInput}
                onChange={(e) => setAnchorsInput(e.target.value)}
                className="w-full text-xs p-3.5 rounded-2xl border border-stone-200 bg-stone-50/50 min-h-[90px] focus:outline-emerald-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                3. Sensory Sanctuary Adjustments (1 per line)
              </label>
              <textarea
                value={sanctuaryInput}
                onChange={(e) => setSanctuaryInput(e.target.value)}
                className="w-full text-xs p-3.5 rounded-2xl border border-stone-200 bg-stone-50/50 min-h-[90px] focus:outline-emerald-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                4. Personal Grounding Mantra
              </label>
              <input
                type="text"
                value={affirmationInput}
                onChange={(e) => setAffirmationInput(e.target.value)}
                className="w-full text-xs p-3.5 rounded-2xl border border-stone-200 bg-stone-50/50 focus:outline-emerald-600"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-500 hover:text-stone-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Save Blueprint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
