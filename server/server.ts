import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import listingsRoutes from './routes/listings.routes';
import reservationsRoutes from './routes/reservations.routes';
import donationsRoutes from './routes/donations.routes';
import pickupsRoutes from './routes/pickups.routes';
import adminRoutes from './routes/admin.routes';
import aiRoutes from './routes/ai.routes';
import { seedDatabase } from './db/seed';
import { errorHandler } from './middleware/errorHandler';

import { securityHeaders, authRateLimiter, aiRateLimiter, generalApiLimiter } from './middleware/security';

export const app = express();
const PORT = process.env.PORT || 5000;

// Apply Security Hardening Headers
app.use(securityHeaders);

// CORS configuration - support CORS_ORIGINS from env, with localhost defaults
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, curl, server-to-server tests)
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true
}));

// Body parsing with strict payload limit to prevent denial-of-service
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Global API rate limiting
app.use('/api', generalApiLimiter);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'FoodLoop Backend API',
    database: 'Relational (SQLite / PostgreSQL schema enabled)',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes with specialized rate limiting
app.use('/api/auth', authRateLimiter, authRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/donations', donationsRoutes);
app.use('/api/pickups', pickupsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRateLimiter, aiRoutes);

// Global Error Handler
app.use(errorHandler);

export function startServer(port: number = Number(PORT)): Promise<import('http').Server> {
  return new Promise(async (resolve, reject) => {
    try {
      await seedDatabase();
      const server = app.listen(port, '127.0.0.1', () => {
        console.log(`🚀 FoodLoop Backend API running on http://127.0.0.1:${port}`);
        resolve(server);
      });
    } catch (err) {
      reject(err);
    }
  });
}

// Auto-start if executed directly via CLI
if (process.argv[1] && process.argv[1].includes('server.ts')) {
  startServer();
}

export default app;
