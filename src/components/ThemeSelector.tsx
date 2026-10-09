import React, { useState } from 'react';
import { Palette, Check, Sparkles, X } from 'lucide-react';
import { THEMES, ThemeId } from '../utils/theme';
import { soundEngine } from '../utils/audio';

interface ThemeSelectorProps {
  currentTheme: ThemeId;
  onSelectTheme: (themeId: ThemeId) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onSelectTheme,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const activeThemeConfig = THEMES[currentTheme] || THEMES.emerald;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className={`rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border space-y-5 animate-in fade-in zoom-in-95 duration-200 ${
        activeThemeConfig.isDark
          ? 'bg-slate-900 border-slate-700 text-slate-100'
          : 'bg-white border-stone-200 text-stone-900'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-xs"
              style={{ backgroundColor: `${activeThemeConfig.accentColor}20` }}
            >
              <span>{activeThemeConfig.emoji}</span>
            </div>
            <div>
              <h3 className={`font-bold text-base ${activeThemeConfig.isDark ? 'text-white' : 'text-stone-900'}`}>
                Atmospheric Themes
              </h3>
              <p className={`text-xs ${activeThemeConfig.isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                Change the whole interface visual & sensory atmosphere.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors ${
              activeThemeConfig.isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-stone-100 text-stone-400 hover:text-stone-700'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Themes Grid */}
        <div className="space-y-2.5">
          {(Object.keys(THEMES) as ThemeId[]).map((key) => {
            const theme = THEMES[key];
            const isSelected = currentTheme === key;
            return (
              <button
                key={key}
                onClick={() => {
                  soundEngine.playChime('medium');
                  onSelectTheme(key);
                }}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? activeThemeConfig.isDark
                      ? 'border-indigo-500 bg-indigo-950/70 shadow-md ring-2 ring-indigo-500/30'
                      : 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-2 ring-emerald-500/20'
                    : activeThemeConfig.isDark
                    ? 'border-slate-800 hover:border-slate-700 bg-slate-800/40 text-slate-300'
                    : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 text-stone-700'
                }`}
                style={isSelected ? { borderColor: theme.accentColor } : {}}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{theme.emoji}</span>
                  <div>
                    <div className="font-bold text-xs sm:text-sm flex items-center gap-2">
                      <span className={activeThemeConfig.isDark ? 'text-white' : 'text-stone-900'}>
                        {theme.name}
                      </span>
                      {theme.isDark && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-slate-950 text-indigo-200 border border-indigo-900">
                          Dark Mode
                        </span>
                      )}
                      {isSelected && (
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.2 rounded-full text-white"
                          style={{ backgroundColor: theme.accentColor }}
                        >
                          Active
                        </span>
                      )}
                    </div>
                    <div className={`text-[11px] ${activeThemeConfig.isDark ? 'text-slate-400' : 'text-stone-500'}`}>
                      {theme.tagline}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Color Swatch */}
                  <span
                    className="w-5 h-5 rounded-full border shadow-xs"
                    style={{ backgroundColor: theme.accentColor, borderColor: `${theme.accentColor}40` }}
                  />
                  {isSelected && <Check className="w-4 h-4" style={{ color: theme.accentColor }} />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-2 flex items-center justify-between">
          <span className={`text-[11px] ${activeThemeConfig.isDark ? 'text-slate-400' : 'text-stone-500'}`}>
            Atmosphere: <strong>{activeThemeConfig.name}</strong>
          </span>
          <button
            onClick={onClose}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeThemeConfig.isDark
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                : 'bg-stone-900 hover:bg-stone-800 text-white'
            }`}
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};

