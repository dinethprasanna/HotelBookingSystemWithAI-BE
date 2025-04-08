import { z } from "zod";

export const CreateBookingDTO = z.object({
    hotelId: z.string(),
    checkIn: z.string(),
    checkOut: z.string(),
    roomNumber: z.number(),
    note: z.string().optional(),
    // bookedDateTime: z.string()
    booking_price: z.number()
})