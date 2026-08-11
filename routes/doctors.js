const express = require('express');
const router = express.Router();
const { readDB } = require('../db');

// Get all doctors, with optional specialty filter
router.get('/', (req, res) => {
  const { specialty } = req.query;
  const db = readDB();
  let doctors = db.doctors;

  if (specialty) {
    doctors = doctors.filter(d => d.specialty.toLowerCase() === specialty.toLowerCase());
  }

  res.json({ count: doctors.length, doctors });
});

// Get doctor by ID
router.get('/:id', (req, res) => {
  const db = readDB();
  const doctor = db.doctors.find(d => d.id === parseInt(req.params.id));
  if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
  res.json({ doctor });
});

module.exports = router;
