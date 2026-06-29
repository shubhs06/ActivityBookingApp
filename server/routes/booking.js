const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  cancelMyBooking,
  getAllBookings,
  confirmBooking,
  adminCancelBooking,
} = require('../controllers/bookingController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// User routes
router.post('/', verifyToken, createBooking);
router.get('/my', verifyToken, getMyBookings);
router.patch('/cancel/:id', verifyToken, cancelMyBooking);

// Admin routes
router.get('/all', verifyToken, verifyAdmin, getAllBookings);
router.patch('/confirm/:id', verifyToken, verifyAdmin, confirmBooking);
router.patch('/admin-cancel/:id', verifyToken, verifyAdmin, adminCancelBooking);

module.exports = router;