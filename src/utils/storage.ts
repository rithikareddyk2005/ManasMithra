import confetti from 'canvas-confetti';
import { CheckInRecord, HabitItem, PreventiveObservation } from '../types';
import { INITIAL_HABITS, INITIAL_HISTORY } from '../data/mockData';

const STORAGE_KEYS = {
  CHECK_INS: 'manasmitra_checkins_v1',
  HABITS: 'manasmitra_habits_v1',
  CHAT_MESSAGES: 'manasmitra_chat_v1',
  USER_NAME: 'manasmitra_username_v1',
};

export const getStoredUserName = (): string => {
  return localStorage.getItem(STORAGE_KEYS.USER_NAME) || 'Rithu';
};

export const setStoredUserName = (name: string): void => {
  localStorage.setItem(STORAGE_KEYS.USER_NAME, name);
};

export const loadCheckIns = (): CheckInRecord[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CHECK_INS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(INITIAL_HISTORY));
      return INITIAL_HISTORY;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse stored check-ins', e);
    return INITIAL_HISTORY;
  }
};

export const saveCheckIn = (record: CheckInRecord): CheckInRecord[] => {
  const current = loadCheckIns();
  // Filter out any existing record for same date
  const filtered = current.filter((c) => c.date !== record.date);
  const updated = [record, ...filtered].sort((a, b) => b.timestamp - a.timestamp);
  localStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(updated));
  return updated;
};

export const loadHabits = (): HabitItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HABITS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(INITIAL_HABITS));
      return INITIAL_HABITS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse habits', e);
    return INITIAL_HABITS;
  }
};

export const saveHabits = (habits: HabitItem[]): void => {
  localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
};

export const calculateWellBeingScore = (
  record: Partial<CheckInRecord>,
  habitsRatio: number
): {
  score: number;
  breakdown: { emotional: number; rest: number; activity: number; habits: number; connection: number };
} => {
  // Emotional score (0 - 100)
  let emotional = 70;
  if (record.mood === 'great') emotional = 95;
  else if (record.mood === 'good') emotional = 82;
  else if (record.mood === 'okay') emotional = 62;
  else if (record.mood === 'low') emotional = 44;
  else if (record.mood === 'difficult') emotional = 28;

  // Energy adjustment
  if (record.energy === 'high') emotional = Math.min(100, emotional + 5);
  else if (record.energy === 'low') emotional = Math.max(20, emotional - 8);

  // Rest score (0 - 100)
  let rest = 70;
  const sleepHours = record.sleepHours ?? 7;
  if (sleepHours >= 7 && sleepHours <= 9) {
    rest = record.sleepQuality === 'good' ? 95 : record.sleepQuality === 'average' ? 78 : 58;
  } else if (sleepHours >= 6) {
    rest = record.sleepQuality === 'good' ? 78 : 65;
  } else {
    rest = 45;
  }

  // Physical Activity score (0 - 100)
  let activity = 70;
  const mins = record.activityMinutes ?? 20;
  if (mins >= 35 || record.activityLevel === 'active') activity = 90;
  else if (mins >= 20 || record.activityLevel === 'some') activity = 75;
  else if (mins >= 10) activity = 60;
  else activity = 45;

  // Habits score (0 - 100)
  const habitsScore = Math.round(Math.min(100, habitsRatio * 100));

  // Connection score (0 - 100)
  let connection = 75;
  if (record.socialConnection === 'connected') connection = 88;
  else if (record.socialConnection === 'neutral') connection = 70;
  else if (record.socialConnection === 'isolated') connection = 45;

  // Weighted total:
  // Emotional: 28%, Rest: 22%, Activity: 20%, Habits: 15%, Connection: 15%
  const total = Math.round(
    emotional * 0.28 + rest * 0.22 + activity * 0.2 + habitsScore * 0.15 + connection * 0.15
  );

  return {
    score: Math.min(100, Math.max(10, total)),
    breakdown: {
      emotional: Math.round(emotional),
      rest: Math.round(rest),
      activity: Math.round(activity),
      habits: Math.round(habitsScore),
      connection: Math.round(connection),
    },
  };
};

export const detectPreventivePattern = (history: CheckInRecord[]): PreventiveObservation => {
  if (!history || history.length < 3) {
    return {
      hasPattern: false,
      trendType: 'stable',
      summary: 'Your daily check-in habits establish strong personal self-awareness.',
      preventiveTip: 'Keep observing your energy and rest patterns each morning.',
    };
  }

  // Take the latest 3 days and compare with earlier days
  const recent = history.slice(0, 3);
  const avgRecentSleep = recent.reduce((sum, r) => sum + r.sleepHours, 0) / recent.length;
  const lowMoodCount = recent.filter((r) => r.mood === 'low' || r.mood === 'difficult').length;
  const isolatedCount = recent.filter((r) => r.socialConnection === 'isolated').length;
  const avgActivity = recent.reduce((sum, r) => sum + r.activityMinutes, 0) / recent.length;

  if (lowMoodCount >= 2 || avgRecentSleep < 6.2) {
    return {
      hasPattern: true,
      trendType: 'dip',
      summary:
        "We noticed that your recent check-ins show lower sleep hours and lighter energy than your baseline.",
      preventiveTip:
        'Consider a gentle 15-minute wind-down without screens tonight, and try a 2-minute box breathing reset before dinner.',
    };
  }

  if (isolatedCount >= 2) {
    return {
      hasPattern: true,
      trendType: 'dip',
      summary:
        'Your logs suggest you have felt a bit more isolated over recent days.',
      preventiveTip:
        'Social well-being is vital for emotional balance. Reaching out with a simple 1-minute text to a friend can provide meaningful relief.',
    };
  }

  if (avgActivity < 15) {
    return {
      hasPattern: true,
      trendType: 'dip',
      summary:
        'Your movement logs have been quieter over the past couple of days.',
      preventiveTip:
        'A short 10-minute walk or gentle spinal stretching will help release physical tension and refresh your mind.',
    };
  }

  return {
    hasPattern: false,
    trendType: 'stable',
    summary:
      'Your well-being metrics show steady balance across rest, habits, and emotional connection.',
    preventiveTip:
      'Continue drinking water consistently and protecting your peaceful bedtime routine.',
  };
};

export const triggerCelebration = () => {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.75 },
      colors: ['#10b981', '#06b6d4', '#6366f1', '#fbbf24'],
    });
  } catch (e) {
    // fallback gracefully
  }
};
