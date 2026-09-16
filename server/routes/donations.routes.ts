import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { db } from '../db/database';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

const ClaimDonationSchema = z.object({
  listingId: z.string(),
  estimatedPeopleFed: z.number().int().positive().default(20)
});

// POST /api/donations (NGO claims donation)
router.post('/', authenticate, authorize('ngo', 'admin'), validate({ body: ClaimDonationSchema }), (req, res, next) => {
  try {
    const { listingId, estimatedPeopleFed } = req.body;
    const userId = req.user!.id;

    let ngoId = req.user!.ngoId;
    const ngo = db.prepare('SELECT id FROM ngos WHERE user_id = ?').get(userId) as any;
    
    if (!ngo && req.user!.role !== 'admin') {
      return res.status(400).json({ success: false, error: 'No registered NGO profile associated with this account.' });
    }

    const userRecord = db.prepare('SELECT is_verified FROM users WHERE id = ?').get(userId) as any;
    if (req.user!.role !== 'admin' && userRecord && userRecord.is_verified === 0) {
      return res.status(403).json({
        success: false,
        error: 'Your NGO profile is pending verification. Only verified NGOs can claim surplus food donations.'
      });
    }

    if (!ngoId && ngo) {
      ngoId = ngo.id;
    }

    const claimTx = db.transaction(() => {
      const listing = db.prepare('SELECT * FROM food_listings WHERE id = ?').get(listingId) as any;
      if (!listing) {
        throw new Error('Food listing not found');
      }

      if (listing.listing_type !== 'donation') {
        throw new Error('This listing is not designated for donation');
      }

      if (listing.status !== 'AVAILABLE') {
        throw new Error(`This donation is already ${listing.status}`);
      }

      // Mark listing reserved
      db.prepare('UPDATE food_listings SET status = \'RESERVED\', updated_at = datetime(\'now\') WHERE id = ?').run(listingId);

      const donationId = `don-${uuidv4().slice(0, 8)}`;
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const pickupCode = `NGO-${randomCode}`;

      db.prepare(`
        INSERT INTO donations (id, listing_id, ngo_id, pickup_code, estimated_people_fed, status)
        VALUES (?, ?, ?, ?, ?, 'APPROVED')
      `).run(donationId, listingId, ngoId, pickupCode, estimatedPeopleFed);

      return {
        id: donationId,
        pickupCode,
        estimatedPeopleFed,
        status: 'APPROVED'
      };
    });

    const result = claimTx();

    res.status(201).json({
      success: true,
      message: 'Donation claimed successfully for food bank distribution',
      donation: result
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET /api/donations (NGO's claims or business donations)
router.get('/', authenticate, (req, res, next) => {
  try {
    const userId = req.user!.id;
    const role = req.user!.role;

    let query = `
      SELECT d.*,
             l.title, l.description, l.category, l.quantity, l.quantity_unit, l.weight_kg_estimate,
             l.images_json, l.pickup_date, l.pickup_start_time, l.pickup_end_time,
             b.business_name, b.address as business_address, b.city as business_city,
             n.ngo_name, n.registration_number, n.contact_phone, n.address as ngo_address
      FROM donations d
      JOIN food_listings l ON l.id = d.listing_id
      JOIN businesses b ON b.id = l.business_id
      JOIN ngos n ON n.id = d.ngo_id
    `;

    const params: any[] = [];

    if (role === 'ngo') {
      const ngo = db.prepare('SELECT id FROM ngos WHERE user_id = ?').get(userId) as any;
      if (ngo) {
        query += ` WHERE d.ngo_id = ?`;
        params.push(ngo.id);
      }
    } else if (role === 'business') {
      const biz = db.prepare('SELECT id FROM businesses WHERE user_id = ?').get(userId) as any;
      if (biz) {
        query += ` WHERE l.business_id = ?`;
        params.push(biz.id);
      }
    }

    query += ` ORDER BY d.claimed_at DESC`;

    const rows = db.prepare(query).all(...params) as any[];

    const donations = rows.map(d => ({
      id: d.id,
      listingId: d.listing_id,
      ngoId: d.ngo_id,
      ngoName: d.ngo_name,
      pickupCode: d.pickup_code,
      estimatedPeopleFed: d.estimated_people_fed,
      status: d.status,
      claimedAt: d.claimed_at,
      collectedAt: d.collected_at,
      listing: {
        title: d.title,
        description: d.description,
        category: d.category,
        quantity: d.quantity,
        quantityUnit: d.quantity_unit,
        weightKgEstimate: d.weight_kg_estimate,
        images: JSON.parse(d.images_json || '[]'),
        businessName: d.business_name,
        businessAddress: d.business_address,
        pickupWindow: {
          date: d.pickup_date,
          startTime: d.pickup_start_time,
          endTime: d.pickup_end_time
        }
      }
    }));

    res.json({ success: true, count: donations.length, donations });
  } catch (err) {
    next(err);
  }
});

export default router;
