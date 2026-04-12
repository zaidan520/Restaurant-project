const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const requireAuth = require('../middleware/requireAuth');

// GET all orders (admin) - with optional date filter
router.get('/', requireAuth, async (req, res) => {
  try {
    const { date } = req.query;
    let query = {};
    
    if (date) {
      // Filter by specific date (YYYY-MM-DD)
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: startDate, $lte: endDate };
    }
    
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// POST new order (public)
router.post('/', async (req, res) => {
  const { customerName, phone, address, items, totalAmount, notes } = req.body;

  if (!customerName || !phone || !address || !items || items.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const order = new Order({
      customerName,
      phone,
      address,
      items,
      totalAmount,
      notes: notes || ''
    });

    const saved = await order.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error saving order:', err);
    res.status(500).json({ error: 'Failed to save order' });
  }
});

// UPDATE status (admin only)
router.patch('/:id/status', requireAuth, async (req, res) => {
  const { status } = req.body;

  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update' });
  }
});

module.exports = router;