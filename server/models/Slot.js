const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    activity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity',
      required: true,
    },
    date: {
      type: String, // "YYYY-MM-DD"
      required: true,
    },
    startTime: {
      type: String, // "10:00"
      required: true,
    },
    endTime: {
      type: String, // "11:00"
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    bookedCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Virtual: available seats
slotSchema.virtual('availableSeats').get(function () {
  return this.capacity - this.bookedCount;
});

// Virtual: is slot full
slotSchema.virtual('isFull').get(function () {
  return this.bookedCount >= this.capacity;
});

module.exports = mongoose.model('Slot', slotSchema);