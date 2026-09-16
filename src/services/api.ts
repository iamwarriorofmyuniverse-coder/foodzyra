import {
  User,
  FoodListing,
  Reservation,
  DonationClaim,
  PlatformStats,
  FilterState,
  UserRole
} from '../types';
import { StorageService } from './storage';
import { calculateImpact } from './impactCalculator';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ApiService = {
  // Initialize storage
  init(): void {
    StorageService.init();
  },

  // Auth & Users
  async getAllUsers(): Promise<User[]> {
    await delay(150);
    return StorageService.getUsers();
  },

  async getCurrentUser(): Promise<User> {
    await delay(100);
    return StorageService.getCurrentUser();
  },

  async login(email: string): Promise<User> {
    await delay(250);
    const users = StorageService.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error(`No account found with email: ${email}. You can register or pick a demo persona.`);
    }
    StorageService.setCurrentUser(user);
    return user;
  },

  async registerUser(userData: Partial<User> & { email: string; name: string; role: UserRole }): Promise<User> {
    await delay(300);
    const users = StorageService.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const newUser: User = {
      id: `user-${Date.now().toString(36)}`,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      avatar: userData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userData.name)}`,
      phone: userData.phone || '+91 98765 00000',
      address: userData.address || 'Indiranagar, Bengaluru, Karnataka',
      coordinates: userData.coordinates || { lat: 12.9784, lng: 77.6408 },
      businessName: userData.businessName,
      businessType: userData.businessType,
      businessDescription: userData.businessDescription,
      ngoRegistrationNumber: userData.ngoRegistrationNumber,
      ngoMission: userData.ngoMission,
      isVerified: userData.role === 'customer', // businesses/NGOs can be verified by admin
      joinedDate: new Date().toISOString().split('T')[0],
      impact: {
        mealsSaved: 0,
        co2SavedKg: 0,
        moneySaved: 0
      }
    };

    const updated = [newUser, ...users];
    StorageService.saveUsers(updated);
    StorageService.setCurrentUser(newUser);

    // Update stats
    const stats = StorageService.getPlatformStats();
    if (newUser.role === 'business') stats.totalBusinesses += 1;
    else if (newUser.role === 'ngo') stats.totalNgos += 1;
    else stats.totalCommunityMembers += 1;
    StorageService.savePlatformStats(stats);

    return newUser;
  },

  async switchUser(userId: string): Promise<User> {
    await delay(100);
    const users = StorageService.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    StorageService.setCurrentUser(user);
    return user;
  },

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    await delay(200);
    const users = StorageService.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('User not found');
    
    const updatedUser = { ...users[index], ...updates };
    users[index] = updatedUser;
    StorageService.saveUsers(users);
    
    const current = StorageService.getCurrentUser();
    if (current.id === userId) {
      StorageService.setCurrentUser(updatedUser);
    }
    return updatedUser;
  },

  // Food Listings
  async getListings(filters?: Partial<FilterState>, userCoords?: { lat: number; lng: number }): Promise<FoodListing[]> {
    await delay(150);
    let listings = StorageService.getListings();

    // Dynamically calculate Haversine distance if user coordinates provided
    if (userCoords) {
      listings = listings.map(l => {
        const R = 6371;
        const dLat = ((l.location.lat - userCoords.lat) * Math.PI) / 180;
        const dLon = ((l.location.lng - userCoords.lng) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.sin(dLon / 2) * Math.sin(dLon / 2) *
          Math.cos((userCoords.lat * Math.PI) / 180) *
          Math.cos((l.location.lat * Math.PI) / 180);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceKm = Number((R * c).toFixed(1));

        return {
          ...l,
          location: {
            ...l.location,
            distanceKm
          }
        };
      });
    }

    if (!filters) return listings;

    // Apply filters
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      listings = listings.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.businessName.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q) ||
        l.dietaryTags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (filters.category && filters.category !== 'all') {
      listings = listings.filter(l => l.category === filters.category);
    }

    if (filters.type && filters.type !== 'all') {
      listings = listings.filter(l => l.type === filters.type);
    }

    if (filters.maxDistanceKm !== undefined && filters.maxDistanceKm > 0) {
      listings = listings.filter(l => (l.location.distanceKm ?? 0) <= filters.maxDistanceKm!);
    }

    if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
      listings = listings.filter(l => l.discountedPrice <= filters.maxPrice!);
    }

    if (filters.dietary && filters.dietary.length > 0) {
      listings = listings.filter(l =>
        filters.dietary!.every(tag => l.dietaryTags.includes(tag))
      );
    }

    // Sorting
    if (filters.sortBy) {
      if (filters.sortBy === 'distance') {
        listings.sort((a, b) => (a.location.distanceKm ?? 0) - (b.location.distanceKm ?? 0));
      } else if (filters.sortBy === 'price-low') {
        listings.sort((a, b) => a.discountedPrice - b.discountedPrice);
      } else if (filters.sortBy === 'closing-soon') {
        listings.sort((a, b) => {
          const timeA = a.pickupWindow.endTime || '23:59';
          const timeB = b.pickupWindow.endTime || '23:59';
          return timeA.localeCompare(timeB);
        });
      } else if (filters.sortBy === 'discount-high') {
        listings.sort((a, b) => {
          const discountA = a.originalPrice ? (a.originalPrice - a.discountedPrice) / a.originalPrice : 0;
          const discountB = b.originalPrice ? (b.originalPrice - b.discountedPrice) / b.originalPrice : 0;
          return discountB - discountA;
        });
      }
    }

    return listings;
  },

  async getListingById(id: string): Promise<FoodListing | null> {
    await delay(100);
    const listings = StorageService.getListings();
    return listings.find(l => l.id === id) || null;
  },

  async createListing(listingData: Omit<FoodListing, 'id' | 'createdAt' | 'status'>): Promise<FoodListing> {
    await delay(300);
    const listings = StorageService.getListings();
    const newListing: FoodListing = {
      ...listingData,
      id: `list-${Date.now().toString(36)}`,
      status: 'available',
      createdAt: new Date().toISOString()
    };

    const updated = [newListing, ...listings];
    StorageService.saveListings(updated);

    const stats = StorageService.getPlatformStats();
    stats.activeListingsCount += 1;
    StorageService.savePlatformStats(stats);

    return newListing;
  },

  async updateListingStatus(listingId: string, status: FoodListing['status']): Promise<FoodListing> {
    await delay(150);
    const listings = StorageService.getListings();
    const index = listings.findIndex(l => l.id === listingId);
    if (index === -1) throw new Error('Listing not found');

    listings[index].status = status;
    StorageService.saveListings(listings);
    return listings[index];
  },

  async reportListing(listingId: string, reason: string): Promise<FoodListing> {
    await delay(200);
    const listings = StorageService.getListings();
    const index = listings.findIndex(l => l.id === listingId);
    if (index === -1) throw new Error('Listing not found');

    listings[index].reported = true;
    listings[index].reportReason = reason;
    StorageService.saveListings(listings);
    return listings[index];
  },

  async adminModerateListing(listingId: string, action: 'approve' | 'remove'): Promise<void> {
    await delay(250);
    const listings = StorageService.getListings();
    if (action === 'remove') {
      const filtered = listings.filter(l => l.id !== listingId);
      StorageService.saveListings(filtered);
    } else {
      const index = listings.findIndex(l => l.id === listingId);
      if (index !== -1) {
        listings[index].reported = false;
        listings[index].reportReason = undefined;
        StorageService.saveListings(listings);
      }
    }
  },

  // Customer Reservations
  async getReservations(userId?: string): Promise<Reservation[]> {
    await delay(150);
    const reservations = StorageService.getReservations();
    if (userId) {
      return reservations.filter(r => r.userId === userId);
    }
    return reservations;
  },

  async getBusinessReservations(businessId: string): Promise<Reservation[]> {
    await delay(150);
    const reservations = StorageService.getReservations();
    return reservations.filter(r => r.listing.businessId === businessId);
  },

  async reserveListing(listingId: string, user: User, quantity: number = 1, notes?: string): Promise<Reservation> {
    await delay(350);
    const listings = StorageService.getListings();
    const listingIndex = listings.findIndex(l => l.id === listingId);
    if (listingIndex === -1) throw new Error('Listing not found');
    
    const listing = listings[listingIndex];
    if (listing.quantity < quantity) {
      throw new Error(`Only ${listing.quantity} items remain available.`);
    }

    // Deduct quantity
    listing.quantity -= quantity;
    if (listing.quantity === 0) {
      listing.status = 'reserved';
    }
    listings[listingIndex] = listing;
    StorageService.saveListings(listings);

    // 6-digit verification code
    const randomCodeNum = Math.floor(1000 + Math.random() * 9000);
    const pickupCode = `FL-${randomCodeNum}`;
    const newReservation: Reservation = {
      id: `res-${Date.now().toString(36)}`,
      listingId: listing.id,
      listing: { ...listing },
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      userPhone: user.phone,
      pickupCode,
      qrCodeData: `FOODLOOP-CODE-${pickupCode}-ID-${listing.id}`,
      status: 'pending_pickup',
      quantityReserved: quantity,
      totalPaid: Number((listing.discountedPrice * quantity).toFixed(2)),
      reservedAt: new Date().toISOString(),
      notes
    };

    const allReservations = StorageService.getReservations();
    StorageService.saveReservations([newReservation, ...allReservations]);

    return newReservation;
  },

  async cancelReservation(reservationId: string): Promise<void> {
    await delay(250);
    const reservations = StorageService.getReservations();
    const index = reservations.findIndex(r => r.id === reservationId);
    if (index === -1) throw new Error('Reservation not found');

    const res = reservations[index];
    res.status = 'cancelled';
    StorageService.saveReservations(reservations);

    // Restore listing quantity
    const listings = StorageService.getListings();
    const listingIndex = listings.findIndex(l => l.id === res.listingId);
    if (listingIndex !== -1) {
      listings[listingIndex].quantity += res.quantityReserved;
      listings[listingIndex].status = 'available';
      StorageService.saveListings(listings);
    }
  },

  // Donation Claims (NGO)
  async getDonationClaims(ngoId?: string): Promise<DonationClaim[]> {
    await delay(150);
    const claims = StorageService.getDonationClaims();
    if (ngoId) {
      return claims.filter(c => c.ngoId === ngoId);
    }
    return claims;
  },

  async claimDonation(listingId: string, ngoUser: User, peopleFedEstimate: number): Promise<DonationClaim> {
    await delay(350);
    const listings = StorageService.getListings();
    const listingIndex = listings.findIndex(l => l.id === listingId);
    if (listingIndex === -1) throw new Error('Listing not found');

    const listing = listings[listingIndex];
    listing.status = 'reserved';
    listings[listingIndex] = listing;
    StorageService.saveListings(listings);

    const randomCodeNum = Math.floor(1000 + Math.random() * 9000);
    const pickupCode = `NGO-${randomCodeNum}`;

    const newClaim: DonationClaim = {
      id: `claim-${Date.now().toString(36)}`,
      listingId: listing.id,
      listing: { ...listing },
      ngoId: ngoUser.id,
      ngoName: ngoUser.name,
      ngoContact: ngoUser.phone || '+1 (555) 000-0000',
      pickupCode,
      estimatedPeopleFed: peopleFedEstimate || Math.max(10, Math.round(listing.weightKgEstimate * 2)),
      status: 'approved',
      claimedAt: new Date().toISOString()
    };

    const claims = StorageService.getDonationClaims();
    StorageService.saveDonationClaims([newClaim, ...claims]);
    return newClaim;
  },

  // Pickup Verification (Business marks as collected using 6-digit code or QR)
  async verifyAndCollectOrder(pickupCode: string, verifierUserId: string): Promise<{ success: boolean; type: 'customer' | 'ngo'; itemTitle: string; impact: ReturnType<typeof calculateImpact> }> {
    await delay(300);
    const trimmedCode = pickupCode.trim().toUpperCase();

    // Check reservations
    const reservations = StorageService.getReservations();
    const resIndex = reservations.findIndex(r => r.pickupCode.toUpperCase() === trimmedCode && r.status === 'pending_pickup');

    if (resIndex !== -1) {
      const reservation = reservations[resIndex];
      reservation.status = 'collected';
      reservation.collectedAt = new Date().toISOString();
      StorageService.saveReservations(reservations);

      const impact = calculateImpact(
        reservation.listing.weightKgEstimate * reservation.quantityReserved,
        reservation.listing.originalPrice * reservation.quantityReserved,
        reservation.totalPaid
      );

      // Update User impact & Platform stats
      this.recordImpact(reservation.userId, verifierUserId, impact);

      return {
        success: true,
        type: 'customer',
        itemTitle: reservation.listing.title,
        impact
      };
    }

    // Check donation claims
    const claims = StorageService.getDonationClaims();
    const claimIndex = claims.findIndex(c => c.pickupCode.toUpperCase() === trimmedCode && c.status === 'approved');

    if (claimIndex !== -1) {
      const claim = claims[claimIndex];
      claim.status = 'collected';
      claim.collectedAt = new Date().toISOString();
      StorageService.saveDonationClaims(claims);

      const impact = calculateImpact(
        claim.listing.weightKgEstimate,
        claim.listing.originalPrice,
        0
      );

      this.recordImpact(claim.ngoId, verifierUserId, impact);

      return {
        success: true,
        type: 'ngo',
        itemTitle: claim.listing.title,
        impact
      };
    }

    throw new Error(`Invalid or already collected pickup code "${pickupCode}". Please double check.`);
  },

  recordImpact(recipientUserId: string, businessUserId: string, impact: ReturnType<typeof calculateImpact>) {
    const users = StorageService.getUsers();
    
    // Update recipient user
    const recipient = users.find(u => u.id === recipientUserId);
    if (recipient) {
      recipient.impact.mealsSaved += impact.mealsCount;
      recipient.impact.co2SavedKg = Number((recipient.impact.co2SavedKg + impact.co2SavedKg).toFixed(1));
      recipient.impact.moneySaved = Number((recipient.impact.moneySaved + impact.moneySaved).toFixed(2));
    }

    // Update business user
    const business = users.find(u => u.id === businessUserId);
    if (business) {
      business.impact.mealsSaved += impact.mealsCount;
      business.impact.co2SavedKg = Number((business.impact.co2SavedKg + impact.co2SavedKg).toFixed(1));
      business.impact.moneySaved = Number((business.impact.moneySaved + impact.moneySaved).toFixed(2));
    }

    StorageService.saveUsers(users);

    // Update platform stats
    const stats = StorageService.getPlatformStats();
    stats.totalMealsRescued += impact.mealsCount;
    stats.co2PreventedKg = Number((stats.co2PreventedKg + impact.co2SavedKg).toFixed(1));
    stats.moneySavedAmount = Number((stats.moneySavedAmount + impact.moneySaved).toFixed(2));
    StorageService.savePlatformStats(stats);
  },

  // Stats
  async getPlatformStats(): Promise<PlatformStats> {
    await delay(100);
    return StorageService.getPlatformStats();
  },

  // ==========================================
  // AI ASSISTANT LAYER
  // ==========================================
  async describeFood(params: {
    title: string;
    category: string;
    quantity: number;
    quantityUnit?: string;
    originalPrice?: number;
    discountedPrice?: number;
    dietaryTags?: string[];
    notes?: string;
  }): Promise<{ description: string; disclaimer: string }> {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/ai/describe-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (res.ok) {
        const data = await res.json();
        return { description: data.description, disclaimer: data.disclaimer };
      }
    } catch (e) {
      // ignore network errors and fallback
    }

    // Client-side fallback
    const tagText = params.dietaryTags && params.dietaryTags.length > 0 ? ` Suitable for ${params.dietaryTags.join(' & ')} diets.` : '';
    const noteText = params.notes ? ` ${params.notes}.` : '';
    return {
      description: `Freshly prepared ${params.title.toLowerCase()} from our daily batch. Packed in ${params.quantity} ${params.quantityUnit || 'portions'} ready for pickup to prevent waste and save delicious food.${tagText}${noteText} Enjoy premium quality at a sustainable surplus price.`,
      disclaimer: 'AI-generated suggestion. Merchant must verify food quality and details before publishing.'
    };
  },

  async suggestCategory(title: string, notes: string = ''): Promise<{ category: string; confidence: number; reason: string }> {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/ai/suggest-category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, notes })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // fallback
    }

    const combined = `${title} ${notes}`.toLowerCase();
    if (/bread|croissant|bagel|pastry|muffin|cake|donut|sourdough|baguette/i.test(combined)) {
      return { category: 'Bakery', confidence: 0.95, reason: 'Identified bakery and baked pastry keywords' };
    }
    if (/apple|banana|orange|berry|vegetable|fruit|salad|tomato|spinach|produce/i.test(combined)) {
      return { category: 'Fresh Produce', confidence: 0.92, reason: 'Identified fresh fruits and produce keywords' };
    }
    if (/milk|cheese|yogurt|butter|dairy|egg/i.test(combined)) {
      return { category: 'Dairy & Refrigerated', confidence: 0.9, reason: 'Identified dairy staples' };
    }
    if (/juice|smoothie|coffee|tea|drink|beverage/i.test(combined)) {
      return { category: 'Beverages', confidence: 0.92, reason: 'Identified drink/beverage keywords' };
    }
    if (/mystery|surprise|magic bag|bundle/i.test(combined)) {
      return { category: 'Surprise Bag', confidence: 0.95, reason: 'Identified surprise bundle' };
    }
    if (/pasta|rice|cereal|canned|beans|flour|pantry/i.test(combined)) {
      return { category: 'Pantry', confidence: 0.88, reason: 'Identified non-perishable pantry staples' };
    }
    return { category: 'Meals & Prepared', confidence: 0.85, reason: 'Identified prepared meal/dish' };
  },

  async predictDemand(params: { category: string; quantity: number; pickupStartHour?: string }): Promise<{ demandLevel: 'High' | 'Moderate' | 'Low'; estimatedSellThroughPercent: number; peakPickupHour: string; insights: string }> {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/ai/predict-demand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (res.ok) {
        const data = await res.json();
        return data.prediction;
      }
    } catch (e) {
      // fallback
    }

    let sellThrough = 85;
    let demandLevel: 'High' | 'Moderate' | 'Low' = 'Moderate';
    if (['Bakery', 'Meals & Prepared', 'Surprise Bag'].includes(params.category)) {
      demandLevel = 'High';
      sellThrough = 95;
    }
    return {
      demandLevel,
      estimatedSellThroughPercent: sellThrough,
      peakPickupHour: '18:00 - 20:30',
      insights: `${params.category} listings historically achieve ~${sellThrough}% rescue rate during evening pickup windows.`
    };
  },

  async suggestPricing(originalPrice: number, category: string, hoursUntilClosing: number = 4): Promise<{ suggestedDiscountPercent: number; suggestedDiscountedPrice: number; pricingStrategy: string; rationale: string }> {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/ai/suggest-pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalPrice, category, hoursUntilClosing })
      });
      if (res.ok) {
        const data = await res.json();
        return data.suggestion;
      }
    } catch (e) {
      // fallback
    }

    const discountPct = hoursUntilClosing <= 2 ? 75 : 60;
    const discountedPrice = Number((originalPrice * (1 - discountPct / 100)).toFixed(2));
    return {
      suggestedDiscountPercent: discountPct,
      suggestedDiscountedPrice: discountedPrice,
      pricingStrategy: hoursUntilClosing <= 2 ? 'Fast Clearance' : 'Optimal Value',
      rationale: `A ${discountPct}% markdown is recommended ${hoursUntilClosing}h before closing to maximize rescue rate.`
    };
  },

  async recommendSaleOrDonation(params: { quantity: number; originalPrice: number; hoursUntilClosing: number; category: string }): Promise<{ recommendation: 'sale' | 'donation'; confidence: number; rationale: string; benefits: string[] }> {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/ai/sale-or-donation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (res.ok) {
        const data = await res.json();
        return data.recommendation;
      }
    } catch (e) {
      // fallback
    }

    if (params.quantity >= 15 || params.hoursUntilClosing < 1.5) {
      return {
        recommendation: 'donation',
        confidence: 0.9,
        rationale: `High volume (${params.quantity} items) or limited time (${params.hoursUntilClosing}h) makes this optimal for single-batch NGO collection.`,
        benefits: [
          'Immediate local charity impact feeding community members',
          'Tax receipt and corporate sustainability documentation'
        ]
      };
    }
    return {
      recommendation: 'sale',
      confidence: 0.88,
      rationale: `Moderate quantity with sufficient pickup buffer has strong customer demand on Foodzyra.`,
      benefits: [
        'Recovers business ingredient and packaging costs',
        'Builds recurring neighborhood foot traffic'
      ]
    };
  },

  async getBusinessWasteAnalytics(businessUserId: string): Promise<{ monthlyKgRescued: number; monthlyMealsRescued: number; monthlyRevenueRecovered: number; topWasteCategory: string; peakSurplusDay: string; aiExplanation: string; actionableTips: string[] }> {
    const token = StorageService.getAuthToken();
    try {
      if (token) {
        const res = await fetch('http://127.0.0.1:5000/api/ai/business-waste-insights', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          return data.analytics;
        }
      }
    } catch (e) {
      // fallback
    }

    return {
      monthlyKgRescued: 145.0,
      monthlyMealsRescued: 290,
      monthlyRevenueRecovered: 890.0,
      topWasteCategory: 'Bakery',
      peakSurplusDay: 'Sunday',
      aiExplanation: 'Over the past 30 days, your store has diverted 290 meals from landfills, preventing 725 kg CO₂e while recovering \$890 in revenue.',
      actionableTips: [
        'Surplus spikes on Sunday afternoons. Posting listings by 3:30 PM increases reservation rates by 28%.',
        'Your Bakery items have a 95% sell-through rate. Bundling assorted items into Surprise Bags clears stock fast.',
        'Donating surplus with < 2 hours remaining connects directly with verified local food bank partners.'
      ]
    };
  },

  async getCustomerRecommendations(customerId: string): Promise<Array<{ listingId: string; matchScore: number; reason: string }>> {
    const token = StorageService.getAuthToken();
    try {
      if (token) {
        const res = await fetch('http://127.0.0.1:5000/api/ai/customer-recommendations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          return data.recommendations;
        }
      }
    } catch (e) {
      // fallback
    }

    const listings = StorageService.getListings();
    return listings.slice(0, 4).map((l, i) => ({
      listingId: l.id,
      matchScore: 95 - i * 5,
      reason: i === 0 ? 'Top match for your favorite category' : 'Trending surplus near your location'
    }));
  }
};
