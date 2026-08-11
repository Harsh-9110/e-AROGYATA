const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../db');

// Get all appointments (optional patientEmail filter)
router.get('/', (req, res) => {
  const { email } = req.query;
  const db = readDB();
  let list = db.appointments;
  if (email) {
    list = list.filter(a => a.patientEmail.toLowerCase() === email.toLowerCase());
  }
  res.json({ count: list.length, appointments: list });
});

// Book an appointment
router.post('/book', (req, res) => {
  const { patientName, patientEmail, patientPhone, doctorId, date, timeSlot, symptoms } = req.body;

  if (!patientName || !doctorId || !date || !timeSlot) {
    return res.status(400).json({ error: 'Patient name, doctor, date, and time slot are required' });
  }

  const db = readDB();
  const doctor = db.doctors.find(d => d.id === parseInt(doctorId));
  if (!doctor) {
    return res.status(404).json({ error: 'Selected doctor not found' });
  }

  // Calculate OPD Queue position for doctor on that date
  const doctorAppts = db.appointments.filter(a => a.doctorId === doctor.id && a.date === date);
  const queueNumber = doctorAppts.length + 1;

  const newAppointment = {
    id: `APT-${1000 + db.appointments.length + 1}`,
    patientName,
    patientEmail: patientEmail || '',
    patientPhone: patientPhone || '',
    doctorId: doctor.id,
    doctorName: doctor.name,
    specialty: doctor.specialty,
    date,
    timeSlot,
    symptoms: symptoms || '',
    status: 'Confirmed',
    queueNumber,
    createdAt: new Date().toISOString()
  };

  db.appointments.push(newAppointment);

  // Update OPD Queue state if exists
  let opdQueue = db.opdQueues.find(q => q.doctorId === doctor.id);
  if (!opdQueue) {
    opdQueue = {
      doctorId: doctor.id,
      doctorName: doctor.name,
      department: doctor.specialty,
      currentlyServing: 1,
      totalInQueue: 1,
      avgConsultMinutes: 12,
      estimatedWaitTimeMinutes: 12
    };
    db.opdQueues.push(opdQueue);
  } else {
    opdQueue.totalInQueue += 1;
    opdQueue.estimatedWaitTimeMinutes = (opdQueue.totalInQueue - opdQueue.currentlyServing) * opdQueue.avgConsultMinutes;
  }

  writeDB(db);

  res.status(201).json({
    message: 'Appointment booked successfully!',
    appointment: newAppointment
  });
});

// Cancel appointment
router.delete('/:id', (req, res) => {
  const db = readDB();
  const index = db.appointments.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  db.appointments[index].status = 'Cancelled';
  writeDB(db);

  res.json({ message: 'Appointment cancelled successfully' });
});

module.exports = router;
