import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  Navigation,
  Compass,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Footprints,
  Bike,
  Car,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { FoodListing } from '../../types';
import { useLocation } from '../../context/LocationContext';
import { useToast } from '../../context/ToastContext';

interface PickupDirectionsModalProps {
  listing: FoodListing | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PickupDirectionsModal: React.FC<PickupDirectionsModalProps> = ({
  listing,
  isOpen,
  onClose
}) => {
  const { calculateDistanceTo, getTransitEtasTo, userLocation } = useLocation();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !listing) return null;

  const targetCoords = {
    lat: listing.location.lat,
    lng: listing.location.lng
  };

  const distanceKm = calculateDistanceTo(targetCoords);
  const etas = getTransitEtasTo(targetCoords);

  const copyAddress = () => {
    navigator.clipboard.writeText(`${listing.businessName}, ${listing.businessAddress}`);
    setCopied(true);
    showToast('success', 'Address Copied', 'Store location copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${listing.businessName} ${listing.businessAddress}`
    )}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-forest-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Navigation className="w-5 h-5 text-sprout-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Pickup Location & Route</h3>
              <p className="text-xs text-slate-500">Live navigation ETA from {userLocation.label}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Store Card Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-forest-50 to-sprout-50/40 border border-forest-200/80 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 font-black text-slate-900 text-base">
                  <span>{listing.businessName}</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-forest-600 shrink-0" />
                  <span>{listing.businessAddress}</span>
                </p>
              </div>

              <span className="px-3 py-1 rounded-xl bg-forest-600 text-white text-xs font-bold shrink-0 shadow-xs">
                {distanceKm} km away
              </span>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={copyAddress}
                className="px-3 py-1.5 rounded-xl bg-white border border-forest-200 hover:bg-forest-100 text-forest-800 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Address'}</span>
              </button>

              <button
                onClick={openGoogleMaps}
                className="px-3.5 py-1.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Maps</span>
              </button>
            </div>
          </div>

          {/* Transit Modes ETA Comparison */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Estimated Transit Times (from {userLocation.label})
            </span>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <Footprints className="w-5 h-5 text-emerald-600 mx-auto" />
                <span className="text-xs font-extrabold text-slate-900 block">{etas.walking}</span>
                <span className="text-[10px] text-slate-400 font-medium uppercase">Walking</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <Bike className="w-5 h-5 text-sky-600 mx-auto" />
                <span className="text-xs font-extrabold text-slate-900 block">{etas.biking}</span>
                <span className="text-[10px] text-slate-400 font-medium uppercase">Cycling</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <Car className="w-5 h-5 text-amber-600 mx-auto" />
                <span className="text-xs font-extrabold text-slate-900 block">{etas.driving}</span>
                <span className="text-[10px] text-slate-400 font-medium uppercase">Driving</span>
              </div>
            </div>
          </div>

          {/* Pickup Window Details */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-forest-600" />
              <span>Mandatory Pickup Window</span>
            </div>
            <p className="text-base font-black text-slate-900">
              {listing.pickupWindow.date}, {listing.pickupWindow.startTime} – {listing.pickupWindow.endTime}
            </p>
            <p className="text-xs text-slate-500">
              Please arrive before {listing.pickupWindow.endTime} so the merchant can prepare your hand-off.
            </p>
          </div>

          {/* Step-by-Step Pickup Guide */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              How to Collect Your Surplus Food
            </span>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <div className="w-6 h-6 rounded-full bg-forest-100 text-forest-800 font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Bring a reusable tote bag</span>
                  <p className="text-slate-500 mt-0.5">Help us reduce packaging waste by bringing your own container or grocery bag.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <div className="w-6 h-6 rounded-full bg-forest-100 text-forest-800 font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Present your 6-digit confirmation code</span>
                  <p className="text-slate-500 mt-0.5">Show your pickup code (found in My Reservations) to store staff upon arrival.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <div className="w-6 h-6 rounded-full bg-forest-100 text-forest-800 font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Enjoy delicious food & celebrate CO₂ saved</span>
                  <p className="text-slate-500 mt-0.5">Your personal impact metrics will automatically update in your profile.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-forest-600 text-white font-bold text-xs hover:bg-forest-700 transition-colors shadow-xs"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};
