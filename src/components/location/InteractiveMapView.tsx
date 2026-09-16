import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Compass,
  Store,
  HeartHandshake,
  Sparkles,
  Star,
  Clock,
  Footprints,
  SlidersHorizontal,
  ChevronRight,
  Info,
  Car,
  Bike
} from 'lucide-react';
import { FoodListing } from '../../types';
import { useLocation } from '../../context/LocationContext';

interface InteractiveMapViewProps {
  listings: FoodListing[];
  onSelectListing: (listing: FoodListing) => void;
  onOpenDirections: (listing: FoodListing) => void;
}

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({
  listings,
  onSelectListing,
  onOpenDirections
}) => {
  const {
    userLocation,
    selectedRadiusKm,
    setSelectedRadiusKm,
    calculateDistanceTo,
    getTransitEtasTo,
    setIsLocationModalOpen
  } = useLocation();

  const [activeListingId, setActiveListingId] = useState<string | null>(listings[0]?.id || null);

  const activeListing = listings.find(l => l.id === activeListingId) || listings[0];

  // Map coordinate relative offset to SVG container %
  const calculatePinPercentage = (listingLat: number, listingLng: number, index: number) => {
    // Relative latitude & longitude deltas from active user center
    const dLat = listingLat - userLocation.coordinates.lat;
    const dLng = listingLng - userLocation.coordinates.lng;

    // Scale delta (approx 0.01 deg ~= 1.1 km) to percentage bounds
    // Center is 50%, 50%
    const scale = 2500 / Math.max(2, selectedRadiusKm);
    let left = 50 + dLng * scale;
    let top = 50 - dLat * scale;

    // Keep pins within bounds [10%, 90%]
    left = Math.max(12, Math.min(88, left));
    top = Math.max(14, Math.min(84, top));

    return { left: `${left}%`, top: `${top}%` };
  };

  const radiusPresets = [1, 3, 5, 10];

  return (
    <div className="relative w-full h-[580px] rounded-3xl overflow-hidden border border-slate-200 shadow-soft bg-slate-950 flex flex-col justify-between">
      
      {/* Background Stylized Vector Map Grid */}
      <div className="absolute inset-0 bg-[#0b1329] overflow-hidden">
        {/* SVG Street Grid Lines */}
        <svg className="w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="smallGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
            </pattern>
            <pattern id="majorGrid" width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M 120 0 L 0 0 0 120" fill="none" stroke="#22c55e" strokeWidth="1.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#smallGrid)" />
          <rect width="100%" height="100%" fill="url(#majorGrid)" />

          {/* Stylized Bay & Coastline representation */}
          <path
            d="M 0 0 Q 350 200, 600 120 T 1400 450 L 1400 0 Z"
            fill="#0369a1"
            opacity="0.35"
          />
        </svg>

        {/* Dynamic Radius Circle Boundary Visualization */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-forest-500/30 bg-forest-500/5 pointer-events-none transition-all duration-700"
          style={{
            width: `${Math.min(90, Math.max(30, selectedRadiusKm * 8.5))}%`,
            aspectRatio: '1/1'
          }}
        >
          <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold font-mono text-sprout-400/70 bg-slate-950/80 px-2 py-0.5 rounded-full border border-forest-800">
            {selectedRadiusKm} km Search Zone
          </span>
        </div>
      </div>

      {/* Top Map Control Overlay */}
      <div className="relative z-20 p-4 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-transparent">
        
        {/* User Location Pill */}
        <button
          onClick={() => setIsLocationModalOpen(true)}
          className="px-3.5 py-2 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 text-xs font-bold flex items-center gap-2 backdrop-blur-md shadow-lg transition-all"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-sprout-400 animate-pulse" />
          <span className="truncate max-w-[180px] sm:max-w-xs">{userLocation.label}</span>
          <span className="text-[10px] text-sprout-300 underline font-normal">Change</span>
        </button>

        {/* Radius Filter Buttons on Map */}
        <div className="flex items-center bg-slate-900/90 border border-slate-700/80 p-1 rounded-2xl backdrop-blur-md shadow-lg">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 hidden sm:inline">
            Radius:
          </span>
          {radiusPresets.map(r => (
            <button
              key={r}
              onClick={() => setSelectedRadiusKm(r)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                selectedRadiusKm === r
                  ? 'bg-forest-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {r} km
            </button>
          ))}
        </div>
      </div>

      {/* Center User GPS Pin */}
      <div
        className="absolute z-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
      >
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center ring-4 ring-sky-500/40 shadow-xl animate-pulse">
            <Navigation className="w-4 h-4" />
          </div>
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded-md border border-slate-700 shadow-md">
            You ({userLocation.label.split('/')[0]})
          </span>
        </div>
      </div>

      {/* Listing Pins on Map */}
      {listings.map((listing, index) => {
        const isSelected = listing.id === activeListingId;
        const isDonation = listing.type === 'donation';
        const pinPos = calculatePinPercentage(listing.location.lat, listing.location.lng, index);
        const distKm = calculateDistanceTo({ lat: listing.location.lat, lng: listing.location.lng });

        return (
          <div
            key={listing.id}
            onClick={() => setActiveListingId(listing.id)}
            className={`absolute z-20 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-125 ${
              isSelected ? 'scale-125 z-30' : 'opacity-90'
            }`}
            style={{ left: pinPos.left, top: pinPos.top }}
          >
            <div className="relative group flex flex-col items-center">
              
              {/* Pin Bubble */}
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl shadow-xl border-2 transition-all ${
                  isSelected
                    ? 'bg-white text-slate-950 border-forest-500 ring-4 ring-forest-500/30'
                    : isDonation
                    ? 'bg-emerald-600 text-white border-emerald-400'
                    : 'bg-amber-500 text-slate-950 border-amber-300'
                }`}
              >
                {isDonation ? (
                  <HeartHandshake className="w-3.5 h-3.5" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span className="text-xs font-black">
                  {isDonation ? 'FREE' : `₹${listing.discountedPrice.toFixed(0)}`}
                </span>
              </div>

              {/* Pin Arrow Pointer */}
              <div
                className={`w-2.5 h-2.5 transform rotate-45 -mt-1.5 border-r border-b ${
                  isSelected
                    ? 'bg-white border-forest-500'
                    : isDonation
                    ? 'bg-emerald-600 border-emerald-400'
                    : 'bg-amber-500 border-amber-300'
                }`}
              />

              {/* Tooltip on Hover */}
              <div className="hidden group-hover:block absolute bottom-full mb-2 whitespace-nowrap bg-slate-950 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-slate-700 shadow-xl pointer-events-none">
                {listing.title} • {distKm} km
              </div>
            </div>
          </div>
        );
      })}

      {/* Bottom Store Details Preview Card / Drawer */}
      {activeListing && (
        <div className="relative z-20 p-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent">
          <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-2xl p-4 sm:p-5 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex gap-4 items-start">
              <img
                src={activeListing.images[0]}
                alt={activeListing.title}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 border border-slate-100 shadow-2xs"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                    activeListing.type === 'donation' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {activeListing.type === 'donation' ? 'FREE DONATION' : `${Math.round(((activeListing.originalPrice - activeListing.discountedPrice)/activeListing.originalPrice)*100)}% OFF`}
                  </span>

                  <span className="text-xs font-black text-forest-700 bg-forest-50 px-2.5 py-0.5 rounded-lg border border-forest-200 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-forest-600" />
                    {calculateDistanceTo({ lat: activeListing.location.lat, lng: activeListing.location.lng })} km
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 truncate mt-1">
                  {activeListing.title}
                </h4>
                <p className="text-xs text-slate-500 truncate font-semibold text-forest-700">
                  {activeListing.businessName} • {activeListing.businessAddress}
                </p>

                {/* Transit ETA Pill */}
                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <Footprints className="w-3.5 h-3.5" />
                    {getTransitEtasTo({ lat: activeListing.location.lat, lng: activeListing.location.lng }).walking}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {activeListing.pickupWindow.startTime} - {activeListing.pickupWindow.endTime}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                  <span className="text-base font-black text-slate-900">
                    {activeListing.type === 'donation' ? 'FREE' : `₹${activeListing.discountedPrice.toFixed(0)}`}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenDirections(activeListing)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <Navigation className="w-3 h-3 text-forest-600" />
                      <span>Directions</span>
                    </button>

                    <button
                      onClick={() => onSelectListing(activeListing)}
                      className="px-4 py-1.5 bg-forest-600 hover:bg-forest-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                    >
                      View & Reserve
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
