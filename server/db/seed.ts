import bcrypt from 'bcryptjs';
import { db, initDatabase } from './database';

export async function seedDatabase() {
  initDatabase();

  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count > 0) {
    console.log('Database already seeded. Skipping initial seed.');
    return;
  }

  console.log('🌱 Seeding initial FoodLoop relational database...');

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Seed Users
  const insertUser = db.prepare(`
    INSERT INTO users (id, email, password_hash, name, role, phone, address, avatar_url, is_verified)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run(
    'user-cust-1',
    'aarav@foodzyra.org',
    passwordHash,
    'Aarav Sharma',
    'customer',
    '+91 98765 43210',
    'Indiranagar 100ft Road, Bengaluru',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    1
  );

  insertUser.run(
    'user-biz-1',
    'bakery@foodzyra.org',
    passwordHash,
    'Glen & Harvest Artisan Bakery',
    'business',
    '+91 98765 12345',
    '100ft Road, Indiranagar, Bengaluru',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&auto=format&fit=crop&q=80',
    1
  );

  insertUser.run(
    'user-biz-2',
    'udupi@foodzyra.org',
    passwordHash,
    'Sri Udupi Grand & Tiffin Center',
    'business',
    '+91 98765 22334',
    '80ft Road, 4th Block, Koramangala, Bengaluru',
    'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=150&auto=format&fit=crop&q=80',
    1
  );

  insertUser.run(
    'user-biz-3',
    'biryani@foodzyra.org',
    passwordHash,
    'Meghana Dum Biryani & Curry Point',
    'business',
    '+91 98765 33445',
    '12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru',
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=150&auto=format&fit=crop&q=80',
    1
  );

  insertUser.run(
    'user-biz-4',
    'namdharis@foodzyra.org',
    passwordHash,
    'Namdhari’s Fresh Supermarket',
    'business',
    '+91 98765 67890',
    'CMH Road, Indiranagar, Bengaluru',
    'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=150&auto=format&fit=crop&q=80',
    1
  );

  insertUser.run(
    'user-biz-5',
    'theobroma@foodzyra.org',
    passwordHash,
    'Theobroma Patisserie & Cafe',
    'business',
    '+91 98765 99887',
    'Hill Road, Bandra West, Mumbai',
    'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=150&auto=format&fit=crop&q=80',
    1
  );

  insertUser.run(
    'user-biz-6',
    'sardar@foodzyra.org',
    passwordHash,
    'Sardar Pav Bhaji & Chaat',
    'business',
    '+91 98765 55667',
    'Lokhandwala Complex, Andheri West, Mumbai',
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=150&auto=format&fit=crop&q=80',
    1
  );

  insertUser.run(
    'user-biz-7',
    'haldirams@foodzyra.org',
    passwordHash,
    'Haldiram’s Sweets & Restaurant',
    'business',
    '+91 98765 77889',
    'Connaught Place, Inner Circle, New Delhi',
    'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=150&auto=format&fit=crop&q=80',
    1
  );

  insertUser.run(
    'user-ngo-1',
    'contact@robinhoodarmy.org',
    passwordHash,
    'Robin Hood Army & City Relief',
    'ngo',
    '+91 98765 33221',
    '4th Block, Jayanagar, Bengaluru',
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=150&auto=format&fit=crop&q=80',
    1
  );

  insertUser.run(
    'user-admin-1',
    'admin@foodloop.org',
    passwordHash,
    'Admin Operations',
    'admin',
    '+91 98765 00000',
    'MG Road Central, Bengaluru',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    1
  );

  // 2. Seed Businesses
  const insertBusiness = db.prepare(`
    INSERT INTO businesses (id, user_id, business_name, business_type, description, address, city, latitude, longitude, rating)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertBusiness.run(
    'biz-1',
    'user-biz-1',
    'Glen & Harvest Artisan Bakery',
    'bakery',
    'European-style sourdough, butter croissants, red velvet cupcakes, and artisan garlic baguettes baked daily in wood-fired ovens.',
    '100ft Road, Indiranagar, Bengaluru',
    'Bengaluru',
    12.9784,
    77.6408,
    4.9
  );

  insertBusiness.run(
    'biz-2',
    'user-biz-2',
    'Sri Udupi Grand Tiffins',
    'restaurant',
    'Authentic South Indian steamed idlis, golden medu vada, ghee roast dosas, coconut chutneys, and piping hot sambar.',
    '80ft Road, 4th Block, Koramangala, Bengaluru',
    'Bengaluru',
    12.9352,
    77.6245,
    4.8
  );

  insertBusiness.run(
    'biz-3',
    'user-biz-3',
    'Meghana Dum Biryani & Curry Point',
    'restaurant',
    'Fragrant spicy dum biryani, Andhra chicken roast, paneer butter masala, and flaky parottas from daily lunch and dinner prep.',
    '12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru',
    'Bengaluru',
    12.9710,
    77.6415,
    4.9
  );

  insertBusiness.run(
    'biz-4',
    'user-biz-4',
    'Namdhari’s Fresh Supermarket',
    'supermarket',
    'Farm-fresh hydroponic salad greens, organic bell peppers, A2 dairy milk, fresh paneer, and imported whole-grain groceries.',
    'CMH Road, Indiranagar, Bengaluru',
    'Bengaluru',
    12.9780,
    77.6385,
    4.7
  );

  insertBusiness.run(
    'biz-5',
    'user-biz-5',
    'Theobroma Patisserie & Cafe',
    'bakery',
    'Celebrated overload fudge brownies, mawa cakes, red velvet pastries, freshly baked croissants, and sourdough sandwiches.',
    'Hill Road, Bandra West, Mumbai',
    'Mumbai',
    19.0596,
    72.8295,
    4.9
  );

  insertBusiness.run(
    'biz-6',
    'user-biz-6',
    'Sardar Pav Bhaji & Chaat',
    'restaurant',
    'Extra-buttery Mumbai special pav bhaji, crispy batata vadas, kanda bhajji, and toasted ladi pav fresh from the evening service.',
    'Lokhandwala Complex, Andheri West, Mumbai',
    'Mumbai',
    19.1363,
    72.8277,
    4.8
  );

  insertBusiness.run(
    'biz-7',
    'user-biz-7',
    'Haldiram’s Sweets & Restaurant',
    'restaurant',
    'Rich Desi Ghee Gulab Jamuns, Kaju Katli, crispy Samosas, Chole Bhature, and North Indian deluxe thali meals.',
    'Connaught Place, Inner Circle, New Delhi',
    'Delhi NCR',
    28.6315,
    77.2167,
    4.8
  );

  // 3. Seed NGOs
  const insertNgo = db.prepare(`
    INSERT INTO ngos (id, user_id, ngo_name, registration_number, mission_statement, contact_phone, address)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertNgo.run(
    'ngo-1',
    'user-ngo-1',
    'Robin Hood Army & City Relief',
    'NGO-IN-8849201',
    'Zero-funds volunteer movement rescuing surplus food to serve over 1,200 hot nutritious meals daily to community shelters, orphanages, and families in need.',
    '+91 98765 33221',
    '4th Block, Jayanagar, Bengaluru'
  );

  // 4. Seed Food Listings
  const insertListing = db.prepare(`
    INSERT INTO food_listings (
      id, business_id, title, description, category, listing_type,
      original_price, discounted_price, quantity, quantity_unit,
      weight_kg_estimate, images_json, dietary_tags_json, allergens_json,
      pickup_date, pickup_start_time, pickup_end_time, expiry_info, status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertListing.run(
    'list-1',
    'biz-1',
    'Evening Artisan Sourdough & Croissant Magic Bag',
    'Surprise bag containing 1 freshly baked organic country sourdough loaf, 2 flaky butter croissants, and 2 cinnamon escargot swirls baked fresh today.',
    'Bakery',
    'sale',
    420.00,
    149.00,
    5,
    'bags',
    1.6,
    JSON.stringify(['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80']),
    JSON.stringify(['Vegetarian', 'Organic']),
    JSON.stringify(['Gluten', 'Dairy']),
    'Today',
    '18:30',
    '20:30',
    'Baked fresh today. Best consumed within 48 hours or freeze.',
    'AVAILABLE'
  );

  insertListing.run(
    'list-2',
    'biz-2',
    'Hot Steamed Idlis, Medu Vada & Sambar Pack',
    'Fresh batch of 4 soft steamed rice idlis, 2 crispy golden medu vadas, authentic Udupi drumstick sambar, and fresh coconut chutney.',
    'Meals & Prepared',
    'sale',
    220.00,
    79.00,
    6,
    'meal boxes',
    1.1,
    JSON.stringify(['https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80']),
    JSON.stringify(['Vegetarian', 'Gluten-Free']),
    JSON.stringify([]),
    'Today',
    '17:45',
    '20:00',
    'Hot & fresh. Consume tonight.',
    'AVAILABLE'
  );

  insertListing.run(
    'list-3',
    'biz-4',
    'Surplus Farm-Fresh Veggies & Organic Greens Crate (Bulk Donation)',
    'Wholesale crates of fresh organic bell peppers, baby spinach bunches, vine-ripened tomatoes, sweet carrots, and cucumber ready for soup kitchens.',
    'Fresh Produce',
    'donation',
    1400.00,
    0.00,
    8,
    'crates (~15kg each)',
    15.0,
    JSON.stringify(['https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=600&auto=format&fit=crop&q=80']),
    JSON.stringify(['Vegan', 'Organic', 'Gluten-Free']),
    JSON.stringify([]),
    'Today',
    '16:00',
    '19:30',
    'Crisp and farm-fresh. Shelf life 3-4 days.',
    'AVAILABLE'
  );

  insertListing.run(
    'list-4',
    'biz-4',
    'Farm Fresh A2 Milk, Artisanal Malai Paneer & Curd Pack',
    'Sealed cold-chain dairy bundle: 500g fresh soft malai paneer block, 1L pasteurized A2 cow milk pouch, and 400g set curd reaching best-before buffer.',
    'Dairy & Refrigerated',
    'sale',
    360.00,
    129.00,
    6,
    'dairy bundles',
    2.2,
    JSON.stringify(['https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80']),
    JSON.stringify(['Vegetarian']),
    JSON.stringify(['Dairy']),
    'Today',
    '17:00',
    '20:30',
    '100% sealed & cold-stored. Safe for 4-5 days refrigerated.',
    'AVAILABLE'
  );

  insertListing.run(
    'list-5',
    'biz-3',
    'Hyderabadi Dum Biryani & Mirchi Ka Salan Feast',
    'Generous portion of aromatic long-grain basmati dum biryani with marinated tender spices, boiled egg, creamy raita, and tangy salan gravy.',
    'Meals & Prepared',
    'sale',
    380.00,
    149.00,
    8,
    'boxes',
    1.4,
    JSON.stringify(['https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80']),
    JSON.stringify(['Halal']),
    JSON.stringify(['Dairy', 'Eggs']),
    'Today',
    '21:00',
    '22:15',
    'Prepared for evening dinner. Safe to reheat and consume within 24 hours.',
    'AVAILABLE'
  );

  insertListing.run(
    'list-6',
    'biz-5',
    'Signature Overload Brownie & Mawa Cake Teatime Box',
    'Assortment of 2 classic overload chocolate walnut brownies, 2 rich Parsi mawa cake slices, and 1 Dutch truffle pastry box.',
    'Bakery',
    'sale',
    450.00,
    159.00,
    6,
    'patisserie boxes',
    1.2,
    JSON.stringify(['https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80']),
    JSON.stringify(['Vegetarian']),
    JSON.stringify(['Gluten', 'Dairy', 'Nuts (Walnut)']),
    'Today',
    '19:00',
    '21:30',
    'Freshly baked today. Store in cool place or refrigerate.',
    'AVAILABLE'
  );

  // 5. Seed Reservations
  const insertReservation = db.prepare(`
    INSERT INTO reservations (id, listing_id, customer_id, pickup_code, qr_code_data, quantity_reserved, total_paid, notes, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertReservation.run(
    'res-1',
    'list-1',
    'user-cust-1',
    'FL-9421',
    'FL-9421-RES-1-FOODLOOP',
    1,
    149.00,
    'Please bring your own reusable tote bag.',
    'PENDING'
  );

  // 6. Seed Donation Claim
  const insertDonation = db.prepare(`
    INSERT INTO donations (id, listing_id, ngo_id, pickup_code, estimated_people_fed, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertDonation.run(
    'don-1',
    'list-3',
    'ngo-1',
    'NGO-7730',
    60,
    'APPROVED'
  );

  console.log('✅ Seed completed successfully with relational entities and sample listings!');
}
