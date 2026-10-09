import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Maximize2,
  Minimize2,
  Sparkles,
  Eye,
  CheckCircle,
  Wind,
  Footprints,
  Droplets,
  Moon,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Unlock,
  Smartphone,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { triggerCelebration } from '../utils/storage';

interface DigitalZenModeProps {
  isOpen: boolean;
  onClose: () => void;
  onBreakCompleted?: () => void;
}

export const DigitalZenMode: React.FC<DigitalZenModeProps> = ({
  isOpen,
  onClose,
  onBreakCompleted,
}) => {
  const [durationMinutes, setDurationMinutes] = useState<number>(10);
  const [secondsLeft, setSecondsLeft] = useState<number>(10 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [soundType, setSoundType] = useState<'whitenoise' | 'rain' | 'ocean' | 'zen' | 'off'>('whitenoise');
  const [soundVolume, setSoundVolume] = useState<number>(0.16);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [completedBreak, setCompletedBreak] = useState<boolean>(false);
  const [tipIndex, setTipIndex] = useState<number>(0);

  // Strict Focus Lock & Anti-Device Touch System
  const [graceSeconds, setGraceSeconds] = useState<number>(5); // 5-sec grace period to put phone down
  const [isArmed, setIsArmed] = useState<boolean>(false); // Armed after grace period
  const [restartWarning, setRestartWarning] = useState<string | null>(null);
  const [restartViolations, setRestartViolations] = useState<number>(0);

  // Emergency abort button holding progress
  const [abortHoldProgress, setAbortHoldProgress] = useState<number>(0);
  const abortTimerRef = useRef<any>(null);

  const tips = [
    {
      title: 'No-Touch Screen Rule Active',
      desc: 'Set your mobile or laptop down completely. Any touch, scroll, or tab switch will automatically restart the break timer.',
      icon: Smartphone,
    },
    {
      title: 'The 20-20-20 Rule for Eye Fatigue',
      desc: 'Look at least 20 feet into the distance for 20 seconds. This immediately relaxes your ciliary eye muscles.',
      icon: Eye,
    },
    {
      title: 'Mindful Hydration Away From Glow',
      desc: 'Step into the kitchen or hallway. Pour a fresh glass of cool water and drink it slowly with your eyes closed.',
      icon: Droplets,
    },
    {
      title: 'Conscious Blinking & Tear Recovery',
      desc: 'Screen reading drops your blink rate by up to 66%. Take 10 intentional, slow, complete blinks to re-lubricate your corneas.',
      icon: Sparkles,
    },
    {
      title: 'Spinal Decompression & Posture Reset',
      desc: 'Stand up, interlace fingers overhead, and reach toward the ceiling. Inhale into your ribcage to undo hours of seated compression.',
      icon: Footprints,
    },
  ];

  // Request notification permission
  const requestNotification = async () => {
    if (typeof Notification !== 'undefined') {
      try {
        const perm = await Notification.requestPermission();
        setNotificationPermission(perm);
        if (perm === 'granted') {
          soundEngine.playChime('high');
        }
      } catch (err) {
        console.warn('Notification permission error:', err);
      }
    }
  };

  // On Open: initialize and start grace countdown
  useEffect(() => {
    if (isOpen) {
      setSecondsLeft(durationMinutes * 60);
      setIsRunning(true);
      setCompletedBreak(false);
      setGraceSeconds(5);
      setIsArmed(false);
      setRestartWarning(null);
      setRestartViolations(0);

      // Start soothing white noise
      if (soundType !== 'off') {
        soundEngine.toggleAmbient(soundType, soundVolume);
      }

      // Check notification permission
      if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
        Notification.requestPermission().then((p) => setNotificationPermission(p));
      }
    } else {
      soundEngine.stopAmbient();
    }

    return () => {
      soundEngine.stopAmbient();
    };
  }, [isOpen]);

  // Grace countdown (gives user 5s to set their phone down on the table)
  useEffect(() => {
    let interval: any = null;
    if (isOpen && isRunning && !completedBreak && !isArmed) {
      interval = setInterval(() => {
        setGraceSeconds((prev) => {
          if (prev <= 1) {
            setIsArmed(true);
            soundEngine.playChime('medium');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, isRunning, completedBreak, isArmed]);

  // STRICT SCREEN / DEVICE USAGE DETECTION
  // If user touches phone, clicks mouse, types, or switches tabs while armed: RESTART TIMER!
  useEffect(() => {
    if (!isOpen || !isRunning || !isArmed || completedBreak) return;

    let cooldown = false;

    const handleDeviceInteraction = (event: Event) => {
      if (cooldown) return;
      cooldown = true;

      // RESTART THE TIMER!
      setSecondsLeft(durationMinutes * 60);
      setRestartViolations((v) => v + 1);
      soundEngine.playChime('low');

      setRestartWarning(
        `⚠️ Device usage detected (${event.type})! Timer restarted to ${durationMinutes}:00. Digital Zen requires putting your device completely away until the bell rings.`
      );

      // Disarm for 4 seconds so user can safely let go of phone without infinite restart loop
      setIsArmed(false);
      setGraceSeconds(4);

      setTimeout(() => {
        cooldown = false;
      }, 2000);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleDeviceInteraction(new CustomEvent('app_switch'));
      }
    };

    // Attach passive listeners
    window.addEventListener('touchstart', handleDeviceInteraction, { passive: true });
    window.addEventListener('touchmove', handleDeviceInteraction, { passive: true });
    window.addEventListener('keydown', handleDeviceInteraction);
    window.addEventListener('mousedown', handleDeviceInteraction);
    window.addEventListener('wheel', handleDeviceInteraction, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('touchstart', handleDeviceInteraction);
      window.removeEventListener('touchmove', handleDeviceInteraction);
      window.removeEventListener('keydown', handleDeviceInteraction);
      window.removeEventListener('mousedown', handleDeviceInteraction);
      window.removeEventListener('wheel', handleDeviceInteraction);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isOpen, isRunning, isArmed, completedBreak, durationMinutes]);

  // Main countdown timer
  useEffect(() => {
    let timer: any = null;
    if (isOpen && isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isOpen && isRunning && secondsLeft === 0) {
      handleComplete();
    }
    return () => clearInterval(timer);
  }, [isOpen, isRunning, secondsLeft]);

  // Cycle tips every 18 seconds
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTipIndex((i) => (i + 1) % tips.length);
    }, 18000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleComplete = () => {
    setIsRunning(false);
    setCompletedBreak(true);
    setIsArmed(false);
    soundEngine.stopAmbient();
    soundEngine.playTibetanBowl(432);
    triggerCelebration();

    // Trigger Browser Notification
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      try {
        new Notification('🌱 Digital Zen Break Complete — ManasMitra', {
          body: 'Your screen-free pause is complete! You resisted device usage. Return with a refreshed mind.',
          icon: '/favicon.ico',
        });
      } catch (e) {
        console.warn('Could not fire notification', e);
      }
    }

    onBreakCompleted?.();
  };

  const changeSound = (type: 'whitenoise' | 'rain' | 'ocean' | 'zen' | 'off') => {
    setSoundType(type);
    if (type === 'off') {
      soundEngine.stopAmbient();
    } else {
      soundEngine.toggleAmbient(type, soundVolume);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const setPreset = (mins: number) => {
    setDurationMinutes(mins);
    setSecondsLeft(mins * 60);
    setIsRunning(true);
    setCompletedBreak(false);
    setGraceSeconds(5);
    setIsArmed(false);
    setRestartWarning(null);
    soundEngine.playChime('medium');
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Emergency abort: hold down for 5 seconds to unlock
  const handleStartAbort = () => {
    setAbortHoldProgress(0);
    const start = Date.now();
    abortTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(100, Math.round((elapsed / 4500) * 100));
      setAbortHoldProgress(progress);
      if (progress >= 100) {
        clearInterval(abortTimerRef.current);
        soundEngine.stopAmbient();
        onClose();
      }
    }, 100);
  };

  const handleStopAbort = () => {
    if (abortTimerRef.current) {
      clearInterval(abortTimerRef.current);
      abortTimerRef.current = null;
    }
    setAbortHoldProgress(0);
  };

  if (!isOpen) return null;

  const currentTip = tips[tipIndex];
  const TipIcon = currentTip.icon;
  const progressPercent =
    durationMinutes > 0 ? ((durationMinutes * 60 - secondsLeft) / (durationMinutes * 60)) * 100 : 0;

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/98 text-stone-100 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-10 select-none overflow-y-auto animate-in fade-in duration-300"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Top Bar: Focus Lock Status */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xl shadow-xs">
            🌙
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white">Digital Zen Mode</h1>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Strict Screen Lock
              </span>
            </div>
            <p className="text-xs text-stone-400">
              {isArmed
                ? '🔒 No-Touch Detection Active. Using your device will restart the timer.'
                : `⏳ Set your phone down! Arming sensor in ${graceSeconds}s...`}
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          {/* Notification status */}
          <button
            onClick={requestNotification}
            title={
              notificationPermission === 'granted'
                ? 'Browser notifications active'
                : 'Enable browser alerts for timer completion'
            }
            className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-colors ${
              notificationPermission === 'granted'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : 'border-stone-800 bg-stone-900 text-stone-400 hover:text-stone-200'
            }`}
          >
            {notificationPermission === 'granted' ? (
              <Bell className="w-4 h-4 text-emerald-400" />
            ) : (
              <BellOff className="w-4 h-4" />
            )}
            <span className="hidden sm:inline text-[11px]">
              {notificationPermission === 'granted' ? 'Alerts On' : 'Enable Alerts'}
            </span>
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-2 rounded-xl border border-stone-800 bg-stone-900 text-stone-400 hover:text-stone-200 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Exit / Close button (only available if break is completed) */}
          {completedBreak && (
            <button
              onClick={onClose}
              title="Close Zen Mode"
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Center Stage */}
      <div className="flex-1 flex flex-col items-center justify-center my-6 max-w-xl mx-auto w-full text-center space-y-6">
        {!completedBreak ? (
          <>
            {/* Warning Banner if device was used and timer restarted */}
            {restartWarning && (
              <div className="p-3.5 rounded-2xl bg-amber-950/80 border border-amber-600/80 text-amber-200 text-xs font-semibold flex items-center justify-center gap-2 max-w-md w-full animate-in shake duration-300 shadow-lg">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{restartWarning}</span>
              </div>
            )}

            {/* Arming Countdown Pill */}
            {!isArmed && (
              <div className="p-2.5 px-4 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-200 text-xs font-bold inline-flex items-center gap-2 animate-pulse">
                <Smartphone className="w-4 h-4" />
                <span>Put phone down or step back! Lock arms in {graceSeconds}s...</span>
              </div>
            )}

            {/* Visual breathing ring around time */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
              {/* Outer soft ambient pulse */}
              <div
                className={`absolute inset-0 rounded-full bg-emerald-500/10 blur-2xl transition-all duration-1000 ${
                  isRunning ? 'scale-110 opacity-70 animate-pulse' : 'opacity-30'
                }`}
              />

              {/* Progress SVG Ring */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  className="stroke-stone-900"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  className="stroke-emerald-500 transition-all duration-1000"
                  strokeWidth="6"
                  strokeDasharray={2 * Math.PI * 140}
                  strokeDashoffset={(2 * Math.PI * 140) * (1 - progressPercent / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              {/* Central Large Timer Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
                <span className="text-6xl sm:text-7xl font-extralight tracking-tighter font-mono text-white">
                  {formatTime(secondsLeft)}
                </span>
                <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Device Lock Active</span>
                </span>
                <span className="text-[11px] text-stone-500">
                  {restartViolations > 0 ? (
                    <span className="text-amber-400 font-bold">
                      {restartViolations} device touch restart{restartViolations > 1 ? 's' : ''}
                    </span>
                  ) : (
                    'No device interaction permitted'
                  )}
                </span>
              </div>
            </div>

            {/* Step-Away Instruction Banner */}
            <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800/80 max-w-md w-full space-y-1.5 backdrop-blur-xs">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-400">
                <TipIcon className="w-4 h-4" />
                <span>{currentTip.title}</span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed font-serif-accent italic">
                “{currentTip.desc}”
              </p>
            </div>

            {/* Lockout Notice & Emergency Cancel Button */}
            <div className="space-y-2 max-w-sm w-full">
              <p className="text-[11px] text-stone-500 font-medium">
                🔒 You are locked out of other work until 00:00 to protect your nervous system.
              </p>

              {/* Emergency Override Button: must be held down for 5 seconds to prevent impulsive clicks */}
              <button
                type="button"
                onMouseDown={handleStartAbort}
                onMouseUp={handleStopAbort}
                onTouchStart={handleStartAbort}
                onTouchEnd={handleStopAbort}
                className="relative overflow-hidden w-full py-2.5 rounded-xl border border-stone-800 bg-stone-900/60 hover:bg-stone-900 text-stone-400 text-xs font-semibold transition-all"
              >
                {/* Hold progress bar fill */}
                <div
                  className="absolute inset-y-0 left-0 bg-rose-900/60 transition-all duration-100"
                  style={{ width: `${abortHoldProgress}%` }}
                />
                <span className="relative z-10">
                  {abortHoldProgress > 0
                    ? `Holding to abort (${abortHoldProgress}%)...`
                    : 'Emergency Override (Hold for 5s to Cancel)'}
                </span>
              </button>
            </div>
          </>
        ) : (
          /* Break Completed State (Unlocks everything!) */
          <div className="p-8 rounded-3xl bg-stone-900 border border-emerald-500/40 text-center space-y-4 max-w-md w-full animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-emerald-500/10">
              <Unlock className="w-8 h-8 text-emerald-400" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">Focus Break Complete!</h2>
              <p className="text-xs text-stone-300 leading-relaxed">
                You successfully honored your screen-free commitment without device distraction! You are now free to resume work with clarity.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 text-xs text-emerald-300 font-bold">
              ✨ Screen-Free Habit Checked Off (+1 Streak)
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs shadow-lg transition-all"
            >
              Unlock Screen & Resume Work
            </button>
          </div>
        )}
      </div>

      {/* Bottom Configuration Bar: Presets & Audio Tuning */}
      <div className="max-w-5xl mx-auto w-full pt-4 border-t border-stone-900 shrink-0 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Preset scheduled duration buttons */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mr-1">
              Duration:
            </span>
            {[
              { mins: 5, label: '5m Eye Rest' },
              { mins: 10, label: '10m Screen-Free' },
              { mins: 15, label: '15m Deep Rest' },
              { mins: 20, label: '20m Walk' },
            ].map((p) => (
              <button
                key={p.mins}
                onClick={() => setPreset(p.mins)}
                disabled={isArmed && !completedBreak}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  durationMinutes === p.mins
                    ? 'bg-emerald-500 text-stone-950 font-bold shadow-xs'
                    : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200 disabled:opacity-50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* White Noise Audio & Soundscape Controls */}
          <div className="flex items-center gap-2 bg-stone-900/90 p-1.5 rounded-2xl border border-stone-800">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider ml-1">
              White Noise:
            </span>

            {[
              { id: 'whitenoise', label: '🌬️ White Noise' },
              { id: 'rain', label: '🌧️ Rain' },
              { id: 'ocean', label: '🌊 Ocean' },
              { id: 'zen', label: '🧘 432Hz' },
              { id: 'off', label: '🔇 Off' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => changeSound(s.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  soundType === s.id
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center text-[10px] text-stone-600">
          Digital Zen Mode enforces total device detachment under SDG 3. Stepping away protects your vision and mental stamina.
        </div>
      </div>
    </div>
  );
};
