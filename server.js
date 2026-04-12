const express = require('express');
require('dotenv').config(); // ← load .env variables
const session = require('express-session');
const cors    = require('cors');
const path    = require('path');
const connectDB = require('./db');
// const { Pool } = require('pg');
//const pool = require('./db');

const app  = express();
const port = process.env.PORT || 3000;

// Database connection
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });
connectDB();
// ─── Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Session setup
app.use(session({
  name:   'haqania.sid',
  secret: process.env.SESSION_SECRET || 'haqania-super-secret-key-2025',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure:   false,     // set true if using HTTPS in production
    httpOnly: true,
    sameSite: 'lax',
    maxAge:   8 * 60 * 60 * 1000, // 8 hours
  },
}));
// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));



// ─── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',   require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));

// ─── Fallback — serve index.html for unknown paths ────────────────────────────
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// ─── Start server ─────────────────────────────────────────────────────────────
app.listen(port, '0.0.0.0', () => {
  console.log(`Haqania Foods server running on port ${port}`);
  console.log(`Admin login: username=admin  password=${process.env.ADMIN_PASSWORD || 'haqania2025'}`);
});

