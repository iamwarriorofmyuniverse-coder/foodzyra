import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { db } from '../db/database';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

const VerifyPickupSchema = z.object({
  pickupCode: z.string().min(4)
});

// POST /api/pickups/verify
router.post('/verify', authenticate, validate({ body: VerifyPickupSchema }), (req, res, next) => {
  try {
    const { pickupCode } = req.body;
    const cleanCode = pickupCode.trim().toUpperCase();
    const verifierUserId = req.user!.id;

    const userRole = req.user!.role;

    const verifyTx = db.transaction(() => {
      // 1. Check if it matches a Customer Reservation
      const reservation = db.prepare(`
        SELECT r.*, l.id as listing_id, l.title, l.weight_kg_estimate, l.original_price, l.discounted_price,
               b.user_id as business_user_id
        FROM reservations r
        JOIN food_listings l ON l.id = r.listing_id
        JOIN businesses b ON b.id = l.business_id
        WHERE r.pickup_code = ? AND r.status = 'PENDING'
      `).get(cleanCode) as any;

      if (reservation) {
        // Authorization: Only the business owner or an admin can verify pickup
        if (userRole !== 'admin' && reservation.business_user_id !== verifierUserId) {
          const err: any = new Error('Forbidden: You can only verify pickups for your own business listings.');
          err.statusCode = 403;
          throw err;
        }

        // Mark reservation collected
        db.prepare('UPDATE reservations SET status = \'COLLECTED\', collected_at = datetime(\'now\') WHERE id = ?').run(reservation.id);
        
        // Update listing status
        db.prepare('UPDATE food_listings SET status = \'COLLECTED\', updated_at = datetime(\'now\') WHERE id = ?').run(reservation.listing_id);

        const mealsCount = Math.max(1, Math.round((reservation.weight_kg_estimate * reservation.quantity_reserved) / 0.5));
        const co2Avoided = Number(((reservation.weight_kg_estimate * reservation.quantity_reserved) * 2.5).toFixed(1));
        const moneySaved = Number((Math.max(0, (reservation.original_price * reservation.quantity_reserved) - reservation.total_paid)).toFixed(2));

        const recordId = `pkr-${uuidv4().slice(0, 8)}`;
        db.prepare(`
          INSERT INTO pickup_records (
            id, pickup_code, pickup_type, reference_id, listing_id,
            verified_by_user_id, recipient_user_id, meals_rescued_count,
            co2_avoided_kg, money_saved_amount
          )
          VALUES (?, ?, 'reservation', ?, ?, ?, ?, ?, ?, ?)
        `).run(
          recordId,
          cleanCode,
          reservation.id,
          reservation.listing_id,
          verifierUserId,
          reservation.customer_id,
          mealsCount,
          co2Avoided,
          moneySaved
        );

        return {
          type: 'customer_reservation',
          title: reservation.title,
          mealsCount,
          co2AvoidedKg: co2Avoided,
          moneySaved
        };
      }

      // 2. Check if it matches an NGO Donation
      const donation = db.prepare(`
        SELECT d.*, l.id as listing_id, l.title, l.weight_kg_estimate, l.original_price, n.user_id as ngo_user_id,
               b.user_id as business_user_id
        FROM donations d
        JOIN food_listings l ON l.id = d.listing_id
        JOIN businesses b ON b.id = l.business_id
        JOIN ngos n ON n.id = d.ngo_id
        WHERE d.pickup_code = ? AND d.status = 'APPROVED'
      `).get(cleanCode) as any;

      if (donation) {
        // Authorization: Only the business owner or an admin can verify pickup
        if (userRole !== 'admin' && donation.business_user_id !== verifierUserId) {
          const err: any = new Error('Forbidden: You can only verify donations for your own business listings.');
          err.statusCode = 403;
          throw err;
        }

        // Mark donation collected
        db.prepare('UPDATE donations SET status = \'COLLECTED\', collected_at = datetime(\'now\') WHERE id = ?').run(donation.id);
        
        // Update listing status
        db.prepare('UPDATE food_listings SET status = \'COLLECTED\', updated_at = datetime(\'now\') WHERE id = ?').run(donation.listing_id);

        const mealsCount = Math.max(1, Math.round(donation.weight_kg_estimate / 0.5));
        const co2Avoided = Number((donation.weight_kg_estimate * 2.5).toFixed(1));
        const moneySaved = Number(donation.original_price.toFixed(2));

        const recordId = `pkr-${uuidv4().slice(0, 8)}`;
        db.prepare(`
          INSERT INTO pickup_records (
            id, pickup_code, pickup_type, reference_id, listing_id,
            verified_by_user_id, recipient_user_id, meals_rescued_count,
            co2_avoided_kg, money_saved_amount
          )
          VALUES (?, ?, 'donation', ?, ?, ?, ?, ?, ?, ?)
        `).run(
          recordId,
          cleanCode,
          donation.id,
          donation.listing_id,
          verifierUserId,
          donation.ngo_user_id,
          mealsCount,
          co2Avoided,
          moneySaved
        );

        return {
          type: 'ngo_donation',
          title: donation.title,
          mealsCount,
          co2AvoidedKg: co2Avoided,
          moneySaved
        };
      }

      throw new Error(`Invalid or already completed pickup code: "${cleanCode}".`);
    });

    const result = verifyTx();

    res.json({
      success: true,
      message: 'Pickup verified and marked as collected',
      impact: result
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET /api/pickups/history
router.get('/history', authenticate, (req, res, next) => {
  try {
    const history = db.prepare(`
      SELECT p.*, l.title as listing_title, u.name as recipient_name, v.name as verified_by_name
      FROM pickup_records p
      JOIN food_listings l ON l.id = p.listing_id
      JOIN users u ON u.id = p.recipient_user_id
      JOIN users v ON v.id = p.verified_by_user_id
      ORDER BY p.verified_at DESC
      LIMIT 50
    `).all();

    res.json({ success: true, count: history.length, history });
  } catch (err) {
    next(err);
  }
});

export default router;
