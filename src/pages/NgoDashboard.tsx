import React, { useState } from 'react';
import {
  HeartHandshake,
  ShieldCheck,
  PackageCheck,
  Leaf,
  Users,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Truck,
  Sparkles,
  PlusCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFoodLoop } from '../context/FoodLoopContext';
import { StatCard } from '../components/common/StatCard';
import { FoodListing } from '../types';

import { QRCodeDisplay } from '../components/common/QRCodeDisplay';

interface NgoDashboardProps {
  onNavigate: (page: string) => void;
}

export const NgoDashboard: React.FC<NgoDashboardProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { listings, claims, setSelectedListing, setIsDetailsModalOpen, setIsCreateModalOpen, claimFoodDonation } = useFoodLoop();

  const [activeTab, setActiveTab] = useState<'available' | 'claimed' | 'history'>('available');

  // Filter listings flagged for donation
  const availableDonations = listings.filter(l => l.type === 'donation' && l.status === 'available');
  const myClaims = claims.filter(c => c.ngoId === currentUser?.id || currentUser?.role === 'ngo' || currentUser?.role === 'admin');

  const pendingClaims = myClaims.filter(c => c.status === 'approved' || c.status === 'requested');
  const distributedClaims = myClaims.filter(c => c.status === 'collected' || c.status === 'distributed');

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8">
      
      {/* NGO Hub Header */}
      <div className="bg-gradient-to-r from-sky-900 via-forest-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-300 uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4" />
            <span>NGO & Food Bank Rescue Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
            {currentUser?.name || 'City Relief Community Food Bank'}
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {currentUser?.ngoMission || 'Serving over 400 nutritious meals daily to unhoused community members, low-income seniors, and families in need.'}
          </p>
          <div className="pt-1 flex items-center gap-3 text-xs text-slate-400">
            <span>Reg: <strong>{currentUser?.ngoRegistrationNumber || 'NGO-IN-8849201'}</strong></span>
            <span>•</span>
            <span>Hub: <strong>{currentUser?.address || 'Jayanagar, Bengaluru'}</strong></span>
          </div>
        </div>

        {/* Quick KPI summary & Action */}
        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg hover:shadow-xl shrink-0"
            title="Post a surplus food rescue batch or meal drive"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Food Batch</span>
          </button>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center md:text-right w-full sm:w-auto">
            <span className="text-[10px] font-bold text-sky-200 uppercase tracking-wider block">
              Community Relief Delivered
            </span>
            <span className="text-2xl font-black text-white">
              {currentUser?.impact.mealsSaved || 4200}+ Meals
            </span>
            <p className="text-[11px] text-slate-300 mt-0.5">~10.5 Tonnes CO₂e Prevented</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          label="Available Donations"
          value={availableDonations.length}
          unit="Offers"
          icon={<HeartHandshake className="w-5 h-5" />}
          color="emerald"
          description="Ready for immediate NGO pickup"
        />
        <StatCard
          label="Estimated People Fed"
          value={myClaims.reduce((acc, c) => acc + (c.estimatedPeopleFed || 25), 0)}
          unit="Individuals"
          icon={<Users className="w-5 h-5" />}
          color="blue"
          description="Across soup kitchens & shelters"
        />
        <StatCard
          label="Active Claim Tokens"
          value={pendingClaims.length}
          unit="Pending"
          icon={<Truck className="w-5 h-5" />}
          color="amber"
          description="Driver tokens ready for collection"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('available')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'available'
              ? 'bg-sky-100 text-sky-900 font-extrabold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <HeartHandshake className="w-4 h-4 text-sky-600" />
          <span>Available Bulk Donations ({availableDonations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('claimed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'claimed'
              ? 'bg-sky-100 text-sky-900 font-extrabold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Truck className="w-4 h-4 text-sky-600" />
          <span>Active Collection Claims ({pendingClaims.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'history'
              ? 'bg-sky-100 text-sky-900 font-extrabold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Distribution History ({distributedClaims.length})
        </button>
      </div>

      {/* Tab 1: Available Donations */}
      {activeTab === 'available' && (
        <div className="space-y-4">
          {availableDonations.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">All Donated Surplus Has Been Claimed!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Check back shortly — local supermarkets and bakeries publish new surplus donation batches throughout the day.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableDonations.map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200 p-5 shadow-soft space-y-4 flex flex-col justify-between hover:border-sky-300 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100">
                      <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-black text-xs">
                          100% FREE DONATION
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-black/60 text-white text-[11px] font-semibold backdrop-blur-md">
                        {item.location.distanceKm} km away
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {item.businessName}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {item.quantity} {item.quantityUnit}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-1">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-sky-50/60 border border-sky-100 text-xs text-sky-950 space-y-1">
                      <div className="flex items-center gap-1 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-sky-700" />
                        <span>Pickup: {item.pickupWindow.date} {item.pickupWindow.startTime} - {item.pickupWindow.endTime}</span>
                      </div>
                      <p className="text-[11px] text-sky-800 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {item.businessAddress}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-emerald-700">
                      Feeds ~{Math.max(15, Math.round(item.weightKgEstimate * 2))} people
                    </span>

                    <button
                      onClick={() => {
                        setSelectedListing(item);
                        setIsDetailsModalOpen(true);
                      }}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <HeartHandshake className="w-4 h-4" />
                      <span>Claim for Food Bank</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Active Claims & Driver Tokens */}
      {activeTab === 'claimed' && (
        <div className="space-y-4">
          {pendingClaims.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <Truck className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Pending Driver Pickups</h3>
              <p className="text-xs text-slate-500">Claim available bulk donations above to coordinate van pickups.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingClaims.map(claim => (
                <div key={claim.id} className="bg-white rounded-3xl border border-sky-200 p-6 shadow-soft space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 text-xs font-bold">
                      DRIVER PICKUP TOKEN
                    </span>
                    <span className="text-xs text-slate-400">Claim #{claim.id.slice(-5).toUpperCase()}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-forest-50 border border-sky-200 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Pickup Code</span>
                      <span className="text-2xl font-black text-sky-950 font-mono tracking-wider">{claim.pickupCode}</span>
                      <div className="mt-2">
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Est. Beneficiaries</span>
                        <span className="text-sm font-black text-emerald-900">{claim.estimatedPeopleFed} people</span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <QRCodeDisplay value={claim.pickupCode} size={84} showCode={false} />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{claim.listing.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Donor: <strong>{claim.listing.businessName}</strong></p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {claim.listing.businessAddress}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                    <span>Window: {claim.listing.pickupWindow.date} {claim.listing.pickupWindow.startTime} - {claim.listing.pickupWindow.endTime}</span>
                    <span className="font-bold text-emerald-700">~{claim.listing.weightKgEstimate} kg</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: History */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-soft divide-y divide-slate-100">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-600 uppercase tracking-wider">
            Verified NGO Food Rescue Distributions
          </div>
          {distributedClaims.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">No completed distribution logs yet.</div>
          ) : (
            distributedClaims.map(c => (
              <div key={c.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800">{c.listing.title}</span>
                  <p className="text-slate-500">Donated by {c.listing.businessName} • Fed ~{c.estimatedPeopleFed} people</p>
                </div>
                <div className="text-right">
                  <span className="text-emerald-700 font-bold">{c.listing.weightKgEstimate * 2.5} kg CO₂ Saved</span>
                  <p className="text-slate-400 text-[11px]">{new Date(c.claimedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};
