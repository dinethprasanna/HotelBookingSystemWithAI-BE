import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  roomNumber: {
    type: Number,
    required: true,
  },
  note: {
    type: String
  },
  bookedDateTime: {
    type: Date,
    default: Date.now,
  },
  booking_price: {
    type: Number,
    require: true
  },
  booking_status: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Completed'],
    default: 'Upcoming', // Optional: default to 'Upcoming' on create
  },
  paymentStatus: {
    type: String,
    enum: ["PENDING", "PAID"],
    default: "PENDING",
  },
  paymentMethod: {
    type: String,
    enum: ["CARD", "BANK_TRANSFER"],
    default: "CARD",
  }
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;