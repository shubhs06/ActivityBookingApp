const Slot = require('../models/Slot');
const Activity = require('../models/Activity');

// ─── ADMIN: Create Slot ───────────────────────────────────────────────────────
const createSlot = async (req, res) => {
  try {
    const { activityId, date, startTime, endTime, capacity } = req.body;

    if (!activityId || !date || !startTime || !endTime || !capacity) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const activity = await Activity.findById(activityId);
    if (!activity || !activity.isActive) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Prevent duplicate slots for same activity+date+time
    const existingSlot = await Slot.findOne({ activity: activityId, date, startTime, isActive: true });
    if (existingSlot) {
      return res.status(400).json({ message: 'A slot already exists for this activity at this date and time' });
    }

    const slot = await Slot.create({
      activity: activityId,
      date,
      startTime,
      endTime,
      capacity,
    });

    res.status(201).json({ message: 'Slot created successfully', slot });
  } catch (error) {
    console.error('Error creating slot:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ─── ADMIN: Update Slot ───────────────────────────────────────────────────────
const updateSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, startTime, endTime, capacity } = req.body;

    const slot = await Slot.findById(id);
    if (!slot || !slot.isActive) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    // Capacity cannot be reduced below current booked count
    if (capacity && capacity < slot.bookedCount) {
      return res.status(400).json({
        message: `Capacity cannot be less than current bookings (${slot.bookedCount})`,
      });
    }

    const updated = await Slot.findByIdAndUpdate(
      id,
      { date, startTime, endTime, capacity },
      { new: true }
    );

    res.status(200).json({ message: 'Slot updated successfully', slot: updated });
  } catch (error) {
    console.error('Error updating slot:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ─── ADMIN: Delete Slot ───────────────────────────────────────────────────────
const deleteSlot = async (req, res) => {
  try {
    const { id } = req.params;

    const slot = await Slot.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    res.status(200).json({ message: 'Slot deactivated successfully' });
  } catch (error) {
    console.error('Error deleting slot:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ─── ADMIN: Get All Slots for an Activity ────────────────────────────────────
const getSlotsByActivity = async (req, res) => {
  try {
    const { activityId } = req.params;

    const slots = await Slot.find({ activity: activityId })
      .populate('activity', 'name location')
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({ slots });
  } catch (error) {
    console.error('Error fetching slots:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createSlot, updateSlot, deleteSlot, getSlotsByActivity };