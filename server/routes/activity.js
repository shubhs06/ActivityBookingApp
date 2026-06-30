const express = require('express');
const router = express.Router();
const {
  createActivity,
  updateActivity,
  deleteActivity,
  getAllActivities,
  getActivityById,
} = require('../controllers/activityController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllActivities);
router.get('/:id', getActivityById);

// Admin only routes
router.post('/', verifyToken, verifyAdmin, createActivity);
router.put('/:id', verifyToken, verifyAdmin, updateActivity);
router.delete('/:id', verifyToken, verifyAdmin, deleteActivity);

module.exports = router;
