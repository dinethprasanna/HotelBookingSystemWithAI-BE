import { isAuthenticated } from './middlewares/authentication-middleware';
import express from "express";
import {
  createBooking,
  getAllBookingsForHotel,
  getAllBookings,
  getAllBookingsForUser,
  getBookingById,
  deleteBookingById
} from "../application/booking";

const bookingsRouter = express.Router();

bookingsRouter.route("/")
  .post(isAuthenticated, createBooking)
  .get(isAuthenticated, getAllBookings);

bookingsRouter.route("/hotels/:hotelId")
  .get(getAllBookingsForHotel);

bookingsRouter.route("/getUserBookings/:userId")
  .get(isAuthenticated, getAllBookingsForUser);


bookingsRouter.route("/:bookingId").get(isAuthenticated, getBookingById);

bookingsRouter.route("/:id").delete(isAuthenticated, deleteBookingById);


export default bookingsRouter;