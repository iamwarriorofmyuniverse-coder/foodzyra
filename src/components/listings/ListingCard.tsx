import React from 'react';
import {
  MapPin,
  Clock,
  Star,
  Leaf,
  HeartHandshake,
  ShoppingBag,
  Sparkles,
  Footprints
} from 'lucide-react';
import { FoodListing } from '../../types';
import { useLocation } from '../../context/LocationContext';

interface ListingCardProps {
  listing: FoodListing;
  onSelect: (listing: FoodListing) => void;
  onOpenDirections?: (listing: FoodListing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onSelect, onOpenDirections }) => {
  const { calculateDistanceTo, getTransitEtasTo } = useLocation();

  const isDonation = listing.type === 'donation';
  const discountPercent = listing.originalPrice > 0 && !isDonation
    ? Math.round(((listing.originalPrice - listing.discountedPrice) / listing.originalPrice) * 100)
    : 0;

  const isLowStock = listing.quantity <= 2;

  // Real-time Haversine distance from current user coordinates
  const distanceKm = calculateDistanceTo({
    lat: listing.location.lat,
    lng: listing.location.lng
  });

  const etas = getTransitEtasTo({
    lat: listing.location.lat,
    lng: listing.location.lng
  });

  return (
    <div
      onClick={() => onSelect(listing)}
      className="group bg-white rounded-3xl border border-slate-200/90 shadow-soft hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Card Header & Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          <img
            src={listing.images[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

          {/* Type / Discount Sticker */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {isDonation ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-md backdrop-blur-xs">
                <HeartHandshake className="w-3.5 h-3.5" /> FREE DONATION
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-md">
                <Sparkles className="w-3.5 h-3.5" /> {discountPercent}% OFF
              </span>
            )}
            <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-black/60 text-white font-semibold text-[11px] backdrop-blur-md">
              {listing.category}
            </span>
          </div>

          {/* Distance Indicator */}
          <div className="absolute top-3 right-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenDirections) onOpenDirections(listing);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/95 hover:bg-white text-slate-800 text-xs font-black shadow-md backdrop-blur-xs transition-colors"
              title="Click to view directions and walking time"
            >
              <MapPin className="w-3.5 h-3.5 text-forest-600" />
              <span>{distanceKm} km</span>
            </button>
          </div>

          {/* Business Info Banner */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
            <div className="flex items-center gap-2 truncate">
              {listing.businessAvatar && (
                <img
                  src={listing.businessAvatar}
                  alt={listing.businessName}
                  className="w-6 h-6 rounded-full object-cover border border-white/60 shadow-xs"
                />
              )}
              <span className="text-xs font-semibold drop-shadow-sm truncate">
                {listing.businessName}
              </span>
            </div>
            {listing.businessRating && (
              <div className="flex items-center gap-1 text-xs font-bold bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs shrink-0">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>{listing.businessRating}</span>
              </div>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 space-y-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-forest-700 transition-colors line-clamp-1">
              {listing.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Walking Transit ETA Pill */}
          <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 w-fit">
            <Footprints className="w-3.5 h-3.5" />
            <span>~{etas.walking}</span>
          </div>

          {/* Dietary Tags */}
          {listing.dietaryTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {listing.dietaryTags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-forest-50 text-forest-800 border border-forest-100"
                >
                  {tag}
                </span>
              ))}
              {listing.dietaryTags.length > 3 && (
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  +{listing.dietaryTags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Pickup Window & Stock Info */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-forest-600" />
              <span>
                {listing.pickupWindow.date} {listing.pickupWindow.startTime} - {listing.pickupWindow.endTime}
              </span>
            </div>
            <div className="flex items-center gap-1 font-semibold">
              <span className={`text-[11px] px-2 py-0.5 rounded-md ${
                isLowStock ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200' : 'bg-slate-100 text-slate-700'
              }`}>
                {listing.quantity} {listing.quantityUnit} left
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer: Pricing & Action */}
      <div className="p-4 sm:p-5 pt-0">
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div>
            {isDonation ? (
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-emerald-600">FREE</span>
                <span className="text-xs text-slate-400 line-through">
                  ₹{listing.originalPrice.toFixed(0)}
                </span>
              </div>
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold text-slate-900">
                  ₹{listing.discountedPrice.toFixed(0)}
                </span>
                <span className="text-xs text-slate-400 line-through">
                  ₹{listing.originalPrice.toFixed(0)}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(listing);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
              isDonation
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-forest-600 hover:bg-forest-700 text-white'
            }`}
          >
            {isDonation ? (
              <>
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Claim</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Reserve</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
