import React, { useState } from 'react';
import {
  User,
  Leaf,
  Award,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Save,
  Share2,
  TreeDeciduous,
  Globe2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { StatCard } from '../components/common/StatCard';
import { DietaryTag } from '../types';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

const ALL_DIETARY: DietaryTag[] = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Halal',
  'Kosher',
  'Dairy-Free',
  'Organic',
  'Nut-Free'
];

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { currentUser, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [selectedDietary, setSelectedDietary] = useState<DietaryTag[]>(['Vegetarian', 'Organic']);

  if (!currentUser) return null;

  const toggleDietary = (tag: DietaryTag) => {
    setSelectedDietary(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ name, phone, address });
      setIsEditing(false);
      showToast('success', 'Profile Updated', 'Your details have been saved successfully.');
    } catch (err: any) {
      showToast('error', 'Update Failed', err.message);
    }
  };

  // Environmental equivalent calculations
  const treesPlantedEquiv = Math.max(1, Math.round(currentUser.impact.co2SavedKg / 20));
  const carKmEquiv = Math.round(currentUser.impact.co2SavedKg * 6);

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8">
      
      {/* Profile Top Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-20 h-20 rounded-3xl object-cover ring-4 ring-forest-500/20 shadow-md"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">{currentUser.name}</h1>
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold uppercase">
                {currentUser.role}
              </span>
              {currentUser.isVerified && (
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              )}
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" />
              <span>{currentUser.email}</span>
              <span>•</span>
              <MapPin className="w-3.5 h-3.5" />
              <span>{currentUser.address}</span>
            </p>
            <p className="text-[11px] text-slate-400">
              FoodLoop Member since {currentUser.joinedDate}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
        >
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </button>
      </div>

      {/* Sustainability Impact Certification Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-forest-800 via-forest-900 to-slate-900 text-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-forest-600 text-white flex items-center justify-center font-bold shadow-md">
              <Award className="w-6 h-6 text-sprout-300" />
            </div>
            <div>
              <span className="text-xs font-bold text-sprout-400 uppercase tracking-wider block">
                FoodLoop Impact Champion
              </span>
              <h2 className="text-xl sm:text-2xl font-black">Your Sustainability Impact Badge</h2>
            </div>
          </div>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              showToast('success', 'Badge Link Copied!', 'Share your food rescue achievement.');
            }}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center gap-2 self-start sm:self-auto transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Impact</span>
          </button>
        </div>

        {/* 3 Impact Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-1">
            <span className="text-3xl font-black text-sprout-400">{currentUser.impact.mealsSaved}</span>
            <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">Meals Rescued</p>
            <p className="text-[11px] text-slate-400">Nutritious portions kept from waste</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-1">
            <span className="text-3xl font-black text-emerald-400">{currentUser.impact.co2SavedKg.toFixed(1)} kg</span>
            <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">CO₂e Diverted</p>
            <p className="text-[11px] text-slate-400">~{treesPlantedEquiv} trees absorption equiv.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-1">
            <span className="text-3xl font-black text-amber-400">₹{(currentUser.impact.moneySaved * 20).toFixed(0)}</span>
            <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">Money Saved / Recovered</p>
            <p className="text-[11px] text-slate-400">Surplus discount savings</p>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      {isEditing && (
        <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-4 animate-in fade-in duration-150">
          <h3 className="text-base font-bold text-slate-900">Update Profile Details</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Address / City</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-200"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* Dietary Preferences Settings */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Dietary & Food Preferences</h3>
          <p className="text-xs text-slate-500">We'll highlight matching surplus listings on your marketplace feed.</p>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {ALL_DIETARY.map(tag => {
            const isSel = selectedDietary.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleDietary(tag)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSel
                    ? 'bg-forest-600 text-white shadow-xs'
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
  );
};
