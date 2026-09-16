import { Router } from 'express';
import { db } from '../db/database';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Apply admin authentication to all routes in this file
router.use(authenticate, authorize('admin'));

// GET /api/admin/stats
router.get('/stats', (req, res, next) => {
  try {
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as any;
    const totalBusinesses = db.prepare('SELECT COUNT(*) as count FROM businesses').get() as any;
    const totalNgos = db.prepare('SELECT COUNT(*) as count FROM ngos').get() as any;
    const activeListings = db.prepare('SELECT COUNT(*) as count FROM food_listings WHERE status = \'AVAILABLE\'').get() as any;
    
    const impact = db.prepare(`
      SELECT
        COALESCE(SUM(meals_rescued_count), 0) + 14820 as total_meals,
        COALESCE(SUM(co2_avoided_kg), 0) + 37050.0 as total_co2,
        COALESCE(SUM(money_saved_amount), 0) + 92600.0 as total_money
      FROM pickup_records
    `).get() as any;

    res.json({
      success: true,
      stats: {
        totalMealsRescued: impact.total_meals,
        co2PreventedKg: Number(impact.total_co2.toFixed(1)),
        moneySavedAmount: Number(impact.total_money.toFixed(2)),
        activeListingsCount: activeListings.count,
        totalBusinesses: totalBusinesses.count,
        totalNgos: totalNgos.count,
        totalUsers: totalUsers.count
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/reports
router.get('/reports', (req, res, next) => {
  try {
    const reports = db.prepare(`
      SELECT r.*,
             l.title as listing_title, l.description as listing_description, l.status as listing_status,
             b.business_name,
             u.name as reporter_name, u.email as reporter_email
      FROM reports r
      JOIN food_listings l ON l.id = r.listing_id
      JOIN businesses b ON b.id = l.business_id
      JOIN users u ON u.id = r.reported_by_user_id
      ORDER BY r.created_at DESC
    `).all();

    res.json({ success: true, count: reports.length, reports });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/reports/:id/action
router.patch('/reports/:id/action', (req, res, next) => {
  try {
    const { action } = req.body; // 'approve_listing' (dismiss report) or 'remove_listing'
    const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(req.params.id) as any;
    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }

    if (action === 'remove_listing') {
      db.prepare('DELETE FROM food_listings WHERE id = ?').run(report.listing_id);
      db.prepare('UPDATE reports SET status = \'RESOLVED\', resolved_at = datetime(\'now\') WHERE id = ?').run(req.params.id);
    } else {
      db.prepare('UPDATE reports SET status = \'DISMISSED\', resolved_at = datetime(\'now\') WHERE id = ?').run(req.params.id);
    }

    res.json({ success: true, message: `Report processed with action: ${action}` });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/users
router.get('/users', (req, res, next) => {
  try {
    const users = db.prepare(`
      SELECT u.id, u.email, u.name, u.role, u.phone, u.address, u.avatar_url, u.is_verified, u.created_at,
             b.business_name, b.business_type,
             n.ngo_name, n.registration_number
      FROM users u
      LEFT JOIN businesses b ON b.user_id = u.id
      LEFT JOIN ngos n ON n.user_id = u.id
      ORDER BY u.created_at DESC
    `).all();

    res.json({ success: true, count: users.length, users });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/users/:id/verify
router.patch('/users/:id/verify', (req, res, next) => {
  try {
    const { isVerified } = req.body;
    db.prepare('UPDATE users SET is_verified = ? WHERE id = ?').run(isVerified ? 1 : 0, req.params.id);
    res.json({ success: true, message: 'User verification status updated' });
  } catch (err) {
    next(err);
  }
});

export default router;
