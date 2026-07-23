const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// ─── Task 3: Validate required environment variables on startup ───────────────
const REQUIRED_ENV = ['DB_NAME', 'DB_USER', 'DB_HOST', 'JWT_SECRET', 'JWT_EXPIRES_IN'];
const missing = REQUIRED_ENV.filter((key) => process.env[key] === undefined);
if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    console.error('   Copy .env.example to .env and fill in the values.');
    process.exit(1);
}

const sequelize = require('./config/database');

// Import models to register associations before sync
require('./models/User');
require('./models/Apartment');
require('./models/Wishlist');
require('./models/Payment');
require('./models/Settings');

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const apartmentRoutes = require('./routes/apartmentRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

// ─── Task 2: Locked-down CORS ─────────────────────────────────────────────────
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim());

app.use(cors({
    origin: (origin, callback) => {
        // Allow server-to-server requests (no origin) and listed origins
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: origin '${origin}' not allowed`));
        }
    },
    credentials: true,
}));

// ─── Task 5: Rate limiting on auth endpoints ──────────────────────────────────
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 20,                    // max 20 attempts per window per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many login attempts. Please try again in 15 minutes.' },
});

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(isProduction ? morgan('combined') : morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes — apply rate limiter to login & register only
app.use('/api/v1/users', authLimiter, userRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/apartments', apartmentRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1/payments', paymentRoutes);

app.get('/', (_req, res) => {
    res.json({ message: 'Kenya Homes API is running!' });
});

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'kenyahouse-backend' });
});

// Global error handler
app.use((err, req, res, _next) => {
    // Don't leak stack traces in production
    console.error('Unhandled error:', err);
    res.status(500).json({ message: isProduction ? 'Internal server error' : err.message });
});

// ─── Task 4: Safe DB sync — alter only in development ────────────────────────
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ MySQL Database connected successfully');

        if (isProduction) {
            // In production, never auto-alter schema — use migrations instead
            await sequelize.sync();
            console.log('✅ Models verified (production mode — no alter)');
        } else {
            await sequelize.sync({ alter: true });
            console.log('✅ Models synchronized (development mode — alter enabled)');
        }

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);
            console.log(`   Allowed origins: ${allowedOrigins.join(', ')}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
