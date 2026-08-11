const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../db');

// Get real-time bed statistics and list
router.get('/', (req, res) => {
  const db = readDB();
  const totalBeds = db.beds.length;
  const availableBeds = db.beds.filter(b => b.status === 'Available').length;
  const occupiedBeds = db.beds.filter(b => b.status === 'Occupied').length;
  const reservedBeds = db.beds.filter(b => b.status === 'Reserved').length;

  res.json({
    summary: {
      total: totalBeds,
      available: availableBeds,
      occupied: occupiedBeds,
      reserved: reservedBeds
    },
    beds: db.beds
  });
});

// Book / Reserve a Bed
router.post('/book', (req, res) => {
  const { ward, patientName, patientContact, bedId } = req.body;

  if (!patientName) {
    return res.status(400).json({ error: 'Patient name is required' });
  }

  const db = readDB();
  let targetBed = null;

  if (bedId) {
    targetBed = db.beds.find(b => b.id === bedId && b.status === 'Available');
  } else if (ward) {
    targetBed = db.beds.find(b => b.ward.toLowerCase() === ward.toLowerCase() && b.status === 'Available');
  } else {
    targetBed = db.beds.find(b => b.status === 'Available');
  }

  if (!targetBed) {
    return res.status(400).json({ error: 'No available beds matching criteria' });
  }

  targetBed.status = 'Reserved';
  targetBed.patientName = patientName;
  targetBed.updatedAt = new Date().toISOString();

  // Add patient record if not exists
  const newPatient = {
    id: `PAT-${Date.now().toString().slice(-4)}`,
    name: patientName,
    contact: patientContact || '',
    bedNumber: targetBed.id,
    ward: targetBed.ward,
    status: 'Bed Reserved'
  };
  db.patients.push(newPatient);

  writeDB(db);

  const remainingAvailable = db.beds.filter(b => b.status === 'Available').length;

  res.status(200).json({
    message: 'Bed reserved successfully!',
    bed: targetBed,
    availableBedsCount: remainingAvailable
  });
});

// Discharge / Release Bed
router.post('/release', (req, res) => {
  const { bedId } = req.body;
  if (!bedId) return res.status(400).json({ error: 'bedId is required' });

  const db = readDB();
  const bed = db.beds.find(b => b.id === bedId);
  if (!bed) return res.status(404).json({ error: 'Bed not found' });

  bed.status = 'Available';
  bed.patientName = null;
  bed.updatedAt = new Date().toISOString();

  writeDB(db);

  res.json({ message: 'Bed released successfully', bed });
});

module.exports = router;
