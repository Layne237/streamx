import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

import { apiLimiter } from './src/middleware/rateLimiter.js';

import authRoutes from './src/routes/auth.js';
import contentRoutes from './src/routes/content.js';
import userRoutes from './src/routes/users.js';
import watchRoutes from './src/routes/watch.js';
import paymentRoutes from './src/routes/payment.js';
import adminRoutes from './src/routes/admin.js';

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use((req, res, next) => {
  if (req.path === '/api/payments/webhook') {
    express.raw({ type: 'application/json' })(req, res, next);
  } else {
    express.json({ limit: '1mb' })(req, res, next);
  }
});

app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use('/api', apiLimiter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/watch', watchRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`StreamX API running on port ${PORT}`);
  console.log(`Frontend origin: ${FRONTEND_URL}`);
});

export default app;
