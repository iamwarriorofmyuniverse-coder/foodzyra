import React, { useState } from 'react';
import {
  X,
  MapPin,
  Navigation,
  Compass,
  Search,
  ShieldCheck,
  Check,
  Sparkles,
  Building2,
  Globe,
  Loader2
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { INDIAN_PRESET_LOCATIONS, SF_PRESET_LOCATIONS, GLOBAL_PRESET_CITIES, geocodeAddress } from '../../services/geoService';

export const LocationPromptModal: React.FC = () => {
  const {
    isLocationModalOpen,
    setIsLocationModalOpen,
    userLocation,
    permissionStatus,
    requestGpsLocation,
    selectPresetLocation,
    setCustomManualLocation
  } = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmittingCustom, setIsSubmittingCustom] = useState(false);
  const [activeCityTab, setActiveCityTab] = useState<string>('all');
  const [regionTab, setRegionTab] = useState<'india' | 'global'>('india');

  if (!isLocationModalOpen) return null;

  const filteredIndianPresets = INDIAN_PRESET_LOCATIONS.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.landmark.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeCityTab === 'all') return true;
    return p.city === activeCityTab;
  });

  const filteredGlobalPresets = GLOBAL_PRESET_CITIES.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.landmark.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indianCities = [
    { id: 'all', label: 'All India' },
    { id: 'Bengaluru', label: 'Bengaluru' },
    { id: 'Mumbai', label: 'Mumbai' },
    { id: 'Delhi NCR', label: 'Delhi NCR' },
    { id: 'Hyderabad', label: 'Hyderabad' },
    { id: 'Chennai', label: 'Chennai' },
    { id: 'Pune', label: 'Pune' },
    { id: 'Kolkata', label: 'Kolkata' }
  ];

  const handleCustomSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSubmittingCustom(true);
    try {
      const result = await geocodeAddress(searchQuery.trim());
      setCustomManualLocation(
        result.name,
        result.address,
        result.coordinates
      );
    } catch (err: any) {
      console.warn('Geocoding error:', err);
    } finally {
      setIsSubmittingCustom(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-forest-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Compass className="w-5 h-5 text-sprout-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Set Discovery Location</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Discover surplus food in Indian cities & calculate live travel distance</p>
            </div>
          </div>

          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Privacy & Permission Callout */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex items-start gap-3 text-xs text-emerald-950 dark:text-emerald-200">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Privacy First:</span> Location is used strictly to calculate proximity to nearby surplus meals and donation hubs. Your coordinates are never sold or shared.
            </div>
          </div>

          {/* Option 1: Browser GPS / Network IP Auto-Detection */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              Auto-Detect via GPS / Network IP
            </span>
            <button
              onClick={requestGpsLocation}
              disabled={permissionStatus === 'requesting'}
              className="w-full p-4 rounded-2xl border-2 border-forest-500/40 dark:border-forest-700 bg-gradient-to-r from-forest-50 to-sprout-50/40 dark:from-forest-950/50 dark:to-slate-800 hover:border-forest-600 hover:from-forest-100/60 transition-all flex items-center justify-between group shadow-xs disabled:opacity-60 text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-forest-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                  {permissionStatus === 'requesting' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Navigation className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white block">
                    {permissionStatus === 'requesting' ? 'Detecting Location...' : 'Use Current Device Location'}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Live GPS or high-accuracy network IP detection
                  </span>
                </div>
              </div>

              {!userLocation.isManual && (
                <span className="p-1 rounded-full bg-forest-600 text-white shrink-0">
                  <Check className="w-4 h-4" />
                </span>
              )}
            </button>
          </div>

          {/* Option 2: Custom Search Input with Global Geocoding */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              Or Type Any City, Neighborhood, or Postal Code
            </span>
            <form onSubmit={handleCustomSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Indiranagar Bengaluru, Bandra Mumbai, Connaught Place Delhi, Hyderabad..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/30"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmittingCustom}
                className="px-4 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 shrink-0"
              >
                {isSubmittingCustom ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Search</span>}
              </button>
            </form>
          </div>

          {/* Option 3: Presets Grid with Indian City Tabs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Quick Select Indian Hubs & Cities
              </span>
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setRegionTab('india')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                    regionTab === 'india' ? 'bg-white dark:bg-slate-700 text-forest-700 dark:text-forest-300 shadow-2xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  🇮🇳 India Metros
                </button>
                <button
                  type="button"
                  onClick={() => setRegionTab('global')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                    regionTab === 'global' ? 'bg-white dark:bg-slate-700 text-forest-700 dark:text-forest-300 shadow-2xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  🌐 Global
                </button>
              </div>
            </div>

            {/* Indian City Filter Pills */}
            {regionTab === 'india' && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5">
                {indianCities.map(city => (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => setActiveCityTab(city.id)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      activeCityTab === city.id
                        ? 'bg-forest-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {city.label}
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
              {(regionTab === 'india' ? filteredIndianPresets : filteredGlobalPresets).map(preset => {
                const isSelected = userLocation.label === preset.name || userLocation.address === preset.address;
                return (
                  <button
                    key={preset.id}
                    onClick={() => selectPresetLocation(preset)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-start justify-between ${
                      isSelected
                        ? 'border-forest-600 bg-forest-50 dark:bg-forest-950/50 ring-2 ring-forest-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
                        {regionTab === 'global' ? (
                          <Globe className="w-3.5 h-3.5 text-forest-600 shrink-0" />
                        ) : (
                          <Building2 className="w-3.5 h-3.5 text-forest-600 shrink-0" />
                        )}
                        <span>{preset.name}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{preset.landmark}</p>
                    </div>

                    {isSelected && (
                      <span className="p-0.5 rounded-full bg-forest-600 text-white shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="truncate max-w-[280px]">Active: <strong className="text-slate-900 dark:text-white">{userLocation.label}</strong></span>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-bold text-slate-800 dark:text-white transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
