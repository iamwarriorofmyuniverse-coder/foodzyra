import React from 'react';
import {
  Leaf,
  ShoppingBag,
  Store,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  Globe2,
  Users,
  Award
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { useFoodLoop } from '../context/FoodLoopContext';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { stats, listings, setSelectedListing, setIsDetailsModalOpen } = useFoodLoop();
  const { switchRoleQuick } = useAuth();

  const featuredListings = listings.slice(0, 3);

  return (
    <div className="space-y-24 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Sustainability Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100 text-forest-800 border border-forest-200 text-xs font-bold shadow-xs">
                <Leaf className="w-4 h-4 text-forest-600" />
                <span>The Modern Surplus Food Rescue & Dining Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Good food shouldn't <br className="hidden sm:inline" />
                go to waste. <br />
                <span className="bg-gradient-to-r from-forest-600 via-emerald-600 to-sprout-600 bg-clip-text text-transparent">
                  Rescue it. Savor it. Loop it.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Connect directly with neighborhood bakeries, restaurants, supermarkets, and community members. Enjoy premium surplus food at up to <strong>70% off</strong>, or channel donations directly to local NGOs and food banks.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onNavigate('customer')}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-forest-600 hover:bg-forest-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-forest-600/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2.5"
                >
                  <ShoppingBag className="w-5 h-5 text-sprout-300" />
                  <span>Explore Nearby Surplus</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('business')}
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl border-2 border-slate-200 hover:border-forest-500 bg-white text-slate-800 font-bold text-sm sm:text-base transition-all hover:bg-forest-50/50 flex items-center justify-center gap-2"
                >
                  <Store className="w-5 h-5 text-amber-500" />
                  <span>List as a Merchant</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified Safe Food Handling</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-forest-600" />
                  <span>Free NGO Community Claiming</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Real-time Pickup Confirmation</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Hero Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Floating Card Backdrop */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-forest-200/50 via-sprout-200/30 to-amber-100/40 rounded-3xl filter blur-2xl opacity-70 -z-10" />

                {/* Hero Showcase Card */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-forest-600 text-white flex items-center justify-center font-bold">
                        <Leaf className="w-5 h-5 text-sprout-300" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Live Surplus Offer</h4>
                        <span className="text-xs text-slate-500">Green Harvest Artisan Bakery</span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold px-3 py-1 rounded-xl bg-amber-500 text-slate-950">
                      69% OFF
                    </span>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden aspect-video">
                    <img
                      src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80"
                      alt="Artisan bakery surplus"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-black/60 text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-sprout-400" />
                      <span>Pickup Today 18:30 - 20:00</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Evening Sourdough & Viennoiserie Bag
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Today's fresh organic sourdough, chocolate twists, and almond croissants.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <span className="text-2xl font-black text-slate-900">\$4.99</span>
                      <span className="text-xs text-slate-400 line-through ml-2">\$16.00</span>
                    </div>
                    <button
                      onClick={() => {
                        if (featuredListings[0]) {
                          setSelectedListing(featuredListings[0]);
                          setIsDetailsModalOpen(true);
                        } else {
                          onNavigate('customer');
                        }
                      }}
                      className="px-5 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-md transition-colors"
                    >
                      Reserve Now
                    </button>
                  </div>
                </div>

                {/* Floating Impact Pill */}
                <div className="absolute -bottom-6 -left-6 bg-slate-900 text-white p-4 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 animate-bounce duration-1000 hidden sm:flex">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">~2.5 kg CO₂e Avoided</p>
                    <p className="text-[11px] text-slate-400">Equivalent to 15km car drive</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Live Global Impact Numbers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-forest-900 via-forest-950 to-slate-950 text-white shadow-2xl relative overflow-hidden">
          
          <div className="relative z-10 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold text-sprout-400 tracking-wider uppercase">
                Collective Real-Time Impact
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Together, We're Closing the Loop on Food Waste
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="text-3xl sm:text-4xl font-black text-sprout-400">
                  {stats?.totalMealsRescued.toLocaleString() || '14,820'}
                </span>
                <p className="text-xs font-semibold text-slate-300 mt-1 uppercase tracking-wider">
                  Nutritious Meals Rescued
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="text-3xl sm:text-4xl font-black text-emerald-400">
                  {stats?.co2PreventedKg.toLocaleString() || '37,050'} kg
                </span>
                <p className="text-xs font-semibold text-slate-300 mt-1 uppercase tracking-wider">
                  CO₂e Emissions Prevented
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="text-3xl sm:text-4xl font-black text-amber-400">
                  \${stats?.moneySavedAmount.toLocaleString() || '92,600'}
                </span>
                <p className="text-xs font-semibold text-slate-300 mt-1 uppercase tracking-wider">
                  Food Value Recovered
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="text-3xl sm:text-4xl font-black text-sky-400">
                  {(stats?.totalBusinesses || 24) + (stats?.totalNgos || 12)}
                </span>
                <p className="text-xs font-semibold text-slate-300 mt-1 uppercase tracking-wider">
                  Active Stores & NGOs
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Foodzyra Works (3 Roles) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-forest-600 tracking-wider uppercase">
            A Multi-Sided Zero-Waste Ecosystem
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            How Foodzyra Connects the Community
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Whether you want delicious surplus food, have extra ingredients to donate, or manage an NGO food bank, Foodzyra streamlines everything.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Customer */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft hover:shadow-xl transition-all duration-300 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Role 1: Customers</span>
              <h3 className="text-xl font-bold text-slate-900">
                Rescue Delicious Meals at a Fraction of the Price
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Browse nearby bakeries, cafes, and supermarkets. Reserve surprise bags or individual meal portions, receive a secure 6-digit pickup token, and collect during the designated window.
              </p>
            </div>
            <button
              onClick={() => onNavigate('customer')}
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-forest-50 text-slate-900 hover:text-forest-800 text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <span>Explore as Customer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Businesses */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft hover:shadow-xl transition-all duration-300 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Store className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Role 2: Businesses & Donors</span>
              <h3 className="text-xl font-bold text-slate-900">
                Turn Surplus Waste into Revenue & Social Good
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Restaurants, grocery stores, bakeries, and hostels list unsold items in seconds. Choose between discounted sale or 100% tax-deductible donation to local charity partners.
              </p>
            </div>
            <button
              onClick={() => onNavigate('business')}
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-amber-50 text-slate-900 hover:text-amber-900 text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <span>Merchant Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: NGOs */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft hover:shadow-xl transition-all duration-300 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                <HeartHandshake className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">Role 3: NGOs & Food Banks</span>
              <h3 className="text-xl font-bold text-slate-900">
                Instant Access to Bulk Donated Food
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Community kitchens and registered charities browse free food crates, claim bulk produce and prepared meals in one click, and track beneficiaries fed with verifiable ESG impact logs.
              </p>
            </div>
            <button
              onClick={() => onNavigate('ngo')}
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-900 hover:text-sky-900 text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <span>NGO Food Rescue Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* Featured Live Surplus */}
      {featuredListings.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-forest-600 uppercase tracking-wider">Live Offers</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Featured Surplus Available Now
              </h2>
            </div>
            <button
              onClick={() => onNavigate('customer')}
              className="px-5 py-2.5 rounded-xl border border-slate-200 hover:border-forest-600 text-xs font-bold text-slate-700 hover:text-forest-700 transition-colors flex items-center gap-2"
            >
              <span>View All {listings.length} Offers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map(listing => (
              <div
                key={listing.id}
                onClick={() => {
                  setSelectedListing(listing);
                  setIsDetailsModalOpen(true);
                }}
                className="group bg-white rounded-3xl border border-slate-200/90 shadow-soft hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video overflow-hidden bg-slate-100">
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      {listing.type === 'donation' ? (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-extrabold text-xs">
                          FREE DONATION
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-xs">
                          {Math.round(((listing.originalPrice - listing.discountedPrice)/listing.originalPrice)*100)}% OFF
                        </span>
                      )}
                    </div>
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-white/95 text-slate-800 text-xs font-bold shadow-md">
                      {listing.location.distanceKm} km away
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {listing.businessName} • {listing.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                      {listing.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {listing.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      {listing.type === 'donation' ? (
                        <span className="text-lg font-black text-emerald-600">FREE</span>
                      ) : (
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl font-black text-slate-900">\${listing.discountedPrice.toFixed(2)}</span>
                          <span className="text-xs text-slate-400 line-through">\${listing.originalPrice.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                    <span className="px-4 py-2 rounded-xl bg-forest-600 text-white text-xs font-bold group-hover:bg-forest-700 transition-colors">
                      {listing.type === 'donation' ? 'Claim Free' : 'Reserve'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Call to Action Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-forest-700 via-forest-800 to-forest-900 text-white text-center space-y-6 shadow-xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Ready to Stop Food Waste in Your City?
            </h2>
            <p className="text-sm sm:text-base text-forest-100 leading-relaxed">
              Join thousands of conscious eaters, local bakeries, supermarkets, and charity food banks building a regenerative food system today.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('customer')}
              className="px-8 py-4 rounded-2xl bg-white text-forest-900 font-extrabold text-sm shadow-lg hover:bg-forest-50 transition-all hover:scale-105"
            >
              Browse Food Nearby
            </button>
            <button
              onClick={() => onNavigate('register')}
              className="px-8 py-4 rounded-2xl border-2 border-forest-300/40 hover:border-white text-white font-bold text-sm transition-all"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
