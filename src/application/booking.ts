import { NextFunction, Request, Response } from "express";

import Booking from "../infrastructure/schemas/Booking";
import { CreateBookingDTO } from "../domain/dtos/booking";
import ValidationError from "../domain/errors/validation-error";
import { clerkClient } from "@clerk/express";
import NotFoundError from "../domain/errors/not-found-error";

export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const booking = CreateBookingDTO.safeParse(req.body);
    console.log(booking);
    // Validate the request data
    if (!booking.success) {
      throw new ValidationError(booking.error.message)
    }

    const user = req.auth;

    // Add the booking
    const newBooking = await Booking.create({
      hotelId: booking.data.hotelId,
      userId: user.userId,
      checkIn: booking.data.checkIn,
      checkOut: booking.data.checkOut,
      roomNumber: booking.data.roomNumber,
      note: booking.data.note,
      booking_price: booking.data.booking_price
    });

    // await Booking.deleteMany({});


    // Return the response
    res.status(201).json(newBooking);
    return;
  } catch (error) {
    next(error);
  }
};

export const getAllBookingsForHotel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    updateBookingStatus();
    const hotelId = req.params.hotelId;
    const bookings = await Booking.find({ hotelId: hotelId });

    const bookingsWithUser = await Promise.all(bookings.map(async (el) => {
      const user = await clerkClient.users.getUser(el.userId);
      return { _id: el._id, hotelId: el.hotelId, checkIn: el.checkIn, checkOut: el.checkOut, roomNumber: el.roomNumber, note: el.note, bookedDateTime: el.bookedDateTime, booking_price: el.booking_price, user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.primaryEmailAddress?.emailAddress } }
    }))

    res.status(200).json(bookingsWithUser);
    return;
  } catch (error) {
    next(error);
  }
};


export const getAllBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    updateBookingStatus();

    const bookings = await Booking.find().populate("hotelId");

    // Extract unique userIds
    const userIds = Array.from(new Set(bookings.map(b => b.userId.toString())));

    // Fetch all users in parallel using Clerk
    const userPromises = userIds.map(userId => clerkClient.users.getUser(userId));
    const users = await Promise.all(userPromises);

    // Map userId to user info
    const userMap = users.reduce((acc, user) => {
      acc[user.id] = {
        fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email: user.emailAddresses?.[0]?.emailAddress || "",
      };
      return acc;
    }, {} as Record<string, { fullName: string; email: string }>);

    // Attach user info to each booking
    const bookingsWithUserInfo = bookings.map(booking => {
      const user = userMap[booking.userId] || { fullName: "Unknown", email: "N/A" };
      return {
        ...booking.toObject(),
        user: user,
      };
    });

    res.status(200).json(bookingsWithUserInfo);
  } catch (error) {
    next(error);
  }
};



export const getAllBookingsForUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    updateBookingStatus();
    const userId = req.auth?.userId; // Get user ID from Clerk authentication

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const bookings = await Booking.find({ userId: userId });

    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookingId = req.params.bookingId;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new NotFoundError("Booking not found");
    }
    res.status(200).json(booking);
    return;
  } catch (error) {
    next(error);
  }
};



//Update the booking status function
export const updateBookingStatus = async () => {
  const bookings = await Booking.find(); // This returns an array
  const now = new Date();

  const updatedBookings = await Promise.all(
    bookings.map(async (booking) => {
      let newStatus: 'Upcoming' | 'Ongoing' | 'Completed';

      if (now < booking.checkIn) {
        newStatus = 'Upcoming';
      } else if (now >= booking.checkIn && now <= booking.checkOut) {
        newStatus = 'Ongoing';
      } else {
        newStatus = 'Completed';
      }

      // Update only if status changed
      if (booking.booking_status !== newStatus) {
        booking.booking_status = newStatus;
        await booking.save();
      }

      return booking;
    })
  );

  return updatedBookings;
};


export const deleteBookingById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findByIdAndDelete(bookingId);
    if (!booking) {
      throw new NotFoundError("Booking not found");
    }
    updateBookingStatus();
    res.status(200).send();
    return;
  } catch (error) {
    next(error);
  }
};