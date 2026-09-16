export type UserRole = 'customer' | 'business' | 'ngo' | 'admin';

export type BusinessType = 'restaurant' | 'bakery' | 'supermarket' | 'hostel' | 'household' | 'cafe' | 'other';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address: string;
  coordinates?: { lat: number; lng: number };
  businessName?: string;
  businessType?: BusinessType;
  businessDescription?: string;
  ngoRegistrationNumber?: string;
  ngoMission?: string;
  isVerified?: boolean;
  joinedDate: string;
  impact: {
    mealsSaved: number;
    co2SavedKg: number;
    moneySaved: number;
  };
}

export type FoodCategory =
  | 'Bakery'
  | 'Meals & Prepared'
  | 'Fresh Produce'
  | 'Groceries'
  | 'Dairy & Refrigerated'
  | 'Beverages'
  | 'Surprise Bag'
  | 'Pantry';

export type ListingType = 'sale' | 'donation';

export type DietaryTag =
  | 'Vegetarian'
  | 'Vegan'
  | 'Gluten-Free'
  | 'Halal'
  | 'Kosher'
  | 'Dairy-Free'
  | 'Organic'
  | 'Nut-Free';

export interface FoodListing {
  id: string;
  businessId: string;
  businessName: string;
  businessType: BusinessType;
  businessAddress: string;
  businessRating?: number;
  businessAvatar?: string;
  title: string;
  description: string;
  category: FoodCategory;
  type: ListingType; // 'sale' (discounted) or 'donation' (free for NGOs / community)
  originalPrice: number;
  discountedPrice: number; // 0 for donations
  quantity: number;
  quantityUnit: string; // 'portions', 'bags', 'kg', 'items'
  images: string[];
  location: {
    address: string;
    city: string;
    lat: number;
    lng: number;
    distanceKm?: number;
  };
  pickupWindow: {
    date: string;
    startTime: string;
    endTime: string;
  };
  expiryInfo: string;
  dietaryTags: DietaryTag[];
  allergens: string[];
  status: 'available' | 'reserved' | 'completed' | 'expired' | 'cancelled';
  weightKgEstimate: number;
  reported?: boolean;
  reportReason?: string;
  createdAt: string;
}

export interface Reservation {
  id: string;
  listingId: string;
  listing: FoodListing;
  userId: string;
  userName: string;
  userRole: UserRole;
  userPhone?: string;
  pickupCode: string; // 6-digit confirmation code (e.g. "FL-8492")
  qrCodeData: string;
  status: 'pending_pickup' | 'collected' | 'cancelled';
  quantityReserved: number;
  totalPaid: number;
  reservedAt: string;
  collectedAt?: string;
  notes?: string;
}

export interface DonationClaim {
  id: string;
  listingId: string;
  listing: FoodListing;
  ngoId: string;
  ngoName: string;
  ngoContact: string;
  pickupCode: string;
  estimatedPeopleFed: number;
  status: 'requested' | 'approved' | 'collected' | 'distributed';
  claimedAt: string;
  collectedAt?: string;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  type: 'all' | 'sale' | 'donation';
  maxDistanceKm: number;
  maxPrice: number;
  pickupTime: 'all' | 'morning' | 'afternoon' | 'evening';
  dietary: DietaryTag[];
  sortBy: 'distance' | 'price-low' | 'discount-high' | 'closing-soon';
}

export interface PlatformStats {
  totalMealsRescued: number;
  co2PreventedKg: number;
  moneySavedAmount: number;
  activeListingsCount: number;
  totalBusinesses: number;
  totalNgos: number;
  totalCommunityMembers: number;
}
