const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const Activity = require('../models/Activity');
const User = require('../models/User');
const { sendBookingConfirmation, sendBookingCancellation } = require('../utils/email');

// ─── USER: Create Booking ─────────────────────────────────────────────────────
const createBooking = async (req, res) => {
  try {
    const { slotId } = req.body;

    if (!slotId) {
      return res.status(400).json({ message: 'Slot ID is required' });
    }

    const slot = await Slot.findById(slotId).populate('activity');
    if (!slot || !slot.isActive) {
      return res.status(404).json({ message: 'Slot not found or inactive' });
    }

    if (slot.bookedCount >= slot.capacity) {
      return res.status(400).json({ message: 'This slot is fully booked' });
    }

    // Prevent double booking same slot by same user
    const existingBooking = await Booking.findOne({
      user: req.user.userId,
      slot: slotId,
      status: { $ne: 'cancelled' },
    });
    if (existingBooking) {
      return res.status(400).json({ message: 'You have already booked this slot' });
    }

    const booking = await Booking.create({
      user: req.user.userId,
      slot: slotId,
      activity: slot.activity._id,
      status: 'pending',
      isPaid: false,
    });

    // Increment bookedCount on slot
    await Slot.findByIdAndUpdate(slotId, { $inc: { bookedCount: 1 } });

    res.status(201).json({
      message: 'Booking created successfully. Awaiting payment and admin confirmation.',
      booking,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ─── USER: Get My Bookings ────────────────────────────────────────────────────
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId })
      .populate('activity', 'name location imageUrl')
      .populate('slot', 'date startTime endTime')
      .sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ─── USER: Cancel My Booking ──────────────────────────────────────────────────
const cancelMyBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findOne({ _id: id, user: req.user.userId });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    booking.cancelledReason = 'Cancelled by user';
    await booking.save();

    // Decrement bookedCount on slot
    await Slot.findByIdAndUpdate(booking.slot, { $inc: { bookedCount: -1 } });

    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ─── ADMIN: Get All Bookings ──────────────────────────────────────────────────
const getAllBookings = async (req, res) => {
  try {
    const { status } = req.query; // optional filter: ?status=pending

    const filter = {};
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate('user', 'username email contactNumber')
      .populate('activity', 'name location')
      .populate('slot', 'date startTime endTime capacity bookedCount')
      .sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ─── ADMIN: Confirm Booking (paid) ───────────────────────────────────────────
const confirmBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentReference } = req.body;

    const booking = await Booking.findById(id)
      .populate('user', 'username email')
      .populate('activity', 'name')
      .populate('slot', 'date startTime endTime');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'confirmed') {
      return res.status(400).json({ message: 'Booking is already confirmed' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot confirm a cancelled booking' });
    }

    booking.status = 'confirmed';
    booking.isPaid = true;
    booking.paymentReference = paymentReference || '';
    await booking.save();

    // Send confirmation email to user
    await sendBookingConfirmation(
      booking.user.email,
      booking.user.username,
      booking.activity.name,
      booking.slot.date,
      booking.slot.startTime,
      booking.slot.endTime
    );

    res.status(200).json({ message: 'Booking confirmed and user notified', booking });
  } catch (error) {
    console.error('Error confirming booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ─── ADMIN: Cancel Booking (unpaid / timing mismatch) ────────────────────────
const adminCancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: 'Cancellation reason is required' });
    }

    const booking = await Booking.findById(id)
      .populate('user', 'username email')
      .populate('activity', 'name');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    booking.cancelledReason = reason;
    await booking.save();

    // Decrement bookedCount on slot
    await Slot.findByIdAndUpdate(booking.slot, { $inc: { bookedCount: -1 } });

    // Notify user by email
    await sendBookingCancellation(
      booking.user.email,
      booking.user.username,
      booking.activity.name,
      reason
    );

    res.status(200).json({ message: 'Booking cancelled and user notified', booking });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelMyBooking,
  getAllBookings,
  confirmBooking,
  adminCancelBooking,
};