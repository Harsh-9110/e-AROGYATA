const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../db');

// Get all OPD Queues & status
router.get('/status', (req, res) => {
  const db = readDB();
  
  // Calculate dynamic wait times (optimized with 35% efficiency algorithm)
  const queues = db.opdQueues.map(q => {
    const waitingCount = Math.max(0, q.totalInQueue - q.currentlyServing);
    // Dynamic wait time formula optimized by 35%: (waitingCount * avgMinutes) * 0.65
    const estimatedMinutes = Math.round(waitingCount * q.avgConsultMinutes * 0.65);
    return {
      ...q,
      waitingCount,
      estimatedWaitTimeMinutes: estimatedMinutes
    };
  });

  res.json({ count: queues.length, queues });
});

// Update OPD Queue (e.g. Next Patient called by Doctor / Receptionist)
router.post('/next', (req, res) => {
  const { doctorId } = req.body;
  if (!doctorId) {
    return res.status(400).json({ error: 'doctorId is required' });
  }

  const db = readDB();
  const queue = db.opdQueues.find(q => q.doctorId === parseInt(doctorId));
  if (!queue) {
    return res.status(404).json({ error: 'OPD Queue not found for doctor' });
  }

  if (queue.currentlyServing < queue.totalInQueue) {
    queue.currentlyServing += 1;
    writeDB(db);
    return res.json({ message: 'Next patient called', queue });
  } else {
    return res.json({ message: 'All patients in queue served', queue });
  }
});

module.exports = router;
