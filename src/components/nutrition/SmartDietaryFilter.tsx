import React, { useState } from 'react';
import { Sparkles, Dumbbell, Flame, Wheat, Leaf, Shield, Camera, Filter } from 'lucide-react';

export interface DietaryFilterState {
  minProtein: number;
  maxCalories: number;
  selectedDietaryTags: string[];
}

interface SmartDietaryFilterProps {
  onFilterChange: (filters: DietaryFilterState) => void;
  onOpenVisionModal: () => void;
}

export const SmartDietaryFilter: React.FC<SmartDietaryFilterProps> = ({
  onFilterChange,
  onOpenVisionModal
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [minProtein, setMinProtein] = useState<number>(0);
  const [maxCalories, setMaxCalories] = useState<number>(1500);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const DIETARY_OPTIONS = [
    { label: 'High Protein (>25g)', value: 'High Protein', icon: Dumbbell },
    { label: 'High Fiber (>6g)', value: 'High Fiber', icon: Wheat },
    { label: 'Keto Friendly', value: 'Keto Friendly', icon: Flame },
    { label: '100% Vegan', value: 'Vegan', icon: Leaf },
    { label: 'Gluten-Free', value: 'Gluten-Free', icon: Shield }
  ];

  const toggleTag = (tag: string) => {
    const updated = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(updated);
    emitChange(minProtein, maxCalories, updated);
  };

  const handleProteinChange = (val: number) => {
    setMinProtein(val);
    emitChange(val, maxCalories, selectedTags);
  };

  const handleCaloriesChange = (val: number) => {
    setMaxCalories(val);
    emitChange(minProtein, val, selectedTags);
  };

  const emitChange = (protein: number, calories: number, tags: string[]) => {
    onFilterChange({
      minProtein: protein,
      maxCalories: calories,
      selectedDietaryTags: tags
    });
  };

  const clearFilters = () => {
    setMinProtein(0);
    setMaxCalories(1500);
    setSelectedTags([]);
    emitChange(0, 1500, []);
  };

  const activeFiltersCount = (minProtein > 0 ? 1 : 0) + (maxCalories < 1500 ? 1 : 0) + selectedTags.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
      {/* Top Banner & Quick Trigger */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4 text-forest-700" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              Nutrition Intelligence & Smart Matching
              {activeFiltersCount > 0 && (
                <span className="text-[10px] bg-forest-600 text-white font-extrabold px-2 py-0.5 rounded-full">
                  {activeFiltersCount} active
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500">
              Filter surplus meals by exact USDA protein density, calories & dietary goals
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenVisionModal}
            className="px-3.5 py-1.5 bg-gradient-to-r from-forest-700 to-emerald-700 hover:from-forest-800 hover:to-emerald-800 text-white text-xs font-bold rounded-xl shadow-sm transition-transform active:scale-95 flex items-center gap-1.5"
          >
            <Camera className="w-3.5 h-3.5 text-amber-300" />
            AI Plate Scanner
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-colors ${
              isOpen || activeFiltersCount > 0
                ? 'bg-forest-50 border-forest-300 text-forest-800'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            {isOpen ? 'Hide Filters' : 'Macro Filters'}
          </button>
        </div>
      </div>

      {/* Expandable Macro & Dietary Sliders */}
      {isOpen && (
        <div className="pt-3 border-t border-slate-100 space-y-4 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Protein Target Slider */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Dumbbell className="w-3.5 h-3.5 text-blue-600" />
                  Minimum Protein Goal
                </span>
                <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {minProtein === 0 ? 'Any Protein' : `≥ ${minProtein}g Protein`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={minProtein}
                onChange={(e) => handleProteinChange(Number(e.target.value))}
                className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0g</span>
                <span>20g</span>
                <span>35g</span>
                <span>50g+</span>
              </div>
            </div>

            {/* Calorie Limit Slider */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  Maximum Energy Limit
                </span>
                <span className="font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {maxCalories >= 1500 ? 'No Limit' : `≤ ${maxCalories} kcal`}
                </span>
              </div>
              <input
                type="range"
                min="300"
                max="1500"
                step="50"
                value={maxCalories}
                onChange={(e) => handleCaloriesChange(Number(e.target.value))}
                className="w-full accent-amber-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>300 kcal</span>
                <span>650 kcal</span>
                <span>1000 kcal</span>
                <span>1500+</span>
              </div>
            </div>

          </div>

          {/* Dietary Tag Quick Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-1">Dietary Target:</span>
            {DIETARY_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedTags.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleTag(opt.value)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                    isSelected
                      ? 'bg-forest-600 border-forest-600 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {opt.label}
                </button>
              );
            })}

            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-slate-400 hover:text-red-600 underline ml-auto font-medium"
              >
                Reset Macros
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
