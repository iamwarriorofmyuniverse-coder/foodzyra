import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemePreset =
  | 'emerald'     // Default Eco Green
  | 'ocean'       // Marine & Cyan
  | 'sunset'      // Amber & Gold
  | 'indigo'      // Royal Indigo & Violet
  | 'rose'        // Berry Rose & Coral
  | 'teal'        // Nordic Teal & Mint
  | 'earth';      // Warm Terracotta & Clay

export type ThemeMode = 'light' | 'dark' | 'system';
export type RadiusStyle = 'sharp' | 'rounded' | 'pill';

export interface ThemeConfig {
  preset: ThemePreset;
  mode: ThemeMode;
  radius: RadiusStyle;
}

interface ThemeContextType {
  config: ThemeConfig;
  setPreset: (preset: ThemePreset) => void;
  setMode: (mode: ThemeMode) => void;
  setRadius: (radius: RadiusStyle) => void;
  isCustomizerOpen: boolean;
  setIsCustomizerOpen: (open: boolean) => void;
  resetTheme: () => void;
}

const DEFAULT_THEME: ThemeConfig = {
  preset: 'emerald',
  mode: 'light',
  radius: 'rounded'
};

export const THEME_PRESETS_META: Record<
  ThemePreset,
  {
    name: string;
    description: string;
    previewColor: string;
    secondaryColor: string;
    colors: Record<string, string>;
  }
> = {
  emerald: {
    name: 'Emerald Forest (Eco)',
    description: 'Original sustainable green botanical palette',
    previewColor: '#2c7a56',
    secondaryColor: '#83b51b',
    colors: {
      '--color-forest-50': '#f2f9f5',
      '--color-forest-100': '#e1f2e8',
      '--color-forest-200': '#c5e4d2',
      '--color-forest-300': '#99cfb2',
      '--color-forest-400': '#64b38d',
      '--color-forest-500': '#3c976d',
      '--color-forest-600': '#2c7a56',
      '--color-forest-700': '#246146',
      '--color-forest-800': '#1f4e39',
      '--color-forest-900': '#1a4130',
      '--color-forest-950': '#0d241b',
      '--color-sprout-50': '#f6fbe9',
      '--color-sprout-400': '#a3d137',
      '--color-sprout-500': '#83b51b',
      '--color-sprout-600': '#659012'
    }
  },
  ocean: {
    name: 'Ocean Breeze',
    description: 'Refreshing marine blue & vibrant cyan',
    previewColor: '#0284c7',
    secondaryColor: '#06b6d4',
    colors: {
      '--color-forest-50': '#f0f9ff',
      '--color-forest-100': '#e0f2fe',
      '--color-forest-200': '#bae6fd',
      '--color-forest-300': '#7dd3fc',
      '--color-forest-400': '#38bdf8',
      '--color-forest-500': '#0ea5e9',
      '--color-forest-600': '#0284c7',
      '--color-forest-700': '#0369a1',
      '--color-forest-800': '#075985',
      '--color-forest-900': '#0c4a6e',
      '--color-forest-950': '#082f49',
      '--color-sprout-50': '#ecfeff',
      '--color-sprout-400': '#22d3ee',
      '--color-sprout-500': '#06b6d4',
      '--color-sprout-600': '#0891b2'
    }
  },
  sunset: {
    name: 'Sunset Amber',
    description: 'Warm appetizing honey, amber & sunset gold',
    previewColor: '#d97706',
    secondaryColor: '#f59e0b',
    colors: {
      '--color-forest-50': '#fffbeb',
      '--color-forest-100': '#fef3c7',
      '--color-forest-200': '#fde68a',
      '--color-forest-300': '#fcd34d',
      '--color-forest-400': '#fbbf24',
      '--color-forest-500': '#f59e0b',
      '--color-forest-600': '#d97706',
      '--color-forest-700': '#b45309',
      '--color-forest-800': '#92400e',
      '--color-forest-900': '#78350f',
      '--color-forest-950': '#451a03',
      '--color-sprout-50': '#fff7ed',
      '--color-sprout-400': '#fb923c',
      '--color-sprout-500': '#f97316',
      '--color-sprout-600': '#ea580c'
    }
  },
  indigo: {
    name: 'Royal Indigo',
    description: 'Modern luxury deep indigo & radiant violet',
    previewColor: '#4f46e5',
    secondaryColor: '#8b5cf6',
    colors: {
      '--color-forest-50': '#eef2ff',
      '--color-forest-100': '#e0e7ff',
      '--color-forest-200': '#c7d2fe',
      '--color-forest-300': '#a5b4fc',
      '--color-forest-400': '#818cf8',
      '--color-forest-500': '#6366f1',
      '--color-forest-600': '#4f46e5',
      '--color-forest-700': '#4338ca',
      '--color-forest-800': '#3730a3',
      '--color-forest-900': '#312e81',
      '--color-forest-950': '#1e1b4b',
      '--color-sprout-50': '#f5f3ff',
      '--color-sprout-400': '#a78bfa',
      '--color-sprout-500': '#8b5cf6',
      '--color-sprout-600': '#7c3aed'
    }
  },
  rose: {
    name: 'Berry Rose',
    description: 'Energetic ruby berry & fresh blossom pink',
    previewColor: '#e11d48',
    secondaryColor: '#f43f5e',
    colors: {
      '--color-forest-50': '#fff1f2',
      '--color-forest-100': '#ffe4e6',
      '--color-forest-200': '#fecdd3',
      '--color-forest-300': '#fda4af',
      '--color-forest-400': '#fb7185',
      '--color-forest-500': '#f43f5e',
      '--color-forest-600': '#e11d48',
      '--color-forest-700': '#be123c',
      '--color-forest-800': '#9f1239',
      '--color-forest-900': '#881337',
      '--color-forest-950': '#4c0519',
      '--color-sprout-50': '#fff1f2',
      '--color-sprout-400': '#fb7185',
      '--color-sprout-500': '#f43f5e',
      '--color-sprout-600': '#e11d48'
    }
  },
  teal: {
    name: 'Nordic Teal',
    description: 'Crisp scandinavian seafoam & deep teal',
    previewColor: '#0d9488',
    secondaryColor: '#14b8a6',
    colors: {
      '--color-forest-50': '#f0fdfa',
      '--color-forest-100': '#ccfbf1',
      '--color-forest-200': '#99f6e4',
      '--color-forest-300': '#5eead4',
      '--color-forest-400': '#2dd4bf',
      '--color-forest-500': '#14b8a6',
      '--color-forest-600': '#0d9488',
      '--color-forest-700': '#0f766e',
      '--color-forest-800': '#115e59',
      '--color-forest-900': '#134e4a',
      '--color-forest-950': '#042f2e',
      '--color-sprout-50': '#ecfdf5',
      '--color-sprout-400': '#34d399',
      '--color-sprout-500': '#10b981',
      '--color-sprout-600': '#059669'
    }
  },
  earth: {
    name: 'Terracotta Earth',
    description: 'Organic warm clay, coffee & rich earth',
    previewColor: '#9e714b',
    secondaryColor: '#af8658',
    colors: {
      '--color-forest-50': '#faf6f0',
      '--color-forest-100': '#f2ebe0',
      '--color-forest-200': '#e5d7c2',
      '--color-forest-300': '#d3bc9c',
      '--color-forest-400': '#bfa076',
      '--color-forest-500': '#af8658',
      '--color-forest-600': '#9e714b',
      '--color-forest-700': '#7f573c',
      '--color-forest-800': '#684734',
      '--color-forest-900': '#563c2e',
      '--color-forest-950': '#332219',
      '--color-sprout-50': '#fdf8f4',
      '--color-sprout-400': '#d7a16f',
      '--color-sprout-500': '#c2834b',
      '--color-sprout-600': '#a26634'
    }
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ThemeConfig>(() => {
    try {
      const saved = localStorage.getItem('foodloop_theme_config');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_THEME;
  });

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Apply CSS custom properties dynamically when config changes
  useEffect(() => {
    try {
      localStorage.setItem('foodloop_theme_config', JSON.stringify(config));
    } catch {
      // ignore
    }

    const root = document.documentElement;
    const preset = THEME_PRESETS_META[config.preset] || THEME_PRESETS_META.emerald;

    // Apply color variables
    Object.entries(preset.colors).forEach(([varName, val]) => {
      root.style.setProperty(varName, val);
    });

    // Apply border-radius modifier attribute
    root.setAttribute('data-radius', config.radius);

    // Explicit CSS Radius properties for fallback
    if (config.radius === 'sharp') {
      root.style.setProperty('--radius-sm', '2px');
      root.style.setProperty('--radius-md', '4px');
      root.style.setProperty('--radius-lg', '4px');
      root.style.setProperty('--radius-xl', '6px');
      root.style.setProperty('--radius-2xl', '8px');
      root.style.setProperty('--radius-3xl', '10px');
    } else if (config.radius === 'pill') {
      root.style.setProperty('--radius-sm', '8px');
      root.style.setProperty('--radius-md', '14px');
      root.style.setProperty('--radius-lg', '20px');
      root.style.setProperty('--radius-xl', '28px');
      root.style.setProperty('--radius-2xl', '36px');
      root.style.setProperty('--radius-3xl', '44px');
    } else {
      root.style.setProperty('--radius-sm', '6px');
      root.style.setProperty('--radius-md', '8px');
      root.style.setProperty('--radius-lg', '12px');
      root.style.setProperty('--radius-xl', '16px');
      root.style.setProperty('--radius-2xl', '24px');
      root.style.setProperty('--radius-3xl', '32px');
    }

    // Apply Dark / Light mode classes
    if (config.mode === 'dark') {
      root.classList.add('dark');
    } else if (config.mode === 'light') {
      root.classList.remove('dark');
    } else {
      // System mode
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isSystemDark) root.classList.add('dark');
      else root.classList.remove('dark');
    }
  }, [config]);

  const setPreset = (preset: ThemePreset) => {
    setConfig(prev => ({ ...prev, preset }));
  };

  const setMode = (mode: ThemeMode) => {
    setConfig(prev => ({ ...prev, mode }));
  };

  const setRadius = (radius: RadiusStyle) => {
    setConfig(prev => ({ ...prev, radius }));
  };

  const resetTheme = () => {
    setConfig(DEFAULT_THEME);
  };

  return (
    <ThemeContext.Provider
      value={{
        config,
        setPreset,
        setMode,
        setRadius,
        isCustomizerOpen,
        setIsCustomizerOpen,
        resetTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
