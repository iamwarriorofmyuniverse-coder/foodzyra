import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { db } from '../db/database';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

const CreateReservationSchema = z.object({
  listingId: z.string(),
  quantity: z.number().int().positive().default(1),
  notes: z.string().optional()
});

// POST /api/reservations (Customer reserve food)
router.post('/', authenticate, validate({ body: CreateReservationSchema }), (req, res, next) => {
  try {
    const { listingId, quantity, notes } = req.body;
    const userId = req.user!.id;

    if (quantity <= 0) {
      return res.status(400).json({ success: false, error: 'Quantity must be at least 1' });
    }

    // Atomic Database Transaction for stock decrement and reservation creation
    const createResTx = db.transaction(() => {
      // 1. Fetch fresh listing row inside transaction lock
      const listing = db.prepare(`
        SELECT l.*, b.business_name, b.address as business_address, b.city as business_city,
               b.latitude, b.longitude
        FROM food_listings l
        JOIN businesses b ON b.id = l.business_id
        WHERE l.id = ?
      `).get(listingId) as any;

      if (!listing) {
        throw new Error('Food listing not found');
      }

      // 2. Check Expiration: pickup_date & pickup_end_time
      const now = new Date();
      if (listing.pickup_date && listing.pickup_end_time) {
        try {
          const pickupEndDateTime = new Date(`${listing.pickup_date}T${listing.pickup_end_time}:00`);
          if (!isNaN(pickupEndDateTime.getTime()) && now > pickupEndDateTime) {
            // Automatically mark listing as EXPIRED
            db.prepare('UPDATE food_listings SET status = \'EXPIRED\', updated_at = datetime(\'now\') WHERE id = ?').run(listingId);
            throw new Error(`This listing has expired. Pickup window ended on ${listing.pickup_date} at ${listing.pickup_end_time}.`);
          }
        } catch (e: any) {
          if (e.message.includes('expired')) throw e;
        }
      }

      // 3. Check Listing Status
      if (listing.status !== 'AVAILABLE') {
        throw new Error(`This listing is currently ${listing.status} and cannot be reserved.`);
      }

      // 4. Check for Overbooking
      if (listing.quantity < quantity) {
        throw new Error(`Overbooking prevented: Only ${listing.quantity} ${listing.quantity_unit || 'item(s)'} available.`);
      }

      // 5. Prevent Duplicate Pending Reservation by same user on same listing
      const existingPending = db.prepare(`
        SELECT id, pickup_code FROM reservations 
        WHERE listing_id = ? AND customer_id = ? AND status = 'PENDING'
      `).get(listingId, userId) as any;

      if (existingPending) {
        throw new Error(`You already have an active pending reservation (Code: ${existingPending.pickup_code}) for this item. Please collect or cancel it first.`);
      }

      // 6. Calculate Remaining Quantity & Next Listing Status
      const remainingQty = listing.quantity - quantity;
      const newStatus = remainingQty === 0 ? 'RESERVED' : 'AVAILABLE';

      // 7. Update listing stock atomically
      db.prepare('UPDATE food_listings SET quantity = ?, status = ?, updated_at = datetime(\'now\') WHERE id = ?').run(
        remainingQty,
        newStatus,
        listingId
      );

      // 8. Generate 6-digit pickup verification token
      const reservationId = `res-${uuidv4().slice(0, 8)}`;
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const pickupCode = `FL-${randomCode}`;
      const qrCodeData = `FOODLOOP-CODE-${pickupCode}-ID-${listingId}`;
      const totalPaid = Number((listing.discounted_price * quantity).toFixed(2));

      db.prepare(`
        INSERT INTO reservations (id, listing_id, customer_id, pickup_code, qr_code_data, quantity_reserved, total_paid, notes, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')
      `).run(reservationId, listingId, userId, pickupCode, qrCodeData, quantity, totalPaid, notes || null);

      return {
        id: reservationId,
        listingId,
        pickupCode,
        qrCodeData,
        totalPaid,
        quantityReserved: quantity,
        status: 'PENDING',
        reservedAt: new Date().toISOString(),
        listing: {
          id: listing.id,
          title: listing.title,
          description: listing.description,
          category: listing.category,
          type: listing.listing_type,
          originalPrice: listing.original_price,
          discountedPrice: listing.discounted_price,
          quantityUnit: listing.quantity_unit,
          weightKgEstimate: listing.weight_kg_estimate,
          images: JSON.parse(listing.images_json || '[]'),
          businessName: listing.business_name,
          businessAddress: listing.business_address,
          location: {
            lat: listing.latitude,
            lng: listing.longitude,
            address: listing.business_address
          },
          pickupWindow: {
            date: listing.pickup_date,
            startTime: listing.pickup_start_time,
            endTime: listing.pickup_end_time
          }
        }
      };
    });

    const result = createResTx();

    res.status(201).json({
      success: true,
      message: 'Surplus food reserved successfully! Your pickup token has been generated.',
      reservation: result
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET /api/reservations (User's reservations)
router.get('/', authenticate, (req, res, next) => {
  try {
    const userId = req.user!.id;
    const role = req.user!.role;

    let query = `
      SELECT r.*,
             l.title, l.description, l.category, l.listing_type, l.original_price, l.discounted_price,
             l.quantity_unit, l.weight_kg_estimate, l.images_json, l.pickup_date, l.pickup_start_time, l.pickup_end_time,
             b.business_name, b.address as business_address, b.city as business_city,
             u.name as customer_name, u.phone as customer_phone, u.email as customer_email
      FROM reservations r
      JOIN food_listings l ON l.id = r.listing_id
      JOIN businesses b ON b.id = l.business_id
      JOIN users u ON u.id = r.customer_id
    `;

    const params: any[] = [];

    if (role === 'customer') {
      query += ` WHERE r.customer_id = ?`;
      params.push(userId);
    } else if (role === 'business') {
      const biz = db.prepare('SELECT id FROM businesses WHERE user_id = ?').get(userId) as any;
      if (biz) {
        query += ` WHERE l.business_id = ?`;
        params.push(biz.id);
      }
    }

    query += ` ORDER BY r.reserved_at DESC`;

    const rows = db.prepare(query).all(...params) as any[];

    const reservations = rows.map(r => ({
      id: r.id,
      listingId: r.listing_id,
      customerId: r.customer_id,
      customerName: r.customer_name,
      customerPhone: r.customer_phone,
      customerEmail: r.customer_email,
      pickupCode: r.pickup_code,
      qrCodeData: r.qr_code_data,
      quantityReserved: r.quantity_reserved,
      totalPaid: r.total_paid,
      notes: r.notes,
      status: r.status,
      reservedAt: r.reserved_at,
      collectedAt: r.collected_at,
      listing: {
        id: r.listing_id,
        title: r.title,
        description: r.description,
        category: r.category,
        type: r.listing_type,
        originalPrice: r.original_price,
        discountedPrice: r.discounted_price,
        quantityUnit: r.quantity_unit,
        weightKgEstimate: r.weight_kg_estimate,
        images: JSON.parse(r.images_json || '[]'),
        businessName: r.business_name,
        businessAddress: r.business_address,
        pickupWindow: {
          date: r.pickup_date,
          startTime: r.pickup_start_time,
          endTime: r.pickup_end_time
        }
      }
    }));

    res.json({ success: true, count: reservations.length, reservations });
  } catch (err) {
    next(err);
  }
});

// POST /api/reservations/:id/cancel
router.post('/:id/cancel', authenticate, (req, res, next) => {
  try {
    const resId = req.params.id;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const cancelTx = db.transaction(() => {
      const reservation = db.prepare('SELECT * FROM reservations WHERE id = ?').get(resId) as any;
      if (!reservation) {
        const err: any = new Error('Reservation not found');
        err.statusCode = 404;
        throw err;
      }

      // IDOR Protection: Only the customer who reserved or an admin can cancel
      if (userRole !== 'admin' && reservation.customer_id !== userId) {
        const err: any = new Error('Forbidden: You can only cancel your own reservations');
        err.statusCode = 403;
        throw err;
      }

      if (reservation.status !== 'PENDING') {
        throw new Error(`Cannot cancel a reservation with status '${reservation.status}'`);
      }

      // Restore stock
      db.prepare('UPDATE food_listings SET quantity = quantity + ?, status = \'AVAILABLE\', updated_at = datetime(\'now\') WHERE id = ?').run(
        reservation.quantity_reserved,
        reservation.listing_id
      );

      // Update reservation status
      db.prepare('UPDATE reservations SET status = \'CANCELLED\' WHERE id = ?').run(resId);
    });

    cancelTx();

    res.json({ success: true, message: 'Reservation cancelled and listing stock restored' });
  } catch (err: any) {
    const status = err.statusCode || 400;
    res.status(status).json({ success: false, error: err.message });
  }
});

export default router;
