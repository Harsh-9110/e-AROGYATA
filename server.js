const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// Image Fallback Middleware (Serves images from assets/images if requested directly)
const fs = require('fs');
app.use((req, res, next) => {
  if (req.path.match(/\.(png|jpg|jpeg|webp|gif|svg)$/i)) {
    const filename = path.basename(req.path);
    const imagePath = path.join(__dirname, 'assets', 'images', filename);
    if (fs.existsSync(imagePath)) {
      return res.sendFile(imagePath);
    }
  }
  next();
});

// Initialize Persistent Database
initDB();

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/opd', require('./routes/opd'));
app.use('/api/beds', require('./routes/beds'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/pharmacy', require('./routes/pharmacy'));
app.use('/api/diagnostics', require('./routes/diagnostics'));

// Healthcheck Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    platform: 'e-AROGYATA Smart Hospital Platform',
    timestamp: new Date().toISOString()
  });
});

// Fallback to index.html for non-API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🏥 e-AROGYATA Smart Hospital Backend Live`);
  console.log(`🌐 Server running at: http://localhost:${PORT}`);
  console.log(`📊 Health Endpoint: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
