import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { CheckInModal } from './components/CheckInModal';
import { AiCompanion } from './components/AiCompanion';
import { HabitsTracker } from './components/HabitsTracker';
import { ActivitiesModal } from './components/ActivitiesModal';
import { SocialHub } from './components/SocialHub';
import { EducationalHub } from './components/EducationalHub';
import { AnalyticsView } from './components/AnalyticsView';
import { SdgImpactView } from './components/SdgImpactView';
import { CrisisSupportModal } from './components/CrisisSupportModal';
import { ZenSanctuary } from './components/ZenSanctuary';
import { DigitalZenMode } from './components/DigitalZenMode';
import { AiAssistantWidget } from './components/AiAssistantWidget';
import { KindnessTracker } from './components/KindnessTracker';
import { SomaticBodyScan } from './components/SomaticBodyScan';
import { WellBeingBlueprint } from './components/WellBeingBlueprint';
import { MentalSolutionsHub } from './components/MentalSolutionsHub';
import { ThemeSelector } from './components/ThemeSelector';
import { CheckInRecord, HabitItem, PreventiveObservation } from './types';
import {
  loadCheckIns,
  loadHabits,
  saveHabits,
  getStoredUserName,
  detectPreventivePattern,
} from './utils/storage';
import { getStoredTheme, setStoredTheme, THEMES, ThemeId } from './utils/theme';
import { Heart, Globe2, ShieldCheck, LifeBuoy } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>([]);
  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [userName, setUserName] = useState<string>('Rithu');
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(getStoredTheme());
  const [isThemeOpen, setIsThemeOpen] = useState<boolean>(false);
  const [themeToast, setThemeToast] = useState<string | null>(null);

  // Modals
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCrisisOpen, setIsCrisisOpen] = useState(false);
  const [isActivitiesModalOpen, setIsActivitiesModalOpen] = useState(false);
  const [isZenModeOpen, setIsZenModeOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<
    'breathing' | 'reframe' | 'grounding' | 'gratitude' | 'stretch'
  >('breathing');

  useEffect(() => {
    setCheckIns(loadCheckIns());
    setHabits(loadHabits());
    setUserName(getStoredUserName());
    setStoredTheme(currentTheme);
  }, []);

  useEffect(() => {
    setStoredTheme(currentTheme);
  }, [currentTheme]);

  const handleThemeChange = (newTheme: ThemeId) => {
    setCurrentTheme(newTheme);
    setStoredTheme(newTheme);
    const themeObj = THEMES[newTheme];
    setThemeToast(`${themeObj.emoji} ${themeObj.name} Activated`);
    setTimeout(() => {
      setThemeToast(null);
    }, 3200);
  };

  const latestCheckIn = checkIns[0];

  const habitsDone = habits.filter((h) => h.completed).length;
  const habitsRatio = habits.length > 0 ? habitsDone / habits.length : 0.7;

  const preventiveObservation: PreventiveObservation = detectPreventivePattern(checkIns);

  const handleUpdateHabits = (newHabits: HabitItem[]) => {
    setHabits(newHabits);
    saveHabits(newHabits);
  };

  const handleZenBreakCompleted = () => {
    // Reward user by completing screen-free break habit
    const updated = habits.map((h) => {
      if (h.category === 'mindful' || h.title.toLowerCase().includes('screen')) {
        return { ...h, completed: true, streak: h.completed ? h.streak : h.streak + 1 };
      }
      return h;
    });
    handleUpdateHabits(updated);
  };

  const handleCheckInComplete = (newRecord: CheckInRecord) => {
    setCheckIns([newRecord, ...checkIns.filter((c) => c.date !== newRecord.date)]);
  };

  const handleLaunchActivity = (
    activity: 'breathing' | 'reframe' | 'grounding' | 'gratitude' | 'stretch'
  ) => {
    setSelectedActivity(activity);
    setIsActivitiesModalOpen(true);
  };

  const themeConfig = THEMES[currentTheme] || THEMES.emerald;
  const themeBgClass = themeConfig.isDark
    ? 'bg-slate-950 text-slate-100'
    : currentTheme === 'amber'
    ? 'bg-amber-50/50 text-stone-900'
    : currentTheme === 'ocean'
    ? 'bg-cyan-50/40 text-stone-900'
    : currentTheme === 'lavender'
    ? 'bg-purple-50/40 text-stone-900'
    : 'bg-stone-50 text-stone-800';

  return (
    <div className={`min-h-screen ${themeBgClass} flex flex-col transition-colors duration-300`}>
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCheckIn={() => setIsCheckInOpen(true)}
        onOpenCrisisModal={() => setIsCrisisOpen(true)}
        onOpenZenMode={() => setIsZenModeOpen(true)}
        onOpenThemeSelector={() => setIsThemeOpen(true)}
        currentTheme={currentTheme}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            latestCheckIn={latestCheckIn}
            habits={habits}
            preventiveObservation={preventiveObservation}
            userName={userName}
            onOpenCheckIn={() => setIsCheckInOpen(true)}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onLaunchActivity={handleLaunchActivity}
            onOpenZenMode={() => setIsZenModeOpen(true)}
            currentTheme={currentTheme}
          />
        )}

        {activeTab === 'solutions' && (
          <MentalSolutionsHub
            onLaunchBreathing={() => handleLaunchActivity('breathing')}
            onLaunchReframe={() => handleLaunchActivity('reframe')}
            onOpenCrisisModal={() => setIsCrisisOpen(true)}
          />
        )}

        {activeTab === 'kindness' && <KindnessTracker />}

        {activeTab === 'body-scan' && <SomaticBodyScan />}

        {activeTab === 'blueprint' && <WellBeingBlueprint />}

        {activeTab === 'sanctuary' && (
          <ZenSanctuary
            completedHabitsCount={habitsDone}
            totalHabitsCount={habits.length}
            hasCheckedInToday={!!latestCheckIn}
          />
        )}

        {activeTab === 'companion' && (
          <AiCompanion
            latestCheckIn={latestCheckIn}
            onLaunchActivity={handleLaunchActivity}
            onOpenCrisisModal={() => setIsCrisisOpen(true)}
          />
        )}

        {activeTab === 'habits' && (
          <HabitsTracker
            habits={habits}
            onUpdateHabits={handleUpdateHabits}
            onLaunchActivity={handleLaunchActivity}
          />
        )}

        {activeTab === 'activities' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-teal-900 text-white p-6 rounded-3xl shadow-lg">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/30 text-emerald-100 border border-emerald-400/30 mb-2">
                🧘 Somatosensory & Cognitive Practices
              </div>
              <h2 className="text-xl font-bold">Interactive Well-Being Practice Studio</h2>
              <p className="text-emerald-100 text-xs mt-1 max-w-2xl">
                Select an evidence-based somatic or cognitive practice below to regulate your nervous system and cultivate mental clarity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  id: 'breathing',
                  title: '🧘 Guided Box Breathing',
                  desc: 'Inhale 4s, Hold 4s, Exhale 4s, Hold 4s. Activates parasympathetic calm within 90 seconds.',
                  badge: 'Autonomic Reset',
                  color: 'border-teal-200 hover:border-teal-400 bg-white',
                },
                {
                  id: 'reframe',
                  title: '🧠 Cognitive Thought Reframe',
                  desc: 'Untangle catastrophizing and black-and-white filters into balanced perspectives.',
                  badge: 'CBT Micro-Skill',
                  color: 'border-indigo-200 hover:border-indigo-400 bg-white',
                },
                {
                  id: 'grounding',
                  title: '🌿 5-4-3-2-1 Sensory Grounding',
                  desc: 'Step-by-step visual, tactile, and auditory countdown to halt creeping anxiety loops.',
                  badge: 'Acute Grounding',
                  color: 'border-cyan-200 hover:border-cyan-400 bg-white',
                },
                {
                  id: 'gratitude',
                  title: '✨ 3-Good-Things Gratitude',
                  desc: 'Train neuroplastic positivity by identifying three micro-blessings from your day.',
                  badge: 'Positive Neuroplasticity',
                  color: 'border-amber-200 hover:border-amber-400 bg-white',
                },
                {
                  id: 'stretch',
                  title: '🏃 5-Minute Movement & Desk Stretches',
                  desc: 'Release spinal tension, open chest muscles, and relieve screen strain.',
                  badge: 'Somatic Posture',
                  color: 'border-emerald-200 hover:border-emerald-400 bg-white',
                },
              ].map((act) => (
                <div
                  key={act.id}
                  onClick={() => handleLaunchActivity(act.id as any)}
                  className={`p-5 rounded-2xl border ${act.color} shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-stone-900">{act.title}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                        {act.badge}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">{act.desc}</p>
                  </div>
                  <div className="pt-3 border-t border-stone-100 flex justify-end text-xs font-bold text-emerald-700">
                    Launch Interactive Tool →
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'social' && <SocialHub />}

        {activeTab === 'education' && <EducationalHub />}

        {activeTab === 'progress' && (
          <AnalyticsView
            history={checkIns}
            preventiveObservation={preventiveObservation}
            onLaunchCheckIn={() => setIsCheckInOpen(true)}
            onLaunchActivity={handleLaunchActivity}
          />
        )}

        {activeTab === 'sdg-impact' && <SdgImpactView />}
      </main>

      {/* Global Modals */}
      <CheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        onComplete={handleCheckInComplete}
        habitsRatio={habitsRatio}
      />

      <ActivitiesModal
        isOpen={isActivitiesModalOpen}
        onClose={() => setIsActivitiesModalOpen(false)}
        initialActivity={selectedActivity}
      />

      <CrisisSupportModal
        isOpen={isCrisisOpen}
        onClose={() => setIsCrisisOpen(false)}
        onLaunchBreathing={() => {
          setSelectedActivity('breathing');
          setIsActivitiesModalOpen(true);
        }}
      />

      <DigitalZenMode
        isOpen={isZenModeOpen}
        onClose={() => setIsZenModeOpen(false)}
        onBreakCompleted={handleZenBreakCompleted}
      />

      <ThemeSelector
        isOpen={isThemeOpen}
        onClose={() => setIsThemeOpen(false)}
        currentTheme={currentTheme}
        onSelectTheme={handleThemeChange}
      />

      {/* Global Floating AI Assistant Widget */}
      <AiAssistantWidget
        latestCheckIn={latestCheckIn}
        onLaunchActivity={handleLaunchActivity}
        onOpenCrisisModal={() => setIsCrisisOpen(true)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Floating Theme Confirmation Toast */}
      {themeToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className={`px-4 py-2.5 rounded-2xl shadow-2xl border flex items-center gap-2.5 text-xs font-semibold backdrop-blur-md ${
            themeConfig.isDark
              ? 'bg-slate-900/95 border-indigo-700/80 text-white shadow-indigo-950/60'
              : 'bg-white/95 border-stone-200 text-stone-900 shadow-stone-800/10'
          }`}>
            <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: themeConfig.accentColor }} />
            <span>Atmosphere Applied: <strong>{themeToast}</strong></span>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={`mt-auto border-t backdrop-blur-xs py-6 text-xs transition-colors duration-200 ${themeConfig.footerClass}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className={`font-bold ${themeConfig.isDark ? 'text-white' : 'text-stone-800'}`}>
              ManasMitra AI {themeConfig.emoji}
            </span>
            <span>•</span>
            <span>UN SDG 3: Good Health and Well-Being (Target 3.4)</span>
            <span className="hidden md:inline">• Atmosphere: <strong>{themeConfig.name}</strong></span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCrisisOpen(true)}
              className="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
            >
              <LifeBuoy className="w-3.5 h-3.5" /> 24/7 Helplines
            </button>
            <button
              onClick={() => setActiveTab('sdg-impact')}
              className="font-medium hover:opacity-80 transition-opacity"
              style={{ color: themeConfig.accentColor }}
            >
              SDG 3 Mapping Matrix
            </button>
            <span className="opacity-80">Non-Diagnostic Preventive Companion</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
