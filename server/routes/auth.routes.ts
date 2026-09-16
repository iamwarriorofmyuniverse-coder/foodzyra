import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { db } from '../db/database';
import { authenticate, generateToken } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(['customer', 'business', 'ngo', 'admin']),
  phone: z.string().optional(),
  address: z.string().optional(),
  // Business fields
  businessName: z.string().optional(),
  businessType: z.enum(['restaurant', 'bakery', 'supermarket', 'hostel', 'household', 'cafe', 'other']).optional(),
  businessDescription: z.string().optional(),
  // NGO fields
  ngoRegistrationNumber: z.string().optional(),
  ngoMission: z.string().optional()
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// POST /api/auth/register
router.post('/register', validate({ body: RegisterSchema }), async (req, res, next) => {
  try {
    const { email, password, name, role, phone, address, businessName, businessType, businessDescription, ngoRegistrationNumber, ngoMission } = req.body;

    // Check if user already exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(400).json({ success: false, error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = `user-${uuidv4().slice(0, 8)}`;
    const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`;

    // Insert user within transaction
    const insertUser = db.transaction(() => {
      db.prepare(`
        INSERT INTO users (id, email, password_hash, name, role, phone, address, avatar_url, is_verified)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(userId, email, passwordHash, name, role, phone || null, address || 'San Francisco, CA', avatarUrl, role === 'customer' ? 1 : 0);

      let businessId: string | undefined;
      let ngoId: string | undefined;

      if (role === 'business') {
        businessId = `biz-${uuidv4().slice(0, 8)}`;
        db.prepare(`
          INSERT INTO businesses (id, user_id, business_name, business_type, description, address)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(businessId, userId, businessName || name, businessType || 'other', businessDescription || null, address || 'San Francisco, CA');
      } else if (role === 'ngo') {
        ngoId = `ngo-${uuidv4().slice(0, 8)}`;
        db.prepare(`
          INSERT INTO ngos (id, user_id, ngo_name, registration_number, mission_statement, contact_phone, address)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(ngoId, userId, name, ngoRegistrationNumber || 'NGO-PENDING', ngoMission || null, phone || null, address || 'San Francisco, CA');
      }

      return { businessId, ngoId };
    });

    const { businessId, ngoId } = insertUser();

    const authUser = {
      id: userId,
      email,
      role,
      name,
      businessId,
      ngoId
    };

    const token = generateToken(authUser);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        id: userId,
        email,
        name,
        role,
        avatarUrl,
        businessId,
        ngoId
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', validate({ body: LoginSchema }), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    let businessId: string | undefined;
    let ngoId: string | undefined;

    if (user.role === 'business') {
      const biz = db.prepare('SELECT id FROM businesses WHERE user_id = ?').get(user.id) as any;
      businessId = biz?.id;
    } else if (user.role === 'ngo') {
      const ngo = db.prepare('SELECT id FROM ngos WHERE user_id = ?').get(user.id) as any;
      ngoId = ngo?.id;
    }

    const authUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      businessId,
      ngoId
    };

    const token = generateToken(authUser);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatar_url,
        phone: user.phone,
        address: user.address,
        businessId,
        ngoId
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get('/me', authenticate, (req, res) => {
  const user = db.prepare('SELECT id, email, name, role, phone, address, avatar_url, is_verified, created_at FROM users WHERE id = ?').get(req.user!.id) as any;
  
  let business = null;
  let ngo = null;

  if (user.role === 'business') {
    business = db.prepare('SELECT * FROM businesses WHERE user_id = ?').get(user.id);
  } else if (user.role === 'ngo') {
    ngo = db.prepare('SELECT * FROM ngos WHERE user_id = ?').get(user.id);
  }

  // Calculate user impact
  const pickupImpact = db.prepare(`
    SELECT
      COALESCE(SUM(meals_rescued_count), 0) as meals_saved,
      COALESCE(SUM(co2_avoided_kg), 0) as co2_saved_kg,
      COALESCE(SUM(money_saved_amount), 0) as money_saved
    FROM pickup_records
    WHERE recipient_user_id = ? OR verified_by_user_id = ?
  `).get(user.id, user.id) as any;

  res.json({
    success: true,
    user: {
      ...user,
      business,
      ngo,
      impact: {
        mealsSaved: pickupImpact.meals_saved,
        co2SavedKg: Number(pickupImpact.co2_saved_kg.toFixed(1)),
        moneySaved: Number(pickupImpact.money_saved.toFixed(2))
      }
    }
  });
});

// GET /api/auth/demo-users
router.get('/demo-users', (req, res) => {
  const users = db.prepare(`
    SELECT u.id, u.email, u.name, u.role, u.avatar_url, u.address,
           b.id as business_id, b.business_name, b.business_type,
           n.id as ngo_id, n.ngo_name
    FROM users u
    LEFT JOIN businesses b ON b.user_id = u.id
    LEFT JOIN ngos n ON n.user_id = u.id
  `).all();

  res.json({ success: true, users });
});

// POST /api/auth/switch-demo
router.post('/switch-demo', (req, res) => {
  const { userId } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
  if (!user) {
    return res.status(404).json({ success: false, error: 'Demo user not found' });
  }

  let businessId: string | undefined;
  let ngoId: string | undefined;

  if (user.role === 'business') {
    const biz = db.prepare('SELECT id FROM businesses WHERE user_id = ?').get(user.id) as any;
    businessId = biz?.id;
  } else if (user.role === 'ngo') {
    const ngo = db.prepare('SELECT id FROM ngos WHERE user_id = ?').get(user.id) as any;
    ngoId = ngo?.id;
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    businessId,
    ngoId
  });

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatar_url,
      businessId,
      ngoId
    }
  });
});

export default router;
