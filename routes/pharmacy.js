const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../db');

// Get Medicine Catalog
router.get('/medicines', (req, res) => {
  const db = readDB();
  res.json({ count: db.medicines.length, medicines: db.medicines });
});

// Checkout Pharmacy Order
router.post('/checkout', (req, res) => {
  const { patientName, items, totalAmount, shippingAddress } = req.body;

  if (!patientName || !items || !items.length) {
    return res.status(400).json({ error: 'Cart items and patient name required' });
  }

  const db = readDB();
  const newOrder = {
    id: `ORD-${Date.now().toString().slice(-6)}`,
    patientName,
    items,
    totalAmount: totalAmount || 0,
    shippingAddress: shippingAddress || 'Standard Delivery',
    status: 'Processing',
    date: new Date().toISOString()
  };

  db.orders.push(newOrder);
  writeDB(db);

  res.status(201).json({
    message: 'Medicine order placed successfully!',
    order: newOrder
  });
});

module.exports = router;
