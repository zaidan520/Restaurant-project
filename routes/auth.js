// ─── Auth routes: login, logout, session check ───────────────────────────────
const express = require('express');
const router  = express.Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'haqania2025';

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.isAdmin   = true;
    req.session.username  = username;
    return res.json({ success: true, message: 'Logged in successfully.' });
  }

  return res.status(401).json({ error: 'Invalid username or password.' });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed.' });
    res.clearCookie('haqania.sid');
    res.json({ success: true, message: 'Logged out.' });
  });
});

// GET /api/auth/check — check if current session is authenticated
router.get('/check', (req, res) => {
  if (req.session && req.session.isAdmin) {
    return res.json({ authenticated: true, username: req.session.username });
  }
  res.json({ authenticated: false });
});

module.exports = router;
