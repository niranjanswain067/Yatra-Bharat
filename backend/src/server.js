require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Yatra Bharat API is running' });
});

// Routes
const authRoutes = require('./routes/auth.routes');
const adminDestinationsRoutes = require('./routes/admin.destinations');
const adminPlansRoutes = require('./routes/admin.plans');
const adminEnquiriesRoutes = require('./routes/admin.enquiries');
const publicDestinationsRoutes = require('./routes/public.destinations');
const publicPlansRoutes = require('./routes/public.plans');
const publicEnquiriesRoutes = require('./routes/public.enquiries');

// Public Routes
app.use('/api/destinations', publicDestinationsRoutes);
app.use('/api/plans', publicPlansRoutes);
app.use('/api/enquiries', publicEnquiriesRoutes);

// Admin Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/destinations', adminDestinationsRoutes);
app.use('/api/admin/plans', adminPlansRoutes);
app.use('/api/admin/enquiries', adminEnquiriesRoutes);

// Error handling middleware (basic)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
