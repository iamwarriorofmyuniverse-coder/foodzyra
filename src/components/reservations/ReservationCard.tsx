import React, { useState } from 'react';
import {
  QrCode,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  ShieldCheck,
  Navigation
} from 'lucide-react';
import { Reservation } from '../../types';
import { useFoodLoop } from '../../context/FoodLoopContext';
import { QRCodeDisplay } from '../common/QRCodeDisplay';

interface ReservationCardProps {
  reservation: Reservation;
}

export const ReservationCard: React.FC<ReservationCardProps> = ({ reservation }) => {
  const { cancelUserReservation } = useFoodLoop();
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(reservation.pickupCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openGoogleMaps = () => {
    const lat = reservation.listing?.location?.lat || 28.6315;
    const lng = reservation.listing?.location?.lng || 77.2167;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const isPending = reservation.status === 'pending_pickup';
  const isCollected = reservation.status === 'collected';
  const isCancelled = reservation.status === 'cancelled';

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft overflow-hidden transition-all duration-300 hover:shadow-md">
      
      {/* Top Banner Status */}
      <div className={`px-5 py-2.5 flex items-center justify-between text-xs font-bold ${
        isPending ? 'bg-amber-50 text-amber-800 border-b border-amber-100' :
        isCollected ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-100' :
        'bg-rose-50 text-rose-800 border-b border-rose-100'
      }`}>
        <div className="flex items-center gap-1.5">
          {isPending && <Clock className="w-4 h-4 text-amber-600 animate-pulse" />}
          {isCollected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          {isCancelled && <XCircle className="w-4 h-4 text-rose-600" />}
          <span>
            {isPending ? 'READY FOR PICKUP' : isCollected ? 'COLLECTED & RESCUED' : 'CANCELLED'}
          </span>
        </div>
        <span className="text-[11px] font-medium text-slate-500">
          Order #{reservation.id.toUpperCase().slice(-6)}
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
        
        {/* Food Info & Store Row */}
        <div className="flex gap-3 sm:gap-4">
          <img
            src={reservation.listing.images[0]}
            alt={reservation.listing.title}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 border border-slate-100 shadow-2xs"
          />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {reservation.listing.category} • {reservation.quantityReserved} {reservation.listing.quantityUnit}
            </span>
            <h3 className="text-base font-bold text-slate-900 truncate">
              {reservation.listing.title}
            </h3>
            <p className="text-xs font-semibold text-forest-700 mt-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {reservation.listing.businessName}
            </p>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{reservation.listing.businessAddress}</span>
            </p>
          </div>
        </div>

        {/* 6-Digit Pickup Token Box */}
        {isPending && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-forest-50 to-sprout-50/40 border border-forest-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-[10px] font-bold text-forest-700 uppercase tracking-wider block">
                Verification Pickup Code
              </span>
              <div className="flex items-center gap-3 mt-1 justify-center sm:justify-start">
                <span className="text-2xl sm:text-3xl font-black text-forest-900 tracking-wider font-mono">
                  {reservation.pickupCode}
                </span>
                <button
                  type="button"
                  onClick={copyCode}
                  className="p-1.5 rounded-lg bg-white border border-forest-200 text-forest-700 hover:bg-forest-100/60 shadow-2xs"
                  title="Copy pickup code"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openGoogleMaps}
                className="px-3.5 py-2 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Navigate</span>
              </button>

              <button
                type="button"
                onClick={() => setShowQr(!showQr)}
                className="px-3.5 py-2 rounded-xl bg-white border border-forest-300 text-forest-800 text-xs font-bold hover:bg-forest-50 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <QrCode className="w-3.5 h-3.5 text-forest-600" />
                <span>{showQr ? 'Hide QR' : 'Show QR'}</span>
              </button>
            </div>
          </div>
        )}

        {/* QR Code Expansion */}
        {showQr && isPending && (
          <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col items-center gap-3 animate-in fade-in duration-200">
            <QRCodeDisplay value={reservation.pickupCode} size={150} showCode={false} />
            <p className="text-xs font-mono text-slate-300">{reservation.pickupCode}</p>
            <p className="text-[11px] text-slate-400 text-center">
              Present this QR code or 6-digit code at the store counter.
            </p>
          </div>
        )}

        {/* Pickup Logistics Details */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Pickup Window</span>
            <span className="font-bold text-slate-800 mt-0.5 block">
              {reservation.listing.pickupWindow.date}, {reservation.listing.pickupWindow.startTime} - {reservation.listing.pickupWindow.endTime}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Total Paid</span>
            <span className="font-bold text-slate-800 mt-0.5 block">
              {reservation.totalPaid === 0 ? 'FREE DONATION' : `₹${reservation.totalPaid.toFixed(0)}`}
            </span>
          </div>
        </div>

        {/* Bottom Actions */}
        {isPending && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => cancelUserReservation(reservation.id)}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700"
            >
              Cancel Reservation
            </button>
            <span className="text-xs text-slate-400">
              Reserved at {new Date(reservation.reservedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}

      </div>
    </div>
  );
};
