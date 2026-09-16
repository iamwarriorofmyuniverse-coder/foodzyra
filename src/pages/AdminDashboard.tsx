import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Users,
  Store,
  HeartHandshake,
  Trash2,
  Eye,
  RefreshCw,
  TrendingUp,
  Leaf,
  DollarSign
} from 'lucide-react';
import { useFoodLoop } from '../context/FoodLoopContext';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/common/StatCard';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { stats, listings, moderateFoodListing, setSelectedListing, setIsDetailsModalOpen } = useFoodLoop();
  const { allUsers, resetDatabase } = useAuth();

  const [activeTab, setActiveTab] = useState<'moderation' | 'users' | 'listings'>('moderation');

  const reportedListings = listings.filter(l => l.reported);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8">
      
      {/* Admin Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Foodzyra System Administration & Moderation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Platform Command Center</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Monitor zero-waste metrics, audit reported food listings, and verify merchants & charity food banks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetDatabase}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Demo DB</span>
          </button>
        </div>
      </div>

      {/* Platform Health Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Meals Rescued"
          value={stats?.totalMealsRescued || 14820}
          unit="Meals"
          icon={<Leaf className="w-5 h-5" />}
          color="forest"
          description="Across all registered cities"
        />
        <StatCard
          label="CO₂e Avoided"
          value={stats?.co2PreventedKg || 37050}
          unit="kg"
          icon={<TrendingUp className="w-5 h-5" />}
          color="emerald"
          description="Net landfill greenhouse offset"
        />
        <StatCard
          label="Verified Partners"
          value={(stats?.totalBusinesses || 24) + (stats?.totalNgos || 12)}
          unit="Entities"
          icon={<ShieldCheck className="w-5 h-5" />}
          color="purple"
          description={`${stats?.totalBusinesses || 24} Stores • ${stats?.totalNgos || 12} NGOs`}
        />
        <StatCard
          label="Reported Listings"
          value={reportedListings.length}
          unit="Pending"
          icon={<AlertTriangle className="w-5 h-5" />}
          color="amber"
          description="Requires administrative review"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('moderation')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'moderation'
              ? 'bg-purple-100 text-purple-900 font-extrabold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>Moderation Queue ({reportedListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-purple-100 text-purple-900 font-extrabold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4 text-purple-600" />
          <span>Partner Directory ({allUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'listings'
              ? 'bg-purple-100 text-purple-900 font-extrabold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Store className="w-4 h-4 text-slate-600" />
          <span>All Live Listings ({listings.length})</span>
        </button>
      </div>

      {/* Moderation Queue Tab */}
      {activeTab === 'moderation' && (
        <div className="space-y-4">
          {reportedListings.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">Moderation Queue is Clean!</h3>
              <p className="text-xs text-slate-500">No community complaints or safety flags reported.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-soft divide-y divide-slate-100">
              <div className="p-4 bg-amber-50 text-amber-900 font-bold text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Flagged Food Listings Awaiting Admin Audit</span>
              </div>
              {reportedListings.map(item => (
                <div key={item.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex gap-4">
                    <img src={item.images[0]} alt={item.title} className="w-20 h-20 rounded-2xl object-cover" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold text-[11px]">
                          Flag: {item.reportReason || 'User Reported'}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                      </div>
                      <p className="text-xs text-slate-500">Merchant: <strong>{item.businessName}</strong> ({item.businessAddress})</p>
                      <p className="text-xs text-slate-600">{item.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setSelectedListing(item);
                        setIsDetailsModalOpen(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                    <button
                      onClick={() => moderateFoodListing(item.id, 'approve')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Dismiss & Approve</span>
                    </button>
                    <button
                      onClick={() => moderateFoodListing(item.id, 'remove')}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Listing</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Partner Directory Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-soft">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-600 uppercase tracking-wider">
            Registered Platform Accounts & Roles
          </div>
          <div className="divide-y divide-slate-100">
            {allUsers.map(user => (
              <div key={user.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img src={user.avatar} alt={user.name} className="w-11 h-11 rounded-2xl object-cover ring-1 ring-slate-200" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{user.name}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                        user.role === 'business'
                          ? 'bg-amber-100 text-amber-900'
                          : user.role === 'ngo'
                          ? 'bg-sky-100 text-sky-900'
                          : user.role === 'admin'
                          ? 'bg-purple-100 text-purple-900'
                          : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {user.role}
                      </span>
                      {user.isVerified && (
                        <span title="Verified">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{user.email} • {user.address}</p>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="font-bold text-forest-700">{user.impact.mealsSaved} Meals Rescued</span>
                  <p className="text-[11px] text-slate-400">Joined {user.joinedDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Live Listings Tab */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-soft divide-y divide-slate-100">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-600 uppercase tracking-wider">
            Active Food Listings on Marketplace
          </div>
          {listings.map(l => (
            <div key={l.id} className="p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img src={l.images[0]} alt={l.title} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h4 className="font-bold text-slate-900">{l.title}</h4>
                  <p className="text-slate-500">{l.businessName} • {l.category} • {l.quantity} {l.quantityUnit}</p>
                </div>
              </div>

              <div className="text-right">
                <span className={`font-bold ${l.type === 'donation' ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {l.type === 'donation' ? 'FREE DONATION' : `₹${l.discountedPrice.toFixed(0)}`}
                </span>
                <p className="text-slate-400 text-[11px]">Status: {l.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
