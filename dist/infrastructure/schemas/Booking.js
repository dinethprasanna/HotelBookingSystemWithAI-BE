"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var bookingSchema = new mongoose_1.default.Schema({
    hotelId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
var Booking = mongoose_1.default.model("Booking", bookingSchema);
exports.default = Booking;
//# sourceMappingURL=Booking.js.map