import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Calendar,
  MessageSquareHeart,
  CheckSquare,
  Activity,
  Users,
  BookOpen,
  TrendingUp,
  Globe2,
  LifeBuoy,
  Volume2,
  VolumeX,
  Menu,
  X,
  Sun,
  ShieldAlert,
  ShieldCheck,
  Palette,
  Brain,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

import { THEMES, ThemeId } from '../utils/theme';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCheckIn: () => void;
  onOpenCrisisModal: () => void;
  onOpenZenMode: () => void;
  onOpenThemeSelector: () => void;
  currentTheme?: ThemeId;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCheckIn,
  onOpenCrisisModal,
  onOpenZenMode,
  onOpenThemeSelector,
  currentTheme = 'emerald',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ambientPlaying, setAmbientPlaying] = useState(false);
  const [ambientType, setAmbientType] = useState<'rain' | 'ocean' | 'zen'>('zen');
  const [soundMenuOpen, setSoundMenuOpen] = useState(false);

  const theme = THEMES[currentTheme] || THEMES.emerald;

  const toggleSound = (type: 'rain' | 'ocean' | 'zen') => {
    setAmbientType(type);
    const isPlaying = soundEngine.toggleAmbient(type, 0.12);
    setAmbientPlaying(isPlaying);
    setSoundMenuOpen(false);
  };

  const stopAllSound = () => {
    soundEngine.stopAmbient();
    setAmbientPlaying(false);
    setSoundMenuOpen(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Sparkles },
    { id: 'solutions', label: 'Mental Solutions 🧠', icon: Brain },
    { id: 'body-scan', label: 'Body Scan 🧘', icon: Activity },
    { id: 'blueprint', label: 'Safety Net 🛡️', icon: ShieldCheck },
    { id: 'kindness', label: 'Kindness ❤️', icon: Heart },
    { id: 'sanctuary', label: 'Zen Sanctuary 🏮', icon: Sparkles },
    { id: 'companion', label: 'AI Companion', icon: MessageSquareHeart },
    { id: 'habits', label: 'Habits & Life', icon: CheckSquare },
    { id: 'activities', label: 'Activities', icon: Activity },
    { id: 'social', label: 'Social Health', icon: Users },
    { id: 'education', label: 'Knowledge Hub', icon: BookOpen },
    { id: 'progress', label: 'Trends & Analysis', icon: TrendingUp },
    { id: 'sdg-impact', label: 'SDG 3 Impact', icon: Globe2 },
  ];

  return (
    <header className={`sticky top-0 z-40 ${theme.isDark ? 'bg-slate-900/95 border-b border-slate-800 text-slate-100' : 'bg-white/90 border-b border-stone-200'} backdrop-blur-md transition-colors duration-200`}>
      {/* Top SDG 3 Banner */}
      <div className={`bg-gradient-to-r ${theme.bannerGradient} text-white text-xs px-4 py-1.5 flex items-center justify-between font-medium shadow-inner transition-all duration-300`}>
        <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${theme.bannerBadgeClass} shadow-xs`}>
            UN SDG 3
          </span>
          <span className="truncate">
            Good Health & Well-Being • <em>“Understand Your Mind. Nurture Your Well-Being.”</em>
          </span>
          <span className="ml-auto hidden md:inline-flex items-center gap-1.5 text-white/80 text-[11px]">
            <Heart className="w-3.5 h-3.5 text-rose-300 fill-rose-300" /> Preventive Care Prototype
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105 ${
                  theme.id === 'midnight'
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-700 shadow-indigo-950/60'
                    : theme.id === 'amber'
                    ? 'bg-gradient-to-br from-amber-500 to-orange-700 shadow-amber-700/20'
                    : theme.id === 'ocean'
                    ? 'bg-gradient-to-br from-cyan-500 to-teal-700 shadow-cyan-700/20'
                    : theme.id === 'lavender'
                    ? 'bg-gradient-to-br from-purple-500 to-pink-600 shadow-purple-700/20'
                    : 'bg-gradient-to-br from-emerald-500 to-teal-700 shadow-emerald-700/20'
                }`}
              >
                <span className="text-xl">{theme.emoji}</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className={`font-bold text-lg tracking-tight ${theme.isDark ? 'text-white' : 'text-stone-900'} group-hover:opacity-90 transition-colors`}>
                    ManasMitra AI
                  </span>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${theme.badgeClass}`}>
                    SDG 3
                  </span>
                </div>
                <p className={`text-[11px] font-medium ${theme.isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                  Personal Well-Being Companion
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive ? theme.activeTabClass : theme.inactiveTabClass
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? '' : theme.isDark ? 'text-slate-500' : 'text-stone-400'}`} style={isActive ? { color: theme.accentColor } : {}} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            {/* Ambient Sound Controller */}
            <div className="relative">
              <button
                onClick={() => setSoundMenuOpen(!soundMenuOpen)}
                title="Relaxing ambient sounds"
                className={`p-2 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                  ambientPlaying
                    ? theme.isDark
                      ? 'bg-indigo-950 border-indigo-700 text-indigo-300'
                      : 'bg-teal-50 border-teal-300 text-teal-700 shadow-xs'
                    : theme.isDark
                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                {ambientPlaying ? (
                  <>
                    <Volume2 className="w-4 h-4 animate-pulse" style={{ color: theme.accentColor }} />
                    <span className="hidden sm:inline capitalize">{ambientType} sound</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 text-stone-400" />
                    <span className="hidden sm:inline">Calm Audio</span>
                  </>
                )}
              </button>

              {soundMenuOpen && (
                <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg border py-1.5 z-50 animate-in fade-in slide-in-from-top-1 text-xs ${theme.isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-stone-200'}`}>
                  <div className={`px-3 py-1 font-semibold uppercase tracking-wider text-[10px] ${theme.isDark ? 'text-slate-400' : 'text-stone-400'}`}>
                    Ambient Atmosphere
                  </div>
                  <button
                    onClick={() => toggleSound('zen')}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between ${
                      ambientPlaying && ambientType === 'zen' ? (theme.isDark ? 'text-indigo-300 font-bold bg-indigo-950/60' : 'text-emerald-700 font-bold bg-emerald-50/50') : (theme.isDark ? 'hover:bg-slate-800' : 'hover:bg-stone-50')
                    }`}
                  >
                    <span>🧘 432Hz Zen Tone</span>
                    {ambientPlaying && ambientType === 'zen' && <span className="text-[10px] text-emerald-500">Playing</span>}
                  </button>
                  <button
                    onClick={() => toggleSound('rain')}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between ${
                      ambientPlaying && ambientType === 'rain' ? (theme.isDark ? 'text-indigo-300 font-bold bg-indigo-950/60' : 'text-emerald-700 font-bold bg-emerald-50/50') : (theme.isDark ? 'hover:bg-slate-800' : 'hover:bg-stone-50')
                    }`}
                  >
                    <span>🌧️ Gentle Rainfall</span>
                    {ambientPlaying && ambientType === 'rain' && <span className="text-[10px] text-emerald-500">Playing</span>}
                  </button>
                  <button
                    onClick={() => toggleSound('ocean')}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between ${
                      ambientPlaying && ambientType === 'ocean' ? (theme.isDark ? 'text-indigo-300 font-bold bg-indigo-950/60' : 'text-emerald-700 font-bold bg-emerald-50/50') : (theme.isDark ? 'hover:bg-slate-800' : 'hover:bg-stone-50')
                    }`}
                  >
                    <span>🌊 Coastal Surf</span>
                    {ambientPlaying && ambientType === 'ocean' && <span className="text-[10px] text-emerald-500">Playing</span>}
                  </button>
                  {ambientPlaying && (
                    <div className={`border-t mt-1 pt-1 ${theme.isDark ? 'border-slate-800' : 'border-stone-100'}`}>
                      <button
                        onClick={stopAllSound}
                        className="w-full text-left px-3 py-1.5 text-rose-500 hover:bg-rose-950/30 font-medium"
                      >
                        Mute soundscape
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Digital Zen Mode Button */}
            <button
              onClick={onOpenZenMode}
              title="Activate Digital Zen Mode (Screen-Free Timer & White Noise)"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-100 font-bold text-xs shadow-xs transition-all hover:scale-102 border border-stone-800"
            >
              <span>🌙</span>
              <span className="hidden md:inline">Zen Mode</span>
            </button>

            {/* Atmosphere Theme Selector Button */}
            <button
              onClick={onOpenThemeSelector}
              title={`Active Atmosphere: ${theme.name} — Click to switch interface theme`}
              className={`inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg border text-xs font-semibold transition-all hover:scale-102 ${
                theme.isDark
                  ? 'bg-slate-800 border-slate-700 text-indigo-300 hover:bg-slate-750'
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Palette className="w-4 h-4" style={{ color: theme.accentColor }} />
              <span className="text-xs">{theme.emoji}</span>
              <span className="hidden lg:inline text-[11px] font-bold">{theme.name.split(' ')[0]}</span>
            </button>

            {/* Quick Daily Check-In CTA */}
            <button
              onClick={onOpenCheckIn}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg ${theme.primaryButtonClass} font-semibold text-xs shadow-sm hover:shadow transition-all`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Daily Check-In
            </button>

            {/* Support / Safety Button */}
            <button
              onClick={onOpenCrisisModal}
              title="Crisis & Helplines"
              className="p-2 rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
            >
              <LifeBuoy className="w-4 h-4" />
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`xl:hidden p-2 rounded-lg ${theme.isDark ? 'text-slate-200 hover:bg-slate-800' : 'text-stone-600 hover:bg-stone-100'}`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className={`xl:hidden border-t px-4 pt-3 pb-6 space-y-1.5 shadow-lg ${theme.isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-stone-200'}`}>
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => {
                onOpenCheckIn();
                setMobileMenuOpen(false);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg ${theme.primaryButtonClass} font-semibold text-xs shadow-sm`}
            >
              <Calendar className="w-4 h-4" />
              Daily Check-In
            </button>
            <button
              onClick={() => {
                onOpenZenMode();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-stone-900 text-white font-semibold text-xs shadow-sm"
            >
              <span>🌙</span>
              Zen Mode
            </button>
            <button
              onClick={() => {
                onOpenThemeSelector();
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg border flex items-center justify-center ${theme.isDark ? 'bg-slate-800 border-slate-700 text-indigo-300' : 'border-stone-200 bg-stone-50 text-stone-700'}`}
              title="Themes"
            >
              <Palette className="w-4 h-4" style={{ color: theme.accentColor }} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-left ${
                    isActive
                      ? theme.activeTabClass
                      : theme.isDark
                      ? 'text-slate-300 hover:bg-slate-800'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" style={isActive ? { color: theme.accentColor } : {}} />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className={`pt-2 border-t flex items-center justify-between text-xs ${theme.isDark ? 'border-slate-800 text-slate-400' : 'border-stone-100 text-stone-500'}`}>
            <button
              onClick={() => {
                onOpenCrisisModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 text-rose-500 font-semibold"
            >
              <LifeBuoy className="w-4 h-4" /> 24/7 Helpline Directory
            </button>
            <span>SDG Target 3.4</span>
          </div>
        </div>
      )}
    </header>
  );
};
