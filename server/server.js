require('dotenv').config();
const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const morgan     = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = async () => {
  const conn = require('./config/db');
  await conn();
  try {
    const { startFeeScheduler } = require('./utils/feeScheduler');
    if (process.env.ENABLE_FEE_SCHEDULER !== 'false') {
      startFeeScheduler();
    }
  } catch (err) {
    console.error('Failed to start fee scheduler:', err);
  }
};

const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shops');
const parcelRoutes = require('./routes/parcels');
const notificationRoutes = require('./routes/notifications');
const analyticsRoutes = require('./routes/analytics');

const app = express();
app.set('trust proxy', 1); // Trust reverse proxy (e.g. Render) to get real client IPs

// Connect to Database
if (process.env.NODE_ENV !== 'test') {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  connectDB();
}

// Always allow localhost (dev) and any *.vercel.app origin (prod preview/main).
// CLIENT_ORIGIN env var can also contain additional comma-separated origins.
const configuredOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true; // allow non-browser requests (Postman, curl, etc.)
  if (origin === 'http://localhost:5173') return true;
  if (origin === 'http://localhost:5174') return true;
  if (origin.endsWith('.vercel.app')) return true;  // all Vercel preview + prod URLs
  if (configuredOrigins.includes(origin)) return true;
  return false;
};

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
app.use(mongoSanitize());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: process.env.NODE_ENV === 'development' ? 1000 : 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts. Please try again later.' },
});

// Basic sanity check route
app.get('/', (req, res) => {
  res.send('GramPickup API is running...');
});

// Register routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/parcels', parcelRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check — used by monitoring tools and to wake Render cold starts
app.get('/health', (req, res) => {
  res.json({
    status:    'ok',
    uptime:    `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    db:        mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    env:       process.env.NODE_ENV || 'development',
  });
});

// Page Not Found Handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Route not found - ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
});

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
