import React, { useState } from 'react';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  Compass,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { useFoodLoop } from '../context/FoodLoopContext';
import { useAuth } from '../context/AuthContext';
import { ReservationCard } from '../components/reservations/ReservationCard';

interface ReservationsPageProps {
  onNavigate: (page: string) => void;
}

export const ReservationsPage: React.FC<ReservationsPageProps> = ({ onNavigate }) => {
  const { reservations } = useFoodLoop();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'pending' | 'completed' | 'all'>('pending');

  // Filter reservations for current user
  const userReservations = reservations.filter(r => r.userId === currentUser?.id || currentUser?.role === 'admin');

  const pending = userReservations.filter(r => r.status === 'pending_pickup');
  const completed = userReservations.filter(r => r.status === 'collected');
  const cancelled = userReservations.filter(r => r.status === 'cancelled');

  const displayed =
    activeTab === 'pending'
      ? pending
      : activeTab === 'completed'
      ? completed
      : userReservations;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Orders & Reservations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access your 6-digit verification pickup codes and track rescued meals
          </p>
        </div>

        <button
          onClick={() => onNavigate('customer')}
          className="px-5 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold transition-all shadow-xs inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Browse More Food</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'bg-forest-100 text-forest-900 font-extrabold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4 text-forest-600" />
          <span>Ready for Pickup ({pending.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'completed'
              ? 'bg-forest-100 text-forest-900 font-extrabold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Collected ({completed.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'all'
              ? 'bg-forest-100 text-forest-900 font-extrabold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          All ({userReservations.length})
        </button>
      </div>

      {/* Reservation Cards List */}
      <div className="space-y-6">
        {displayed.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4 shadow-soft my-8">
            <div className="w-16 h-16 rounded-2xl bg-forest-50 text-forest-600 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">No Reservations Found</h3>
              <p className="text-xs text-slate-500 mt-1">
                You have no active orders in this view. Browse nearby surplus food to save delicious meals!
              </p>
            </div>
            <button
              onClick={() => onNavigate('customer')}
              className="px-6 py-2.5 rounded-xl bg-forest-600 text-white font-bold text-xs inline-flex items-center gap-2 shadow-md hover:bg-forest-700"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          displayed.map(res => (
            <ReservationCard key={res.id} reservation={res} />
          ))
        )}
      </div>

    </div>
  );
};
