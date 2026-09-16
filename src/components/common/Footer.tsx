import React from 'react';
import { Leaf, Heart, Shield, Globe, Award, Sparkles, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-forest-500 flex items-center justify-center text-white shadow-lg shadow-forest-500/20">
                <Leaf className="w-6 h-6 text-sprout-200" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Food<span className="text-sprout-400">zyra</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Empowering local communities, businesses, and food banks to eliminate edible food waste through smart, verified redistribution and affordable surplus dining.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-950/80 text-sprout-300 border border-forest-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> 100% Circular Food Model
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold">
                <Shield className="w-3.5 h-3.5 text-emerald-400" /> Verified Partners
              </span>
            </div>
          </div>

          {/* Shoppers / Customers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">For Customers</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('customer')} className="hover:text-white transition-colors text-left">
                  Find Nearby Surplus
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('customer')} className="hover:text-white transition-colors text-left">
                  Free Community Food
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('reservations')} className="hover:text-white transition-colors text-left">
                  My Orders & Pickup Codes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('profile')} className="hover:text-white transition-colors text-left">
                  Personal CO₂ Impact
                </button>
              </li>
            </ul>
          </div>

          {/* Businesses & Donors */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">For Businesses</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('business')} className="hover:text-white transition-colors text-left">
                  Merchant Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('business')} className="hover:text-white transition-colors text-left">
                  List Surplus Stock
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('business')} className="hover:text-white transition-colors text-left">
                  Zero-Waste Certification
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('business')} className="hover:text-white transition-colors text-left">
                  Tax Relief & ESG Metrics
                </button>
              </li>
            </ul>
          </div>

          {/* NGOs & Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">NGOs & Impact</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('ngo')} className="hover:text-white transition-colors text-left">
                  NGO Food Rescue Hub
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ngo')} className="hover:text-white transition-colors text-left">
                  Bulk Donation Feeds
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-white transition-colors text-left">
                  Platform Moderation
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors text-left">
                  How Foodzyra Works
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Foodzyra Inc. Building a zero-waste sustainable future together.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Food Safety Guidelines</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
