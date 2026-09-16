import { User, FoodListing, Reservation, DonationClaim, PlatformStats } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-cust-1',
    name: 'Aarav Sharma',
    email: 'aarav@foodzyra.org',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 43210',
    address: '100ft Road, Indiranagar, Bengaluru',
    coordinates: { lat: 12.9784, lng: 77.6408 },
    joinedDate: '2025-01-15',
    impact: {
      mealsSaved: 36,
      co2SavedKg: 90.0,
      moneySaved: 5450.00
    }
  },
  {
    id: 'user-cust-2',
    name: 'Rohan Mehta',
    email: 'rohan@foodzyra.org',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 88776',
    address: 'Hill Road, Bandra West, Mumbai',
    coordinates: { lat: 19.0596, lng: 72.8295 },
    joinedDate: '2025-02-10',
    impact: {
      mealsSaved: 22,
      co2SavedKg: 55.0,
      moneySaved: 3200.00
    }
  },
  {
    id: 'user-biz-1',
    name: 'Glen & Harvest Artisan Bakery',
    email: 'bakery@foodzyra.org',
    role: 'business',
    avatar: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 12345',
    address: '100ft Road, Indiranagar, Bengaluru',
    coordinates: { lat: 12.9784, lng: 77.6408 },
    businessName: 'Glen & Harvest Artisan Bakery',
    businessType: 'bakery',
    businessDescription: 'European-style sourdough, butter croissants, red velvet cupcakes, and artisan garlic baguettes baked daily in wood-fired ovens.',
    isVerified: true,
    joinedDate: '2024-11-10',
    impact: {
      mealsSaved: 480,
      co2SavedKg: 1200.0,
      moneySaved: 58900.00
    }
  },
  {
    id: 'user-biz-2',
    name: 'Sri Udupi Grand & Tiffin Center',
    email: 'udupi@foodzyra.org',
    role: 'business',
    avatar: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 22334',
    address: '80ft Road, 4th Block, Koramangala, Bengaluru',
    coordinates: { lat: 12.9352, lng: 77.6245 },
    businessName: 'Sri Udupi Grand Tiffins',
    businessType: 'restaurant',
    businessDescription: 'Authentic South Indian steamed idlis, golden medu vada, ghee roast dosas, coconut chutneys, and piping hot sambar.',
    isVerified: true,
    joinedDate: '2024-12-01',
    impact: {
      mealsSaved: 620,
      co2SavedKg: 1550.0,
      moneySaved: 48000.00
    }
  },
  {
    id: 'user-biz-3',
    name: 'Meghana Dum Biryani & Curry Point',
    email: 'biryani@foodzyra.org',
    role: 'business',
    avatar: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 33445',
    address: '12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru',
    coordinates: { lat: 12.9710, lng: 77.6415 },
    businessName: 'Meghana Biryani & Curry Point',
    businessType: 'restaurant',
    businessDescription: 'Fragrant spicy dum biryani, Andhra chicken roast, paneer butter masala, and flaky parottas from daily lunch and dinner prep.',
    isVerified: true,
    joinedDate: '2025-01-05',
    impact: {
      mealsSaved: 540,
      co2SavedKg: 1350.0,
      moneySaved: 89000.00
    }
  },
  {
    id: 'user-biz-4',
    name: 'Namdhari’s Fresh & Organic Supermarket',
    email: 'namdharis@foodzyra.org',
    role: 'business',
    avatar: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 67890',
    address: 'CMH Road, Indiranagar, Bengaluru',
    coordinates: { lat: 12.9780, lng: 77.6385 },
    businessName: 'Namdhari’s Fresh Supermarket',
    businessType: 'supermarket',
    businessDescription: 'Farm-fresh hydroponic salad greens, organic bell peppers, A2 dairy milk, fresh paneer, and imported whole-grain groceries.',
    isVerified: true,
    joinedDate: '2024-10-01',
    impact: {
      mealsSaved: 1450,
      co2SavedKg: 3625.0,
      moneySaved: 195000.00
    }
  },
  {
    id: 'user-biz-5',
    name: 'Theobroma & Irani Cafe',
    email: 'theobroma@foodzyra.org',
    role: 'business',
    avatar: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 99887',
    address: 'Hill Road, Bandra West, Mumbai',
    coordinates: { lat: 19.0596, lng: 72.8295 },
    businessName: 'Theobroma Patisserie & Cafe',
    businessType: 'bakery',
    businessDescription: 'Celebrated overload fudge brownies, mawa cakes, red velvet pastries, freshly baked croissants, and sourdough sandwiches.',
    isVerified: true,
    joinedDate: '2025-02-01',
    impact: {
      mealsSaved: 730,
      co2SavedKg: 1825.0,
      moneySaved: 94000.00
    }
  },
  {
    id: 'user-biz-6',
    name: 'Sardar Pav Bhaji & Street Bites',
    email: 'sardar@foodzyra.org',
    role: 'business',
    avatar: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 55667',
    address: 'Lokhandwala Complex, Andheri West, Mumbai',
    coordinates: { lat: 19.1363, lng: 72.8277 },
    businessName: 'Sardar Pav Bhaji & Chaat',
    businessType: 'restaurant',
    businessDescription: 'Extra-buttery Mumbai special pav bhaji, crispy batata vadas, kanda bhajji, and toasted ladi pav fresh from the evening service.',
    isVerified: true,
    joinedDate: '2025-01-20',
    impact: {
      mealsSaved: 390,
      co2SavedKg: 975.0,
      moneySaved: 38500.00
    }
  },
  {
    id: 'user-biz-7',
    name: 'Haldiram’s Sweets, Chaat & Thali',
    email: 'haldirams@foodzyra.org',
    role: 'business',
    avatar: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 77889',
    address: 'Connaught Place, Inner Circle, New Delhi',
    coordinates: { lat: 28.6315, lng: 77.2167 },
    businessName: 'Haldiram’s Sweets & Restaurant',
    businessType: 'restaurant',
    businessDescription: 'Rich Desi Ghee Gulab Jamuns, Kaju Katli, crispy Samosas, Chole Bhature, and North Indian deluxe thali meals.',
    isVerified: true,
    joinedDate: '2024-11-25',
    impact: {
      mealsSaved: 880,
      co2SavedKg: 2200.0,
      moneySaved: 112000.00
    }
  },
  {
    id: 'user-ngo-1',
    name: 'Robin Hood Army & City Relief',
    email: 'contact@robinhoodarmy.org',
    role: 'ngo',
    avatar: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 33221',
    address: '4th Block, Jayanagar, Bengaluru',
    coordinates: { lat: 12.9308, lng: 77.5838 },
    ngoRegistrationNumber: 'NGO-IN-8849201',
    ngoMission: 'Zero-funds volunteer movement rescuing surplus food to serve over 1,200 hot nutritious meals daily to community shelters, orphanages, and families in need.',
    isVerified: true,
    joinedDate: '2024-09-12',
    impact: {
      mealsSaved: 6800,
      co2SavedKg: 17000.0,
      moneySaved: 0
    }
  },
  {
    id: 'user-admin-1',
    name: 'Admin Operations',
    email: 'admin@foodloop.org',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 00000',
    address: 'MG Road Central, Bengaluru',
    coordinates: { lat: 12.9756, lng: 77.6066 },
    joinedDate: '2024-01-01',
    impact: {
      mealsSaved: 18450,
      co2SavedKg: 46125.0,
      moneySaved: 1240000.0
    }
  }
];

export const INITIAL_LISTINGS: FoodListing[] = [
  // 1. Bengaluru - Indiranagar (Bakery Magic Bag)
  {
    id: 'list-blr-1',
    businessId: 'user-biz-1',
    businessName: 'Glen & Harvest Artisan Bakery',
    businessType: 'bakery',
    businessAddress: '100ft Road, Indiranagar, Bengaluru',
    businessRating: 4.9,
    businessAvatar: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&auto=format&fit=crop&q=80',
    title: 'Evening Artisan Sourdough & Croissant Magic Bag',
    description: 'Surprise bag containing 1 freshly baked organic country sourdough loaf, 2 flaky butter croissants, and 2 cinnamon escargot swirls baked fresh today.',
    category: 'Bakery',
    type: 'sale',
    originalPrice: 420.00,
    discountedPrice: 149.00,
    quantity: 5,
    quantityUnit: 'bags',
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80'
    ],
    location: {
      address: '100ft Road, Indiranagar, Bengaluru',
      city: 'Bengaluru',
      lat: 12.9784,
      lng: 77.6408,
      distanceKm: 0.4
    },
    pickupWindow: {
      date: 'Today',
      startTime: '18:30',
      endTime: '20:30'
    },
    expiryInfo: 'Baked fresh today. Best consumed within 48 hours or freeze.',
    dietaryTags: ['Vegetarian', 'Organic'],
    allergens: ['Gluten', 'Dairy'],
    status: 'available',
    weightKgEstimate: 1.6,
    createdAt: '2026-09-16T08:30:00Z'
  },

  // 2. Bengaluru - Koramangala (South Indian Tiffin Feast)
  {
    id: 'list-blr-2',
    businessId: 'user-biz-2',
    businessName: 'Sri Udupi Grand Tiffins',
    businessType: 'restaurant',
    businessAddress: '80ft Road, 4th Block, Koramangala, Bengaluru',
    businessRating: 4.8,
    businessAvatar: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=150&auto=format&fit=crop&q=80',
    title: 'Hot Steamed Idlis, Medu Vada & Sambar Pack',
    description: 'Fresh batch of 4 soft steamed rice idlis, 2 crispy golden medu vadas, authentic Udupi drumstick sambar, and fresh coconut chutney.',
    category: 'Meals & Prepared',
    type: 'sale',
    originalPrice: 220.00,
    discountedPrice: 79.00,
    quantity: 6,
    quantityUnit: 'meal boxes',
    images: [
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80'
    ],
    location: {
      address: '80ft Road, 4th Block, Koramangala, Bengaluru',
      city: 'Bengaluru',
      lat: 12.9352,
      lng: 77.6245,
      distanceKm: 1.2
    },
    pickupWindow: {
      date: 'Today',
      startTime: '17:45',
      endTime: '20:00'
    },
    expiryInfo: 'Hot & fresh. Consume tonight.',
    dietaryTags: ['Vegetarian', 'Gluten-Free'],
    allergens: [],
    status: 'available',
    weightKgEstimate: 1.1,
    createdAt: '2026-09-16T09:00:00Z'
  },

  // 3. Bengaluru - Indiranagar (Biryani & Salan Dinner Box)
  {
    id: 'list-blr-3',
    businessId: 'user-biz-3',
    businessName: 'Meghana Biryani & Curry Point',
    businessType: 'restaurant',
    businessAddress: '12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru',
    businessRating: 4.9,
    businessAvatar: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=150&auto=format&fit=crop&q=80',
    title: 'Hyderabadi Dum Biryani & Mirchi Ka Salan Feast',
    description: 'Generous portion of aromatic long-grain basmati dum biryani with marinated tender spices, boiled egg, creamy raita, and tangy salan gravy.',
    category: 'Meals & Prepared',
    type: 'sale',
    originalPrice: 380.00,
    discountedPrice: 149.00,
    quantity: 8,
    quantityUnit: 'boxes',
    images: [
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80'
    ],
    location: {
      address: '12th Main Road, Indiranagar, Bengaluru',
      city: 'Bengaluru',
      lat: 12.9710,
      lng: 77.6415,
      distanceKm: 0.8
    },
    pickupWindow: {
      date: 'Today',
      startTime: '21:00',
      endTime: '22:15'
    },
    expiryInfo: 'Prepared for evening dinner. Safe to reheat and consume within 24 hours.',
    dietaryTags: ['Halal'],
    allergens: ['Dairy', 'Eggs'],
    status: 'available',
    weightKgEstimate: 1.4,
    createdAt: '2026-09-16T09:30:00Z'
  },

  // 4. Bengaluru - Indiranagar (Bulk Fresh Produce NGO Donation)
  {
    id: 'list-blr-4',
    businessId: 'user-biz-4',
    businessName: 'Namdhari’s Fresh Supermarket',
    businessType: 'supermarket',
    businessAddress: 'CMH Road, Indiranagar, Bengaluru',
    businessRating: 4.7,
    businessAvatar: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=150&auto=format&fit=crop&q=80',
    title: 'Surplus Farm-Fresh Veggies & Organic Greens Crate',
    description: 'Wholesale crates of fresh organic bell peppers, baby spinach bunches, vine-ripened tomatoes, sweet carrots, and cucumber ready for soup kitchens.',
    category: 'Fresh Produce',
    type: 'donation',
    originalPrice: 1400.00,
    discountedPrice: 0.00,
    quantity: 8,
    quantityUnit: 'crates (~15kg each)',
    images: [
      'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80'
    ],
    location: {
      address: 'CMH Road, Indiranagar, Bengaluru',
      city: 'Bengaluru',
      lat: 12.9780,
      lng: 77.6385,
      distanceKm: 0.6
    },
    pickupWindow: {
      date: 'Today',
      startTime: '16:00',
      endTime: '19:30'
    },
    expiryInfo: 'Crisp and farm-fresh. Shelf life 3-4 days.',
    dietaryTags: ['Vegan', 'Organic', 'Gluten-Free'],
    allergens: [],
    status: 'available',
    weightKgEstimate: 15.0,
    createdAt: '2026-09-16T07:15:00Z'
  },

  // 5. Bengaluru - Indiranagar (A2 Milk, Fresh Malai Paneer & Dahi)
  {
    id: 'list-blr-5',
    businessId: 'user-biz-4',
    businessName: 'Namdhari’s Fresh Supermarket',
    businessType: 'supermarket',
    businessAddress: 'CMH Road, Indiranagar, Bengaluru',
    businessRating: 4.7,
    businessAvatar: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=150&auto=format&fit=crop&q=80',
    title: 'Farm Fresh A2 Milk, Artisanal Malai Paneer & Curd Pack',
    description: 'Sealed cold-chain dairy bundle: 500g fresh soft malai paneer block, 1L pasteurized A2 cow milk pouch, and 400g set curd reaching best-before buffer.',
    category: 'Dairy & Refrigerated',
    type: 'sale',
    originalPrice: 360.00,
    discountedPrice: 129.00,
    quantity: 6,
    quantityUnit: 'dairy bundles',
    images: [
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80'
    ],
    location: {
      address: 'CMH Road, Indiranagar, Bengaluru',
      city: 'Bengaluru',
      lat: 12.9780,
      lng: 77.6385,
      distanceKm: 0.6
    },
    pickupWindow: {
      date: 'Today',
      startTime: '17:00',
      endTime: '20:30'
    },
    expiryInfo: '100% sealed & cold-stored. Safe for 4-5 days refrigerated.',
    dietaryTags: ['Vegetarian'],
    allergens: ['Dairy'],
    status: 'available',
    weightKgEstimate: 2.2,
    createdAt: '2026-09-16T08:00:00Z'
  },

  // 6. Mumbai - Bandra West (Theobroma Overload Brownies & Pastries)
  {
    id: 'list-mum-1',
    businessId: 'user-biz-5',
    businessName: 'Theobroma Patisserie & Cafe',
    businessType: 'bakery',
    businessAddress: 'Hill Road, Bandra West, Mumbai',
    businessRating: 4.9,
    businessAvatar: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=150&auto=format&fit=crop&q=80',
    title: 'Signature Overload Brownie & Mawa Cake Teatime Box',
    description: 'Assortment of 2 classic overload chocolate walnut brownies, 2 rich Parsi mawa cake slices, and 1 Dutch truffle pastry box.',
    category: 'Bakery',
    type: 'sale',
    originalPrice: 450.00,
    discountedPrice: 159.00,
    quantity: 6,
    quantityUnit: 'patisserie boxes',
    images: [
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80'
    ],
    location: {
      address: 'Hill Road, Bandra West, Mumbai',
      city: 'Mumbai',
      lat: 19.0596,
      lng: 72.8295,
      distanceKm: 0.5
    },
    pickupWindow: {
      date: 'Today',
      startTime: '19:00',
      endTime: '21:30'
    },
    expiryInfo: 'Freshly baked today. Store in cool place or refrigerate.',
    dietaryTags: ['Vegetarian'],
    allergens: ['Gluten', 'Dairy', 'Nuts (Walnut)'],
    status: 'available',
    weightKgEstimate: 1.2,
    createdAt: '2026-09-16T09:15:00Z'
  },

  // 7. Mumbai - Andheri West (Mumbai Pav Bhaji & Hot Samosas)
  {
    id: 'list-mum-2',
    businessId: 'user-biz-6',
    businessName: 'Sardar Pav Bhaji & Chaat',
    businessType: 'restaurant',
    businessAddress: 'Lokhandwala Complex, Andheri West, Mumbai',
    businessRating: 4.8,
    businessAvatar: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=150&auto=format&fit=crop&q=80',
    title: 'Special Buttery Bombay Pav Bhaji & Ladi Pav Meal',
    description: 'Rich spiced mashed vegetable bhaji simmered with pure Amul butter, diced onions, lemon wedges, and 4 fresh soft ladi pavs.',
    category: 'Meals & Prepared',
    type: 'sale',
    originalPrice: 280.00,
    discountedPrice: 99.00,
    quantity: 7,
    quantityUnit: 'dinner packs',
    images: [
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80'
    ],
    location: {
      address: 'Lokhandwala Complex, Andheri West, Mumbai',
      city: 'Mumbai',
      lat: 19.1363,
      lng: 72.8277,
      distanceKm: 0.7
    },
    pickupWindow: {
      date: 'Today',
      startTime: '20:30',
      endTime: '22:00'
    },
    expiryInfo: 'Hot meal. Best enjoyed tonight.',
    dietaryTags: ['Vegetarian'],
    allergens: ['Dairy', 'Gluten'],
    status: 'available',
    weightKgEstimate: 1.3,
    createdAt: '2026-09-16T09:45:00Z'
  },

  // 8. Delhi NCR - Connaught Place (Haldiram's Sweets & Snacks Box)
  {
    id: 'list-del-1',
    businessId: 'user-biz-7',
    businessName: 'Haldiram’s Sweets & Restaurant',
    businessType: 'restaurant',
    businessAddress: 'Connaught Place, Inner Circle, New Delhi',
    businessRating: 4.8,
    businessAvatar: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=150&auto=format&fit=crop&q=80',
    title: 'Desi Ghee Gulab Jamuns & Kaju Katli Surprise Box',
    description: 'Festive mithai gift box with 4 warm melt-in-mouth Desi Ghee Gulab Jamuns, 6 diamond-cut silver-leaf Kaju Katlis, and 2 golden vegetable samosas.',
    category: 'Surprise Bag',
    type: 'sale',
    originalPrice: 520.00,
    discountedPrice: 179.00,
    quantity: 6,
    quantityUnit: 'mithai boxes',
    images: [
      'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80'
    ],
    location: {
      address: 'Connaught Place, Inner Circle, New Delhi',
      city: 'Delhi NCR',
      lat: 28.6315,
      lng: 77.2167,
      distanceKm: 0.5
    },
    pickupWindow: {
      date: 'Today',
      startTime: '18:00',
      endTime: '20:30'
    },
    expiryInfo: 'Sweets safe for 4 days. Consume samosas today.',
    dietaryTags: ['Vegetarian'],
    allergens: ['Dairy', 'Nuts (Cashew)', 'Gluten'],
    status: 'available',
    weightKgEstimate: 1.2,
    createdAt: '2026-09-16T08:15:00Z'
  },

  // 9. Delhi NCR - Connaught Place (Chole Bhature Lunch Service Surplus)
  {
    id: 'list-del-2',
    businessId: 'user-biz-7',
    businessName: 'Haldiram’s Sweets & Restaurant',
    businessType: 'restaurant',
    businessAddress: 'Connaught Place, Inner Circle, New Delhi',
    businessRating: 4.8,
    businessAvatar: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=150&auto=format&fit=crop&q=80',
    title: 'Pindi Chole, Fluffy Bhature & Mint Chutney Combo',
    description: 'Slow-cooked spiced black chickpeas with aromatics, 2 large bhature, spicy pickled onions, and homemade mint-coriander chutney.',
    category: 'Meals & Prepared',
    type: 'sale',
    originalPrice: 260.00,
    discountedPrice: 89.00,
    quantity: 5,
    quantityUnit: 'portions',
    images: [
      'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80'
    ],
    location: {
      address: 'Connaught Place, Inner Circle, New Delhi',
      city: 'Delhi NCR',
      lat: 28.6315,
      lng: 77.2167,
      distanceKm: 0.5
    },
    pickupWindow: {
      date: 'Today',
      startTime: '17:00',
      endTime: '19:30'
    },
    expiryInfo: 'Fresh from evening batch.',
    dietaryTags: ['Vegetarian'],
    allergens: ['Gluten'],
    status: 'available',
    weightKgEstimate: 1.1,
    createdAt: '2026-09-16T08:45:00Z'
  }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-101',
    listingId: 'list-blr-1',
    listing: INITIAL_LISTINGS[0],
    userId: 'user-cust-1',
    userName: 'Aarav Sharma',
    userRole: 'customer',
    userPhone: '+91 98765 43210',
    pickupCode: 'FL-9421',
    qrCodeData: 'FL-9421-RES-101-FOODZYRA',
    status: 'pending_pickup',
    quantityReserved: 1,
    totalPaid: 149.00,
    reservedAt: '2026-09-16T09:10:00Z',
    notes: 'Please bring your own reusable tote bag.'
  }
];

export const INITIAL_DONATION_CLAIMS: DonationClaim[] = [
  {
    id: 'claim-201',
    listingId: 'list-blr-4',
    listing: INITIAL_LISTINGS[3],
    ngoId: 'user-ngo-1',
    ngoName: 'Robin Hood Army & City Relief',
    ngoContact: '+91 98765 33221 (Volunteer Driver Suresh)',
    pickupCode: 'NGO-7730',
    estimatedPeopleFed: 65,
    status: 'approved',
    claimedAt: '2026-09-16T08:30:00Z'
  }
];

export const INITIAL_PLATFORM_STATS: PlatformStats = {
  totalMealsRescued: 18450,
  co2PreventedKg: 46125.0,
  moneySavedAmount: 1240000.0,
  activeListingsCount: 9,
  totalBusinesses: 32,
  totalNgos: 16,
  totalCommunityMembers: 2150
};
