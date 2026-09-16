import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  DollarSign,
  Clock,
  Sparkles,
  HeartHandshake,
  Grid,
  Map as MapIcon,
  X,
  RotateCcw,
  Navigation,
  Compass
} from 'lucide-react';
import { FilterState, DietaryTag, FoodCategory } from '../../types';
import { useLocation } from '../../context/LocationContext';

interface ListingFiltersProps {
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onReset: () => void;
  viewMode: 'grid' | 'map';
  onViewModeChange: (mode: 'grid' | 'map') => void;
  totalResults: number;
}

const CATEGORIES: FoodCategory[] = [
  'Bakery',
  'Meals & Prepared',
  'Fresh Produce',
  'Groceries',
  'Dairy & Refrigerated',
  'Beverages',
  'Surprise Bag'
];

const DIETARY_OPTIONS: DietaryTag[] = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Halal',
  'Dairy-Free',
  'Organic',
  'Nut-Free'
];

const RADIUS_OPTIONS = [3, 5, 10, 15, 25, 50];

export const ListingFilters: React.FC<ListingFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  viewMode,
  onViewModeChange,
  totalResults
}) => {
  const { userLocation, selectedRadiusKm, setSelectedRadiusKm, setIsLocationModalOpen } = useLocation();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const toggleDietaryTag = (tag: DietaryTag) => {
    const current = filters.dietary;
    const exists = current.includes(tag);
    const updated = exists ? current.filter(t => t !== tag) : [...current, tag];
    onFilterChange({ dietary: updated });
  };

  const handleRadiusChange = (radius: number) => {
    setSelectedRadiusKm(radius);
    onFilterChange({ maxDistanceKm: radius });
  };

  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.type !== 'all' ||
    filters.searchQuery !== '' ||
    filters.maxPrice < 50 ||
    filters.dietary.length > 0 ||
    filters.sortBy !== 'distance';

  return (
    <div className="space-y-4">
      
      {/* Primary Search & Quick Toggle Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-3xl border border-slate-200/90 shadow-soft space-y-3">
        
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          
          {/* Location Picker Trigger Button */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-forest-50/80 hover:bg-forest-100/80 border border-forest-200 text-forest-900 text-xs font-bold transition-all shrink-0 text-left"
            title="Click to change location or use GPS"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-forest-600 animate-pulse shrink-0" />
            <span className="truncate max-w-[140px] sm:max-w-xs">{userLocation.label}</span>
            <span className="text-[10px] text-forest-600 underline font-normal ml-1">Change</span>
          </button>

          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              placeholder="Search surplus food, bakeries, meals, produce..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-500 focus:bg-white transition-all"
            />
            {filters.searchQuery && (
              <button
                onClick={() => onFilterChange({ searchQuery: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Type Switcher: All / For Sale / Donations */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl shrink-0 self-center">
            <button
              onClick={() => onFilterChange({ type: 'all' })}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filters.type === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => onFilterChange({ type: 'sale' })}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
                filters.type === 'sale'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              Sale
            </button>
            <button
              onClick={() => onFilterChange({ type: 'donation' })}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
                filters.type === 'donation'
                  ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HeartHandshake className="w-3 h-3" />
              Donations
            </button>
          </div>

          {/* Actions: Advanced Filters & View Switcher */}
          <div className="flex items-center justify-between sm:justify-end gap-2">
            <button
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border text-xs font-semibold transition-colors ${
                isAdvancedOpen || hasActiveFilters
                  ? 'border-forest-500 bg-forest-50 text-forest-800'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-forest-600" />
              )}
            </button>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-1.5 rounded-xl transition-all ${
                  viewMode === 'grid' ? 'bg-white text-forest-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('map')}
                className={`p-1.5 rounded-xl transition-all ${
                  viewMode === 'map' ? 'bg-white text-forest-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Interactive Map View"
              >
                <MapIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Radius Quick Selector Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            <span className="font-bold text-slate-500 flex items-center gap-1 shrink-0 mr-1 text-[11px] uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-forest-600" /> Radius:
            </span>
            {RADIUS_OPTIONS.map(radius => (
              <button
                key={radius}
                onClick={() => handleRadiusChange(radius)}
                className={`px-3 py-1 rounded-xl font-bold transition-all text-xs shrink-0 ${
                  selectedRadiusKm === radius
                    ? 'bg-forest-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {radius} km {radius === 1 ? '(Walk)' : radius === 3 ? '(Bike)' : ''}
              </button>
            ))}
          </div>

          {/* Quick Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sort:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })}
              className="py-1 px-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-500/30"
            >
              <option value="distance">📍 Distance (Nearest First)</option>
              <option value="price-low">💵 Price (Lowest First)</option>
              <option value="closing-soon">⏰ Pickup Time (Closing Soon)</option>
              <option value="discount-high">🏷️ Discount (Highest % Off)</option>
            </select>
          </div>
        </div>

        {/* Category Horizontal Scroll Chips */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => onFilterChange({ category: 'all' })}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
              filters.category === 'all'
                ? 'bg-forest-700 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => onFilterChange({ category: cat })}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                filters.category === cat
                  ? 'bg-forest-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filter Expansion Panel */}
      {isAdvancedOpen && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md animate-in fade-in slide-in-from-top-2 duration-200 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-forest-600" />
              Advanced Filters
            </h4>
            {hasActiveFilters && (
              <button
                onClick={onReset}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Max Price */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-amber-500" /> Max Price (INR)
                </span>
                <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                  Up to ₹{filters.maxPrice}
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="1500"
                step="25"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>₹50</span>
                <span>₹500</span>
                <span>₹1500+</span>
              </div>
            </div>

            {/* Dietary Tags */}
            <div className="sm:col-span-2 space-y-2">
              <span className="text-xs font-semibold text-slate-700 block">Dietary Restrictions</span>
              <div className="flex flex-wrap gap-1.5">
                {DIETARY_OPTIONS.map(tag => {
                  const selected = filters.dietary.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleDietaryTag(tag)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all ${
                        selected
                          ? 'bg-forest-600 text-white font-semibold shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Results Count & Location Banner */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div>
          <span>Showing <strong>{totalResults}</strong> surplus food offers within <strong>{selectedRadiusKm} km</strong> of <strong>{userLocation.label}</strong></span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-forest-600 hover:text-forest-800 font-semibold underline"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
};
