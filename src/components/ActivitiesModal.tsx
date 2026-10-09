import React, { useState, useEffect } from 'react';
import {
  X,
  Wind,
  Brain,
  Eye,
  HeartHandshake,
  Footprints,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Sparkles,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { triggerCelebration } from '../utils/storage';

interface ActivitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialActivity?: 'breathing' | 'reframe' | 'grounding' | 'gratitude' | 'stretch';
}

export const ActivitiesModal: React.FC<ActivitiesModalProps> = ({
  isOpen,
  onClose,
  initialActivity = 'breathing',
}) => {
  const [activeTab, setActiveTab] = useState<'breathing' | 'reframe' | 'grounding' | 'gratitude' | 'stretch'>(
    initialActivity
  );

  useEffect(() => {
    if (initialActivity) {
      setActiveTab(initialActivity);
    }
  }, [initialActivity]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-teal-800 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg">
              🧘
            </div>
            <div>
              <h2 className="text-base font-bold">Well-Being Practice Studio</h2>
              <p className="text-teal-100 text-xs">
                Science-backed micro-practices for mental clarity, nervous system reset & emotional calm.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 px-4 bg-stone-50/70 overflow-x-auto shrink-0">
          {[
            { id: 'breathing', label: 'Box Breathing', icon: Wind },
            { id: 'reframe', label: 'Thought Reframe', icon: Brain },
            { id: 'grounding', label: '5-4-3-2-1 Grounding', icon: Eye },
            { id: 'gratitude', label: 'Gratitude Reflection', icon: HeartHandshake },
            { id: 'stretch', label: '5-Min Movement', icon: Footprints },
          ].map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-2 py-3 px-3.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
                  active
                    ? 'border-emerald-600 text-emerald-800 bg-white'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-emerald-600' : 'text-stone-400'}`} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'breathing' && <BoxBreathingTool />}
          {activeTab === 'reframe' && <ThoughtReframeTool />}
          {activeTab === 'grounding' && <GroundingTool />}
          {activeTab === 'gratitude' && <GratitudeTool />}
          {activeTab === 'stretch' && <MovementTool />}
        </div>
      </div>
    </div>
  );
};

// 1. Box Breathing Component
const BoxBreathingTool: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0); // 0: Inhale, 1: Hold, 2: Exhale, 3: Hold
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);

  const phases = [
    { name: 'Inhale deeply', desc: 'Breathe in slowly through your nose...', color: 'text-teal-700 bg-teal-50 border-teal-300' },
    { name: 'Hold your breath', desc: 'Gently suspend the breath; feel calm stability...', color: 'text-indigo-700 bg-indigo-50 border-indigo-300' },
    { name: 'Exhale smoothly', desc: 'Release tension slowly through your mouth...', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' },
    { name: 'Hold empty', desc: 'Rest in the quiet pause before the next breath...', color: 'text-amber-700 bg-amber-50 border-amber-300' },
  ];

  useEffect(() => {
    let timer: any = null;
    if (isRunning) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            soundEngine.playChime('medium');
            setPhaseIndex((p) => {
              const nextPhase = (p + 1) % 4;
              if (nextPhase === 0) {
                setCompletedCycles((c) => c + 1);
              }
              return nextPhase;
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const toggleRun = () => {
    if (!isRunning) {
      soundEngine.playChime('low');
    }
    setIsRunning(!isRunning);
  };

  const reset = () => {
    setIsRunning(false);
    setPhaseIndex(0);
    setSecondsLeft(4);
  };

  // Scale computation for visual breathing circle
  let scaleClass = 'scale-90';
  if (phaseIndex === 0) scaleClass = 'scale-125';
  else if (phaseIndex === 1) scaleClass = 'scale-125';
  else if (phaseIndex === 2) scaleClass = 'scale-90';
  else scaleClass = 'scale-90';

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-lg mx-auto py-2">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
        🌱 SDG 3.4 Parasympathetic Nerve Regulation
      </div>

      <p className="text-stone-600 text-xs">
        4 seconds Inhale • 4 seconds Hold • 4 seconds Exhale • 4 seconds Hold. Used by elite performers to calm the amygdala and steady the pulse.
      </p>

      {/* Visual Circle */}
      <div className="relative w-56 h-56 flex items-center justify-center my-4">
        {/* Outer ambient glow */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-tr from-teal-200 to-emerald-200 opacity-60 blur-xl transition-all duration-1000 ${
            isRunning ? 'animate-pulse' : ''
          }`}
        />
        {/* Expanding breathing sphere */}
        <div
          className={`w-44 h-44 rounded-full border-4 border-emerald-500/50 bg-gradient-to-br from-emerald-50 to-teal-100 flex flex-col items-center justify-center shadow-lg transition-transform duration-[4000ms] ease-in-out ${
            isRunning ? scaleClass : 'scale-100'
          }`}
        >
          <span className="text-4xl font-extrabold text-stone-800">{secondsLeft}</span>
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-widest mt-1">
            Seconds
          </span>
        </div>
      </div>

      {/* Current phase card */}
      <div className={`p-4 rounded-2xl border w-full transition-all ${phases[phaseIndex].color}`}>
        <div className="text-base font-bold">{phases[phaseIndex].name}</div>
        <div className="text-xs mt-1 text-stone-600">{phases[phaseIndex].desc}</div>
      </div>

      {/* Control buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleRun}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all hover:scale-102"
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4" /> Pause Exercise
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Begin Box Breathing
            </>
          )}
        </button>

        <button
          onClick={reset}
          className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-600 transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="text-xs text-stone-500">
        Completed Cycles: <strong className="text-emerald-700 font-bold">{completedCycles}</strong> (2 minutes = ~8 cycles)
      </div>
    </div>
  );
};

// 2. Thought Reframe Tool
const ThoughtReframeTool: React.FC = () => {
  const [trigger, setTrigger] = useState('');
  const [thought, setThought] = useState('');
  const [distortion, setDistortion] = useState('catastrophizing');
  const [reframe, setReframe] = useState('');
  const [saved, setSaved] = useState(false);

  const distortions = [
    { id: 'catastrophizing', label: 'Catastrophizing', desc: 'Predicting the absolute worst outcome.' },
    { id: 'all-or-nothing', label: 'All-or-Nothing', desc: 'Seeing things in black and white without middle ground.' },
    { id: 'mind-reading', label: 'Mind Reading', desc: 'Assuming others think critically about you.' },
    { id: 'should-statements', label: 'Rigid "Shoulds"', desc: 'Demanding impossible perfection from oneself.' },
  ];

  const handleSave = () => {
    if (!thought.trim() || !reframe.trim()) return;
    soundEngine.playChime('high');
    triggerCelebration();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-5 max-w-xl mx-auto">
      <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-900">
        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Cognitive Reframing Studio:</strong> Thoughts are mental events, not objective facts. Use this 3-step cognitive tool to untangle automatic stress thoughts.
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-stone-800">
          Step 1: The Situation / Trigger
        </label>
        <input
          type="text"
          value={trigger}
          onChange={(e) => setTrigger(e.target.value)}
          placeholder="e.g. Received a critical review on an assignment, or had a difficult chat."
          className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-emerald-600 bg-stone-50/50"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-stone-800">
          Step 2: The Automatic Heavy Thought
        </label>
        <textarea
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder="e.g. 'I am failing at everything and I won't be able to catch up.'"
          className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-emerald-600 bg-stone-50/50 min-h-[60px]"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-stone-800">
          Step 3: Recognize the Thinking Filter
        </label>
        <div className="grid grid-cols-2 gap-2">
          {distortions.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDistortion(d.id)}
              className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                distortion === d.id
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                  : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
              }`}
            >
              <div className="font-semibold">{d.label}</div>
              <div className="text-[10px] text-stone-500">{d.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-stone-800">
          Step 4: The Compassionate, Balanced Reframe
        </label>
        <textarea
          value={reframe}
          onChange={(e) => setReframe(e.target.value)}
          placeholder="e.g. 'This feedback points to one specific task. I have tackled tough learning curves before, and I can take this step by step.'"
          className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-emerald-600 bg-stone-50/50 min-h-[70px]"
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        {saved ? (
          <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" /> Reframe saved to your reflection journal!
          </span>
        ) : (
          <span className="text-[11px] text-stone-400">Practicing regularly changes neural pathways.</span>
        )}

        <button
          onClick={handleSave}
          disabled={!thought || !reframe}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all"
        >
          Internalize & Save Reframe
        </button>
      </div>
    </div>
  );
};

// 3. Grounding Tool (5-4-3-2-1)
const GroundingTool: React.FC = () => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      num: 5,
      sense: 'Things you can SEE',
      emoji: '👀',
      instruction: 'Look around your room or window. Notice 5 distinct objects, their colors, patterns, and how light touches them.',
      placeholder: 'e.g., A green houseplant leaf, a book cover, coffee cup, wooden floor grain, cloud.',
    },
    {
      num: 4,
      sense: 'Things you can physically TOUCH / FEEL',
      emoji: '✋',
      instruction: 'Feel physical sensations right now. The fabric of your clothes, your feet against the floor, temperature of the air.',
      placeholder: 'e.g., Smooth desk surface, warmth in my hands, cotton shirt, firmness of my chair.',
    },
    {
      num: 3,
      sense: 'Things you can HEAR',
      emoji: '👂',
      instruction: 'Close your eyes for 5 seconds. What subtle sounds are present in your immediate space or in the distance?',
      placeholder: 'e.g., Soft hum of computer fan, distant bird chirp, sound of my own breath.',
    },
    {
      num: 2,
      sense: 'Things you can SMELL',
      emoji: '👃',
      instruction: 'Gently sniff the air. If no immediate scent is noticeable, remember the smell of fresh rain, coffee, or peppermint.',
      placeholder: 'e.g., Fresh tea aroma, fresh air from window.',
    },
    {
      num: 1,
      sense: 'Thing you can TASTE or APPRECIATE',
      emoji: '👅',
      instruction: 'Notice the lingering taste of water or tea, or take one slow mindful sip of water and notice the coolness.',
      placeholder: 'e.g., Cool, refreshing sip of water.',
    },
  ];

  const current = steps[step];

  const next = () => {
    soundEngine.playChime('medium');
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      triggerCelebration();
      setStep(0);
    }
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto py-2 text-center">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-800">
        🌿 5-4-3-2-1 Somatosensory Anxiety Neutralizer
      </div>

      <div className="flex justify-center gap-2">
        {steps.map((s, idx) => (
          <div
            key={s.num}
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
              idx === step
                ? 'bg-emerald-600 text-white scale-110 shadow-sm'
                : idx < step
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-stone-200 text-stone-400'
            }`}
          >
            {s.num}
          </div>
        ))}
      </div>

      <div className="p-6 rounded-2xl bg-gradient-to-b from-stone-50 to-white border border-stone-200 shadow-sm space-y-3">
        <div className="text-4xl">{current.emoji}</div>
        <h3 className="text-base font-bold text-stone-800">
          Acknowledge {current.num} {current.sense}
        </h3>
        <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
          {current.instruction}
        </p>
      </div>

      <button
        onClick={next}
        className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 mx-auto"
      >
        {step < steps.length - 1 ? (
          <>
            Next Step ({steps[step + 1].num}) <ArrowRight className="w-4 h-4" />
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4" /> Complete Grounding Reset
          </>
        )}
      </button>
    </div>
  );
};

// 4. Gratitude Tool
const GratitudeTool: React.FC = () => {
  const [items, setItems] = useState(['', '', '']);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!items.some((i) => i.trim())) return;
    soundEngine.playChime('high');
    triggerCelebration();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-5 max-w-lg mx-auto">
      <div className="text-center space-y-1">
        <h3 className="text-base font-bold text-stone-800">The 3-Good-Things Practice</h3>
        <p className="text-xs text-stone-500">
          Documented in clinical positive psychology to shift attention toward safety, resourcefulness, and appreciation.
        </p>
      </div>

      <div className="space-y-3">
        {[0, 1, 2].map((idx) => (
          <div key={idx} className="space-y-1">
            <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center">
                {idx + 1}
              </span>
              <span>Good thing #{idx + 1} from today:</span>
            </label>
            <input
              type="text"
              value={items[idx]}
              onChange={(e) => {
                const next = [...items];
                next[idx] = e.target.value;
                setItems(next);
              }}
              placeholder={
                idx === 0
                  ? 'A warm morning tea or unexpected kind word...'
                  : idx === 1
                  ? 'Completing a small task that felt heavy...'
                  : 'A brief laugh with a friend or peaceful moment...'
              }
              className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:outline-emerald-600 bg-stone-50/50"
            />
          </div>
        ))}
      </div>

      <div className="pt-2 flex items-center justify-between">
        {saved ? (
          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
            <CheckCircle className="w-4 h-4" /> Gratitudes registered!
          </span>
        ) : (
          <span className="text-[11px] text-stone-400">Micro-gratitude builds neuroplastic resilience.</span>
        )}

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
        >
          Save Gratitudes
        </button>
      </div>
    </div>
  );
};

// 5. Movement & Stretch Tool
const MovementTool: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);

  const stretches = [
    {
      name: 'Gentle Neck & Cervical Release',
      duration: '45 seconds',
      steps: [
        'Sit upright with shoulders relaxed and dropped down.',
        'Slowly bring your right ear toward your right shoulder without forcing.',
        'Take three full belly breaths, feeling tension melt along the left trapezius.',
        'Gently repeat on the left side.',
      ],
      benefit: 'Relieves computer-screen strain and jaw tightness.',
    },
    {
      name: 'Seated Spinal Twist',
      duration: '60 seconds',
      steps: [
        'Place your right hand on the back of your chair or outer left knee.',
        'Inhale to lengthen your spine tall through the crown of your head.',
        'Exhale and gently rotate your torso to the left.',
        'Hold for 4 breaths, then smoothly switch to the right side.',
      ],
      benefit: 'Re-oxygenates spinal discs and massages digestive organs.',
    },
    {
      name: 'Chest & Pectoral Opener',
      duration: '45 seconds',
      steps: [
        'Interlace fingers behind your lower back or hold the sides of your chair.',
        'Roll your shoulder blades together and gently lift your sternum toward the sky.',
        'Breathe deep into your collarbones for 4 long cycles.',
      ],
      benefit: 'Counters the forward hunch of typing and phone use.',
    },
    {
      name: 'Wrist & Forearm Decompression',
      duration: '45 seconds',
      steps: [
        'Extend your right arm forward, fingers pointing up like a stop sign.',
        'Use left hand to gently draw fingers back toward you.',
        'Then point fingers down toward floor and gently press the back of the hand.',
        'Switch to left arm.',
      ],
      benefit: 'Prevents repetitive strain injury and carpal tunnel tension.',
    },
  ];

  const curr = stretches[currentIdx];

  return (
    <div className="space-y-5 max-w-xl mx-auto">
      <div className="flex justify-between items-center bg-stone-50 p-3 rounded-2xl border border-stone-200">
        {stretches.map((s, idx) => (
          <button
            key={s.name}
            onClick={() => setCurrentIdx(idx)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              idx === currentIdx
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-200/60'
            }`}
          >
            Stretch {idx + 1}
          </button>
        ))}
      </div>

      <div className="p-5 rounded-2xl border border-stone-200 bg-white shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-stone-900 text-sm">{curr.name}</h3>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            {curr.duration}
          </span>
        </div>

        <p className="text-xs text-stone-500 font-medium">✨ {curr.benefit}</p>

        <ol className="space-y-2 pt-2 border-t border-stone-100">
          {curr.steps.map((st, i) => (
            <li key={i} className="text-xs text-stone-700 flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-stone-100 text-stone-600 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span>{st}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex justify-between items-center pt-2">
        <button
          onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
          className="px-4 py-2 rounded-xl text-xs font-semibold border border-stone-200 disabled:opacity-30 hover:bg-stone-50"
        >
          Previous
        </button>

        <button
          onClick={() => {
            soundEngine.playChime('medium');
            if (currentIdx < stretches.length - 1) {
              setCurrentIdx(currentIdx + 1);
            } else {
              triggerCelebration();
            }
          }}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
        >
          {currentIdx < stretches.length - 1 ? 'Next Stretch' : 'Complete 5-Min Movement ✨'}
        </button>
      </div>
    </div>
  );
};
