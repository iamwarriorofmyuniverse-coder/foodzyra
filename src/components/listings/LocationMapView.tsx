import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Store, HeartHandshake, Sparkles, Star, Clock } from 'lucide-react';
import { FoodListing } from '../../types';

interface LocationMapViewProps {
  listings: FoodListing[];
  onSelectListing: (listing: FoodListing) => void;
}

export const LocationMapView: React.FC<LocationMapViewProps> = ({ listings, onSelectListing }) => {
  const [activePinId, setActivePinId] = useState<string | null>(listings[0]?.id || null);

  const activeListing = listings.find(l => l.id === activePinId) || listings[0];

  // Map coordinate bounds mapping
  // We'll normalize San Francisco coordinates to CSS percentage pins
  const getPinPosition = (lat: number, lng: number, index: number) => {
    // Generate deterministic visually distributed pin locations on the styled map container
    const positions = [
      { left: '42%', top: '38%' },
      { left: '28%', top: '54%' },
      { left: '64%', top: '28%' },
      { left: '58%', top: '44%' },
      { left: '48%', top: '68%' },
      { left: '72%', top: '58%' },
      { left: '35%', top: '25%' },
      { left: '20%', top: '35%' },
    ];
    return positions[index % positions.length];
  };

  return (
    <div className="relative w-full h-[540px] rounded-3xl overflow-hidden border border-slate-200 shadow-soft bg-slate-900">
      {/* Map Graphic Canvas / Background */}
      <div className="absolute inset-0 bg-[#0f172a] opacity-95">
        {/* SVG stylized street grid */}
        <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.75" />
            </pattern>
            <pattern id="streets" width="160" height="160" patternUnits="userSpaceOnUse">
              <path d="M 160 0 L 0 0 0 160" fill="none" stroke="#22c55e" strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <rect width="100%" height="100%" fill="url(#streets)" />
          {/* Water body simulation */}
          <path
            d="M 0 0 Q 300 180, 500 100 T 1200 400 L 1200 0 Z"
            fill="#0369a1"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* Map Overlay Controls */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 text-white border border-slate-700/80 backdrop-blur-md text-xs font-semibold flex items-center gap-2 shadow-lg">
          <Compass className="w-4 h-4 text-sprout-400 animate-spin-slow" />
          <span>Live Radar • San Francisco & Bay Area</span>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-xs font-semibold backdrop-blur-md">
          {listings.length} Pins Active
        </div>
      </div>

      {/* User Center Pin */}
      <div
        className="absolute z-20 flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
        style={{ left: '46%', top: '48%' }}
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center ring-4 ring-sky-500/30 shadow-lg animate-pulse">
            <Navigation className="w-4 h-4" />
          </div>
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded-md border border-slate-700 shadow-md">
            You are here
          </span>
        </div>
      </div>

      {/* Food Listing Pins */}
      {listings.map((listing, index) => {
        const pos = getPinPosition(listing.location.lat, listing.location.lng, index);
        const isSelected = listing.id === activePinId;
        const isDonation = listing.type === 'donation';

        return (
          <div
            key={listing.id}
            onClick={() => setActivePinId(listing.id)}
            className={`absolute z-20 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-125 ${
              isSelected ? 'scale-125 z-30' : 'opacity-90'
            }`}
            style={{ left: pos.left, top: pos.top }}
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
                  {isDonation ? 'FREE' : `\$${listing.discountedPrice}`}
                </span>
              </div>

              {/* Pin Triangle Pointer */}
              <div
                className={`w-2.5 h-2.5 transform rotate-45 -mt-1.5 border-r border-b ${
                  isSelected
                    ? 'bg-white border-forest-500'
                    : isDonation
                    ? 'bg-emerald-600 border-emerald-400'
                    : 'bg-amber-500 border-amber-300'
                }`}
              />

              {/* Tooltip on hover */}
              <div className="hidden group-hover:block absolute bottom-full mb-2 whitespace-nowrap bg-slate-950 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-slate-700 shadow-xl pointer-events-none">
                {listing.title} • {listing.location.distanceKm}km away
              </div>
            </div>
          </div>
        );
      })}

      {/* Active Pin Card Drawer Preview */}
      {activeListing && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-30 bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex gap-3 items-start">
            <img
              src={activeListing.images[0]}
              alt={activeListing.title}
              className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-100"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  activeListing.type === 'donation' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                }`}>
                  {activeListing.type === 'donation' ? 'FREE DONATION' : `${Math.round(((activeListing.originalPrice - activeListing.discountedPrice)/activeListing.originalPrice)*100)}% OFF`}
                </span>
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-forest-600" />
                  {activeListing.location.distanceKm} km
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 truncate mt-1">
                {activeListing.title}
              </h4>
              <p className="text-[11px] text-slate-500 truncate">
                {activeListing.businessName}
              </p>
              
              <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                <span className="text-sm font-black text-slate-900">
                  {activeListing.type === 'donation' ? 'FREE' : `₹${activeListing.discountedPrice.toFixed(0)}`}
                </span>
                <button
                  onClick={() => onSelectListing(activeListing)}
                  className="px-3 py-1 bg-forest-600 hover:bg-forest-700 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  View Food & Reserve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
