const express = require('express');
const router = express.Router();
const {
  createSlot,
  updateSlot,
  deleteSlot,
  getSlotsByActivity,
} = require('../controllers/slotController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Admin only routes
router.post('/', verifyToken, verifyAdmin, createSlot);
router.put('/:id', verifyToken, verifyAdmin, updateSlot);
router.delete('/:id', verifyToken, verifyAdmin, deleteSlot);

// Admin: view all slots for an activity
router.get('/activity/:activityId', verifyToken, verifyAdmin, getSlotsByActivity);

module.exports = router;