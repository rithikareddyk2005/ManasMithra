import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  RotateCcw,
  CheckCircle2,
  Activity,
  Play,
  Pause,
  ArrowRight,
  Info,
  Smile,
  ShieldCheck,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { triggerCelebration } from '../utils/storage';

interface BodyZone {
  id: string;
  name: string;
  area: string;
  emoji: string;
  commonCause: string;
  somaticExercise: {
    title: string;
    duration: string;
    steps: string[];
    neuroScience: string;
  };
}

const BODY_ZONES: BodyZone[] = [
  {
    id: 'jaw',
    name: 'Jaw, Tongue & Masseter',
    area: 'Facial & Cranial',
    emoji: '😬',
    commonCause: 'Subconscious clenching, suppressing words or anger, academic stress.',
    somaticExercise: {
      title: 'Vagus-Nerve Jaw Drop & Lion Sigh',
      duration: '45 seconds',
      steps: [
        'Open your mouth wide like a gentle yawn, letting your lower jaw go completely heavy.',
        'Drop your tongue down from the roof of your mouth to the floor of your mouth.',
        'Place fingertips on your jaw joints (just in front of your earlobes) and make slow, gentle circles.',
        'Exhale through your mouth with a soft, audible “Haaa” sound to discharge vocal cord tension.',
      ],
      neuroScience:
        'The trigeminal and facial nerves communicate directly with the amygdala. Releasing the masseter muscle signals safety to the brainstem within 30 seconds.',
    },
  },
  {
    id: 'neck',
    name: 'Neck & Upper Trapezius',
    area: 'Cervical Spine',
    emoji: '🦒',
    commonCause: 'Forward head posture, computer screen tilt, feeling burdened by responsibilities.',
    somaticExercise: {
      title: 'Scapular Depress & Cervical Glide',
      duration: '60 seconds',
      steps: [
        'Inhale and shrug your shoulders up to your ears, holding the tension for 3 seconds.',
        'Exhale sharply and let your shoulders drop completely down like heavy lead weights.',
        'Slowly bring your chin toward your chest, feeling the back of your neck lengthen.',
        'Gently tilt right ear toward right shoulder; breathe into the left trapezius for 3 deep cycles. Repeat on left.',
      ],
      neuroScience:
        'The trapezius muscle is innervated by the cranial accessory nerve (CN XI), which reflexively contracts during startle or defensive postures.',
    },
  },
  {
    id: 'chest',
    name: 'Chest & Clavicles',
    area: 'Thoracic Cavity',
    emoji: '🫁',
    commonCause: 'Shallow apical breathing, chronic low-grade anxiety, protective bracing.',
    somaticExercise: {
      title: 'Physiological Sigh & Pectoral Expansion',
      duration: '45 seconds',
      steps: [
        'Interlace fingers behind your back or place palms on your lower ribs.',
        'Take two quick consecutive inhales through your nose (first deep, second a small top-up).',
        'Exhale slowly and smoothly through your mouth for 6 to 8 seconds.',
        'Repeat this cycle 4 times, feeling your ribcage expand laterally instead of rising upward.',
      ],
      neuroScience:
        'The double inhale physically re-inflates collapsed pulmonary alveoli, increasing blood oxygenation and activating the baroreflex to lower heart rate.',
    },
  },
  {
    id: 'stomach',
    name: 'Solar Plexus & Abdomen',
    area: 'Enteric & Digestive',
    emoji: '🦋',
    commonCause: '“Butterflies” in the stomach, dread before presentations, bracing core muscles.',
    somaticExercise: {
      title: 'Enteric Nervous System Belly Release',
      duration: '60 seconds',
      steps: [
        'Place one warm palm flat over your belly button.',
        'Deliberately push your belly out softly like a balloon on your inhale—release all stomach sucking.',
        'On exhale, feel your hand sink inward as your core softens completely.',
        'Repeat 5 slow cycles, acknowledging that your abdomen is safe right now.',
      ],
      neuroScience:
        'The gut houses over 500 million neurons (the enteric nervous system) and produces 90% of the body’s serotonin. Softening the belly halts sympathetic adrenaline surges.',
    },
  },
  {
    id: 'hands',
    name: 'Wrists & Finger Flexors',
    area: 'Extremities',
    emoji: '✍️',
    commonCause: 'Continuous typing, smartphone scrolling, gripping steering wheels or pens tightly.',
    somaticExercise: {
      title: 'Carpal Decompression & Finger Shakeout',
      duration: '45 seconds',
      steps: [
        'Hold both hands in front of you and shake your wrists loose like shaking water off wet fingertips.',
        'Interlace fingers, invert your palms outward, and push forward while taking a deep breath.',
        'Massage the fleshy webbing between your thumb and index finger (acupressure point LI4) for 15 seconds.',
      ],
      neuroScience:
        'High density of sensory mechanoreceptors in fingertips directly maps to large motor cortex areas. Loosening fingers de-escalates central nervous system arousal.',
    },
  },
  {
    id: 'lowerback',
    name: 'Lumbar Spine & Pelvis',
    area: 'Pelvic & Lumbar',
    emoji: '🪑',
    commonCause: 'Prolonged chair sitting, pelvic tilt, suppressed fight-or-flight energy.',
    somaticExercise: {
      title: 'Pelvic Rock & Spinal Fluid Reset',
      duration: '60 seconds',
      steps: [
        'While seated, rock your pelvis gently forward (arching back slightly on inhale).',
        'Rock pelvis backward (rounding spine softly into your chair on exhale).',
        'Perform this fluid wave 8 times, synchronizing with your breath.',
        'Stand up and gently shake each leg out like a wet noodle to discharge static charge.',
      ],
      neuroScience:
        'Rhythmic pelvic oscillation stimulates cerebrospinal fluid circulation and resets the psoas muscle, the body’s primary “fight-or-flight” hip flexor.',
    },
  },
];

export const SomaticBodyScan: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<BodyZone>(BODY_ZONES[0]);
  const [tensionLevels, setTensionLevels] = useState<Record<string, number>>({
    jaw: 3,
    neck: 4,
    chest: 2,
    stomach: 3,
    hands: 2,
    lowerback: 4,
  });

  const [isPracticing, setIsPracticing] = useState<boolean>(false);
  const [practiceSeconds, setPracticeSeconds] = useState<number>(45);
  const [completedPractice, setCompletedPractice] = useState<boolean>(false);

  const handleSelectZone = (zone: BodyZone) => {
    setSelectedZone(zone);
    setIsPracticing(false);
    setCompletedPractice(false);
    setPracticeSeconds(45);
    soundEngine.playChime('medium');
  };

  const setTension = (zoneId: string, level: number) => {
    setTensionLevels((prev) => ({ ...prev, [zoneId]: level }));
    soundEngine.playChime('low');
  };

  const startExercise = () => {
    setIsPracticing(true);
    setCompletedPractice(false);
    soundEngine.playTibetanBowl(432);
  };

  // Timer tick for 45s practice
  React.useEffect(() => {
    let t: any = null;
    if (isPracticing && practiceSeconds > 0) {
      t = setInterval(() => setPracticeSeconds((p) => p - 1), 1000);
    } else if (isPracticing && practiceSeconds === 0) {
      setIsPracticing(false);
      setCompletedPractice(true);
      soundEngine.playTibetanBowl(528);
      triggerCelebration();
      // Auto lower tension level by 2
      setTensionLevels((prev) => ({
        ...prev,
        [selectedZone.id]: Math.max(1, prev[selectedZone.id] - 2),
      }));
    }
    return () => clearInterval(t);
  }, [isPracticing, practiceSeconds, selectedZone.id]);

  const tensionColors: Record<number, string> = {
    1: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    2: 'bg-teal-100 text-teal-800 border-teal-300',
    3: 'bg-amber-100 text-amber-800 border-amber-300',
    4: 'bg-orange-100 text-orange-800 border-orange-300',
    5: 'bg-rose-100 text-rose-800 border-rose-300',
  };

  const tensionLabels: Record<number, string> = {
    1: 'Soft & Easeful',
    2: 'Slight Tension',
    3: 'Noticeable Stiffness',
    4: 'High Strain / Tight',
    5: 'Severely Clenched',
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-indigo-950 text-white p-7 rounded-3xl shadow-xl space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-400 text-teal-950 shadow-xs">
            🧘 Psychosomatic Well-Being (SDG 3)
          </span>
          <span className="text-xs text-teal-200">
            Neuro-Somatic Tension Heatmap & Micro-Releases
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Somatic Body Scan & Physical Tension Heatmap
          </h1>
          <p className="text-teal-100 text-xs sm:text-sm max-w-2xl mt-1 leading-relaxed">
            Emotional stress lives in your muscles before you consciously realize it. Pinpoint where your body is holding tension and apply targeted 60-second vagal release exercises.
          </p>
        </div>
      </div>

      {/* Main Grid: Body Map + Selected Zone Exercise */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Somatic Heatmap Selector */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-stone-900">1. Select Your Tension Zone</h3>
            <span className="text-[11px] text-stone-400">Click a body site</span>
          </div>

          <div className="space-y-2">
            {BODY_ZONES.map((zone) => {
              const currentLvl = tensionLevels[zone.id] || 3;
              const isSelected = selectedZone.id === zone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => handleSelectZone(zone)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-2 ring-emerald-500/20'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{zone.emoji}</span>
                    <div>
                      <div className="text-xs font-bold text-stone-900">{zone.name}</div>
                      <div className="text-[10px] text-stone-500">{zone.area}</div>
                    </div>
                  </div>

                  {/* Tension pill */}
                  <div
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      tensionColors[currentLvl]
                    }`}
                  >
                    Level {currentLvl}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3 rounded-2xl bg-stone-100 text-[11px] text-stone-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>
              Your body keeps score. Regular somatic releases lower circulating inflammatory cytokines.
            </span>
          </div>
        </div>

        {/* Right Column (2 Cols): Targeted Somatic Release Studio */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-sm space-y-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{selectedZone.emoji}</span>
              <div>
                <h3 className="text-base font-bold text-stone-900">{selectedZone.name}</h3>
                <p className="text-xs text-stone-500">{selectedZone.commonCause}</p>
              </div>
            </div>

            {/* Tension Level Adjuster */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto bg-stone-50 p-1.5 rounded-2xl border border-stone-200">
              <span className="text-[11px] font-bold text-stone-500 px-1">Tension:</span>
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setTension(selectedZone.id, lvl)}
                  className={`w-6 h-6 rounded-lg text-[11px] font-bold transition-all ${
                    tensionLevels[selectedZone.id] === lvl
                      ? 'bg-emerald-600 text-white shadow-xs scale-105'
                      : 'text-stone-500 hover:bg-stone-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Exercise Card */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Targeted Somatic Protocol
                </span>
                <h4 className="text-base font-bold text-stone-900 mt-1">
                  {selectedZone.somaticExercise.title}
                </h4>
              </div>

              <span className="text-xs font-semibold text-stone-500">
                ⏱️ {selectedZone.somaticExercise.duration}
              </span>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-2.5 bg-stone-50/70 p-4 rounded-2xl border border-stone-200">
              {selectedZone.somaticExercise.steps.map((st, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-stone-700 leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{st}</span>
                </div>
              ))}
            </div>

            {/* Neuroscience Insight */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-950 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-emerald-900">Neuro-Biological Mechanism: </strong>
                {selectedZone.somaticExercise.neuroScience}
              </div>
            </div>

            {/* Practice Interactive Timer & Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              {isPracticing ? (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin flex items-center justify-center font-mono font-bold text-xs text-stone-800" />
                  <div>
                    <div className="text-xs font-bold text-emerald-800">
                      Somatic Release in Progress ({practiceSeconds}s left)
                    </div>
                    <div className="text-[11px] text-stone-500">Follow the steps smoothly...</div>
                  </div>
                </div>
              ) : completedPractice ? (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Physical release completed! Tension reduced.</span>
                </div>
              ) : (
                <div className="text-xs text-stone-500">
                  Current Strain: <strong className="text-stone-800">{tensionLabels[tensionLevels[selectedZone.id]]}</strong>
                </div>
              )}

              <div className="flex items-center gap-2 self-stretch sm:self-auto">
                {isPracticing ? (
                  <button
                    onClick={() => setIsPracticing(false)}
                    className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-bold"
                  >
                    Pause
                  </button>
                ) : (
                  <button
                    onClick={startExercise}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition-all hover:scale-102 flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <Play className="w-4 h-4" />
                    <span>Begin 45s Somatic Reset</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
