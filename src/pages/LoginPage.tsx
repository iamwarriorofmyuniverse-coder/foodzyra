import React, { useState } from 'react';
import {
  Leaf,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  Zap,
  Database,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { loginWithSupabase, loginWithMagicLink, allUsers, switchUser } = useAuth();
  const { showToast } = useToast();

  const [authMode, setAuthMode] = useState<'supabase' | 'magic_link' | 'personas'>('supabase');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSupabaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const user = await loginWithSupabase(email, password || 'Password123!');
      showToast('success', `Welcome back, ${user.name}!`, 'Authenticated with Supabase Cloud.');
      if (user.role === 'business') onNavigate('business');
      else if (user.role === 'ngo') onNavigate('ngo');
      else if (user.role === 'admin') onNavigate('admin');
      else onNavigate('customer');
    } catch (err: any) {
      showToast('error', 'Authentication Notice', err.message || 'Check your login credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const res = await loginWithMagicLink(email);
      setMagicLinkSent(true);
      showToast('success', 'Magic Link Sent', res.message);
    } catch (err: any) {
      showToast('error', 'Magic Link Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (userId: string, targetRole: string) => {
    setIsSubmitting(true);
    try {
      const user = await switchUser(userId);
      showToast('success', `Switched to ${user.name}`, `Role: ${targetRole}`);
      if (targetRole === 'business') onNavigate('business');
      else if (targetRole === 'ngo') onNavigate('ngo');
      else if (targetRole === 'admin') onNavigate('admin');
      else onNavigate('customer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-12 space-y-6">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-forest-600 text-white flex items-center justify-center mx-auto shadow-md">
          <Leaf className="w-7 h-7 text-sprout-300" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Sign In to Foodzyra
        </h1>
        <p className="text-xs text-slate-500">
          Rescue surplus food, support zero waste, and reduce hunger
        </p>

        {/* Supabase Status Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 shadow-2xs">
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>Supabase Auth Cloud Linked</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* Auth Mode Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
        <button
          type="button"
          onClick={() => setAuthMode('supabase')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            authMode === 'supabase'
              ? 'bg-white text-forest-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Supabase Login
        </button>
        <button
          type="button"
          onClick={() => setAuthMode('magic_link')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            authMode === 'magic_link'
              ? 'bg-white text-forest-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Magic Link
        </button>
        <button
          type="button"
          onClick={() => setAuthMode('personas')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            authMode === 'personas'
              ? 'bg-white text-forest-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Demo Personas
        </button>
      </div>

      {/* MODE 1: SUPABASE PASSWORD LOGIN */}
      {authMode === 'supabase' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-4 animate-in fade-in duration-200">
          <form onSubmit={handleSupabaseLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Supabase Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@supabase.io or sarah@foodzyra.org"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/30"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/30"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs sm:text-sm font-bold shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In with Supabase'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
            <span>Need an account? </span>
            <button
              type="button"
              onClick={() => onNavigate('register')}
              className="text-forest-700 hover:text-forest-800 font-bold underline"
            >
              Create Supabase Account
            </button>
          </div>
        </div>
      )}

      {/* MODE 2: MAGIC LINK */}
      {authMode === 'magic_link' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-4 animate-in fade-in duration-200">
          <div className="text-center space-y-1">
            <h3 className="text-sm font-bold text-slate-900">Passwordless Magic Link</h3>
            <p className="text-xs text-slate-500">We'll send an instant login link directly via Supabase Auth</p>
          </div>

          {magicLinkSent ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="text-xs font-bold text-emerald-900">Magic Link Dispatched!</p>
              <p className="text-[11px] text-emerald-700">Check your email for the secure login button.</p>
              <button
                type="button"
                onClick={() => setMagicLinkSent(false)}
                className="text-xs font-semibold text-emerald-800 underline mt-2 block mx-auto"
              >
                Send to another email
              </button>
            </div>
          ) : (
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Your Email Address</label>
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs sm:text-sm font-bold shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>{isSubmitting ? 'Sending Link...' : 'Send Magic Link'}</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* MODE 3: FAST 1-CLICK DEMO PERSONAS */}
      {authMode === 'personas' && (
        <div className="p-5 rounded-3xl bg-forest-50/70 border border-forest-200/80 shadow-soft space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-forest-900">
            <Sparkles className="w-4 h-4 text-forest-600" />
            <span>Select a Demo Role to Test:</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {allUsers.map(user => (
              <button
                key={user.id}
                type="button"
                onClick={() => handleQuickLogin(user.id, user.role)}
                className="w-full text-left p-2.5 rounded-xl bg-white border border-forest-200 hover:border-forest-500 hover:bg-forest-50/50 flex items-center justify-between transition-colors group shadow-2xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-lg object-cover" />
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{user.role} • {user.email}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-forest-100 text-forest-800 group-hover:bg-forest-600 group-hover:text-white transition-colors shrink-0">
                  Log In
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
