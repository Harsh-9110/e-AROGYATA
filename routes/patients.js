const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../db');

// List admitted / registered patients
router.get('/', (req, res) => {
  const db = readDB();
  res.json({ count: db.patients.length, patients: db.patients });
});

// Admit Patient
router.post('/admit', (req, res) => {
  const { name, age, gender, contact, diagnosis, assignedDoctor, ward } = req.body;

  if (!name || !contact) {
    return res.status(400).json({ error: 'Patient name and contact are required' });
  }

  const db = readDB();
  
  // Find available bed if ward provided
  let bedAssigned = null;
  if (ward) {
    const availableBed = db.beds.find(b => b.ward.toLowerCase().includes(ward.toLowerCase()) && b.status === 'Available');
    if (availableBed) {
      availableBed.status = 'Occupied';
      availableBed.patientName = name;
      bedAssigned = availableBed.id;
    }
  }

  const newPatient = {
    id: `PAT-${100 + db.patients.length + 1}`,
    name,
    age: age || null,
    gender: gender || 'Unspecified',
    contact,
    diagnosis: diagnosis || 'Under Observation',
    assignedDoctor: assignedDoctor || 'General Physician',
    bedNumber: bedAssigned || 'N/A',
    status: 'Admitted',
    admittedAt: new Date().toISOString()
  };

  db.patients.push(newPatient);
  writeDB(db);

  res.status(201).json({
    message: 'Patient admitted successfully',
    patient: newPatient
  });
});

module.exports = router;
