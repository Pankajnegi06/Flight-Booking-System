const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  flightId: {
    type: String,              // ✅ business flight_id (AI101)
    required: true
  },
  airline: {
    type: String,
    required: true
  },
  route: {
    type: String,
    required: true
  },
  price_paid: {
    type: Number,
    required: true
  },
  bookingTime: {
    type: Date,
    default: Date.now
  },
  pnr: {
    type: String,
    required: true,
    unique: true
  },
  ticket_url: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Booking", bookingSchema);
