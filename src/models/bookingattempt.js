const mongoose = require("mongoose");

const bookingAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  flightId: {
    type: String,          // ✅ STRING, NOT ObjectId
    required: true
  },
  attemptTime: {
    type: Date,
    default: Date.now
  }
});

bookingAttemptSchema.index({
  userId: 1,
  flightId: 1,
  attemptTime: 1
});

module.exports = mongoose.model("BookingAttempt", bookingAttemptSchema);
