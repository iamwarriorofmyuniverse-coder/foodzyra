import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db/database';

export const JWT_SECRET = process.env.JWT_SECRET || 'foodloop_secure_super_jwt_secret_key_2026';

export interface AuthUser {
  id: string;
  email: string;
  role: 'customer' | 'business' | 'ngo' | 'admin';
  name: string;
  businessId?: string;
  ngoId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      businessId: user.businessId,
      ngoId: user.ngoId
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Missing or malformed Authorization header with Bearer token'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    
    // Verify user still exists in database
    const user = db.prepare('SELECT id, email, role, name FROM users WHERE id = ?').get(decoded.id) as any;
    if (!user) {
      return res.status(401).json({ success: false, error: 'User account no longer exists' });
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

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      businessId,
      ngoId
    };

    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid or expired token' });
  }
}

export function authorize(...allowedRoles: ('customer' | 'business' | 'ngo' | 'admin')[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: `Forbidden: Role '${req.user.role}' is not authorized to perform this action. Required: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
}
