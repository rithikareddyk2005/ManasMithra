export type ThemeId = 'emerald' | 'midnight' | 'amber' | 'ocean' | 'lavender';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  emoji: string;
  tagline: string;
  isDark: boolean;
  navClass: string;
  navContainerClass: string;
  navTextClass: string;
  badgeClass: string;
  primaryButtonClass: string;
  bannerGradient: string;
  bannerBadgeClass: string;
  heroButtonClass: string;
  activeTabClass: string;
  inactiveTabClass: string;
  accentColor: string;
  cardClass: string;
  borderClass: string;
  footerClass: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  emerald: {
    id: 'emerald',
    name: 'Emerald Zen',
    emoji: '🌿',
    tagline: 'Botanical balance & natural vitality (SDG 3 default)',
    isDark: false,
    navClass: 'bg-white/95 border-b border-stone-200 text-stone-800',
    navContainerClass: 'bg-white/95 border-stone-200',
    navTextClass: 'text-stone-800',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    primaryButtonClass: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/20',
    bannerGradient: 'from-emerald-800 via-teal-800 to-emerald-950',
    bannerBadgeClass: 'bg-emerald-400 text-emerald-950',
    heroButtonClass: 'bg-white text-emerald-900 hover:bg-emerald-50',
    activeTabClass: 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-200/80',
    inactiveTabClass: 'text-stone-600 hover:text-stone-900 hover:bg-stone-100',
    accentColor: '#059669',
    cardClass: 'bg-white border-stone-200',
    borderClass: 'border-stone-200',
    footerClass: 'bg-white/80 border-stone-200 text-stone-500',
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Calm',
    emoji: '🌙',
    tagline: 'Deep OLED night shield, starry slate & zero eye strain',
    isDark: true,
    navClass: 'bg-slate-900/95 border-b border-slate-800 text-slate-100',
    navContainerClass: 'bg-slate-900/95 border-slate-800',
    navTextClass: 'text-slate-100',
    badgeClass: 'bg-indigo-950 text-indigo-300 border-indigo-700/60',
    primaryButtonClass: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/50',
    bannerGradient: 'from-slate-950 via-indigo-950 to-slate-900 border border-indigo-900/40',
    bannerBadgeClass: 'bg-indigo-400 text-indigo-950',
    heroButtonClass: 'bg-indigo-500 text-white hover:bg-indigo-400 shadow-lg shadow-indigo-950/60',
    activeTabClass: 'bg-indigo-950/90 text-indigo-200 shadow-sm border border-indigo-700/80',
    inactiveTabClass: 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70',
    accentColor: '#6366f1',
    cardClass: 'bg-slate-900 border-slate-800 text-slate-100',
    borderClass: 'border-slate-800',
    footerClass: 'bg-slate-950/90 border-slate-800 text-slate-400',
  },
  amber: {
    id: 'amber',
    name: 'Sunset Amber',
    emoji: '🌅',
    tagline: 'Warm golden hearth, cozy terracotta & grounding comfort',
    isDark: false,
    navClass: 'bg-amber-50/95 border-b border-amber-200/80 text-stone-900',
    navContainerClass: 'bg-amber-50/95 border-amber-200',
    navTextClass: 'text-stone-900',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    primaryButtonClass: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-700/20',
    bannerGradient: 'from-amber-900 via-orange-950 to-stone-900 border border-amber-900/40',
    bannerBadgeClass: 'bg-amber-400 text-amber-950',
    heroButtonClass: 'bg-amber-100 text-amber-950 hover:bg-amber-200',
    activeTabClass: 'bg-amber-100 text-amber-900 shadow-sm border border-amber-300',
    inactiveTabClass: 'text-stone-600 hover:text-amber-900 hover:bg-amber-100/60',
    accentColor: '#d97706',
    cardClass: 'bg-amber-50/40 border-amber-200/80',
    borderClass: 'border-amber-200',
    footerClass: 'bg-amber-100/50 border-amber-200 text-amber-900',
  },
  ocean: {
    id: 'ocean',
    name: 'Oceanic Serenity',
    emoji: '🌊',
    tagline: 'Cool coastal turquoise & deep sea tranquility for panic relief',
    isDark: false,
    navClass: 'bg-cyan-50/95 border-b border-cyan-200/80 text-stone-900',
    navContainerClass: 'bg-cyan-50/95 border-cyan-200',
    navTextClass: 'text-stone-900',
    badgeClass: 'bg-cyan-100 text-cyan-900 border-cyan-300',
    primaryButtonClass: 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-700/20',
    bannerGradient: 'from-cyan-950 via-teal-900 to-blue-950 border border-cyan-900/40',
    bannerBadgeClass: 'bg-cyan-400 text-cyan-950',
    heroButtonClass: 'bg-cyan-100 text-cyan-950 hover:bg-cyan-200',
    activeTabClass: 'bg-cyan-100 text-cyan-900 shadow-sm border border-cyan-300',
    inactiveTabClass: 'text-stone-600 hover:text-cyan-900 hover:bg-cyan-100/60',
    accentColor: '#0891b2',
    cardClass: 'bg-cyan-50/40 border-cyan-200/80',
    borderClass: 'border-cyan-200',
    footerClass: 'bg-cyan-100/50 border-cyan-200 text-cyan-900',
  },
  lavender: {
    id: 'lavender',
    name: 'Lavender Peace',
    emoji: '🌸',
    tagline: 'Soft lilac & rose quartz for self-compassion & emotional healing',
    isDark: false,
    navClass: 'bg-purple-50/95 border-b border-purple-200/80 text-stone-900',
    navContainerClass: 'bg-purple-50/95 border-purple-200',
    navTextClass: 'text-stone-900',
    badgeClass: 'bg-purple-100 text-purple-900 border-purple-300',
    primaryButtonClass: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-700/20',
    bannerGradient: 'from-purple-950 via-rose-950 to-indigo-950 border border-purple-900/40',
    bannerBadgeClass: 'bg-purple-300 text-purple-950',
    heroButtonClass: 'bg-purple-100 text-purple-950 hover:bg-purple-200',
    activeTabClass: 'bg-purple-100 text-purple-900 shadow-sm border border-purple-300',
    inactiveTabClass: 'text-stone-600 hover:text-purple-900 hover:bg-purple-100/60',
    accentColor: '#9333ea',
    cardClass: 'bg-purple-50/40 border-purple-200/80',
    borderClass: 'border-purple-200',
    footerClass: 'bg-purple-100/50 border-purple-200 text-purple-900',
  },
};

export const getStoredTheme = (): ThemeId => {
  const saved = localStorage.getItem('manasmitra_theme');
  return (saved as ThemeId) || 'emerald';
};

export const setStoredTheme = (theme: ThemeId): void => {
  localStorage.setItem('manasmitra_theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
  if (theme === 'midnight') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

