import React, { useState } from 'react';
import {
  Store,
  PlusCircle,
  QrCode,
  Leaf,
  IndianRupee,
  PackageCheck,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Eye,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFoodLoop } from '../context/FoodLoopContext';
import { StatCard } from '../components/common/StatCard';
import { QRCodeDisplay } from '../components/common/QRCodeDisplay';
import { ApiService } from '../services/api';

interface BusinessDashboardProps {
  onNavigate: (page: string) => void;
}

export const BusinessDashboard: React.FC<BusinessDashboardProps> = () => {
  const { currentUser } = useAuth();
  const {
    listings,
    reservations,
    setIsCreateModalOpen,
    setIsPickupModalOpen,
    setSelectedListing,
    setIsDetailsModalOpen,
    verifyPickupCode
  } = useFoodLoop();

  const [activeTab, setActiveTab] = useState<'listings' | 'reservations' | 'history'>('listings');
  const [quickCodeInput, setQuickCodeInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [wasteInsights, setWasteInsights] = useState<{
    aiExplanation: string;
    topWasteCategory: string;
    peakSurplusDay: string;
    actionableTips: string[];
  } | null>(null);

  React.useEffect(() => {
    if (currentUser?.id) {
      ApiService.getBusinessWasteAnalytics(currentUser.id)
        .then(data => setWasteInsights(data))
        .catch(console.error);
    }
  }, [currentUser?.id]);

  // Filter listings belonging to this business or show all business listings if in demo
  const myListings = listings.filter(l => l.businessId === currentUser?.id || l.businessName.includes(currentUser?.name || ''));
  const allBizListings = myListings.length > 0 ? myListings : listings.filter(l => l.businessId.startsWith('user-biz'));

  // Reservations for this business
  const businessReservations = reservations.filter(r => 
    r.listing.businessId === currentUser?.id || allBizListings.some(l => l.id === r.listingId)
  );

  const pendingReservations = businessReservations.filter(r => r.status === 'pending_pickup');
  const collectedReservations = businessReservations.filter(r => r.status === 'collected');

  const handleVerifyCode = async (code: string) => {
    if (!code) return;
    setIsVerifying(true);
    try {
      await verifyPickupCode(code);
      setQuickCodeInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleQuickVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCodeInput) return;
    await handleVerifyCode(quickCodeInput);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8">
      
      {/* Merchant Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-8 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-3.5">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&auto=format&fit=crop&q=80'}
            alt={currentUser?.businessName || currentUser?.name}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-forest-500/20 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-2xl font-black text-slate-900">
                {currentUser?.businessName || `${currentUser?.name} Merchant Portal`}
              </h1>
              <span className="p-1 rounded-md bg-emerald-100 text-emerald-800" title="Verified Business Partner">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
              <span>{currentUser?.address || 'Connaught Place, New Delhi'}</span>
              <span>•</span>
              <span className="capitalize font-semibold text-forest-700">{currentUser?.businessType || 'Artisan Bakery'}</span>
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => setIsPickupModalOpen(true)}
            className="flex-1 md:flex-none px-4 py-2.5 sm:py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2"
          >
            <QrCode className="w-4 h-4 text-forest-600" />
            <span>Verify Pick Up / Camera</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex-1 md:flex-none px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold shadow-md shadow-forest-600/20 transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Surplus</span>
          </button>
        </div>
      </div>

      {/* Sustainability Impact Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <StatCard
          label="Food Rescued"
          value={currentUser?.impact.mealsSaved || 340}
          unit="Meals"
          icon={<PackageCheck className="w-5 h-5 text-forest-600" />}
          description="Diverted from waste"
        />
        <StatCard
          label="CO₂e Avoided"
          value={currentUser?.impact.co2SavedKg || 850.0}
          unit="kg CO₂"
          icon={<Leaf className="w-5 h-5 text-emerald-600" />}
          description="Carbon footprint offset"
        />
        <StatCard
          label="Value Recovered"
          value={`₹${((currentUser?.impact.mealsSaved || 340) * 120).toLocaleString('en-IN')}`}
          icon={<IndianRupee className="w-5 h-5 text-amber-600" />}
          description="Surplus value recovered"
        />
        <StatCard
          label="Active Surplus"
          value={allBizListings.filter(l => l.status === 'available').length}
          unit="Offers"
          icon={<Store className="w-5 h-5 text-blue-600" />}
          description={`${pendingReservations.length} pending pickups`}
        />
      </div>

      {/* AI Waste Analytics & Operational Intelligence */}
      {wasteInsights && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-forest-900 via-slate-900 to-slate-950 text-white border border-forest-700/50 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sprout-400/20 text-sprout-300 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4 text-sprout-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  AI Waste Analytics & Prevention Intelligence
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-sprout-400/20 text-sprout-300 border border-sprout-400/30">
                    Smart Advisory
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Automated waste pattern diagnosis & surplus revenue optimization
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
              <span className="text-slate-400">Peak Surplus Day:</span>
              <span className="font-extrabold text-amber-300 bg-white/10 px-2.5 py-1 rounded-lg">
                {wasteInsights.peakSurplusDay}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {wasteInsights.aiExplanation}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {wasteInsights.actionableTips.map((tip, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-1"
              >
                <span className="text-[10px] font-bold text-sprout-300 uppercase tracking-wider block">
                  Actionable Strategy #{idx + 1}
                </span>
                <p className="text-xs text-slate-200 leading-snug">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fast In-Page Pickup Confirmation Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-forest-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-2xl bg-forest-600 text-white flex items-center justify-center font-bold shrink-0">
            <QrCode className="w-5 h-5 text-sprout-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold">Quick Pickup Code Verification</h4>
            <p className="text-xs text-slate-400">Enter customer 6-digit code or open camera scanner</p>
          </div>
        </div>

        <form onSubmit={handleQuickVerify} className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            value={quickCodeInput}
            onChange={(e) => setQuickCodeInput(e.target.value.toUpperCase())}
            placeholder="e.g. FL-9421"
            className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 font-mono font-bold text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-sprout-400 uppercase flex-1 md:w-44"
          />
          <button
            type="submit"
            disabled={isVerifying || !quickCodeInput}
            className="px-4 sm:px-5 py-2.5 rounded-xl bg-forest-500 hover:bg-forest-400 text-white text-xs font-bold transition-colors disabled:opacity-40 whitespace-nowrap"
          >
            {isVerifying ? 'Verifying...' : 'Confirm'}
          </button>
        </form>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('listings')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'listings'
              ? 'bg-forest-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          My Surplus Listings ({allBizListings.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('reservations')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'reservations'
              ? 'bg-forest-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>Pending Pickups</span>
          {pendingReservations.length > 0 && (
            <span className="px-1.5 py-0.5 bg-amber-500 text-slate-950 font-black rounded-full text-[10px]">
              {pendingReservations.length}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'history'
              ? 'bg-forest-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Collected Orders ({collectedReservations.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          {allBizListings.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-4">
              <Store className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Surplus Listings Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Post your unsold meals, pastries, or groceries in under 30 seconds!
              </p>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-forest-600 text-white text-xs font-bold"
              >
                Create Listing Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {allBizListings.map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-soft space-y-3.5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100">
                      <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-slate-900 shadow-md">
                          {item.type === 'donation' ? 'DONATION' : `₹${item.discountedPrice}`}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {item.category}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {item.quantity} {item.quantityUnit} left
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{item.description}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
                      <div className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-forest-600" />
                        <span>Pickup: {item.pickupWindow.date} {item.pickupWindow.startTime} - {item.pickupWindow.endTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedListing(item);
                        setIsDetailsModalOpen(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsPickupModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Verify Code</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pending Reservations Tab with Prominent Quick Code and Live QR */}
      {activeTab === 'reservations' && (
        <div className="space-y-4">
          {pendingReservations.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">All Pickups Up To Date!</h3>
              <p className="text-xs text-slate-500">No customers currently waiting for uncollected reservations.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingReservations.map(res => (
                <div
                  key={res.id}
                  className="bg-white rounded-3xl border-2 border-forest-200 p-5 shadow-soft flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2 flex-1">
                      {/* Prominent Quick Pick-up Code */}
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Quick Pick-Up Code
                        </span>
                        <span className="font-mono font-black text-xl sm:text-2xl text-forest-900 bg-forest-50 border border-forest-300 px-3 py-1 rounded-xl inline-block mt-0.5 shadow-2xs">
                          {res.pickupCode}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 mt-1">{res.listing.title}</h4>
                      <p className="text-xs text-slate-500">
                        Customer: <strong>{res.userName}</strong> • {res.quantityReserved} {res.listing.quantityUnit} (₹{res.totalPaid.toFixed(0)})
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-forest-600" />
                        <span>{res.listing.pickupWindow.date} {res.listing.pickupWindow.startTime} - {res.listing.pickupWindow.endTime}</span>
                      </p>
                    </div>

                    {/* QR Code Component */}
                    <div className="shrink-0">
                      <QRCodeDisplay value={res.pickupCode} size={84} showCode={false} />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-forest-700 bg-forest-50 px-2.5 py-1 rounded-lg">
                      Ready for Hand-off
                    </span>

                    <button
                      type="button"
                      onClick={() => handleVerifyCode(res.pickupCode)}
                      disabled={isVerifying}
                      className="px-5 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isVerifying ? 'Verifying...' : 'Confirm Hand-Off'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-soft divide-y divide-slate-100">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-600 uppercase tracking-wider">
            Verified Hand-offs & Waste Reduction Records
          </div>
          {collectedReservations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">No completed orders recorded yet.</div>
          ) : (
            collectedReservations.map(res => (
              <div key={res.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800">{res.listing.title}</span>
                  <p className="text-slate-500">Collected by {res.userName} • Code {res.pickupCode}</p>
                </div>
                <div className="text-right">
                  <span className="text-emerald-700 font-bold">~{res.listing.weightKgEstimate * 2.5} kg CO₂ Saved</span>
                  <p className="text-slate-400 text-[11px]">{new Date(res.collectedAt || res.reservedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};
