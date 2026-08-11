const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data.json');

// Default Seed Data
const initialData = {
  users: [
    {
      id: 1,
      name: "Harsh Kumar",
      email: "harsh@example.com",
      password: "password123", // In production use bcrypt
      role: "PATIENT",
      phone: "+91 9876543210"
    },
    {
      id: 2,
      name: "Dr. Ananya Sharma",
      email: "ananya@earogyata.com",
      password: "doctorpassword",
      role: "DOCTOR",
      phone: "+91 9123456789"
    },
    {
      id: 3,
      name: "System Admin",
      email: "admin@earogyata.com",
      password: "adminpassword",
      role: "ADMIN",
      phone: "+91 9000000000"
    }
  ],
  doctors: [
    {
      id: 101,
      name: "Dr. Ananya Sharma",
      specialty: "Cardiology",
      experience: "12 years",
      rating: 4.9,
      opdRoom: "Room 102 (Block A)",
      status: "Available",
      consultationFee: 500,
      availableSlots: ["09:00 AM", "10:30 AM", "02:00 PM", "04:30 PM"]
    },
    {
      id: 102,
      name: "Dr. Rajesh Verma",
      specialty: "Neurology",
      experience: "15 years",
      rating: 4.8,
      opdRoom: "Room 205 (Block B)",
      status: "In Consultation",
      consultationFee: 700,
      availableSlots: ["10:00 AM", "11:30 AM", "03:00 PM"]
    },
    {
      id: 103,
      name: "Dr. Sneha Patel",
      specialty: "Dermatology",
      experience: "8 years",
      rating: 4.7,
      opdRoom: "Room 108 (Block A)",
      status: "Available",
      consultationFee: 400,
      availableSlots: ["11:00 AM", "01:00 PM", "05:00 PM"]
    },
    {
      id: 104,
      name: "Dr. Vikram Malhotra",
      specialty: "Nephrology",
      experience: "14 years",
      rating: 4.9,
      opdRoom: "Room 301 (Block C)",
      status: "Available",
      consultationFee: 650,
      availableSlots: ["09:30 AM", "12:00 PM", "03:30 PM"]
    },
    {
      id: 105,
      name: "Dr. Meera Iyer",
      specialty: "Gastroenterology",
      experience: "10 years",
      rating: 4.8,
      opdRoom: "Room 202 (Block B)",
      status: "Available",
      consultationFee: 550,
      availableSlots: ["10:00 AM", "02:30 PM", "04:00 PM"]
    },
    {
      id: 106,
      name: "Dr. Arjan Singh",
      specialty: "Neurosurgery",
      experience: "18 years",
      rating: 5.0,
      opdRoom: "Room 404 (Block D)",
      status: "On Call",
      consultationFee: 1000,
      availableSlots: ["01:00 PM", "04:00 PM"]
    }
  ],
  appointments: [
    {
      id: "APT-1001",
      patientName: "Harsh Kumar",
      patientEmail: "harsh@example.com",
      patientPhone: "+91 9876543210",
      doctorId: 101,
      doctorName: "Dr. Ananya Sharma",
      specialty: "Cardiology",
      date: "2026-08-15",
      timeSlot: "10:30 AM",
      symptoms: "Routine heart checkup",
      status: "Confirmed",
      queueNumber: 3
    }
  ],
  opdQueues: [
    {
      doctorId: 101,
      doctorName: "Dr. Ananya Sharma",
      department: "Cardiology",
      currentlyServing: 2,
      totalInQueue: 7,
      avgConsultMinutes: 12,
      estimatedWaitTimeMinutes: 35
    },
    {
      doctorId: 102,
      doctorName: "Dr. Rajesh Verma",
      department: "Neurology",
      currentlyServing: 4,
      totalInQueue: 11,
      avgConsultMinutes: 15,
      estimatedWaitTimeMinutes: 45
    }
  ],
  beds: [
    { id: "BED-ICU-01", ward: "ICU Ward", bedNumber: "01", status: "Occupied", patientName: "Rohan Gupta" },
    { id: "BED-ICU-02", ward: "ICU Ward", bedNumber: "02", status: "Available", patientName: null },
    { id: "BED-ICU-03", ward: "ICU Ward", bedNumber: "03", status: "Available", patientName: null },
    { id: "BED-GEN-01", ward: "General Ward", bedNumber: "101", status: "Available", patientName: null },
    { id: "BED-GEN-02", ward: "General Ward", bedNumber: "102", status: "Occupied", patientName: "Sita Ram" },
    { id: "BED-GEN-03", ward: "General Ward", bedNumber: "103", status: "Available", patientName: null },
    { id: "BED-GEN-04", ward: "General Ward", bedNumber: "104", status: "Available", patientName: null },
    { id: "BED-EMG-01", ward: "Emergency Ward", bedNumber: "E01", status: "Available", patientName: null },
    { id: "BED-EMG-02", ward: "Emergency Ward", bedNumber: "E02", status: "Available", patientName: null }
  ],
  patients: [
    {
      id: "PAT-201",
      name: "Rohan Gupta",
      age: 45,
      gender: "Male",
      contact: "+91 9871122334",
      diagnosis: "Acute Coronary Syndrome",
      assignedDoctor: "Dr. Ananya Sharma",
      bedNumber: "BED-ICU-01",
      status: "Admitted"
    },
    {
      id: "PAT-202",
      name: "Sita Ram",
      age: 62,
      gender: "Female",
      contact: "+91 9811223344",
      diagnosis: "Hypertension & Diabetes",
      assignedDoctor: "Dr. Rajesh Verma",
      bedNumber: "BED-GEN-02",
      status: "Admitted"
    }
  ],
  medicines: [
    { id: 1, name: "Paracetamol 650mg", category: "General", price: 30, stock: 150, description: "Fever and pain relief" },
    { id: 2, name: "Amoxicillin 500mg", category: "Antibiotics", price: 120, stock: 80, description: "Bacterial infection treatment" },
    { id: 3, name: "Atorvastatin 10mg", category: "Cardiology", price: 180, stock: 60, description: "Cholesterol management" },
    { id: 4, name: "Pantoprazole 40mg", category: "Gastroenterology", price: 90, stock: 110, description: "Acidity and reflux prevention" },
    { id: 5, name: "Cetirizine 10mg", category: "Allergy", price: 45, stock: 200, description: "Anti-allergic relief" }
  ],
  orders: [],
  tests: [
    { id: 1, name: "Complete Blood Count (CBC)", category: "Hematology", price: 350, turnaround: "6 hours" },
    { id: 2, name: "Lipid Profile Test", category: "Cardiology", price: 750, turnaround: "12 hours" },
    { id: 3, name: "Liver Function Test (LFT)", category: "Biochemistry", price: 650, turnaround: "12 hours" },
    { id: 4, name: "MRI Brain Scan", category: "Radiology", price: 4500, turnaround: "24 hours" },
    { id: 5, name: "ECG (Electrocardiogram)", category: "Cardiology", price: 300, turnaround: "1 hour" }
  ],
  testBookings: []
};

// Initialize DB File if not existing
function initDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
  }
}

function readDB() {
  initDB();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading database file:", err);
    return initialData;
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error("Error writing database file:", err);
  }
}

module.exports = {
  readDB,
  writeDB,
  initDB
};
