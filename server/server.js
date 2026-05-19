const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
require('dotenv').config();

const studentRoutes = require('./routes/students');
const staffRoutes = require('./routes/staff');
const authRoutes = require('./routes/auth');
const wallRoutes = require('./routes/wall');

const app = express();
const PORT = process.env.PORT || 5000;

// ═══════════════════════════════════════════
//  PERFORMANCE MIDDLEWARE
// ═══════════════════════════════════════════

// Gzip compression — reduces response size by ~70%
app.use(compression({
  level: 6,               // Balance between speed and compression ratio
  threshold: 1024,         // Only compress responses > 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false, // Disable CSP for API server
}));

// CORS — optimized with preflight caching
app.use(cors({
  origin: true,            // Allow all origins (or specify your Vercel URL)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,           // Cache preflight for 24h — eliminates OPTIONS requests
}));

// JSON parser with size limit
app.use(express.json({ limit: '1mb' }));

// ═══════════════════════════════════════════
//  ROUTES
// ═══════════════════════════════════════════
app.use('/api/students', studentRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/wall', wallRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Batch 2023–2026 API is running 🎓' });
});

// ═══════════════════════════════════════════
//  MONGODB CONNECTION (Optimized)
// ═══════════════════════════════════════════
mongoose.connect(process.env.MONGODB_URI, {
  // Connection pool — reuse connections for faster queries
  maxPoolSize: 10,
  minPoolSize: 2,
  // Timeout settings
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });
