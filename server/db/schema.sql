-- FoodLoop Relational Database Schema (PostgreSQL / Supabase & SQLite compatible)

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('customer', 'business', 'ngo', 'admin')),
  phone TEXT,
  address TEXT,
  avatar_url TEXT,
  is_verified INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 2. Businesses Table
CREATE TABLE IF NOT EXISTS businesses (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL CHECK(business_type IN ('restaurant', 'bakery', 'supermarket', 'hostel', 'household', 'cafe', 'other')),
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'San Francisco',
  latitude REAL NOT NULL DEFAULT 37.7749,
  longitude REAL NOT NULL DEFAULT -122.4194,
  rating REAL NOT NULL DEFAULT 5.0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 3. NGOs Table
CREATE TABLE IF NOT EXISTS ngos (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ngo_name TEXT NOT NULL,
  registration_number TEXT NOT NULL,
  mission_statement TEXT,
  contact_phone TEXT,
  address TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 4. Food Listings Table
CREATE TABLE IF NOT EXISTS food_listings (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK(category IN ('Bakery', 'Meals & Prepared', 'Fresh Produce', 'Groceries', 'Dairy & Refrigerated', 'Beverages', 'Surprise Bag', 'Pantry')),
  listing_type TEXT NOT NULL CHECK(listing_type IN ('sale', 'donation')),
  original_price REAL NOT NULL DEFAULT 0.0,
  discounted_price REAL NOT NULL DEFAULT 0.0,
  quantity INTEGER NOT NULL CHECK(quantity >= 0),
  quantity_unit TEXT NOT NULL DEFAULT 'portions',
  weight_kg_estimate REAL NOT NULL DEFAULT 1.0,
  images_json TEXT NOT NULL DEFAULT '[]',
  dietary_tags_json TEXT NOT NULL DEFAULT '[]',
  allergens_json TEXT NOT NULL DEFAULT '[]',
  pickup_date TEXT NOT NULL,
  pickup_start_time TEXT NOT NULL,
  pickup_end_time TEXT NOT NULL,
  expiry_info TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK(status IN ('AVAILABLE', 'RESERVED', 'COLLECTED', 'EXPIRED', 'CANCELLED')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 5. Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL REFERENCES food_listings(id) ON DELETE CASCADE,
  customer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pickup_code TEXT UNIQUE NOT NULL,
  qr_code_data TEXT NOT NULL,
  quantity_reserved INTEGER NOT NULL CHECK(quantity_reserved > 0),
  total_paid REAL NOT NULL DEFAULT 0.0,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'COLLECTED', 'CANCELLED')),
  reserved_at TEXT NOT NULL DEFAULT (datetime('now')),
  collected_at TEXT
);

-- 6. Donations Table
CREATE TABLE IF NOT EXISTS donations (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL REFERENCES food_listings(id) ON DELETE CASCADE,
  ngo_id TEXT NOT NULL REFERENCES ngos(id) ON DELETE CASCADE,
  pickup_code TEXT UNIQUE NOT NULL,
  estimated_people_fed INTEGER NOT NULL DEFAULT 10,
  status TEXT NOT NULL DEFAULT 'REQUESTED' CHECK(status IN ('REQUESTED', 'APPROVED', 'COLLECTED', 'DISTRIBUTED')),
  claimed_at TEXT NOT NULL DEFAULT (datetime('now')),
  collected_at TEXT
);

-- 7. Pickup Records Table
CREATE TABLE IF NOT EXISTS pickup_records (
  id TEXT PRIMARY KEY,
  pickup_code TEXT NOT NULL,
  pickup_type TEXT NOT NULL CHECK(pickup_type IN ('reservation', 'donation')),
  reference_id TEXT NOT NULL,
  listing_id TEXT NOT NULL REFERENCES food_listings(id) ON DELETE CASCADE,
  verified_by_user_id TEXT NOT NULL REFERENCES users(id),
  recipient_user_id TEXT NOT NULL REFERENCES users(id),
  meals_rescued_count INTEGER NOT NULL DEFAULT 1,
  co2_avoided_kg REAL NOT NULL DEFAULT 0.0,
  money_saved_amount REAL NOT NULL DEFAULT 0.0,
  verified_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 8. Reports Table
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL REFERENCES food_listings(id) ON DELETE CASCADE,
  reported_by_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'APPROVED', 'DISMISSED', 'RESOLVED')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  resolved_at TEXT
);

-- 9. Learned Food Plates Table (AI Continuous Learning & Visual Memory)
CREATE TABLE IF NOT EXISTS learned_food_plates (
  id TEXT PRIMARY KEY,
  meal_name TEXT NOT NULL,
  meal_type TEXT NOT NULL DEFAULT 'Meals & Prepared',
  food_description TEXT,
  color_fingerprint TEXT NOT NULL, -- JSON with color ratios
  detected_items_json TEXT NOT NULL, -- JSON array of detected items
  confidence REAL NOT NULL DEFAULT 0.95,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_food_listings_business_id ON food_listings(business_id);
CREATE INDEX IF NOT EXISTS idx_food_listings_status ON food_listings(status);
CREATE INDEX IF NOT EXISTS idx_food_listings_type ON food_listings(listing_type);
CREATE INDEX IF NOT EXISTS idx_reservations_customer_id ON reservations(customer_id);
CREATE INDEX IF NOT EXISTS idx_reservations_pickup_code ON reservations(pickup_code);
CREATE INDEX IF NOT EXISTS idx_donations_ngo_id ON donations(ngo_id);
CREATE INDEX IF NOT EXISTS idx_donations_pickup_code ON donations(pickup_code);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_learned_food_plates_meal_name ON learned_food_plates(meal_name);
