const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../db');

// Get available diagnostic tests
router.get('/tests', (req, res) => {
  const db = readDB();
  res.json({ count: db.tests.length, tests: db.tests });
});

// Book a diagnostic test
router.post('/book', (req, res) => {
  const { patientName, testId, testName, preferredDate } = req.body;

  if (!patientName || !testName) {
    return res.status(400).json({ error: 'Patient name and test name are required' });
  }

  const db = readDB();
  const booking = {
    id: `TST-${Date.now().toString().slice(-5)}`,
    patientName,
    testId: testId || null,
    testName,
    date: preferredDate || new Date().toISOString().split('T')[0],
    status: 'Scheduled'
  };

  db.testBookings.push(booking);
  writeDB(db);

  res.status(201).json({
    message: 'Diagnostic test booked successfully!',
    booking
  });
});

module.exports = router;
