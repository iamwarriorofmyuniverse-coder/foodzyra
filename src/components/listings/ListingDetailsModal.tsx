import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  Star,
  Sparkles,
  HeartHandshake,
  ShoppingBag,
  ShieldCheck,
  AlertTriangle,
  Leaf,
  Users,
  Flag,
  Share2,
  CheckCircle2,
  DollarSign,
  Navigation
} from 'lucide-react';
import { FoodListing } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useFoodLoop } from '../../context/FoodLoopContext';
import { useLocation } from '../../context/LocationContext';
import { calculateImpact } from '../../services/impactCalculator';

interface ListingDetailsModalProps {
  listing: FoodListing | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenDirections?: (listing: FoodListing) => void;
}

export const ListingDetailsModal: React.FC<ListingDetailsModalProps> = ({
  listing,
  isOpen,
  onClose,
  onOpenDirections
}) => {
  const { currentUser } = useAuth();
  const { reserveFood, claimFoodDonation, reportFoodListing } = useFoodLoop();
  const { calculateDistanceTo, getTransitEtasTo, userLocation } = useLocation();

  const [quantity, setQuantity] = useState(1);
  const [peopleFed, setPeopleFed] = useState(25);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState('Inaccurate description');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!isOpen || !listing) return null;

  const isDonation = listing.type === 'donation';
  const isBusinessOwner = currentUser?.id === listing.businessId;
  const isNgo = currentUser?.role === 'ngo';
  const isSoldOut = listing.quantity <= 0 || listing.status !== 'available';

  // Check if listing has expired
  const isExpired = (() => {
    if (!listing.pickupWindow?.date || !listing.pickupWindow?.endTime) return false;
    const endDateTime = new Date(`${listing.pickupWindow.date}T${listing.pickupWindow.endTime}:00`);
    return !isNaN(endDateTime.getTime()) && new Date() > endDateTime;
  })();

  const totalPrice = Number((listing.discountedPrice * quantity).toFixed(2));
  const estimatedImpact = calculateImpact(
    listing.weightKgEstimate * quantity,
    listing.originalPrice * quantity,
    totalPrice
  );

  const handleAction = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      if (isDonation && isNgo) {
        await claimFoodDonation(listing.id, peopleFed);
      } else {
        await reserveFood(listing.id, quantity, notes);
      }
    } catch (e: any) {
      console.error(e);
      setSubmitError(e.message || 'Failed to complete reservation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReport = async () => {
    await reportFoodListing(listing.id, reportReason);
    setIsReporting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-0">
          
          {/* Main Hero Gallery */}
          <div className="relative aspect-[16/9] bg-slate-900">
            <img
              src={listing.images[activeImageIndex] || listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {isDonation ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-md">
                  <HeartHandshake className="w-4 h-4" /> 100% FREE DONATION
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-md">
                  <Sparkles className="w-4 h-4" />
                  {Math.round(((listing.originalPrice - listing.discountedPrice) / listing.originalPrice) * 100)}% DISCOUNT
                </span>
              )}
              <span className="px-3 py-1.5 rounded-xl bg-black/60 text-white text-xs font-semibold backdrop-blur-md">
                {listing.category}
              </span>
            </div>

            {/* Business Header in Banner */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                {listing.businessAvatar && (
                  <img
                    src={listing.businessAvatar}
                    alt={listing.businessName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white/70"
                  />
                )}
                <div>
                  <h4 className="text-sm font-bold text-white leading-snug flex items-center gap-1.5">
                    {listing.businessName}
                    <ShieldCheck className="w-4 h-4 text-sprout-400" />
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-slate-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-sprout-300" />
                      {listing.businessAddress} ({calculateDistanceTo({ lat: listing.location.lat, lng: listing.location.lng })} km)
                    </p>
                    <button
                      onClick={() => {
                        const url = `https://www.google.com/maps/dir/?api=1&destination=${listing.location.lat},${listing.location.lng}`;
                        window.open(url, '_blank');
                      }}
                      className="text-[11px] font-bold text-sprout-300 underline hover:text-white flex items-center gap-1"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Google Maps</span>
                    </button>
                    {onOpenDirections && (
                      <button
                        onClick={() => onOpenDirections(listing)}
                        className="text-[11px] font-bold text-slate-300 underline hover:text-white"
                      >
                        Transit ETAs
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {listing.businessRating && (
                <div className="flex items-center gap-1 bg-black/50 px-2.5 py-1 rounded-xl text-xs font-bold backdrop-blur-md">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{listing.businessRating}</span>
                </div>
              )}
            </div>
          </div>

          {/* Modal Body Details */}
          <div className="p-6 space-y-6">
            
            {/* Title & Description */}
            <div>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">
                {listing.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {listing.description}
              </p>
            </div>

            {/* Environmental Impact Preview Callout */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-forest-50 via-sprout-50/50 to-white border border-forest-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-forest-600 text-white flex items-center justify-center shadow-xs">
                  <Leaf className="w-5 h-5 text-sprout-300" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-forest-900 uppercase tracking-wider">
                    Positive Environmental Impact
                  </h4>
                  <p className="text-xs text-forest-700">
                    Rescuing this prevents <strong>{estimatedImpact.co2SavedKg} kg CO₂e</strong> & saves <strong>{estimatedImpact.mealsCount} nutritious meal(s)</strong>!
                  </p>
                </div>
              </div>
            </div>

            {/* Logistics & Safety Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Pickup Window */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-forest-600" /> Pickup Window
                </span>
                <p className="font-bold text-slate-900 text-sm">
                  {listing.pickupWindow.date}, {listing.pickupWindow.startTime} – {listing.pickupWindow.endTime}
                </p>
                <p className="text-slate-500">Show up with your 6-digit reservation code.</p>
              </div>

              {/* Expiry & Freshness */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Freshness & Expiry
                </span>
                <p className="font-semibold text-slate-800 text-xs">
                  {listing.expiryInfo}
                </p>
                <p className="text-slate-500">Quality verified by donor store.</p>
              </div>
            </div>

            {/* Dietary Tags & Allergens */}
            <div className="space-y-3">
              {listing.dietaryTags.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-1.5">Dietary Suitability</span>
                  <div className="flex flex-wrap gap-1.5">
                    {listing.dietaryTags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-forest-100 text-forest-900 border border-forest-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Alert Banners (Sold out, Expired, Low stock) */}
              {isExpired ? (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span><strong>Listing Expired:</strong> The pickup window for this surplus food has ended.</span>
                </div>
              ) : isSoldOut ? (
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-300 text-xs text-slate-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-slate-500 shrink-0" />
                  <span><strong>Sold Out:</strong> All available portions for this listing have been reserved.</span>
                </div>
              ) : listing.quantity <= 3 ? (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>High Demand:</strong> Only {listing.quantity} {listing.quantityUnit} remaining!</span>
                </div>
              ) : null}

              {/* Submit Error Banner */}
              {submitError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Reservation Error:</span> {submitError}
                  </div>
                </div>
              )}

              {listing.allergens.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Allergen Notice:</span> Contains {listing.allergens.join(', ')}. Please inspect food before consumption.
                  </div>
                </div>
              )}
            </div>

            {/* Reserve / Claim Controls */}
            {!isBusinessOwner && !isSoldOut && !isExpired && (
              <div className="pt-4 border-t border-slate-200 space-y-4">
                {isDonation && isNgo ? (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">
                      Estimated People / Meals this donation will feed:
                    </label>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-forest-600" />
                      <input
                        type="number"
                        min="5"
                        max="500"
                        value={peopleFed}
                        onChange={(e) => setPeopleFed(Number(e.target.value))}
                        className="w-32 px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-forest-500/30"
                      />
                      <span className="text-xs text-slate-500">community members</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-700 block">Select Quantity</span>
                      <span className="text-xs text-slate-500">{listing.quantity} {listing.quantityUnit} available</span>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-2xl">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1 || isSubmitting}
                        className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold flex items-center justify-center hover:bg-slate-50 disabled:opacity-40"
                      >
                        -
                      </button>
                      <span className="text-sm font-extrabold text-slate-900 w-6 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(listing.quantity, quantity + 1))}
                        disabled={quantity >= listing.quantity || isSubmitting}
                        className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold flex items-center justify-center hover:bg-slate-50 disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Optional Note for Store */}
                <div>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add an optional note or dietary remark for pickup..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-500/30"
                  />
                </div>
              </div>
            )}

            {/* Reporting panel */}
            {isReporting ? (
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Flag className="w-3.5 h-3.5 text-rose-500" /> Report Inaccurate or Unsafe Listing
                </h4>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Inaccurate description">Inaccurate food description</option>
                  <option value="Expired or Unsafe food">Expired / spoiled food concern</option>
                  <option value="Store was closed during pickup">Store was closed / unreachable</option>
                  <option value="Spam or fraudulent post">Spam or commercial fraud</option>
                </select>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsReporting(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReport}
                    className="px-3 py-1.5 text-xs font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-700"
                  >
                    Submit Report
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
                <span>Listing ID: {listing.id}</span>
                <button
                  onClick={() => setIsReporting(true)}
                  className="hover:text-rose-600 flex items-center gap-1 text-[11px] font-medium"
                >
                  <Flag className="w-3 h-3" /> Report Listing
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Modal Sticky Bottom Bar */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              {isDonation ? 'Total Claim Cost' : 'Total Payable'}
            </span>
            {isDonation ? (
              <span className="text-2xl font-black text-emerald-600">FREE</span>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">₹{totalPrice.toFixed(0)}</span>
                <span className="text-xs text-slate-400 line-through">
                  ₹{(listing.originalPrice * quantity).toFixed(0)}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-3 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAction}
              disabled={isSubmitting || isSoldOut || isExpired}
              className={`px-6 py-3 rounded-2xl text-sm font-extrabold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50 flex items-center gap-2 ${
                isDonation
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-forest-600 hover:bg-forest-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : isSoldOut ? (
                <span>Sold Out</span>
              ) : isExpired ? (
                <span>Listing Expired</span>
              ) : isDonation ? (
                <>
                  <HeartHandshake className="w-4 h-4" />
                  <span>{isNgo ? 'Claim Bulk Donation' : 'Claim Free Food'}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Reserve & Get Pickup Code</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
