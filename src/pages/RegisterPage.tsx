import React, { useState } from 'react';
import {
  Leaf,
  ShoppingBag,
  Store,
  HeartHandshake,
  ArrowRight,
  Database,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserRole, BusinessType } from '../types';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { signUpWithSupabase } = useAuth();
  const { showToast } = useToast();

  const [role, setRole] = useState<UserRole>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  // Business fields
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState<BusinessType>('bakery');

  // NGO fields
  const [ngoRegNumber, setNgoRegNumber] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);
    try {
      await signUpWithSupabase(
        email,
        password || 'Password123!',
        name,
        role
      );

      showToast('success', 'Supabase Account Created!', 'Welcome to Foodzyra network.');
      if (role === 'business') onNavigate('business');
      else if (role === 'ngo') onNavigate('ngo');
      else onNavigate('customer');
    } catch (err: any) {
      showToast('error', 'Registration Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-forest-600 text-white flex items-center justify-center mx-auto shadow-md">
          <Leaf className="w-7 h-7 text-sprout-300" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Join the Foodzyra Network
        </h1>
        <p className="text-xs text-slate-500">
          Select your role and start closing the food waste loop today
        </p>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 shadow-2xs">
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>Synced with Supabase Cloud DB</span>
        </div>
      </div>

      {/* Role Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block text-center">
          Choose Your Account Type
        </label>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`p-4 rounded-2xl border text-center transition-all ${
              role === 'customer'
                ? 'bg-forest-50/80 border-forest-500 text-forest-800 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <ShoppingBag className={`w-6 h-6 mx-auto mb-1.5 ${role === 'customer' ? 'text-forest-600' : 'text-slate-400'}`} />
            <span className="text-xs font-bold text-slate-900 block">Customer</span>
            <span className="text-[10px] text-slate-500">Eat & Rescue</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('business')}
            className={`p-4 rounded-2xl border text-center transition-all ${
              role === 'business'
                ? 'bg-amber-50/80 border-amber-500 text-amber-800 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <Store className={`w-6 h-6 mx-auto mb-1.5 ${role === 'business' ? 'text-amber-600' : 'text-slate-400'}`} />
            <span className="text-xs font-bold text-slate-900 block">Business</span>
            <span className="text-[10px] text-slate-500">List Surplus</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('ngo')}
            className={`p-4 rounded-2xl border text-center transition-all ${
              role === 'ngo'
                ? 'bg-sky-50/80 border-sky-500 text-sky-800 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <HeartHandshake className={`w-6 h-6 mx-auto mb-1.5 ${role === 'ngo' ? 'text-sky-600' : 'text-slate-400'}`} />
            <span className="text-xs font-bold text-slate-900 block">NGO / Charity</span>
            <span className="text-[10px] text-slate-500">Claim Free</span>
          </button>
        </div>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-5">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Full Name</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sarah Chen"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/30"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@foodzyra.org"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/30"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a strong password"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/30"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/30"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Location Address</label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Connaught Place, New Delhi or Indiranagar, Bengaluru"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/30"
            />
          </div>
        </div>

        {/* Business Custom Fields */}
        {role === 'business' && (
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-4">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">Business Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Store / Restaurant Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Green Harvest Bakery"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Business Type</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="bakery">Artisan Bakery</option>
                  <option value="restaurant">Restaurant / Bistro</option>
                  <option value="cafe">Cafe & Coffee Shop</option>
                  <option value="supermarket">Supermarket / Grocery</option>
                  <option value="hotel">Hotel / Buffet</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* NGO Custom Fields */}
        {role === 'ngo' && (
          <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200 space-y-4">
            <h4 className="text-xs font-bold text-sky-900 uppercase tracking-wider">Charity Verification</h4>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Non-Profit / NGO Registration No.</label>
              <input
                type="text"
                value={ngoRegNumber}
                onChange={(e) => setNgoRegNumber(e.target.value)}
                placeholder="NGO-IND-88492"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs sm:text-sm font-bold shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span>{isSubmitting ? 'Registering...' : 'Create Foodzyra Account'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
          <span>Already have an account? </span>
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="text-forest-700 hover:text-forest-800 font-bold underline"
          >
            Sign in here
          </button>
        </div>

      </form>

    </div>
  );
};
