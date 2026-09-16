import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Copy,
  Check,
  QrCode,
  MapPin,
  Clock,
  Navigation,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { Reservation, FoodListing } from '../../types';

import { QRCodeDisplay } from '../common/QRCodeDisplay';

interface ReservationConfirmationModalProps {
  reservation: Reservation | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenDirections?: (listing: FoodListing) => void;
  onViewOrders?: () => void;
}

export const ReservationConfirmationModal: React.FC<ReservationConfirmationModalProps> = ({
  reservation,
  isOpen,
  onClose,
  onOpenDirections,
  onViewOrders
}) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(true);

  if (!isOpen || !reservation) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(reservation.pickupCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Celebration Header Banner */}
        <div className="bg-gradient-to-br from-forest-800 via-forest-900 to-slate-950 p-6 sm:p-8 text-white text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-sprout-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-forest-500/20 rounded-full blur-xl pointer-events-none" />

          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-400/40 text-sprout-300 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle2 className="w-9 h-9 text-sprout-300" />
          </div>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sprout-400/20 border border-sprout-400/30 text-sprout-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Reservation Confirmed
          </span>

          <h2 className="text-2xl font-black tracking-tight text-white">
            Surplus Food Rescued!
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
            Your pickup token has been registered with the merchant. Present this code at the store counter.
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          
          {/* 6-Digit Verification Token Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-forest-50 via-sprout-50/50 to-white border-2 border-forest-300/80 shadow-soft text-center space-y-3">
            <span className="text-[11px] font-extrabold text-forest-700 uppercase tracking-widest block">
              Pickup Verification Code
            </span>
            
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl sm:text-4xl font-black font-mono text-forest-950 tracking-widest bg-white px-5 py-2.5 rounded-2xl border border-forest-200 shadow-xs">
                {reservation.pickupCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-3 rounded-2xl bg-white border border-forest-200 text-forest-700 hover:bg-forest-100/60 shadow-xs transition-colors"
                title="Copy Pickup Code"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            {/* QR Code Toggle / Display */}
            {showQr ? (
              <div className="pt-2 flex flex-col items-center gap-2">
                <QRCodeDisplay value={reservation.pickupCode} size={150} showCode={false} />
                <button
                  onClick={() => setShowQr(false)}
                  className="text-[11px] font-bold text-forest-700 hover:text-forest-900 mt-1"
                >
                  Hide QR Code
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowQr(true)}
                className="text-xs font-bold text-forest-700 hover:text-forest-900 inline-flex items-center gap-1.5"
              >
                <QrCode className="w-3.5 h-3.5" /> Show Pickup QR Code
              </button>
            )}
          </div>

          {/* Reserved Food & Merchant Summary */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Order Summary
              </span>
              <span className="text-xs font-bold text-forest-700">
                {reservation.quantityReserved} {reservation.listing?.quantityUnit || 'Item(s)'}
              </span>
            </div>

            <div className="flex gap-3">
              {reservation.listing?.images?.[0] && (
                <img
                  src={reservation.listing.images[0]}
                  alt={reservation.listing.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {reservation.listing?.title}
                </h4>
                <p className="text-xs font-semibold text-forest-700 mt-0.5 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {reservation.listing?.businessName}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{reservation.listing?.businessAddress}</span>
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-slate-600">
                <Clock className="w-3.5 h-3.5 text-forest-600" />
                <span>Pickup: <strong>{reservation.listing?.pickupWindow?.date}, {reservation.listing?.pickupWindow?.startTime} - {reservation.listing?.pickupWindow?.endTime}</strong></span>
              </div>
              <span className="font-extrabold text-slate-900">
                {reservation.totalPaid === 0 ? 'FREE DONATION' : `₹${reservation.totalPaid.toFixed(0)}`}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {onOpenDirections && reservation.listing && (
              <button
                onClick={() => {
                  onClose();
                  onOpenDirections(reservation.listing);
                }}
                className="w-full py-3 px-4 rounded-2xl bg-forest-600 hover:bg-forest-700 text-white text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Pickup Route & Transit ETAs</span>
              </button>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onClose();
                  if (onViewOrders) onViewOrders();
                }}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>My Orders</span>
              </button>

              <button
                onClick={onClose}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Done</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
