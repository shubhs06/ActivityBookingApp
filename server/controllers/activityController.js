const Activity = require('../models/Activity');
const Slot = require('../models/Slot');

// ─── ADMIN: Create Activity ───────────────────────────────────────────────────
const createActivity = async (req, res) => {
  try {
    const { name, description, location, imageUrl } = req.body;

    if (!name || !description || !location) {
      return res.status(400).json({ message: 'Name, description, and location are required' });
    }

    const activity = await Activity.create({
      name,
      description,
      location,
      imageUrl: imageUrl || '',
      createdBy: req.user.userId,
    });

    res.status(201).json({ message: 'Activity created successfully', activity });
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ─── ADMIN: Update Activity ───────────────────────────────────────────────────
const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const activity = await Activity.findByIdAndUpdate(id, updates, { new: true });
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.status(200).json({ message: 'Activity updated', activity });
  } catch (error) {
    console.error('Error updating activity:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ─── ADMIN: Delete Activity ───────────────────────────────────────────────────
const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const activity = await Activity.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Also deactivate all slots for this activity
    await Slot.updateMany({ activity: id }, { isActive: false });

    res.status(200).json({ message: 'Activity deactivated successfully' });
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ─── PUBLIC: Get All Active Activities ───────────────────────────────────────
const getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ isActive: true }).populate('createdBy', 'username email');
    res.status(200).json({ activities });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ─── PUBLIC: Get Single Activity with its Slots ───────────────────────────────
const getActivityById = async (req, res) => {
  try {
    const { id } = req.params;

    const activity = await Activity.findById(id).populate('createdBy', 'username');
    if (!activity || !activity.isActive) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Get all active upcoming slots for this activity
    const today = new Date().toISOString().split('T')[0];
    const slots = await Slot.find({
      activity: id,
      isActive: true,
      date: { $gte: today },
    }).sort({ date: 1, startTime: 1 });

    res.status(200).json({ activity, slots });
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createActivity,
  updateActivity,
  deleteActivity,
  getAllActivities,
  getActivityById,
};
