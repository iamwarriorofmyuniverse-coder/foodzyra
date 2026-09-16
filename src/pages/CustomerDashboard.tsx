import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  AlertCircle,
  Leaf,
  RotateCcw,
  Navigation,
  SlidersHorizontal,
  Footprints,
  PlusCircle,
  Sparkles,
  Camera
} from 'lucide-react';
import { useFoodLoop } from '../context/FoodLoopContext';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { ListingCard } from '../components/listings/ListingCard';
import { ListingFilters } from '../components/listings/ListingFilters';
import { InteractiveMapView } from '../components/location/InteractiveMapView';
import { PickupDirectionsModal } from '../components/location/PickupDirectionsModal';
import { SmartDietaryFilter, DietaryFilterState } from '../components/nutrition/SmartDietaryFilter';
import { FoodListing } from '../types';
import { ApiService } from '../services/api';

interface CustomerDashboardProps {
  onNavigate: (page: string) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ onNavigate }) => {
  const {
    listings,
    filters,
    setFilters,
    resetFilters,
    setSelectedListing,
    setIsDetailsModalOpen,
    setIsVisionModalOpen,
    setIsCreateModalOpen,
    isLoading
  } = useFoodLoop();

  const { currentUser } = useAuth();
  const {
    userLocation,
    selectedRadiusKm,
    setSelectedRadiusKm,
    setIsLocationModalOpen,
    calculateDistanceTo
  } = useLocation();

  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [directionsListing, setDirectionsListing] = useState<FoodListing | null>(null);
  const [isDirectionsOpen, setIsDirectionsOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<Array<{ listingId: string; matchScore: number; reason: string }>>([]);

  React.useEffect(() => {
    if (currentUser?.id) {
      ApiService.getCustomerRecommendations(currentUser.id)
        .then(recs => setRecommendations(recs))
        .catch(console.error);
    }
  }, [currentUser?.id]);

  const handleSelectListing = (listing: FoodListing) => {
    setSelectedListing(listing);
    setIsDetailsModalOpen(true);
  };

  const handleOpenDirections = (listing: FoodListing) => {
    setDirectionsListing(listing);
    setIsDirectionsOpen(true);
  };

  const [dietaryFilter, setDietaryFilter] = useState<DietaryFilterState>({
    minProtein: 0,
    maxCalories: 1500,
    selectedDietaryTags: []
  });

  // Filter listings based on active Haversine distance, user selected radius, and dietary tags
  const filteredListings = listings.filter(l => {
    // Newly posted listings by current user or within active city radius are always shown
    const isCreatedByCurrentUser = currentUser?.id && l.businessId === currentUser.id;
    const dist = calculateDistanceTo({ lat: l.location?.lat || 12.9784, lng: l.location?.lng || 77.6408 });
    
    if (!isCreatedByCurrentUser && selectedRadiusKm < 50 && dist > selectedRadiusKm) {
      return false;
    }

    if (dietaryFilter.selectedDietaryTags.length > 0) {
      const tags = l.dietaryTags || [];
      const matches = dietaryFilter.selectedDietaryTags.some(dt =>
        tags.some(t => t.toLowerCase().includes(dt.toLowerCase()))
      );
      if (!matches) return false;
    }

    return true;
  });

  const recommendedListings = recommendations
    .map(rec => {
      const listing = listings.find(l => l.id === rec.listingId);
      return listing ? { listing, rec } : null;
    })
    .filter(Boolean) as Array<{ listing: FoodListing; rec: { matchScore: number; reason: string } }>;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8">
      
      {/* Location Banner Header */}
      <div className="bg-gradient-to-r from-forest-800 via-forest-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-sprout-400 uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Local Surplus Food Discovery</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Discover Fresh Surplus Food Near You
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300">
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold flex items-center gap-2 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-sprout-300" />
              <span>{userLocation.label}</span>
              <span className="text-xs text-sprout-300 underline font-normal">Change</span>
            </button>
            <span>•</span>
            <span>Searching within <strong>{selectedRadiusKm} km</strong> radius</span>
          </div>
        </div>

        {/* Actions & Impact */}
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-3 rounded-2xl bg-forest-500 hover:bg-forest-600 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            title="Post your own surplus food or meals with photo verification"
          >
            <Camera className="w-4 h-4" />
            <span>Post / Share Surplus Food</span>
          </button>

          {/* Quick Impact Highlight */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-forest-500 text-white flex items-center justify-center font-bold">
              <Leaf className="w-4 h-4 text-sprout-200" />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                Your Personal Impact
              </span>
              <span className="text-sm font-extrabold text-white">
                {currentUser?.impact.mealsSaved || 0} Meals Rescued
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 🏆 Judge Demo Showcase & Quick Navigator */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-forest-500/10 to-sky-500/10 border border-amber-300/60 dark:border-amber-700/40 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold text-xs shadow-xs">
              🏆
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                Judge Demo Showcase
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                  Interactive Evaluation Bar
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                1-Click shortcuts to test core features: Verified Photos, ₹0 NGO Bulk Donations, AI Nutrition Vision & Local Indian Pricing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Test Photo Post</span>
            </button>
            <button
              onClick={() => setIsVisionModalOpen(true)}
              className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-forest-700 hover:from-emerald-700 text-white flex items-center gap-1.5 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>AI Vision Studio</span>
            </button>
          </div>
        </div>

        {/* Quick Demo Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/60">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Demo Presets:</span>
          
          <button
            onClick={() => { resetFilters(); setSelectedRadiusKm(15); }}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-forest-400 text-slate-700 hover:text-forest-800 transition-colors shadow-2xs"
          >
            🎯 All Surplus ({listings.length} Items)
          </button>
          <button
            onClick={() => setFilters({ ...filters, category: 'Bakery' })}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-forest-400 text-slate-700 hover:text-forest-800 transition-colors shadow-2xs"
          >
            🥖 Bakery Magic Bags (₹149)
          </button>
          <button
            onClick={() => setFilters({ ...filters, category: 'Meals & Prepared' })}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-forest-400 text-slate-700 hover:text-forest-800 transition-colors shadow-2xs"
          >
            🍛 Biryani & Tiffins (₹79 - ₹149)
          </button>
          <button
            onClick={() => setFilters({ ...filters, type: 'donation' })}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-900 transition-colors shadow-2xs"
          >
            🥦 Free NGO Bulk Crates (₹0)
          </button>
          <button
            onClick={() => setFilters({ ...filters, dietary: ['Vegetarian'] })}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-forest-400 text-slate-700 hover:text-forest-800 transition-colors shadow-2xs"
          >
            🥗 100% Vegetarian
          </button>
        </div>
      </div>

      {/* AI Personalized Recommendations Section */}
      {recommendedListings.length > 0 && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-sprout-50/70 via-forest-50/50 to-amber-50/30 border border-forest-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  Curated For You
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-forest-600 text-white">
                    AI Match
                  </span>
                </h3>
                <p className="text-xs text-slate-500">Based on your favorite categories and location</p>
              </div>
            </div>
            <span className="text-xs font-bold text-forest-700">{recommendedListings.length} Matches</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedListings.map(({ listing, rec }) => (
              <div
                key={listing.id}
                onClick={() => handleSelectListing(listing)}
                className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs hover:shadow-md hover:border-forest-300 transition-all cursor-pointer flex flex-col justify-between space-y-2 group"
              >
                <div className="space-y-2">
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-100">
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-slate-950/80 text-sprout-300 px-2 py-0.5 rounded-lg text-[10px] font-bold backdrop-blur-xs">
                      {rec.matchScore}% Match
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {listing.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-forest-700 transition-colors">
                      {listing.title}
                    </h4>
                    <p className="text-[11px] font-semibold text-emerald-700 line-clamp-1 mt-0.5">
                      💡 {rec.reason}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-900">
                    {listing.type === 'donation' ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `₹${listing.discountedPrice.toFixed(0)}`
                    )}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {calculateDistanceTo({ lat: listing.location.lat, lng: listing.location.lng })} km away
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Smart Dietary & USDA Nutrition Intelligence Filter */}
      <SmartDietaryFilter
        onFilterChange={setDietaryFilter}
        onOpenVisionModal={() => setIsVisionModalOpen(true)}
      />

      {/* Filter & Search Bar */}
      <ListingFilters
        filters={filters}
        onFilterChange={setFilters}
        onReset={resetFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalResults={filteredListings.length}
      />

      {/* Main Content Area: Grid vs Map */}
      {viewMode === 'map' ? (
        <div className="space-y-4">
          <InteractiveMapView
            listings={filteredListings}
            onSelectListing={handleSelectListing}
            onOpenDirections={handleOpenDirections}
          />
        </div>
      ) : (
        <div>
          {isLoading ? (
            /* Loading Skeleton Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="bg-white rounded-3xl border border-slate-200 p-4 space-y-4 animate-pulse">
                  <div className="aspect-[16/10] bg-slate-200 rounded-2xl" />
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-full" />
                    <div className="h-3 bg-slate-100 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredListings.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4 shadow-soft my-12">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">No Offers Within {selectedRadiusKm} km</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Try expanding your search radius to 10 km or 15 km, or change your location to explore other neighborhoods.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setSelectedRadiusKm(10)}
                  className="px-4 py-2 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Expand Radius to 10 km
                </button>
                <button
                  onClick={() => setIsLocationModalOpen(true)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-xs text-slate-700"
                >
                  Change Location
                </button>
              </div>
            </div>
          ) : (
            /* Grid View of Food Items */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map(listing => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onSelect={handleSelectListing}
                  onOpenDirections={handleOpenDirections}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Directions Modal */}
      <PickupDirectionsModal
        listing={directionsListing}
        isOpen={isDirectionsOpen}
        onClose={() => {
          setIsDirectionsOpen(false);
          setDirectionsListing(null);
        }}
      />

    </div>
  );
};
