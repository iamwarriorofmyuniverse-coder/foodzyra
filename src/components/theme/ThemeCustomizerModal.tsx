import React from 'react';
import {
  Palette,
  Sun,
  Moon,
  Monitor,
  Check,
  RotateCcw,
  X,
  Sparkles,
  LayoutGrid,
  ShieldCheck
} from 'lucide-react';
import { useTheme, THEME_PRESETS_META, ThemePreset, ThemeMode, RadiusStyle } from '../../context/ThemeContext';

export const ThemeCustomizerModal: React.FC = () => {
  const { config, setPreset, setMode, setRadius, isCustomizerOpen, setIsCustomizerOpen, resetTheme } = useTheme();

  if (!isCustomizerOpen) return null;

  const presetsList = Object.entries(THEME_PRESETS_META) as [ThemePreset, typeof THEME_PRESETS_META[ThemePreset]][];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-forest-800 to-forest-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Palette className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display tracking-tight flex items-center gap-2">
                Foodzyra Theme & Appearance Studio
              </h3>
              <p className="text-xs text-forest-100">
                Customize brand accent palettes, corner geometry, and visual theme mode
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCustomizerOpen(false)}
            className="p-2 text-forest-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          
          {/* Section 1: Color Palettes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-forest-600" />
                Color Palette Presets
              </label>
              <span className="text-xs text-slate-500">Live preview active</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {presetsList.map(([key, meta]) => {
                const isSelected = config.preset === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPreset(key)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3.5 ${
                      isSelected
                        ? 'border-forest-600 bg-forest-50/50 dark:bg-forest-950/30 ring-2 ring-forest-500/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-850'
                    }`}
                  >
                    {/* Dual-tone color badge */}
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-inner border border-slate-200 shrink-0 flex">
                      <div
                        className="w-1/2 h-full"
                        style={{ backgroundColor: meta.previewColor }}
                      />
                      <div
                        className="w-1/2 h-full"
                        style={{ backgroundColor: meta.secondaryColor }}
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs font-bold truncate ${isSelected ? 'text-forest-900 dark:text-forest-200' : 'text-slate-900 dark:text-slate-200'}`}>
                          {meta.name}
                        </p>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{meta.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Appearance Mode (Light / Dark / System) */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              Theme Mode
            </label>

            <div className="grid grid-cols-3 gap-3">
              {[
                { mode: 'light' as ThemeMode, label: 'Light', icon: Sun },
                { mode: 'dark' as ThemeMode, label: 'Dark', icon: Moon },
                { mode: 'system' as ThemeMode, label: 'System Auto', icon: Monitor }
              ].map(opt => {
                const Icon = opt.icon;
                const isSelected = config.mode === opt.mode;
                return (
                  <button
                    key={opt.mode}
                    type="button"
                    onClick={() => setMode(opt.mode)}
                    className={`py-3 px-4 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-2 transition-all ${
                      isSelected
                        ? 'border-forest-600 bg-forest-50 dark:bg-forest-950/40 text-forest-900 dark:text-forest-200 ring-2 ring-forest-500/20'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Corner Geometry & Radius */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
              <LayoutGrid className="w-3.5 h-3.5 text-blue-500" />
              Corner Curvature
            </label>

            <div className="grid grid-cols-3 gap-3">
              {[
                { radius: 'sharp' as RadiusStyle, label: 'Crisp Sharp', sample: 'rounded-md' },
                { radius: 'rounded' as RadiusStyle, label: 'Modern Balanced', sample: 'rounded-2xl' },
                { radius: 'pill' as RadiusStyle, label: 'Organic Pill', sample: 'rounded-3xl' }
              ].map(opt => {
                const isSelected = config.radius === opt.radius;
                return (
                  <button
                    key={opt.radius}
                    type="button"
                    onClick={() => setRadius(opt.radius)}
                    className={`py-3 px-3 rounded-2xl border text-xs font-semibold text-center transition-all ${
                      isSelected
                        ? 'border-forest-600 bg-forest-50 dark:bg-forest-950/40 text-forest-900 dark:text-forest-200 ring-2 ring-forest-500/20'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className={`w-8 h-4 mx-auto mb-1.5 bg-slate-300 dark:bg-slate-700 border border-slate-400 ${opt.sample}`} />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Theme Accent Preview</span>
            <div className="flex flex-wrap items-center gap-2">
              <button className="px-3 py-1.5 bg-forest-600 text-white text-xs font-bold rounded-xl shadow-xs">
                Primary Button
              </button>
              <span className="px-2.5 py-1 bg-forest-100 text-forest-800 text-xs font-semibold rounded-full border border-forest-200">
                Active Category Pill
              </span>
              <span className="text-xs font-bold text-forest-700">
                $4.50 Surplus Deal
              </span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={resetTheme}
            className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1.5 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Default Eco Green
          </button>

          <button
            type="button"
            onClick={() => setIsCustomizerOpen(false)}
            className="px-5 py-2 bg-forest-600 hover:bg-forest-700 text-white font-bold rounded-xl shadow-sm transition-colors"
          >
            Save & Apply
          </button>
        </div>

      </div>
    </div>
  );
};
