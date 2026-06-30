const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const authRoutes = require('./routes/auth');
const activityRoutes = require('./routes/activity');
const slotRoutes = require('./routes/slot');
const bookingRoutes = require('./routes/booking');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Activity Booking API is running' });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });
