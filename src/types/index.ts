export type MoodType = 'great' | 'good' | 'okay' | 'low' | 'difficult';
export type EnergyType = 'high' | 'medium' | 'low';
export type SleepQualityType = 'poor' | 'average' | 'good';
export type ActivityLevelType = 'none' | 'some' | 'active';
export type SocialConnectionType = 'connected' | 'neutral' | 'isolated';

export interface CheckInRecord {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  mood: MoodType;
  energy: EnergyType;
  sleepQuality: SleepQualityType;
  sleepHours: number;
  activityLevel: ActivityLevelType;
  activityMinutes: number;
  waterGlasses: number;
  socialConnection: SocialConnectionType;
  notes?: string;
  gratitudeNote?: string;
  calculatedScore: number; // 0 - 100
  breakdown: {
    emotional: number;
    rest: number;
    activity: number;
    habits: number;
    connection: number;
  };
}

export type HabitCategory = 'mental' | 'rest' | 'physical' | 'hydration' | 'social' | 'mindful';

export interface HabitItem {
  id: string;
  title: string;
  description: string;
  category: HabitCategory;
  pillar: 'Mental Awareness' | 'Emotional Well-Being' | 'Healthy Habits' | 'Social Well-Being' | 'Preventive Support';
  completed: boolean;
  streak: number;
  targetUnit?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  suggestedActions?: Array<{ label: string; action: string }>;
}

export interface PersonalizedRecommendation {
  headline: string;
  recommendation: string;
  suggestedActivity: 'breathing' | 'grounding' | 'reframe' | 'gratitude' | 'stretch';
  pillar: string;
}

export interface PreventiveObservation {
  hasPattern: boolean;
  trendType: 'dip' | 'improving' | 'stable';
  summary: string;
  preventiveTip: string;
}

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  readTime: string;
  summary: string;
  content: string[];
  sdgTag: string;
  keyTakeaway: string;
}

export interface KindnessAct {
  id: string;
  title: string;
  category: 'emotional' | 'practical' | 'community' | 'gratitude' | 'quiet';
  recipient: string;
  notes?: string;
  timestamp: number;
  dateStr: string;
}
