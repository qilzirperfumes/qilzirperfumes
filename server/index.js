import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes  from './routes/products.js';
import settingsRoutes from './routes/settings.js';
import orderRoutes    from './routes/orders.js';
import customerRoutes from './routes/customers.js';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || '';

if (!MONGO_URI) {
  console.error('❌  MONGO_URI is not set in .env — please add your MongoDB Atlas connection string');
  process.exit(1);
}

// ── Middleware ─────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});
app.use(cors({
  origin: [
    'http://localhost:5173',      // Vite dev
    'http://localhost:4173',      // Vite preview
    process.env.FRONTEND_URL,     // Production frontend URL
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json());

// ── Routes ─────────────────────────────────────────────
app.use('/api/products', productRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/customers',customerRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date() }));

// ── Connect & Start ────────────────────────────────────
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✓ Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`✓ Qilzir API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌  MongoDB connection failed:', err.message);
    process.exit(1);
  });
