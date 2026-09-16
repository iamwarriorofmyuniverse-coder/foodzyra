import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { db } from '../db/database';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

const CreateListingSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  category: z.enum([
    'Bakery',
    'Meals & Prepared',
    'Fresh Produce',
    'Groceries',
    'Dairy & Refrigerated',
    'Beverages',
    'Surprise Bag',
    'Pantry'
  ]),
  listingType: z.enum(['sale', 'donation']),
  originalPrice: z.number().min(0),
  discountedPrice: z.number().min(0),
  quantity: z.number().int().positive(),
  quantityUnit: z.string().default('portions'),
  weightKgEstimate: z.number().positive().default(1.0),
  images: z.array(z.string()).default([]),
  dietaryTags: z.array(z.string()).default([]),
  allergens: z.array(z.string()).default([]),
  pickupDate: z.string().min(1),
  pickupStartTime: z.string().min(1),
  pickupEndTime: z.string().min(1),
  expiryInfo: z.string().min(1)
});

const StatusUpdateSchema = z.object({
  status: z.enum(['AVAILABLE', 'RESERVED', 'COLLECTED', 'EXPIRED', 'CANCELLED'])
});

const ReportSchema = z.object({
  reason: z.string().min(3),
  details: z.string().optional()
});

// Helper to auto-expire past listings
function autoExpirePastListings() {
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().split(' ')[0].slice(0, 5); // HH:MM

  // Expire listings where pickup_date < today OR (pickup_date = today AND pickup_end_time < now)
  db.prepare(`
    UPDATE food_listings
    SET status = 'EXPIRED', updated_at = datetime('now')
    WHERE status = 'AVAILABLE'
      AND (
        pickup_date < ?
        OR (pickup_date = ? AND pickup_end_time < ?)
      )
  `).run(currentDate, currentDate, currentTime);
}

// GET /api/listings
router.get('/', (req, res, next) => {
  try {
    // Proactively clean up expired listings before querying
    autoExpirePastListings();

    const { category, type, status, searchQuery, businessId, maxPrice } = req.query;

    let query = `
      SELECT l.*,
             b.business_name, b.business_type, b.address as business_address,
             b.city as business_city, b.latitude, b.longitude, b.rating as business_rating,
             u.avatar_url as business_avatar
      FROM food_listings l
      JOIN businesses b ON b.id = l.business_id
      JOIN users u ON u.id = b.user_id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (status) {
      query += ` AND l.status = ?`;
      params.push(status);
    } else {
      query += ` AND l.status IN ('AVAILABLE', 'RESERVED')`;
    }

    if (category && category !== 'all') {
      query += ` AND l.category = ?`;
      params.push(category);
    }

    if (type && type !== 'all') {
      query += ` AND l.listing_type = ?`;
      params.push(type);
    }

    if (businessId) {
      query += ` AND l.business_id = ?`;
      params.push(businessId);
    }

    if (maxPrice) {
      query += ` AND l.discounted_price <= ?`;
      params.push(Number(maxPrice));
    }

    if (searchQuery) {
      query += ` AND (l.title LIKE ? OR l.description LIKE ? OR b.business_name LIKE ?)`;
      const term = `%${searchQuery}%`;
      params.push(term, term, term);
    }

    query += ` ORDER BY l.created_at DESC`;

    const rows = db.prepare(query).all(...params) as any[];

    const listings = rows.map(r => ({
      id: r.id,
      businessId: r.business_id,
      businessName: r.business_name,
      businessType: r.business_type,
      businessAddress: r.business_address,
      businessRating: r.business_rating,
      businessAvatar: r.business_avatar,
      title: r.title,
      description: r.description,
      category: r.category,
      type: r.listing_type,
      originalPrice: r.original_price,
      discountedPrice: r.discounted_price,
      quantity: r.quantity,
      quantityUnit: r.quantity_unit,
      weightKgEstimate: r.weight_kg_estimate,
      images: JSON.parse(r.images_json || '[]'),
      dietaryTags: JSON.parse(r.dietary_tags_json || '[]'),
      allergens: JSON.parse(r.allergens_json || '[]'),
      location: {
        address: r.business_address,
        city: r.business_city,
        lat: r.latitude,
        lng: r.longitude,
        distanceKm: Number((Math.random() * 2 + 0.3).toFixed(1))
      },
      pickupWindow: {
        date: r.pickup_date,
        startTime: r.pickup_start_time,
        endTime: r.pickup_end_time
      },
      expiryInfo: r.expiry_info,
      status: r.status,
      createdAt: r.created_at
    }));

    res.json({ success: true, count: listings.length, listings });
  } catch (err) {
    next(err);
  }
});

// GET /api/listings/:id
router.get('/:id', (req, res, next) => {
  try {
    const r = db.prepare(`
      SELECT l.*,
             b.business_name, b.business_type, b.address as business_address,
             b.city as business_city, b.latitude, b.longitude, b.rating as business_rating,
             u.avatar_url as business_avatar
      FROM food_listings l
      JOIN businesses b ON b.id = l.business_id
      JOIN users u ON u.id = b.user_id
      WHERE l.id = ?
    `).get(req.params.id) as any;

    if (!r) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    const listing = {
      id: r.id,
      businessId: r.business_id,
      businessName: r.business_name,
      businessType: r.business_type,
      businessAddress: r.business_address,
      businessRating: r.business_rating,
      businessAvatar: r.business_avatar,
      title: r.title,
      description: r.description,
      category: r.category,
      type: r.listing_type,
      originalPrice: r.original_price,
      discountedPrice: r.discounted_price,
      quantity: r.quantity,
      quantityUnit: r.quantity_unit,
      weightKgEstimate: r.weight_kg_estimate,
      images: JSON.parse(r.images_json || '[]'),
      dietaryTags: JSON.parse(r.dietary_tags_json || '[]'),
      allergens: JSON.parse(r.allergens_json || '[]'),
      location: {
        address: r.business_address,
        city: r.business_city,
        lat: r.latitude,
        lng: r.longitude
      },
      pickupWindow: {
        date: r.pickup_date,
        startTime: r.pickup_start_time,
        endTime: r.pickup_end_time
      },
      expiryInfo: r.expiry_info,
      status: r.status,
      createdAt: r.created_at
    };

    res.json({ success: true, listing });
  } catch (err) {
    next(err);
  }
});

// Helper to verify business ownership
function verifyBusinessOwnership(userId: string, userRole: string, businessIdOnListing: string): boolean {
  if (userRole === 'admin') return true;
  const biz = db.prepare('SELECT id FROM businesses WHERE user_id = ?').get(userId) as any;
  return !!(biz && biz.id === businessIdOnListing);
}

// POST /api/listings (Business / Admin only)
router.post('/', authenticate, authorize('business', 'admin'), validate({ body: CreateListingSchema }), (req, res, next) => {
  try {
    const user = req.user!;
    
    // Find business profile
    const biz = db.prepare('SELECT id FROM businesses WHERE user_id = ?').get(user.id) as any;
    if (!biz && user.role !== 'admin') {
      return res.status(400).json({ success: false, error: 'No business profile associated with this account. Please register as a business.' });
    }

    // Business verification check
    const userRecord = db.prepare('SELECT is_verified FROM users WHERE id = ?').get(user.id) as any;
    if (user.role !== 'admin' && userRecord && userRecord.is_verified === 0) {
      return res.status(403).json({
        success: false,
        error: 'Your business profile is pending verification by FoodLoop administrators. Unverified businesses cannot post live food listings.'
      });
    }

    const businessId = user.businessId || (biz ? biz.id : 'biz-admin');

    const id = `list-${uuidv4().slice(0, 8)}`;
    const {
      title, description, category, listingType, originalPrice, discountedPrice,
      quantity, quantityUnit, weightKgEstimate, images, dietaryTags, allergens,
      pickupDate, pickupStartTime, pickupEndTime, expiryInfo
    } = req.body;

    db.prepare(`
      INSERT INTO food_listings (
        id, business_id, title, description, category, listing_type,
        original_price, discounted_price, quantity, quantity_unit,
        weight_kg_estimate, images_json, dietary_tags_json, allergens_json,
        pickup_date, pickup_start_time, pickup_end_time, expiry_info, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'AVAILABLE')
    `).run(
      id,
      businessId,
      title,
      description,
      category,
      listingType,
      originalPrice,
      listingType === 'donation' ? 0 : discountedPrice,
      quantity,
      quantityUnit,
      weightKgEstimate,
      JSON.stringify(images),
      JSON.stringify(dietaryTags),
      JSON.stringify(allergens),
      pickupDate,
      pickupStartTime,
      pickupEndTime,
      expiryInfo
    );

    res.status(201).json({
      success: true,
      message: 'Surplus food listing created successfully',
      listingId: id
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/listings/:id/status
router.patch('/:id/status', authenticate, validate({ body: StatusUpdateSchema }), (req, res, next) => {
  try {
    const { status } = req.body;
    const listing = db.prepare('SELECT * FROM food_listings WHERE id = ?').get(req.params.id) as any;
    if (!listing) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    // IDOR Protection: Ensure user owns this listing or is admin
    const isOwner = verifyBusinessOwnership(req.user!.id, req.user!.role, listing.business_id);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: You do not have permission to modify listings belonging to another business.'
      });
    }

    db.prepare('UPDATE food_listings SET status = ?, updated_at = datetime(\'now\') WHERE id = ?').run(status, req.params.id);

    res.json({ success: true, message: `Listing status updated to ${status}` });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/listings/:id
router.delete('/:id', authenticate, authorize('business', 'admin'), (req, res, next) => {
  try {
    const listing = db.prepare('SELECT * FROM food_listings WHERE id = ?').get(req.params.id) as any;
    if (!listing) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    // IDOR Protection: Ensure user owns this listing or is admin
    const isOwner = verifyBusinessOwnership(req.user!.id, req.user!.role, listing.business_id);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: You do not have permission to delete listings belonging to another business.'
      });
    }

    db.prepare('DELETE FROM food_listings WHERE id = ?').run(req.params.id);

    res.json({ success: true, message: 'Listing deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// POST /api/listings/:id/report
router.post('/:id/report', authenticate, validate({ body: ReportSchema }), (req, res, next) => {
  try {
    const { reason, details } = req.body;
    const listing = db.prepare('SELECT id FROM food_listings WHERE id = ?').get(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    const reportId = `rep-${uuidv4().slice(0, 8)}`;
    db.prepare(`
      INSERT INTO reports (id, listing_id, reported_by_user_id, reason, details)
      VALUES (?, ?, ?, ?, ?)
    `).run(reportId, req.params.id, req.user!.id, reason, details || null);

    res.status(201).json({ success: true, message: 'Listing reported to moderators', reportId });
  } catch (err) {
    next(err);
  }
});

export default router;
